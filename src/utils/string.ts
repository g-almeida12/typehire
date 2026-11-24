export function truncateText(text: string, maxLength: number = 150) {
  return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
}

export function getSearchParam(
  queries: Record<string, string | string[] | undefined>,
  sp: string,
) {
  if (!queries[sp]) return undefined;

  return Array.isArray(queries[sp]) ? queries[sp][0] : queries[sp];
}
