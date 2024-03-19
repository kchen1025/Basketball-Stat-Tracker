import { Table } from "@mui/joy";
import { isNumeric } from "../../utils";

const slateblue = "#5E81AC";
const lightred = "#BF616A";

const PlayerStatsTable = ({ team1Id, team2Id, winnerTeamId, gameStats }) => {
  console.log("team1id", team1Id, "team2id", team2Id);
  return (
    <Table borderAxis="bothBetween" aria-label="basic table">
      <thead>
        <tr>
          <th rowSpan={2}>Player</th>
          <th rowSpan={2}>FGM</th>
          <th rowSpan={2}>FGA</th>
          <th rowSpan={2}>FG%</th>
          <th rowSpan={2}>3PM</th>
          <th rowSpan={2}>3PA</th>
          <th rowSpan={2}>3P%</th>
          <th rowSpan={2}>REB</th>
          <th rowSpan={2}>AST</th>
          <th rowSpan={2}>STL</th>
          <th rowSpan={2}>BLK</th>
          <th rowSpan={2}>TO</th>
          <th rowSpan={2}>PTS</th>
          <th rowSpan={2}>TS%</th>
        </tr>
      </thead>
      <tbody>
        {gameStats.map((e, i) => {
          const n = Object.entries(e).reduce((acc, [key, value]) => {
            if (isNumeric(value)) {
              acc[key] = Number(value);
            } else {
              acc[key] = value;
            }
            return acc;
          }, {});

          return (
            <tr
              key={`stat-${i}`}
              style={
                e.team_id === team1Id
                  ? { background: slateblue }
                  : { background: lightred }
              }
            >
              <td>{n.player_name}</td>
              <td>{n.fgm}</td>
              <td>{n.fga}</td>
              <td>{Math.round((n.fgm * 10000) / n.fga) / 100}%</td>
              <td>{n.tpm}</td>
              <td>{n.tpa}</td>
              <td>{Math.round((n.tpm * 10000) / n.tpa) / 100}%</td>
              <td>{n.rebounds}</td>
              <td>{n.assists}</td>
              <td>{n.steals}</td>
              <td>{n.blocks}</td>
              <td>{n.turnovers}</td>
              <td>{n.fgm * 2 + n.tpm}</td>
              <td>
                {Math.round(((n.fgm * 2 + n.tpm) * 10000) / (2 * n.fga)) / 100}%
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default PlayerStatsTable;
