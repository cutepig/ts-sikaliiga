import React from 'react';
import produce from 'immer';
import { IGame, defaultGame } from 'game/game';

type GameUpdateFn = (game: IGame) => void | IGame;

interface IGameContext {
  game: IGame;
  update: (updateFn: GameUpdateFn) => void;
}

export const GameContext = React.createContext<IGameContext>({
  game: defaultGame,
  update: () => console.warn('Game update called before initialization!') // tslint:disable-line no-console
});

interface IGameProviderProps {
  game: IGame;
}

export class GameProvider extends React.Component<IGameProviderProps> {
  public state: IGame;

  constructor(props: IGameProviderProps) {
    super(props);
    this.state = props.game;
  }

  private update = (updateFn: GameUpdateFn) => {
    this.setState(produce(updateFn));
  }

  public render() {
    return (
      <GameContext.Provider value={{game: this.state, update: this.update}}>
        {this.props.children}
      </GameContext.Provider>
    )
  }
}
