import {StudioSetupRequired} from "@/components/sanity/studio-setup-required";
import {readPublicSanityEnv} from "@/sanity/env/public";

export default async function StudioPage() {
  const environment = readPublicSanityEnv();

  if (!environment.success) {
    if (process.env.NODE_ENV === "production") {
      throw environment.error;
    }

    return <StudioSetupRequired variables={environment.error.variables} />;
  }

  const {Studio} = await import("@/components/sanity/studio");
  return <Studio />;
}
