import React from 'react';
import {IGame} from 'game/models';
import {getMatchesForRound} from 'game/demo2';
import {renderMatchResultString} from 'ui/demo1/MatchResultsList';

interface ICurrentRoundView {
  game: IGame;
}

export const CurrentRoundView: React.SFC<ICurrentRoundView> = ({game}) => (
  <div className="CurrentRoundView">
    <h5>Round {(game.currentRoundIndex || 0) + 1}.</h5>
    <table>
      <tbody>
        {getMatchesForRound(game.schedule, game.currentRoundIndex || 0).map(match => (
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
  </div>
);
