const fs = require("fs");
const path = require("path");

const root = "/Users/Cameron/Desktop/weight-loss-surgery-australia/src/pages/surgeons";

const hospitalAddressByName = new Map([
  ["Epworth Eastern", "1 Arnold St, Box Hill VIC 3128"],
  ["Epworth Eastern Hospital", "1 Arnold St, Box Hill VIC 3128"],
  ["Knox Private", "262 Mountain Hwy, Wantirna VIC 3152"],
  ["Knox Private Hospital", "262 Mountain Hwy, Wantirna VIC 3152"],
  ["St George Private", "1 South St, Kogarah NSW 2217"],
  ["St George Private Hospital", "1 South St, Kogarah NSW 2217"],
  ["St George Public Hospital", "Gray St, Kogarah NSW 2217"],
  ["East Sydney Private", "75 Crown St, Woolloomooloo NSW 2011"],
  ["East Sydney Private Hospital", "75 Crown St, Woolloomooloo NSW 2011"],
  ["Sydney Adventist Hospital", "185 Fox Valley Rd, Wahroonga NSW 2076"],
  ["Norwest Private Hospital", "11 Norbrik Dr, Bella Vista NSW 2153"],
  ["Northern Beaches Hospital", "105 Frenchs Forest Rd W, Frenchs Forest NSW 2086"],
  ["Royal Prince Alfred Hospital", "Missenden Rd, Camperdown NSW 2050"],
  ["Chris O'Brien Lifehouse", "119-143 Missenden Rd, Camperdown NSW 2050"],
  ["Melbourne Private Hospital", "50 Flemington Rd, Parkville VIC 3052"],
  ["Cabrini Malvern", "183 Wattletree Rd, Malvern VIC 3144"],
  ["The Avenue Hospital", "40 The Avenue, Windsor VIC 3181"],
  ["Box Hill Hospital", "8 Arnold St, Box Hill VIC 3128"],
]);

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

function extractEnhancedWithBounds(text) {
  const marker = "const enhanced = ";
  const idx = text.indexOf(marker);
  if (idx === -1) return null;
  const startObj = text.indexOf("{", idx);
  if (startObj === -1) return null;
  let depth = 0;
  for (let i = startObj; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    if (depth === 0) {
      const raw = text.slice(startObj, i + 1);
      try {
        const parsed = JSON.parse(raw);
        return { parsed, raw, start: startObj, end: i + 1 };
      } catch (e) {
        return { parsed: null, raw, start: startObj, end: i + 1 };
      }
    }
  }
  return null;
}

function isStreetAddress(a) {
  if (!a || typeof a !== "string") return false;
  return /\d+\s+/.test(a) && /\b(NSW|VIC|QLD|WA|SA|TAS|ACT|NT)\b/.test(a);
}

const files = walk(root).filter((f) => {
  if (f.endsWith("/index.astro") || f.endsWith("index.astro")) return false;
  const rel = path.relative(root, f);
  if (!rel.includes(path.sep)) return false; // exclude listing pages like sydney.astro
  return true;
});

let updatedCount = 0;
let hospitalUpdated = 0;

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const info = extractEnhancedWithBounds(text);
  if (!info || !info.parsed) continue;
  const enhanced = info.parsed;
  if (!Array.isArray(enhanced.hospitals) || enhanced.hospitals.length === 0) continue;

  let changed = false;
  for (const h of enhanced.hospitals) {
    if (!h || !h.name) continue;
    const current = h.address;
    if (isStreetAddress(current)) continue;
    const exact = hospitalAddressByName.get(h.name);
    if (exact) {
      h.address = exact;
      changed = true;
      hospitalUpdated++;
      continue;
    }
    // Try loose match by trimming suffix like "Hospital"
    const key = h.name.replace(/\s+Hospital$/i, "");
    for (const [hn, addr] of hospitalAddressByName.entries()) {
      if (hn.replace(/\s+Hospital$/i, "") === key) {
        h.address = addr;
        changed = true;
        hospitalUpdated++;
        break;
      }
    }
  }

  if (changed) {
    const pretty = JSON.stringify(enhanced, null, 2);
    const newText = text.slice(0, info.start) + pretty + text.slice(info.end);
    fs.writeFileSync(file, newText, "utf8");
    updatedCount++;
  }
}

console.log(JSON.stringify({ filesProcessed: files.length, filesUpdated: updatedCount, hospitalsUpdated: hospitalUpdated }, null, 2));


