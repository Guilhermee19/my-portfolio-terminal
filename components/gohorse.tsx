"use client";

import { useEffect } from "react";

// cavalo em ASCII — o mascote da metodologia
const HORSE = String.raw`
                        ,--,
                  _ ___/ /\|
              ,;'( )__, ) '
             //  //   '--;
             '   \     |
                 ^     ^
`.trimEnd();

/** Axiomas no espírito do XGH — escritos aqui, não copiados do original. */
const AXIOMS = [
  "Pensou, não é Go Horse. Go Horse é fazer.",
  "Existem três soluções: a certa, a rápida, e a que já está em produção.",
  "Se compilou, está pronto. Se subiu, está testado.",
  "Comentário atrasa o deploy. O código se explica pra quem nunca vai ler.",
  "Prazo é sugestão do cliente. Gambiarra é sugestão sua.",
  "Refatorar é admitir que errou. Go Horse não erra, Go Horse itera.",
  "Bug em produção não é bug: é comportamento não documentado.",
  "Copiou da internet e funcionou? Isso chama reuso.",
  "Teste unitário é pra quem tem tempo. Você tem prazo.",
  "Não existe código legado. Existe código que sobreviveu.",
  "`git push --force` resolve qualquer conflito. E qualquer amizade.",
  "Quando o cliente reclamar, a culpa é do cache.",
];

export default function GoHorse({ onExit }: { onExit: () => void }) {
  useEffect(() => {
    const off = (e: KeyboardEvent) => e.key === "Escape" && onExit();
    window.addEventListener("keydown", off);
    return () => window.removeEventListener("keydown", off);
  }, [onExit]);

  return (
    <div
      className="fixed inset-0 z-99 overflow-y-auto bg-bg px-5 py-10"
      role="dialog"
      aria-modal="true"
      aria-label="eXtreme Go Horse"
    >
      <div className="mx-auto max-w-2xl text-center">
        <pre
          aria-hidden
          className="mx-auto text-[10px] leading-tight text-grn/70 sm:text-xs"
        >
          {HORSE}
        </pre>

        <h2 className="mt-4 text-xl font-extrabold tracking-[0.18em] text-alert glow sm:text-3xl">
          eXtreme GO HORSE
        </h2>
        <p className="lbl mt-2">PROCESSO DE DESENVOLVIMENTO · XGH v3.Ø</p>

        <p className="mx-auto mt-6 max-w-lg text-[12px] leading-6 text-grn-2/70">
          A metodologia que todo mundo jura que não usa e todo projeto com prazo
          apertado acaba adotando na sexta à tarde.
        </p>

        <ol className="mx-auto mt-8 max-w-xl space-y-2.5 text-left">
          {AXIOMS.map((a, i) => (
            <li
              key={i}
              className="flex gap-3 text-[12px] leading-6 sm:text-[13px]"
            >
              <span className="shrink-0 font-bold text-alert">
                {String(i + 1).padStart(2, "Ø")}
              </span>
              <span className="text-grn-2/85">{a}</span>
            </li>
          ))}
        </ol>

        <div className="brk mt-10 inline-block border border-alert/50 px-6 py-4">
          <p className="text-[10px] tracking-[0.25em] text-alert">
            CERTIFICADO XGH
          </p>
          <p className="mt-1 text-[11px] text-grn-2/70">
            válido até a próxima sprint
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={onExit}
            className="brk border border-grn px-6 py-2 text-xs tracking-[0.25em] text-grn transition-colors hover:bg-grn hover:text-bg"
          >
            » ACEITO OS RISCOS «
          </button>
          <p className="lbl mt-3">ESC também sai (mas aí você não aceitou)</p>
        </div>
      </div>
    </div>
  );
}
