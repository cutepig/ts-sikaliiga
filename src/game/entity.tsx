import uuid from 'uuid/v4';

export interface IEntity {
  id: string;
}

export interface IEntityMap<T> {
  [key: string]: T;
}

export function eid() {
  return uuid();
}

export function entityMapFromList<T extends IEntity>(list: T[]): IEntityMap<T> {
  const map = {};
  list.forEach(item => (map[item.id] = item));
  return map;
}

export function entitiesById<T extends IEntity>(map: IEntityMap<T>, ids: string[]) {
  return ids.map(id => map[id]);
}

export function mapEntities<T extends IEntity, U>(
  map: IEntityMap<T>,
  mapFn: (entity: T, id?: string) => U,
) {
  return Object.keys(map).map(id => mapFn(map[id], id));
}
