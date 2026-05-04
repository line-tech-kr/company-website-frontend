import { sanityWriteClient } from "@/sanity/writeClient";
import type { ContactFormPayload } from "./schema";

export async function persistContactSubmission(
  data: ContactFormPayload,
  ip: string,
): Promise<void> {
  await sanityWriteClient.create({
    _type: "contactSubmission",
    submittedAt: new Date().toISOString(),
    inquiryType: data.inquiryType,
    typeDetail: data.typeDetail ?? undefined,
    name: data.name,
    email: data.email,
    company: data.company ?? undefined,
    phone: data.phone ?? undefined,
    subject: data.subject ?? undefined,
    message: data.message,
    ip,
  });
}
