"use client";

import { useEffect, useMemo, useState } from "react";

/** O rosto: 8×8, 1 = buraco preto. É o desenho todo mundo reconhece. */
const FACE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0, 1, 1, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

type Phase = "hiss" | "boom" | "crash";

export default function Creeper({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>("hiss");

  // estilhaços sorteados uma vez — no render seriam outros a cada repaint
  const shards = useMemo(
    () =>
      Array.from({ length: 54 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 8 + Math.random() * 26,
        dx: `${(Math.random() - 0.5) * 160}vw`,
        dy: `${(Math.random() - 0.5) * 160}vh`,
        r: `${(Math.random() - 0.5) * 900}deg`,
        delay: Math.random() * 0.18,
        tone: Math.random(),
      })),
    [],
  );

  useEffect(() => {
    const a = setTimeout(() => setPhase("boom"), 1500);
    const b = setTimeout(() => setPhase("crash"), 2600);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  useEffect(() => {
    const off = (e: KeyboardEvent) => e.key === "Escape" && onExit();
    window.addEventListener("keydown", off);
    return () => window.removeEventListener("keydown", off);
  }, [onExit]);

  if (phase === "crash") return <Crash onExit={onExit} />;

  return (
    <div
      className={`fixed inset-0 z-99 flex flex-col items-center justify-center overflow-hidden bg-bg ${
        phase === "boom" ? "animate-[shake_0.6s_ease-in-out]" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Creeper"
    >
      {phase === "hiss" && (
        <>
          <div
            className="grid animate-[creep_1.5s_ease-out_forwards] grid-cols-8 gap-[2px]"
            style={{ width: "min(46vw, 46vh, 280px)" }}
            aria-hidden
          >
            {FACE.flatMap((row, y) =>
              row.map((cell, x) => (
                <span
                  key={`${x}-${y}`}
                  className={`aspect-square ${
                    cell
                      ? "bg-bg"
                      : (x + y) % 3 === 0
                        ? "bg-grn/80"
                        : (x + y) % 3 === 1
                          ? "bg-grn/55"
                          : "bg-grn/70"
                  }`}
                />
              )),
            )}
          </div>
          <p className="mt-8 animate-blink text-lg tracking-[0.6em] text-grn glow">
            Tsssssss
          </p>
          <p className="lbl mt-3">ISSO NUNCA ACABA BEM</p>
        </>
      )}

      {phase === "boom" && (
        <>
          <div className="absolute inset-0 animate-[flick_0.6s_steps(2)] bg-white/70" />
          {shards.map((s, i) => (
            <span
              key={i}
              aria-hidden
              className="absolute animate-[blast_1.1s_ease-out_forwards]"
              style={
                {
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size,
                  height: s.size,
                  animationDelay: `${s.delay}s`,
                  "--dx": s.dx,
                  "--dy": s.dy,
                  "--r": s.r,
                  backgroundColor:
                    s.tone > 0.66
                      ? "var(--color-grn)"
                      : s.tone > 0.33
                        ? "var(--color-dim)"
                        : "var(--color-alert)",
                } as React.CSSProperties
              }
            />
          ))}
        </>
      )}
    </div>
  );
}

function Crash({ onExit }: { onExit: () => void }) {
  return (
    <div
      className="fixed inset-0 z-99 overflow-y-auto bg-bg px-5 py-10"
      role="alertdialog"
      aria-modal="true"
      aria-label="Site em manutenção"
    >
      <div className="mx-auto max-w-2xl">
        <p className="text-center text-2xl font-extrabold tracking-[0.2em] text-alert glow sm:text-4xl">
⚠ EM MANUTENÇÃO
        </p>
        <p className="mt-3 text-center text-[12px] text-grn-2/70">
          Um creeper entrou no perímetro de renderização. Estamos recolocando os
          blocos no lugar.
        </p>

        <pre className="mt-8 overflow-x-auto border border-alert/40 bg-alert/[0.04] px-4 py-4 text-[11px] leading-6 text-grn-2/80">
          {`---- crash report ----
// isto não deveria ter acontecido. de novo.

Description: Unexpected entity explosion during render

java.lang.RuntimeException: EntityCreeper detonou perto do DOM
    at dev.iamgui.terminal.Renderer.paint(Renderer.tsx:42)
    at dev.iamgui.hud.TopBar.tick(hud.tsx:31)
    at dev.iamgui.Boot.main(boot-screen.tsx:1)

-- Sistema --
  OS ............ SCHR-OS 1.3 (x86_64)
  Blocos perdidos 54
  Backup ........ existe (dessa vez)
  Culpado ....... a gambiarra da sexta`}
        </pre>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              // reinício de verdade: limpa a sessão pro boot rodar de novo
              try {
                sessionStorage.removeItem("booted");
              } catch {}
              location.reload();
            }}
            className="brk border border-grn bg-grn/10 px-6 py-3 text-[11px] tracking-[0.25em] text-grn transition-colors hover:bg-grn hover:text-bg"
          >
            » REINICIAR O SISTEMA «
          </button>
          <button
            onClick={onExit}
            className="brk border border-grn/35 px-6 py-3 text-[11px] tracking-[0.25em] text-dim transition-colors hover:border-grn hover:text-grn"
          >
            IGNORAR E VOLTAR
          </button>
        </div>
      </div>
    </div>
  );
}
