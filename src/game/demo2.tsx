import {IGame, ITeam, ISchedule, RoundState, IScheduleRound, IScheduleMatch} from 'game/models';
import {entityMapFromList, mapEntities, eid} from 'game/entity';
import {createRandomPlayerPool} from 'game/player';
import {createEmptyTeam} from 'game/team';
import {autoPopulateTeams, autoAssignFields, transferMatchTeam} from 'game/demo1';
import {createMatchSimulation, simulateMatch} from 'game/simulation';

export function initDemo2(): IGame {
  const players = createRandomPlayerPool(1000);
  const teams = [
    createEmptyTeam('HIFK'),
    createEmptyTeam('HPK'),
    createEmptyTeam('Ilves'),
    createEmptyTeam('Jukurit'),
    createEmptyTeam('JYP'),
    createEmptyTeam('KalPa'),
    createEmptyTeam('KooKoo'),
    createEmptyTeam('Kärpät'),
    createEmptyTeam('Lukko'),
    createEmptyTeam('Pelicans'),
    createEmptyTeam('SaiPa'),
    createEmptyTeam('Sport'),
    createEmptyTeam('Tappara'),
    createEmptyTeam('TPS'),
    createEmptyTeam('Ässät'),
  ];

  const game: IGame = {
    players: entityMapFromList(players),
    teams: entityMapFromList(teams),
    matches: {},
    schedule: createSeasonSchedule(4, teams),
    currentRoundIndex: 0,
    roundState: RoundState.BeforeSimulating,
  };

  autoPopulateTeams(game);
  mapEntities<ITeam, any>(game.teams, team => team).forEach(team => autoAssignFields(game, team));
  return game;
}

export function roundRobin(teamIds: string[]): IScheduleRound[] {
  const rounds: IScheduleRound[] = [];
  // Insert a sentinel if number of teams is odd
  const [n, queue] =
    teamIds.length % 2 === 1
      ? [teamIds.length + 1, [undefined, ...teamIds]]
      : [teamIds.length, [...teamIds]];

  for (let roundIndex = 0; roundIndex < n - 1; roundIndex++) {
    rounds[roundIndex] = [];

    for (let pairIndex = 0; pairIndex < n / 2; pairIndex++) {
      const [homeTeamId, awayTeamId] = [queue[pairIndex], queue[n - 1 - pairIndex]];
      if (homeTeamId && awayTeamId) {
        rounds[roundIndex].push({
          id: eid(),
          homeTeamId,
          awayTeamId,
        });
      }
    }

    queue.splice(1, 0, queue.pop());
  }

  return rounds;
}

export function createSeasonSchedule(numRounds: number, teams: ITeam[]): ISchedule {
  const rounds = roundRobin(teams.map(team => team.id));
  let schedule: ISchedule = [];

  for (let i = 0; i < numRounds; i++) {
    schedule = schedule.concat(rounds);
  }

  // tslint:disable-next-line:no-console
  console.log('Rounds', rounds);
  return schedule;
}

export function advanceToNextRound(game: IGame) {
  game.currentRoundIndex = Math.min((game.currentRoundIndex || 0) + 1, game.schedule.length - 1);
  game.roundState = RoundState.BeforeSimulating;
}

export function getMatchesForRound(schedule: ISchedule, roundIndex: number): IScheduleMatch[] {
  return roundIndex >= 0 && roundIndex < schedule.length ? schedule[roundIndex] : [];
}

export function simulateCurrentRound(game: IGame) {
  const matches = getMatchesForRound(game.schedule, game.currentRoundIndex || 0);
  for (const match of matches) {
    const homeTeam = game.teams[match.homeTeamId];
    const awayTeam = game.teams[match.awayTeamId];

    const simulation = createMatchSimulation(game, homeTeam, awayTeam, match.id);
    const result = simulateMatch(game, simulation);

    // FIXME: `homeTeam|awayTeam: fields` is an immer proxy
    // tslint:disable-next-line:no-console
    console.log('simulation done', result);

    transferMatchTeam(game, result.homeTeam, result.awayTeam);
    transferMatchTeam(game, result.awayTeam, result.homeTeam);
    game.matches[match.id] = result;
    game.roundState = RoundState.AfterSimulating;
  }
}
