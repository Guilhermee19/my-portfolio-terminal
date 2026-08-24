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

O `snake` grava na coleção `point-snake` do json-server (`minima-jsonsever`, pm2, porta 3ØØ4).
A coleção já existe. Se um dia sumir, o json-server clássico **não recria via POST** — tem que
voltar no `db.json` e reiniciar, senão a API responde 5Ø3 e o jogo cai no placar local.

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
| `app/page.tsx` | página (server component) — as 5 seções |
| `app/globals.css` | tema, grade de fundo, scanlines e as utilities `brk` / `panel` / `glow` / `striped` / `lbl` |
| `components/boot-screen.tsx` | sequência de boot (uma vez por sessão, `sessionStorage`) |
| `components/hud.tsx` | barra superior, barra inferior e trilhos laterais |
| `components/reveal.tsx` | entrada no scroll + texto que decodifica |
| `components/terminal.tsx` | o easter egg: console, comandos, piadas e as telas de 404 / bug |
| `components/access-cards.tsx` | os 3 contadores de acesso no hero |
| `lib/visits.ts` | regras do contador (agregação, poda) + id anônimo e cliente |
| `app/api/visits/route.ts` | ponte pro json-server: valida o id, faz o upsert, devolve as métricas |
| `components/snake.tsx` | o fliperama: jogo, seletor de código e placar |
| `lib/scores.ts` | regras do placar (ranking, recorde) + cliente e fallback local |
| `app/api/scores/route.ts` | ponte pro json-server: valida, faz o upsert e calcula a posição |
| `app/not-found.tsx` | 404 de verdade, reaproveitando a tela do comando `404` |

Para editar o portfólio, mexa em `lib/data.ts` — o resto é chrome.
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
- `help`, `ls`, `cat <arquivo>` (tem um `.segredo`), `whoami`, `history`, `projetos`, `contato`
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

## O arcade (`snake`)

`snake` / `cobrinha` / `jogo` / `play` abre o gabinete em tela cheia; `scores` / `placar`
mostra o top 1Ø sem jogar.

- Tabuleiro 28×20 de quadradinhos: a grade é `background`, só a cobra e a fruta viram nó
  no DOM. Herda a cor do comando `theme`.
- Setas ou WASD, `P` pausa, `ESC` sai. No celular, swipe no tabuleiro ou o d-pad.
  A primeira fruta vem em linha reta de propósito — ensina o jogo sem tutorial.
- Morreu com pontos: entra o seletor de código de **5 caracteres**. `↑↓` letra, `←→` slot,
  digitar direto funciona, `_` é slot vazio e cai fora (dá pra usar de 1 a 5).
- O código é o **id** no json-server: jogar de novo com o mesmo código só troca o recorde
  se superar. Empate no placar desempata por quem chegou primeiro.

Fluxo de gravação: browser → `/api/scores` → `{JSON_SERVER_URL}/point-snake`.
A ponte existe porque o json-server é `http://` e o site é `https://` — chamada direta
seria bloqueada por mixed content. Ela também valida o código (`^[A-Z0-9]{1,5}$`) e o
teto de score antes de gravar.

Se a API cair, o jogo grava em `localStorage` (`gui:scores`) e mostra
`⚠ SERVIDOR INDISPONÍVEL · PLACAR LOCAL` — nunca quebra.

**Limitação assumida:** o placar é público e sem autenticação, então dá pra forjar um POST.
A validação barra lixo, não fraude. Autenticar um easter egg não se paga.

## Detalhes

- Sem imagem nenhuma: grade, scanline, brilho e o título listrado são CSS puro.
- O boot roda uma vez por sessão; um script inline no `layout.tsx` evita o flash em quem já bootou.
- `prefers-reduced-motion` desliga as animações (inclusive o scramble).
- Deploy: qualquer host de Next (Vercel `next build` padrão).
# my-portfolio-terminal
