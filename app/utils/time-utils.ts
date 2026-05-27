
/**
 * Formats a time string (HH:mm or HH:mm:ss) into strict 24-hour format.
 */
export function formatTime(timeStr: string): string {
  const parts = timeStr.split(":");
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  const s = parts[2] ? Number(parts[2]) : undefined;

  let res = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  if (s !== undefined) res += `:${String(s).padStart(2, "0")}`;
  return res;
}

/**
 * Converts total minutes (e.g. 1260 => 21:00) to a 24-hour time string.
 */
export function formatMinutesToTime(totalMinutes: number): string {
  const roundedMinutes = Math.round(totalMinutes);
  const normalized = ((roundedMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  return formatTime(timeStr);
}
