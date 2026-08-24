"use client";

import { useEffect, useState } from "react";
import { registerVisit, type Metrics } from "@/lib/visits";

const CARDS = [
  { tag: "ACESSOS/\\", key: "total", foot: "TOTAL" },
  { tag: "SEMANA/\\", key: "week", foot: "7 DIAS" },
  { tag: "ÚNICOS/\\", key: "unique", foot: "VISITANTES" },
] as const;

export default function AccessCards() {
  const [m, setM] = useState<Metrics | null>(null);

  useEffect(() => {
    registerVisit().then(setM);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2">
      {CARDS.map((c) => (
        <div
          key={c.key}
          className="border border-grn/25 px-2 py-2 text-center"
          title={m ? undefined : "contador indisponível"}
        >
          <div className="text-[9px] text-grn/60">{c.tag}</div>
          {/* traços enquanto carrega ou se a API cair — já é a cara de um HUD */}
          <div className="mt-1 text-base font-extrabold text-grn tabular-nums glow sm:text-lg">
            {m ? m[c.key].toLocaleString("pt-BR") : "----"}
          </div>
          <div className="text-[9px] text-dim">{c.foot}</div>
        </div>
      ))}
    </div>
  );
}
