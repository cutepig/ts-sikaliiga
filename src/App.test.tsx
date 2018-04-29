import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';


it('renders without crashing', () => {
  const div = document.createElement('div');
  const game = {players: {}, teams: {}};
  ReactDOM.render(<App game={game} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
