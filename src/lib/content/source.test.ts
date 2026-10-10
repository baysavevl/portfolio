import {describe, expect, it} from "vitest";
import {resolveContentSource} from "@/lib/content/source";

describe("resolveContentSource", () => {
  it("defaults to demo outside production", () => {
    expect(resolveContentSource({}, "development")).toBe("demo");
    expect(resolveContentSource({}, "test")).toBe("demo");
  });

  it("accepts sanity when explicitly configured", () => {
    expect(
      resolveContentSource({CONTENT_SOURCE: "sanity"}, "production")
    ).toBe("sanity");
  });

  it.each([undefined, "", "demo"])(
    "rejects %s in production",
    (value) => {
      expect(() =>
        resolveContentSource({CONTENT_SOURCE: value}, "production")
      ).toThrow(/CONTENT_SOURCE=sanity/);
    }
  );

  it("rejects unknown values in every environment", () => {
    const rejectedValue = "filesystem-private-value";

    expect(() =>
      resolveContentSource(
        {CONTENT_SOURCE: rejectedValue},
        "development"
      )
    ).toThrowError(
      expect.objectContaining({
        message: expect.not.stringContaining(rejectedValue)
      })
    );
  });
});
