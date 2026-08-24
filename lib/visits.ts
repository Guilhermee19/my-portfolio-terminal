/**
 * Contador de acessos. Um registro por VISITANTE, não por acesso: o json-server
 * guarda a coleção inteira num arquivo e devolve tudo no GET, então um registro
 * por acesso cresceria sem teto. Assim o arquivo só cresce com gente nova e cada
 * registro tem tamanho constante (`days` é podado na gravação).
 *
 * Nada de IP, user-agent ou fingerprint — só um id aleatório no navegador.
 */
export type Visit = {
  id: string;
  first: string; // ISO
  last: string; // ISO
  count: number; // sessões deste visitante
  days: Record<string, number>; // "2026-08-24": 2
};

export type Metrics = { total: number; week: number; unique: number };

export const VISITOR_ID = /^[a-z0-9-]{8,64}$/;
const KEEP_DAYS = 14; // o suficiente pra semana, com folga

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

/** Últimos N dias, do mais recente pro mais antigo. */
function lastDays(now: Date, n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    return dayKey(d);
  });
}

/** As três métricas do hero. Pura de propósito: é o que o teste cobre. */
export function aggregate(list: Visit[], now = new Date()): Metrics {
  const week = new Set(lastDays(now, 7));
  let total = 0;
  let inWeek = 0;
  for (const v of list) {
    total += v.count ?? 0;
    for (const [day, n] of Object.entries(v.days ?? {}))
      if (week.has(day)) inWeek += n;
  }
  return { total, week: inWeek, unique: list.length };
}

/** Upsert do visitante + poda dos dias velhos. Devolve o registro e se é novo. */
export function touch(list: Visit[], id: string, now = new Date()) {
  const today = dayKey(now);
  const keep = new Set(lastDays(now, KEEP_DAYS));
  const current = list.find((v) => v.id === id);

  const days: Record<string, number> = {};
  for (const [d, n] of Object.entries(current?.days ?? {}))
    if (keep.has(d)) days[d] = n;
  days[today] = (days[today] ?? 0) + 1;

  const entry: Visit = {
    id,
    first: current?.first ?? now.toISOString(),
    last: now.toISOString(),
    count: (current?.count ?? 0) + 1,
    days,
  };

  return {
    entry,
    isNew: !current,
    list: current
      ? list.map((v) => (v.id === id ? entry : v))
      : [...list, entry],
  };
}

// ── cliente ───────────────────────────────────────────────
const VID_KEY = "gui:vid";
const SESSION_KEY = "gui:visited";

/**
 * `crypto.randomUUID` só existe em contexto seguro — em http:// puro ele é
 * undefined e o contador morreria calado. `getRandomValues` funciona nos dois.
 */
function newId(): string {
  if (typeof crypto?.randomUUID === "function") return crypto.randomUUID();
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return [...b].map((n) => n.toString(16).padStart(2, "0")).join("");
}

/** Id anônimo do navegador. Sem ele, todo acesso viraria um "único" novo. */
export function visitorId(): string {
  try {
    const saved = localStorage.getItem(VID_KEY);
    if (saved && VISITOR_ID.test(saved)) return saved;
    const id = newId();
    localStorage.setItem(VID_KEY, id);
    return id;
  } catch {
    return "";
  }
}

/**
 * Registra o acesso (uma vez por sessão) e devolve as métricas.
 * `null` = deu ruim; os cards ficam nos traços e o site segue normal.
 */
export async function registerVisit(): Promise<Metrics | null> {
  // seu `npm run dev` não é audiência.
  // pra testar o registro localmente: localStorage.setItem("gui:count-local","1")
  let local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  let counted = true;
  try {
    if (localStorage.getItem("gui:count-local") === "1") local = false;
    counted = sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {}

  try {
    if (local || counted) {
      const r = await fetch("/api/visits", { cache: "no-store" });
      return r.ok ? await r.json() : null;
    }
    const id = visitorId();
    if (!id) return null;
    const r = await fetch("/api/visits", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!r.ok) return null;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
    return await r.json();
  } catch {
    return null;
  }
}
