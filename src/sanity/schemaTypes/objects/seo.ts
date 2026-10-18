import {defineField, defineType} from "sanity";

export const seoType = defineType({
  name: "seo",
  title: "Search and sharing",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Aim for roughly 50–60 characters.",
      validation: (rule) => [
        rule.required(),
        rule.max(60).warning("Long titles may be truncated in search results.")
      ]
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Aim for roughly 140–160 characters.",
      validation: (rule) => [
        rule.required(),
        rule
          .max(160)
          .warning("Long descriptions may be truncated in search results.")
      ]
    })
  ]
});
