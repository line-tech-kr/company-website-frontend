type Context = { name: string; params?: Record<string, unknown> };

export async function fetchSanity<T>(
  query: () => Promise<T>,
  ctx: Context,
): Promise<T> {
  try {
    return await query();
  } catch (err) {
    console.error(`[sanity] ${ctx.name} failed`, {
      params: ctx.params,
      err,
    });
    throw err;
  }
}
