import "server-only";

import {resolveContentSource} from "@/lib/content/source";

type ServerSanityEnvInput = {
  [key: string]: string | undefined;
  CONTENT_SOURCE?: string;
  SANITY_API_READ_TOKEN?: string;
  SANITY_API_WRITE_TOKEN?: string;
  SANITY_REVALIDATE_SECRET?: string;
};

export interface ServerSanityEnv {
  readToken: string | null;
  writeToken: string | null;
  revalidateSecret: string | null;
}

type RevalidationEnvInput = {
  [key: string]: string | undefined;
  SANITY_REVALIDATE_SECRET?: string;
};

function optionalValue(value: string | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function configurationError(variable: keyof ServerSanityEnvInput): Error {
  return new Error(`${variable} is missing or invalid.`);
}

function validatedSecret(value: string | undefined): string | null {
  const secret = optionalValue(value);
  return secret && secret.length >= 32 ? secret : null;
}

export function getServerSanityEnv(
  env: ServerSanityEnvInput = process.env,
  nodeEnv: string | undefined = process.env.NODE_ENV
): ServerSanityEnv {
  const source = resolveContentSource(env, nodeEnv);
  const readToken = optionalValue(env.SANITY_API_READ_TOKEN);
  const writeToken = optionalValue(env.SANITY_API_WRITE_TOKEN);
  const revalidateSecret = validatedSecret(env.SANITY_REVALIDATE_SECRET);

  if (source === "sanity" && !readToken) {
    throw configurationError("SANITY_API_READ_TOKEN");
  }

  if (source === "sanity" && nodeEnv === "production" && !revalidateSecret) {
    throw configurationError("SANITY_REVALIDATE_SECRET");
  }

  return {
    readToken,
    writeToken,
    revalidateSecret
  };
}

export function getRevalidationSecret(
  env: RevalidationEnvInput = process.env
): string {
  const secret = validatedSecret(env.SANITY_REVALIDATE_SECRET);

  if (!secret) {
    throw configurationError("SANITY_REVALIDATE_SECRET");
  }

  return secret;
}
