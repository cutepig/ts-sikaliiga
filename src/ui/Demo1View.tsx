import React from 'react';
import {GameContext} from 'ui/GameContext';
import {PlayerList} from 'ui/PlayerList';
import {TeamView} from 'ui/TeamView';
import {getFreeAgents, IGame} from 'game/game';
import {initDemo1} from 'game/demo1';
import {IPlayer, PlayerPosition} from 'game/player';
import {mapEntities} from 'game/entity';
import {ITeam, DefenseFieldIndex, Field, ForwardFieldIndex} from 'game/team';

function assignPlayerToTeam(game: IGame, playerId: string, teamId: string) {
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

export class Demo1View extends React.Component<{}> {
  public state: {teamId?: string} = {};

  private onSelectTeam = (team: ITeam) => {
    console.log('Selected team', team); // tslint:disable-line no-console
    this.setState(state => ({...state, teamId: team.id}));
  };

  private onSelectPlayer = (player: IPlayer) => (game: IGame) => {
    console.log('Selected player', player); // tslint:disable-line no-console
    const {teamId} = this.state;

    if (!teamId) {
      return;
    }

    this.setState(state => ({...state, teamId: null}));
    assignPlayerToTeam(game, player.id, teamId);
  };

  private onAutoPopulate = (game: IGame) => {
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
        const player = this.recruitBestPlayer(pos, players);
        if (!player) {
          // tslint:disable-next-line:no-console
          console.warn(`Couldn't find best player for ${pos}`);
          continue;
        }

        assignPlayerToTeam(game, player.id, teamId);
      }
    }
  };

  private findBestPlayer(position: PlayerPosition, players: IPlayer[]) {
    return players.reduce((best: IPlayer | null, player) => {
      if (player.position !== position) {
        return best;
      }

      const skill = player.attack + player.defense;
      const bestSkill = best ? best.attack + best.defense : 0;

      return skill > bestSkill ? player : best;
    }, null);
  }

  private recruitBestPlayer(position: PlayerPosition, players: IPlayer[]) {
    const player = this.findBestPlayer(position, players);
    if (!player) {
      return;
    }

    const i = players.indexOf(player);
    if (i >= 0) {
      players.splice(i, 1);
    }

    return player;
  }

  private onAutoAssignFields = (team: ITeam) => (game: IGame) => {
    const players = team.players.map(playerId => game.players[playerId]);

    const g = this.recruitBestPlayer(PlayerPosition.Goalie, players);
    const goalie = g ? g.id : undefined;

    const defense: Field[] = [];
    for (let i = DefenseFieldIndex.Field1; i <= DefenseFieldIndex.Field3; i++) {
      const d1 = this.recruitBestPlayer(PlayerPosition.Defense, players);
      const d2 = this.recruitBestPlayer(PlayerPosition.Defense, players);
      defense.push([d1 && d1.id, d2 && d2.id]);
    }

    const forwards: Field[] = [];
    for (let i = ForwardFieldIndex.Field1; i <= ForwardFieldIndex.Field3; i++) {
      const lw = this.recruitBestPlayer(PlayerPosition.LeftWing, players);
      const c = this.recruitBestPlayer(PlayerPosition.Center, players);
      const rw = this.recruitBestPlayer(PlayerPosition.RightWing, players);
      forwards.push([lw && lw.id, c && c.id, rw && rw.id]);
    }

    game.teams[team.id].fields = {goalie, defense, forwards};
  };

  public render() {
    return (
      <GameContext.Consumer>
        {({game, update}) => (
          <div className="Demo1View">
            <ul className="Demo1View-players">
              {mapEntities(game.teams, team => (
                <li key={team.id} onClick={() => this.onSelectTeam(team)}>
                  <TeamView
                    team={team}
                    onAutoAssignFields={assignableTeam =>
                      update(this.onAutoAssignFields(assignableTeam))
                    }
                  />
                </li>
              ))}
            </ul>

            <button onClick={() => update(this.onAutoPopulate)}>Automaatti pelaajat</button>

            <div className="Demo1View-players">
              <PlayerList
                players={getFreeAgents(game.players)}
                onSelectPlayer={player => update(this.onSelectPlayer(player))}
              />
            </div>

            <button onClick={() => update(initDemo1)}>Demo 1</button>
          </div>
        )}
      </GameContext.Consumer>
    );
  }
}
