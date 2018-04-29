export interface IEntity {
  id: string;
}

export interface IEntityMap<T> {
  [key: string]: T;
}

export function entityMapFromList<T extends IEntity>(list: T[]): IEntityMap<T> {
  const map = {};
  list.forEach(item => map[item.id] = item);
  return map;
}
