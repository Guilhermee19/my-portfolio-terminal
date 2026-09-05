"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import Modal from "@/components/modal";
import CrtImage from "@/components/crt-image";
import { certificates, type Certificate } from "@/lib/data";

const kindColor = (k: Certificate["kind"]) =>
  k === "FORMAÇÃO"
    ? "border-grn/60 text-grn"
    : k === "CURSO"
      ? "border-grn/30 text-grn-2/80"
      : "border-dim/50 text-dim";

export default function Certificates() {
  const [open, setOpen] = useState<Certificate | null>(null);
  /* o filtro de fósforo é bonito, mas diploma é pra ser lido */
  const [raw, setRaw] = useState(false);

  const close = () => {
    setOpen(null);
    setRaw(false);
  };

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((c, i) => (
          <Reveal key={c.idx} delay={i * 0.04}>
            <button
              type="button"
              onClick={() => setOpen(c)}
              aria-haspopup="dialog"
              className="brk panel group flex h-full w-full flex-col px-4 py-4 text-left transition-colors hover:border-grn/60 hover:bg-grn/[0.07]"
            >
              <CrtImage
                src={c.image}
                alt={`${c.title} — ${c.issuer}`}
                className="aspect-[4/3] w-full"
              />

              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`border px-2 py-0.5 text-[9px] tracking-[0.15em] ${kindColor(c.kind)}`}
                >
                  {c.kind}
                </span>
                <span className="lbl ml-auto">{c.year}</span>
              </div>

              <h3 className="mt-2.5 text-[13px] leading-5 font-bold tracking-[0.06em] text-grn-2 transition-colors group-hover:text-grn">
                {c.title}
              </h3>
              <p className="lbl mt-1.5">
                {c.issuer}
                {c.hours && ` · ${c.hours}`}
              </p>

              <span className="mt-4 text-[10px] tracking-[0.2em] text-dim group-hover:text-grn">
                ABRIR ▸
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <Modal
        open={!!open}
        onClose={close}
        tag={`CRT.${open?.idx ?? ""}`}
        label={open?.title ?? "Certificado"}
        actions={
          open?.image ? (
            <button
              onClick={() => setRaw((v) => !v)}
              className="border border-grn/30 px-2 py-0.5 text-[10px] tracking-[0.15em] text-dim transition-colors hover:border-grn hover:text-grn"
            >
              {raw ? "VER NO TUBO" : "VER ORIGINAL"}
            </button>
          ) : null
        }
      >
        {open && (
          <div className="space-y-6">
            <CrtImage
              src={open.image}
              alt={`${open.title} — ${open.issuer}`}
              filtered={!raw}
              priority
              className="aspect-[4/3] w-full"
            />

            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span
                  className={`border px-2 py-0.5 text-[9px] tracking-[0.15em] ${kindColor(open.kind)}`}
                >
                  {open.kind}
                </span>
                <span className="lbl">{open.year}</span>
                {open.hours && <span className="lbl">· {open.hours}</span>}
              </div>

              <h3 className="mt-3 text-lg font-extrabold tracking-[0.06em] text-grn glow sm:text-xl">
                {open.title}
              </h3>
              <p className="mt-1.5 text-xs tracking-[0.15em] text-grn-2/70">
                {open.issuer}
              </p>
            </div>

            {open.desc && (
              <p className="text-[13px] leading-7 text-grn-2/75">{open.desc}</p>
            )}

            {open.href && (
              <div className="border-t border-grn/15 pt-5">
                <a
                  href={open.href}
                  target="_blank"
                  rel="noreferrer"
                  className="brk inline-block border border-grn bg-grn/10 px-5 py-2.5 text-[11px] tracking-[0.25em] text-grn transition-colors hover:bg-grn hover:text-bg"
                >
                  VALIDAR ↗
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
