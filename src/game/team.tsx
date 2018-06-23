import {ITeam, ITeamStats} from 'game/models';
import {eid} from 'game/entity';

export function createEmptyTeamStats(): ITeamStats {
  return {
    gamesPlayed: 0,
    wins: 0,
    ties: 0,
    losses: 0,
    goals: 0,
    goalsAgainst: 0,
  };
}

export function createEmptyTeam(name: string): ITeam {
  return {
    id: eid(),
    name,
    playerIds: [],
    fields: {
      defense: [],
      forwards: [],
    },
    stats: createEmptyTeamStats(),
  };
}
