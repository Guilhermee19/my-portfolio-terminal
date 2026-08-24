// node --experimental-strip-types --test lib/visits.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { aggregate, touch, type Visit } from "./visits.ts";

const NOW = new Date("2026-08-24T12:00:00.000Z");
const day = (offset: number) => {
  const d = new Date(NOW);
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
};

const v = (id: string, count: number, days: Record<string, number>): Visit => ({
  id,
  first: "2026-01-01T00:00:00.000Z",
  last: NOW.toISOString(),
  count,
  days,
});

test("placar vazio é tudo zero", () => {
  assert.deepEqual(aggregate([], NOW), { total: 0, week: 0, unique: 0 });
});

test("total soma as sessões, únicos conta os visitantes", () => {
  const m = aggregate([v("a", 10, {}), v("b", 3, {})], NOW);
  assert.equal(m.total, 13);
  assert.equal(m.unique, 2);
});

test("semana pega os últimos 7 dias e ignora o que é mais velho", () => {
  const m = aggregate(
    [
      v("a", 9, { [day(0)]: 2, [day(6)]: 1, [day(7)]: 5, [day(30)]: 1 }),
      v("b", 4, { [day(3)]: 4 }),
    ],
    NOW,
  );
  assert.equal(m.week, 7, "2 de hoje + 1 de 6 dias atrás + 4 de 3 dias atrás");
  assert.equal(m.total, 13, "total não filtra por data");
});

test("visitante novo entra com count 1 e o dia de hoje", () => {
  const { entry, isNew, list } = touch([], "abc-123", NOW);
  assert.equal(isNew, true);
  assert.equal(entry.count, 1);
  assert.equal(entry.days[day(0)], 1);
  assert.equal(entry.first, entry.last);
  assert.equal(list.length, 1);
});

test("visitante que volta incrementa sem duplicar registro", () => {
  const before = [v("abc-123", 5, { [day(0)]: 2 })];
  const { entry, isNew, list } = touch(before, "abc-123", NOW);
  assert.equal(isNew, false);
  assert.equal(list.length, 1, "não pode duplicar o visitante");
  assert.equal(entry.count, 6);
  assert.equal(entry.days[day(0)], 3);
  assert.equal(
    entry.first,
    before[0].first,
    "a data do primeiro acesso não muda",
  );
});

test("dias com mais de 14 dias são podados na gravação", () => {
  const before = [v("abc-123", 1, { [day(2)]: 1, [day(13)]: 1, [day(20)]: 9 })];
  const { entry } = touch(before, "abc-123", NOW);
  assert.equal(entry.days[day(2)], 1);
  assert.equal(entry.days[day(13)], 1);
  assert.equal(entry.days[day(20)], undefined, "o dia velho tem que sumir");
  assert.ok(Object.keys(entry.days).length <= 15);
});
