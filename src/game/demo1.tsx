import {IGame} from 'game/game';
import {entityMapFromList} from 'game/entity';
import {createRandomPlayerPool} from 'game/player';
import {createEmptyTeam} from 'game/team';

export function initDemo1(): IGame {
  const players = createRandomPlayerPool(100);
  const teams = [createEmptyTeam('HIFK'), createEmptyTeam('Kärpät')];

  return {
    players: entityMapFromList(players),
    teams: entityMapFromList(teams),
  };
}
