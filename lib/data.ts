export const profile = {
  handle: "GUI_SANTANA",
  name: "Guilherme Santana Rocha",
  role: "FRONT-END ENGINEER",
  unit: "UNIT SR-A · RIO DE JANEIRO / BR",
  build: "BUILD 06.2020 → PRESENT",
  email: "eu@iamgui.dev",
  intro:
    "Seis anos escrevendo interface. Comecei em 2014 num HTML que eu não entendia e continuo pelo mesmo motivo: gosto de ver a coisa ganhar vida na tela. Hoje trabalho com Angular, React e Next — e quando o projeto deixa, com Three.js, porque tela plana é limitação de ferramenta, não de ideia.",
  socials: [
    { label: "GITHUB", href: "https://github.com/Guilhermee19" },
    { label: "LINKEDIN", href: "https://www.linkedin.com/in/gui-santana/" },
    { label: "CODEPEN", href: "https://codepen.io/Guilhermee19" },
    { label: "V1.ARCHIVE", href: "https://v1.iamgui.dev/" },
  ],
};

export const stats = [
  { value: "06+", label: "ANOS DE ESTRADA" },
  { value: "50", label: "REPOS PÚBLICOS" },
  { value: "1998", label: "REV. INICIAL" },
  { value: "24/7", label: "SYS ONLINE" },
];

export const stack = [
  { name: "TYPESCRIPT", level: 94, tag: "CORE Ø1/\\" },
  { name: "ANGULAR", level: 92, tag: "CORE Ø2/\\" },
  { name: "REACT / NEXT", level: 90, tag: "CORE Ø2/2" },
  { name: "SASS / TAILWIND", level: 88, tag: "CORE Ø3/\\" },
  { name: "THREE.JS / GSAP", level: 74, tag: "CORE Ø4/\\" },
  { name: "NODE / DJANGO", level: 68, tag: "CORE Ø5/\\" },
];

export const services = [
  {
    id: "SVC.01",
    title: "APLICAÇÕES WEB",
    body: "SPA e dashboards com estado complexo, autenticação e integração de API. Angular ou React, do zero ou herdado.",
  },
  {
    id: "SVC.02",
    title: "LANDING PAGES",
    body: "Página que carrega rápido, converte e passa no Lighthouse. SSR quando faz diferença, estático quando não faz.",
  },
  {
    id: "SVC.03",
    title: "EXPERIÊNCIAS 3D",
    body: "Three.js e WebGL no navegador. Tour virtual, configurador de produto, cena interativa — sem plugin, sem app.",
  },
  {
    id: "SVC.04",
    title: "DESIGN SYSTEM",
    body: "Biblioteca de componentes documentada, acessível e com token de tema. Para o time parar de recriar botão.",
  },
  {
    id: "SVC.05",
    title: "APPS DESKTOP",
    body: "Tauri e Ionic: a mesma base web empacotada como aplicativo nativo, leve e assinada.",
  },
  {
    id: "SVC.06",
    title: "MANUTENÇÃO",
    body: "Migração de versão, refatoração e performance em projeto que já está no ar e não pode cair.",
  },
];

export type Project = {
  idx: string;
  name: string;
  desc: string;
  tech: string[];
  year: string;
  href?: string;
  status: "ONLINE" | "ARQUIVO" | "EM CURSO";
};

export const projects: Project[] = [
  {
    idx: "Ø1",
    name: "TOUR VIRTUAL / TCC",
    desc: "Experiência 360° em realidade aumentada exibindo modelos 3D direto no navegador. Trabalho de conclusão de curso — e o projeto que definiu o que eu queria fazer.",
    tech: ["THREE.JS", "ANGULAR", "GSAP"],
    year: "2021",
    href: "https://tcctourvirtual.vercel.app/home",
    status: "ONLINE",
  },
  {
    idx: "Ø2",
    name: "TOOLS CENTER",
    desc: "Central de ferramentas do dia a dia de dev. Roda no navegador e empacotada em Tauri como app desktop.",
    tech: ["ANGULAR", "TAURI"],
    year: "2025",
    href: "https://toolscenter.dev/",
    status: "ONLINE",
  },
  {
    idx: "Ø3",
    name: "CAVERNA DO MESTRE",
    desc: "Plataforma para mestrar campanha de RPG: fichas, personagens e sessões. Nasceu de uma mesa que precisava de menos papel.",
    tech: ["REACT", "TYPESCRIPT", "TAILWIND", "DJANGO"],
    year: "2026",
    status: "EM CURSO",
  },
  {
    idx: "Ø4",
    name: "RESPAWN",
    desc: "Chat em tempo real com a estética do MSN de 2006. Nudge, avatar, som de campainha — tudo que a gente perdeu.",
    tech: ["NEXT.JS", "TYPESCRIPT", "WEBSOCKET"],
    year: "2026",
    status: "EM CURSO",
  },
  {
    idx: "Ø5",
    name: "POKEDEX WEB",
    desc: "Pokédex completa sobre a PokéAPI, com busca, filtro por tipo e detalhe de cada espécie.",
    tech: ["ANGULAR"],
    year: "2024",
    href: "https://pokedex-web-mocha.vercel.app/",
    status: "ONLINE",
  },
  {
    idx: "Ø6",
    name: "MARVEL DB",
    desc: "Catálogo de filmes e séries do universo Marvel, com listagem, busca e página de detalhe.",
    tech: ["REACT"],
    year: "2023",
    href: "https://react-movie-web-zeta.vercel.app/",
    status: "ARQUIVO",
  },
  {
    idx: "Ø7",
    name: "JARVIS",
    desc: "Assistente pessoal com IA rodando local. Backend em Python, cliente Tauri. Projeto de fim de semana que não acabou mais.",
    tech: ["PYTHON", "TAURI", "TYPESCRIPT"],
    year: "2026",
    status: "EM CURSO",
  },
  {
    idx: "Ø8",
    name: "MEMORIAL DO CARMO",
    desc: "Landing page institucional entregue como freelance. Escopo fechado, prazo curto, sem drama.",
    tech: ["NEXT.JS"],
    year: "2025",
    status: "ARQUIVO",
  },
];

export const timeline = [
  {
    year: "2014",
    title: "PRIMEIRO SITE",
    body: "HTML e CSS sem saber direito o que estava fazendo. Só sabia que tinha gostado de fazer um site meu.",
  },
  {
    year: "2017",
    title: "CIÊNCIA DA COMPUTAÇÃO · UNIFESO",
    body: "Onde a programação virou ofício: lógica, linguagem C e a primeira noção de boa prática.",
  },
  {
    year: "2020",
    title: "ESTÁGIO · NOCLAF",
    body: "A faculdade abriu a porta do mercado. Entrei como estagiário e nunca mais saí do front-end.",
  },
  {
    year: "2021",
    title: "FORMATURA · TCC EM AR",
    body: "Formado, com um TCC em realidade aumentada feito em Three.js exibindo modelos 3D no navegador.",
  },
  {
    year: "2024",
    title: "RUMO AO FULL STACK",
    body: "Django para fechar o outro lado da API. Projetos pessoais de ponta a ponta e trabalho como freelancer.",
  },
  {
    year: "2026",
    title: "SEIS ANOS DE ESTRADA",
    body: "Angular, React, Node, Next e o 3D que continua sendo o motivo de tudo ter começado.",
  },
];

/** Comando `theme` do terminal. Só --color-grn muda: o resto da paleta deriva dela. */
export const THEMES: Record<string, string> = {
  verde: "#2bff88",
  ambar: "#ffb000",
  ciano: "#22d3ee",
  magenta: "#ff5ec4",
  sangue: "#ff4d4d",
  mono: "#cfe3d9",
};

export const bootLines = [
  { t: "SCHR BIOS v1Ø.Ø4.1998 — INITIALIZING", d: 90 },
  { t: "MEM CHECK ........................ 65536 KB OK", d: 70 },
  { t: "MOUNT /dev/gui ................... [  OK  ]", d: 60 },
  { t: "LOADING KERNEL MODULES", d: 55 },
  { t: "  → typescript.sys ............... LOADED", d: 45 },
  { t: "  → angular.sys .................. LOADED", d: 45 },
  { t: "  → react.sys .................... LOADED", d: 45 },
  { t: "  → three.sys .................... LOADED", d: 45 },
  { t: "  → coffee.sys ................... FAILED", d: 90, err: true },
  { t: "RETRY coffee.sys ................. [  OK  ]", d: 70 },
  { t: "SCANNING USER PROFILE ............ 6 YEARS", d: 80 },
  { t: "DECRYPT PORTFOLIO.DAT ............ 8 ENTRIES", d: 70 },
  { t: "NET LINK: iamgui.dev ............. ESTABLISHED", d: 70 },
  { t: "SYS STATUS ....................... STABLE", d: 60 },
  { t: "> TEST PROTOCOL INITIATED_", d: 120 },
];
