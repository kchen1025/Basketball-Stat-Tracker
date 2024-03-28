import { getGameAndDay } from "@/utils/dayUtils";

export const isTotalGameStats = (selectedGame) =>
  Object.values(selectedGame).length === 0;

export const getDaysFromGames = (games) =>
  Array.from(
    games.reduce((acc, elem) => {
      const { day, game } = getGameAndDay(elem.name);

      if (game !== undefined) {
        acc.add(`D${day}`);
      }

      return acc;
    }, new Set())
  );
