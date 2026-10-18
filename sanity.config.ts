import {documentInternationalization} from "@sanity/document-internationalization";
import {defineConfig} from "sanity";
import {structureTool} from "sanity/structure";
import {visionTool} from "@sanity/vision";
import {readPublicSanityEnv} from "./src/sanity/env/public";
import {documentInternationalizationConfig} from "./src/sanity/i18n";
import {schemaTypes} from "./src/sanity/schemaTypes";
import {structure} from "./src/sanity/structure";

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
  plugins: [
    structureTool({structure}),
    documentInternationalization(documentInternationalizationConfig),
    ...(process.env.NODE_ENV === "production"
      ? []
      : [visionTool({defaultApiVersion: environment.apiVersion})])
  ],
  schema: {
    types: schemaTypes
  }
});
