/**
 * Placar do arcade. O cliente fala com /api/scores (route handler), nunca com o
 * json-server direto — o servidor é http:// e o site é https://, o browser bloquearia.
 * Se a API cair, tudo continua funcionando contra o localStorage.
 */
export type Score = {
  id: string; // as 3 iniciais — é o id único no json-server
  name: string;
  score: number;
  at: string; // ISO
  games: number;
};

export type Board = {
  top: Score[];
  rank: number | null; // posição na lista completa, não só no top
  personal: Score | null;
  isRecord: boolean;
  offline: boolean;
};

export const TOP_N = 10;
export const SLOTS = 5; // slots do seletor de iniciais no fliperama
export const INITIALS = /^[A-Z0-9]{1,5}$/;

/** Regra de fliperama: maior score na frente; no empate, quem chegou primeiro. */
export function rankBoard(list: Score[]): Score[] {
  return [...list].sort(
    (a, b) => b.score - a.score || a.at.localeCompare(b.at),
  );
}

export function positionOf(sorted: Score[], id: string): number | null {
  const i = sorted.findIndex((s) => s.id === id);
  return i < 0 ? null : i + 1;
}

/** Upsert compartilhado: só grava quando supera o próprio recorde. */
export function upsert(list: Score[], id: string, score: number, now: string) {
  const current = list.find((s) => s.id === id);
  if (!current) {
    const entry: Score = { id, name: id, score, at: now, games: 1 };
    return { list: [...list, entry], entry, isRecord: true };
  }
  if (score <= current.score) {
    const entry = { ...current, games: current.games + 1 };
    return {
      list: list.map((s) => (s.id === id ? entry : s)),
      entry,
      isRecord: false,
    };
  }
  const entry: Score = { ...current, score, at: now, games: current.games + 1 };
  return {
    list: list.map((s) => (s.id === id ? entry : s)),
    entry,
    isRecord: true,
  };
}

// ── fallback local ────────────────────────────────────────
const LOCAL_KEY = "gui:scores";
const NAME_KEY = "gui:snake-name";

/** Último código gravado: volta preenchido na próxima partida, tipo fliperama de bar. */
export function lastName(): string {
  try {
    const v = (localStorage.getItem(NAME_KEY) ?? "").toUpperCase();
    return INITIALS.test(v) ? v : "";
  } catch {
    return "";
  }
}

function rememberName(id: string) {
  try {
    localStorage.setItem(NAME_KEY, id);
  } catch {}
}

function readLocal(): Score[] {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeLocal(list: Score[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch {}
}

function localBoard(id: string | null, isRecord = false): Board {
  const sorted = rankBoard(readLocal());
  return {
    top: sorted.slice(0, TOP_N),
    rank: id ? positionOf(sorted, id) : null,
    personal: id ? (sorted.find((s) => s.id === id) ?? null) : null,
    isRecord,
    offline: true,
  };
}

// ── API ───────────────────────────────────────────────────
export async function fetchBoard(): Promise<Board> {
  try {
    const r = await fetch("/api/scores", { cache: "no-store" });
    if (!r.ok) throw new Error(String(r.status));
    return await r.json();
  } catch {
    return localBoard(null);
  }
}

export async function submitScore(name: string, score: number): Promise<Board> {
  const id = name.trim().toUpperCase();
  rememberName(id); // guarda mesmo se a gravação falhar — é preferência local
  try {
    const r = await fetch("/api/scores", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: id, score }),
    });
    if (!r.ok) throw new Error(String(r.status));
    return await r.json();
  } catch {
    const { list, isRecord } = upsert(
      readLocal(),
      id,
      score,
      new Date().toISOString(),
    );
    writeLocal(list);
    return localBoard(id, isRecord);
  }
}
