import React from 'react';
import './App.css';
import {getFreeAgents, IGame} from './game/game';
import {PlayerList} from './ui/PlayerList';

interface IAppProps {
  game: IGame,
}


class App extends React.Component<IAppProps> {
  public render() {
    const {game} = this.props;

    return (
      <div className="App">
        <div className="App-players">
          <PlayerList players={getFreeAgents(game.players)} />
        </div>
      </div>
    );
  }
}

export default App;
