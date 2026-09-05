"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import Modal from "@/components/modal";
import CrtImage from "@/components/crt-image";
import { projects, type Project } from "@/lib/data";

const statusColor = (s: Project["status"]) =>
  s === "ONLINE"
    ? "border-grn/60 text-grn"
    : s === "EM CURSO"
      ? "border-alert/60 text-alert"
      : "border-dim/50 text-dim";

export default function ProjectGrid() {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <>
      <div className="grid gap-3 lg:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.idx} delay={i * 0.04}>
            <button
              type="button"
              onClick={() => setOpen(p)}
              aria-haspopup="dialog"
              className="brk panel group flex h-full w-full flex-col px-5 py-5 text-left transition-colors hover:border-grn/60 hover:bg-grn/[0.07]"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-extrabold text-grn/35">
                  {p.idx}
                </span>
                <span className="h-px flex-1 bg-grn/15" />
                <span
                  className={`border px-2 py-0.5 text-[9px] tracking-[0.15em] ${statusColor(p.status)}`}
                >
                  {p.status}
                </span>
                <span className="lbl">{p.year}</span>
              </div>

              <h3 className="mt-3 text-base font-extrabold tracking-[0.08em] text-grn-2 transition-colors group-hover:text-grn group-hover:glow sm:text-lg">
                {p.name}
              </h3>
              <p className="mt-2 flex-1 text-[12px] leading-6 text-grn-2/60">
                {p.desc}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="border border-grn/25 px-2 py-0.5 text-[9px] text-grn/70"
                  >
                    {t}
                  </span>
                ))}
                <span className="ml-auto text-[10px] tracking-[0.2em] text-dim group-hover:text-grn">
                  DETALHES ▸
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <Modal
        open={!!open}
        onClose={() => setOpen(null)}
        tag={`PRJ.${open?.idx ?? ""}`}
        label={open?.name ?? "Projeto"}
      >
        {open && (
          <div className="space-y-6">
            {open.shots?.length ? (
              <div className="space-y-2">
                {open.shots.map((s) => (
                  <CrtImage
                    key={s.src}
                    src={s.src}
                    alt={s.alt}
                    className="aspect-video w-full"
                  />
                ))}
              </div>
            ) : null}

            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span
                  className={`border px-2 py-0.5 text-[9px] tracking-[0.15em] ${statusColor(open.status)}`}
                >
                  {open.status}
                </span>
                <span className="lbl">{open.year}</span>
                {open.role && <span className="lbl">· {open.role}</span>}
              </div>

              <h3 className="mt-3 text-xl font-extrabold tracking-[0.06em] text-grn glow sm:text-2xl">
                {open.name}
              </h3>
            </div>

            <div className="space-y-4">
              {(open.about ?? [open.desc]).map((t) => (
                <p key={t} className="text-[13px] leading-7 text-grn-2/75">
                  {t}
                </p>
              ))}
            </div>

            <div>
              <span className="lbl">STACK</span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {open.tech.map((t) => (
                  <span
                    key={t}
                    className="border border-grn/25 px-2 py-0.5 text-[10px] text-grn/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {(open.href || open.repo) && (
              <div className="flex flex-wrap gap-2 border-t border-grn/15 pt-5">
                {open.href && (
                  <a
                    href={open.href}
                    target="_blank"
                    rel="noreferrer"
                    className="brk border border-grn bg-grn/10 px-5 py-2.5 text-[11px] tracking-[0.25em] text-grn transition-colors hover:bg-grn hover:text-bg"
                  >
                    EXECUTAR ↗
                  </a>
                )}
                {open.repo && (
                  <a
                    href={open.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-grn/30 px-5 py-2.5 text-[11px] tracking-[0.25em] text-dim transition-colors hover:border-grn hover:text-grn"
                  >
                    CÓDIGO ↗
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
