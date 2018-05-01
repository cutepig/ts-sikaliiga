import {IGame} from 'game/game';
import {IFields, ITeam} from 'game/team';
import {IPlayer} from 'game/player';
import {IEntityMap, entityMapFromList, eid} from 'game/entity';

export interface IMatchPlayer {
  id: string; // Reflects player id
  attack: number;
  defense: number;
  fitness: number;
  morale: number;
  toc: number;
  goals: number;
  assists: number;
  penalties: number;
}

export interface IMatchTeam {
  id: string; // Reflects team id
  players: IEntityMap<IMatchPlayer>;
  fields: IFields;
  goals: number;
  goalsAgainst: number;
}

export interface IMatch {
  id: string;
  homeTeam: IMatchTeam;
  awayTeam: IMatchTeam;
  time: number;
  hasShootouts?: boolean;
}

function createMatchPlayer(player: IPlayer): IMatchPlayer {
  return {
    id: player.id,
    attack: player.attack,
    defense: player.defense,
    fitness: player.fitness,
    morale: player.morale,
    toc: 0,
    goals: 0,
    assists: 0,
    penalties: 0,
  };
}

function createMatchTeam(game: IGame, team: ITeam): IMatchTeam {
  return {
    id: team.id,
    players: entityMapFromList<IMatchPlayer>(
      team.players.map(playerId => createMatchPlayer(game.players[playerId])),
    ),
    fields: team.fields,
    goals: 0,
    goalsAgainst: 0,
  };
}

export function createMatch(game: IGame, homeTeam: ITeam, awayTeam: ITeam): IMatch {
  return {
    id: eid(),
    homeTeam: createMatchTeam(game, homeTeam),
    awayTeam: createMatchTeam(game, awayTeam),
    time: 0,
  };
}
