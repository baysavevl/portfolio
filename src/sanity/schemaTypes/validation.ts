import type {ValidationContext} from "sanity";

type LocalizedDocument = {
  _id: string;
  language?: string;
};

const heroInitialModes = ["operator", "observer", "split"] as const;
const topicKeyValues = [
  "business",
  "leadership",
  "startup",
  "technology",
  "product",
  "sport",
  "mindfulness"
] as const;
const topicAccentValues = [
  "field-blue",
  "quiet-sage",
  "graphite"
] as const;

function validateAllowedValue(
  value: unknown,
  allowed: readonly string[],
  message: string
): true | string {
  return typeof value === "string" && allowed.includes(value)
    ? true
    : message;
}

export function validateHeroInitialMode(value: unknown): true | string {
  return validateAllowedValue(
    value,
    heroInitialModes,
    "Hero mode must be operator, observer, or split"
  );
}

export function validateTopicKey(value: unknown): true | string {
  return validateAllowedValue(
    value,
    topicKeyValues,
    "Choose an approved topic key"
  );
}

export function validateTopicAccent(value: unknown): true | string {
  return validateAllowedValue(
    value,
    topicAccentValues,
    "Choose an approved topic accent"
  );
}

function referenceIds(value: unknown): string[] | null {
  if (value === undefined || value === null) {
    return [];
  }

  const entries = Array.isArray(value) ? value : [value];
  const ids: string[] = [];

  for (const entry of entries) {
    if (
      !entry ||
      typeof entry !== "object" ||
      typeof (entry as {_ref?: unknown})._ref !== "string"
    ) {
      return null;
    }

    ids.push((entry as {_ref: string})._ref.replace(/^drafts\./, ""));
  }

  return Array.from(new Set(ids));
}

export async function validateReferencesMatchDocumentLanguage(
  value: unknown,
  context: ValidationContext
): Promise<true | string> {
  const ids = referenceIds(value);

  if (ids === null) {
    return "Every featured item must be a valid document reference";
  }

  if (ids.length === 0) {
    return true;
  }

  const language = context.document?.language;

  if (language !== "en" && language !== "vi") {
    return "Set the document language before selecting featured content";
  }

  const candidateIds = ids.flatMap((id) => [id, "drafts." + id]);

  try {
    const documents = await context
      .getClient({apiVersion: "2026-10-10"})
      .fetch<LocalizedDocument[]>(
        "*[_id in $ids]{_id, language}",
        {ids: candidateIds}
      );

    for (const id of ids) {
      const candidates = documents.filter(
        (document) => document._id.replace(/^drafts\./, "") === id
      );

      if (candidates.length === 0) {
        return "Unable to verify the selected featured content";
      }

      if (candidates.some((document) => document.language !== language)) {
        return "Featured content must use the same language as site settings";
      }
    }

    return true;
  } catch {
    return "Unable to verify the selected featured content";
  }
}
