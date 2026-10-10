import {defineArrayMember, defineField, defineType} from "sanity";

import {
  demonstrationField,
  featuredField,
  languageField,
  seoField,
  slugField
} from "@/sanity/schemaTypes/fields";

export const postType = defineType({
  name: "post",
  title: "Post",
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
      name: "body",
      title: "Body",
      type: "articleBody"
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
      name: "coverImage",
      title: "Cover image",
      type: "imageWithAlt"
    }),
    featuredField,
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required()
    }),
    demonstrationField,
    seoField
  ],
  orderings: [
    {
      title: "Publication date, newest",
      name: "publishedAtDesc",
      by: [{field: "publishedAt", direction: "desc"}]
    }
  ],
  preview: {
    select: {
      title: "title",
      language: "language",
      media: "coverImage",
      publishedAt: "publishedAt",
      isDemo: "isDemo"
    },
    prepare: ({title, language, media, publishedAt, isDemo}) => ({
      title,
      subtitle: [
        language === "vi" ? "VI" : "EN",
        publishedAt ? new Date(publishedAt).toLocaleDateString("en-GB") : null,
        isDemo ? "Demonstration" : null
      ]
        .filter(Boolean)
        .join(" · "),
      media
    })
  }
});
