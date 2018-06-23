import {IEntityMap, IPlayer, IGame} from 'game/models';

export const defaultGame: IGame = {
  players: {},
  teams: {},
  matches: {},
};

export const getFreeAgents = (players: IEntityMap<IPlayer>) =>
  Object.keys(players)
    .filter(playerId => !players[playerId].teamId)
    .map(playerId => players[playerId]);
