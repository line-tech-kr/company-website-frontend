/**
 * Stringify a value for safe inlining inside `<script type="application/ld+json">`.
 *
 * `JSON.stringify` doesn't escape `<` — so a payload containing the literal
 * substring `</script>` would terminate the tag and inject arbitrary HTML.
 * Also escape U+2028 / U+2029 line separators, which JSON allows but older
 * parsers (and some script hosts) treat as line terminators inside source.
 */
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
