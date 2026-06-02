import { describe, expect, it } from "vitest";
import { localizedStrict } from "./queries";

describe("localizedStrict", () => {
  it("projects each locale slot directly with no coalesce fallback", () => {
    // The contract: localizedStrict must NOT cross-fill an empty slot from
    // another locale. Editorial-override fields like displayName rely on
    // empty slots staying null so the render-time picker falls back to the
    // un-localized record field (name/title). A future "let's unify the
    // helpers" refactor that reintroduces coalesce here would silently
    // regress that behaviour — hence this guard.
    const groq = localizedStrict("displayName");
    expect(groq).not.toContain("coalesce");
    expect(groq).toMatch(/"ko":\s*displayName\[language == "ko"\]\[0\]\.value/);
    expect(groq).toMatch(/"en":\s*displayName\[language == "en"\]\[0\]\.value/);
    expect(groq).toMatch(/"zh":\s*displayName\[language == "zh"\]\[0\]\.value/);
  });

  it("interpolates the field name into each locale slot", () => {
    const groq = localizedStrict("issuer");
    expect(groq).toContain('issuer[language == "ko"]');
    expect(groq).toContain('issuer[language == "en"]');
    expect(groq).toContain('issuer[language == "zh"]');
  });
});
