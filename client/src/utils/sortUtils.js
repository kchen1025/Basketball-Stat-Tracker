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
