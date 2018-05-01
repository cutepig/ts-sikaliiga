import React from 'react';
import './App.css';
import {defaultGame} from 'game/game';
import { GameProvider } from 'ui/GameContext';
import {Demo1View} from 'ui/Demo1View';

class App extends React.Component<{}> {
  public render() {
    return (
      <div className="App">
        <GameProvider game={defaultGame}>
          <Demo1View />
        </GameProvider>
      </div>
    );
  }
}

export default App;
