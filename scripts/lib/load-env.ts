import { existsSync, readFileSync } from "node:fs";

/**
 * Minimal dotenv-style loader. Reads `KEY=VALUE` lines into `process.env`
 * without overwriting variables that are already set.
 *
 * Quirks worth knowing:
 * - Lines starting with `#` (after trimming) are skipped as comments.
 * - Blank lines are skipped.
 * - A matching pair of wrapping single or double quotes around the value is
 *   stripped (so `KEY="abc"` sets `KEY=abc`, not `KEY="abc"`).
 * - Trailing whitespace on the value is trimmed; leading whitespace next to
 *   `=` is consumed by the regex.
 * - Missing file is silently ignored (lets scripts work without `.env.local`
 *   when the relevant env vars come from another source).
 */
export function loadEnv(path: string): void {
  if (!existsSync(path)) return;
  for (const rawLine of readFileSync(path, "utf-8").split(/\r?\n/)) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const m = rawLine.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=(.*)$/);
    if (!m) continue;
    let value = m[2].trimEnd();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    process.env[m[1]] ??= value;
  }
}
