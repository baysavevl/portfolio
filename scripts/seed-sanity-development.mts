import {pathToFileURL} from "node:url";
import {createClient as createSanityClient} from "next-sanity";

import {
  demoPosts,
  demoProfiles,
  demoProjects,
  demoResumes,
  demoSettings,
  demoTopics
} from "../src/lib/content/demo/data";
import {getPublicSanityEnv} from "../src/sanity/env/public";

type SeedEnvironment = {
  [key: string]: string | undefined;
  NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
  NEXT_PUBLIC_SANITY_DATASET?: string;
  NEXT_PUBLIC_SANITY_API_VERSION?: string;
  ALLOW_DEMO_SEED?: string;
  SANITY_API_WRITE_TOKEN?: string;
};

function missingOrInvalid(variable: keyof SeedEnvironment): Error {
  return new Error(`${variable} is missing or invalid.`);
}

export function assertSeedAllowed(
  env: SeedEnvironment = process.env
): void {
  if (env.NEXT_PUBLIC_SANITY_DATASET?.trim() !== "development") {
    throw missingOrInvalid("NEXT_PUBLIC_SANITY_DATASET");
  }

  if (env.ALLOW_DEMO_SEED !== "true") {
    throw missingOrInvalid("ALLOW_DEMO_SEED");
  }

  if (!env.SANITY_API_WRITE_TOKEN?.trim()) {
    throw missingOrInvalid("SANITY_API_WRITE_TOKEN");
  }
}

export type SeedDocument = {
  _id: string;
  _type: string;
  [key: string]: unknown;
};

type Locale = "en" | "vi";

const locales: Locale[] = ["en", "vi"];

function stableKey(value: string): string {
  let hash = 2166136261;

  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36).padStart(8, "0").slice(-8);
}

function reference(_ref: string, _key?: string) {
  return {
    ...(_key ? {_key} : {}),
    _type: "reference",
    _ref
  };
}

function topicDocuments(): SeedDocument[] {
  return demoTopics.en.map((topic) => {
    const vietnamese = demoTopics.vi.find(
      (candidate) => candidate.key === topic.key
    );

    if (!vietnamese) {
      throw new Error(`Missing Vietnamese demonstration topic: ${topic.key}.`);
    }

    return {
      _id: `demo-topic-${topic.key}`,
      _type: "topic",
      key: topic.key,
      labels: {en: topic.label, vi: vietnamese.label},
      descriptions: {
        en: topic.description,
        vi: vietnamese.description
      },
      accent: topic.accent
    };
  });
}

function profileDocuments(): SeedDocument[] {
  return locales.map((locale) => {
    const profile = demoProfiles[locale];

    return {
      _id: `demo-profile-${locale}`,
      _type: "profile",
      language: locale,
      name: profile.name,
      descriptor: profile.descriptor,
      positioning: profile.positioning,
      introduction: profile.introduction,
      heroInitialMode: profile.heroInitialMode,
      currentQuestions: profile.currentQuestions,
      principles: profile.principles.map((principle, index) => ({
        _key: stableKey(`profile:${locale}:principle:${index}`),
        _type: "principle",
        ...principle
      }))
    };
  });
}

function postDocuments(): SeedDocument[] {
  return demoPosts.map((post) => ({
    _id: `demo-${post.id}`,
    _type: "post",
    language: post.locale,
    slug: {_type: "slug", current: post.slug},
    title: post.title,
    summary: post.summary,
    body: post.body,
    topics: post.topics.map((topic) =>
      reference(`demo-topic-${topic}`, topic)
    ),
    featured: post.featured,
    publishedAt: post.publishedAt,
    isDemo: true,
    seo: post.seo
  }));
}

function projectDocuments(): SeedDocument[] {
  return demoProjects.map((project) => ({
    _id: `demo-${project.id}`,
    _type: "project",
    language: project.locale,
    slug: {_type: "slug", current: project.slug},
    title: project.title,
    summary: project.summary,
    topics: project.topics.map((topic) =>
      reference(`demo-topic-${topic}`, topic)
    ),
    context: project.context,
    role: project.role,
    decisions: project.decisions,
    outcome: project.outcome,
    reflection: project.reflection,
    featured: project.featured,
    dateRange: project.locale === "vi" ? "Minh hoạ" : "Demonstration",
    sortOrder:
      demoProjects
        .filter((candidate) => candidate.locale === project.locale)
        .findIndex((candidate) => candidate.id === project.id) + 1,
    isDemo: true,
    seo: project.seo
  }));
}

function resumeDocuments(): SeedDocument[] {
  return locales.map((locale) => {
    const resume = demoResumes[locale];

    return {
      _id: `demo-resume-${locale}`,
      _type: "resumeAsset",
      language: locale,
      summary: resume.summary,
      capabilities: resume.capabilities
    };
  });
}

function settingsDocuments(): SeedDocument[] {
  return locales.map((locale) => {
    const settings = demoSettings[locale];
    const featuredPost = demoPosts.find(
      (post) => post.locale === locale && post.featured
    );
    const featuredProjects = demoProjects.filter(
      (project) => project.locale === locale && project.featured
    );

    return {
      _id: `demo-site-settings-${locale}`,
      _type: "siteSettings",
      language: locale,
      footerNote: settings.footerNote,
      socialLinks: settings.socialLinks,
      contactLinks: settings.contactLinks,
      ...(featuredPost
        ? {featuredPost: reference(`demo-${featuredPost.id}`)}
        : {}),
      featuredProjects: featuredProjects.map((project) =>
        reference(`demo-${project.id}`, project.translationGroup)
      ),
      seo: settings.seo
    };
  });
}

function translationMetadata(
  id: string,
  schemaType: string,
  references: Record<Locale, string>
): SeedDocument {
  return {
    _id: id,
    _type: "translation.metadata",
    schemaTypes: [schemaType],
    translations: locales.map((language) => ({
      _key: stableKey(`${id}:${language}`),
      _type: "internationalizedArrayReferenceValue",
      language,
      value: reference(references[language])
    }))
  };
}

function pairedTranslationDocuments(): SeedDocument[] {
  const documents = [
    translationMetadata("demo-translation-site-settings", "siteSettings", {
      en: "demo-site-settings-en",
      vi: "demo-site-settings-vi"
    }),
    translationMetadata("demo-translation-profile", "profile", {
      en: "demo-profile-en",
      vi: "demo-profile-vi"
    }),
    translationMetadata("demo-translation-resume", "resumeAsset", {
      en: "demo-resume-en",
      vi: "demo-resume-vi"
    })
  ];

  for (const translationGroup of new Set(
    demoPosts.map((post) => post.translationGroup)
  )) {
    const english = demoPosts.find(
      (post) =>
        post.translationGroup === translationGroup && post.locale === "en"
    );
    const vietnamese = demoPosts.find(
      (post) =>
        post.translationGroup === translationGroup && post.locale === "vi"
    );

    if (english && vietnamese) {
      documents.push(
        translationMetadata(
          `demo-translation-post-${translationGroup}`,
          "post",
          {en: `demo-${english.id}`, vi: `demo-${vietnamese.id}`}
        )
      );
    }
  }

  for (const translationGroup of new Set(
    demoProjects.map((project) => project.translationGroup)
  )) {
    const english = demoProjects.find(
      (project) =>
        project.translationGroup === translationGroup &&
        project.locale === "en"
    );
    const vietnamese = demoProjects.find(
      (project) =>
        project.translationGroup === translationGroup &&
        project.locale === "vi"
    );

    if (english && vietnamese) {
      documents.push(
        translationMetadata(
          `demo-translation-project-${translationGroup}`,
          "project",
          {en: `demo-${english.id}`, vi: `demo-${vietnamese.id}`}
        )
      );
    }
  }

  return documents;
}

export function buildSeedDocuments(): SeedDocument[] {
  return [
    ...topicDocuments(),
    ...profileDocuments(),
    ...postDocuments(),
    ...projectDocuments(),
    ...resumeDocuments(),
    ...settingsDocuments(),
    ...pairedTranslationDocuments()
  ];
}

type SeedClientConfiguration = {
  projectId: string;
  dataset: string;
  apiVersion: string;
  token: string;
  useCdn: false;
};

type SeedTransaction = {
  createOrReplace(document: SeedDocument): SeedTransaction;
  commit(): Promise<unknown>;
};

type SeedClient = {
  transaction(): SeedTransaction;
};

type SeedCommandDependencies = {
  createClient(configuration: SeedClientConfiguration): SeedClient;
  log(message: string): void;
};

export type SeedResult = {
  count: number;
  ids: string[];
};

const defaultDependencies: SeedCommandDependencies = {
  createClient: (configuration) =>
    createSanityClient(configuration) as unknown as SeedClient,
  log: (message) => console.log(message)
};

export async function runSeedCommand(
  env: SeedEnvironment = process.env,
  dependencies: SeedCommandDependencies = defaultDependencies
): Promise<SeedResult> {
  assertSeedAllowed(env);

  const publicEnvironment = getPublicSanityEnv({
    NEXT_PUBLIC_SANITY_PROJECT_ID: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION: env.NEXT_PUBLIC_SANITY_API_VERSION
  });
  const token = env.SANITY_API_WRITE_TOKEN?.trim();

  if (!token) {
    throw missingOrInvalid("SANITY_API_WRITE_TOKEN");
  }

  const client = dependencies.createClient({
    ...publicEnvironment,
    token,
    useCdn: false
  });
  const documents = buildSeedDocuments();
  const transaction = client.transaction();

  for (const document of documents) {
    transaction.createOrReplace(document);
  }

  await transaction.commit();

  const result = {
    count: documents.length,
    ids: documents.map((document) => document._id)
  };

  dependencies.log(
    `Seeded ${result.count} demonstration documents:\n${result.ids.join("\n")}`
  );

  return result;
}

const isCommandEntryPoint =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCommandEntryPoint) {
  runSeedCommand().catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : "Sanity seed failed."
    );
    process.exitCode = 1;
  });
}
