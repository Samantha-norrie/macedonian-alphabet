"use client";

import { useEffect, useState } from "react";
import { latinOptions, randomSyllable, type Syllable } from "@/lib/syllables";
import { playCorrect, playWrong, speak } from "@/lib/sounds";
import styles from "./Flashcard.module.css";

// How long the Latin back shows after flipping, before the next card.
const BACK_MS = 3000;

type Result = "correct" | "wrong";

export default function Flashcard() {
  const [card, setCard] = useState<Syllable | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [flipped, setFlipped] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  // Pick the first card on the client (avoids a server/client random mismatch).
  useEffect(() => {
    const first = randomSyllable();
    setCard(first);
    setOptions(latinOptions(first));
  }, []);

  // Once flipped, hold the Latin side, then advance to a fresh card.
  useEffect(() => {
    if (!flipped) return;

    const nextTimer = setTimeout(() => {
      const next = randomSyllable();
      setCard(next);
      setOptions(latinOptions(next));
      setFlipped(false);
      setPicked(null);
      setResult(null);
    }, BACK_MS);

    return () => clearTimeout(nextTimer);
  }, [flipped]);

  function choose(latin: string) {
    if (flipped || !card) return; // ignore clicks once answered
    const correct = latin === card.latin;
    setPicked(latin);
    setResult(correct ? "correct" : "wrong");
    setFlipped(true);
    if (correct) playCorrect();
    else playWrong();
    // Always pronounce the correct syllable, after the feedback sound lands.
    speak(card.cyrillic, 450);
  }

  if (!card) return null;

  const flashClass =
    result === "correct"
      ? styles.flashCorrect
      : result === "wrong"
        ? styles.flashWrong
        : "";

  return (
    <div className={styles.scene}>
      <div
        className={`${styles.card} ${flipped ? styles.flipped : ""} ${flashClass}`}
      >
        <div className={`${styles.face} ${styles.front}`}>{card.cyrillic}</div>
        <div className={`${styles.face} ${styles.back}`}>
          <span className={styles.backLatin}>{card.latin}</span>
          <span className={styles.backCyrillic}>{card.cyrillic}</span>
        </div>
      </div>

      <div className={styles.options}>
        {options.map((latin) => {
          const isPicked = picked === latin;
          const optionClass = isPicked ? flashClass : "";
          return (
            <button
              key={latin}
              type="button"
              className={`${styles.option} ${optionClass}`}
              onClick={() => choose(latin)}
              disabled={flipped}
            >
              {latin}
            </button>
          );
        })}
      </div>
    </div>
  );
}
