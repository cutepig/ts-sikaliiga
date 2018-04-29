import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {createRandomPlayerPool} from './game/player';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const playerPool = createRandomPlayerPool(50);

ReactDOM.render(
  <App playerPool={playerPool} />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
