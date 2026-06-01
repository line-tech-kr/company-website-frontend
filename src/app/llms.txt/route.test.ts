import { beforeEach, describe, expect, it, vi } from "vitest";

const { buildLlmsManifestMock } = vi.hoisted(() => ({
  buildLlmsManifestMock: vi.fn(),
}));

vi.mock("@/lib/seo/llmsManifest", () => ({
  buildLlmsManifest: buildLlmsManifestMock,
}));

import { GET } from "./route";
import { siteUrl } from "@/lib/seo";

describe("GET /llms.txt", () => {
  beforeEach(() => {
    buildLlmsManifestMock.mockReset();
  });

  it("returns 200 with the rendered manifest", async () => {
    buildLlmsManifestMock.mockResolvedValue("# Line Tech\n\n## Company\n");
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("# Line Tech\n\n## Company\n");
  });

  it("sets Content-Type to text/plain; charset=utf-8", async () => {
    buildLlmsManifestMock.mockResolvedValue("# Line Tech\n");
    const res = await GET();
    expect(res.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
  });

  it("forwards the resolved siteUrl to buildLlmsManifest", async () => {
    buildLlmsManifestMock.mockResolvedValue("");
    await GET();
    expect(buildLlmsManifestMock).toHaveBeenCalledWith(siteUrl);
  });
});
