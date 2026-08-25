import type { DiceRoll, Die } from "../components/models.ts";

export const roll = (size: number): number => Math.floor(Math.random() * size) + 1;

export const parseDiceString = (dice: string): Die[] => {
  const out = <Die[]> [];
  dice.match(/\d*d\d+/gi)?.forEach((d) => {
    const parts = d.split(/d/i);
    if (parts && parts.length == 2) out.push({ n: +parts[0]! < 1 ? 1 : +parts[0]!, size: +parts[1]! });
  });
  return out;
};

export const rollDice = (dice: Die[]): DiceRoll => {
  const out = <DiceRoll> {
    total: 0,
    results: [],
  };

  dice.forEach((die, i) => {
    out.results.push({ d: die, v: [] });
    for (let j = 0; j < die.n; j++) {
      const r = roll(die.size);
      out.results[i]!.v.push(r);
      out.total += r;
    }
  });

  return out;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T;
