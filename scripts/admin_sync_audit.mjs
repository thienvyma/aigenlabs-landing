const baseUrl = (process.env.AUDIT_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const email = process.env.ADMIN_EMAIL || "admin@aigenlabs.local";
const password = process.env.ADMIN_PASSWORD || "admin1234";
const marker = `SYNC_AUDIT_${Date.now()}`;

function cookieFrom(response) {
  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) throw new Error("Admin login did not return a session cookie.");
  return setCookie.split(";")[0];
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed with ${response.status}: ${JSON.stringify(body)}`);
  }
  return { response, body };
}

function findHomeHero(data) {
  const home = data.pages.find((page) => page.path === "/");
  if (!home) throw new Error("Home page not found in CMS data.");
  const hero = home.sections.find((section) => section.type === "hero");
  if (!hero) throw new Error("Hero section not found in home page.");
  return hero;
}

async function waitForPublicMarker(shouldExist) {
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const response = await fetch(`${baseUrl}/`, { cache: "no-store" });
    const html = await response.text();
    const exists = html.includes(marker);
    if (exists === shouldExist) return true;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  return false;
}

let cookie = "";
let originalData = null;

try {
  const login = await requestJson("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  cookie = cookieFrom(login.response);

  const current = await requestJson("/api/admin/data", {
    headers: { cookie }
  });
  originalData = current.body.data;
  const editedData = structuredClone(originalData);
  const hero = findHomeHero(editedData);
  const originalHeadline = hero.content.headline;
  hero.content.headline = `${originalHeadline} ${marker}`;

  await requestJson("/api/admin/data", {
    method: "PUT",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify(editedData)
  });

  const markerAppeared = await waitForPublicMarker(true);
  if (!markerAppeared) {
    throw new Error("Public homepage did not reflect the admin API update before restore.");
  }

  await requestJson("/api/admin/data", {
    method: "PUT",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify(originalData)
  });

  const markerRemoved = await waitForPublicMarker(false);
  if (!markerRemoved) {
    throw new Error("Public homepage still shows the sync marker after restore.");
  }

  console.log(`PASS admin API -> CMS -> public render sync at ${baseUrl}`);
  console.log(`PASS marker appeared and was restored: ${marker}`);
} catch (error) {
  if (originalData && cookie) {
    try {
      await requestJson("/api/admin/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json", cookie },
        body: JSON.stringify(originalData)
      });
      console.error("CMS data restored after sync audit failure.");
    } catch (restoreError) {
      console.error("Failed to restore CMS data after sync audit failure:", restoreError);
    }
  }
  console.error(error);
  process.exit(1);
}
