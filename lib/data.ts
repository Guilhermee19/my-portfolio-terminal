export const profile = {
  handle: "I_AM_GUI",
  name: "Guilherme Santana Rocha Mendonça",
  role: "FRONT-END ENGINEER",
  unit: "UNIT SR-A · RIO DE JANEIRO / BR",
  build: "BUILD 06.2020 → PRESENT",
  email: "eu@iamgui.dev",
  githubUser: "Guilhermee19",
  intro:
    "Mais de sete anos escrevendo interface. Comecei em 2014 num HTML que eu não entendia e continuo pelo mesmo motivo: gosto de ver a coisa ganhar vida na tela. Hoje trabalho com Angular, React, Next e Three.js, porque tela plana é limitação de ferramenta, não de ideia.",
  socials: [
    { label: "GITHUB", href: "https://github.com/Guilhermee19" },
    { label: "LINKEDIN", href: "https://www.linkedin.com/in/gui-santana/" },
    { label: "CODEPEN", href: "https://codepen.io/Guilhermee19" },
    { label: "V1.ARCHIVE", href: "https://v1.iamgui.dev/" },
    { label: "V2.ARCHIVE", href: "https://v2.iamgui.dev/" },
  ],
};

/** `hint` vira o title do card. O de REPOS é trocado pelo número vivo da API
    do GitHub na renderização (`lib/github.ts`); o valor aqui é o fallback. */
export const stats: {
  id: string;
  value: string;
  label: string;
  hint?: string;
}[] = [
  { id: "anos", value: "06+", label: "ANOS DE ESTRADA" },
  {
    id: "repos",
    value: "52",
    label: "REPOS PÚBLICOS",
    hint: "Contagem viva, direto da API do GitHub",
  },
  {
    id: "cr",
    value: "7,72",
    label: "CR · UNIFESO",
    hint: "Coeficiente de rendimento — Ciência da Computação, UNIFESO",
  },
  { id: "uptime", value: "19/7", label: "SYS ONLINE" },
];

export type StackGroup = {
  id: string;
  label: string;
  note: string;
  items: string[];
};

/** Agrupada por frequência de uso, não por porcentagem: ninguém sabe quanto
    por cento sabe de alguma coisa. */
export const stack: StackGroup[] = [
  {
    id: "GRP.Ø1",
    label: "USO DIÁRIO",
    note: "o que eu abro todo dia",
    items: ["TYPESCRIPT", "ANGULAR", "SASS / TAILWIND", "GIT"],
  },
  {
    id: "GRP.Ø2",
    label: "FREQUENTE",
    note: "entra em quase todo projeto",
    items: ["REACT / NEXT", "NODE", "TAURI", "GSAP"],
  },
  {
    id: "GRP.Ø3",
    label: "EXPLORANDO",
    note: "onde eu ainda estou aprendendo",
    items: ["THREE.JS / WEBGL", "DJANGO", "PYTHON"],
  },
];

/** Achatado — o ticker do hero e o `stack.cfg` do terminal querem só os nomes. */
export const stackNames = stack.flatMap((g) => g.items);

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

/** Screenshot de projeto ou imagem de certificado, em `public/`. */
export type Shot = { src: string; alt: string };

export type Project = {
  idx: string;
  name: string;
  desc: string;
  tech: string[];
  year: string;
  href?: string;
  status: "ONLINE" | "ARQUIVO" | "EM CURSO" | "EM DESENVOLVIMENTO";
  /** contexto: TCC, freela, estudo... aparece só no popup */
  role?: string;
  /** o texto longo do popup — `desc` continua sendo a chamada do card */
  about?: string[];
  repo?: string;
  shots?: Shot[];
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
    role: "TCC · UNIFESO",
    about: [
      "Trabalho de conclusão do curso de Ciência da Computação: um tour 360° que carrega modelos 3D no navegador, sem plugin e sem app pra instalar.",
      "Foi aqui que o 3D na web deixou de ser curiosidade e virou o que eu queria fazer da vida. Tudo que veio depois puxa desse projeto.",
    ],
  },
  {
    idx: "Ø2",
    name: "TOOLS CENTER",
    desc: "Central de ferramentas do dia a dia de dev. Roda no navegador e empacotada em Tauri como app desktop.",
    tech: ["ANGULAR", "TAURI"],
    year: "2025",
    href: "https://toolscenter.dev/",
    status: "ONLINE",
    role: "PROJETO PESSOAL",
    about: [
      "Aquele punhado de ferramentas que todo dev abre num site aleatório e cheio de anúncio — formatador, conversor, gerador — reunido num lugar só.",
      "A mesma base roda no navegador e, empacotada em Tauri, como aplicativo desktop: um binário leve, sem Electron e sem precisar de internet.",
    ],
  },
  {
    idx: "Ø3",
    name: "CAVERNA DO MESTRE",
    desc: "Plataforma para mestrar campanha de RPG: fichas, personagens e sessões. Nasceu de uma mesa que precisava de menos papel.",
    tech: ["REACT", "TYPESCRIPT", "TAILWIND", "DJANGO"],
    year: "2026",
    href: "https://cavernadomestre.com.br/",
    status: "EM DESENVOLVIMENTO",
    role: "PROJETO PESSOAL",
    about: [
      "Plataforma pra mestrar campanha de RPG: ficha de personagem, controle de sessão e o material do mestre no mesmo lugar.",
      "Nasceu de uma mesa de verdade que estava afogada em papel. É também onde eu fecho o ciclo de ponta a ponta — front em React e a API em Django.",
    ],
  },
  {
    idx: "Ø4",
    name: "RESPAWN",
    desc: "Chat em tempo real com a estética do MSN de 2006. Nudge, avatar, som de campainha — tudo que a gente perdeu.",
    tech: ["NEXT.JS", "TYPESCRIPT", "WEBSOCKET"],
    year: "2026",
    status: "EM CURSO",
    role: "PROJETO PESSOAL",
    about: [
      "Chat em tempo real com a cara do MSN de 2006: nudge que treme a janela, avatar, som de campainha e status personalizado.",
      "Metade nostalgia, metade desculpa pra brincar de WebSocket. A parte difícil não é a mensagem chegar — é acertar o tempo de cada detalhe.",
    ],
  },
  {
    idx: "Ø5",
    name: "POKEDEX WEB",
    desc: "Pokédex completa sobre a PokéAPI, com busca, filtro por tipo e detalhe de cada espécie.",
    tech: ["ANGULAR"],
    year: "2024",
    href: "https://pokedex-web-mocha.vercel.app/",
    status: "ONLINE",
    role: "ESTUDO",
    about: [
      "Pokédex completa em cima da PokéAPI: busca, filtro por tipo e página de detalhe de cada espécie.",
      "O clássico projeto de estudo, feito por um motivo específico: uma lista grande com muita imagem é um ótimo lugar pra praticar paginação e carregamento sob demanda.",
    ],
  },
  {
    idx: "Ø6",
    name: "MARVEL DB",
    desc: "Catálogo de filmes e séries do universo Marvel, com listagem, busca e página de detalhe.",
    tech: ["REACT"],
    year: "2023",
    href: "https://react-movie-web-zeta.vercel.app/",
    status: "ARQUIVO",
    role: "ESTUDO",
    about: [
      "Catálogo de filmes e séries do universo Marvel: listagem, busca e página de detalhe.",
      "Foi o projeto em que eu troquei o Angular pelo React pra valer e entendi na prática a diferença de mentalidade entre os dois.",
    ],
  },
  {
    idx: "Ø7",
    name: "JARVIS",
    desc: "Assistente pessoal com IA rodando local. Backend em Python, cliente Tauri. Projeto de fim de semana que não acabou mais.",
    tech: ["PYTHON", "TAURI", "TYPESCRIPT"],
    year: "2026",
    status: "EM CURSO",
    role: "PROJETO PESSOAL",
    about: [
      "Assistente pessoal rodando na própria máquina: backend em Python e cliente em Tauri, sem mandar nada pra fora.",
      "Começou como projeto de fim de semana e nunca mais acabou — cada semana aparece uma coisa nova que dá pra ele fazer.",
    ],
  },
  {
    idx: "Ø8",
    name: "MEMORIAL DO CARMO",
    desc: "Landing page institucional entregue como freelance. Escopo fechado, prazo curto, sem drama.",
    tech: ["NEXT.JS"],
    year: "2025",
    status: "ARQUIVO",
    role: "FREELANCE",
    about: [
      "Landing page institucional entregue como freela: escopo fechado, prazo curto e o combinado cumprido.",
      "Nem todo projeto precisa ser tecnicamente interessante. Esse precisava carregar rápido, passar no Lighthouse e entrar no ar na data — e entrou.",
    ],
  },
  {
    idx: "Ø9",
    name: "CINETRACKER",
    desc: "Marcar os filmes e séries que já assistiu, os que quer assistir e os que está assistindo no momento.",
    tech: ["REACT"],
    year: "2024",
    href: "https://my-queue-pad.vercel.app/",
    status: "ONLINE",
    role: "PROJETO PESSOAL",
    about: [
      "Uma fila pessoal de filmes e séries: o que já assisti, o que quero assistir e o que está no meio do caminho.",
      "Feito porque a lista no bloco de notas do celular não estava dando conta. Uso até hoje, o que é o melhor teste de usabilidade que existe.",
    ],
  },
];

export type Certificate = {
  idx: string;
  title: string;
  issuer: string;
  year: string;
  kind: "FORMAÇÃO" | "CURSO" | "PALESTRA" | "EVENTO";
  /** carga horária, quando o certificado informa */
  hours?: string;
  desc?: string;
  /** link de validação do emissor */
  href?: string;
  /** arquivo em public/certs/ — sem ele o card mostra o placeholder NO SIGNAL */
  image?: string;
};

export const certificates: Certificate[] = [
  {
    idx: "Ø1",
    title: "BACHAREL EM CIÊNCIA DA COMPUTAÇÃO",
    issuer: "UNIFESO",
    year: "2021",
    kind: "FORMAÇÃO",
    desc: "Quatro anos e meio no Centro Universitário Serra dos Órgãos, em Teresópolis. Coeficiente de rendimento 7,72, com TCC em realidade aumentada feito em Three.js.",
    image: "/certs/guilherme_santana_rocha_graduacao_em_ciencia_da_computacao.png",
  },
  // Pra adicionar: solte o arquivo em public/certs/ e copie o bloco acima.
  // {
  //   idx: "Ø2",
  //   title: "NOME DO CURSO",
  //   issuer: "QUEM EMITIU",
  //   year: "2Ø25",
  //   kind: "CURSO",       // CURSO · PALESTRA · EVENTO · FORMAÇÃO
  //   hours: "4Øh",
  //   desc: "uma ou duas frases sobre o que era.",
  //   href: "https://link-de-validacao",
  //   image: "/certs/arquivo.webp",
  // },
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
