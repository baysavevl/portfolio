export type ContentSource = "demo" | "sanity";

type ContentSourceEnvironment = {
  [key: string]: string | undefined;
  CONTENT_SOURCE?: string;
};

export function resolveContentSource(
  env: ContentSourceEnvironment,
  nodeEnv: string | undefined
): ContentSource {
  const configuredSource = env.CONTENT_SOURCE?.trim();

  if (nodeEnv === "production") {
    if (configuredSource !== "sanity") {
      throw new Error(
        "Production content requires CONTENT_SOURCE=sanity."
      );
    }

    return "sanity";
  }

  if (!configuredSource) {
    return "demo";
  }

  if (configuredSource === "demo" || configuredSource === "sanity") {
    return configuredSource;
  }

  throw new Error(
    'Invalid CONTENT_SOURCE. Expected "demo" or "sanity".'
  );
}

export function getContentSource(): ContentSource {
  return resolveContentSource(process.env, process.env.NODE_ENV);
}
