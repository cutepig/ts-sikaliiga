import React from 'react';
import {IMatchSimulation} from 'game/models';
import {GameContext} from 'ui/GameContext';

interface IMatchResultsList {
  matches: IMatchSimulation[];
}

export const renderMatchResultString = (match: IMatchSimulation) =>
  `${match.homeTeam.goals} - ${match.awayTeam.goals}${
    match.hasShootouts ? ' (SO)' : match.time > 3600 ? ' (OT)' : ''
  }`;

export const MatchResultsList: React.SFC<IMatchResultsList> = ({matches}) => (
  <GameContext.Consumer>
    {({game}) => (
      <table>
        <tbody>
          {matches.map(match => {
            const homeMatchTeam = match.homeTeam;
            const awayMatchTeam = match.awayTeam;
            const homeTeam = game.teams[homeMatchTeam.id];
            const awayTeam = game.teams[awayMatchTeam.id];

            return (
              <React.Fragment key={match.id}>
                <tr>
                  <th>{homeTeam.name}</th>
                  <td>{renderMatchResultString(match)}</td>
                  <th>{awayTeam.name}</th>
                </tr>
                <tr>
                  <td>{homeMatchTeam.shots}</td>
                  <th>Shots</th>
                  <td>{awayMatchTeam.shots}</td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    )}
  </GameContext.Consumer>
);
