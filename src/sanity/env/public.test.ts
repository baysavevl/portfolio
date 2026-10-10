import {describe, expect, it} from "vitest";
import {
  getPublicSanityEnv,
  hasPublicSanityEnv,
  readPublicSanityEnv
} from "@/sanity/env/public";

const validEnv = {
  NEXT_PUBLIC_SANITY_PROJECT_ID: "mindful-builder",
  NEXT_PUBLIC_SANITY_DATASET: "development",
  NEXT_PUBLIC_SANITY_API_VERSION: "2026-10-10"
};

describe("public Sanity environment", () => {
  it("returns normalized browser-safe values", () => {
    expect(getPublicSanityEnv(validEnv)).toEqual({
      projectId: "mindful-builder",
      dataset: "development",
      apiVersion: "2026-10-10"
    });
    expect(hasPublicSanityEnv(validEnv)).toBe(true);
  });

  it.each([
    ["NEXT_PUBLIC_SANITY_PROJECT_ID", "UPPERCASE!"],
    ["NEXT_PUBLIC_SANITY_DATASET", "invalid dataset"],
    ["NEXT_PUBLIC_SANITY_API_VERSION", "latest"]
  ] as const)("rejects invalid %s without disclosing its value", (key, value) => {
    const env = {...validEnv, [key]: value};

    try {
      getPublicSanityEnv(env);
      throw new Error("Expected public Sanity configuration to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain(key);
      expect((error as Error).message).not.toContain(value);
    }
  });

  it("reports every missing public variable without throwing from the reader", () => {
    const result = readPublicSanityEnv({});

    expect(result.success).toBe(false);
    if (result.success) {
      throw new Error("Expected missing public configuration");
    }

    expect(result.error.variables).toEqual([
      "NEXT_PUBLIC_SANITY_PROJECT_ID",
      "NEXT_PUBLIC_SANITY_DATASET",
      "NEXT_PUBLIC_SANITY_API_VERSION"
    ]);
    expect(result.error.message).not.toContain("undefined");
    expect(hasPublicSanityEnv({})).toBe(false);
  });
});
