import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import { loadLocalEnv } from "./load_env.mjs";

loadLocalEnv();

const command = process.argv[2] || "status";
const documentId = process.env.CMS_DOCUMENT_ID?.trim() || "default";
const supabaseBin = path.join(process.cwd(), "node_modules", ".bin", "supabase");
const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseServerKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_SECRET_KEY?.trim();
const cmsTableName = "landing_cms_documents";

let supabaseAdminClient = null;

function hasSupabaseRestConfig() {
  return Boolean(supabaseUrl && supabaseServerKey);
}

function getSupabaseAdminClient() {
  if (!hasSupabaseRestConfig()) return null;
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(supabaseUrl, supabaseServerKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return supabaseAdminClient;
}

function runSupabase(args) {
  const result = spawnSync(supabaseBin, args, {
    cwd: process.cwd(),
    env: process.env,
    encoding: "utf8"
  });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status || 1);
  }
  return result.stdout.trim();
}

function requireDbPassword() {
  if (!process.env.SUPABASE_DB_PASSWORD) {
    throw new Error("SUPABASE_DB_PASSWORD is required for linked Supabase DB queries.");
  }
}

function queryJson(sql) {
  requireDbPassword();
  const stdout = runSupabase(["db", "query", "--linked", "--output", "json", sql]);
  return JSON.parse(stdout);
}

function writeSqlAndRun(sql) {
  requireDbPassword();
  const file = path.join(tmpdir(), `aigenlabs-cms-${Date.now()}.sql`);
  writeFileSync(file, sql, "utf8");
  try {
    runSupabase(["db", "query", "--linked", "--file", file, "--output", "json"]);
  } finally {
    rmSync(file, { force: true });
  }
}

function dollarQuoteJson(json) {
  const tags = ["$cms_json$", "$aigenlabs_cms_json$", "$landing_cms_json$"];
  const tag = tags.find((candidate) => !json.includes(candidate));
  if (!tag) throw new Error("Unable to find a safe SQL dollar quote delimiter for CMS JSON.");
  return `${tag}${json}${tag}`;
}

async function printStatusRest() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from(cmsTableName)
    .select("id, version, updated_at, data")
    .eq("id", documentId)
    .maybeSingle();

  if (error) throw new Error(`Failed to read Supabase CMS document: ${error.message}`);
  if (!data) {
    console.log(`No Supabase CMS document found for id "${documentId}".`);
    return true;
  }

  const pages = Array.isArray(data.data?.pages) ? data.data.pages : [];
  const assets = Array.isArray(data.data?.assets) ? data.data.assets : [];

  console.log(`CMS document: ${data.id}`);
  console.log(`Version: ${data.version}`);
  console.log(`Updated: ${data.updated_at}`);
  console.log(`Pages: ${pages.length}`);
  console.log(`Assets: ${assets.length}`);
  console.log(`Default locale: ${data.data?.settings?.defaultLocale ?? ""}`);

  for (const page of [...pages].sort((a, b) => String(a.path).localeCompare(String(b.path)))) {
    console.log(`- ${page.path} [${page.locale}] ${page.status}`);
  }
  return true;
}

function printStatusSql() {
  const escapedId = documentId.replace(/'/g, "''");
  const result = queryJson(`
    select
      id,
      version,
      updated_at,
      jsonb_array_length(data->'pages') as page_count,
      jsonb_array_length(data->'assets') as asset_count,
      data->'settings'->>'defaultLocale' as default_locale
    from public.landing_cms_documents
    where id = '${escapedId}';
  `);
  const row = result.rows?.[0];
  if (!row) {
    console.log(`No Supabase CMS document found for id "${documentId}".`);
    return;
  }
  console.log(`CMS document: ${row.id}`);
  console.log(`Version: ${row.version}`);
  console.log(`Updated: ${row.updated_at}`);
  console.log(`Pages: ${row.page_count}`);
  console.log(`Assets: ${row.asset_count}`);
  console.log(`Default locale: ${row.default_locale}`);

  const paths = queryJson(`
    select p->>'path' as path, p->>'status' as status, p->>'locale' as locale
    from public.landing_cms_documents d, jsonb_array_elements(d.data->'pages') p
    where d.id = '${escapedId}'
    order by path;
  `);
  for (const pathRow of paths.rows ?? []) {
    console.log(`- ${pathRow.path} [${pathRow.locale}] ${pathRow.status}`);
  }
}

async function pushLocalDocumentRest() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return false;

  const cmsJson = readFileSync(path.join(process.cwd(), "data", "cms.json"), "utf8");
  const parsed = JSON.parse(cmsJson);
  if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.pages)) {
    throw new Error("data/cms.json is not a valid CMS document.");
  }

  const { error } = await supabase
    .from(cmsTableName)
    .upsert({ id: documentId, data: parsed }, { onConflict: "id" });

  if (error) throw new Error(`Failed to push CMS document to Supabase: ${error.message}`);
  console.log(`Pushed data/cms.json to Supabase CMS document "${documentId}".`);
  return true;
}

function pushLocalDocumentSql() {
  const cmsJson = readFileSync(path.join(process.cwd(), "data", "cms.json"), "utf8");
  const parsed = JSON.parse(cmsJson);
  if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.pages)) {
    throw new Error("data/cms.json is not a valid CMS document.");
  }
  const escapedId = documentId.replace(/'/g, "''");
  const sql = `
    insert into public.landing_cms_documents (id, data)
    values ('${escapedId}', ${dollarQuoteJson(cmsJson)}::jsonb)
    on conflict (id) do update set data = excluded.data;
  `;
  writeSqlAndRun(sql);
  console.log(`Pushed data/cms.json to Supabase CMS document "${documentId}".`);
}

try {
  if (command === "status") {
    if (!(await printStatusRest())) printStatusSql();
  } else if (command === "push-local") {
    if (!(await pushLocalDocumentRest())) pushLocalDocumentSql();
  }
  else {
    console.error("Usage: node scripts/supabase_cms.mjs [status|push-local]");
    process.exit(2);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
