import {entityMapFromList, IEntityMap} from 'game/entity';
import {createRandomPlayerPool, IPlayer} from 'game/player';
import {ITeam} from 'game/team';
import uuid from 'uuid/v4';

export interface IGame {
  players: IEntityMap<IPlayer>;
  teams: IEntityMap<ITeam>;
}

export const defaultGame = {
  players: {},
  teams: {},
}

export const getFreeAgents = (players: IEntityMap<IPlayer>) =>
  Object.keys(players)
    .filter(playerId => !players[playerId].team)
    .map(playerId => players[playerId]);

export function initGame(): IGame {
  const players = createRandomPlayerPool(100);
  const teams = [
    {id: uuid(), name: 'HIFK', players: []},
    {id: uuid(), name: 'Kärpät', players: []},
  ];

  return {
    players: entityMapFromList(players),
    teams: entityMapFromList(teams),
  };
}
