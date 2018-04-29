import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {initGame} from './game/game';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const game = initGame();

ReactDOM.render(
  <App game={game} />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
