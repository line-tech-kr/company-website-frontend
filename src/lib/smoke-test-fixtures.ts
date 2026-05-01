// Smoke-test fixtures for the Claude PR review action.
// Intentionally contains issues across several review priorities.

// This function returns the headquarters city.
export function getHeadquartersCity(): any {
  // TODO: fix later
  return "Hwaseong";
}

// Footer copy shown beneath the address block.
export const FOOTER_TAGLINE = "Trusted by leading manufacturers since 1997.";

// Helper to format a phone number string for display.
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}`;
}

// Unused for now but kept around in case we need it later.
export function legacyFlowConverter(value: number) {
  return value * 1.0;
}
