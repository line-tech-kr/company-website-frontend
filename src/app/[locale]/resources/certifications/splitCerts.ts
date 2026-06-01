/**
 * Partition certs into company-wide (no `models`) and product-specific
 * (`models[]` populated) buckets. Order within each bucket is preserved.
 */
export type CertWithModels = { models?: string[] | null };

export function splitCerts<T extends CertWithModels>(
  certs: T[],
): { companyWide: T[]; productSpecific: T[] } {
  const companyWide: T[] = [];
  const productSpecific: T[] = [];
  for (const c of certs) {
    if (c.models && c.models.length > 0) productSpecific.push(c);
    else companyWide.push(c);
  }
  return { companyWide, productSpecific };
}
