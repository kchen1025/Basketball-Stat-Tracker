// takes strings formatted like D11G2 and spits
// out object with the day and game nums
export const getGameAndDay = (input) => {
  const pattern = /D(\d+)G(\d+)/;
  const match = input.match(pattern);

  if (match) {
    return { day: match[1], game: match[2] };
  } else {
    return { error: "Invalid format" };
  }
};
