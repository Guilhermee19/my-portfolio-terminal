"use client";

import { useEffect, useState } from "react";

const NUMBERS = [4, 8, 15, 16, 23, 42];
const START = 108 * 60; // os 108 minutos da escotilha

/** Split-flap da Estação Cisne: conta até zero e aí o mundo acaba (ou não). */
export default function Lost({ onExit }: { onExit: () => void }) {
  const [left, setLeft] = useState(START);
  const [typed, setTyped] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const off = (e: KeyboardEvent) => e.key === "Escape" && onExit();
    window.addEventListener("keydown", off);
    return () => window.removeEventListener("keydown", off);
  }, [onExit]);

  useEffect(() => {
    if (done) return;
    // 1 minuto a cada 40ms: os 108 minutos passam em ~4s
    const id = setInterval(() => setLeft((v) => Math.max(0, v - 60)), 40);
    return () => clearInterval(id);
  }, [done]);

  const press = (n: number) => {
    const next = [...typed, n];
    if (NUMBERS[typed.length] !== n) return setTyped([]); // errou a ordem, recomeça
    setTyped(next);
    if (next.length === NUMBERS.length) {
      setLeft(START);
      setTyped([]);
      setDone(true);
    }
  };

  const mm = String(Math.floor(left / 60)).padStart(3, "0");
  const ss = String(left % 60).padStart(2, "0");
  const critical = left <= 4 * 60;

  return (
    <div
      className="fixed inset-0 z-99 flex flex-col items-center justify-center gap-6 bg-bg px-5 text-center"
      role="dialog"
      aria-modal="true"
      aria-label="Estação Cisne"
    >
      <p className="lbl">ESTAÇÃO 3 · O CISNE · INICIATIVA DHARMA</p>

      <div
        className={`brk border-2 px-8 py-6 ${
          critical ? "animate-glitch border-alert" : "border-grn/40"
        }`}
      >
        <p
          className={`text-[clamp(2.5rem,14vw,6rem)] leading-none font-extrabold tabular-nums ${
            critical ? "text-alert glow" : "text-grn glow"
          }`}
        >
          {mm}:{ss}
        </p>
      </div>

      {done ? (
        <>
          <p className="text-sm tracking-[0.25em] text-grn glow">
            CONTAGEM REINICIADA
          </p>
          <p className="max-w-md text-[12px] leading-6 text-grn-2/70">
            Você salvou o mundo. Provavelmente. Agora faça isso de novo daqui a
            1Ø8 minutos, todos os dias, para sempre, sem nunca saber por quê.
          </p>
        </>
      ) : (
        <>
          <p
            className={`text-[11px] tracking-[0.25em] ${critical ? "text-alert" : "text-dim"}`}
          >
            {critical ? "⚠ INSIRA OS NÚMEROS AGORA" : "INSIRA A SEQUÊNCIA"}
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {NUMBERS.map((n, i) => (
              <button
                key={n}
                onClick={() => press(n)}
                className={`brk h-14 w-14 border text-lg font-extrabold transition-colors ${
                  i < typed.length
                    ? "border-grn bg-grn text-bg"
                    : "border-grn/40 text-grn hover:bg-grn/15"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="lbl">na ordem. sempre na mesma ordem.</p>
        </>
      )}

      <button
        onClick={onExit}
        className="brk mt-2 border border-grn/35 px-6 py-2 text-[11px] tracking-[0.25em] text-dim transition-colors hover:border-grn hover:text-grn"
      >
        [ESC] SAIR DA ESCOTILHA
      </button>
    </div>
  );
}
