import {defineField, defineType} from "sanity";

import {
  languageField,
  sortOrderField,
  visibilityField
} from "@/sanity/schemaTypes/fields";

export const educationType = defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "institution",
      title: "Institution",
      type: "string",
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "program",
      title: "Program",
      type: "string",
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "dateRange",
      title: "Date range",
      type: "string",
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 3
    }),
    sortOrderField,
    visibilityField
  ],
  orderings: [
    {
      title: "Résumé order",
      name: "sortOrderAsc",
      by: [{field: "sortOrder", direction: "asc"}]
    }
  ],
  preview: {
    select: {
      title: "program",
      institution: "institution",
      language: "language",
      visibility: "visibility"
    },
    prepare: ({title, institution, language, visibility}) => ({
      title,
      subtitle: [
        institution,
        language === "vi" ? "VI" : "EN",
        visibility === false ? "Hidden" : null
      ]
        .filter(Boolean)
        .join(" · ")
    })
  }
});
