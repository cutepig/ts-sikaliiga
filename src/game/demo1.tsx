import { IGame } from "game/game";
import { entityMapFromList, eid } from 'game/entity';
import { createRandomPlayerPool } from "game/player";

export function initDemo1(): IGame {
  const players = createRandomPlayerPool(100);
  const teams = [
    {id: eid(), name: 'HIFK', players: []},
    {id: eid(), name: 'Kärpät', players: []},
  ];

  return {
    players: entityMapFromList(players),
    teams: entityMapFromList(teams),
  };
}
