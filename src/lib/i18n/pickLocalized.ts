import type { Locale } from "@/i18n/routing";

export type LocalizedField =
  | {
      ko?: string | null;
      en?: string | null;
      zh?: string | null;
    }
  | null
  | undefined;

/**
 * Pick a string from a localized `{ ko, en, zh }` field, falling back to a
 * default when the locale slot is missing or empty.
 *
 * Whitespace-only values count as empty so an editor can clear a field
 * without flipping the fallback by accident.
 */
export function pickLocalized(
  field: LocalizedField,
  locale: Locale,
  fallback: string,
): string {
  const value = field?.[locale];
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}
