import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import type { ContactFormPayload } from "./schema";

export async function persistContactSubmission(
  data: ContactFormPayload,
): Promise<void> {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    throw new Error("SANITY_WRITE_TOKEN is not set");
  }

  const sanityWriteClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });

  await sanityWriteClient.create({
    _type: "contactSubmission",
    submittedAt: new Date().toISOString(),
    inquiryType: data.inquiryType,
    typeDetail: data.typeDetail ?? undefined,
    model: data.model ?? undefined,
    name: data.name,
    email: data.email,
    company: data.company ?? undefined,
    phone: data.phone ?? undefined,
    subject: data.subject ?? undefined,
    message: data.message,
    gasMode: data.gasMode ?? undefined,
    gas: data.gas ?? undefined,
    gasComponents: data.gasComponents ?? undefined,
    flowValue: data.flowValue ?? undefined,
    flowUnit: data.flowUnit ?? undefined,
    pressureValue: data.pressureValue ?? undefined,
    pressureUnit: data.pressureUnit ?? undefined,
    fittingType: data.fittingType ?? undefined,
    fittingSize: data.fittingSize ?? undefined,
  });
}
