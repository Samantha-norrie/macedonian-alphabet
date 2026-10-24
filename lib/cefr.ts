/**
 * CEFR learning-path content types.
 *
 * Content is static and bundled as JSON (data/cefr/*.json), not stored in the
 * database. IDs are hierarchical slugs that also serve as progress keys:
 *   "a1" > "a1.ch1" > "a1.ch1.u1" > "a1.ch1.u1.l1" > "a1.ch1.u1.l1.q3"
 * Order within a parent is the array order of its children.
 */

export type QuestionType = "vocab" | "listening" | "translate" | "fill-blank";

interface BaseQuestion {
  /** Hierarchical slug, e.g. "a1.ch1.u1.l1.q3". */
  id: string;
  type: QuestionType;
  /** Path to an audio asset, when the question has one. */
  audio?: string;
}

/** Show a Macedonian word; pick its meaning/transliteration. */
export interface VocabQuestion extends BaseQuestion {
  type: "vocab";
  cyrillic: string;
  options: string[];
  answer: string;
}

/** Play audio; pick what was heard. */
export interface ListeningQuestion extends BaseQuestion {
  type: "listening";
  audio: string;
  options: string[];
  answer: string;
}

/** Translate a phrase in the given direction. */
export interface TranslateQuestion extends BaseQuestion {
  type: "translate";
  source: string;
  direction: "mk-en" | "en-mk";
  /** Accepted answers (case/whitespace normalized by the app). */
  accepted: string[];
}

/** Fill the blank (marked "___"); options optional, else free text. */
export interface FillBlankQuestion extends BaseQuestion {
  type: "fill-blank";
  sentence: string;
  options?: string[];
  answer: string;
}

export type Question =
  | VocabQuestion
  | ListeningQuestion
  | TranslateQuestion
  | FillBlankQuestion;

export interface Lesson {
  id: string;
  title: string;
  questions: Question[];
}

export interface Unit {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  units: Unit[];
}

export interface CefrLevel {
  /** CEFR code, e.g. "a1". */
  id: string;
  name: string;
  description?: string;
  chapters: Chapter[];
}

/** All lesson ids under a unit. */
export function lessonIds(unit: Unit): string[] {
  return unit.lessons.map((l) => l.id);
}

/** A unit is complete when every one of its lessons is in `doneLessons`. */
export function isUnitComplete(unit: Unit, doneLessons: Set<string>): boolean {
  return unit.lessons.every((l) => doneLessons.has(l.id));
}

/** A chapter is complete when all of its units are complete. */
export function isChapterComplete(
  chapter: Chapter,
  doneLessons: Set<string>,
): boolean {
  return chapter.units.every((u) => isUnitComplete(u, doneLessons));
}
