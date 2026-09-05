"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * A janela de popup do site — mesma linguagem do painel do terminal.
 * z-95: acima dos overlays de CRT do layout (z-9Ø) e abaixo das telas
 * cheias dos easter eggs (z-99).
 */
export default function Modal({
  open,
  onClose,
  tag,
  label,
  actions,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** rótulo do canto esquerdo do cabeçalho, ex.: "PRJ.Ø3" */
  tag: string;
  /** nome acessível do diálogo */
  label: string;
  /** botões extras no cabeçalho, antes do FECHAR */
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    // guarda quem abriu pra devolver o foco no fim
    opener.current = document.activeElement;
    closeRef.current?.focus();

    const off = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", off);

    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", off);
      html.style.overflow = prev;
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-95 flex items-end justify-center bg-bg/70 px-2 py-2 backdrop-blur-sm sm:items-center sm:px-4 sm:py-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            /* sem .panel: o gradiente dela sobrescreveria o fundo opaco */
            className="brk flex max-h-full w-full max-w-3xl flex-col border border-grn/30 bg-bg/95 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-md"
          >
            <div className="flex items-center gap-2 border-b border-grn/20 px-4 py-2">
              <span className="lbl shrink-0">{tag}</span>
              <span className="lbl hidden flex-1 text-center md:block">
                ESC fecha
              </span>
              <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
                {actions}
                <button
                  ref={closeRef}
                  onClick={onClose}
                  className="border border-grn/30 px-2 py-0.5 text-[10px] tracking-[0.15em] text-dim transition-colors hover:border-alert hover:text-alert"
                >
                  FECHAR
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-7">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
