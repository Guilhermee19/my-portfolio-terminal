import { NextResponse } from "next/server";
import { VISITOR_ID, aggregate, touch, type Visit } from "@/lib/visits";

// contador muda a cada acesso — nada de cache
export const dynamic = "force-dynamic";

/** Mesma ponte do placar: o json-server é http:// e o site é https://. */
const BASE = process.env.JSON_SERVER_URL ?? "http://62.171.172.35:3004";
const RESOURCE = "/visits";

const req = (path: string, init?: RequestInit) =>
  fetch(`${BASE}${path}`, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
    headers: { "content-type": "application/json", ...init?.headers },
  });

async function all(): Promise<Visit[]> {
  const r = await req(RESOURCE);
  if (!r.ok) throw new Error(`json-server ${RESOURCE}: ${r.status}`);
  return r.json();
}

export async function GET() {
  try {
    return NextResponse.json(aggregate(await all()));
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

  const id = String((body as { id?: unknown })?.id ?? "").toLowerCase();
  if (!VISITOR_ID.test(id))
    return NextResponse.json(
      { error: "id de visitante inválido" },
      { status: 400 },
    );

  try {
    const list = await all();
    const { entry, isNew, list: updated } = touch(list, id);

    const w = isNew
      ? await req(RESOURCE, { method: "POST", body: JSON.stringify(entry) })
      : await req(`${RESOURCE}/${encodeURIComponent(id)}`, {
          method: "PUT",
          body: JSON.stringify(entry),
        });
    if (!w.ok) throw new Error(`gravação falhou: ${w.status}`);

    // devolve já agregado: o card resolve tudo numa requisição só
    return NextResponse.json(aggregate(updated));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 503 });
  }
}
