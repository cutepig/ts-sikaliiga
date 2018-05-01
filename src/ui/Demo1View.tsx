import React from 'react';
import {GameContext} from 'ui/GameContext';
import {PlayerList} from 'ui/PlayerList';
import {TeamView} from 'ui/TeamView';
import {getFreeAgents, IGame} from 'game/game';
import {initDemo1} from 'game/demo1';
import {IPlayer, PlayerPosition} from 'game/player';
import {mapEntities} from 'game/entity';
import {ITeam} from 'game/team';

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
    game.teams[teamId].players.push(player.id);
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

    for (const teamId of teamIds) {
      for (const pos of positions) {
        const player = findBest(pos);
        if (!player) {
          // tslint:disable-next-line:no-console
          console.warn(`Couldn't find best player for ${pos}`);
          continue;
        }

        const i = players.indexOf(player);
        if (i >= 0) {
          players.splice(i, 1);
        }
        game.teams[teamId].players.push(player.id);
      }
    }

    function findBest(position: PlayerPosition) {
      return players.reduce((best: IPlayer | null, player) => {
        if (player.position !== position) {
          return best;
        }

        const skill = player.attack + player.defense;
        const bestSkill = best ? best.attack + player.defense : 0;

        return skill > bestSkill ? player : best;
      }, null);
    }
  };

  public render() {
    return (
      <GameContext.Consumer>
        {({game, update}) => (
          <div className="Demo1View">
            <ul className="Demo1View-players">
              {mapEntities(game.teams, team => (
                <li key={team.id} onClick={() => this.onSelectTeam(team)}>
                  <TeamView team={team} />
                </li>
              ))}
            </ul>

            <button onClick={() => update(this.onAutoPopulate)}>Automaatti</button>

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
