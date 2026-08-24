import BootScreen from "@/components/boot-screen";
import Terminal from "@/components/terminal";
import {
  TopBar,
  BottomBar,
  SideRails,
  OpenTerminalButton,
} from "@/components/hud";
import { Reveal, Scramble } from "@/components/reveal";
import AccessCards from "@/components/access-cards";
import {
  profile,
  stats,
  stack,
  services,
  projects,
  timeline,
} from "@/lib/data";

const BIN = [
  "Ø1ØØ1ØØ11",
  "Ø1ØØØØØØ1",
  "Ø1ØØ11Ø1",
  "Ø1Ø1ØØ1Ø",
  "Ø1Ø1Ø1Ø1",
  "Ø1ØØØØØ1",
];

function Head({ n, title, sub }: { n: string; title: string; sub: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-grn/20 pb-3">
      <h2 className="text-xl font-extrabold tracking-[0.14em] text-grn sm:text-3xl">
        <span className="mr-3 text-grn/35">[ {n} ]</span>
        <Scramble text={title} />
      </h2>
      <span className="lbl">// {sub}</span>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <BootScreen />
      <Terminal />
      <TopBar />
      <SideRails />
      <BottomBar />

      <main
        id="topo"
        className="mx-auto max-w-[1400px] px-4 pt-16 pb-24 sm:px-6 xl:px-14"
      >
        {/* ══ HERO ══ */}
        <section className="grid gap-8 py-10 lg:grid-cols-[1.4fr_1fr] lg:py-20">
          <div>
            <p className="mb-5 text-xs tracking-[0.2em] text-grn/70">
              &gt; SESSION ØØ1 · USER AUTHENTICATED
              <span className="ml-0.5 inline-block h-3 w-2 animate-blink bg-grn align-middle" />
            </p>

            <h1 className="text-[clamp(2.4rem,11vw,7rem)] leading-[0.86] font-extrabold tracking-[-0.02em]">
              <span className="striped block">GUILHERME</span>
              <span className="striped block">SANTANA</span>
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-grn/20 py-2.5 text-[11px] tracking-[0.2em] sm:text-xs">
              <span className="bg-grn px-2 py-0.5 font-bold text-bg">
                {profile.role}
              </span>
              <span className="text-dim">{profile.unit}</span>
              <span className="text-dim">{profile.build}</span>
            </div>

            <p className="mt-6 max-w-2xl text-[13px] leading-7 text-grn-2/75 sm:text-sm">
              {profile.intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projetos"
                className="brk border border-grn bg-grn/10 px-6 py-3 text-[11px] tracking-[0.25em] text-grn transition-colors hover:bg-grn hover:text-bg"
              >
                » VER PROJETOS
              </a>
              <OpenTerminalButton className="brk border border-grn/35 px-6 py-3 text-[11px] tracking-[0.25em] text-dim transition-colors hover:border-grn hover:text-grn" />
            </div>
          </div>

          {/* painel de leitura — HUD lateral */}
          <div className="flex flex-col gap-3">
            <div className="brk panel p-4">
              <div className="mb-3 flex justify-between">
                <span className="lbl">READING</span>
                <span className="text-xs text-grn glow">1ØØ%</span>
              </div>
              {[
                ["RWS [2-1]", "UPDATED"],
                ["SYS", "STABLE"],
                ["LATENCY", "12ms"],
                ["ERRORS", "ØØØ"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between border-t border-grn/10 py-1.5 text-[11px]"
                >
                  <span className="text-dim">{k}</span>
                  <span className="text-grn-2">{v}</span>
                </div>
              ))}
              <div className="mt-3 flex items-center gap-1 text-grn/60">
                {">>>>>>>".split("").map((c, i) => (
                  <span
                    key={i}
                    style={{ opacity: 0.25 + i * 0.11 }}
                    className="text-lg leading-none"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-grn/10 pt-3">
                <span className="h-2 w-2 animate-blink bg-grn" />
                <span className="lbl">SYSTEM ONLINE</span>
              </div>
            </div>

            <AccessCards />

            <div className="hidden grid-cols-2 gap-3 lg:grid">
              <div className="panel px-3 py-2 text-[9px] leading-4 text-grn/40">
                {BIN.map((b) => (
                  <div key={b}>{b}</div>
                ))}
              </div>
              <div className="panel flex flex-col justify-between px-3 py-2">
                <span className="lbl">SR-A</span>
                <span className="text-right text-2xl font-extrabold text-grn/80">
                  12/158
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ══ TICKER ══ */}
        <div className="relative -mx-4 overflow-hidden border-y border-grn/20 bg-grn/[0.03] py-2 sm:-mx-6 xl:-mx-14">
          <div className="flex w-max animate-marq gap-8 text-[11px] tracking-[0.3em] text-grn/45 whitespace-nowrap">
            {[0, 1].map((k) => (
              <div key={k} className="flex gap-8" aria-hidden={k === 1}>
                {[
                  ...stack.map((s) => s.name),
                  "WEBGL",
                  "SSR",
                  "A11Y",
                  "PERFORMANCE",
                  "TAURI",
                  "GIT",
                ].map((t) => (
                  <span key={t}>▸ {t}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ══ Ø1 SOBRE ══ */}
        <section id="sobre" className="scroll-mt-20 pt-20">
          <Reveal>
            <Head n="Ø1" title="SOBRE" sub="dossiê do operador" />
          </Reveal>

          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr]">
            <Reveal className="space-y-6">
              <p className="text-[13px] leading-7 text-grn-2/80 sm:text-sm">
                Me chamo {profile.name}, tenho 27 anos e moro no Rio de Janeiro.
                Sou formado em Ciência da Computação pela UNIFESO e trabalho com
                front-end desde 2020, quando entrei como estagiário e descobri
                que interface é onde a lógica encontra o cuidado com o detalhe.
              </p>
              <p className="text-[13px] leading-7 text-grn-2/80 sm:text-sm">
                Trabalho principalmente com Angular, React e Next.js. Gosto de
                código que outra pessoa consiga ler no plantão das 3h da manhã,
                de página que carrega rápido em 3G e de projeto que sobrevive à
                segunda versão. Fora do trabalho, RPG de mesa e cena 3D no
                navegador.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="brk panel px-4 py-4">
                    <div className="text-3xl font-extrabold text-grn glow">
                      {s.value}
                    </div>
                    <div className="lbl mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <div className="relative border-l border-grn/20 pl-6">
              {timeline.map((t, i) => (
                <Reveal key={t.year} delay={i * 0.05}>
                  <div className="group relative pb-8">
                    <span className="absolute top-1.5 -left-[27px] h-2.5 w-2.5 border border-grn bg-bg transition-colors group-hover:bg-grn" />
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm font-bold text-grn">
                        {t.year}
                      </span>
                      <span className="h-px flex-1 bg-grn/15" />
                      <span className="lbl">
                        LOG {String(i + 1).padStart(3, "Ø")}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-xs font-bold tracking-[0.15em] text-grn-2 sm:text-sm">
                      {t.title}
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-6 text-grn-2/60">
                      {t.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ Ø2 STACK ══ */}
        <section id="stack" className="scroll-mt-20 pt-20">
          <Reveal>
            <Head n="Ø2" title="STACK" sub="módulos carregados" />
          </Reveal>

          <div className="grid gap-3 md:grid-cols-2">
            {stack.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.04}>
                <div className="panel px-4 py-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold tracking-[0.15em] text-grn-2">
                      {s.name}
                    </span>
                    <span className="lbl">{s.tag}</span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="h-2 flex-1 border border-grn/30 p-[1px]">
                      {/* barra em blocos, estilo dot-matrix */}
                      <div
                        className="h-full bg-grn/75"
                        style={{
                          width: `${s.level}%`,
                          backgroundImage:
                            "repeating-linear-gradient(90deg,var(--color-grn) 0 5px,transparent 5px 7px)",
                        }}
                      />
                    </div>
                    <span className="w-9 text-right text-[11px] tabular-nums text-grn">
                      {s.level}%
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══ Ø3 SERVIÇOS ══ */}
        <section id="servicos" className="scroll-mt-20 pt-20">
          <Reveal>
            <Head n="Ø3" title="SERVICOS" sub="o que eu entrego" />
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.04}>
                <div className="brk panel group h-full px-5 py-5 transition-colors hover:border-grn/60 hover:bg-grn/[0.07]">
                  <div className="flex items-center justify-between">
                    <span className="lbl">{s.id}</span>
                    <span className="text-grn/30 transition-transform group-hover:translate-x-1">
                      ↗
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-bold tracking-[0.12em] text-grn">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[12px] leading-6 text-grn-2/60">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══ Ø4 PROJETOS ══ */}
        <section id="projetos" className="scroll-mt-20 pt-20">
          <Reveal>
            <Head
              n="Ø4"
              title="PROJETOS"
              sub={`${projects.length} entradas descriptografadas`}
            />
          </Reveal>

          <div className="grid gap-3 lg:grid-cols-2">
            {projects.map((p, i) => {
              return (
                <Reveal key={p.idx} delay={i * 0.04}>
                  {/* sem href = card estático; <a> sem href não entra na ordem de tab */}
                  <a
                    href={p.href}
                    target={p.href ? "_blank" : undefined}
                    rel="noreferrer"
                    className="brk panel group flex h-full flex-col px-5 py-5 transition-colors hover:border-grn/60 hover:bg-grn/[0.07]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-extrabold text-grn/35">
                        {p.idx}
                      </span>
                      <span className="h-px flex-1 bg-grn/15" />
                      <span
                        className={`border px-2 py-0.5 text-[9px] tracking-[0.15em] ${
                          p.status === "ONLINE"
                            ? "border-grn/60 text-grn"
                            : p.status === "EM CURSO"
                              ? "border-alert/60 text-alert"
                              : "border-dim/50 text-dim"
                        }`}
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
                      {p.href && (
                        <span className="ml-auto text-[10px] tracking-[0.2em] text-dim group-hover:text-grn">
                          EXECUTAR ↗
                        </span>
                      )}
                    </div>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ══ Ø5 CONTATO ══ */}
        <section id="contato" className="scroll-mt-20 pt-20">
          <Reveal>
            <Head n="Ø5" title="CONTATO" sub="canal aberto" />
          </Reveal>

          <Reveal>
            <div className="brk panel grid gap-8 px-5 py-8 sm:px-10 sm:py-12 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="text-2xl text-alert" aria-hidden>
                    ⚠
                  </span>
                  <span className="text-[11px] tracking-[0.25em] text-alert">
                    OUTSIDE LINK CONNECTED
                  </span>
                </div>

                <p className="text-xs leading-7 text-grn-2/70 sm:text-sm">
                  Tem um projeto, uma vaga ou só uma dúvida de front-end? Manda
                  mensagem. Respondo em até 24h úteis — e sim, leio tudo.
                </p>

                <a
                  href={`mailto:${profile.email}`}
                  className="mt-6 inline-block text-[clamp(1.2rem,5vw,2.6rem)] font-extrabold tracking-tight text-grn transition-all hover:glow"
                >
                  {profile.email}
                </a>

                <div className="mt-6 flex flex-wrap gap-2">
                  {profile.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-grn/30 px-4 py-2 text-[10px] tracking-[0.2em] text-dim transition-colors hover:border-grn hover:text-grn"
                    >
                      {s.label} ↗
                    </a>
                  ))}
                </div>
              </div>

              <div className="border-grn/15 lg:border-l lg:pl-8">
                <span className="lbl">TRANSMISSÃO</span>
                <div className="mt-3 space-y-1 text-[11px] leading-6 text-grn/55">
                  <p>&gt; whoami</p>
                  <p className="text-grn-2/80">
                    {profile.handle.toLowerCase()}@iamgui.dev
                  </p>
                  <p className="mt-3">&gt; locate</p>
                  <p className="text-grn-2/80">-22.4Ø, -42.97 · RJ / BR</p>
                  <p className="mt-3">&gt; status</p>
                  <p className="text-grn-2/80">DISPONÍVEL PARA FREELA</p>
                  <p className="mt-3">
                    &gt;{" "}
                    <span className="inline-block h-3 w-2 animate-blink bg-grn align-middle" />
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-grn/20 pt-5 text-[10px] tracking-[0.2em] text-dim">
          <span>© 2022–2026 GUILHERME SANTANA</span>
          <span className="hidden sm:inline">
            APERTE <span className="text-grn">~</span> PARA O CONSOLE · TENTE
            `HELP`
          </span>
          <a href="#topo" className="transition-colors hover:text-grn">
            ▲ TOPO
          </a>
        </footer>
      </main>
    </>
  );
}
