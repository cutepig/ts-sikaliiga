import React from 'react';
import {ITeam} from 'game/models';
import {entitiesById} from 'game/entity';
import {GameContext} from 'ui/GameContext';
import {PlayerList} from 'ui/demo1/PlayerList';
import {FieldList} from 'ui/demo1/FieldList';

interface ITeamView {
  team: ITeam;
  onAutoAssignFields?: (team: ITeam) => void;
}

export const TeamView: React.SFC<ITeamView> = ({team, onAutoAssignFields}) => (
  <GameContext.Consumer>
    {({game}) => (
      <div className="TeamView">
        <h2>{team.name}</h2>
        <PlayerList showStats players={entitiesById(game.players, team.playerIds)} />

        <FieldList fields={team.fields} players={game.players} />

        {onAutoAssignFields && (
          <button disabled onClick={() => onAutoAssignFields(team)}>
            Automaatti kentät
          </button>
        )}
      </div>
    )}
  </GameContext.Consumer>
);
