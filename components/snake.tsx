"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { SLOTS, fetchBoard, submitScore, type Board } from "@/lib/scores";

const COLS = 28;
const ROWS = 20;
const POINTS = 10;
/** "_" é o slot vazio: some no envio, então dá pra usar de 1 a 5 caracteres. */
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
const EMPTY = "_";
const HI_KEY = "gui:snake-hi";

type P = { x: number; y: number };
type Phase = "attract" | "playing" | "paused" | "over" | "initials" | "board";

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

const pad = (n: number, len = 5) => String(n).padStart(len, "0");

export default function Snake({
  onExit,
}: {
  onExit: (r: {
    score: number;
    rank: number | null;
    name: string | null;
  }) => void;
}) {
  const g = useRef(START());
  const [, repaint] = useReducer((n: number) => n + 1, 0);
  const [phase, setPhase] = useState<Phase>("attract");
  const [speed, setSpeed] = useState(150);
  const [hi, setHi] = useState(0);
  const [board, setBoard] = useState<Board | null>(null);
  const [initials, setInitials] = useState<string[]>(
    Array.from({ length: SLOTS }, (_, i) => (i === 0 ? "A" : EMPTY)),
  );
  const [slot, setSlot] = useState(0);
  const [saving, setSaving] = useState(false);
  const lastResult = useRef<{
    score: number;
    rank: number | null;
    name: string | null;
  }>({
    score: 0,
    rank: null,
    name: null,
  });

  useEffect(() => {
    setHi(Number(localStorage.getItem(HI_KEY) ?? 0));
  }, []);

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

  const die = useCallback(() => {
    const score = g.current.score;
    lastResult.current = { score, rank: null, name: null };
    if (score > hi) {
      setHi(score);
      try {
        localStorage.setItem(HI_KEY, String(score));
      } catch {}
    }
    setPhase("over");
  }, [hi]);

  const step = useCallback(() => {
    const s = g.current;
    const next = s.queue.shift();
    if (next) s.dir = next;

    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
    if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS)
      return die();

    const grows = head.x === s.food.x && head.y === s.food.y;
    // a cauda sai neste tick, então ocupar a última célula é legal (a não ser que cresça)
    const body = grows ? s.snake : s.snake.slice(0, -1);
    if (body.some((p) => p.x === head.x && p.y === head.y)) return die();

    s.snake.unshift(head);
    if (grows) {
      s.score += POINTS;
      newFood();
      setSpeed(Math.max(70, 150 - Math.floor(s.score / 50) * 6));
    } else {
      s.snake.pop();
    }
    repaint();
  }, [die, newFood]);

  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(step, speed);
    return () => clearInterval(id);
  }, [phase, speed, step]);

  const start = useCallback(() => {
    // a primeira fruta vem em linha reta de propósito: ensina o jogo em 2 segundos
    g.current = START();
    setSpeed(150);
    setBoard(null);
    setSlot(0);
    setPhase("playing");
    repaint();
  }, []);

  const openBoard = useCallback(async (name: string | null) => {
    setSaving(true);
    const b = name
      ? await submitScore(name, lastResult.current.score)
      : await fetchBoard();
    lastResult.current = { ...lastResult.current, name, rank: b.rank };
    setBoard(b);
    setSaving(false);
    setPhase("board");
  }, []);

  /** os "_" são slots vazios: caem fora, então o nome pode ter de 1 a 5 caracteres */
  const typedName = initials.join("").replaceAll(EMPTY, "");
  const save = useCallback(() => {
    const n = initials.join("").replaceAll(EMPTY, "");
    if (n) void openBoard(n);
  }, [initials, openBoard]);

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

      if (k === "Escape") return onExit(lastResult.current);

      if (phase === "attract") return start();
      // "over" é transição: ignora teclas, senão quem morre com o dedo na seta
      // reinicia a partida e perde a tela de gravar o score
      if (phase === "over") return;

      if (phase === "board") {
        if (k === "Enter") start();
        return;
      }

      if (phase === "initials") {
        if (saving) return;
        if (k === "Enter") return void save();
        if (k === "ArrowLeft") return setSlot((i) => (i + SLOTS - 1) % SLOTS);
        if (k === "ArrowRight" || k === "Tab")
          return setSlot((i) => (i + 1) % SLOTS);
        if (k === "ArrowUp" || k === "ArrowDown")
          return bump(setInitials, slot, k === "ArrowUp" ? 1 : -1);
        if (k === "Backspace") {
          setInitials((v) => {
            const n = [...v];
            n[slot] = EMPTY;
            return n;
          });
          return setSlot((i) => Math.max(0, i - 1));
        }
        const ch = k.toUpperCase();
        if (ch.length === 1 && ALPHABET.includes(ch)) {
          setInitials((v) => {
            const n = [...v];
            n[slot] = ch;
            return n;
          });
          setSlot((i) => Math.min(SLOTS - 1, i + 1));
        }
        return;
      }

      if (k === "p" || k === "P" || k === " ")
        return setPhase((p) => (p === "playing" ? "paused" : "playing"));
      const d = DIRS[k];
      if (d) turn(d);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, slot, saving, start, turn, save, onExit]);

  // game over → iniciais (ou direto pro placar se zerou)
  useEffect(() => {
    if (phase !== "over") return;
    const id = setTimeout(
      () => (g.current.score > 0 ? setPhase("initials") : openBoard(null)),
      1400,
    );
    return () => clearTimeout(id);
  }, [phase, openBoard]);

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
    // sem fade: o gabinete precisa ser opaco no primeiro frame, senão o site vaza atrás
    <div
      className="fixed inset-0 z-99 flex flex-col items-center justify-center gap-3 bg-bg px-3 py-4"
      role="dialog"
      aria-modal="true"
      aria-label="Snake"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* marquee do gabinete */}
      <div className="flex w-full max-w-3xl items-baseline justify-between text-[11px] tracking-[0.2em] sm:text-xs">
        <span className="text-grn glow">1UP {pad(g.current.score)}</span>
        <span className="lbl hidden sm:block">GUI-ARCADE · SNAKE</span>
        <span className="text-dim">
          HI-SCORE {pad(Math.max(hi, g.current.score))}
        </span>
      </div>

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
            {phase === "attract" && (
              <>
                <p className="text-lg font-extrabold tracking-[0.3em] text-grn glow sm:text-2xl">
                  S N A K E
                </p>
                <p className="lbl mt-1">GUI-ARCADE · 1 CRÉDITO</p>
                <p className="mt-4 animate-blink text-sm tracking-[0.25em] text-grn">
                  PRESS START
                </p>
                <p className="lbl mt-4">qualquer tecla ou toque para começar</p>
              </>
            )}

            {phase === "over" && (
              <>
                <p className="animate-glitch text-xl font-extrabold tracking-[0.25em] text-alert sm:text-3xl">
                  GAME OVER
                </p>
                <p className="mt-3 text-sm text-grn">
                  SCORE {pad(g.current.score)}
                </p>
              </>
            )}

            {phase === "initials" && (
              <>
                <p className="text-sm tracking-[0.25em] text-grn glow">
                  INSIRA SEU CÓDIGO
                </p>
                <p className="lbl mt-1">SCORE {pad(g.current.score)}</p>
                <div className="mt-4 flex gap-2">
                  {initials.map((ch, i) => (
                    <button
                      key={i}
                      onClick={() => setSlot(i)}
                      aria-label={`Caractere ${i + 1}: ${ch === EMPTY ? "vazio" : ch}`}
                      className={`flex h-12 w-9 items-center justify-center border text-xl font-extrabold sm:h-14 sm:w-11 sm:text-2xl ${
                        i === slot
                          ? "animate-blink border-grn text-grn glow"
                          : ch === EMPTY
                            ? "border-grn/20 text-dim"
                            : "border-grn/30 text-grn-2"
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
                {/* no celular não tem seta: os botões viram o joystick */}
                <div className="mt-3 flex gap-2 sm:hidden">
                  <Key onClick={() => bump(setInitials, slot, 1)}>▲</Key>
                  <Key onClick={() => bump(setInitials, slot, -1)}>▼</Key>
                  <Key onClick={() => setSlot((i) => (i + SLOTS - 1) % SLOTS)}>
                    ◀
                  </Key>
                  <Key onClick={() => setSlot((i) => (i + 1) % SLOTS)}>▶</Key>
                </div>
                <button
                  disabled={saving || !typedName}
                  onClick={save}
                  className="brk mt-5 border border-grn px-6 py-2 text-xs tracking-[0.25em] text-grn transition-colors hover:bg-grn hover:text-bg disabled:opacity-40"
                >
                  {saving ? "GRAVANDO..." : "» GRAVAR «"}
                </button>
                <p className="lbl mt-3 hidden sm:block">
                  ↑↓ letra · ←→ slot · digite direto · BACKSPACE apaga · ENTER
                  grava
                </p>
                <p className="lbl mt-1">
                  {SLOTS} caracteres · &quot;_&quot; fica de fora
                </p>
              </>
            )}

            {phase === "board" && board && (
              <Scoreboard board={board} me={lastResult.current} />
            )}
          </div>
        )}

        {phase === "paused" && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg/80">
            <p className="animate-blink text-lg tracking-[0.3em] text-grn glow">
              PAUSA
            </p>
          </div>
        )}
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
          onClick={() => onExit(lastResult.current)}
          className="border border-grn/30 px-3 py-1 transition-colors hover:border-alert hover:text-alert"
        >
          [ESC] SAIR
        </button>
      </div>
    </div>
  );
}

function bump(
  set: React.Dispatch<React.SetStateAction<string[]>>,
  slot: number,
  dir: number,
) {
  set((v) => {
    const n = [...v];
    const i =
      (ALPHABET.indexOf(n[slot]) + dir + ALPHABET.length) % ALPHABET.length;
    n[slot] = ALPHABET[i];
    return n;
  });
}

function Key({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="h-12 w-12 border border-grn/40 text-grn active:bg-grn active:text-bg"
    >
      {children}
    </button>
  );
}

function Scoreboard({
  board,
  me,
}: {
  board: Board;
  me: { score: number; rank: number | null; name: string | null };
}) {
  const inTop = board.top.some((s) => s.id === me.name);
  return (
    <div className="w-full max-w-md text-left">
      <p className="mb-2 text-center text-sm tracking-[0.25em] text-grn glow">
        HIGH SCORES
      </p>
      {board.offline && (
        <p className="mb-2 text-center text-[10px] tracking-[0.15em] text-alert">
          ⚠ SERVIDOR INDISPONÍVEL · PLACAR LOCAL
        </p>
      )}

      <div className="text-[11px] leading-6 sm:text-xs">
        {board.top.length === 0 && (
          <p className="text-dim">placar vazio. seja o primeiro.</p>
        )}
        {board.top.map((s, i) => {
          const mine = s.id === me.name;
          return (
            <div
              key={s.id}
              className={`flex justify-between ${mine ? "text-grn glow" : "text-grn-2/70"}`}
            >
              <span>
                {String(i + 1).padStart(2, " ")}. {s.name}
              </span>
              <span className="mx-2 flex-1 self-center border-b border-dashed border-grn/15" />
              <span>
                {pad(s.score)}
                {mine ? "  ◄" : ""}
              </span>
            </div>
          );
        })}

        {me.name && !inTop && me.rank && (
          <>
            <div className="text-dim">···</div>
            <div className="flex justify-between text-grn glow">
              <span>
                {String(me.rank).padStart(2, " ")}. {me.name}
              </span>
              <span className="mx-2 flex-1 self-center border-b border-dashed border-grn/15" />
              <span>{pad(me.score)} ◄</span>
            </div>
          </>
        )}
      </div>

      <p className="mt-4 text-center text-[10px] tracking-[0.2em] text-dim">
        {me.rank ? `SUA POSIÇÃO: #${me.rank}` : ""} · ENTER JOGA DE NOVO · ESC
        SAI
      </p>
    </div>
  );
}
