import {defineConfig} from "sanity";
import {structureTool} from "sanity/structure";
import {readPublicSanityEnv} from "./src/sanity/env/public";

const publicEnvironment = readPublicSanityEnv();
const environment = publicEnvironment.success
  ? publicEnvironment.data
  : {
      projectId: "missing-project",
      dataset: "development",
      apiVersion: "2026-10-10"
    };

export default defineConfig({
  name: "vincent-portfolio",
  title: "Vincent Luu — The Mindful Builder",
  basePath: "/studio",
  projectId: environment.projectId,
  dataset: environment.dataset,
  plugins: [structureTool()],
  schema: {
    types: []
  }
});
