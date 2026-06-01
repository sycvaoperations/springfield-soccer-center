// build-programs.mjs
// Reads all JSON files from content/programs/ and writes content/programs.json
// Run with: node scripts/build-programs.mjs
// Also triggered automatically by GitHub Actions on every push.

import { readdir, readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const inputDir = join(root, "content", "programs");
const outputFile = join(root, "content", "programs.json");

const files = (await readdir(inputDir))
  .filter((f) => f.endsWith(".json"))
  .sort();

const programs = await Promise.all(
  files.map(async (f) => {
    const raw = await readFile(join(inputDir, f), "utf8");
    return JSON.parse(raw);
  })
);

// Sort by order field so the live site reads them in the right sequence
programs.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

await writeFile(outputFile, JSON.stringify({ programs }, null, 2));
console.log(`✓ Built content/programs.json from ${programs.length} files`);
