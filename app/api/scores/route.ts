import { NextResponse } from "next/server";
import {
  INITIALS,
  TOP_N,
  positionOf,
  rankBoard,
  upsert,
  type Board,
  type Score,
} from "@/lib/scores";

// o placar muda a cada partida — nada de cache
export const dynamic = "force-dynamic";

/** O json-server é http://; este handler é a ponte, senão o browser bloquearia (mixed content). */
const BASE = process.env.JSON_SERVER_URL ?? "http://62.171.172.35:3004";

/** Um placar por jogo. `max` é o teto de sanidade: barra valor absurdo, não fraude. */
const GAMES = {
  snake: { resource: "/point-snake", max: 28 * 20 * 10 },
  tetris: { resource: "/point-tetris", max: 999_999 },
} as const;

type GameKey = keyof typeof GAMES;
const isGame = (v: unknown): v is GameKey =>
  typeof v === "string" && v in GAMES;

const req = (path: string, init?: RequestInit) =>
  fetch(`${BASE}${path}`, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(5000), // o VPS não pode pendurar a rota
    headers: { "content-type": "application/json", ...init?.headers },
  });

async function all(game: GameKey): Promise<Score[]> {
  const resource = GAMES[game].resource;
  const r = await req(resource);
  if (!r.ok) throw new Error(`json-server ${resource}: ${r.status}`);
  return r.json();
}

const badGame = () =>
  NextResponse.json(
    { error: `game deve ser ${Object.keys(GAMES).join(" ou ")}` },
    { status: 400 },
  );

function board(list: Score[], id: string | null, isRecord: boolean): Board {
  const sorted = rankBoard(list);
  return {
    top: sorted.slice(0, TOP_N),
    rank: id ? positionOf(sorted, id) : null,
    personal: id ? (sorted.find((s) => s.id === id) ?? null) : null,
    isRecord,
    offline: false,
  };
}

export async function GET(request: Request) {
  const game = new URL(request.url).searchParams.get("game");
  if (!isGame(game)) return badGame();
  try {
    return NextResponse.json(board(await all(game), null, false));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "json inválido" }, { status: 400 });
  }

  const { game, name, score } = (body ?? {}) as {
    game?: unknown;
    name?: unknown;
    score?: unknown;
  };
  if (!isGame(game)) return badGame();

  const id = String(name ?? "")
    .trim()
    .toUpperCase();

  if (!INITIALS.test(id))
    return NextResponse.json(
      { error: "nome deve ter de 1 a 5 caracteres A-Z ou Ø-9" },
      { status: 400 },
    );

  const max = GAMES[game].max;
  if (
    !Number.isInteger(score) ||
    (score as number) < 0 ||
    (score as number) > max
  )
    return NextResponse.json(
      { error: `score fora do intervalo Ø..${max}` },
      { status: 400 },
    );

  try {
    const list = await all(game);
    const RESOURCE = GAMES[game].resource;
    const { entry, isRecord } = upsert(
      list,
      id,
      score as number,
      new Date().toISOString(),
    );

    // o json-server aceita id string (os dados existentes já usam)
    const exists = list.some((s) => s.id === id);
    const w = exists
      ? await req(`${RESOURCE}/${encodeURIComponent(id)}`, {
          method: "PUT",
          body: JSON.stringify(entry),
        })
      : await req(RESOURCE, { method: "POST", body: JSON.stringify(entry) });

    if (!w.ok) throw new Error(`gravação falhou: ${w.status}`);

    const updated = exists
      ? list.map((s) => (s.id === id ? entry : s))
      : [...list, entry];
    return NextResponse.json(board(updated, id, isRecord));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 503 });
  }
}
