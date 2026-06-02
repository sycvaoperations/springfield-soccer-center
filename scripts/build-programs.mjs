// Bundles the per-program files in content/programs/*.json back into a single
// content/programs.json that the live website reads. Run automatically by the
// GitHub Action whenever an admin saves a program in Pages CMS.
//
// Run locally with:  node scripts/build-programs.mjs
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DIR = "content/programs";
const OUT = "content/programs.json";

const files = (await readdir(DIR)).filter((f) => f.endsWith(".json"));
const programs = [];

for (const f of files) {
  const raw = await readFile(path.join(DIR, f), "utf8");
  const data = JSON.parse(raw);
  // The filename is the source of truth for the id.
  if (!data.id) data.id = f.replace(/\.json$/, "");
  programs.push(data);
}

programs.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

await writeFile(OUT, JSON.stringify({ programs }, null, 2) + "\n");
console.log(`Bundled ${programs.length} programs → ${OUT}`);
