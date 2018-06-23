import React from 'react';
import {GameContext} from 'ui/GameContext';
import {PlayerList} from 'ui/PlayerList';
import {TeamView} from 'ui/TeamView';
import {getFreeAgents, IGame} from 'game/game';
import {IPlayer} from 'game/player';
import {mapEntities} from 'game/entity';
import {ITeam} from 'game/team';
import {initDemo1, assignPlayerToTeam, autoAssignFields, autoPopulateTeams} from 'game/demo1';

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
    return assignPlayerToTeam(game, player.id, teamId);
  };

  private onAutoAssignFields = (team: ITeam) => (game: IGame) => {
    autoAssignFields(game, team);
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

            <button onClick={() => update(autoPopulateTeams)}>Automaatti pelaajat</button>

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
