import React from 'react';
import {IPlayer, PlayerPosition} from 'game/player';

interface IPlayerListProps {
  players: IPlayer[];

  onSelectPlayer?: (player: IPlayer) => void;
}

function playerPositionText(position: PlayerPosition) {
  switch (position) {
    case PlayerPosition.Goalie:
      return 'MV';
    case PlayerPosition.Defense:
      return 'P';
    case PlayerPosition.LeftWing:
      return 'VH';
    case PlayerPosition.Center:
      return 'KH';
    case PlayerPosition.RightWing:
      return 'OH';
  }
}

function sortPlayers(players: IPlayer[]) {
  // tslint:disable-next-line:variable-name
  const players_ = [...players];
  players_.sort(compareFn);
  return players_;

  function compareFn(a: IPlayer, b: IPlayer) {
    const pos = [
      PlayerPosition.Goalie,
      PlayerPosition.Defense,
      PlayerPosition.LeftWing,
      PlayerPosition.Center,
      PlayerPosition.RightWing,
    ];
    const [ap, bp] = [pos.indexOf(a.position), pos.indexOf(b.position)];
    const [as, bs] = [a.attack + a.defense, b.attack + b.defense];
    if (ap === bp) {
      return bs - as;
    }
    return ap - bp;
  }
}

export const PlayerList: React.StatelessComponent<IPlayerListProps> = ({
  players,
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
        </tr>
      ))}
    </tbody>
  </table>
);
