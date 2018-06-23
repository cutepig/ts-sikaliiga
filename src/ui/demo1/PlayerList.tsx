import {playerPositionText, sortPlayers} from 'ui/utils';

import React from 'react';
import {IPlayer} from 'game/models';

interface IPlayerListProps {
  players: IPlayer[];
  showStats?: boolean;

  onSelectPlayer?: (player: IPlayer) => void;
}

export const PlayerList: React.StatelessComponent<IPlayerListProps> = ({
  players,
  showStats,
  onSelectPlayer,
}) => (
  <table className="PlayerList">
    <thead>
      <tr>
        <th>Nimi</th>
        <th>PP</th>
        <th>Ikä</th>
        <th>Kyky</th>
        <th>H</th>
        <th>P</th>
        <th>❤</th>
        <th>🙂</th>
        {showStats && (
          <>
            <th>PO</th>
            <th>PST</th>
            <th>TM</th>
            <th>S</th>
            <th>PM</th>
          </>
        )}
      </tr>
    </thead>
    <tbody>
      {sortPlayers(players).map(player => (
        <tr key={player.id} onClick={onSelectPlayer && (() => onSelectPlayer(player))}>
          <td>{player.name}</td>
          <td>{playerPositionText(player.position)}</td>
          <td>{player.age}</td>
          <td>{Math.round((player.attack + player.defense) * 0.5)}</td>
          <td>{Math.round(player.attack)}</td>
          <td>{Math.round(player.defense)}</td>
          <td>{Math.round(player.fitness)}</td>
          <td>{Math.round(player.morale)}</td>
          {showStats && (
            <>
              <td>{player.stats.gamesPlayed}</td>
              <td>{player.stats.goals + player.stats.assists}</td>
              <td>{player.stats.goals}</td>
              <td>{player.stats.assists}</td>
              <td>{player.stats.goalsAgainst}</td>
            </>
          )}
        </tr>
      ))}
    </tbody>
  </table>
);
