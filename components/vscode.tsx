"use client";

import { useEffect, useState } from "react";

/**
 * Editor de mentira que abre o próprio código do portfólio — só o que desenha
 * a tela (markup e CSS). A lógica fica de fora de propósito: aqui é vitrine.
 */
type File = { name: string; lang: "css" | "tsx"; body: string };

const FILES: File[] = [
  {
    name: "globals.css",
    lang: "css",
    body: `@import "tailwindcss";

@theme {
  /* só --color-grn é literal: o resto deriva dela, então o comando
     \`theme\` do terminal repinta o site inteiro numa linha só. */
  --color-bg:    #030806;
  --color-grn:   #2bff88;
  --color-grn-2: color-mix(in oklab, var(--color-grn) 58%, #ffffff);
  --color-dim:   color-mix(in oklab, var(--color-grn) 62%, #04140c);
  --color-alert: #ff3b30;
}

html {
  /* a grade do fundo é CSS puro — nenhuma imagem no site inteiro */
  background-color: var(--color-bg);
  background-image:
    radial-gradient(circle at 50% 0%,
      color-mix(in oklab, var(--color-grn) 7%, transparent), transparent 55%),
    linear-gradient(color-mix(in oklab, var(--color-grn) 5.5%, transparent) 1px,
      transparent 1px);
  background-size: 100% 100%, 34px 34px;
  background-attachment: fixed;
}

/* tipografia listrada, tipo tela de boot dos anos 80 */
@utility striped {
  background-image: repeating-linear-gradient(0deg,
    var(--color-grn) 0 3px,
    color-mix(in oklab, var(--color-grn) 28%, transparent) 3px 5px);
  background-clip: text;
  color: transparent;
}`,
  },
  {
    name: "layout.tsx",
    lang: "tsx",
    body: `export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={jet.variable}>
      <body className="relative min-h-dvh">
        {children}

        {/* o CRT: três camadas fixas, decorativas, fora do foco */}
        <div aria-hidden
          className="pointer-events-none fixed inset-0 z-90 crt-scan opacity-60" />
        <div aria-hidden
          className="pointer-events-none fixed inset-0 z-90 crt-glow" />
        <div aria-hidden
          className="pointer-events-none fixed inset-0 z-90 bg-grn animate-flick" />
      </body>
    </html>
  );
}`,
  },
  {
    name: "page.tsx",
    lang: "tsx",
    body: `<section className="grid gap-8 py-10 lg:grid-cols-[1.4fr_1fr]">
  <div>
    <p className="mb-5 text-xs tracking-[0.2em] text-grn/70">
      &gt; SESSION ØØ1 · USER AUTHENTICATED
      <span className="ml-0.5 inline-block h-3 w-2 animate-blink bg-grn" />
    </p>

    <h1 className="text-[clamp(2.4rem,11vw,7rem)] leading-[0.86] font-extrabold">
      <span className="striped block">GUILHERME</span>
      <span className="striped block">SANTANA</span>
    </h1>

    <div className="mt-5 flex flex-wrap gap-x-4 border-y border-grn/20 py-2.5">
      <span className="bg-grn px-2 py-0.5 font-bold text-bg">
        FRONT-END ENGINEER
      </span>
      <span className="text-dim">UNIT SR-A · RIO DE JANEIRO / BR</span>
    </div>
  </div>
</section>`,
  },
  {
    name: "hud.tsx",
    lang: "tsx",
    body: `<header className="fixed inset-x-0 top-0 z-80 border-b border-grn/20
                   bg-bg/85 backdrop-blur-[2px]">
  <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-3 py-2">
    <a href="#topo" className="text-xs font-bold tracking-[0.2em] text-grn glow">
      USER: GUI
    </a>

    <nav className="flex flex-1 gap-3 overflow-x-auto text-[10px]">
      {NAV.map((s) => (
        <a key={s.id} href={\`#\${s.id}\`}
           className="shrink-0 text-dim uppercase hover:text-grn hover:glow">
          <span className="text-grn/40">{s.n}</span> {s.id}
        </a>
      ))}
    </nav>

    <span className="h-1.5 w-1.5 animate-blink bg-grn" aria-hidden />
  </div>
</header>`,
  },
];

// tokenizador mínimo: comentário, string, número/cor, custom property, palavra-chave
const TOKEN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|vh|vw|s|ms|%)?\b)|(--[\w-]+)|\b(import|export|default|function|return|const|let|className|style|aria-hidden|href|key)\b/g;

const CLASS = [
  "text-dim/70 italic", // comentário
  "text-grn-2", // string
  "text-alert/80", // número / cor
  "text-grn glow", // custom property
  "text-grn/90 font-bold", // palavra-chave
];

function highlight(line: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(line.slice(last, at));
    const group = m.slice(1).findIndex(Boolean);
    out.push(
      <span key={at} className={CLASS[group] ?? ""}>
        {m[0]}
      </span>,
    );
    last = at + m[0].length;
  }
  out.push(line.slice(last));
  return out;
}

export default function VSCode({ onExit }: { onExit: () => void }) {
  const [open, setOpen] = useState(0);
  const file = FILES[open];
  const lines = file.body.split("\n");

  useEffect(() => {
    const off = (e: KeyboardEvent) => e.key === "Escape" && onExit();
    window.addEventListener("keydown", off);
    return () => window.removeEventListener("keydown", off);
  }, [onExit]);

  return (
    <div
      className="fixed inset-0 z-99 flex flex-col bg-bg text-[12px]"
      role="dialog"
      aria-modal="true"
      aria-label="Editor"
    >
      {/* barra de título */}
      <div className="flex shrink-0 items-center gap-3 border-b border-grn/20 px-3 py-1.5">
        <span className="flex gap-1.5" aria-hidden>
          <i className="h-2.5 w-2.5 rounded-full bg-alert/70" />
          <i className="h-2.5 w-2.5 rounded-full bg-grn/50" />
          <i className="h-2.5 w-2.5 rounded-full bg-dim/60" />
        </span>
        <span className="lbl flex-1 text-center">
          portfolio-terminal — GUI CODE
        </span>
        <button
          onClick={onExit}
          className="border border-grn/30 px-2 py-0.5 text-[10px] tracking-[0.15em] text-dim hover:border-alert hover:text-alert"
        >
          FECHAR
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* explorer */}
        <aside className="hidden w-52 shrink-0 flex-col border-r border-grn/20 py-2 sm:flex">
          <p className="lbl px-3 pb-2">EXPLORER</p>
          <p className="px-3 py-0.5 text-[11px] text-grn/70">
            ▾ portfolio-terminal
          </p>
          {FILES.map((f, i) => (
            <button
              key={f.name}
              onClick={() => setOpen(i)}
              className={`px-3 py-0.5 pl-7 text-left text-[11px] transition-colors ${
                i === open
                  ? "bg-grn/10 text-grn"
                  : "text-grn-2/60 hover:text-grn"
              }`}
            >
              {f.name}
            </button>
          ))}
          <p className="mt-auto px-3 pt-3 text-[10px] leading-5 text-dim">
            só a camada de tela.
            <br />a lógica fica no repositório.
          </p>
        </aside>

        {/* abas + código */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 overflow-x-auto border-b border-grn/20">
            {FILES.map((f, i) => (
              <button
                key={f.name}
                onClick={() => setOpen(i)}
                className={`shrink-0 border-r border-grn/15 px-3 py-1.5 text-[11px] ${
                  i === open
                    ? "border-t border-t-grn bg-grn/8 text-grn"
                    : "text-dim hover:text-grn-2"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-auto py-2">
            <pre className="w-max min-w-full">
              {lines.map((l, i) => (
                <div key={i} className="flex hover:bg-grn/[0.04]">
                  <span className="w-12 shrink-0 pr-3 text-right text-dim/50 select-none">
                    {i + 1}
                  </span>
                  <span className="pr-6 whitespace-pre text-grn-2/85">
                    {highlight(l) as React.ReactNode}
                  </span>
                </div>
              ))}
            </pre>
          </div>
        </main>
      </div>

      {/* status bar */}
      <div className="flex shrink-0 items-center gap-4 border-t border-grn/20 bg-grn/[0.06] px-3 py-1 text-[10px] tracking-[0.12em] text-dim">
        <span className="text-grn">⎇ main</span>
        <span>⊗ Ø</span>
        <span>⚠ Ø</span>
        <span className="ml-auto hidden sm:inline">
          Ln {lines.length}, Col 1
        </span>
        <span>{file.lang === "css" ? "CSS" : "TypeScript JSX"}</span>
        <span className="hidden sm:inline">UTF-8</span>
        <span className="hidden sm:inline">LF</span>
      </div>
    </div>
  );
}
