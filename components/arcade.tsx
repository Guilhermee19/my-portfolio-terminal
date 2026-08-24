"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SLOTS,
  fetchBoard,
  lastName,
  submitScore,
  type Board,
  type Game,
} from "@/lib/scores";

/**
 * O que todo jogo do arcade tem em comum: marquee, tela de atração, game over,
 * o seletor de código de 5 slots e o placar. O jogo em si só cuida do tabuleiro.
 */
export type Phase =
  "attract" | "playing" | "paused" | "over" | "initials" | "board";

export type Result = {
  score: number;
  rank: number | null;
  name: string | null;
};

/** "_" é o slot vazio: some no envio, então dá pra usar de 1 a 5 caracteres. */
export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
export const EMPTY = "_";

/** 5 dígitos como sempre foi; score maior que isso simplesmente não é cortado. */
export const pad = (n: number, len = 5) => String(n).padStart(len, "0");

/** "GUI" → ["G","U","I","_","_"] */
const toSlots = (name: string) =>
  name.padEnd(SLOTS, EMPTY).slice(0, SLOTS).split("");

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

/**
 * Sessão de arcade: hi-score, o que acontece depois do game over e a gravação.
 * O jogo chama `die(score)` e o resto acontece sozinho.
 */
export function useArcade(game: Game) {
  const [phase, setPhase] = useState<Phase>("attract");
  const [hi, setHi] = useState(0);
  const [board, setBoard] = useState<Board | null>(null);
  const [initials, setInitials] = useState<string[]>(() => toSlots("A"));
  const [slot, setSlot] = useState(0);
  const [saving, setSaving] = useState(false);
  const result = useRef<Result>({ score: 0, rank: null, name: null });
  const hiKey = `gui:hi:${game}`;

  useEffect(() => {
    setHi(Number(localStorage.getItem(hiKey) ?? 0));
    // quem já jogou volta com o código preenchido: é só apertar ENTER
    const saved = lastName();
    if (saved) {
      setInitials(toSlots(saved));
      setSlot(Math.min(saved.length, SLOTS - 1));
    }
  }, [hiKey]);

  const die = useCallback(
    (score: number) => {
      result.current = { score, rank: null, name: null };
      if (score > hi) {
        setHi(score);
        try {
          localStorage.setItem(hiKey, String(score));
        } catch {}
      }
      setPhase("over");
    },
    [hi, hiKey],
  );

  const openBoard = useCallback(
    async (name: string | null) => {
      setSaving(true);
      const b = name
        ? await submitScore(game, name, result.current.score)
        : await fetchBoard(game);
      result.current = { ...result.current, name, rank: b.rank };
      setBoard(b);
      setSaving(false);
      setPhase("board");
    },
    [game],
  );

  const typedName = initials.join("").replaceAll(EMPTY, "");
  const save = useCallback(() => {
    const n = initials.join("").replaceAll(EMPTY, "");
    if (n) void openBoard(n);
  }, [initials, openBoard]);

  // game over → código (ou direto pro placar, se zerou)
  useEffect(() => {
    if (phase !== "over") return;
    const id = setTimeout(
      () => (result.current.score > 0 ? setPhase("initials") : openBoard(null)),
      1400,
    );
    return () => clearTimeout(id);
  }, [phase, openBoard]);

  /** Teclas das telas de fim de jogo. `true` = a tecla era daqui, o jogo ignora. */
  const handleKey = useCallback(
    (k: string, start: () => void): boolean => {
      if (phase === "attract") {
        start();
        return true;
      }
      // "over" é transição: ignora teclas, senão quem morre com o dedo na seta
      // reinicia a partida e perde a tela de gravar o score
      if (phase === "over") return true;

      if (phase === "board") {
        if (k === "Enter") start();
        return true;
      }

      if (phase !== "initials") return false;
      if (saving) return true;
      if (k === "Enter") save();
      else if (k === "ArrowLeft") setSlot((i) => (i + SLOTS - 1) % SLOTS);
      else if (k === "ArrowRight" || k === "Tab")
        setSlot((i) => (i + 1) % SLOTS);
      else if (k === "ArrowUp" || k === "ArrowDown")
        bump(setInitials, slot, k === "ArrowUp" ? 1 : -1);
      else if (k === "Backspace") {
        setInitials((v) => {
          const n = [...v];
          n[slot] = EMPTY;
          return n;
        });
        setSlot((i) => Math.max(0, i - 1));
      } else {
        const ch = k.toUpperCase();
        if (ch.length === 1 && ALPHABET.includes(ch)) {
          setInitials((v) => {
            const n = [...v];
            n[slot] = ch;
            return n;
          });
          setSlot((i) => Math.min(SLOTS - 1, i + 1));
        }
      }
      return true;
    },
    [phase, saving, save, slot],
  );

  return {
    phase,
    setPhase,
    hi,
    board,
    setBoard,
    initials,
    setInitials,
    slot,
    setSlot,
    saving,
    typedName,
    result,
    die,
    save,
    openBoard,
    handleKey,
  };
}

// ── peças de tela ─────────────────────────────────────────

export function Marquee({
  title,
  score,
  hi,
}: {
  title: string;
  score: number;
  hi: number;
}) {
  return (
    <div className="flex w-full max-w-3xl items-baseline justify-between text-[11px] tracking-[0.2em] sm:text-xs">
      <span className="text-grn glow">1UP {pad(score)}</span>
      <span className="lbl hidden sm:block">GUI-ARCADE · {title}</span>
      <span className="text-dim">HI-SCORE {pad(Math.max(hi, score))}</span>
    </div>
  );
}

export function Attract({ title }: { title: string }) {
  return (
    <>
      <p className="text-lg font-extrabold tracking-[0.3em] text-grn glow sm:text-2xl">
        {title.split("").join(" ")}
      </p>
      <p className="lbl mt-1">GUI-ARCADE · 1 CRÉDITO</p>
      <p className="mt-4 animate-blink text-sm tracking-[0.25em] text-grn">
        PRESS START
      </p>
      <p className="lbl mt-4">qualquer tecla ou toque para começar</p>
    </>
  );
}

export function GameOver({ score }: { score: number }) {
  return (
    <>
      <p className="animate-glitch text-xl font-extrabold tracking-[0.25em] text-alert sm:text-3xl">
        GAME OVER
      </p>
      <p className="mt-3 text-sm text-grn">SCORE {pad(score)}</p>
    </>
  );
}

export function Paused() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-bg/80">
      <p className="animate-blink text-lg tracking-[0.3em] text-grn glow">
        PAUSA
      </p>
    </div>
  );
}

export function Key({
  children,
  onClick,
  wide,
}: {
  children: React.ReactNode;
  onClick: () => void;
  wide?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-12 border border-grn/40 text-grn active:bg-grn active:text-bg ${
        wide ? "px-4 text-[10px] tracking-[0.15em]" : "w-12"
      }`}
    >
      {children}
    </button>
  );
}

export function Initials({
  score,
  arcade,
}: {
  score: number;
  arcade: ReturnType<typeof useArcade>;
}) {
  const { initials, setInitials, slot, setSlot, saving, typedName, save } =
    arcade;
  return (
    <>
      <p className="text-sm tracking-[0.25em] text-grn glow">
        INSIRA SEU CÓDIGO
      </p>
      <p className="lbl mt-1">SCORE {pad(score)}</p>
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
        <Key onClick={() => setSlot((i) => (i + SLOTS - 1) % SLOTS)}>◀</Key>
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
        ↑↓ letra · ←→ slot · digite direto · BACKSPACE apaga · ENTER grava
      </p>
      <p className="lbl mt-1">
        {SLOTS} caracteres · &quot;_&quot; fica de fora
      </p>
    </>
  );
}

export function Scoreboard({ board, me }: { board: Board; me: Result }) {
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

/** O gabinete: overlay opaco no primeiro frame (sem fade — o site vazaria atrás). */
export function Cabinet({
  children,
  onTouchStart,
  onTouchEnd,
  label,
}: {
  children: React.ReactNode;
  label: string;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-99 flex flex-col items-center justify-center gap-3 bg-bg px-3 py-4"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
}
