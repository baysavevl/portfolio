import {defineArrayMember, defineField, defineType} from "sanity";

import {
  languageField,
  sortOrderField,
  visibilityField
} from "@/sanity/schemaTypes/fields";

export const experienceType = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "organization",
      title: "Organization",
      type: "string",
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string"
    }),
    defineField({
      name: "dateRange",
      title: "Date range",
      type: "string",
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "achievements",
      title: "Achievements",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
          validation: (rule) => rule.required().min(1)
        })
      ],
      validation: (rule) => rule.required()
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
      title: "role",
      organization: "organization",
      language: "language",
      visibility: "visibility"
    },
    prepare: ({title, organization, language, visibility}) => ({
      title,
      subtitle: [
        organization,
        language === "vi" ? "VI" : "EN",
        visibility === false ? "Hidden" : null
      ]
        .filter(Boolean)
        .join(" · ")
    })
  }
});
