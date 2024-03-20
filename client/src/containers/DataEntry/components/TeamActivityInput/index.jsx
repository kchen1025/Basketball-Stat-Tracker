import ButtonBlock from "@/components/ButtonBlock";
import { getDate, getGameId } from "../../utils";

const TeamActivityInput = ({
  gameStats,
  setGameStats,
  gameActivityLog,
  setGameActivityLog,
  gameData,
  teamPlayers,
  teamId,
}) => {
  return (
    <>
      {gameStats
        .filter((e) => teamPlayers.includes(e.player_id))
        .map((e, i) => {
          return (
            <ButtonBlock
              key={`${e.player_name}-${i}`}
              name={e.player_name}
              playerId={e.player_id}
              teamId={teamId}
              gameStats={gameStats}
              setGameStats={setGameStats}
              gameActivityLog={gameActivityLog}
              setGameActivityLog={setGameActivityLog}
              date={getDate(gameData)}
              gameId={getGameId(gameData)}
            />
          );
        })}
    </>
  );
};

export default TeamActivityInput;
