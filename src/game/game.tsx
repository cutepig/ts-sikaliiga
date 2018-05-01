import {IEntityMap} from 'game/entity';
import {IPlayer} from 'game/player';
import {ITeam} from 'game/team';

export interface IGame {
  players: IEntityMap<IPlayer>;
  teams: IEntityMap<ITeam>;
}

export const defaultGame = {
  players: {},
  teams: {},
};

export const getFreeAgents = (players: IEntityMap<IPlayer>) =>
  Object.keys(players)
    .filter(playerId => !players[playerId].team)
    .map(playerId => players[playerId]);
