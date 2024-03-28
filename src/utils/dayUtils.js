// move this shit HACK
const getGameAndDay = (input) => {
  const pattern = /D(\d+)G(\d+)/;
  const match = input.match(pattern);

  if (match) {
    return { day: match[1], game: match[2] };
  } else {
    return { error: "Invalid format" };
  }
};

module.exports = {
  getGameAndDay,
};
