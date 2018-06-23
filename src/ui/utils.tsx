import {PlayerPosition, IPlayer} from 'game/models';

export function playerPositionText(position: PlayerPosition) {
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

export function sortPlayers(players: IPlayer[]) {
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
