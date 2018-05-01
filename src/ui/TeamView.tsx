import React from 'react';
import {entitiesById} from 'game/entity';
import {ITeam} from 'game/team';
import {GameContext} from 'ui/GameContext';
import {PlayerList} from 'ui/PlayerList';

interface ITeamViewProps {
  team: ITeam;
}

export const TeamView: React.SFC<ITeamViewProps> = ({team}) => (
  <GameContext.Consumer>
    {({game}) => (
      <div className="TeamView">
        <h2>{team.name}</h2>
        <PlayerList players={entitiesById(game.players, team.players)} />
      </div>
    )}
  </GameContext.Consumer>
);
