"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18, filter: "blur(3px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.7, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZØ0123456789#%$&/\\<>=";

/** Texto que "decodifica" ao entrar na viewport. Mantém o texto real no DOM (a11y/SEO). */
export function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      setOut(
        text
          .split("")
          .map((c, i) =>
            c === " " || i < frame - 3
              ? c
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(""),
      );
      if (frame - 3 > text.length) clearInterval(id);
    }, 34);
    return () => clearInterval(id);
  }, [inView, text]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden>{out}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
