import { words } from "./words";
import { transliterate } from "./transliterate";

export interface Syllable {
  /** The syllable in Macedonian Cyrillic. */
  cyrillic: string;
  /** Phonetic Latin equivalent. */
  latin: string;
}

/**
 * Unique syllables drawn from the whole word list, deduplicated and ordered by
 * how many words they appear in (most common first).
 */
export const syllables: Syllable[] = (() => {
  const counts = new Map<string, number>();
  for (const { syllables } of words) {
    for (const s of syllables) {
      counts.set(s, (counts.get(s) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([cyrillic]) => ({ cyrillic, latin: transliterate(cyrillic) }));
})();

/** Returns a random syllable. Optionally restrict to the top `fromTop` most common. */
export function randomSyllable(fromTop: number = syllables.length): Syllable {
  const pool = Math.min(fromTop, syllables.length);
  return syllables[Math.floor(Math.random() * pool)];
}

/**
 * Build a shuffled set of Latin answer options for `card`: the correct Latin
 * plus `count - 1` distinct wrong Latin syllables. Exactly one option matches.
 */
export function latinOptions(card: Syllable, count: number = 4): string[] {
  const options = new Set<string>([card.latin]);
  // Draw distractors with distinct Latin spellings until we have enough.
  let guard = 0;
  while (options.size < count && guard++ < 1000) {
    options.add(randomSyllable().latin);
  }
  return [...options].sort(() => Math.random() - 0.5);
}
