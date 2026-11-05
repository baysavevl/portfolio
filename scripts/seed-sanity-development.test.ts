import {describe, expect, it} from "vitest";

import {
  assertSeedAllowed,
  buildSeedDocuments,
  runSeedCommand,
  type SeedDocument
} from "./seed-sanity-development.mts";

const allowedEnvironment = {
  NEXT_PUBLIC_SANITY_DATASET: "development",
  ALLOW_DEMO_SEED: "true",
  SANITY_API_WRITE_TOKEN: "editor-secret-that-must-not-leak"
};

describe("assertSeedAllowed", () => {
  it("allows an explicitly opted-in development seed", () => {
    expect(() => assertSeedAllowed(allowedEnvironment)).not.toThrow();
  });

  it.each(["production", "prod", "", "staging"])(
    "rejects the %j dataset",
    (dataset) => {
      expect(() =>
        assertSeedAllowed({
          ...allowedEnvironment,
          NEXT_PUBLIC_SANITY_DATASET: dataset
        })
      ).toThrow(/NEXT_PUBLIC_SANITY_DATASET/);
    }
  );

  it.each([undefined, "false", "TRUE", "1"])(
    "rejects ALLOW_DEMO_SEED=%j",
    (allowDemoSeed) => {
      expect(() =>
        assertSeedAllowed({
          ...allowedEnvironment,
          ALLOW_DEMO_SEED: allowDemoSeed
        })
      ).toThrow(/ALLOW_DEMO_SEED/);
    }
  );

  it("requires an Editor write credential", () => {
    expect(() =>
      assertSeedAllowed({
        ...allowedEnvironment,
        SANITY_API_WRITE_TOKEN: "   "
      })
    ).toThrow(/SANITY_API_WRITE_TOKEN/);
  });

  it("never exposes the provided write credential in an error", () => {
    const rejectedCredential = "editor-secret-that-must-not-leak";

    let error: unknown;

    try {
      assertSeedAllowed({
        ...allowedEnvironment,
        NEXT_PUBLIC_SANITY_DATASET: "production",
        SANITY_API_WRITE_TOKEN: rejectedCredential
      });
    } catch (caught) {
      error = caught;
    }

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).not.toContain(rejectedCredential);
  });
});

describe("buildSeedDocuments", () => {
  it("builds deterministic Sanity documents with unique demo IDs", () => {
    const first = buildSeedDocuments();
    const second = buildSeedDocuments();
    const ids = first.map((document) => document._id);

    expect(first).toEqual(second);
    expect(first).toHaveLength(32);
    expect(new Set(ids).size).toBe(32);
    expect(ids.every((id) => id.startsWith("demo-"))).toBe(true);
  });

  it("combines the bilingual topic labels into one topic document", () => {
    const topic = buildSeedDocuments().find(
      (document) => document._id === "demo-topic-business"
    );

    expect(topic).toEqual({
      _id: "demo-topic-business",
      _type: "topic",
      key: "business",
      labels: {en: "Business", vi: "Kinh doanh"},
      descriptions: {
        en: "Systems, choices, and durable value creation.",
        vi: "Hệ thống, lựa chọn và cách tạo giá trị bền vững."
      },
      accent: "field-blue"
    });
  });

  it("converts posts to published demo documents with topic references", () => {
    const post = buildSeedDocuments().find(
      (document) =>
        document._id === "demo-post-en-clarity-before-velocity"
    );

    expect(post).toMatchObject({
      _type: "post",
      language: "en",
      slug: {_type: "slug", current: "clarity-before-velocity"},
      featured: true,
      isDemo: true,
      topics: [
        {
          _key: "leadership",
          _type: "reference",
          _ref: "demo-topic-leadership"
        },
        {
          _key: "product",
          _type: "reference",
          _ref: "demo-topic-product"
        }
      ]
    });
  });

  it("adds Sanity keys and types to inline profile principles", () => {
    const profile = buildSeedDocuments().find(
      (document) => document._id === "demo-profile-en"
    );

    expect(profile).toMatchObject({_type: "profile"});
    expect(
      (profile?.principles as Array<Record<string, unknown>>)[0]
    ).toMatchObject({
      _key: expect.stringMatching(/^[a-z0-9]{8}$/),
      _type: "principle",
      title: "Make the problem legible"
    });
  });

  it("links featured content from each localized site settings document", () => {
    const settings = buildSeedDocuments().find(
      (document) => document._id === "demo-site-settings-en"
    );

    expect(settings).toMatchObject({
      _type: "siteSettings",
      language: "en",
      featuredPost: {
        _type: "reference",
        _ref: "demo-post-en-clarity-before-velocity"
      },
      featuredProjects: [
        {
          _key: "decision-journal",
          _type: "reference",
          _ref: "demo-project-en-decision-journal"
        },
        {
          _key: "calm-launch",
          _type: "reference",
          _ref: "demo-project-en-calm-launch"
        }
      ]
    });
  });

  it("creates translation metadata only for complete English/Vietnamese pairs", () => {
    const documents = buildSeedDocuments();
    const metadata = documents.find(
      (document) =>
        document._id === "demo-translation-post-clarity-before-velocity"
    );

    expect(metadata).toMatchObject({
      _type: "translation.metadata",
      schemaTypes: ["post"],
      translations: [
        {
          _type: "internationalizedArrayReferenceValue",
          language: "en",
          value: {
            _type: "reference",
            _ref: "demo-post-en-clarity-before-velocity"
          }
        },
        {
          _type: "internationalizedArrayReferenceValue",
          language: "vi",
          value: {
            _type: "reference",
            _ref: "demo-post-vi-clarity-before-velocity"
          }
        }
      ]
    });
    expect(
      (metadata?.translations as Array<{_key: string}>).map(
        (translation) => translation._key
      )
    ).toEqual([
      expect.stringMatching(/^[a-z0-9]{8}$/),
      expect.stringMatching(/^[a-z0-9]{8}$/)
    ]);
    expect(
      documents.some(
        (document) =>
          document._id === "demo-translation-post-quiet-leadership"
      )
    ).toBe(false);
  });

  it("does not manufacture résumé facts or PDF metadata", () => {
    const resume = buildSeedDocuments().find(
      (document) => document._id === "demo-resume-en"
    );

    expect(resume).toEqual({
      _id: "demo-resume-en",
      _type: "resumeAsset",
      language: "en",
      summary:
        "Verified professional history has not yet been supplied. This résumé will be completed only with Vincent-approved facts.",
      capabilities: []
    });
  });
});

describe("runSeedCommand", () => {
  const commandEnvironment = {
    NEXT_PUBLIC_SANITY_PROJECT_ID: "mindful-builder",
    NEXT_PUBLIC_SANITY_DATASET: "development",
    NEXT_PUBLIC_SANITY_API_VERSION: "2026-10-10",
    ALLOW_DEMO_SEED: "true",
    SANITY_API_WRITE_TOKEN: "editor-secret-that-must-not-leak"
  };

  it("rejects a disallowed seed before creating a Sanity client", async () => {
    let clientCreated = false;

    await expect(
      runSeedCommand(
        {
          ...commandEnvironment,
          NEXT_PUBLIC_SANITY_DATASET: "production"
        },
        {
          createClient: () => {
            clientCreated = true;
            throw new Error("Client factory must not run");
          },
          log: () => undefined
        }
      )
    ).rejects.toThrow(/NEXT_PUBLIC_SANITY_DATASET/);
    expect(clientCreated).toBe(false);
  });

  it("replaces all demo documents in one transaction without logging secrets", async () => {
    const written: SeedDocument[] = [];
    const logs: string[] = [];
    let committed = false;
    let clientConfiguration: Record<string, unknown> | undefined;
    const transaction = {
      createOrReplace(document: SeedDocument) {
        written.push(document);
        return this;
      },
      async commit() {
        committed = true;
        return {transactionId: "seed-transaction"};
      }
    };

    const result = await runSeedCommand(commandEnvironment, {
      createClient: (configuration) => {
        clientConfiguration = configuration;
        return {transaction: () => transaction};
      },
      log: (message) => logs.push(message)
    });

    expect(clientConfiguration).toEqual({
      projectId: "mindful-builder",
      dataset: "development",
      apiVersion: "2026-10-10",
      token: "editor-secret-that-must-not-leak",
      useCdn: false
    });
    expect(committed).toBe(true);
    expect(written).toHaveLength(32);
    expect(result).toEqual({
      count: 32,
      ids: written.map((document) => document._id)
    });
    expect(logs).toHaveLength(1);
    expect(logs[0]).toContain("Seeded 32 demonstration documents");
    expect(logs[0]).toContain("demo-topic-business");
    expect(logs[0]).not.toContain(
      "editor-secret-that-must-not-leak"
    );
    expect(logs[0]).not.toContain("Systems, choices");
  });
});
