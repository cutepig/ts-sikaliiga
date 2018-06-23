import {ITeam} from 'game/models';
import {eid} from 'game/entity';

export function createEmptyTeam(name: string): ITeam {
  return {
    id: eid(),
    name,
    playerIds: [],
    fields: {
      defense: [],
      forwards: [],
    },
  };
}
