import {defineCliConfig} from "sanity/cli";
import {getPublicSanityEnv} from "./src/sanity/env/public";

const environment = getPublicSanityEnv();

export default defineCliConfig({
  api: {
    projectId: environment.projectId,
    dataset: environment.dataset
  }
});
