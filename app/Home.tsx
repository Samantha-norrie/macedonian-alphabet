"use client";

import { useState } from "react";
import Flashcard from "./Flashcard";
import { characterOptions, randomCharacter } from "@/lib/characters";
import styles from "./Home.module.css";

type Category = "character" | "syllable" | "word" | "cefr";

type CategoryDef = {
  id: Category;
  label: string;
  sub: string;
  disabled?: boolean;
};

const CATEGORIES: CategoryDef[] = [
  { id: "character", label: "Character", sub: "Азбука" },
  { id: "syllable", label: "Syllable", sub: "Слогови" },
  { id: "word", label: "Word", sub: "Зборови", disabled: true },
  { id: "cefr", label: "CEFR Path", sub: "A1 → C2", disabled: true },
];

export default function Home() {
  const [active, setActive] = useState<Category | null>(null);

  if (active === "character" || active === "syllable") {
    return (
      <div className={styles.deck}>
        <button
          type="button"
          className={styles.back}
          onClick={() => setActive(null)}
        >
          ← Back
        </button>
        {active === "character" ? (
          <Flashcard draw={randomCharacter} makeOptions={characterOptions} />
        ) : (
          <Flashcard />
        )}
      </div>
    );
  }

  return (
    <div className={styles.menu}>
      <h1 className={styles.title}>Македонски</h1>
      <div className={styles.grid}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={styles.card}
            disabled={c.disabled}
            onClick={() => !c.disabled && setActive(c.id)}
          >
            <span className={styles.cardLabel}>{c.label}</span>
            <span className={styles.cardSub}>{c.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
