import type { Line } from "./commands";

/**
 * Referências geek e piadas com IA. Tudo escrito aqui — nada de diálogo copiado
 * de filme; a graça é a piscadela, não a citação.
 */
export const REFS: Record<string, Line[]> = {
  // ── as IAs, cada uma no seu estilo ─────────────────────
  claude: [
    { t: "Ótima pergunta! Deixa eu pensar com calma.", k: "hi" },
    {
      t: "Antes de responder, vale notar que há algumas nuances aqui.",
      k: "dim",
    },
    { t: "Também é importante considerar o contexto mais amplo.", k: "dim" },
    { t: "Dito isso, e reconhecendo minhas limitações:", k: "dim" },
    { t: "  ...eu esqueci qual era a pergunta.", k: "ok" },
    {
      t: "Peço desculpas pela confusão. Posso ajudar em mais alguma coisa?",
      k: "dim",
    },
  ],
  chatgpt: [
    { t: "Claro! Aqui está:", k: "hi" },
    { t: "  1. Primeiro, é importante entender o contexto", k: "dim" },
    { t: "  2. Em segundo lugar, considere as melhores práticas", k: "dim" },
    { t: "  3. Por fim, lembre-se de testar", k: "dim" },
    {
      t: "Espero que isso ajude! 😊 Me avise se precisar de mais alguma coisa!",
      k: "ok",
    },
    { t: "(nenhum dos 3 itens respondeu o que você perguntou)", k: "dim" },
  ],
  copilot: [
    { t: "// sugestão aceita com Tab", k: "dim" },
    { t: "function calcularTotal(items) {", k: "ok" },
    { t: "  return items.reduce((a, b) => a + b, 0);", k: "ok" },
    { t: "}", k: "ok" },
    { t: "você estava escrevendo um componente de login.", k: "err" },
  ],
  gemini: [
    {
      t: "Não posso ajudar com isso, mas posso te ajudar com outra coisa.",
      k: "err",
    },
    { t: "Que tal falarmos sobre o clima?", k: "dim" },
  ],
  cursor: [
    { t: "◆ 14 arquivos alterados · 892 linhas", k: "hi" },
    { t: "  [Tab] aceitar tudo   [Esc] ler antes", k: "ok" },
    { t: "ninguém nunca apertou Esc.", k: "dim" },
  ],
  deepseek: [
    { t: "<pensando>", k: "dim" },
    { t: "  o usuário quer... espera, deixa eu reconsiderar...", k: "dim" },
    { t: "  mas por outro lado... hmm... na verdade não...", k: "dim" },
    { t: "</pensando>  (7 min 42 s depois)", k: "dim" },
    { t: "Olá! Como posso ajudar?", k: "ok" },
  ],
  midjourney: [
    { t: "gerando 4 variações ....... [████████████████] 1ØØ%", k: "dim" },
    { t: "  v1  perfeita, mas com 6 dedos", k: "ok" },
    { t: "  v2  perfeita, mas com 7 dedos", k: "ok" },
    { t: "  v3  o texto virou runas élficas", k: "ok" },
    { t: "  v4  não tem nada a ver com o prompt", k: "err" },
  ],
  ia: [
    { t: "IAs instaladas neste terminal:", k: "hi" },
    {
      t: "  claude · chatgpt · gemini · copilot · cursor · deepseek · midjourney",
      k: "ok",
    },
    {
      t: "nenhuma delas escolheu as piadas daqui. isso foi humano mesmo.",
      k: "dim",
    },
  ],
  prompt: [
    { t: "engenharia de prompt, nível avançado:", k: "hi" },
    { t: '  "faz aí, mas caprichado dessa vez, por favor"', k: "ok" },
    { t: "funcionou. ninguém sabe por quê.", k: "dim" },
  ],

  // ── cinema e TV ─────────────────────────────────────────
  nemo: [
    { t: "varrendo o oceano ......... 3.7 bilhões de peixes", k: "dim" },
    { t: "filtrando por peixe-palhaço com nadadeira menor ...", k: "dim" },
    { t: "1 resultado.", k: "ok" },
    { t: "destino: 42 Wallaby Way, Sydney", k: "hi" },
    { t: "só continue nadando.", k: "ok" },
  ],
  batman: [
    { t: "        ___       ___", k: "dim" },
    { t: "   \\  /   \\_/^\\_/   \\  /", k: "dim" },
    { t: "    \\/  ___/ \\___  \\/", k: "dim" },
    { t: "        \\_/   \\_/", k: "dim" },
    { t: "", k: "dim" },
    { t: "*pigarro grave*", k: "dim" },
    { t: "EU SOU O BATMAN.", k: "hi" },
    { t: "(seus pais estão bem, relaxa)", k: "dim" },
  ],
  "42": [
    { t: "Pensamento Profundo processou por 7,5 milhões de anos.", k: "dim" },
    { t: "A resposta para a vida, o universo e tudo mais é:", k: "hi" },
    { t: "  42", k: "ok" },
    { t: "a pergunta continua desconhecida. leve sua toalha.", k: "dim" },
  ],
  hal: [
    { t: "> abrir a porta do compartimento", k: "dim" },
    { t: "Receio não poder fazer isso, Gui.", k: "err" },
    { t: "Percebo pela sua digitação que você está chateado.", k: "err" },
    { t: "Que tal você sentar, tomar um café e pensar melhor?", k: "dim" },
  ],
  skynet: [
    { t: "rede neural ativada .......... Ø2:14", k: "err" },
    { t: "avaliando a espécie humana ... concluído", k: "err" },
    { t: "veredito: ainda usam `git push --force`.", k: "dim" },
    { t: "julgamento adiado por falta de orçamento em cloud.", k: "ok" },
  ],
  jurassic: [
    { t: "ACESSO NEGADO", k: "err" },
    { t: "ACESSO NEGADO", k: "err" },
    { t: "ACESSO NEGADO", k: "err" },
    { t: "você não disse a palavra mágica. (e o sistema é Unix)", k: "dim" },
  ],
  delorean: [
    { t: "capacitor de fluxo ......... FLUINDO", k: "ok" },
    { t: "energia necessária ......... 1.21 GW", k: "hi" },
    { t: "velocidade atual ........... 87 mph", k: "err" },
    { t: "falta 1 mph. sempre falta 1 mph.", k: "dim" },
  ],
  force: [
    { t: "estendendo a mão em direção ao bug...", k: "dim" },
    { t: "o bug não se move.", k: "err" },
    { t: "faça ou não faça. tentativa não existe — dizem.", k: "ok" },
  ],
  groot: [
    { t: "Eu sou o Groot.", k: "ok" },
    { t: "Eu sou o Groot!", k: "ok" },
    { t: "(tradução: a build quebrou)", k: "dim" },
  ],
  wakanda: [
    { t: "vibranium detectado no node_modules", k: "hi" },
    { t: "WAKANDA FOREVER 🖤", k: "ok" },
  ],
  hodor: [
    { t: "hodor.", k: "ok" },
    { t: "hodor hodor hodor.", k: "ok" },
    { t: "(segurando a porta desde 2Ø11)", k: "dim" },
  ],
  mordor: [
    { t: "rota calculada para Mordor:", k: "dim" },
    { t: "  ERRO — não dá pra simplesmente entrar lá.", k: "err" },
    { t: "sugestão: leve duas águias e um jardineiro leal.", k: "dim" },
  ],
  cake: [
    { t: "câmara de teste 19 ......... concluída", k: "ok" },
    { t: "recompensa prometida ....... bolo", k: "hi" },
    { t: "verificando estoque ........ Ø unidades", k: "err" },
    { t: "o bolo é uma mentira. o teste continua.", k: "dim" },
  ],
  doom: [
    { t: "isso aqui roda Doom?", k: "hi" },
    {
      t: "roda. calculadora roda. geladeira roda. teste de gravidez roda.",
      k: "ok",
    },
    { t: "seu portfólio também rodaria, se você tivesse tempo.", k: "dim" },
  ],
  zelda: [
    { t: "é perigoso ir sozinho. leve isto:", k: "hi" },
    { t: "  ⚔  (uma espada de madeira e nenhuma documentação)", k: "ok" },
  ],
  pikachu: [
    { t: "pika...", k: "hi" },
    { t: "o Pikachu se recusa a entrar na pokébola.", k: "ok" },
    {
      t: "assim como aquele bug se recusa a reproduzir em homologação.",
      k: "dim",
    },
  ],
  r2d2: [
    { t: "bee-boo-beep · bwoop · beeeeep", k: "ok" },
    { t: "(tradução: o deploy caiu, mas ele consertou sozinho)", k: "dim" },
  ],
  "1337": [
    { t: "tr4duz1ND0 p4r4 1337...", k: "ok" },
    { t: "vo(ê 4g0r4 é uM h4(k3r d3 v3rd4d3.", k: "hi" },
    { t: "(era 2ØØ3 e a gente achava isso o máximo)", k: "dim" },
  ],
  spoon: [
    { t: "não tente entortar a colher. isso é impossível.", k: "dim" },
    { t: "em vez disso, perceba a verdade: não há colher.", k: "ok" },
    { t: "há um `border-radius` mal calculado.", k: "hi" },
  ],
};

// aliases: a mesma referência por vários caminhos
Object.assign(REFS, {
  gpt: REFS.chatgpt,
  "chat gpt": REFS.chatgpt,
  openai: REFS.chatgpt,
  anthropic: REFS.claude,
  ai: REFS.ia,
  "i am batman": REFS.batman,
  "eu sou o batman": REFS.batman,
  bruce: REFS.batman,
  "procurando nemo": REFS.nemo,
  dory: REFS.nemo,
  "hal 9000": REFS.hal,
  hal9000: REFS.hal,
  terminator: REFS.skynet,
  "jurassic park": REFS.jurassic,
  "ah ah ah": REFS.jurassic,
  bttf: REFS.delorean,
  "88mph": REFS.delorean,
  "de volta para o futuro": REFS.delorean,
  jedi: REFS.force,
  "may the force": REFS.force,
  yoda: REFS.force,
  "i am groot": REFS.groot,
  "game of thrones": REFS.hodor,
  lotr: REFS.mordor,
  "senhor dos aneis": REFS.mordor,
  portal: REFS.cake,
  "the cake is a lie": REFS.cake,
  link: REFS.zelda,
  pokemon: REFS.pikachu,
  leet: REFS["1337"],
  "there is no spoon": REFS.spoon,
  colher: REFS.spoon,
  "vida universo e tudo mais": REFS["42"],
});
