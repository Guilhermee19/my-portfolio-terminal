// node --experimental-strip-types --test lib/tetris.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  COLS,
  ROWS,
  blocks,
  clearLines,
  drop,
  emptyBoard,
  fits,
  levelOf,
  lineScore,
  lock,
  move,
  rotate,
  rotateWithKick,
  spawn,
  speedOf,
  type Board,
} from "./tetris.ts";

/** Tabuleiro com as linhas de baixo cheias (deixando um furo, se pedido). */
function withFloor(rows: number, hole?: number): Board {
  const b = emptyBoard();
  for (let y = ROWS - rows; y < ROWS; y++)
    for (let x = 0; x < COLS; x++) if (x !== hole) b[y][x] = 1;
  return b;
}

test("peça nova cabe no campo vazio", () => {
  for (const k of ["I", "O", "T", "S", "Z", "J", "L"] as const)
    assert.equal(fits(emptyBoard(), spawn(k)), true, `${k} não coube`);
});

test("não atravessa parede nem piso", () => {
  const b = emptyBoard();
  // o O ocupa os x relativos 1 e 2, então encostado na esquerda é x = -1
  const esquerda = { ...spawn("O"), x: -1 };
  assert.deepEqual(
    blocks(esquerda)
      .map(([x]) => x)
      .sort(),
    [0, 0, 1, 1],
  );
  assert.equal(move(b, esquerda, -1, 0), null, "passou da esquerda");

  const direita = { ...spawn("O"), x: COLS - 3 };
  assert.equal(move(b, direita, 1, 0), null, "passou da direita");

  const { piece } = drop(b, spawn("O"));
  assert.equal(move(b, piece, 0, 1), null, "atravessou o piso");
});

test("não atravessa bloco já fixado", () => {
  const b = withFloor(1);
  const { piece } = drop(b, spawn("O"));
  assert.equal(move(b, piece, 0, 1), null);
  // parou EM CIMA do chão, não dentro dele
  assert.ok(blocks(piece).every(([, y]) => y < ROWS - 1));
});

test("girar 4 vezes volta ao formato original", () => {
  for (const k of ["I", "T", "S", "Z", "J", "L"] as const) {
    const p = spawn(k);
    let cur = p;
    for (let i = 0; i < 4; i++) cur = rotate(cur, 1);
    assert.deepEqual(
      [...cur.cells].sort(),
      [...p.cells].sort(),
      `${k} não fechou o ciclo`,
    );
  }
});

test("o O não gira", () => {
  const p = spawn("O");
  assert.deepEqual(rotate(p, 1).cells, p.cells);
});

test("wall kick empurra a peça pra dentro ao girar na parede", () => {
  const b = emptyBoard();
  // I encostado na parede esquerda; girar sem kick sairia do campo
  const encostada = { ...spawn("I"), x: -1 };
  const semKick = rotate(encostada, 1);
  const comKick = rotateWithKick(b, encostada, 1);
  assert.ok(comKick, "wall kick devia ter achado espaço");
  assert.equal(fits(b, comKick!), true);
  assert.ok(
    !fits(b, semKick) || comKick!.x === encostada.x,
    "se não precisava de kick, não devia empurrar",
  );
});

test("rotação sem saída devolve null", () => {
  // campo inteiro cheio, menos exatamente onde o I horizontal está deitado:
  // não sobra nenhuma coluna com 4 espaços livres pra ele ficar em pé
  const p = { ...spawn("I"), x: 3, y: 5 };
  const livres = new Set(blocks(p).map(([x, y]) => `${x},${y}`));
  const b = emptyBoard();
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++) if (!livres.has(`${x},${y}`)) b[y][x] = 1;

  assert.equal(fits(b, p), true, "o I tem que caber deitado onde está");
  assert.equal(rotateWithKick(b, p, 1), null, "não havia espaço pra girar");
});

test("hard drop encosta no chão e conta as linhas percorridas", () => {
  const { piece, rows } = drop(emptyBoard(), spawn("O"));
  assert.equal(move(emptyBoard(), piece, 0, 1), null, "não foi até o fim");
  assert.ok(rows > 0);
});

test("uma linha completa é removida e o resto desce", () => {
  const b = withFloor(1, 3); // chão com um furo na coluna 3
  const marcador = 7;
  b[ROWS - 2][0] = marcador; // bloco solto acima
  const cheio = lock(b, { ...spawn("I"), x: 3, y: ROWS - 1, cells: [[0, 0]] });
  const { board, cleared } = clearLines(cheio);
  assert.equal(cleared, 1);
  assert.equal(board.length, ROWS, "o campo tem que manter a altura");
  assert.equal(
    board[ROWS - 1][0],
    marcador,
    "o bloco de cima devia ter descido",
  );
});

test("quatro linhas de uma vez", () => {
  const { board, cleared } = clearLines(withFloor(4));
  assert.equal(cleared, 4);
  assert.ok(board.every((r) => r.every((c) => c === 0)));
});

test("campo sem linha cheia não muda", () => {
  const b = withFloor(2, 5);
  const { board, cleared } = clearLines(b);
  assert.equal(cleared, 0);
  assert.equal(board, b, "sem linha cheia, devolve o mesmo tabuleiro");
});

test("pontuação escala com o nível", () => {
  assert.equal(lineScore(1, 0), 40);
  assert.equal(lineScore(4, 0), 1200);
  assert.equal(lineScore(4, 9), 12000, "nível 9 multiplica por 10");
  assert.equal(lineScore(0, 5), 0);
});

test("nível sobe a cada 10 linhas e a queda acelera", () => {
  assert.equal(levelOf(0), 0);
  assert.equal(levelOf(9), 0);
  assert.equal(levelOf(10), 1);
  assert.ok(speedOf(1) < speedOf(0), "nível maior tem que cair mais rápido");
  assert.ok(speedOf(99) >= 80, "existe um piso de velocidade");
});
