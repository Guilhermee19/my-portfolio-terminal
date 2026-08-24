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
const RESOURCE = "/points-snake"; // a coleção no db.json do VPS
const MAX_SCORE = 28 * 20 * 10; // teto do tabuleiro: nem a partida perfeita passa disso

const req = (path: string, init?: RequestInit) =>
  fetch(`${BASE}${path}`, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(5000), // o VPS não pode pendurar a rota
    headers: { "content-type": "application/json", ...init?.headers },
  });

async function all(): Promise<Score[]> {
  const r = await req(RESOURCE);
  if (!r.ok) throw new Error(`json-server ${RESOURCE}: ${r.status}`);
  return r.json();
}

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

export async function GET() {
  try {
    return NextResponse.json(board(await all(), null, false));
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

  const { name, score } = (body ?? {}) as { name?: unknown; score?: unknown };
  const id = String(name ?? "")
    .trim()
    .toUpperCase();

  if (!INITIALS.test(id))
    return NextResponse.json(
      { error: "nome deve ter de 1 a 5 caracteres A-Z ou Ø-9" },
      { status: 400 },
    );

  if (
    !Number.isInteger(score) ||
    (score as number) < 0 ||
    (score as number) > MAX_SCORE
  )
    return NextResponse.json(
      { error: `score fora do intervalo Ø..${MAX_SCORE}` },
      { status: 400 },
    );

  try {
    const list = await all();
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
