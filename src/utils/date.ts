export function formatRelativeTime(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

  const intervals = {
    year: 60 * 60 * 24 * 365,
    month: 60 * 60 * 24 * 30,
    week: 60 * 60 * 24 * 7,
    day: 60 * 60 * 24,
    hour: 60 * 60,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const delta = Math.round(diffInSeconds / secondsInUnit);
    if (Math.abs(delta) >= 1) {
      return rtf.format(delta, unit as Intl.RelativeTimeFormatUnit);
    }
  }

  return "agora mesmo";
}
