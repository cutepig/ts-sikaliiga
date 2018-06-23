import uuid from 'uuid/v4';
import {IEntity, IEntityMap} from 'game/models';

export function eid() {
  return uuid();
}

export function entityMapFromList<T extends IEntity>(list: T[]): IEntityMap<T> {
  const map = {};
  list.forEach(item => (map[item.id] = item));
  return map;
}

export function entityMapToList<T extends IEntity>(map: IEntityMap<T>): T[] {
  return Object.keys(map).map(entityId => map[entityId]);
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
