import {IGame, ITeam, IPlayer, IMatch, IMatchTeam, IMatchPlayer} from 'game/models';
import {entityMapFromList, eid} from 'game/entity';

function createMatchPlayer(player: IPlayer): IMatchPlayer {
  return {
    id: player.id,
    teamId: player.teamId as string, // Being a match player implies that teamId is assigned
    position: player.position,
    attack: player.attack,
    defense: player.defense,
    fitness: player.fitness,
    morale: player.morale,
    toc: 0,
    goals: 0,
    goalsAgainst: 0,
    assists: 0,
    shots: 0,
    shotsAgainst: 0,
    penalties: 0,
  };
}

function createMatchTeam(game: IGame, team: ITeam): IMatchTeam {
  return {
    id: team.id,
    players: entityMapFromList<IMatchPlayer>(
      team.playerIds.map(playerId => createMatchPlayer(game.players[playerId])),
    ),
    fields: team.fields, // FIXME: This leaves hanging around as immer proxy
    goals: 0,
    goalsAgainst: 0,
    shots: 0,
    shotsAgainst: 0,
  };
}

export function createMatch(game: IGame, homeTeam: ITeam, awayTeam: ITeam): IMatch {
  return {
    id: eid(),
    homeTeam: createMatchTeam(game, homeTeam),
    awayTeam: createMatchTeam(game, awayTeam),
    time: 0,
    events: [],
  };
}
