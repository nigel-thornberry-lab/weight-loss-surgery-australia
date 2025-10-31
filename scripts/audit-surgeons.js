const fs = require("fs");
const path = require("path");

const root = "/Users/Cameron/Desktop/weight-loss-surgery-australia/src/pages/surgeons";

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".astro")) out.push(full);
  }
  return out;
}

function extractEnhanced(text) {
  const idx = text.indexOf("const enhanced = ");
  if (idx === -1) return null;
  const start = text.indexOf("{", idx);
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    if (depth === 0) {
      const raw = text.slice(start, i + 1);
      try {
        return JSON.parse(raw);
      } catch (e) {
        return { __raw: raw };
      }
    }
  }
  return null;
}

const files = walk(root).filter(
  (f) => !f.endsWith("/index.astro") && !f.endsWith("index.astro")
);

const rows = [];
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const enhanced = extractEnhanced(text);

  let credOk = false;
  let hospOk = false;
  let hospAddrOk = false;
  const photo = /surgeon_photo\s*:\s*["'][^"']+["']/.test(text);
  const place = /place_id\s*:\s*["'][A-Za-z0-9_-]+["']/.test(text);

  if (enhanced && typeof enhanced === "object" && !enhanced.__raw) {
    credOk = !!(
      enhanced.credentials &&
      (enhanced.credentials.degrees || enhanced.credentials.fellowships)
    );
    hospOk = Array.isArray(enhanced.hospitals) && enhanced.hospitals.length > 0;
    hospAddrOk = hospOk && enhanced.hospitals.every((h) => h.address);
  } else {
    credOk = /"credentials"\s*:\s*\{/.test(text);
    hospOk = /"hospitals"\s*:\s*\[/.test(text);
  }

  rows.push({
    file: path.relative(root, file),
    credOk,
    hospOk,
    hospAddrOk,
    photo,
    place,
  });
}

const summary = {
  total: rows.length,
  missingCred: rows.filter((r) => !r.credOk).length,
  missingHosp: rows.filter((r) => !r.hospOk).length,
  missingHospAddr: rows.filter((r) => r.hospOk && !r.hospAddrOk).length,
  missingPhoto: rows.filter((r) => !r.photo).length,
  missingPlace: rows.filter((r) => !r.place).length,
};

fs.writeFileSync(
  "/Users/Cameron/Desktop/weight-loss-surgery-australia/surgeon-profile-audit-v2.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), summary, rows }, null, 2)
);

console.log(JSON.stringify(summary, null, 2));


