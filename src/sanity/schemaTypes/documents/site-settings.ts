import {defineArrayMember, defineField, defineType} from "sanity";

import {
  languageField,
  safeLinkArrayMember,
  seoField
} from "@/sanity/schemaTypes/fields";
import {validateReferencesMatchDocumentLanguage} from "@/sanity/schemaTypes/validation";

function languageFilter(document: Record<string, unknown> | undefined) {
  return {
    filter: "language == $language",
    params: {
      language: typeof document?.language === "string" ? document.language : ""
    }
  };
}

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "footerNote",
      title: "Footer note",
      type: "string",
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [safeLinkArrayMember()],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "contactLinks",
      title: "Contact links",
      type: "array",
      of: [safeLinkArrayMember()],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "featuredPost",
      title: "Featured post",
      type: "reference",
      to: [{type: "post"}],
      options: {
        filter: ({document}) => languageFilter(document)
      },
      validation: (rule) =>
        rule.custom(validateReferencesMatchDocumentLanguage)
    }),
    defineField({
      name: "featuredProjects",
      title: "Featured projects",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{type: "project"}],
          options: {
            filter: ({document}) => languageFilter(document)
          }
        })
      ],
      validation: (rule) =>
        rule
          .unique()
          .custom(validateReferencesMatchDocumentLanguage)
    }),
    seoField
  ],
  preview: {
    select: {
      language: "language"
    },
    prepare: ({language}) => ({
      title: "Site settings",
      subtitle: language === "vi" ? "Tiếng Việt" : "English"
    })
  }
});
