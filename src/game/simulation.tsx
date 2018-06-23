import produce from 'immer';
import {
  IGame,
  IPlayer,
  IFields,
  IMatch,
  DefenseFieldIndex,
  ForwardFieldIndex,
  Field,
  IMatchTeam,
  IMatchPlayer,
  IMatchEvent,
} from 'game/models';
import {entityMapToList} from 'game/entity';
import {sample} from 'game/util';
import {isGoaliePosition} from 'game/player';

function normalizeWeights(weights: number[]) {
  const sum = weights.reduce((acc, x): typeof acc => acc + x, 0) || 1;
  return weights.map(x => x / sum);
}

export function simulateMHM2K(game: IGame, match: IMatch): IMatch {
  interface ITeamValues {
    g: number;
    d: number;
    a: number;
    teamId: string;
  }

  interface ITeamStats {
    goals: number;
    shots: number;
    events: IMatchEvent[];
  }

  const defenseFieldWeights = normalizeWeights([3, 2, 1]);
  const forwardFieldWeights = normalizeWeights([4, 3, 2, 1]);

  const homeValues = calculateFieldValues(match.homeTeam.id, match.homeTeam.fields);
  const awayValues = calculateFieldValues(match.awayTeam.id, match.awayTeam.fields);

  const homeStats = calculateTeamStats(
    entityMapToList(match.homeTeam.players),
    match.awayTeam.fields.goalieId
      ? match.awayTeam.players[match.awayTeam.fields.goalieId]
      : undefined,
    homeValues,
    awayValues,
  );
  const awayStats = calculateTeamStats(
    entityMapToList(match.awayTeam.players),
    match.homeTeam.fields.goalieId
      ? match.homeTeam.players[match.homeTeam.fields.goalieId]
      : undefined,
    awayValues,
    homeValues,
  );

  // tslint:disable-next-line: no-console
  console.log({
    homeStats,
    awayStats,
    homeValues,
    awayValues,
    defenseFieldWeights,
    forwardFieldWeights,
  });

  return produce(match, matchDraft => {
    transferStats(matchDraft.homeTeam, homeStats, awayStats);
    transferStats(matchDraft.awayTeam, awayStats, homeStats);

    matchDraft.events = homeStats.events.concat(awayStats.events);
  });

  function transferStats(matchTeam: IMatchTeam, stats: ITeamStats, otherStats: ITeamStats) {
    matchTeam.goals = stats.goals;
    matchTeam.goalsAgainst = otherStats.goals;
    matchTeam.shots = stats.shots;
    matchTeam.shotsAgainst = otherStats.shots;
  }

  function getRandomFieldPlayer(players: IMatchPlayer[]) {
    let player: IMatchPlayer;
    do {
      player = sample(players);
    } while (isGoaliePosition(player.position));

    return player;
  }

  function getAssists(shooter: IMatchPlayer, players: IMatchPlayer[]) {
    const assists: IMatchPlayer[] = [];
    // NOTE: This would work much more realistically if we would be able to
    // restrict this selection to single field
    const assist1 = getRandomFieldPlayer(players);
    const assist2 = getRandomFieldPlayer(players);
    if (assist1.id !== shooter.id) {
      assists.push(assist1);
    }
    if (assist2.id !== shooter.id && assist2.id !== assist1.id) {
      assists.push(assist2);
    }
    return assists;
  }

  function calculateTeamStats(
    players: IMatchPlayer[],
    goalie: IMatchPlayer | undefined,
    teamValues: ITeamValues,
    otherTeamValues: ITeamValues,
  ): ITeamStats {
    let shots = 0;
    let goals = 0;
    // tslint:disable-next-line:prefer-const
    let events: IMatchEvent[] = [];

    for (let shot = 0; shot < 20; shot++) {
      if (Math.random() * 2 < teamValues.a / otherTeamValues.d) {
        const shooter = getRandomFieldPlayer(players);
        shots++;
        shooter.shots++;
        if (goalie) {
          goalie.shotsAgainst++;
        }

        if (Math.random() * 2 < teamValues.a / otherTeamValues.g) {
          goals++;

          shooter.goals++;
          if (goalie) {
            goalie.goalsAgainst++;
          }

          const assists = getAssists(shooter, players);
          assists.forEach(assist => assist.assists++);

          events.push({
            type: 'goal',
            // TODO: Make this smarter, pick better players
            shooterId: shooter.id,
            assistIds: assists.map(assist => assist.id),
            goalieId: goalie && goalie.id,
            teamId: teamValues.teamId,
            otherTeamId: otherTeamValues.teamId,
          });
        }
      }
    }

    return {shots, goals, events};
  }

  // TODO: Factor this out
  function calculateFieldValue(field: Field, mapFn: (player: IPlayer) => number) {
    return (
      field.reduce((acc, playerId) => {
        const player = playerId && game.players[playerId];
        return player ? mapFn(player) + acc : 0;
      }, 0) / (field.length || 1)
    );
  }

  // TODO: Factor this out
  function calculateFieldValues(teamId: string, fields: IFields): ITeamValues {
    const g = fields.goalieId ? game.players[fields.goalieId].defense : 0;
    const d = fields.defense
      .slice(DefenseFieldIndex.Field1, DefenseFieldIndex.Field3 + 1)
      .reduce(
        (acc, field, index) =>
          acc + calculateFieldValue(field, player => player.defense) * defenseFieldWeights[index],
        0,
      );
    const a = fields.forwards
      .slice(ForwardFieldIndex.Field1, ForwardFieldIndex.Field4 + 1)
      .reduce(
        (acc, field, index) =>
          acc + calculateFieldValue(field, player => player.attack) * forwardFieldWeights[index],
        0,
      );

    return {g, d, a, teamId};
  }
}
