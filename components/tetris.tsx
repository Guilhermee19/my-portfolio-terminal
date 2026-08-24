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
  pad,
  useArcade,
  type Result,
} from "@/components/arcade";
import {
  COLS,
  ROWS,
  blocks,
  clearLines,
  drop,
  emptyBoard,
  fits,
  levelOf,
  lineScore,
  lock,
  move,
  randomKind,
  rotateWithKick,
  spawn,
  speedOf,
  type Board,
  type Kind,
  type Piece,
} from "@/lib/tetris";

const LOCK_DELAY = 400; // tempo pra encaixar depois de encostar

/** Sem cor: o Game Boy separava as peças por tom, e assim o `theme` continua valendo. */
const TONE = [
  "bg-grn-2", // I — a mais clara
  "bg-grn",
  "bg-grn/85",
  "bg-grn/70",
  "bg-grn/60",
  "bg-grn/50",
  "bg-grn/40", // L — a mais escura
];

const START = () => ({
  board: emptyBoard(),
  piece: spawn(randomKind()),
  next: randomKind(),
  score: 0,
  lines: 0,
  level: 0,
  locking: 0 as number, // timestamp de quando encostou
});

export default function Tetris({ onExit }: { onExit: (r: Result) => void }) {
  const g = useRef(START());
  const [, repaint] = useReducer((n: number) => n + 1, 0);
  const [speed, setSpeed] = useState(speedOf(0));
  const a = useArcade("tetris");
  const { phase, setPhase } = a;

  /** Fixa a peça, limpa linhas, pontua e traz a próxima. */
  const settle = useCallback(() => {
    const s = g.current;
    const locked = lock(s.board, s.piece);
    const { board, cleared } = clearLines(locked);
    s.board = board;
    if (cleared) {
      s.score += lineScore(cleared, s.level);
      s.lines += cleared;
      const lvl = levelOf(s.lines);
      if (lvl !== s.level) {
        s.level = lvl;
        setSpeed(speedOf(lvl));
      }
    }
    s.locking = 0;
    s.piece = spawn(s.next);
    s.next = randomKind();
    // peça nova não cabe = a pilha chegou no topo
    if (!fits(s.board, s.piece)) return a.die(s.score);
    repaint();
  }, [a]);

  /** Um tick de queda. O lock delay dá uma última chance de encaixar. */
  const tick = useCallback(() => {
    const s = g.current;
    const down = move(s.board, s.piece, 0, 1);
    if (down) {
      s.piece = down;
      s.locking = 0;
      return repaint();
    }
    if (!s.locking) {
      s.locking = Date.now();
      return repaint();
    }
    if (Date.now() - s.locking >= LOCK_DELAY) settle();
  }, [settle]);

  useEffect(() => {
    if (phase !== "playing") return;
    // só a velocidade recria o intervalo — input não pode resetar a queda,
    // senão dá pra segurar a peça no ar apertando seta
    const id = setInterval(tick, speed);
    return () => clearInterval(id);
  }, [phase, speed, tick]);

  const start = useCallback(() => {
    g.current = START();
    setSpeed(speedOf(0));
    a.setBoard(null);
    setPhase("playing");
    repaint();
  }, [a, setPhase]);

  // ── ações ────────────────────────────────────────────────
  const shift = useCallback((dx: number) => {
    const s = g.current;
    const next = move(s.board, s.piece, dx, 0);
    if (!next) return;
    s.piece = next;
    if (s.locking) s.locking = Date.now(); // encaixou de novo: renova o prazo
    repaint();
  }, []);

  const spin = useCallback((dir: 1 | -1) => {
    const s = g.current;
    const next = rotateWithKick(s.board, s.piece, dir);
    if (!next) return;
    s.piece = next;
    if (s.locking) s.locking = Date.now();
    repaint();
  }, []);

  const softDrop = useCallback(() => {
    const s = g.current;
    const next = move(s.board, s.piece, 0, 1);
    if (!next) return;
    s.piece = next;
    s.score += 1;
    repaint();
  }, []);

  const hardDrop = useCallback(() => {
    const s = g.current;
    const { piece, rows } = drop(s.board, s.piece);
    s.piece = piece;
    s.score += rows * 2;
    settle();
  }, [settle]);

  // ── teclado ──────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k.startsWith("Arrow") || k === " ") e.preventDefault();
      if (k === "Escape") return onExit(a.result.current);
      if (a.handleKey(k, start)) return;
      if (phase !== "playing") {
        if (k === "p" || k === "P")
          setPhase((p) => (p === "playing" ? "paused" : "playing"));
        return;
      }

      if (k === "ArrowLeft") return shift(-1);
      if (k === "ArrowRight") return shift(1);
      if (k === "ArrowDown") return softDrop();
      if (k === "ArrowUp" || k === "x" || k === "X") return spin(1);
      if (k === "z" || k === "Z") return spin(-1);
      if (k === " ") return hardDrop();
      if (k === "p" || k === "P")
        setPhase((p) => (p === "playing" ? "paused" : "playing"));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [a, phase, start, shift, spin, softDrop, hardDrop, onExit, setPhase]);

  // ── swipe: lateral move, pra baixo derruba ───────────────
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current || phase !== "playing") return (touch.current = null);
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return spin(1); // toque = girar
    if (Math.abs(dx) > Math.abs(dy)) shift(Math.sign(dx));
    else if (dy > 0) hardDrop();
  };

  const s = g.current;
  const overlay = phase !== "playing" && phase !== "paused";

  return (
    <Cabinet label="Tetris" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <Marquee title="TETRIS" score={s.score} hi={a.hi} />

      <div className="flex items-start gap-3">
        {/* a telinha */}
        <div className="brk relative rounded-md border-2 border-grn/40 bg-[#01110a] p-2 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] sm:p-3">
          <div
            aria-hidden
            className="relative overflow-hidden"
            style={{
              height: `min(62vh, calc(58vw * ${ROWS} / ${COLS}))`,
              aspectRatio: `${COLS} / ${ROWS}`,
              backgroundImage: `
                linear-gradient(to right, color-mix(in oklab, var(--color-grn) 9%, transparent) 1px, transparent 1px),
                linear-gradient(to bottom, color-mix(in oklab, var(--color-grn) 9%, transparent) 1px, transparent 1px)`,
              backgroundSize: `${100 / COLS}% ${100 / ROWS}%`,
            }}
          >
            {/* inset em %, não padding: padding percentual é medido pela largura
                do PAI e estoura a célula */}
            {s.board.map((row, y) =>
              row.map((c, x) =>
                c ? <Block key={`${x}-${y}`} x={x} y={y} tone={c - 1} /> : null,
              ),
            )}
            {blocks(s.piece).map(([x, y]) =>
              y < 0 ? null : (
                <Block
                  key={`p${x}-${y}`}
                  x={x}
                  y={y}
                  tone={PIECE_INDEX[s.piece.kind]}
                  live
                />
              ),
            )}
          </div>

          {overlay && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg/92 px-4 text-center">
              {phase === "attract" && <Attract title="TETRIS" />}
              {phase === "over" && <GameOver score={s.score} />}
              {phase === "initials" && <Initials score={s.score} arcade={a} />}
              {phase === "board" && a.board && (
                <Scoreboard board={a.board} me={a.result.current} />
              )}
            </div>
          )}

          {phase === "paused" && <Paused />}
        </div>

        {/* painel: NEXT, SCORE, LEVEL, LINES */}
        <div className="flex w-24 shrink-0 flex-col gap-2 sm:w-28">
          <Panel label="NEXT">
            <NextPiece kind={s.next} />
          </Panel>
          <Panel label="SCORE">{pad(s.score)}</Panel>
          <Panel label="LEVEL">{String(s.level).padStart(2, "0")}</Panel>
          <Panel label="LINES">{String(s.lines).padStart(3, "0")}</Panel>
        </div>
      </div>

      {/* d-pad: sem isso é injogável no celular */}
      <div className="flex items-center gap-2 sm:hidden" aria-hidden>
        <Key onClick={() => shift(-1)}>◀</Key>
        <Key onClick={softDrop}>▼</Key>
        <Key onClick={() => shift(1)}>▶</Key>
        <Key onClick={() => spin(1)} wide>
          GIRAR
        </Key>
        <Key onClick={hardDrop} wide>
          DROP
        </Key>
      </div>

      <div className="flex w-full max-w-3xl items-center justify-between text-[10px] tracking-[0.2em] text-dim">
        <span className="hidden sm:block">
          ←→ MOVE · ↓ DESCE · ↑/X GIRA · ESPAÇO DERRUBA · [P] PAUSA
        </span>
        <span className="sm:hidden">DESLIZE OU USE OS BOTÕES</span>
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

const PIECE_INDEX: Record<Kind, number> = {
  I: 0,
  O: 1,
  T: 2,
  S: 3,
  Z: 4,
  J: 5,
  L: 6,
};

function Block({
  x,
  y,
  tone,
  live,
}: {
  x: number;
  y: number;
  tone: number;
  live?: boolean;
}) {
  return (
    <span
      className="absolute"
      style={{
        left: `${(x * 100) / COLS}%`,
        top: `${(y * 100) / ROWS}%`,
        width: `${100 / COLS}%`,
        height: `${100 / ROWS}%`,
      }}
    >
      <span
        className={`absolute inset-[6%] rounded-[1px] ${TONE[tone]} ${
          live ? "shadow-[0_0_8px_var(--color-grn)]" : ""
        }`}
      >
        {/* quadradinho interno: era assim que o GB distinguia peça sem cor */}
        <span className="absolute inset-[28%] bg-bg/45" />
      </span>
    </span>
  );
}

function Panel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="brk border border-grn/30 px-2 py-1.5 text-center">
      <div className="text-[9px] tracking-[0.15em] text-dim">{label}</div>
      <div className="mt-0.5 text-[11px] font-bold tabular-nums text-grn glow sm:text-sm">
        {children}
      </div>
    </div>
  );
}

/** Miniatura da próxima peça, numa caixa 4×2. */
function NextPiece({ kind }: { kind: Kind }) {
  const p = spawn(kind);
  const cells = p.cells;
  return (
    <div className="relative mx-auto h-6 w-12 sm:h-7 sm:w-14">
      {cells.map(([x, y]) => (
        <span
          key={`${x}-${y}`}
          className={`absolute rounded-[1px] ${TONE[PIECE_INDEX[kind]]}`}
          style={{
            left: `${x * 25}%`,
            top: `${y * 50}%`,
            width: "25%",
            height: "50%",
          }}
        />
      ))}
    </div>
  );
}
