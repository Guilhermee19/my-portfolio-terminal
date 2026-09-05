"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";

export const NAV = [
  { id: "sobre", n: "Ø1" },
  { id: "stack", n: "Ø2" },
  { id: "servicos", n: "Ø3" },
  { id: "projetos", n: "Ø4" },
  { id: "certificados", n: "Ø5" },
  { id: "contato", n: "Ø6" },
];

export const openTerminal = () =>
  window.dispatchEvent(new Event("gui:terminal"));

export function OpenTerminalButton({ className }: { className?: string }) {
  return (
    <button onClick={openTerminal} className={className}>
      &gt;_ ABRIR TERMINAL
    </button>
  );
}

export function TopBar() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString("pt-BR", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-80 border-b border-grn/20 bg-bg/85 backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-3 py-2 sm:px-6">
        <a
          href="#topo"
          className="shrink-0 text-xs font-bold tracking-[0.2em] text-grn glow"
        >
          USER: GUI
        </a>
        <span className="lbl hidden shrink-0 border border-grn/30 px-2 py-0.5 md:block">
          Ø2
        </span>

        <nav className="flex flex-1 items-center gap-3 overflow-x-auto text-[10px] tracking-[0.18em] [scrollbar-width:none] sm:gap-5 sm:text-[11px]">
          {NAV.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 text-dim uppercase transition-colors hover:text-grn hover:glow"
            >
              <span className="text-grn/40">{s.n}</span> {s.id}
            </a>
          ))}
        </nav>

        <span className="lbl hidden shrink-0 tabular-nums lg:block">
          {clock}
        </span>
        <button
          onClick={openTerminal}
          title="Abrir terminal (~)"
          className="shrink-0 border border-grn/40 px-2 py-0.5 text-[10px] tracking-[0.15em] text-grn transition-colors hover:bg-grn hover:text-bg"
        >
          &gt;_
        </button>
        <span
          className="h-1.5 w-1.5 shrink-0 animate-blink bg-grn"
          aria-hidden
        />
      </div>
      <motion.div
        style={{ scaleX: x }}
        className="h-px origin-left bg-grn"
        aria-hidden
      />
    </header>
  );
}

export function BottomBar() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-80 hidden border-t border-grn/20 bg-bg/85 backdrop-blur-[2px] sm:block"
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-6 py-1.5 text-[10px] tracking-[0.2em] text-dim">
        <span className="text-grn">F1_SCAN</span>
        <span>F2_RUN_FN</span>
        <span>F3_SCAN_R</span>
        <span className="hidden md:inline">SET REVISED ØØ5</span>
        <span className="ml-auto hidden md:inline">+Ø.Ø12</span>
        <span className="text-alert">-Ø.ØØ5</span>
        <span className="hidden lg:inline">SCHR_V1Ø.Ø4.1998</span>
      </div>
    </div>
  );
}

/** Trilhos verticais decorativos (só desktop) — a moldura de HUD das referências. */
export function SideRails() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-70 hidden xl:block"
    >
      <div className="absolute inset-y-0 left-6 w-px bg-grn/15" />
      <div className="absolute inset-y-0 right-6 w-px bg-grn/15" />
      {/* -translate-x-1/2 centra o texto girado na linha do trilho (não invade o conteúdo) */}
      <div className="absolute top-1/2 left-6 -translate-x-1/2 -translate-y-1/2 -rotate-90 text-[10px] tracking-[0.5em] whitespace-nowrap text-dim/70">
        SYSTEM ONLINE
      </div>
      <div className="absolute top-1/2 right-6 translate-x-1/2 -translate-y-1/2 rotate-90 text-[10px] tracking-[0.5em] whitespace-nowrap text-dim/70">
        UNIT SR-A
      </div>
      <div className="absolute top-24 right-8 h-40 w-px overflow-hidden">
        <div className="h-8 w-full animate-sweep bg-gradient-to-b from-transparent via-grn to-transparent" />
      </div>
    </div>
  );
}
