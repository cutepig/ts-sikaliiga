import React from 'react';
import {RoundState} from 'game/models';
import {entityMapToList} from 'game/entity';
import {initDemo2, simulateCurrentRound, advanceToNextRound, simulateSeason} from 'game/demo2';
import {GameContext} from 'ui/GameContext';
import {CurrentRoundView} from 'ui/demo2/CurrentRoundView';
import {Standings} from 'ui/demo2/Standings';
import {MatchHistory} from 'ui/demo2/MatchHistory';

export class Demo2View extends React.Component<{}> {
  public render() {
    return (
      <GameContext.Consumer>
        {({game, update}) => (
          <div className="Demo2View">
            <button onClick={() => update(initDemo2)}>Demo 2</button>
            {game.roundState === RoundState.BeforeSimulating && (
              <>
                <button onClick={() => update(simulateCurrentRound)}>Simuloi kierros</button>
                <button onClick={() => update(simulateSeason)}>Simuloi kausi</button>
              </>
            )}
            {game.roundState === RoundState.AfterSimulating && (
              <button onClick={() => update(advanceToNextRound)}>Seuraava kierros</button>
            )}

            <CurrentRoundView game={game} />

            <Standings teams={entityMapToList(game.teams)} />

            <MatchHistory game={game} />
          </div>
        )}
      </GameContext.Consumer>
    );
  }
}
