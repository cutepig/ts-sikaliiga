import React from 'react';
import {
  IEntityMap,
  IFields,
  IPlayer,
  DefenseFieldIndex,
  Field,
  ForwardFieldIndex,
} from 'game/models';

interface IFieldList {
  fields: IFields;
  players: IEntityMap<IPlayer>;
}

interface IFieldView {
  field?: Field;
  players: IEntityMap<IPlayer>;
}

const playerToString = (player: IPlayer) => `${player.name} (${Math.round(player.attack)})`;

const FieldView: React.SFC<IFieldView> = ({field, players}) => (
  <ul className="flex justify-around">
    {field && field.map((id, i) => id && <li key={i}>{playerToString(players[id])}</li>)}
  </ul>
);

export const FieldList: React.SFC<IFieldList> = ({fields, players}) => (
  <div className="FieldList">
    <ul>
      <li>
        <h5>Goalie</h5>
        <FieldView field={fields.goalieId ? [fields.goalieId] : undefined} players={players} />
      </li>
      <li>
        <h5>1 field</h5>
        <FieldView field={fields.forwards[ForwardFieldIndex.Field1]} players={players} />
        <FieldView field={fields.defense[DefenseFieldIndex.Field1]} players={players} />
      </li>
      <li>
        <h5>2 field</h5>
        <FieldView field={fields.forwards[ForwardFieldIndex.Field2]} players={players} />
        <FieldView field={fields.defense[DefenseFieldIndex.Field2]} players={players} />
      </li>
      <li>
        <h5>3 field</h5>
        <FieldView field={fields.forwards[ForwardFieldIndex.Field3]} players={players} />
        <FieldView field={fields.defense[DefenseFieldIndex.Field3]} players={players} />
      </li>
      <li>
        <h5>4 field</h5>
        <FieldView field={fields.forwards[ForwardFieldIndex.Field4]} players={players} />
      </li>
    </ul>
  </div>
);
