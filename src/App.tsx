import * as React from 'react';
import './App.css';
import {IPlayer} from './game/player';

interface IAppProps {
  playerPool: IPlayer[];
}

class App extends React.Component<IAppProps> {
  public render() {
    const {playerPool} = this.props;

    return (
      <div className="App">
        <ul>
          {playerPool.map(player =>
            <li key={player.id}>{player.name}</li>
          )}
        </ul>
      </div>
    );
  }
}

export default App;
