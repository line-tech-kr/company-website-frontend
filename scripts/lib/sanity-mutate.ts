/**
 * Tiny fetch-based wrapper around Sanity's HTTP mutation API. Used by the
 * description / engineering-correction patch scripts so they don't need
 * `@sanity/client` (and therefore don't need project `node_modules`).
 */

const API_VERSION = "2026-01-01";

export interface SanityEnv {
  projectId: string;
  dataset: string;
  token: string;
}

export interface PatchMutation {
  patch: {
    id: string;
    // `unknown` because set values include arrays and objects
    // (e.g. `connections: [{ _key, type, length }, …]`), not just primitives.
    set?: Record<string, unknown>;
    unset?: string[];
  };
}

export interface CreateIfNotExistsMutation {
  createIfNotExists: { _id: string; _type: string } & Record<string, unknown>;
}

export type Mutation = PatchMutation | CreateIfNotExistsMutation;

export interface MutateResult {
  ok: boolean;
  status?: number;
  bodyText?: string;
}

/** Reads the three Sanity env vars; exits with an error message if any are missing. */
export function readSanityEnv(): SanityEnv {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !dataset || !token) {
    console.error(
      "\nMissing env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN in .env.local",
    );
    process.exit(1);
  }
  return { projectId, dataset, token };
}

export function mutateUrl(env: SanityEnv): string {
  return `https://${env.projectId}.api.sanity.io/v${API_VERSION}/data/mutate/${env.dataset}`;
}

/** POSTs a single mutation. Caller logs success/failure with its own label. */
export async function postMutation(
  env: SanityEnv,
  mutation: Mutation,
): Promise<MutateResult> {
  const res = await fetch(mutateUrl(env), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mutations: [mutation] }),
  });
  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      bodyText: (await res.text()).slice(0, 200),
    };
  }
  return { ok: true };
}
