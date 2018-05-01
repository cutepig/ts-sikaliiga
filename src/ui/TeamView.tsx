import React from 'react';
import {entitiesById} from 'game/entity';
import {ITeam} from 'game/team';
import {GameContext} from 'ui/GameContext';
import {PlayerList} from 'ui/PlayerList';

interface ITeamViewProps {
  team: ITeam;
  onAutoAssignFields?: (team: ITeam) => void;
}

export const TeamView: React.SFC<ITeamViewProps> = ({team, onAutoAssignFields}) => (
  <GameContext.Consumer>
    {({game}) => (
      <div className="TeamView">
        <h2>{team.name}</h2>
        <PlayerList players={entitiesById(game.players, team.players)} />

        {onAutoAssignFields && (
          <button onClick={() => onAutoAssignFields(team)}>Automaatti kentät</button>
        )}
      </div>
    )}
  </GameContext.Consumer>
);
