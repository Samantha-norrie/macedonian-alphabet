import { transliterate } from "./transliterate";

export interface Character {
  /** The letter in Macedonian Cyrillic. */
  cyrillic: string;
  /** Phonetic Latin equivalent. */
  latin: string;
  /** Text to speak so TTS voices the letter's sound, not its name. */
  say: string;
}

const VOWELS = new Set("аеиоу".split(""));

// A lone consonant makes TTS read the letter's name (or spell it); pairing it
// with "а" forces the actual sound (б → "ба"). Vowels are spoken as-is.
function pronounce(cyrillic: string): string {
  return VOWELS.has(cyrillic) ? cyrillic : cyrillic + "а";
}

// Full Macedonian Cyrillic alphabet, in order.
const ALPHABET =
  "абвгдѓежзѕијклљмнњопрстќуфхцчџш".split("");

// Cyrillic letters whose glyph is (near-)identical to a Latin letter. A learner
// can already read these, so they're excluded from the character deck.
const LATIN_LOOKALIKE = new Set("авејкмнорстух".split(""));

/** Letters unique to the Cyrillic script — the ones worth drilling. */
export const characters: Character[] = ALPHABET.filter(
  (c) => !LATIN_LOOKALIKE.has(c),
).map((cyrillic) => ({
  cyrillic,
  latin: transliterate(cyrillic),
  say: pronounce(cyrillic),
}));

/** Returns a random character from the deck. */
export function randomCharacter(): Character {
  return characters[Math.floor(Math.random() * characters.length)];
}

/**
 * Build a shuffled set of Latin answer options for `card`: the correct Latin
 * plus `count - 1` distinct wrong Latin letters. Exactly one option matches.
 */
export function characterOptions(
  card: Pick<Character, "latin">,
  count: number = 4,
): string[] {
  const options = new Set<string>([card.latin]);
  let guard = 0;
  while (options.size < count && guard++ < 1000) {
    options.add(randomCharacter().latin);
  }
  return [...options].sort(() => Math.random() - 0.5);
}
