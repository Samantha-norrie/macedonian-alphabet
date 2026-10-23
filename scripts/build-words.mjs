// Processes the raw hermitdave mk_50k frequency list into a clean, app-ready
// dataset. Filters to pure Macedonian Cyrillic words, splits each into
// syllables with hyphen/mk, and writes data/words.json.
//
// Run: node scripts/build-words.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import mk from "hyphen/mk/index.js";
const { hyphenateSync } = mk;

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const SRC = resolve(root, ".context/mk_50k.txt");
const OUT = resolve(root, "data/words.json");

// How many clean words to keep (top N by frequency).
const LIMIT = 5000;
// Soft-hyphen placeholder used only to re-split the result.
const SEP = "­";

// The 31 lowercase Macedonian Cyrillic letters.
const MK_LETTERS = "абвгдѓежзѕијклљмнњопрстќуфхцчџш";
const isMacedonian = new RegExp(`^[${MK_LETTERS}]+$`);

const lines = readFileSync(SRC, "utf8").split("\n");

const words = [];
const seen = new Set();

for (const line of lines) {
  const [word, countRaw] = line.trim().split(/\s+/);
  if (!word) continue;

  const lower = word.toLowerCase();
  if (lower.length < 2) continue; // skip single letters / particles noise
  if (!isMacedonian.test(lower)) continue; // drop latin, digits, punctuation
  if (seen.has(lower)) continue;
  seen.add(lower);

  const syllables = hyphenateSync(lower, { hyphenChar: SEP }).split(SEP);

  words.push({
    word: lower,
    syllables,
    count: Number(countRaw) || 0,
  });

  if (words.length >= LIMIT) break;
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(words, null, 0) + "\n", "utf8");

const multi = words.filter((w) => w.syllables.length > 1).length;
console.log(`Wrote ${words.length} words to ${OUT}`);
console.log(`  ${multi} have >1 syllable, ${words.length - multi} single-syllable`);
console.log("  sample:", words.slice(0, 5).map((w) => w.syllables.join("·")).join("  "));
