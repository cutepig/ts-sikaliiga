import React from 'react';
import {IGame} from 'game/models';
import {renderMatchResultString} from 'ui/demo1/MatchResultsList';

interface IMatchHistory {
  game: IGame;
}

export const MatchHistory: React.SFC<IMatchHistory> = ({game}) => (
  <div className="MatchHistory">
    {game.schedule
      .slice(0, game.currentRoundIndex || 0)
      .reverse()
      .map((round, index) => (
        <React.Fragment key={(game.currentRoundIndex || 0) - index}>
          <h5>Round {(game.currentRoundIndex || 0) - index}.</h5>
          <table>
            <tbody>
              {round.map(match => (
                <tr key={match.id}>
                  <th>{game.teams[match.homeTeamId].name}</th>
                  <td>
                    {game.matches[match.id] ? renderMatchResultString(game.matches[match.id]) : '-'}
                  </td>
                  <th>{game.teams[match.awayTeamId].name}</th>
                </tr>
              ))}
            </tbody>
          </table>
        </React.Fragment>
      ))}
  </div>
);
