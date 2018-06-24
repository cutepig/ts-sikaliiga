export function sample<T>(list: T[]): T {
  const l = list.length;
  return list[Math.floor(Math.random() * l)];
}

export const randf = (min: number, max: number) => min + Math.random() * (max - min);
export const randi = (min: number, max: number) => Math.round(randf(min, max));

export function shuffle<T>(array: T[]): T[] {
  // TODO: Better implementation
  return [...array].sort(() => Math.random() - 0.5);
}

export function createArray(n: number): number[];

export function createArray<T>(n: number, value: T): T[];

export function createArray<T>(n: number, value?: T) {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push(typeof value === 'undefined' ? i : value);
  }

  return array;
}
