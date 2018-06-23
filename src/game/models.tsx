// Entity system
export interface IEntity {
  id: string;
}

export interface IEntityMap<T> {
  [key: string]: T;
}

// Domain models

// Player

export const enum PlayerPosition {
  Goalie = 'G',
  Defense = 'D',
  LeftWing = 'LW',
  Center = 'C',
  RightWing = 'RW',
}

export interface IPlayerStats {
  // `gamesPlayed` should probably exist in higher level
  // construct like `ISeasonStats`?
  gamesPlayed: 0;
  goals: 0;
  goalsAgainst: 0;
  assists: 0;
  shots: 0;
  shotsAgainst: 0;
}

export interface IPlayer {
  id: string;
  name: string;
  age: number;
  teamId?: string;
  position: PlayerPosition;
  attack: number;
  attackPotential: number;
  defense: number;
  defensePotential: number;
  fitness: number;
  morale: number;
  stats: IPlayerStats;
}

// Team

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
  goalieId?: string;
  defense: Field[];
  forwards: Field[];
}

export interface ITeam {
  id: string;
  name: string;
  playerIds: string[];
  fields: IFields;
}

// Match

export interface IMatchPlayer {
  id: string; // Reflects player id
  position: PlayerPosition;
  teamId: string;
  attack: number;
  defense: number;
  fitness: number;
  morale: number;
  toc: number;
  goals: number;
  goalsAgainst: number; // Relevant for goalie
  assists: number;
  shots: number;
  shotsAgainst: number; // Relevant for goalie
  penalties: number;
}

export interface IMatchTeam {
  id: string; // Reflects team id
  players: IEntityMap<IMatchPlayer>;
  fields: IFields;
  goals: number;
  goalsAgainst: number;
  shots: number;
  shotsAgainst: number;
}

export interface IMatchGoalEvent {
  type: 'goal';
  shooterId: string;
  assistIds: string[];
  goalieId?: string | undefined;
  teamId: string;
  otherTeamId: string;
}

export type IMatchEvent = IMatchGoalEvent;

export interface IMatch {
  id: string;
  homeTeam: IMatchTeam;
  awayTeam: IMatchTeam;
  time: number;
  hasShootouts?: boolean;
  events: IMatchEvent[];
}

// The game

export interface IGame {
  players: IEntityMap<IPlayer>;
  teams: IEntityMap<ITeam>;
  matches: IEntityMap<IMatch>;
}
