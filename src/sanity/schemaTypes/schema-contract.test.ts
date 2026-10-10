import {describe, expect, it} from "vitest";

import {isSafeHref} from "@/lib/content/link";
import {topicKeys} from "@/lib/content/types";
import {documentInternationalizationConfig} from "@/sanity/i18n";
import {schemaTypes} from "@/sanity/schemaTypes";
import {structureGroups} from "@/sanity/structure";

type SchemaNode = {
  name: string;
  type: string;
  hidden?: boolean;
  readOnly?: boolean;
  initialValue?: unknown;
  validation?: unknown;
  fields?: SchemaNode[];
  of?: SchemaNode[];
  lists?: Array<{value: string}>;
  to?: Array<{type: string}>;
  options?: {
    filter?: unknown;
    list?: Array<{title: string; value: string}>;
  };
};

const definitions = schemaTypes as unknown as SchemaNode[];

function document(name: string): SchemaNode {
  const definition = definitions.find(
    (candidate) => candidate.type === "document" && candidate.name === name
  );

  if (!definition) {
    throw new Error("Missing document schema: " + name);
  }

  return definition;
}

function field(parent: SchemaNode, name: string): SchemaNode {
  const definition = parent.fields?.find(
    (candidate) => candidate.name === name
  );

  if (!definition) {
    throw new Error("Missing " + parent.name + "." + name);
  }

  return definition;
}

describe("Sanity schema contract", () => {
  it("registers the exact public authoring document types", () => {
    expect(
      definitions
        .filter((definition) => definition.type === "document")
        .map((definition) => definition.name)
        .sort()
    ).toEqual(
      [
        "education",
        "experience",
        "post",
        "profile",
        "project",
        "resumeAsset",
        "siteSettings",
        "topic"
      ].sort()
    );
  });

  it("keeps every localized document independently publishable", () => {
    const localizedTypes = [
      "siteSettings",
      "profile",
      "post",
      "project",
      "experience",
      "education",
      "resumeAsset"
    ];

    for (const typeName of localizedTypes) {
      const definition = document(typeName);
      const language = field(definition, "language");

      expect(language.type).toBe("string");
      expect(language.hidden).toBe(true);
      expect(language.readOnly).toBe(true);
      expect(
        definition.fields?.some((candidate) =>
          /translation|counterpart/i.test(candidate.name)
        )
      ).toBe(false);
    }
  });

  it("configures separate EN and VI documents without bulk publication", () => {
    expect(documentInternationalizationConfig).toMatchObject({
      supportedLanguages: [
        {id: "en", title: "English"},
        {id: "vi", title: "Tiếng Việt"}
      ],
      schemaTypes: [
        "siteSettings",
        "profile",
        "post",
        "project",
        "experience",
        "education",
        "resumeAsset"
      ],
      languageField: "language",
      bulkPublish: false,
      weakReferences: false,
      metadataOmnisearchVisibility: false
    });
    expect(documentInternationalizationConfig.schemaTypes).not.toContain(
      "topic"
    );
  });

  it("groups authoring areas without exposing translation metadata", () => {
    expect(structureGroups.map((group) => group.title)).toEqual([
      "Brand",
      "Writing",
      "Work",
      "Résumé",
      "Taxonomy"
    ]);
    expect(
      structureGroups.flatMap((group) =>
        group.types.map((entry) => entry.schemaType)
      )
    ).toEqual([
      "siteSettings",
      "profile",
      "post",
      "project",
      "resumeAsset",
      "experience",
      "education",
      "topic"
    ]);
    expect(JSON.stringify(structureGroups)).not.toContain(
      "translation.metadata"
    );
  });

  it("models topics once with bilingual copy and approved accents", () => {
    const topic = document("topic");
    const labels = field(topic, "labels");
    const descriptions = field(topic, "descriptions");

    expect(topic.fields?.some((candidate) => candidate.name === "language")).toBe(
      false
    );
    expect(field(topic, "key").options?.list?.map((option) => option.value)).toEqual(
      topicKeys
    );
    expect(labels.fields?.map((candidate) => candidate.name)).toEqual([
      "en",
      "vi"
    ]);
    expect(descriptions.fields?.map((candidate) => candidate.name)).toEqual([
      "en",
      "vi"
    ]);
    expect(
      field(topic, "accent").options?.list?.map((option) => option.value)
    ).toEqual(["field-blue", "quiet-sage", "graphite"]);
  });

  it("keeps editorial body and media types constrained", () => {
    const post = document("post");
    const project = document("project");
    const articleBody = definitions.find(
      (definition) => definition.name === "articleBody"
    );
    const block = articleBody?.of?.find(
      (member) => member.type === "block"
    ) as
      | (SchemaNode & {
          styles?: Array<{value: string}>;
          marks?: {
            decorators?: Array<{value: string}>;
            annotations?: SchemaNode[];
          };
        })
      | undefined;

    expect(field(post, "body").type).toBe("articleBody");
    expect(field(post, "coverImage").type).toBe("imageWithAlt");
    expect(field(project, "media").of?.map((member) => member.type)).toEqual([
      "imageWithAlt"
    ]);
    expect(block?.styles?.map((style) => style.value)).toEqual([
      "normal",
      "h2",
      "blockquote"
    ]);
    expect(
      block?.marks?.decorators?.map((decorator) => decorator.value)
    ).toEqual(["strong", "em"]);
    expect(
      block?.marks?.annotations?.map((annotation) => annotation.name)
    ).toEqual(["link"]);
    expect(block?.lists).toEqual([]);
  });

  it("provides every field required by the public domain model", () => {
    const expectedFields: Record<string, string[]> = {
      siteSettings: [
        "language",
        "footerNote",
        "socialLinks",
        "contactLinks",
        "featuredPost",
        "featuredProjects",
        "seo"
      ],
      profile: [
        "language",
        "name",
        "descriptor",
        "positioning",
        "introduction",
        "heroInitialMode",
        "currentQuestions",
        "principles"
      ],
      post: [
        "language",
        "slug",
        "title",
        "summary",
        "body",
        "topics",
        "coverImage",
        "featured",
        "publishedAt",
        "isDemo",
        "seo"
      ],
      project: [
        "language",
        "slug",
        "title",
        "summary",
        "topics",
        "context",
        "role",
        "decisions",
        "outcome",
        "reflection",
        "media",
        "links",
        "featured",
        "dateRange",
        "sortOrder",
        "isDemo",
        "seo"
      ],
      experience: [
        "language",
        "organization",
        "role",
        "location",
        "dateRange",
        "description",
        "achievements",
        "sortOrder",
        "visibility"
      ],
      education: [
        "language",
        "institution",
        "program",
        "dateRange",
        "notes",
        "sortOrder",
        "visibility"
      ],
      resumeAsset: [
        "language",
        "summary",
        "capabilities",
        "pdf",
        "pdfLabel",
        "effectiveDate"
      ]
    };

    for (const [typeName, expected] of Object.entries(expectedFields)) {
      expect(document(typeName).fields?.map((candidate) => candidate.name)).toEqual(
        expected
      );
    }
  });

  it("exposes the fields needed by home, profile, and résumé views", () => {
    const settings = document("siteSettings");
    const profile = document("profile");
    const experience = document("experience");
    const education = document("education");
    const resume = document("resumeAsset");

    expect(field(settings, "featuredPost").to?.map((target) => target.type)).toEqual([
      "post"
    ]);
    expect(
      field(settings, "featuredProjects").of?.[0]?.to?.map(
        (target) => target.type
      )
    ).toEqual(["project"]);
    expect(typeof field(settings, "featuredPost").options?.filter).toBe(
      "function"
    );
    expect(typeof field(settings, "featuredPost").validation).toBe(
      "function"
    );
    expect(typeof field(settings, "featuredProjects").validation).toBe(
      "function"
    );
    expect(field(profile, "heroInitialMode").type).toBe("string");
    expect(field(experience, "visibility").type).toBe("boolean");
    expect(field(education, "visibility").type).toBe("boolean");
    expect(field(resume, "pdf").type).toBe("file");
    expect(field(resume, "pdfLabel").type).toBe("string");
    expect(field(resume, "effectiveDate").type).toBe("date");
    expect(typeof field(resume, "pdfLabel").validation).toBe("function");
    expect(typeof field(resume, "effectiveDate").validation).toBe("function");
  });

  it("defaults demonstration flags to false", () => {
    for (const typeName of ["post", "project"]) {
      expect(field(document(typeName), "isDemo").initialValue).toBe(false);
    }
  });

  it.each([
    "https://vincentluu.com",
    "mailto:hello@vincentluu.com",
    "/en/writing"
  ])("accepts safe href %s", (href) => {
    expect(isSafeHref(href)).toBe(true);
  });

  it.each([
    "javascript:alert(1)",
    "data:text/html,unsafe",
    "ftp://files.example",
    "//malicious.example",
    "/\\malicious.example",
    "\\malicious.example",
    "https://user:password@example.com",
    "http://insecure.example",
    "writing/relative-without-root",
    ""
  ])("rejects unsafe href %s", (href) => {
    expect(isSafeHref(href)).toBe(false);
  });
});
