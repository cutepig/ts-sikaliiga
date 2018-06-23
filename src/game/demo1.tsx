import {
  IGame,
  IPlayer,
  ITeam,
  PlayerPosition,
  DefenseFieldIndex,
  ForwardFieldIndex,
  Field,
  IMatchTeam,
} from 'game/models';
import {entityMapFromList, entityMapToList, mapEntities} from 'game/entity';
import {createRandomPlayerPool, getPlayerSkillForPosition} from 'game/player';
import {createEmptyTeam} from 'game/team';
import {createMatch} from 'game/match';
import {simulateMHM2K} from 'game/simulation';

export function initDemo1(): IGame {
  const players = createRandomPlayerPool(100);
  const teams = [createEmptyTeam('HIFK'), createEmptyTeam('Kärpät')];

  const game = {
    players: entityMapFromList(players),
    teams: entityMapFromList(teams),
    matches: {},
  };

  autoPopulateTeams(game);
  mapEntities<ITeam, any>(game.teams, team => team).forEach(team => autoAssignFields(game, team));
  return game;
}

export function autoPopulateTeams(game: IGame) {
  const players = mapEntities(game.players, player => player);
  const teamIds = Object.keys(game.teams);
  const positions = [
    PlayerPosition.Goalie,
    PlayerPosition.Goalie,
    PlayerPosition.Defense,
    PlayerPosition.Defense,
    PlayerPosition.Defense,
    PlayerPosition.Defense,
    PlayerPosition.Defense,
    PlayerPosition.Defense,
    PlayerPosition.LeftWing,
    PlayerPosition.LeftWing,
    PlayerPosition.LeftWing,
    PlayerPosition.LeftWing,
    PlayerPosition.Center,
    PlayerPosition.Center,
    PlayerPosition.Center,
    PlayerPosition.Center,
    PlayerPosition.RightWing,
    PlayerPosition.RightWing,
    PlayerPosition.RightWing,
    PlayerPosition.RightWing,
  ];

  for (const pos of positions) {
    for (const teamId of teamIds) {
      const player = recruitBestPlayer(pos, players);
      if (!player) {
        // tslint:disable-next-line:no-console
        console.warn(`Couldn't find best player for ${pos}`);
        continue;
      }

      assignPlayerToTeam(game, player.id, teamId);
    }
  }
}

export function findBestPlayer(position: PlayerPosition, players: IPlayer[]) {
  return players.reduce((best: IPlayer | null, player) => {
    if (player.position !== position) {
      return best;
    }

    const skill = getPlayerSkillForPosition(position, player);
    // TODO: Micro-optimization: Refactor this to precalculated value
    const bestSkill = best ? getPlayerSkillForPosition(position, best) : 0;

    return skill > bestSkill ? player : best;
  }, null);
}

// NOTE: Removes the returned player from `players`
export function recruitBestPlayer(position: PlayerPosition, players: IPlayer[]) {
  const player = findBestPlayer(position, players);
  if (!player) {
    return;
  }

  const i = players.indexOf(player);
  if (i >= 0) {
    players.splice(i, 1);
  }

  return player;
}

export function autoAssignFields(game: IGame, team: ITeam) {
  const players = team.playerIds.map(playerId => game.players[playerId]);

  const g = recruitBestPlayer(PlayerPosition.Goalie, players);
  const goalieId = g ? g.id : undefined;

  const defense: Field[] = [];
  for (let i = DefenseFieldIndex.Field1; i <= DefenseFieldIndex.Field3; i++) {
    const d1 = recruitBestPlayer(PlayerPosition.Defense, players);
    const d2 = recruitBestPlayer(PlayerPosition.Defense, players);
    defense.push([d1 && d1.id, d2 && d2.id]);
  }

  const forwards: Field[] = [];
  for (let i = ForwardFieldIndex.Field1; i <= ForwardFieldIndex.Field3; i++) {
    const lw = recruitBestPlayer(PlayerPosition.LeftWing, players);
    const c = recruitBestPlayer(PlayerPosition.Center, players);
    const rw = recruitBestPlayer(PlayerPosition.RightWing, players);
    forwards.push([lw && lw.id, c && c.id, rw && rw.id]);
  }

  game.teams[team.id].fields = {goalieId, defense, forwards};
}

export function assignPlayerToTeam(game: IGame, playerId: string, teamId: string) {
  const oldTeamId = game.players[playerId].teamId;

  if (oldTeamId) {
    const i = game.teams[oldTeamId].playerIds.indexOf(playerId);
    if (i) {
      game.teams[oldTeamId].playerIds.splice(i, 1);
    }
  }

  game.players[playerId].teamId = teamId;
  game.teams[teamId].playerIds.push(playerId);
}

export function simulateMatch(game: IGame) {
  // When we have a concept of ISeason, we would have the matches prepopulated
  // with the teams and referenced from the schedule. This probably means that
  // we need 2 different data structures, IMatch and IMatchResult, or
  // IScheduledMatch and IMatchResult (in addition to IMatch which could be
  // purely internal)
  const teamIds = Object.keys(game.teams);
  const [homeTeam, awayTeam] = teamIds.map(teamId => game.teams[teamId]);

  const match = createMatch(game, homeTeam, awayTeam);
  const result = simulateMHM2K(game, match);

  // FIXME: `homeTeam|awayTeam: fields` is an immer proxy
  // tslint:disable-next-line:no-console
  console.log('simulation done', result);

  transferMatchTeam(result.homeTeam);
  transferMatchTeam(result.awayTeam);
  game.matches[match.id] = result;

  function transferMatchTeam(matchTeam: IMatchTeam) {
    entityMapToList(matchTeam.players).forEach(matchPlayer => {
      const player = game.players[matchPlayer.id];
      player.stats.gamesPlayed++;
      player.stats.goals += matchPlayer.goals;
      player.stats.goalsAgainst += matchPlayer.goalsAgainst;
      player.stats.assists += matchPlayer.assists;
      player.stats.shots += matchPlayer.shots;
      player.stats.shotsAgainst += matchPlayer.shotsAgainst;
    });
  }
}
