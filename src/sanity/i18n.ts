import type {PluginConfig} from "@sanity/document-internationalization";

export const localizedSchemaTypes = [
  "siteSettings",
  "profile",
  "post",
  "project",
  "experience",
  "education",
  "resumeAsset"
];

export const documentInternationalizationConfig = {
  supportedLanguages: [
    {id: "en", title: "English"},
    {id: "vi", title: "Tiếng Việt"}
  ],
  schemaTypes: localizedSchemaTypes,
  languageField: "language",
  bulkPublish: false,
  weakReferences: false,
  apiVersion: "2026-10-10",
  metadataOmnisearchVisibility: false
} satisfies PluginConfig;
