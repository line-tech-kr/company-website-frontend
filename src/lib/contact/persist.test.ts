import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { contactPayloadFixture, makeContactPayload } from "@/test/fixtures/contact";

const { createClientMock, createMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
  createMock: vi.fn(),
}));

vi.mock("@sanity/client", () => ({
  createClient: (...args: unknown[]) => {
    createClientMock(...args);
    return { create: createMock };
  },
}));

import { persistContactSubmission } from "./persist";

const ISO_8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

describe("persistContactSubmission", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    createClientMock.mockReset();
    createMock.mockReset();
    createMock.mockResolvedValue({ _id: "doc-1" });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("throws when SANITY_WRITE_TOKEN is not set", async () => {
    vi.stubEnv("SANITY_WRITE_TOKEN", "");
    await expect(persistContactSubmission(contactPayloadFixture)).rejects.toThrow(
      "SANITY_WRITE_TOKEN is not set",
    );
    expect(createMock).not.toHaveBeenCalled();
  });

  it("creates a contactSubmission with the full payload mapped", async () => {
    vi.stubEnv("SANITY_WRITE_TOKEN", "write-token");
    await persistContactSubmission(contactPayloadFixture);

    expect(createClientMock).toHaveBeenCalledWith(
      expect.objectContaining({ useCdn: false, token: "write-token" }),
    );
    expect(createMock).toHaveBeenCalledTimes(1);
    const doc = createMock.mock.calls[0][0];
    expect(doc).toMatchObject({
      _type: "contactSubmission",
      inquiryType: "support",
      typeDetail: "M3030VA",
      name: "홍길동",
      email: "customer@example.com",
      company: "테스트 회사",
      phone: "+82 10-1234-5678",
      subject: "기술 문의",
      message: "안녕하세요. 제품 확인을 부탁드립니다.",
    });
    expect(doc.submittedAt).toMatch(ISO_8601);
  });

  it("omits optional fields when absent", async () => {
    vi.stubEnv("SANITY_WRITE_TOKEN", "write-token");
    const minimal = makeContactPayload({
      typeDetail: undefined,
      company: undefined,
      phone: undefined,
      subject: undefined,
    });

    await persistContactSubmission(minimal);

    const doc = createMock.mock.calls[0][0];
    expect(doc.typeDetail).toBeUndefined();
    expect(doc.company).toBeUndefined();
    expect(doc.phone).toBeUndefined();
    expect(doc.subject).toBeUndefined();
  });

  it("propagates errors from the Sanity client", async () => {
    vi.stubEnv("SANITY_WRITE_TOKEN", "write-token");
    createMock.mockRejectedValueOnce(new Error("sanity write failed"));

    await expect(persistContactSubmission(contactPayloadFixture)).rejects.toThrow(
      "sanity write failed",
    );
  });
});
