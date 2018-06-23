import React from 'react';
import {GameContext} from 'ui/GameContext';
import {PlayerList} from 'ui/demo1/PlayerList';
import {TeamView} from 'ui/demo1/TeamView';
import {IGame, IPlayer, ITeam} from 'game/models';
import {getFreeAgents} from 'game/game';
import {mapEntities} from 'game/entity';
import {
  initDemo1,
  assignPlayerToTeam,
  autoAssignFields,
  autoPopulateTeams,
  simulateMatch,
} from 'game/demo1';
import {MatchResultsList} from 'ui/demo1/MatchResultsList';

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
            <button onClick={() => update(initDemo1)}>Demo 1</button>
            <button disabled onClick={() => update(autoPopulateTeams)}>
              Automaatti pelaajat
            </button>
            <button onClick={() => update(simulateMatch)}>Simuloi ottelu</button>

            <div className="Demo1View-matches">
              <MatchResultsList
                matches={Object.keys(game.matches).map(matchId => game.matches[matchId])}
              />
            </div>

            <ul className="Demo1View-players">
              {mapEntities<ITeam, any>(game.teams, team => (
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

            <div className="Demo1View-players">
              <PlayerList
                players={getFreeAgents(game.players)}
                onSelectPlayer={player => update(this.onSelectPlayer(player))}
              />
            </div>
          </div>
        )}
      </GameContext.Consumer>
    );
  }
}
