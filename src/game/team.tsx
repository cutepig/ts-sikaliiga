import {eid} from 'game/entity';

export const enum DefenseIndex {
  Defense1,
  Defense2,
  DefenseCount,
}

export const enum ForwardIndex {
  LeftWing,
  Center,
  RightWing,
  ExtraForward,
  ForwardCount,
}

export type Field = Array<string | undefined>;

export const enum DefenseFieldIndex {
  Field1,
  Field2,
  Field3,
  FieldPowerplay1,
  FieldPowerplay2,
  FieldShorthand1,
  FieldShorthand2,
  FieldCount,
}

export const enum ForwardFieldIndex {
  Field1,
  Field2,
  Field3,
  Field4,
  FieldPowerplay1,
  FieldPowerplay2,
  FieldShorthand1,
  FieldShorthand2,
  FieldCount,
}

export interface IFields {
  goalie?: string;
  defense: Field[];
  forwards: Field[];
}

export interface ITeam {
  id: string;
  name: string;
  players: string[];
  fields: IFields;
}

export function createEmptyTeam(name: string): ITeam {
  return {
    id: eid(),
    name,
    players: [],
    fields: {
      defense: [],
      forwards: [],
    },
  };
}
