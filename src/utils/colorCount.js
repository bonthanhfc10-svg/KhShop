/**
 * Returns a display string for the number of unique colors.
 * e.g. "1 Color", "3 Colors", or null if no colors exist.
 */
export function colorCountText(colors) {
  if (!colors || colors.length === 0) return null;
  const unique = new Set(colors.map((c) => c.hex));
  const count = unique.size;
  return count === 1 ? '1 Color' : `${count} Colors`;
}
