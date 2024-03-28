const { getGameAndDay } = require("./dayUtils");

// given an array and a key, create a map with the key as the key in the map and the rest as a value
const pivot = (arr, key) => {
  return arr.reduce((acc, elem) => {
    acc.set(elem.player_id, elem);
    return acc;
  }, new Map());
};

// return a map where the day is the key of the map, rest being
// an array D1: []
const pivotByDay = (arr) => {
  return arr.reduce((acc, elem) => {
    const { day, game } = getGameAndDay(elem.game_name);
    const dayKey = `D${day}`;

    if (acc.has(dayKey)) {
      acc.set(dayKey, [...acc.get(dayKey), { ...elem }]);
    } else {
      acc.set(dayKey, [{ ...elem }]);
    }

    return acc;
  }, new Map());
};

module.exports = {
  pivot,
  pivotByDay,
};
