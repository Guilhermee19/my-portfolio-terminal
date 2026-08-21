"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile, projects, stack, THEMES } from "@/lib/data";

type Line = { t: string; k?: "err" | "ok" | "dim" | "hi" };
type Fx = null | "404" | "bug";

const PROMPT = "gui@iamgui.dev:~$";
const ROOT_PROMPT = "root@iamgui.dev:~#";

/** Easter egg, não segurança: isto é código de front-end, a senha vai no bundle
    e qualquer pessoa curiosa acha. É de propósito — o graça é procurar. */
const PASSWORD = "guilherme_mendonca";
const ROOT_KEY = "gui:root";

const FULL_LIST: Line[] = [
  { t: "ACESSO ROOT CONCEDIDO", k: "hi" },
  { t: "privilégios elevados · todos os comandos revelados", k: "ok" },
  { t: "" },
  { t: "SISTEMA", k: "hi" },
  { t: "  help · clear · exit · history · history clear · logout", k: "dim" },
  { t: "  ls · cat <arquivo> · whoami · date · ping", k: "dim" },
  { t: "  theme <verde|ambar|ciano|magenta|sangue|mono>", k: "dim" },
  { t: "  projetos · contato", k: "dim" },
  { t: "" },
  { t: "CLÁSSICOS", k: "hi" },
  { t: "  hello world · konami · matrix · hack · coffee · sudo · rm · vim · python", k: "dim" },
  { t: "" },
  { t: "TELAS CHEIAS", k: "hi" },
  { t: "  404 · bug", k: "dim" },
  { t: "" },
  { t: "REFERÊNCIAS", k: "hi" },
  { t: "  marvel · jarvis", k: "dim" },
  { t: "" },
  { t: "FRONT-END", k: "hi" },
  { t: "  !important · z-index · center · flex · npm install · yarn", k: "dim" },
  { t: "  undefined · nan · console.log · hydration", k: "dim" },
  { t: "" },
  { t: "BACK-END", k: "hi" },
  { t: "  sql · select · docker · k8s · kubernetes · cache · regex", k: "dim" },
  { t: "  deploy · env · chmod 777 · 500", k: "dim" },
  { t: "" },
  { t: "DEV EM GERAL", k: "hi" },
  { t: "  git blame · git push --force · stackoverflow · so · tabs · spaces", k: "dim" },
  { t: "" },
  { t: "ARQUIVOS (use com `cat`)", k: "hi" },
  { t: "  sobre.txt · stack.cfg · projetos.json · contato.md · .segredo", k: "dim" },
];

const FILES: Record<string, Line[]> = {
  "sobre.txt": [
    { t: profile.name + " · " + profile.role },
    { t: "Rio de Janeiro / BR · desde 2020 · " + profile.email },
  ],
  "stack.cfg": stack.map((s) => ({
    t: `${s.name.padEnd(18, ".")} ${s.level}%`,
  })),
  "projetos.json": [
    {
      t: `{ "total": ${projects.length}, "online": ${projects.filter((p) => p.href).length},`,
    },
    {
      t: `  "em_curso": ${projects.filter((p) => p.status === "EM CURSO").length} }`,
    },
    { t: "dica: role até [ Ø4 ] PROJETOS ou digite `projetos`", k: "dim" },
  ],
  "contato.md": [
    { t: "# canal aberto" },
    { t: profile.email, k: "hi" },
    ...profile.socials.map((s) => ({
      t: `- ${s.label}: ${s.href}`,
      k: "dim" as const,
    })),
  ],
  ".segredo": [
    { t: "// comandos que ninguém te contou:", k: "dim" },
    {
      t: "   hello world · marvel · jarvis · 404 · bug · hack · matrix · konami",
      k: "hi",
    },
    {
      t: "   front: !important · z-index · center · npm · undefined · nan · console.log",
      k: "hi",
    },
    {
      t: "   back:  sql · docker · k8s · cache · regex · deploy · env · chmod · vim",
      k: "hi",
    },
    { t: "   e ainda: git · stackoverflow · tabs · python · 500 · coffee · sudo", k: "hi" },
  ],
};

const HELP: Line[] = [
  { t: "COMANDOS DISPONÍVEIS", k: "hi" },
  { t: "  help ............ esta lista" },
  { t: "  hello world ..... o primeiro programa de todo mundo" },
  { t: "  ls / cat <arq> .. sistema de arquivos" },
  { t: "  whoami .......... quem está falando" },
  { t: "  history ......... ↑↓ percorrem, e fica salvo entre visitas" },
  { t: "  theme <cor> ..... repinta o sistema (theme list)" },
  { t: "  projetos ........ índice de projetos" },
  { t: "  contato ......... abrir canal" },
  { t: "  clear / exit .... limpar / fechar" },
  { t: "  ...e o resto está em `cat .segredo`", k: "dim" },
];

const HELLO: Line[] = [
  { t: "  C ......... printf(\"Hello, World!\\n\");", k: "dim" },
  { t: "  PYTHON .... print(\"Hello, World!\")", k: "dim" },
  { t: "  JS ........ console.log(\"Hello, World!\")", k: "dim" },
  { t: "  PHP ....... <?php echo \"Hello, World!\"; ?>", k: "dim" },
  { t: "  RUST ...... println!(\"Hello, World!\");", k: "dim" },
  { t: "─────────────────────────────────────────", k: "dim" },
  { t: "Hello, World!", k: "hi" },
  { t: "> todo mundo começou aqui. inclusive quem hoje discute", k: "ok" },
  { t: "  arquitetura hexagonal em reunião de duas horas.", k: "ok" },
];

/** Piadas de dev — front e back. Chave = o que a pessoa digita. */
const QUIPS: Record<string, Line[]> = {
  // ── front-end ──────────────────────────────────────────
  "!important": [
    { t: "CSS resolvido no grito.", k: "err" },
    { t: "funciona hoje e vira dívida técnica amanhã.", k: "dim" },
  ],
  "z-index": [
    { t: "z-index: 9999;", k: "ok" },
    { t: "...e o modal continua atrás. bem-vindo ao stacking context.", k: "dim" },
  ],
  center: [
    { t: "display: flex; align-items: center; justify-content: center;", k: "ok" },
    { t: "uma geração inteira sofreu antes disso existir.", k: "dim" },
  ],
  npm: [
    { t: "npm install", k: "ok" },
    { t: "[████████████████] node_modules ......... 1.2 GB", k: "dim" },
    { t: "o objeto mais pesado do universo conhecido.", k: "dim" },
  ],
  undefined: [
    { t: "undefined is not a function", k: "err" },
    { t: "e nunca foi. e nunca será. mas todo dia alguém tenta.", k: "dim" },
  ],
  nan: [
    { t: "typeof NaN        → 'number'", k: "ok" },
    { t: "NaN === NaN       → false", k: "err" },
    { t: "boa sorte com isso.", k: "dim" },
  ],
  "console.log": [
    { t: "console.log('aqui1')", k: "dim" },
    { t: "console.log('aqui2')", k: "dim" },
    { t: "console.log('AQUI CARALHO')", k: "err" },
    { t: "o debugger mais usado do planeta.", k: "dim" },
  ],
  hydration: [
    { t: "Hydration failed because the server HTML didn't match.", k: "err" },
    { t: "spoiler: era new Date() dentro de um client component.", k: "dim" },
  ],
  // ── back-end ───────────────────────────────────────────
  sql: [
    { t: "SELECT * FROM users;", k: "ok" },
    { t: "4.213.887 linhas em 38.2s — full table scan", k: "err" },
    { t: "cria um índice. por favor.", k: "dim" },
  ],
  docker: [
    { t: '"mas na minha máquina funciona"', k: "hi" },
    { t: "— então vamos enviar a sua máquina.", k: "ok" },
    { t: "  e foi literalmente assim que nasceu o Docker.", k: "dim" },
  ],
  k8s: [
    { t: "kubernetes: 14 arquivos YAML", k: "ok" },
    { t: "para rodar um contêiner que já rodava sozinho.", k: "dim" },
  ],
  cache: [
    { t: "só existem 2 problemas difíceis em computação:", k: "hi" },
    { t: "  1. invalidação de cache", k: "ok" },
    { t: "  2. dar nome às coisas", k: "ok" },
    { t: "  3. erro de índice em 1", k: "ok" },
  ],
  regex: [
    { t: "/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+)$/i", k: "dim" },
    { t: "você tinha um problema. resolveu com regex.", k: "ok" },
    { t: "agora você tem dois problemas.", k: "err" },
  ],
  deploy: [
    { t: "deploy sexta-feira 18h47 ............... INICIADO", k: "err" },
    { t: "coragem é isso. o resto é marketing.", k: "dim" },
  ],
  env: [
    { t: "DATABASE_URL=postgres://***:***@prod", k: "ok" },
    { t: "AWS_SECRET=**********", k: "ok" },
    { t: "(todo mundo já commitou um .env. todo mundo.)", k: "dim" },
  ],
  chmod: [
    { t: "chmod 777 -R .", k: "err" },
    { t: "agora funciona. e qualquer um no servidor também pode.", k: "dim" },
  ],
  vim: [
    { t: "você entrou no vim.", k: "hi" },
    { t: "não há saída. (mentira: ESC, depois :q!)", k: "dim" },
  ],
  "500": [
    { t: "5ØØ INTERNAL SERVER ERROR", k: "err" },
    { t: "back: 'aqui tá tudo certo, deve ser o front'", k: "dim" },
    { t: "front: 'a API tá retornando 5ØØ'", k: "dim" },
  ],
  git: [
    { t: "git blame index.tsx", k: "ok" },
    { t: "  a1b2c3d  Guilherme Santana  há 2 anos  às 3h47", k: "err" },
    { t: "o culpado é sempre você do passado.", k: "dim" },
  ],
  stackoverflow: [
    { t: "copiado. colado. funcionou.", k: "ok" },
    { t: "ninguém neste projeto sabe por quê.", k: "dim" },
  ],
  tabs: [
    { t: "tabs vs spaces: o prettier chegou e acabou com a guerra.", k: "ok" },
    { t: "ninguém venceu. todo mundo perdeu o argumento favorito.", k: "dim" },
  ],
  python: [
    { t: "import antigravity", k: "ok" },
    { t: "  ...abrindo xkcd.com/353", k: "dim" },
  ],
  konami: [
    { t: "↑ ↑ ↓ ↓ ← → ← → B A", k: "hi" },
    { t: "+3Ø vidas. você vai precisar — é sexta e tem deploy.", k: "ok" },
  ],
};

// aliases: mesma piada, entradas diferentes
Object.assign(QUIPS, {
  "npm install": QUIPS.npm,
  "npm i": QUIPS.npm,
  yarn: QUIPS.npm,
  "select *": QUIPS.sql,
  select: QUIPS.sql,
  kubernetes: QUIPS.k8s,
  ":q": QUIPS.vim,
  ":wq": QUIPS.vim,
  "chmod 777": QUIPS.chmod,
  "git blame": QUIPS.git,
  "git push --force": QUIPS.git,
  so: QUIPS.stackoverflow,
  spaces: QUIPS.tabs,
  flex: QUIPS.center,
  "z-index: 9999": QUIPS["z-index"],
  "console.log()": QUIPS["console.log"],
  log: QUIPS["console.log"],
});

/** Histórico de comandos entre visitas — é o que as setas ↑↓ percorrem. */
const HIST_KEY = "gui:hist";
const HIST_MAX = 60;

const loadHist = (): string[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(HIST_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
};

const saveHist = (h: string[]) => {
  try {
    localStorage.setItem(HIST_KEY, JSON.stringify(h));
  } catch {}
};

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [caret, setCaret] = useState(0); // posição do cursor em bloco
  const [fx, setFx] = useState<Fx>(null);
  const hist = useRef<string[]>([]);
  const histIdx = useRef(-1);
  const timers = useRef<number[]>([]);
  const typeId = useRef(0);
  const typing = useRef<Line[] | null>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const push = useCallback(
    (ls: Line[]) => setLines((prev) => [...prev, ...ls]),
    [],
  );

  /** imprime linha a linha, tipo saída de processo */
  const stream = useCallback(
    (ls: Line[], step = 220) => {
      ls.forEach((l, i) => {
        timers.current.push(window.setTimeout(() => push([l]), step * (i + 1)));
      });
    },
    [push],
  );

  const clearTimers = () => {
    typeId.current++; // invalida a digitação em curso
    typing.current = null;
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  /** Interrompeu a intro digitando? Completa o texto de uma vez em vez de deixá-lo cortado. */
  const finishTyping = () => {
    if (!typing.current) return;
    const done = typing.current;
    typeId.current++;
    typing.current = null;
    setLines(done);
  };

  /** escreve caractere a caractere, como se alguém estivesse digitando */
  const typeOut = useCallback((ls: Line[]) => {
    // token: mata a digitação anterior (StrictMode chama o efeito duas vezes)
    clearTimers();
    const id = typeId.current;
    typing.current = ls;
    setLines([]);
    let li = 0;
    let ci = 0;
    const tick = () => {
      if (id !== typeId.current) return;
      if (li >= ls.length) {
        typing.current = null;
        return;
      }
      const full = ls[li].t;
      ci++;
      setLines((prev) => {
        const copy = [...prev];
        copy[li] = { ...ls[li], t: full.slice(0, ci) };
        return copy;
      });
      const endOfLine = ci >= full.length;
      if (endOfLine) {
        li++;
        ci = 0;
      }
      timers.current.push(window.setTimeout(tick, endOfLine ? 170 : 16));
    };
    timers.current.push(window.setTimeout(tick, 140));
  }, []);

  const boot = useCallback(() => {
    typeOut([
      { t: "GUI_TERM v1.3 — console de manutenção", k: "hi" },
      { t: `sessão iniciada · ${profile.handle}`, k: "dim" },
      { t: "digite `help` para ver o que dá pra fazer aqui.", k: "dim" },
      { t: "" },
    ]);
  }, [typeOut]);

  // abre por tecla ~ / ` ou pelo evento disparado pelo botão do HUD
  useEffect(() => {
    hist.current = loadHist();
    const openIt = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.key === "~" || e.key === "`") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("gui:terminal", openIt);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("gui:terminal", openIt);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      clearTimers();
      return;
    }
    boot(); // toda abertura re-digita a intro
    histIdx.current = -1;
    inputRef.current?.focus();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open, boot]);

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight });
  }, [lines]);

  // qualquer clique/tecla dispensa a tela de efeito
  useEffect(() => {
    if (!fx) return;
    const off = () => setFx(null);
    window.addEventListener("keydown", off);
    window.addEventListener("click", off);
    return () => {
      window.removeEventListener("keydown", off);
      window.removeEventListener("click", off);
    };
  }, [fx]);

  const run = (raw: string) => {
    const [cmd = "", ...args] = raw.trim().split(/\s+/);
    const c = cmd.toLowerCase();
    const arg = args.join(" ").toLowerCase();
    const full = raw.trim().toLowerCase();

    // o primeiro programa de todo mundo
    if (c === "hello" || c === "helloworld" || c === "hello-world")
      return stream(HELLO, 190);

    // piadas de dev: casa a frase inteira ("npm install") ou só o comando ("npm")
    const quip = QUIPS[full] ?? QUIPS[c];
    if (quip) return stream(quip, 260);

    switch (c) {
      case "":
        return;
      case "help":
      case "ajuda":
        return push(HELP);
      case "clear":
      case "cls":
        return setLines([]);
      case "exit":
      case "quit":
      case "sair":
        return setOpen(false);

      case "ls":
      case "dir":
        return push([{ t: Object.keys(FILES).join("   "), k: "ok" }]);

      case "cat": {
        const f = FILES[arg];
        return push(
          f ?? [
            {
              t: `cat: ${arg || "?"}: arquivo ou diretório inexistente`,
              k: "err",
            },
          ],
        );
      }

      case "history":
      case "historico": {
        if (arg === "clear" || arg === "-c") {
          hist.current = [];
          saveHist([]);
          return push([{ t: "histórico apagado.", k: "ok" }]);
        }
        if (!hist.current.length)
          return push([{ t: "histórico vazio.", k: "dim" }]);
        return push(
          hist.current
            .slice()
            .reverse()
            .map((h, i) => ({
              t: `  ${String(i + 1).padStart(3, " ")}  ${h}`,
              k: "dim" as const,
            })),
        );
      }

      case "whoami":
        return push([
          { t: profile.handle.toLowerCase(), k: "ok" },
          {
            t: "uid=1998 gid=front-end grupos=angular,react,three.js,rpg",
            k: "dim",
          },
        ]);

      case "theme":
      case "cor": {
        if (!arg || arg === "list" || arg === "lista")
          return push([
            { t: "temas: " + Object.keys(THEMES).join(" · "), k: "hi" },
          ]);
        const hex = THEMES[arg];
        if (!hex)
          return push([
            { t: `theme: "${arg}" não existe. tente \`theme list\``, k: "err" },
          ]);
        applyTheme(arg);
        return push([
          { t: `fósforo recalibrado → ${arg.toUpperCase()} (${hex})`, k: "ok" },
        ]);
      }

      case "projetos":
        return push(
          projects.map((p) => ({
            t: `${p.idx}  ${p.name.padEnd(24, " ")} ${p.status}`,
          })),
        );

      case "contato":
        return push([
          { t: profile.email, k: "hi" },
          ...profile.socials.map((s) => ({
            t: `${s.label} → ${s.href}`,
            k: "dim" as const,
          })),
        ]);

      case "marvel":
      case "avengers":
        return stream(
          [
            { t: "         .-=========-.", k: "dim" },
            { t: "        /   .-----.   \\", k: "dim" },
            {
              t: "       |   /  ***  \\   |   REATOR ARC .......... ESTÁVEL",
              k: "hi",
            },
            {
              t: "       |   \\  ***  /   |   SAÍDA ................ 3 GW",
              k: "hi",
            },
            {
              t: "        \\   '-----'   /    MK-XLII .............. PRONTA",
              k: "hi",
            },
            { t: "         '-=========-'", k: "dim" },
            { t: "" },
            {
              t: "> um cara com uma armadura também é só um dev com boas dependências.",
              k: "ok",
            },
            { t: "  (o assistente de verdade eu escrevi: `jarvis`)", k: "dim" },
          ],
          140,
        );

      case "jarvis":
        return stream([
          { t: "INICIALIZANDO J.A.R.V.I.S.", k: "hi" },
          { t: "  Just A Rather Very Intelligent System .... ONLINE", k: "ok" },
          {
            t: "  varredura de café na mesa ............... 0 UNIDADES",
            k: "err",
          },
          { t: '  "Sr. Santana, o café acabou. De novo."', k: "hi" },
          { t: "  repo: github.com/Guilhermee19/jarvis-tauri-ia", k: "dim" },
        ]);

      case "404":
        setFx("404");
        return push([{ t: "GET /pagina-que-nao-existe → 404", k: "err" }]);

      case "bug":
      case "debug":
        setFx("bug");
        return push([
          {
            t: "segmentation fault (core dumped) — solte os insetos",
            k: "err",
          },
        ]);

      case "hack":
        return stream(
          [
            { t: "BREACH PROTOCOL ................. INICIADO", k: "err" },
            { t: "[████░░░░░░░░░░░░]  24%  varrendo portas" },
            { t: "[█████████░░░░░░░]  56%  quebrando o hash" },
            { t: "[██████████████░░]  88%  ACESSO À MAINFRAME" },
            { t: "[████████████████] 100%  COMPLETO", k: "ok" },
            { t: "" },
            { t: "brincadeira. isso aqui é uma div com texto.", k: "dim" },
          ],
          320,
        );

      case "matrix":
        return stream([
          { t: "acorda...", k: "dim" },
          { t: "a mesa está te vigiando.", k: "dim" },
          { t: "siga o coelho de CSS.", k: "ok" },
        ]);

      case "coffee":
      case "cafe":
        return push([
          { t: "HTTP 418 — I'm a teapot", k: "err" },
          { t: "coffee.sys continua falhando desde o boot.", k: "dim" },
        ]);

      case "sudo":
        return push([
          {
            t: `gui não está no arquivo sudoers. Este incidente será reportado.`,
            k: "err",
          },
        ]);

      case "rm":
        return push([
          {
            t: "rm: recusando remover '/' — já tentei isso uma vez em produção.",
            k: "err",
          },
        ]);

      case "ping":
        return push([{ t: "pong · 12ms · o de sempre", k: "ok" }]);

      case "date":
        return push([{ t: new Date().toString(), k: "dim" }]);

      default:
        return push([
          { t: `${c}: comando não encontrado`, k: "err" },
          { t: "tente `help` — ou `ls` e depois `cat .segredo`", k: "dim" },
        ]);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    finishTyping(); // digitou no meio da intro? completa ela e segue
    const raw = input;
    push([{ t: `${PROMPT} ${raw}` }]);
    if (raw.trim()) {
      // sem repetir o comando anterior, igual bash com HISTCONTROL=ignoredups
      const dedup = hist.current[0] === raw.trim() ? hist.current : [raw.trim(), ...hist.current];
      hist.current = dedup.slice(0, HIST_MAX);
      histIdx.current = -1;
      saveHist(hist.current);
    }
    setInput("");
    setCaret(0);
    run(raw);
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") return setOpen(false);
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const next = histIdx.current + (e.key === "ArrowUp" ? 1 : -1);
    histIdx.current = Math.max(-1, Math.min(hist.current.length - 1, next));
    const v = histIdx.current < 0 ? "" : hist.current[histIdx.current];
    setInput(v);
    setCaret(v.length);
  };

  const syncCaret = (e: React.SyntheticEvent<HTMLInputElement>) =>
    setCaret(e.currentTarget.selectionStart ?? 0);

  const color = (k?: Line["k"]) =>
    k === "err"
      ? "text-alert"
      : k === "ok"
        ? "text-grn"
        : k === "dim"
          ? "text-dim"
          : k === "hi"
            ? "text-grn glow"
            : "text-grn-2/85";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 z-95 flex justify-center px-2 pb-2 sm:px-4 sm:pb-4"
            role="dialog"
            aria-modal="true"
            aria-label="Terminal"
          >
            {/* sem .panel aqui: o gradiente dela sobrescreveria o fundo opaco */}
            <div className="brk flex h-[70vh] w-full max-w-4xl flex-col border border-grn/30 bg-bg/95 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-md sm:h-[60vh]">
              <div className="flex items-center gap-3 border-b border-grn/20 px-4 py-2">
                <span className="lbl shrink-0">GUI_TERM v1.3</span>
                <span className="lbl hidden flex-1 text-center md:block">
                  ↑↓ histórico · ESC fecha
                </span>
                <button
                  onClick={() => {
                    clearTimers();
                    setLines([]);
                    inputRef.current?.focus();
                  }}
                  className="ml-auto shrink-0 border border-grn/30 px-2 py-0.5 text-[10px] tracking-[0.15em] text-dim transition-colors hover:border-grn hover:text-grn md:ml-0"
                >
                  LIMPAR
                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Fechar terminal"
                  className="shrink-0 border border-grn/30 px-2 py-0.5 text-[10px] tracking-[0.15em] text-dim transition-colors hover:border-alert hover:text-alert"
                >
                  FECHAR
                </button>
              </div>

              {/* saída + prompt no MESMO fluxo rolável, como num terminal de verdade.
                  16px no mobile: abaixo disso o iOS dá zoom ao focar o input. */}
              <div
                ref={outRef}
                onClick={() => inputRef.current?.focus()}
                className="flex-1 cursor-text overflow-y-auto px-4 py-3 text-[16px] leading-6 whitespace-pre-wrap sm:text-[12px]"
              >
                <div role="log" aria-live="polite">
                  {lines.map((l, i) => (
                    <div key={i} className={color(l.k)}>
                      {l.t || " "}
                    </div>
                  ))}
                </div>

                <form onSubmit={submit} className="flex items-start gap-2">
                  <label htmlFor="gui-term" className="shrink-0 text-grn">
                    {PROMPT}
                  </label>

                  {/* o input real fica invisível por cima; o espelho abaixo desenha o
                    cursor em bloco do terminal em vez do risquinho do browser */}
                  <div className="relative min-w-0 flex-1">
                    <input
                      id="gui-term"
                      ref={inputRef}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        setCaret(
                          e.target.selectionStart ?? e.target.value.length,
                        );
                      }}
                      onKeyDown={onInputKey}
                      onKeyUp={syncCaret}
                      onSelect={syncCaret}
                      onClick={syncCaret}
                      autoComplete="off"
                      spellCheck={false}
                      aria-label="Digite um comando"
                      className="no-ring absolute inset-0 w-full bg-transparent text-transparent caret-transparent outline-none"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none whitespace-pre text-grn-2"
                    >
                      {input.slice(0, caret)}
                      <span className="animate-blink bg-grn text-bg">
                        {input[caret] ?? " "}
                      </span>
                      {input.slice(caret + 1)}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FxScreen fx={fx} />
    </>
  );
}

export function applyTheme(name: string) {
  const hex = THEMES[name];
  if (!hex) return;
  document.documentElement.style.setProperty("--color-grn", hex);
  try {
    localStorage.setItem("theme", name);
  } catch {}
}

/** Usada pelo comando `404` e pela rota not-found de verdade. */
export function Screen404({ hint }: { hint: string }) {
  return (
    <>
      <p className="lbl mb-4">ERR_SIGNAL_LOST</p>
      <h2 className="striped animate-glitch text-[clamp(4rem,22vw,14rem)] leading-none font-extrabold">
        4Ø4
      </h2>
      <p className="mt-4 text-sm tracking-[0.25em] text-grn">
        PÁGINA NÃO ENCONTRADA
      </p>
      <p className="mt-2 max-w-md text-[12px] leading-6 text-dim">{hint}</p>
    </>
  );
}

function FxScreen({ fx }: { fx: Fx }) {
  return (
    <AnimatePresence>
      {fx && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-99 flex flex-col items-center justify-center overflow-hidden bg-bg/95 px-6 text-center backdrop-blur-sm"
        >
          {fx === "404" ? (
            <Screen404 hint="o engraçado é que essa tela existe e a que você procurava não. clique para voltar." />
          ) : (
            <>
              <p className="text-alert animate-glitch text-xl font-extrabold tracking-[0.2em] sm:text-3xl">
                KERNEL PANIC
              </p>
              <p className="mt-3 text-[12px] leading-6 text-grn-2/80">
                segmentation fault (core dumped)
              </p>
              <p className="mt-1 text-[12px] text-dim">
                achamos o bug. ele é literal. clique para dedetizar.
              </p>
              {/* os insetos: só emoji + keyframes, zero asset */}
              {[0, 2.4, 4.8, 6.6].map((d, i) => (
                <span
                  key={d}
                  aria-hidden
                  className="animate-crawl pointer-events-none absolute text-2xl sm:text-4xl"
                  style={{ top: `${14 + i * 19}%`, animationDelay: `-${d}s` }}
                >
                  🪲
                </span>
              ))}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
