"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { bootLines } from "@/lib/data";

const TOTAL = bootLines.length;

export default function BootScreen() {
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);

  // se a sessão já bootou, o script inline do layout já escondeu isto — só desmonta
  useEffect(() => {
    if (sessionStorage.getItem("booted")) setOpen(false);
  }, []);

  useEffect(() => {
    if (shown >= TOTAL) {
      setDone(true);
      return;
    }
    const id = setTimeout(() => setShown((n) => n + 1), bootLines[shown].d);
    return () => clearTimeout(id);
  }, [shown]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [shown]);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const enter = () => {
    sessionStorage.setItem("booted", "1");
    setOpen(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return skipOrEnter();
      if (e.key === "Enter" || e.key === " ") skipOrEnter();
    };
    const skipOrEnter = () => (done ? enter() : setShown(TOTAL));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done]);

  const pct = Math.round((Math.min(shown, TOTAL) / TOTAL) * 100);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="boot"
          exit={{ opacity: 0, filter: "brightness(4)" }}
          transition={{ duration: 0.45, ease: "easeIn" }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-bg px-4"
        >
          <div className="brk panel w-full max-w-3xl p-5 sm:p-8">
            <div className="mb-4 flex items-baseline justify-between border-b border-grn/20 pb-3">
              <span className="lbl">SCHR-OS v1.3</span>
              <span className="text-alert text-[10px] tracking-[0.2em]">
                YOU ARE BEING MONITORED FOR [Y]OUR SAFETY
              </span>
            </div>

            <div
              ref={logRef}
              /* altura múltipla de leading-6 (24px) pra não cortar linha ao rolar */
              className="h-[240px] overflow-hidden text-[11px] leading-6 sm:h-[336px] sm:text-xs"
              role="log"
              aria-live="polite"
            >
              {bootLines.slice(0, shown).map((l, i) => (
                <div key={i} className={l.err ? "text-alert" : "text-grn/85"}>
                  {l.t}
                </div>
              ))}
              {!done && <span className="inline-block h-3 w-2 animate-blink bg-grn align-middle" />}
            </div>

            <div className="mt-6">
              <div className="mb-1.5 flex justify-between">
                <span className="lbl">LOADING</span>
                <span className="lbl">{pct}%</span>
              </div>
              <div className="h-3 border border-grn/50 p-[2px]">
                <div
                  className="h-full bg-grn/80 transition-[width] duration-150 ease-linear"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="lbl hidden sm:block">DVR.ID: GS-Ø1-DELTA</span>
              {done ? (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={enter}
                  autoFocus
                  className="brk border border-grn px-6 py-2 text-xs tracking-[0.3em] text-grn transition-colors hover:bg-grn hover:text-bg"
                >
                  » ENTER SYSTEM «
                </motion.button>
              ) : (
                <button onClick={() => setShown(TOTAL)} className="lbl underline underline-offset-4">
                  [ PULAR ]
                </button>
              )}
              <span className="lbl hidden sm:block">BUILD: STABLE_FINAL</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
