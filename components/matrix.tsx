"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンØ123456789ABCDEF<>/\\=+*";
const SIZE = 16;

/** Chuva de código no canvas — em DOM seriam milhares de nós por segundo. */
function useRain(
  ref: React.RefObject<HTMLCanvasElement | null>,
  fast: boolean,
) {
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;

    const css = getComputedStyle(document.documentElement);
    const grn = css.getPropertyValue("--color-grn").trim() || "#2bff88";
    const bg = css.getPropertyValue("--color-bg").trim() || "#030806";

    let drops: number[] = [];
    const resize = () => {
      // se ainda não tem layout (0px), não dá pra montar as colunas — o
      // ResizeObserver chama de novo assim que o tamanho existir
      if (!c.clientWidth || !c.clientHeight) return;
      if (c.width === c.clientWidth && c.height === c.clientHeight) return;
      c.width = c.clientWidth;
      c.height = c.clientHeight;
      drops = Array.from({ length: Math.ceil(c.width / SIZE) }, () =>
        Math.floor((Math.random() * -c.height) / SIZE),
      );
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, c.width, c.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    const draw = () => {
      if (!drops.length) return resize(); // ainda sem layout: tenta medir de novo
      // o rastro é o fundo semitransparente por cima do frame anterior
      ctx.fillStyle = `${bg}14`;
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.font = `${SIZE}px ui-monospace, monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const y = drops[i] * SIZE;
        ctx.fillStyle = "#d9ffe9"; // a cabeça da coluna é quase branca
        ctx.fillText(ch, i * SIZE, y);
        ctx.fillStyle = grn;
        ctx.fillText(
          GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          i * SIZE,
          y - SIZE,
        );
        if (y > c.height && Math.random() > 0.97) drops[i] = 0;
        drops[i]++;
      }
    };

    draw();
    // a chuva é decoração: quem pediu menos movimento vê um frame parado
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => ro.disconnect();
    }
    const id = setInterval(draw, fast ? 28 : 55);
    return () => {
      clearInterval(id);
      ro.disconnect();
    };
  }, [ref, fast]);
}

export default function Matrix({
  onExit,
}: {
  onExit: (choice: "vermelha" | "azul" | null) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [truth, setTruth] = useState(false);
  useRain(canvas, truth);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit(truth ? "vermelha" : null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit, truth]);

  return (
    <div
      className="fixed inset-0 z-99 bg-bg"
      role="dialog"
      aria-modal="true"
      aria-label="Matrix"
    >
      <canvas
        ref={canvas}
        aria-hidden
        className="absolute inset-0 h-full w-full"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
        {!truth ? (
          <>
            <p className="max-w-lg text-sm leading-7 text-grn-2 sm:text-base">
              Esta é a sua última chance. Depois dela, não tem volta.
            </p>

            <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:gap-14">
              <Pill
                tone="red"
                label="PÍLULA VERMELHA"
                note="você fica no país das maravilhas"
                onClick={() => setTruth(true)}
              />
              <Pill
                tone="blue"
                label="PÍLULA AZUL"
                note="a história acaba e você acredita no que quiser"
                onClick={() => onExit("azul")}
              />
            </div>

            <p className="lbl mt-12">ESCOLHA UMA · ESC DESISTE</p>
          </>
        ) : (
          <div className="bg-bg/85 px-6 py-8 backdrop-blur-sm">
            <p className="text-lg font-extrabold tracking-[0.25em] text-alert glow sm:text-2xl">
              BEM-VINDO AO DESERTO DO REAL
            </p>
            <div className="mt-6 space-y-1 text-[12px] leading-6 text-grn-2/80 sm:text-sm">
              <p>
                a grade do fundo é CSS. o CRT é uma div. o brilho é box-shadow.
              </p>
              <p>
                a senha do root está no bundle desde sempre — front-end é assim.
              </p>
              <p>o `df -h` mente. o `uptime` mente. o `ps aux` também.</p>
              <p>o placar do snake, esse é de verdade.</p>
            </div>
            <button
              onClick={() => onExit("vermelha")}
              className="brk mt-8 border border-grn px-6 py-2 text-xs tracking-[0.25em] text-grn transition-colors hover:bg-grn hover:text-bg"
            >
              » VOLTAR AO TERMINAL «
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({
  tone,
  label,
  note,
  onClick,
}: {
  tone: "red" | "blue";
  label: string;
  note: string;
  onClick: () => void;
}) {
  const red = tone === "red";
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-3"
    >
      <span
        className={`h-11 w-24 rounded-full border-2 transition-transform group-hover:scale-110 ${
          red
            ? "border-[#ff6b6b] bg-[#e02424] shadow-[0_0_28px_#e02424]"
            : "border-[#7cc4ff] bg-[#1d6fe0] shadow-[0_0_28px_#1d6fe0]"
        }`}
        /* o brilhinho de cápsula */
        style={{
          backgroundImage:
            "linear-gradient(160deg, rgba(255,255,255,0.55), transparent 45%)",
        }}
      />
      <span
        className={`text-[11px] font-bold tracking-[0.2em] ${red ? "text-[#ff8a8a]" : "text-[#8ec8ff]"}`}
      >
        {label}
      </span>
      <span className="max-w-[15rem] text-[10px] leading-5 text-dim">
        {note}
      </span>
    </button>
  );
}
