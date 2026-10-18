import "server-only";

import type {QueryParams} from "next-sanity";
import {draftMode} from "next/headers";

import {getServerSanityEnv} from "@/sanity/env/server";
import {getSanityClient} from "@/sanity/lib/client";
import {buildFetchPolicy} from "@/sanity/lib/fetch-policy";

export type SanityQueryRunner = <T>(
  query: string,
  params: QueryParams,
  tags: string[]
) => Promise<T>;

function readToken(preview: boolean): string {
  try {
    const token = getServerSanityEnv().readToken;

    if (!token) {
      throw new Error(
        preview
          ? "Preview authorization is not configured"
          : "Sanity read authorization is not configured"
      );
    }

    return token;
  } catch (error) {
    if (preview) {
      throw new Error("Preview authorization is not configured", {
        cause: error
      });
    }

    throw error;
  }
}

async function executeQuery<T>(
  query: string,
  params: QueryParams,
  tags: string[],
  preview: boolean
): Promise<T> {
  const token = readToken(preview);
  const client = getSanityClient().withConfig({token});

  return client.fetch<T>(query, params, buildFetchPolicy(preview, tags));
}

export const fetchSanityForRequest: SanityQueryRunner = async <T>(
  query: string,
  params: QueryParams,
  tags: string[]
) => {
  const {isEnabled} = await draftMode();
  return executeQuery<T>(query, params, tags, isEnabled);
};

export const fetchPublishedSanity: SanityQueryRunner = <T>(
  query: string,
  params: QueryParams,
  tags: string[]
) => executeQuery<T>(query, params, tags, false);
