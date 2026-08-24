"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  Attract,
  Cabinet,
  GameOver,
  Initials,
  Key,
  Marquee,
  Paused,
  Scoreboard,
  useArcade,
  type Result,
} from "@/components/arcade";

const COLS = 28;
const ROWS = 20;
const POINTS = 10;

type P = { x: number; y: number };

const START = (): {
  snake: P[];
  dir: P;
  queue: P[];
  food: P;
  score: number;
} => ({
  snake: [
    { x: 6, y: 10 },
    { x: 5, y: 10 },
    { x: 4, y: 10 },
  ],
  dir: { x: 1, y: 0 },
  queue: [],
  food: { x: 20, y: 10 },
  score: 0,
});

export default function Snake({ onExit }: { onExit: (r: Result) => void }) {
  const g = useRef(START());
  const [, repaint] = useReducer((n: number) => n + 1, 0);
  const [speed, setSpeed] = useState(150);
  const a = useArcade("snake");
  const { phase, setPhase } = a;

  const newFood = useCallback(() => {
    const taken = new Set(g.current.snake.map((s) => `${s.x},${s.y}`));
    const free: P[] = [];
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++)
        if (!taken.has(`${x},${y}`)) free.push({ x, y });
    g.current.food = free[Math.floor(Math.random() * free.length)] ?? {
      x: 0,
      y: 0,
    };
  }, []);

  const step = useCallback(() => {
    const s = g.current;
    const next = s.queue.shift();
    if (next) s.dir = next;

    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
    if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS)
      return a.die(s.score);

    const grows = head.x === s.food.x && head.y === s.food.y;
    // a cauda sai neste tick, então ocupar a última célula é legal (a não ser que cresça)
    const body = grows ? s.snake : s.snake.slice(0, -1);
    if (body.some((p) => p.x === head.x && p.y === head.y))
      return a.die(s.score);

    s.snake.unshift(head);
    if (grows) {
      s.score += POINTS;
      newFood();
      setSpeed(Math.max(70, 150 - Math.floor(s.score / 50) * 6));
    } else {
      s.snake.pop();
    }
    repaint();
  }, [a, newFood]);

  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(step, speed);
    return () => clearInterval(id);
  }, [phase, speed, step]);

  const start = useCallback(() => {
    // a primeira fruta vem em linha reta de propósito: ensina o jogo em 2 segundos
    g.current = START();
    setSpeed(150);
    a.setBoard(null);
    setPhase("playing"); // o código digitado fica pra próxima partida
    repaint();
  }, [a, setPhase]);

  const turn = useCallback((d: P) => {
    const s = g.current;
    const last = s.queue.at(-1) ?? s.dir;
    if (last.x === -d.x && last.y === -d.y) return; // 180° é suicídio, ignora
    if (last.x === d.x && last.y === d.y) return;
    if (s.queue.length < 2) s.queue.push(d); // fila curta: evita virar duas vezes num tick
  }, []);

  // ── teclado ──────────────────────────────────────────────
  useEffect(() => {
    const DIRS: Record<string, P> = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 },
      s: { x: 0, y: 1 },
      a: { x: -1, y: 0 },
      d: { x: 1, y: 0 },
    };

    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k.startsWith("Arrow") || k === " ") e.preventDefault();
      if (k === "Escape") return onExit(a.result.current);
      if (a.handleKey(k, start)) return; // era tecla de attract/over/código/placar

      if (k === "p" || k === "P" || k === " ")
        return setPhase((p) => (p === "playing" ? "paused" : "playing"));
      const d = DIRS[k];
      if (d) turn(d);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [a, start, turn, onExit, setPhase]);

  // ── swipe ────────────────────────────────────────────────
  const touch = useRef<P | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    if (phase !== "playing") return;
    turn(
      Math.abs(dx) > Math.abs(dy)
        ? { x: Math.sign(dx), y: 0 }
        : { x: 0, y: Math.sign(dy) },
    );
  };

  const overlay = phase !== "playing" && phase !== "paused";

  // quadradinho posicionado em % — só a cobra e a fruta viram nó no DOM,
  // a grade em si é background, então não são 560 divs por frame
  const cell = (p: P): React.CSSProperties => ({
    left: `${(p.x * 100) / COLS}%`,
    top: `${(p.y * 100) / ROWS}%`,
    width: `${100 / COLS}%`,
    height: `${100 / ROWS}%`,
  });

  return (
    <Cabinet label="Snake" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <Marquee title="SNAKE" score={g.current.score} hi={a.hi} />

      {/* a telinha: moldura grossa + brilho interno, tipo tubo de fliperama */}
      <div className="brk relative rounded-md border-2 border-grn/40 bg-[#01110a] p-2 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] sm:p-3">
        <div
          aria-hidden
          className="relative overflow-hidden"
          style={{
            height: `min(58vh, calc(88vw * ${ROWS} / ${COLS}))`,
            aspectRatio: `${COLS} / ${ROWS}`,
            backgroundImage: `
              linear-gradient(to right, color-mix(in oklab, var(--color-grn) 9%, transparent) 1px, transparent 1px),
              linear-gradient(to bottom, color-mix(in oklab, var(--color-grn) 9%, transparent) 1px, transparent 1px)`,
            backgroundSize: `${100 / COLS}% ${100 / ROWS}%`,
          }}
        >
          {/* inset em %, não padding: padding percentual é medido pela largura do
              PAI, o que estoura a célula. inset é medido pela própria caixa. */}
          {g.current.snake.map((p, i) => (
            <span key={`${p.x}-${p.y}`} className="absolute" style={cell(p)}>
              <span
                className={`absolute inset-[8%] rounded-[1px] ${
                  i === 0
                    ? "bg-grn-2 shadow-[0_0_8px_var(--color-grn)]"
                    : "bg-grn/70"
                }`}
              />
            </span>
          ))}
          <span className="absolute" style={cell(g.current.food)}>
            <span className="absolute inset-[16%] rounded-[1px] bg-alert shadow-[0_0_8px_var(--color-alert)]" />
          </span>
        </div>

        {overlay && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg/92 px-4 text-center">
            {phase === "attract" && <Attract title="SNAKE" />}
            {phase === "over" && <GameOver score={g.current.score} />}
            {phase === "initials" && (
              <Initials score={g.current.score} arcade={a} />
            )}
            {phase === "board" && a.board && (
              <Scoreboard board={a.board} me={a.result.current} />
            )}
          </div>
        )}

        {phase === "paused" && <Paused />}
      </div>

      {/* d-pad: sem isso o jogo é injogável no celular */}
      <div className="grid grid-cols-3 gap-1 sm:hidden" aria-hidden>
        <span />
        <Key onClick={() => turn({ x: 0, y: -1 })}>▲</Key>
        <span />
        <Key onClick={() => turn({ x: -1, y: 0 })}>◀</Key>
        <Key
          onClick={() =>
            setPhase((p) => (p === "playing" ? "paused" : "playing"))
          }
        >
          II
        </Key>
        <Key onClick={() => turn({ x: 1, y: 0 })}>▶</Key>
        <span />
        <Key onClick={() => turn({ x: 0, y: 1 })}>▼</Key>
        <span />
      </div>

      <div className="flex w-full max-w-3xl items-center justify-between text-[10px] tracking-[0.2em] text-dim">
        <span className="hidden sm:block">← ↑ ↓ → MOVER · [P] PAUSA</span>
        <span className="sm:hidden">DESLIZE OU USE O D-PAD</span>
        <button
          onClick={() => onExit(a.result.current)}
          className="border border-grn/30 px-3 py-1 transition-colors hover:border-alert hover:text-alert"
        >
          [ESC] SAIR
        </button>
      </div>
    </Cabinet>
  );
}
