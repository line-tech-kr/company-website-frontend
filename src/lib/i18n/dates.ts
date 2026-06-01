function parseISODate(value: string | null | undefined): Date | null {
  if (!value) return null;
  // Append T00:00:00 for date-only strings so they parse as local time
  // (UTC parsing shifts the day in some timezones).
  const normalized = value.includes("T") ? value : value + "T00:00:00";
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatYearMonth(value: string, locale: string): string {
  const [year, month] = value.split(".");
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(date);
}

export function formatLongDate(
  value: string | null | undefined,
  locale: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string {
  const date = parseISODate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatShortDate(
  value: string | null | undefined,
  locale: string,
): string {
  return formatLongDate(value, locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
