export function useRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (days > 0) return `${days}d  ago`;
  if (hours > 0) return `${hours}h  ago`;
  if (mins > 0) return `${mins}m  ago`;
  return "just now";
}
