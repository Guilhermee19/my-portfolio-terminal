# portfolio-terminal

Portfólio do Guilherme Santana com identidade de terminal CRT / HUD verde-fósforo.
Next.js 16 (App Router, render no servidor) + Tailwind v4 + Motion.

```bash
npm run dev     # http://localhost:3000
npm run build
npm start
npm test        # regras do placar do arcade
```

## O placar no VPS

Cada jogo grava numa coleção do json-server (`minima-jsonsever`, pm2, porta 3ØØ4):
`point-snake` e `point-tetris`. O json-server clássico **não cria coleção via POST** — se
não existir no `db.json`, a API responde 5Ø3 e o jogo cai no placar local.

```bash
# criar uma coleção que falta (ex.: point-tetris)
cd /root/projects/minima-jsonsever
node -e 'const f="db.json",d=JSON.parse(require("fs").readFileSync(f));d["point-tetris"]??=[];require("fs").writeFileSync(f,JSON.stringify(d,null,2))'
pm2 restart minima-jsonserver
```

```bash
# smoke test do CRUD, sem passar pelo app
B=http://62.171.172.35:3004/point-snake
curl -s $B                                                    # lista
curl -s -X POST $B -H 'content-type: application/json' \
  -d '{"id":"TST","name":"TST","score":10,"at":"2026-01-01","games":1}'
curl -s -X PUT $B/TST -H 'content-type: application/json' \
  -d '{"id":"TST","name":"TST","score":99,"at":"2026-01-02","games":2}'
curl -s -X DELETE $B/TST
```

## Estrutura

| Arquivo | O quê |
|---|---|
| `lib/data.ts` | **todo o conteúdo** — perfil, projetos, stack, timeline, serviços e as linhas do boot |
| `app/page.tsx` | página (server component) — as 6 seções |
| `app/globals.css` | tema, grade de fundo, scanlines e as utilities `brk` / `panel` / `glow` / `striped` / `lbl` |
| `components/boot-screen.tsx` | sequência de boot (uma vez por sessão, `sessionStorage`) |
| `components/hud.tsx` | barra superior, barra inferior e trilhos laterais |
| `components/reveal.tsx` | entrada no scroll + texto que decodifica |
| `components/terminal.tsx` | o easter egg: console, comandos, piadas e as telas de 404 / bug |
| `components/access-cards.tsx` | os 3 contadores de acesso no hero |
| `components/modal.tsx` | o popup reusado por projetos e certificados (ESC, backdrop, foco, trava o scroll) |
| `components/crt-image.tsx` | imagem com o tratamento de tubo — e o placeholder `NO SIGNAL` quando não tem arquivo |
| `components/project-grid.tsx` | os cards de projeto + o popup de detalhe |
| `components/certificates.tsx` | os cards de certificado + o popup, com o toggle `VER ORIGINAL` |
| `lib/visits.ts` | regras do contador (agregação, poda) + id anônimo e cliente |
| `lib/github.ts` | a contagem de repos públicos, lida da API do GitHub na renderização |
| `app/api/visits/route.ts` | ponte pro json-server: valida o id, faz o upsert, devolve as métricas |
| `components/arcade.tsx` | o que os dois jogos compartilham: marquee, atração, game over, código, placar |
| `components/snake.tsx` | a cobrinha |
| `components/tetris.tsx` | os blocos, estilo Game Boy |
| `lib/tetris.ts` | regras puras do tetris (rotação, colisão, wall kick, linhas, pontuação) |
| `lib/scores.ts` | regras do placar (ranking, recorde) + cliente e fallback local |
| `app/api/scores/route.ts` | ponte pro json-server: valida, faz o upsert e calcula a posição |
| `app/not-found.tsx` | 404 de verdade, reaproveitando a tela do comando `404` |

Para editar o portfólio, mexa em `lib/data.ts` — o resto é chrome.

## Certificados e screenshots

As únicas imagens do projeto. Solte o arquivo em `public/certs/` (ou
`public/projects/`) e aponte pra ele em `lib/data.ts`:

```ts
// certificates[]              // projects[].shots[]
image: "/certs/arquivo.webp"   { src: "/projects/arquivo.webp", alt: "..." }
```

Sem `image`/`shots` o card mostra o placeholder `NO SIGNAL` e nada quebra — dá pra
cadastrar o certificado antes de ter o arquivo.

**O filtro de tubo** (`@utility crt-shot` no `globals.css`) existe porque diploma é
papel branco com brasão colorido, e isso briga com o fósforo verde. A imagem é
dessaturada, tingida com `var(--color-grn)` via `mix-blend-mode: color` e coberta pela
mesma `.crt-scan` do resto do site — então o comando `theme` **repinta os certificados
junto**. Passar o mouse em cima de qualquer imagem desliga o tubo e mostra o arquivo
cru — no card e no popup. E o popup ainda tem o `VER ORIGINAL`, que fixa o original
(inclusive no celular, onde não existe hover): diploma também é pra ser lido.

Formato: `.webp`, lado maior em torno de 16ØØpx. O `next/image` cuida do resto.
Para editar/adicionar comandos, é o mapa `QUIPS` (piadas) ou o `switch` do `run()` em `terminal.tsx`.

## Contador de acessos

Os 3 cards do hero (`ACESSOS` / `SEMANA` / `ÚNICOS`) vêm da coleção `visits` do mesmo
json-server, pela ponte `/api/visits`.

**Um registro por visitante, não por acesso** — o json-server devolve a coleção inteira no GET,
então um registro por acesso cresceria sem teto. Cada registro guarda `count`, `first`, `last` e
um `days: { "2026-08-24": 2 }` podado para 14 dias. Daí saem as três métricas: total é a soma dos
`count`, semana é a soma dos `days` dos últimos 7 dias, únicos é a quantidade de registros.

- **1 acesso por sessão** (`sessionStorage`): F5 não conta, e isso também neutraliza o efeito
  duplo do StrictMode.
- **Identificação anônima**: um id aleatório em `localStorage` (`gui:vid`). Sem IP, sem
  user-agent, sem fingerprint.
- **Não conta em localhost** — pra testar em dev: `localStorage.setItem("gui:count-local","1")`.
- Se a API cair, os cards mostram `----` e o hero segue normal.

Limitações: endpoint público sem auth (dá pra forjar POST), a contagem é por navegador (limpar o
storage vira um "único" novo) e quem bloqueia JS não é contado — bots que não executam script
também não, o que aqui é a favor.

## Repos públicos

O card `REPOS PÚBLICOS` do bloco SOBRE não é um número digitado — vem de
`api.github.com/users/<profile.githubUser>`.

A chamada acontece **no servidor**, na renderização da página, com
`next: { revalidate: 36ØØ }`. Isso importa: a API sem token dá 6Ø requisições por
hora **por IP**. No servidor é uma chamada por hora no total, e a página continua
estática (vira ISR, revalidada de hora em hora). No cliente seria uma chamada por
visitante, com o IP de quem visita pagando a conta — e o número chegaria depois da
primeira pintura.

Se a API cair, mudar de formato ou estourar o limite, `publicRepos()` devolve `null`
e o card fica com o valor congelado em `lib/data.ts`. Sem `----`, sem buraco: esse
número muda de mês em mês, então um valor um pouco velho é melhor que um vazio.

## O terminal

Abre pelo botão `>_` da topbar, pelo `>_ ABRIR TERMINAL` do hero ou pela tecla `~`.
Reescreve a intro a cada abertura, cursor em bloco, fecha no ESC.

Persistem no `localStorage` entre visitas (restaurados antes da 1ª pintura pelo
script inline do `layout.tsx`, então não tem flash):
`theme` → a cor do sistema · `gui:hist` → os últimos 60 comandos, que as setas ↑↓ percorrem.

- `iamgui login` → pede senha (`guilherme_mendonca`) → libera **root** e lista todos os
  comandos escondidos. Fica salvo em `gui:root`; `logout` sai. Depois disso o `help`
  já mostra a lista completa e o prompt vira `root@iamgui.dev:~#`.
  A senha está no bundle, como todo código de front — é easter egg, não segurança.
- `help`, `ls`, `cat <arquivo>` (tem um `.segredo`), `whoami`, `history`, `projetos`, `certificados`, `contato`
- `theme <cor>` — repinta o **site inteiro**; só `--color-grn` muda, o resto da paleta
  deriva dela via `color-mix` no `globals.css`.
- `hello world`, `marvel`, `jarvis`, `404`, `bug`, `hack`, `matrix`, `konami`
- front: `!important`, `z-index`, `center`, `undefined`, `nan`, `console.log`, `hydration`
- back: `sql`, `docker`, `k8s`, `cache`, `regex`, `deploy`, `env`, `chmod 777`, `vim`, `500`
- e ainda `git blame`, `stackoverflow`, `tabs`, `python`, `coffee`, `sudo`, `rm`

### Telas cheias (um componente cada, em `components/`)

| Comando | O quê |
|---|---|
| `matrix` | chuva de código em canvas + escolha da pílula vermelha/azul |
| `gohorse` / `xgh` | os axiomas do eXtreme Go Horse e o certificado |
| `code .` | editor fake com o CSS e o markup **deste** site (sem a lógica) |
| `creeper` | o susto, a explosão em blocos e a tela de manutenção |
| `lost` | o contador da escotilha, 1Ø8 min; digite 4 8 15 16 23 42 pra reiniciar |
| `shutdown` | o site colapsa como um tubo CRT desligando |
| `404` · `bug` | tela de 404 e kernel panic com os insetos |
| `snake` | o fliperama (ver acima) |

### Comandos de shell (`lib/commands.ts`)

Pra parecer um terminal de verdade, não só um menu:

- **sessão** — `reset` / `reboot` (recarregam a página e rodam o boot de novo), `su`, `sudo su`, `id`, `groups`
- **arquivos** — `pwd`, `cd`, `find`, `which`, `grep`, `man`, `echo`, `mkdir`/`touch`/`mv`/`cp` (somente leitura)
- **sistema** — `uname -a`, `neofetch`, `uptime`, `top`/`htop`, `ps aux`, `df -h`, `free -h`, `kill`, `shutdown`
- **rede** — `ip a`/`ifconfig`, `netstat`/`ss`, `traceroute`, `ssh`, `curl`, `wget`
- **servidor** — `systemctl`, `nginx -t`, `journalctl`, `crontab -l`, `docker ps`, `kubectl get pods`
- **instalação** — `npm`/`pnpm`/`yarn`/`bun`/`pip`/`apt`/`brew`/`cargo`/`composer`/`gem`/`go` +
  subcomando; aceita pacote (`npm i three` → resolve, barra de progresso, versão, "vulnerabilidades")
- **versões/editores** — `node -v`, `npm -v`, `python --version`, `git --version`, `nano`, `emacs`, `code .`
- **git** — `git status`, `git log`, `git commit`

Saída fixa vai no mapa `SHELL`; o que precisa do argumento (instaladores, `echo`, `ssh`…)
está no `switch` do `run()` em `terminal.tsx`.

### Referências geek e IAs (`lib/refs.ts`)

Mapa `REFS`, mesma regra de lookup dos outros.

- **IAs**, cada uma respondendo no estilo dela: `claude`, `chatgpt`, `gemini`, `copilot`,
  `cursor`, `deepseek`, `midjourney`, `prompt` — e `ia` lista todas.
- **Geek**: `batman`, `42`, `nemo`, `hal`, `skynet`, `jurassic`, `delorean`, `force`,
  `groot`, `wakanda`, `hodor`, `mordor`, `cake`, `doom`, `zelda`, `pikachu`, `r2d2`,
  `1337`, `spoon` — cada um com vários aliases (`i am batman`, `hal 9000`, `88mph`…).

Nada de diálogo copiado de filme: as respostas são escritas aqui, a graça é a piscadela.

## O arcade

Duas máquinas: `snake` / `cobrinha` e `tetris` / `blocos`. `arcade` lista as duas.
`scores` mostra o topo das duas; `scores snake` / `scores tetris` abre o top 1Ø de uma.

**O que é comum aos dois** vive em `components/arcade.tsx`: o hook `useArcade(game)`
(hi-score, o que acontece depois do game over, gravação) e as telas de marquee, atração,
`GAME OVER`, seletor de código e placar. Cada jogo só cuida do próprio tabuleiro.

- Morreu com pontos: seletor de código de **5 caracteres**. `↑↓` letra, `←→` slot, digitar
  direto funciona, `_` é slot vazio e cai fora (dá pra usar de 1 a 5).
- O código é **compartilhado** entre os jogos (quem é `GUI19` no snake entra como `GUI19`
  no tetris), mas o **placar é separado** — score de tetris não se compara com o de snake.
- O código é o **id** no json-server: jogar de novo só troca o recorde se superar. Empate
  desempata por quem chegou primeiro.

### Snake
Tabuleiro 28×20. Setas ou WASD, `P` pausa, `ESC` sai; no celular, swipe ou d-pad.
A primeira fruta vem em linha reta de propósito — ensina o jogo sem tutorial.

### Tetris
Do jeito que era no **Game Boy**: campo 1Ø×18, monocromático (cada peça é um tom do tema,
com o quadradinho interno que o GB usava pra distinguir peça sem cor), **sem ghost, sem
hold**, uma peça no next, sorteio burro e pontuação 4Ø/1ØØ/3ØØ/12ØØ × nível. Nível sobe a
cada 1Ø linhas e a queda acelera.

Duas concessões modernas: **hard drop** (espaço) e **wall kick** (girar encostado na parede
empurra a peça pra dentro). `←→` move, `↓` desce, `↑`/`X` gira, `Z` gira ao contrário.
No celular: swipe lateral move, swipe pra baixo derruba, toque gira — mais os botões.

As regras ficam em `lib/tetris.ts`, sem React nem DOM, e é o que `npm test` cobre.

### Gravação

`browser → /api/scores?game=<jogo> → {JSON_SERVER_URL}/point-<jogo>`. A ponte existe porque
o json-server é `http://` e o site é `https://` — chamada direta seria bloqueada por mixed
content. Ela também valida o código (`^[A-Z0-9]{1,5}$`), o jogo e o teto de score.

Se a API cair, grava em `localStorage` (`gui:scores:<jogo>`) e mostra
`⚠ SERVIDOR INDISPONÍVEL · PLACAR LOCAL` — nunca quebra.

**Limitação assumida:** o placar é público e sem autenticação, então dá pra forjar um POST.
A validação barra lixo, não fraude. Autenticar um easter egg não se paga.

## Detalhes

- O chrome é CSS puro: grade, scanline, brilho e o título listrado, zero asset.
  As únicas imagens do site são os certificados e os screenshots de projeto — e mesmo
  elas passam pelo filtro de tubo (ver abaixo).
- O boot roda uma vez por sessão; um script inline no `layout.tsx` evita o flash em quem já bootou.
- `prefers-reduced-motion` desliga as animações (inclusive o scramble).
- Deploy: qualquer host de Next (Vercel `next build` padrão).
# my-portfolio-terminal
