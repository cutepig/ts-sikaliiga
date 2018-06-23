import {
  IGame,
  ITeam,
  IPlayer,
  IMatchSimulation,
  IMatchSimulationTeam,
  IMatchSimulationPlayer,
} from 'game/models';
import {entityMapFromList, eid} from 'game/entity';
import {simulateMHM2K} from 'game/simulationMHM2K';

function createMatchSimulationPlayer(player: IPlayer): IMatchSimulationPlayer {
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

function createMatchSimulationTeam(game: IGame, team: ITeam): IMatchSimulationTeam {
  return {
    id: team.id,
    players: entityMapFromList<IMatchSimulationPlayer>(
      team.playerIds.map(playerId => createMatchSimulationPlayer(game.players[playerId])),
    ),
    fields: team.fields, // FIXME: This leaves hanging around as immer proxy
    goals: 0,
    goalsAgainst: 0,
    shots: 0,
    shotsAgainst: 0,
  };
}

export function createMatchSimulation(
  game: IGame,
  homeTeam: ITeam,
  awayTeam: ITeam,
  id = eid(),
): IMatchSimulation {
  return {
    id,
    homeTeam: createMatchSimulationTeam(game, homeTeam),
    awayTeam: createMatchSimulationTeam(game, awayTeam),
    time: 0,
    events: [],
  };
}

export function simulateMatch(game: IGame, match: IMatchSimulation): IMatchSimulation {
  // TODO: Configurable, mobile or retro users can use mhm2k for lower power use?
  return simulateMHM2K(game, match);
}
