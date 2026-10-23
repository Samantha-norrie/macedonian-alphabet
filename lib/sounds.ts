// Synthesized feedback sounds via the Web Audio API — no asset files needed.

let ctx: AudioContext | null = null;

function audioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  // Browsers suspend the context until a user gesture resumes it.
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** A bright two-note rising chime for a correct answer. */
export function playCorrect(): void {
  const ac = audioCtx();
  if (!ac) return;
  const now = ac.currentTime;
  // C6 then G6 — a cheerful major fifth.
  [1046.5, 1568].forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const start = now + i * 0.1;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.3, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
    osc.connect(gain).connect(ac.destination);
    osc.start(start);
    osc.stop(start + 0.4);
  });
}

/**
 * Speak a Macedonian syllable aloud via the browser's speech synthesis.
 * Uses a Macedonian voice when one is installed, else the default voice.
 * `delayMs` lets the correct/wrong sound land first.
 */
export function speak(text: string, delayMs: number = 0): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const run = () => {
    window.speechSynthesis.cancel(); // drop anything still queued
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "mk-MK";
    const mk = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.toLowerCase().startsWith("mk"));
    if (mk) utter.voice = mk;
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };
  if (delayMs > 0) setTimeout(run, delayMs);
  else run();
}

/** A dull low "thunk" for a wrong answer. */
export function playWrong(): void {
  const ac = audioCtx();
  if (!ac) return;
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  // Drop in pitch to give it a deadened, falling feel.
  osc.frequency.setValueAtTime(160, now);
  osc.frequency.exponentialRampToValueAtTime(70, now + 0.18);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.4, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.3);
}
