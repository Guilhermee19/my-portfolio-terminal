# portfolio-terminal

Portfólio do Guilherme Santana com identidade de terminal CRT / HUD verde-fósforo.
Next.js 16 (App Router, render no servidor) + Tailwind v4 + Motion.

```bash
npm run dev     # http://localhost:3000
npm run build
npm start
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
| `app/not-found.tsx` | 404 de verdade, reaproveitando a tela do comando `404` |

Para editar o portfólio, mexa em `lib/data.ts` — o resto é chrome.
Para editar/adicionar comandos, é o mapa `QUIPS` (piadas) ou o `switch` do `run()` em `terminal.tsx`.

## O terminal

Abre pelo botão `>_` da topbar, pelo `>_ ABRIR TERMINAL` do hero ou pela tecla `~`.
Reescreve a intro a cada abertura, tem histórico com ↑↓, cursor em bloco e fecha no ESC.

- `help`, `ls`, `cat <arquivo>` (tem um `.segredo`), `whoami`, `projetos`, `contato`
- `theme <cor>` — repinta o **site inteiro**; só `--color-grn` muda, o resto da paleta
  deriva dela via `color-mix` no `globals.css`. Fica salvo no `localStorage`.
- `hello world`, `marvel`, `jarvis`, `404`, `bug`, `hack`, `matrix`, `konami`
- front: `!important`, `z-index`, `center`, `npm install`, `undefined`, `nan`, `console.log`, `hydration`
- back: `sql`, `docker`, `k8s`, `cache`, `regex`, `deploy`, `env`, `chmod 777`, `vim`, `500`
- e ainda `git blame`, `stackoverflow`, `tabs`, `python`, `coffee`, `sudo`, `rm`

## Detalhes

- Sem imagem nenhuma: grade, scanline, brilho e o título listrado são CSS puro.
- O boot roda uma vez por sessão; um script inline no `layout.tsx` evita o flash em quem já bootou.
- `prefers-reduced-motion` desliga as animações (inclusive o scramble).
- Deploy: qualquer host de Next (Vercel `next build` padrão).
# my-portfolio-terminal
