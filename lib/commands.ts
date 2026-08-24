/**
 * Comandos "de sistema" do terminal — o que faz ele parecer um shell de verdade.
 * Tudo é saída fabricada; nada aqui toca no sistema do visitante.
 * As piadas de dev continuam em `components/terminal.tsx` (mapa QUIPS).
 */
export type Line = { t: string; k?: "err" | "ok" | "dim" | "hi" };

const RO = "sistema de arquivos montado como somente leitura.";

/** Saída fixa: casa pela frase inteira ("df -h") ou só pelo comando ("df"). */
export const SHELL: Record<string, Line[]> = {
  // ── identidade / sistema ────────────────────────────────
  uname: [
    { t: "SCHR-OS 1.3-gui #1 SMP x86_64 GNU/Linux", k: "ok" },
    { t: "kernel compilado em 19.Ø7.1998 por guilherme@unifeso", k: "dim" },
  ],
  neofetch: [
    { t: "       ▄▄▄▄▄▄▄        gui@iamgui.dev", k: "ok" },
    { t: "     ▄█████████▄      ─────────────────────────", k: "ok" },
    { t: "    ███▀     ▀███     OS ......... SCHR-OS 1.3 x86_64", k: "ok" },
    { t: "   ███  ▄▄▄▄▄  ███    Host ....... UNIT SR-A", k: "ok" },
    { t: "   ███  █████  ███    Kernel ..... 1.3-gui", k: "ok" },
    { t: "   ███  ▀▀▀▀▀  ███    Uptime ..... 7 anos, 2 meses", k: "ok" },
    { t: "    ███▄     ▄███     Shell ...... gui-term 1.3", k: "ok" },
    { t: "     ▀█████████▀      DE ......... CRT fósforo", k: "ok" },
    { t: "       ▀▀▀▀▀▀▀        CPU ........ Café 4-core @ 3.2GHz", k: "ok" },
    { t: "                      Memory ..... 6.4GB / 8GB (Chrome)", k: "ok" },
  ],
  uptime: [
    {
      t: " 19:07:14  up 7 anos, 2 meses,  1 user,  load average: Ø.42, 1.13, 3.47",
      k: "ok",
    },
    { t: "o load das 3h da manhã ainda pesa na média.", k: "dim" },
  ],
  id: [
    {
      t: "uid=1998(gui) gid=1ØØ(front-end) grupos=1ØØ(front-end),27(sudo),42(rpg)",
      k: "ok",
    },
  ],
  groups: [
    { t: "front-end sudo rpg cafeinados devs-que-leem-o-console", k: "ok" },
  ],
  "df -h": [
    { t: "Sist. Arq.      Tam.  Usado  Disp. Uso% Montado em", k: "hi" },
    { t: "/dev/gui1       512G   187G   325G  37% /", k: "dim" },
    {
      t: "/dev/projetos    64G    58G   6.ØG  91% /home/gui/projetos",
      k: "dim",
    },
    {
      t: "node_modules    1.2T   1.2T      Ø 1ØØ% /home/gui/node_modules",
      k: "err",
    },
  ],
  "free -h": [
    { t: "               total     usado     livre   buff/cache", k: "hi" },
    { t: "Mem:            8.ØGi     6.4Gi     Ø.3Gi        1.3Gi", k: "dim" },
    { t: "Swap:           2.ØGi     1.8Gi     Ø.2Gi", k: "dim" },
    { t: "as 47 abas do Chrome agradecem.", k: "dim" },
  ],
  "ps aux": [
    { t: "USER   PID  %CPU  %MEM  COMMAND", k: "hi" },
    { t: "gui      1   Ø.Ø   Ø.1  /sbin/init", k: "dim" },
    { t: "gui    420  12.4   8.2  node next dev", k: "dim" },
    { t: "gui    421  38.1  24.7  chrome --devtools", k: "dim" },
    { t: "gui    666  Ø1.Ø   Ø.4  spotify (lofi hip hop)", k: "dim" },
    { t: "gui   1337  99.9  Ø2.1  webpack (desde 2Ø19)", k: "err" },
  ],
  top: [
    { t: "  PID  USER   %CPU  COMMAND", k: "hi" },
    { t: " 1337  gui    99.9  webpack", k: "err" },
    { t: "  421  gui    38.1  chrome", k: "dim" },
    { t: "  420  gui    12.4  next dev", k: "dim" },
    { t: "pressione q para sair. ou não, ninguém nunca lembra.", k: "dim" },
  ],
  // ── rede ────────────────────────────────────────────────
  "ip a": [
    { t: "1: lo: <LOOPBACK,UP> inet 127.Ø.Ø.1/8", k: "dim" },
    { t: "2: eth0: <BROADCAST,UP> inet 1Ø.Ø.Ø.42/24", k: "dim" },
    {
      t: "3: tun0: <POINTOPOINT,UP> inet 1Ø.8.Ø.7/24  # a VPN do cliente",
      k: "dim",
    },
  ],
  ipconfig: [
    { t: "Configuração de IP do Windows", k: "hi" },
    { t: "" },
    { t: "Adaptador Ethernet SCHR-NET:", k: "ok" },
    { t: "   Sufixo DNS específico de conexão. : iamgui.dev", k: "dim" },
    { t: "   Endereço IPv4. . . . . . . . . . : 1Ø.Ø.Ø.42", k: "dim" },
    { t: "   Máscara de Sub-rede. . . . . . . : 255.255.255.Ø", k: "dim" },
    { t: "   Gateway Padrão . . . . . . . . . : 1Ø.Ø.Ø.1", k: "dim" },
    { t: "" },
    { t: "Adaptador de Rede sem Fio Wi-Fi:", k: "ok" },
    { t: "   Estado da mídia. . . . . . . . . : mídia desconectada", k: "err" },
    { t: "   (o cabo nunca falha. o wi-fi do escritório, sempre)", k: "dim" },
    { t: "" },
    { t: "Adaptador de Túnel VPN-CLIENTE:", k: "ok" },
    { t: "   Endereço IPv4. . . . . . . . . . : 1Ø.8.Ø.7", k: "dim" },
    {
      t: "   Expira em. . . . . . . . . . . . : quando você mais precisar",
      k: "dim",
    },
  ],
  netstat: [
    { t: "Proto  Endereço local     Estado    Programa", k: "hi" },
    { t: "tcp    Ø.Ø.Ø.Ø:3ØØØ       LISTEN    next dev", k: "ok" },
    { t: "tcp    Ø.Ø.Ø.Ø:42ØØ       LISTEN    ng serve", k: "ok" },
    { t: "tcp    Ø.Ø.Ø.Ø:8ØØØ       LISTEN    manage.py runserver", k: "ok" },
    { t: "tcp    Ø.Ø.Ø.Ø:5432       LISTEN    postgres", k: "ok" },
    {
      t: "tcp    Ø.Ø.Ø.Ø:3ØØ1       LISTEN    aquele projeto que você esqueceu",
      k: "err",
    },
  ],
  traceroute: [
    { t: "1  roteador-de-casa (192.168.Ø.1)        1.2 ms", k: "dim" },
    { t: "2  gateway-da-operadora                 12.7 ms", k: "dim" },
    { t: "3  * * *", k: "err" },
    { t: "4  iamgui.dev (76.76.21.21)             38.Ø ms", k: "ok" },
  ],
  // ── serviços ────────────────────────────────────────────
  systemctl: [
    { t: "  UNIT                 LOAD   ACTIVE  DESCRIÇÃO", k: "hi" },
    { t: "  portfolio.service    loaded active  Portfólio do Gui", k: "ok" },
    { t: "  nginx.service        loaded active  Servidor web", k: "ok" },
    { t: "  postgres.service     loaded active  Banco de dados", k: "ok" },
    {
      t: "  cafeteira.service    loaded failed  Cafeteira (crítico)",
      k: "err",
    },
  ],
  "nginx -t": [
    {
      t: "nginx: the configuration file /etc/nginx/nginx.conf syntax is ok",
      k: "ok",
    },
    {
      t: "nginx: configuration file /etc/nginx/nginx.conf test is successful",
      k: "ok",
    },
    { t: "primeira vez que passa de primeira. anota a data.", k: "dim" },
  ],
  journalctl: [
    { t: "ago 24 Ø3:47:Ø2 unit-sr-a next[42Ø]: compilado em 1.2s", k: "dim" },
    {
      t: "ago 24 Ø3:47:Ø9 unit-sr-a next[42Ø]: hydration mismatch em /",
      k: "err",
    },
    { t: "ago 24 Ø3:52:11 unit-sr-a gui[1]: 'ah não'", k: "err" },
    {
      t: "ago 24 Ø4:1Ø:33 unit-sr-a gui[1]: resolvido. era new Date().",
      k: "ok",
    },
  ],
  "crontab -l": [
    { t: "Ø 3 * * *   npm run build   # ninguém sabe por que às 3h", k: "dim" },
    { t: "*/5 * * * * curl iamgui.dev  # é o uptime robot, juro", k: "dim" },
    { t: "Ø Ø 1 1 *   echo 'esse ano eu escrevo teste'", k: "dim" },
  ],
  "docker ps": [
    { t: "CONTAINER   IMAGE            STATUS          PORTS", k: "hi" },
    { t: "a1b2c3d4    node:22-alpine   Up 3 hours      3ØØØ->3ØØØ", k: "ok" },
    { t: "e5f6g7h8    postgres:16      Up 3 hours      5432->5432", k: "ok" },
    { t: "i9j0k1l2    redis:7          Restarting (1)  6379->6379", k: "err" },
  ],
  "kubectl get pods": [
    {
      t: "NAME                        READY  STATUS             RESTARTS",
      k: "hi",
    },
    { t: "portfolio-7d4b9c-x2k9p      1/1    Running            Ø", k: "ok" },
    { t: "api-5f8c2a-mn4qw            1/1    Running            2", k: "ok" },
    {
      t: "cache-3a7e1b-pp8zz          Ø/1    CrashLoopBackOff   247",
      k: "err",
    },
  ],
  // ── versões ─────────────────────────────────────────────
  "node -v": [{ t: "v22.22.3", k: "ok" }],
  "npm -v": [{ t: "1Ø.9.8", k: "ok" }],
  "python --version": [{ t: "Python 3.12.4", k: "ok" }],
  "git --version": [{ t: "git version 2.47.Ø", k: "ok" }],
  // ── git ─────────────────────────────────────────────────
  "git status": [
    { t: "On branch main", k: "ok" },
    { t: "Changes not staged for commit:", k: "hi" },
    {
      t: "  modified:   src/components/aquilo-que-eu-ia-refatorar.tsx",
      k: "err",
    },
    { t: "  modified:   TODO.md", k: "err" },
    { t: "Untracked files:", k: "hi" },
    { t: "  teste-final-2-AGORA-VAI.tsx", k: "err" },
  ],
  "git log": [
    { t: "a1b2c3d  fix: agora vai", k: "dim" },
    { t: "e4f5g6h  fix: agora vai (de verdade)", k: "dim" },
    { t: "i7j8k9l  revert: não ia", k: "dim" },
    { t: "m0n1o2p  feat: implementa a tela toda", k: "ok" },
  ],
  "git commit": [
    { t: 'git commit -m "ajustes"', k: "dim" },
    {
      t: "a mensagem de commit mais honesta e mais inútil já escrita.",
      k: "dim",
    },
  ],
  // ── editores ────────────────────────────────────────────
  nano: [
    { t: "GNU nano 8.1", k: "ok" },
    {
      t: "^X Sair  ^O Gravar  — sim, aqui as teclas ficam escritas na tela.",
      k: "dim",
    },
    { t: "é por isso que você usa nano e diz que usa vim.", k: "dim" },
  ],
  emacs: [
    { t: "carregando emacs...", k: "dim" },
    {
      t: "um ótimo sistema operacional. faltou um editor de texto decente.",
      k: "ok",
    },
  ],
  // ── perigosos ───────────────────────────────────────────
  "kill -9": [
    { t: "kill: falta o PID.", k: "err" },
    { t: "e -9 não é gentil. mas funciona.", k: "dim" },
  ],
  mount: [{ t: RO, k: "err" }],
};

// mesmas saídas por caminhos diferentes de digitação
Object.assign(SHELL, {
  "uname -a": SHELL.uname,
  "df -h --total": SHELL["df -h"],
  df: SHELL["df -h"],
  free: SHELL["free -h"],
  ps: SHELL["ps aux"],
  htop: SHELL.top,
  ifconfig: SHELL["ip a"],
  "ip addr": SHELL["ip a"],
  ss: SHELL.netstat,
  "systemctl status": SHELL.systemctl,
  service: SHELL.systemctl,
  nginx: SHELL["nginx -t"],
  logs: SHELL.journalctl,
  "tail -f": SHELL.journalctl,
  crontab: SHELL["crontab -l"],
  docker_ps: SHELL["docker ps"],
  kubectl: SHELL["kubectl get pods"],
  "docker compose up": SHELL["docker ps"],
  node: SHELL["node -v"],
  "git log --oneline": SHELL["git log"],
  vi: SHELL.nano,
  umount: SHELL.mount,
  "ipconfig /all": SHELL.ipconfig,
});

/** Gerenciadores de pacote reconhecidos → subcomandos que contam como instalar. */
export const INSTALLERS: Record<string, string[]> = {
  npm: ["install", "i", "add"],
  pnpm: ["install", "i", "add"],
  yarn: ["add", "install"],
  bun: ["add", "install", "i"],
  pip: ["install"],
  pip3: ["install"],
  apt: ["install", "update", "upgrade"],
  "apt-get": ["install", "update", "upgrade"],
  brew: ["install"],
  cargo: ["add", "install"],
  composer: ["require", "install"],
  gem: ["install"],
  go: ["get", "install"],
};

const VERSION = (pkg: string) => {
  // versão determinística a partir do nome, pra parecer real sem Math.random()
  const n = [...pkg].reduce((a, c) => a + c.charCodeAt(0), 0);
  return `${n % 5}.${n % 23}.${n % 9}`;
};

/** Saída de instalação — o pacote entra no texto, então precisa ser função. */
export function install(mgr: string, verb: string, pkg: string): Line[] {
  if (verb === "update")
    return [
      {
        t: "Obtendo:1 http://deb.schr-os.org stable InRelease [12.4 kB]",
        k: "dim",
      },
      {
        t: "Obtendo:2 http://deb.schr-os.org stable/main amd64 [8.7 MB]",
        k: "dim",
      },
      { t: "Baixados 8.7 MB em 2s (4.1 MB/s)", k: "ok" },
      {
        t: "417 pacotes podem ser atualizados. você vai ignorar todos.",
        k: "dim",
      },
    ];

  if (verb === "upgrade")
    return [
      { t: "Calculando atualização... Concluído", k: "dim" },
      { t: "417 pacotes atualizados, 2 novos, Ø removidos.", k: "ok" },
      { t: "reinicie o serviço. ou o servidor. ou a carreira.", k: "dim" },
    ];

  if (!pkg)
    return [
      { t: `${mgr} ${verb}`, k: "dim" },
      { t: "resolvendo dependências ......... 1.4Ø7 pacotes", k: "dim" },
      { t: "adicionados 1.4Ø7 pacotes em 41s", k: "ok" },
      { t: "node_modules ..................... 1.2 GB", k: "err" },
      { t: "o objeto mais pesado do universo conhecido.", k: "dim" },
    ];

  const v = VERSION(pkg);
  return [
    { t: `resolvendo ${pkg}@latest do registry`, k: "dim" },
    { t: "[████████████████████] 1ØØ%", k: "dim" },
    { t: `+ ${pkg}@${v}`, k: "ok" },
    { t: `adicionado 1 pacote e auditados 428 pacotes em 3s`, k: "ok" },
    { t: "147 vulnerabilidades (3 baixas, 144 críticas)", k: "err" },
    {
      t: "execute `npm audit fix --force` para quebrar tudo de vez.",
      k: "dim",
    },
  ];
}
