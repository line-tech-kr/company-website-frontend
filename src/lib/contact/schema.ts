import { z } from "zod";

/**
 * Server-side schema for the public contact form. Mirrors the visible
 * fields plus the honeypot and Turnstile token. Errors here are mapped to
 * a single user-facing "invalid" message; we never echo specific field
 * messages back, since attackers can use them to probe validation.
 */

export const FLOW_UNITS = ["sccm", "slm", "sml", "scfh"] as const;
export const PRESSURE_UNITS = ["bar", "psi", "kPa", "MPa"] as const;
export const FITTING_TYPES = [
  "VCR",
  "Swagelok",
  "NPT",
  "Rc",
  "Other",
] as const;

export type FlowUnit = (typeof FLOW_UNITS)[number];
export type PressureUnit = (typeof PRESSURE_UNITS)[number];
export type FittingType = (typeof FITTING_TYPES)[number];

const FLOW_UNIT_SET: ReadonlySet<string> = new Set(FLOW_UNITS);
const PRESSURE_UNIT_SET: ReadonlySet<string> = new Set(PRESSURE_UNITS);
const FITTING_TYPE_SET: ReadonlySet<string> = new Set(FITTING_TYPES);

function isPositiveNumeric(value: string): boolean {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

export const GAS_MODES = ["pure", "mixture"] as const;
export type GasMode = (typeof GAS_MODES)[number];
const GAS_MODE_SET: ReadonlySet<string> = new Set(GAS_MODES);

export type GasComponent = { gas: string; percent: number };

/**
 * Parse the `gasComponents` payload (a JSON-encoded array of
 * `{ gas, percent }`). Returns null on any structural problem; the
 * caller decides how to flag the error.
 */
export function parseGasComponents(raw: string): GasComponent[] | null {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(value)) return null;
  const out: GasComponent[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") return null;
    const e = entry as Record<string, unknown>;
    const gas = typeof e.gas === "string" ? e.gas.trim() : "";
    const percentRaw = e.percent;
    const percent =
      typeof percentRaw === "number"
        ? percentRaw
        : typeof percentRaw === "string"
          ? Number(percentRaw)
          : NaN;
    out.push({ gas, percent });
  }
  return out;
}

export const contactFormSchema = z
  .object({
    inquiryType: z.string().min(1).max(64),
    typeDetail: z.string().max(200).optional(),
    name: z.string().min(1).max(120),
    email: z.string().email().max(254),
    company: z.string().max(200).optional(),
    phone: z.string().max(40).optional(),
    subject: z.string().max(200).optional(),
    message: z.string().min(1).max(5000),
    // Quote-only fields. Each is optional at the shape level; superRefine
    // below makes them required when inquiryType === "quote".
    gasMode: z.string().max(16).optional(),
    // Single-gas text — used when `gasMode === "pure"`.
    gas: z.string().max(120).optional(),
    // JSON-encoded array of `{gas, percent}` — used when `gasMode === "mixture"`.
    gasComponents: z.string().max(2000).optional(),
    flowValue: z.string().max(40).optional(),
    flowUnit: z.string().max(16).optional(),
    pressureValue: z.string().max(40).optional(),
    pressureUnit: z.string().max(16).optional(),
    fittingType: z.string().max(32).optional(),
    fittingSize: z.string().max(40).optional(),
    // PIPA Art. 22 — explicit consent. Checkbox sends "on" when checked,
    // is absent otherwise.
    consent: z.literal("on"),
    // Honeypot: a hidden field that real users never fill. Bots typically
    // populate every input. Reject submissions where this is non-empty.
    website: z.string().max(0).optional().default(""),
    // Cloudflare Turnstile token, posted automatically by the widget into
    // an input named `cf-turnstile-response`.
    "cf-turnstile-response": z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.inquiryType !== "quote") return;

    const requireNonEmpty = (
      field:
        | "gas"
        | "flowValue"
        | "flowUnit"
        | "pressureValue"
        | "pressureUnit"
        | "fittingType"
        | "fittingSize",
    ) => {
      const value = data[field];
      if (!value || value.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: "required",
        });
        return false;
      }
      return true;
    };

    const mode = data.gasMode ?? "";
    if (!GAS_MODE_SET.has(mode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["gasMode"],
        message: "required",
      });
    } else if (mode === "pure") {
      requireNonEmpty("gas");
    } else if (mode === "mixture") {
      const raw = data.gasComponents ?? "";
      if (!raw.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["gasComponents"],
          message: "required",
        });
      } else {
        const components = parseGasComponents(raw);
        if (!components) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["gasComponents"],
            message: "malformed",
          });
        } else if (components.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["gasComponents"],
            message: "mixture needs at least two components",
          });
        } else {
          let total = 0;
          let invalid = false;
          for (const c of components) {
            if (!c.gas) {
              invalid = true;
              break;
            }
            if (!Number.isFinite(c.percent) || c.percent <= 0 || c.percent > 100) {
              invalid = true;
              break;
            }
            total += c.percent;
          }
          if (invalid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["gasComponents"],
              message: "each component needs a gas and a percentage 0–100",
            });
          } else if (Math.abs(total - 100) > 0.1) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["gasComponents"],
              message: "percentages must sum to 100",
            });
          }
        }
      }
    }

    if (requireNonEmpty("flowValue") && !isPositiveNumeric(data.flowValue!)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["flowValue"],
        message: "must be a positive number",
      });
    }
    if (requireNonEmpty("flowUnit") && !FLOW_UNIT_SET.has(data.flowUnit!)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["flowUnit"],
        message: "unknown unit",
      });
    }

    if (
      requireNonEmpty("pressureValue") &&
      !isPositiveNumeric(data.pressureValue!)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pressureValue"],
        message: "must be a positive number",
      });
    }
    if (
      requireNonEmpty("pressureUnit") &&
      !PRESSURE_UNIT_SET.has(data.pressureUnit!)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pressureUnit"],
        message: "unknown unit",
      });
    }

    if (
      requireNonEmpty("fittingType") &&
      !FITTING_TYPE_SET.has(data.fittingType!)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fittingType"],
        message: "unknown fitting type",
      });
    }
    requireNonEmpty("fittingSize");
  });

export type ContactFormPayload = z.infer<typeof contactFormSchema>;

/**
 * Render the gas selection as a single human-readable string for email +
 * Sanity preview ("N2" for pure, "5% SiH4 + 95% N2" for mixture). Returns
 * null when the payload doesn't carry usable gas info (non-quote inquiries,
 * malformed mixture JSON).
 */
export function formatGasSummary(data: ContactFormPayload): string | null {
  if (data.gasMode === "pure") {
    return data.gas?.trim() || null;
  }
  if (data.gasMode === "mixture" && data.gasComponents) {
    const components = parseGasComponents(data.gasComponents);
    if (!components || components.length === 0) return null;
    return components
      .map((c) => `${formatPercent(c.percent)}% ${c.gas}`)
      .join(" + ");
  }
  return null;
}

export function formatPercent(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  if (Number.isInteger(n)) return String(n);
  // Don't truncate to 2dp — that silently collapses 0.001 → "0", which a
  // sub-1% trace dopant would render as 0% in the sales email. `String(n)`
  // preserves whatever precision the customer typed.
  return String(n);
}
