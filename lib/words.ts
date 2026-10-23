import wordsData from "@/data/words.json";

export interface MacedonianWord {
  /** The word in lowercase Macedonian Cyrillic. */
  word: string;
  /** The word split into syllables (e.g. ["ма", "ке", "дон", "ски"]). */
  syllables: string[];
  /** Raw frequency count from the source corpus (higher = more common). */
  count: number;
}

/**
 * All words, ordered by frequency (most common first). Sourced from the
 * hermitdave FrequencyWords mk_50k list, filtered to pure Macedonian Cyrillic
 * and pre-split into syllables. Regenerate with `node scripts/build-words.mjs`.
 */
export const words: MacedonianWord[] = wordsData as MacedonianWord[];

/** Total number of words available. */
export const wordCount = words.length;

/** Returns the word at the given frequency rank (0 = most common). */
export function wordAt(index: number): MacedonianWord | undefined {
  return words[index];
}

/** Returns a random word. Optionally restrict to the top `fromTop` most common. */
export function randomWord(fromTop: number = words.length): MacedonianWord {
  const pool = Math.min(fromTop, words.length);
  const index = Math.floor(Math.random() * pool);
  return words[index];
}
