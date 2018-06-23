export function sample<T>(list: T[]): T {
  const l = list.length;
  return list[Math.floor(Math.random() * l)];
}

export const randf = (min: number, max: number) => min + Math.random() * (max - min);
export const randi = (min: number, max: number) => Math.round(randf(min, max));
