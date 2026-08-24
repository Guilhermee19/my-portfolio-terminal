// node --experimental-strip-types --test lib/scores.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { positionOf, rankBoard, upsert, type Score } from "./scores.ts";

const s = (id: string, score: number, at: string): Score => ({
  id,
  name: id,
  score,
  at,
  games: 1,
});

test("ordena por score desc e desempata por quem chegou primeiro", () => {
  const sorted = rankBoard([
    s("B", 100, "2026-01-02"),
    s("A", 100, "2026-01-01"),
    s("C", 300, "2026-01-03"),
  ]);
  assert.deepEqual(
    sorted.map((x) => x.id),
    ["C", "A", "B"],
  );
  assert.equal(positionOf(sorted, "B"), 3);
  assert.equal(positionOf(sorted, "ZZ"), null);
});

test("nome novo entra no placar", () => {
  const { list, entry, isRecord } = upsert([], "GUI", 50, "2026-01-01");
  assert.equal(list.length, 1);
  assert.equal(entry.score, 50);
  assert.equal(isRecord, true);
});

test("score menor NÃO derruba o recorde, mas conta a partida", () => {
  const before = [s("GUI", 500, "2026-01-01")];
  const { list, isRecord } = upsert(before, "GUI", 100, "2026-02-02");
  assert.equal(list[0].score, 500, "o recorde tem que sobreviver");
  assert.equal(list[0].at, "2026-01-01", "a data do recorde também");
  assert.equal(list[0].games, 2);
  assert.equal(isRecord, false);
});

test("score maior atualiza o recorde no mesmo id", () => {
  const before = [s("GUI", 500, "2026-01-01")];
  const { list, isRecord } = upsert(before, "GUI", 900, "2026-02-02");
  assert.equal(list.length, 1, "não pode duplicar o jogador");
  assert.equal(list[0].score, 900);
  assert.equal(list[0].at, "2026-02-02");
  assert.equal(isRecord, true);
});

test("empatar o próprio recorde não conta como recorde novo", () => {
  const { isRecord } = upsert([s("GUI", 500, "2026-01-01")], "GUI", 500, "2026-02-02");
  assert.equal(isRecord, false);
});
