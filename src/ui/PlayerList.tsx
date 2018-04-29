import React from 'react';
import {IPlayer} from '../game/player';

interface IPlayerListProps {
  players: IPlayer[];
}

export const PlayerList: React.StatelessComponent<IPlayerListProps> =
  ({players}) =>
  <table className="PlayerList">
    <thead>
      <tr>
        <th>Nimi</th>
        <th>Ikä</th>
        <th>A</th>
        <th>D</th>
        <th>❤</th>
        <th>🙂</th>
      </tr>
    </thead>
    <tbody>
      {players.map(player =>
        <tr key={player.id}>
          <td>{player.name}</td>
          <td>{player.age}</td>
          <td>{Math.round(player.attack)}</td>
          <td>{Math.round(player.defense)}</td>
          <td>{Math.round(player.fitness)}</td>
          <td>{Math.round(player.morale)}</td>
        </tr>
      )}
    </tbody>
  </table>;
