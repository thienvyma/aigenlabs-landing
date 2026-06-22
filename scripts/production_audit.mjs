import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const cms = JSON.parse(readFileSync(path.join(root, "data", "cms.json"), "utf8"));
const requiredCmsPaths = ["/"];
const requiredRuntimePaths = ["/", "/policy", "/blog"];
const requiredSectionTypes = new Set(["hero", "useCaseTabs", "platformFeatures", "releaseNotes", "securityCards", "conversionCards", "faq", "floatingDock"]);
const bannedPattern = /\b(mock|placeholder|lorem|todo|Raw JSON|raw-json|MediaMockup)\b/i;
const checks = [];

function pass(name, detail = "") {
  checks.push({ ok: true, name, detail });
}

function fail(name, detail) {
  checks.push({ ok: false, name, detail });
}

function assert(name, condition, detail) {
  if (condition) pass(name, detail);
  else fail(name, detail);
}

function getPage(publicPath) {
  return cms.pages.find((page) => page.path === publicPath);
}

function walkFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

function nonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasEditableMedia(media) {
  return media && ["image", "video"].includes(media.kind) && typeof media.title === "string" && typeof media.label === "string" && typeof media.url === "string" && typeof media.alt === "string";
}

function hasEditableFloatingContacts(content) {
  return content &&
    typeof content.showBackToTop === "boolean" &&
    Array.isArray(content.contacts) &&
    content.contacts.length > 0 &&
    content.contacts.every((contact) => nonEmpty(contact.label) && nonEmpty(contact.href) && nonEmpty(contact.icon));
}

function auditCmsShape() {
  assert("Landing project folder", packageJson.name === "aigenlabs-landing" && statSync(path.join(root, "src")).isDirectory(), root);
  assert("Required CMS pages exist", requiredCmsPaths.every((publicPath) => getPage(publicPath)), requiredCmsPaths.join(", "));
  assert("Only homepage exists in the current launch scope", cms.pages.length === 1 && cms.pages[0]?.path === "/" && cms.pages[0]?.status === "published", "No temporary supporting pages should exist in the CMS seed.");
  assert("Vietnamese is default locale", cms.settings.defaultLocale === "vi", cms.settings.defaultLocale);
  assert("Home-first locale scope", JSON.stringify((cms.settings.supportedLocales || []).map((locale) => locale.code).sort()) === JSON.stringify(["vi"]), "settings.supportedLocales");
  assert("Blog posts collection exists", Array.isArray(cms.blogPosts), "Blog posts live in the CMS root document.");

  for (const page of cms.pages) {
    assert(`SEO title: ${page.path}`, nonEmpty(page.seo?.title), page.seo?.title || "");
    assert(`SEO description: ${page.path}`, nonEmpty(page.seo?.description), page.seo?.description || "");
    assert(`SEO canonical: ${page.path}`, page.seo?.canonicalPath === page.path, `${page.seo?.canonicalPath || ""} === ${page.path}`);
    assert(`SEO social fields: ${page.path}`, nonEmpty(page.seo?.ogTitle) && nonEmpty(page.seo?.ogDescription) && nonEmpty(page.seo?.twitterCard), "Open Graph and Twitter fields present.");
    assert(`SEO robots fields: ${page.path}`, typeof page.seo?.robotsIndex === "boolean" && typeof page.seo?.robotsFollow === "boolean", "Robots fields are booleans.");
    assert(`SEO schema toggles: ${page.path}`, !!page.seo?.schemas && Object.values(page.seo.schemas).every((value) => typeof value === "boolean"), "Schema toggles are booleans.");
    assert(`Renderable sections: ${page.path}`, page.sections.every((section) => requiredSectionTypes.has(section.type)), page.sections.map((section) => section.type).join(", "));
  }

  const blogSlugs = new Set();
  for (const post of cms.blogPosts || []) {
    assert(`Blog slug: ${post.slug}`, nonEmpty(post.slug) && !blogSlugs.has(post.slug), post.slug);
    blogSlugs.add(post.slug);
    assert(`Blog SEO: ${post.slug}`, nonEmpty(post.seo?.title) && nonEmpty(post.seo?.description) && post.seo?.canonicalPath === `/blog/${post.slug}`, "Title, description, and canonical path are required.");
    assert(`Blog status: ${post.slug}`, ["draft", "published", "archived"].includes(post.status), post.status);
    assert(`Blog body: ${post.slug}`, nonEmpty(post.body), "Posts need body content before publishing.");
  }
}

function auditAdminCoverage() {
  const home = getPage("/");
  const sections = home?.sections || [];
  const sectionTypes = new Set(sections.map((section) => section.type));
  for (const type of ["hero", "useCaseTabs", "platformFeatures", "releaseNotes", "securityCards", "faq", "floatingDock"]) {
    assert(`Homepage section exists: ${type}`, sectionTypes.has(type), "Matches the Accio-inspired homepage structure.");
  }

  for (const page of cms.pages) {
    for (const section of page.sections) {
      const content = section.content || {};
      if (section.type === "hero") assert("Hero media editable", hasEditableMedia(content.preview), section.id);
      if (section.type === "useCaseTabs") assert("Use-case tab media editable", (content.tabs || []).every((tab) => hasEditableMedia(tab.media)), section.id);
      if (section.type === "platformFeatures") assert("Platform feature media editable", (content.features || []).every((feature) => hasEditableMedia(feature.media)), section.id);
      if (section.type === "conversionCards" && content.variant === "pricing") {
        assert("Pricing cards expose CMS price field", (content.cards || []).every((card) => nonEmpty(card.price)), section.id);
        assert("Pricing seed avoids fixed VND amounts", (content.cards || []).every((card) => !/\b\d[\d.\s]*VND\b/i.test(card.price || card.badge || "")), section.id);
      }
      if (section.type === "floatingDock") assert("Floating dock contacts editable", hasEditableFloatingContacts(content) && !("supportHref" in content) && !("supportLabel" in content), section.id);
    }
  }

  const nav = cms.settings.navigation;
  assert("Navigation editable data", Array.isArray(nav.items) && nav.items.length > 0 && nav.items.every((item) => nonEmpty(item.label) && nonEmpty(item.href)), "Header nav comes from CMS.");
  assert("Header CTAs editable data", [nav.secondaryCta, nav.signIn, nav.primaryCta].every((cta) => nonEmpty(cta.label) && nonEmpty(cta.href)), "Header CTAs come from CMS.");
  assert("Footer editable data", cms.settings.footer.columns.every((column) => nonEmpty(column.title) && column.links.every((link) => nonEmpty(link.label) && nonEmpty(link.href))), "Footer comes from CMS.");
  assert("Blog navigation link", JSON.stringify(cms.settings.navigation).includes("/blog"), "Header nav should expose the blog index.");
  assert("Brand tokens present", Object.keys(cms.settings.brand.tokens.color).length >= 16 && Object.keys(cms.settings.brand.tokens.layout).length >= 6 && Object.keys(cms.settings.brand.tokens.radius).length >= 6, "Color, layout, and radius token groups exist.");
  assert("Uploaded asset alt text", cms.assets.every((asset) => nonEmpty(asset.alt)), "Every uploaded asset needs alt text.");
}

function auditAdminSelectorUx() {
  const source = readFileSync(path.join(root, "src/components/admin/AdminStudio.tsx"), "utf8");
  const requiredHelpers = ["ChoiceTextInput", "LinkInput", "WebsiteUrlInput", "AssetUrlInput", "CssTokenInput", "DateInput", "IsoDateInput"];
  for (const helper of requiredHelpers) {
    assert(`Admin selector helper: ${helper}`, source.includes(`function ${helper}`), "High-risk syntax fields should render as guided controls.");
  }

  assert("Admin links derive from CMS pages and sections", source.includes("for (const page of data.pages)") && source.includes("sortByOrder(page.sections)") && source.includes("linkOptions"), "Link dropdowns must stay connected to page and section data.");
  assert("Admin blog manager", source.includes('"Blog"') && source.includes("function renderBlogTab") && source.includes("deleteBlogPost") && source.includes("createBlogPostTemplate"), "Admin should manage blog publish/delete/edit flow.");
  assert("Admin assets derive from upload library", source.includes("mediaAssetOptions") && source.includes("imageAssetOptions") && source.includes('asset.kind === "image" || asset.kind === "video"') && source.includes('asset.kind === "image"'), "Media selectors must use uploaded assets with renderable filters.");
  assert("Admin media poster uses image-only options", source.includes("posterOptions={imageAssetOptions}"), "Poster/logo/social image fields should not suggest documents.");
  assert("Public media fallback renderer", readFileSync(path.join(root, "src/components/landing/CmsMediaFrame.tsx"), "utf8").includes("MediaPreview"), "Public landing should show a designed fallback when CMS media URLs are empty.");
  assert("No CMS preview media kind", JSON.stringify(cms).includes('"kind":"preview"') === false && JSON.stringify(cms).includes('"kind": "preview"') === false, "Media slots should use image/video and wait for uploaded URLs.");

  const manualSyntaxInputs = [
    'TextInput label="Button link"',
    'TextInput label="View all link"',
    'TextInput label="Canonical path"',
    'TextInput label="Website URL"',
    'TextInput label="Logo image"',
    'TextInput label="Favicon image"',
    'TextInput label="Social image"',
    'TextInput label="Icon"',
    'TextInput label="Date"'
  ].filter((needle) => source.includes(needle));
  assert("No manual syntax inputs for guided fields", manualSyntaxInputs.length === 0, manualSyntaxInputs.join(", "));
}

function auditBannedWords() {
  const targets = ["src", "data", "README.md"];
  const offenders = [];
  for (const target of targets) {
    const full = path.join(root, target);
    const files = statSync(full).isDirectory() ? walkFiles(full) : [full];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      if (bannedPattern.test(text)) offenders.push(path.relative(root, file));
    }
  }
  assert("No unfinished wording in source/CMS/readme", offenders.length === 0, offenders.join(", "));
}

function auditDynamicRenderingConfig() {
  const files = ["src/app/layout.tsx", "src/app/page.tsx", "src/app/policy/page.tsx", "src/app/blog/page.tsx", "src/app/blog/[slug]/page.tsx", "src/app/sitemap.ts", "src/app/robots.ts"];
  for (const file of files) {
    const source = readFileSync(path.join(root, file), "utf8");
    assert(`Dynamic CMS route: ${file}`, source.includes('dynamic = "force-dynamic"') && source.includes("revalidate = 0"), "CMS-backed routes must not be stale SSG output.");
  }
}

function auditSupabaseReadiness() {
  const migrationFiles = walkFiles(path.join(root, "supabase", "migrations"));
  const migrationText = migrationFiles.map((file) => readFileSync(file, "utf8")).join("\n");
  const cmsSource = readFileSync(path.join(root, "src", "lib", "cms.ts"), "utf8");
  const uploadSource = readFileSync(path.join(root, "src", "app", "api", "admin", "upload", "route.ts"), "utf8");

  assert("Supabase runtime dependency", typeof packageJson.dependencies?.["@supabase/supabase-js"] === "string", "@supabase/supabase-js is required for the production CMS adapter.");
  assert("Supabase CLI dev dependency", typeof packageJson.devDependencies?.supabase === "string", "Supabase CLI should be available through npm scripts.");
  assert("Supabase CMS migration", migrationText.includes("landing_cms_documents") && migrationText.includes("enable row level security"), "CMS table migration must exist and enable RLS.");
  assert("Supabase asset bucket migration", migrationText.includes("landing-assets") && migrationText.includes("storage.buckets"), "Asset bucket migration must exist.");
  assert("CMS storage driver adapter", cmsSource.includes("CMS_STORAGE_DRIVER") && cmsSource.includes("SUPABASE_SECRET_KEY"), "CMS adapter must support explicit Supabase production storage.");
  assert("Upload route uses storage adapter", uploadSource.includes("storeAssetFile") && !uploadSource.includes("public\", \"uploads\""), "Uploads must route through storage adapter.");
}

async function auditRuntime() {
  const baseUrl = process.env.AUDIT_BASE_URL;
  if (!baseUrl) {
    pass("Runtime route audit skipped", "Set AUDIT_BASE_URL=http://127.0.0.1:3000 to include live HTTP checks.");
    return;
  }

  for (const publicPath of [...requiredRuntimePaths, "/admin/login", "/robots.txt", "/sitemap.xml"]) {
    const response = await fetch(`${baseUrl}${publicPath}`);
    assert(`HTTP 200: ${publicPath}`, response.status === 200, String(response.status));
    const body = await response.text();
    if (!["/robots.txt", "/sitemap.xml", "/admin/login"].includes(publicPath)) {
      assert(`No unfinished wording in HTML: ${publicPath}`, !bannedPattern.test(body), publicPath);
      assert(`Metadata in HTML: ${publicPath}`, /<title>[^<]+<\/title>/.test(body) && /<meta name="description"/.test(body) && /rel="canonical"/.test(body), publicPath);
    }
  }
}

auditCmsShape();
auditAdminCoverage();
auditAdminSelectorUx();
auditBannedWords();
auditDynamicRenderingConfig();
auditSupabaseReadiness();
await auditRuntime();

const failed = checks.filter((check) => !check.ok);
for (const check of checks) {
  const prefix = check.ok ? "PASS" : "FAIL";
  console.log(`${prefix} ${check.name}${check.detail ? ` - ${check.detail}` : ""}`);
}

if (failed.length) {
  console.error(`\nProduction audit failed: ${failed.length} issue(s).`);
  process.exit(1);
}

console.log(`\nProduction audit passed: ${checks.length} checks.`);
