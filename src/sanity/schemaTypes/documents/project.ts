import {defineArrayMember, defineField, defineType} from "sanity";

import {
  demonstrationField,
  featuredField,
  languageField,
  safeLinkArrayMember,
  seoField,
  slugField,
  sortOrderField
} from "@/sanity/schemaTypes/fields";

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    languageField,
    slugField,
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{type: "topic"}]
        })
      ],
      validation: (rule) => rule.required().min(1).unique()
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "decisions",
      title: "Key decisions",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
          validation: (rule) => rule.required().min(1)
        })
      ],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "outcome",
      title: "Outcome",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "reflection",
      title: "Reflection",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "array",
      of: [defineArrayMember({type: "imageWithAlt"})]
    }),
    defineField({
      name: "links",
      title: "Project links",
      type: "array",
      of: [safeLinkArrayMember()]
    }),
    featuredField,
    defineField({
      name: "dateRange",
      title: "Date range",
      type: "string",
      validation: (rule) => rule.required().min(1)
    }),
    sortOrderField,
    demonstrationField,
    seoField
  ],
  orderings: [
    {
      title: "Manual order",
      name: "sortOrderAsc",
      by: [{field: "sortOrder", direction: "asc"}]
    }
  ],
  preview: {
    select: {
      title: "title",
      language: "language",
      media: "media.0",
      dateRange: "dateRange",
      isDemo: "isDemo"
    },
    prepare: ({title, language, media, dateRange, isDemo}) => ({
      title,
      subtitle: [
        language === "vi" ? "VI" : "EN",
        dateRange,
        isDemo ? "Demonstration" : null
      ]
        .filter(Boolean)
        .join(" · "),
      media
    })
  }
});
