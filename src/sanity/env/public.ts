import {z} from "zod";

const publicSanityEnvSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  NEXT_PUBLIC_SANITY_DATASET: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9_-]+$/),
  NEXT_PUBLIC_SANITY_API_VERSION: z.iso.date()
});

export type PublicSanityVariable = keyof z.input<
  typeof publicSanityEnvSchema
>;

export interface PublicSanityEnv {
  projectId: string;
  dataset: string;
  apiVersion: string;
}

type PublicSanityEnvInput = Partial<
  Record<PublicSanityVariable, string | undefined>
>;

export class PublicSanityEnvError extends Error {
  readonly variables: PublicSanityVariable[];

  constructor(variables: PublicSanityVariable[]) {
    super(
      `Invalid or missing public Sanity configuration: ${variables.join(", ")}.`
    );
    this.name = "PublicSanityEnvError";
    this.variables = variables;
  }
}

export type PublicSanityEnvResult =
  | {success: true; data: PublicSanityEnv}
  | {success: false; error: PublicSanityEnvError};

function processPublicSanityEnv(): PublicSanityEnvInput {
  return {
    NEXT_PUBLIC_SANITY_PROJECT_ID:
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION:
      process.env.NEXT_PUBLIC_SANITY_API_VERSION
  };
}

export function readPublicSanityEnv(
  env: PublicSanityEnvInput = processPublicSanityEnv()
): PublicSanityEnvResult {
  const result = publicSanityEnvSchema.safeParse(env);

  if (!result.success) {
    const variables = Array.from(
      new Set(
        result.error.issues
          .map((issue) => issue.path[0])
          .filter(
            (value): value is PublicSanityVariable =>
              typeof value === "string" &&
              value in publicSanityEnvSchema.shape
          )
      )
    );

    return {
      success: false,
      error: new PublicSanityEnvError(variables)
    };
  }

  return {
    success: true,
    data: {
      projectId: result.data.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: result.data.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: result.data.NEXT_PUBLIC_SANITY_API_VERSION
    }
  };
}

export function hasPublicSanityEnv(env?: PublicSanityEnvInput): boolean {
  return readPublicSanityEnv(env).success;
}

export function getPublicSanityEnv(
  env?: PublicSanityEnvInput
): PublicSanityEnv {
  const result = readPublicSanityEnv(env);

  if (!result.success) {
    throw result.error;
  }

  return result.data;
}
