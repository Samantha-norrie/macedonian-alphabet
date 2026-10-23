"use client";

import { useEffect, useState } from "react";
import { randomSyllable, type Syllable } from "@/lib/syllables";
import styles from "./Flashcard.module.css";

// How long the Latin back shows after flipping, before the next card.
const BACK_MS = 3000;

export default function Flashcard() {
  const [card, setCard] = useState<Syllable | null>(null);
  const [flipped, setFlipped] = useState(false);

  // Pick the first card on the client (avoids a server/client random mismatch).
  useEffect(() => {
    setCard(randomSyllable());
  }, []);

  // Once flipped, hold the Latin side, then advance to a new card.
  useEffect(() => {
    if (!flipped) return;

    const nextTimer = setTimeout(() => {
      setFlipped(false);
      setCard(randomSyllable());
    }, BACK_MS);

    return () => clearTimeout(nextTimer);
  }, [flipped]);

  if (!card) return null;

  return (
    <div className={styles.scene}>
      <div
        className={`${styles.card} ${flipped ? styles.flipped : ""}`}
        onClick={() => setFlipped(true)}
      >
        <div className={`${styles.face} ${styles.front}`}>{card.cyrillic}</div>
        <div className={`${styles.face} ${styles.back}`}>{card.latin}</div>
      </div>
    </div>
  );
}
