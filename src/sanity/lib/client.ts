import "server-only";

import {createClient, type SanityClient} from "next-sanity";

import {getPublicSanityEnv} from "@/sanity/env/public";

let client: SanityClient | null = null;

export function getSanityClient(): SanityClient {
  if (client) {
    return client;
  }

  const {apiVersion, dataset, projectId} = getPublicSanityEnv();
  client = createClient({
    apiVersion,
    dataset,
    projectId,
    useCdn: true,
    stega: {studioUrl: "/studio"}
  });

  return client;
}
