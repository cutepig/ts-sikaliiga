import React from 'react';
import './App.css';
import {defaultGame} from 'game/game';
import {GameProvider} from 'ui/GameContext';
import {Demo2View} from 'ui/demo2/Demo2View';

class App extends React.Component<{}> {
  public render() {
    return (
      <div className="App">
        <GameProvider game={defaultGame}>
          <Demo2View />
        </GameProvider>
      </div>
    );
  }
}

export default App;
