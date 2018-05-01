import produce from 'immer';
import {IGame} from 'game/game';
import {IMatch} from 'game/match';
import {DefenseFieldIndex, ForwardFieldIndex, IFields, Field} from 'game/team';
import {IPlayer} from 'game/player';

export function simulateMHM2K(game: IGame, match: IMatch): IMatch {
  interface ITeamValues {
    g: number;
    d: number;
    a: number;
  }

  const homeValues = calculateFieldValues(match.homeTeam.fields);
  const awayValues = calculateFieldValues(match.awayTeam.fields);

  const homeGoals = calculateTeamGoals(homeValues, awayValues);
  const awayGoals = calculateTeamGoals(awayValues, homeValues);

  return produce(match, matchDraft => {
    matchDraft.homeTeam.goals = homeGoals;
    matchDraft.homeTeam.goalsAgainst = awayGoals;
    matchDraft.awayTeam.goals = awayGoals;
    matchDraft.awayTeam.goalsAgainst = homeGoals;
  });

  function calculateTeamGoals(teamValues: ITeamValues, otherTeamValues: ITeamValues) {
    let goals = 0;

    for (let shot = 0; shot < 20; shot++) {
      if (Math.random() * 2 > teamValues.a / teamValues.d) {
        if (Math.random() * 2 > teamValues.a / teamValues.g) {
          goals++;
        }
      }
    }

    return goals;
  }

  // TODO: Factor this out
  function calculateFieldValue(field: Field, mapFn: (player: IPlayer) => number) {
    return field.reduce((acc, playerId) => {
      const player = playerId && game.players[playerId];
      return player ? mapFn(player) + acc : 0;
    }, 0);
  }

  // TODO: Factor this out
  function calculateFieldValues(fields: IFields): ITeamValues {
    const g = fields.goalie ? game.players[fields.goalie].defense : 0;
    const d = fields.defense
      .slice(DefenseFieldIndex.Field1, DefenseFieldIndex.Field3 + 1)
      .reduce((acc, field) => calculateFieldValue(field, player => player.defense), 0);
    const a = fields.forwards
      .slice(ForwardFieldIndex.Field1, ForwardFieldIndex.Field4 + 1)
      .reduce((acc, field) => calculateFieldValue(field, player => player.attack), 0);

    return {g, d, a};
  }
}
