export function descendingComparator(raw_a, raw_b, orderBy) {
  const a = raw_a[orderBy];
  const b = raw_b[orderBy];

  // Check for null and undefined
  if (a == null && b == null) return 0; // Both are null or undefined, considered equal
  if (a == null) return -1; // null/undefined values come before others
  if (b == null) return 1;

  // Check if both a and b are numeric
  const isANumeric = !isNaN(parseFloat(a)) && isFinite(a);
  const isBNumeric = !isNaN(parseFloat(b)) && isFinite(b);

  // If both are numbers, compare as numbers
  if (isANumeric && isBNumeric) {
    return parseFloat(a) - parseFloat(b);
  }

  // If one is a number and the other is text, the number should come first
  if (isANumeric) return -1;
  if (isBNumeric) return 1;

  // If both are text, compare as strings
  return a.localeCompare(b);
}

export function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export const sortDayGameComparator = (a, b) => {
  // Extract digits for primary and secondary comparison (assuming the format is always D<number>G<number>)
  const matchA = a.name.match(/D(\d+)G(\d+)/);
  const matchB = b.name.match(/D(\d+)G(\d+)/);

  // Convert matched strings to integers
  const primaryA = parseInt(matchA[1], 10);
  const primaryB = parseInt(matchB[1], 10);
  const secondaryA = parseInt(matchA[2], 10);
  const secondaryB = parseInt(matchB[2], 10);

  // First compare the primary part (D<number>)
  if (primaryA < primaryB) return -1;
  if (primaryA > primaryB) return 1;

  // If primary parts are equal, compare the secondary part (G<number>)
  return secondaryA - secondaryB;
};
