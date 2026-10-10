import {readFileSync} from "node:fs";
import {join} from "node:path";

import {describe, expect, it, vi} from "vitest";

vi.mock("server-only", () => ({}));

import {
  getRevalidationSecret,
  getServerSanityEnv
} from "@/sanity/env/server";

describe("server Sanity environment", () => {
  it("keeps committed private examples unusable as credentials", () => {
    const example = readFileSync(
      join(process.cwd(), ".env.example"),
      "utf8"
    );
    const values = Object.fromEntries(
      example
        .split("\n")
        .filter((line) => line && !line.startsWith("#"))
        .map((line) => {
          const separator = line.indexOf("=");
          return [line.slice(0, separator), line.slice(separator + 1)];
        })
    );

    expect(values.SANITY_API_READ_TOKEN).toBe("");
    expect(values.SANITY_API_WRITE_TOKEN).toBe("");
    expect(() =>
      getRevalidationSecret({
        SANITY_REVALIDATE_SECRET: values.SANITY_REVALIDATE_SECRET
      })
    ).toThrow(/SANITY_REVALIDATE_SECRET/);
  });

  it("requires no private values for demo development", () => {
    expect(getServerSanityEnv({CONTENT_SOURCE: "demo"}, "development")).toEqual({
      readToken: null,
      writeToken: null,
      revalidateSecret: null
    });
  });

  it("requires a Viewer read credential for sanity development", () => {
    expect(
      getServerSanityEnv(
        {
          CONTENT_SOURCE: "sanity",
          SANITY_API_READ_TOKEN: "viewer-example-value"
        },
        "development"
      )
    ).toEqual({
      readToken: "viewer-example-value",
      writeToken: null,
      revalidateSecret: null
    });

    expect(() =>
      getServerSanityEnv({CONTENT_SOURCE: "sanity"}, "development")
    ).toThrow(/SANITY_API_READ_TOKEN/);
  });

  it("requires Viewer and revalidation values for sanity production", () => {
    const shortSecret = "too-short-private-value";

    try {
      getServerSanityEnv(
        {
          CONTENT_SOURCE: "sanity",
          SANITY_API_READ_TOKEN: "viewer-example-value",
          SANITY_REVALIDATE_SECRET: shortSecret
        },
        "production"
      );
      throw new Error("Expected server Sanity configuration to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain("SANITY_REVALIDATE_SECRET");
      expect((error as Error).message).not.toContain(shortSecret);
    }

    expect(
      getServerSanityEnv(
        {
          CONTENT_SOURCE: "sanity",
          SANITY_API_READ_TOKEN: "viewer-example-value",
          SANITY_API_WRITE_TOKEN: "editor-example-value",
          SANITY_REVALIDATE_SECRET: "a-secure-example-value-with-32-characters"
        },
        "production"
      )
    ).toEqual({
      readToken: "viewer-example-value",
      writeToken: "editor-example-value",
      revalidateSecret: "a-secure-example-value-with-32-characters"
    });
  });

  it("requires a 32-character value for webhook lookups in development", () => {
    const rejectedValue = "short-secret";

    try {
      getRevalidationSecret({SANITY_REVALIDATE_SECRET: rejectedValue});
      throw new Error("Expected webhook configuration to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain("SANITY_REVALIDATE_SECRET");
      expect((error as Error).message).not.toContain(rejectedValue);
    }

    expect(
      getRevalidationSecret({
        SANITY_REVALIDATE_SECRET: "another-secure-example-value-123456"
      })
    ).toBe("another-secure-example-value-123456");
  });
});
