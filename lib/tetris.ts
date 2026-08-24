/**
 * Regras do Tetris, sem React e sem DOM — é o que os testes cobrem.
 * Modelo do Game Boy: campo 1Ø×18, sem ghost, sem hold, uma peça no next,
 * sorteio burro (pode dar cinco S seguidos) e pontuação 4Ø/1ØØ/3ØØ/12ØØ × nível.
 * As duas concessões modernas ficam aqui: hard drop e wall kick.
 */
export const COLS = 10;
export const ROWS = 18;

export type Kind = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
/** 0 = vazio; senão é o índice da peça +1, pra saber o tom de cada bloco. */
export type Cell = number;
export type Board = Cell[][];
export type Piece = {
  kind: Kind;
  cells: [number, number][];
  x: number;
  y: number;
};

export const KINDS: Kind[] = ["I", "O", "T", "S", "Z", "J", "L"];

/** Peças em coordenadas relativas [x, y], já na rotação inicial. */
const SHAPES: Record<Kind, [number, number][]> = {
  I: [
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
  ],
  O: [
    [1, 0],
    [2, 0],
    [1, 1],
    [2, 1],
  ],
  T: [
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  S: [
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
  ],
  Z: [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
  ],
  J: [
    [0, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  L: [
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ],
};

export const emptyBoard = (): Board =>
  Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(0));

export const spawn = (kind: Kind): Piece => ({
  kind,
  cells: SHAPES[kind].map(([x, y]) => [x, y] as [number, number]),
  x: kind === "I" || kind === "O" ? 3 : 3,
  y: 0,
});

/** Sorteio burro, como no Game Boy: sem 7-bag, sem piedade. */
export const randomKind = (): Kind =>
  KINDS[Math.floor(Math.random() * KINDS.length)];

/** Posições absolutas da peça no campo. */
export const blocks = (p: Piece): [number, number][] =>
  p.cells.map(([x, y]) => [p.x + x, p.y + y]);

/** Cabe aqui? Fora das bordas, abaixo do piso ou sobre bloco fixo = não. */
export function fits(board: Board, p: Piece): boolean {
  return blocks(p).every(
    ([x, y]) => x >= 0 && x < COLS && y < ROWS && (y < 0 || board[y][x] === 0),
  );
}

/** Gira 9Ø° horário (dir=1) ou anti-horário (dir=-1) dentro da caixa da peça. */
export function rotate(p: Piece, dir: 1 | -1): Piece {
  if (p.kind === "O") return p; // o quadrado não gira, gira?
  const size = Math.max(...p.cells.flat()) + 1;
  const cells = p.cells.map(([x, y]) =>
    dir === 1
      ? ([size - 1 - y, x] as [number, number])
      : ([y, size - 1 - x] as [number, number]),
  );
  return { ...p, cells };
}

/**
 * Gira com wall kick: tenta no lugar, depois empurrando 1 e 2 casas pros lados.
 * Sem isso, girar encostado na parede simplesmente não acontece (era assim no GB).
 */
export function rotateWithKick(
  board: Board,
  p: Piece,
  dir: 1 | -1,
): Piece | null {
  const turned = rotate(p, dir);
  for (const dx of [0, -1, 1, -2, 2]) {
    const candidate = { ...turned, x: turned.x + dx };
    if (fits(board, candidate)) return candidate;
  }
  return null;
}

export const move = (board: Board, p: Piece, dx: number, dy: number) => {
  const next = { ...p, x: p.x + dx, y: p.y + dy };
  return fits(board, next) ? next : null;
};

/** Onde a peça para se cair reto — o hard drop. */
export function drop(board: Board, p: Piece): { piece: Piece; rows: number } {
  let rows = 0;
  let cur = p;
  for (;;) {
    const next = move(board, cur, 0, 1);
    if (!next) return { piece: cur, rows };
    cur = next;
    rows++;
  }
}

/** Fixa a peça no campo. Devolve um tabuleiro novo. */
export function lock(board: Board, p: Piece): Board {
  const next = board.map((r) => [...r]);
  const tone = KINDS.indexOf(p.kind) + 1;
  for (const [x, y] of blocks(p)) if (y >= 0 && y < ROWS) next[y][x] = tone;
  return next;
}

/** Remove as linhas cheias e empurra o resto pra baixo. */
export function clearLines(board: Board): { board: Board; cleared: number } {
  const kept = board.filter((row) => row.some((c) => c === 0));
  const cleared = ROWS - kept.length;
  if (!cleared) return { board, cleared: 0 };
  const empty = Array.from({ length: cleared }, () =>
    Array<Cell>(COLS).fill(0),
  );
  return { board: [...empty, ...kept], cleared };
}

/** Pontuação clássica: 4Ø/1ØØ/3ØØ/12ØØ multiplicado pelo nível +1. */
export const lineScore = (cleared: number, level: number) =>
  [0, 40, 100, 300, 1200][cleared] * (level + 1);

export const levelOf = (lines: number) => Math.floor(lines / 10);

/** Queda em ms: começa em ~8ØØ e vai apertando. */
export const speedOf = (level: number) => Math.max(80, 800 - level * 65);
