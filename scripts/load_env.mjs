import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function parseEnvValue(value) {
  const trimmed = value.trim();
  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/\\n/g, "\n").replace(/\\"/g, '"');
  }
  if (trimmed.length >= 2 && trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1);
  }
  return trimmed.replace(/\s+#.*$/, "");
}

function readEnvFile(filePath) {
  const values = {};
  if (!existsSync(filePath)) return values;

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    values[match[1]] = parseEnvValue(match[2] ?? "");
  }
  return values;
}

export function loadLocalEnv(root = process.cwd()) {
  const originalKeys = new Set(Object.keys(process.env));
  const nodeEnv = process.env.NODE_ENV || "development";
  const files = [
    ".env",
    `.env.${nodeEnv}`,
    ".env.local",
    `.env.${nodeEnv}.local`
  ];
  const loaded = {};

  for (const file of files) {
    Object.assign(loaded, readEnvFile(path.join(root, file)));
  }

  for (const [key, value] of Object.entries(loaded)) {
    if (!originalKeys.has(key)) {
      process.env[key] = value;
    }
  }
}
