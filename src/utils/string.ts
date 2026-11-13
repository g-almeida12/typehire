export function truncateText(text: string, maxLength: number = 150) {
  return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
}
