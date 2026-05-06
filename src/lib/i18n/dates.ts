export function formatYearMonth(value: string, locale: string): string {
  const [year, month] = value.split(".");
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(date);
}

export function formatISODate(
  value: string,
  locale: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}
