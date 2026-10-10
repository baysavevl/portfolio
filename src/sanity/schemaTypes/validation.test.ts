import type {ValidationContext} from "sanity";
import {describe, expect, it, vi} from "vitest";

import {
  validateHeroInitialMode,
  validateReferencesMatchDocumentLanguage,
  validateTopicAccent,
  validateTopicKey
} from "@/sanity/schemaTypes/validation";

function contextFor(
  language: string | undefined,
  referencedDocuments: Array<{_id: string; language?: string}>
): ValidationContext {
  return {
    document: {
      _id: "settings",
      _type: "siteSettings",
      _createdAt: "2026-10-10T00:00:00.000Z",
      _updatedAt: "2026-10-10T00:00:00.000Z",
      _rev: "test",
      language
    },
    getClient: () =>
      ({
        fetch: vi.fn().mockResolvedValue(referencedDocuments)
      }) as never
  } as unknown as ValidationContext;
}

describe("authored enum validation", () => {
  it("rejects values outside the public domain enums", () => {
    expect(validateHeroInitialMode("chaos")).toMatch(/hero mode/i);
    expect(validateTopicKey("finance")).toMatch(/topic key/i);
    expect(validateTopicAccent("neon-pink")).toMatch(/topic accent/i);
  });

  it("accepts every supported enum value", () => {
    for (const value of ["operator", "observer", "split"]) {
      expect(validateHeroInitialMode(value)).toBe(true);
    }
    for (const value of [
      "business",
      "leadership",
      "startup",
      "technology",
      "product",
      "sport",
      "mindfulness"
    ]) {
      expect(validateTopicKey(value)).toBe(true);
    }
    for (const value of ["field-blue", "quiet-sage", "graphite"]) {
      expect(validateTopicAccent(value)).toBe(true);
    }
  });
});

describe("localized reference validation", () => {
  it("accepts absent optional references", async () => {
    await expect(
      validateReferencesMatchDocumentLanguage(
        undefined,
        contextFor("vi", [])
      )
    ).resolves.toBe(true);
  });

  it("accepts singular and array references matching the document language", async () => {
    await expect(
      validateReferencesMatchDocumentLanguage(
        {_ref: "post-vi"},
        contextFor("vi", [{_id: "post-vi", language: "vi"}])
      )
    ).resolves.toBe(true);

    await expect(
      validateReferencesMatchDocumentLanguage(
        [{_ref: "project-a"}, {_ref: "project-b"}],
        contextFor("en", [
          {_id: "project-a", language: "en"},
          {_id: "drafts.project-b", language: "en"}
        ])
      )
    ).resolves.toBe(true);
  });

  it("rejects a reference from the other locale", async () => {
    await expect(
      validateReferencesMatchDocumentLanguage(
        {_ref: "post-en"},
        contextFor("vi", [{_id: "post-en", language: "en"}])
      )
    ).resolves.toMatch(/same language/i);
  });

  it("fails closed when a selected reference cannot be verified", async () => {
    await expect(
      validateReferencesMatchDocumentLanguage(
        {_ref: "missing-post"},
        contextFor("en", [])
      )
    ).resolves.toMatch(/verify/i);
  });
});
