// Phonetic romanization of the Macedonian Cyrillic alphabet. Uses readable
// digraphs (zh, sh, ch, ...) rather than diacritics so learners can sound out
// a syllable from its Latin form.
const LATIN: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  ѓ: "gj",
  е: "e",
  ж: "zh",
  з: "z",
  ѕ: "dz",
  и: "i",
  ј: "j",
  к: "k",
  л: "l",
  љ: "lj",
  м: "m",
  н: "n",
  њ: "nj",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  ќ: "kj",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  џ: "dzh",
  ш: "sh",
};

/** Transliterates a lowercase Macedonian Cyrillic string to phonetic Latin. */
export function transliterate(text: string): string {
  let out = "";
  for (const char of text) {
    out += LATIN[char] ?? char;
  }
  return out;
}
