import React from 'react';
import {ITeam} from 'game/models';

interface IStandings {
  teams: ITeam[];
}

function getTeamPoints(team: ITeam) {
  // FIXME: This is old school points
  return team.stats.wins * 2 + team.stats.ties;
}

function compareTeamPoints(a: ITeam, b: ITeam) {
  const pointsDiff = getTeamPoints(b) - getTeamPoints(a);
  if (!pointsDiff) {
    return b.stats.wins - a.stats.wins;
  }

  return pointsDiff;
}

export const Standings: React.SFC<IStandings> = ({teams}) => (
  <div className="Standings">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Joukkue</th>
          <th>PTS</th>
          <th>PO</th>
          <th>V</th>
          <th>T</th>
          <th>H</th>
        </tr>
      </thead>
      <tbody>
        {[...teams].sort(compareTeamPoints).map((team, index) => (
          <tr key={team.id}>
            <td>{index + 1}</td>
            <td>{team.name}</td>
            <td>{getTeamPoints(team)}</td>
            <td>{team.stats.gamesPlayed}</td>
            <td>{team.stats.wins}</td>
            <td>{team.stats.ties}</td>
            <td>{team.stats.losses}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
