import {IGame} from 'game/game';
import {entityMapFromList, mapEntities} from 'game/entity';
import {createRandomPlayerPool, PlayerPosition, IPlayer} from 'game/player';
import {createEmptyTeam, ITeam, DefenseFieldIndex, ForwardFieldIndex, Field} from 'game/team';

export function initDemo1(): IGame {
  const players = createRandomPlayerPool(100);
  const teams = [createEmptyTeam('HIFK'), createEmptyTeam('Kärpät')];

  return {
    players: entityMapFromList(players),
    teams: entityMapFromList(teams),
  };
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

    const skill = player.attack + player.defense;
    const bestSkill = best ? best.attack + best.defense : 0;

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
  const players = team.players.map(playerId => game.players[playerId]);

  const g = recruitBestPlayer(PlayerPosition.Goalie, players);
  const goalie = g ? g.id : undefined;

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

  game.teams[team.id].fields = {goalie, defense, forwards};
}

export function assignPlayerToTeam(game: IGame, playerId: string, teamId: string) {
  const oldTeamId = game.players[playerId].team;

  if (oldTeamId) {
    const i = game.teams[oldTeamId].players.indexOf(playerId);
    if (i) {
      game.teams[oldTeamId].players.splice(i, 1);
    }
  }

  game.players[playerId].team = teamId;
  game.teams[teamId].players.push(playerId);
}
