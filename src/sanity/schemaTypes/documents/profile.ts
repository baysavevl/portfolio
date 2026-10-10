import {defineArrayMember, defineField, defineType} from "sanity";

import {languageField} from "@/sanity/schemaTypes/fields";
import {validateHeroInitialMode} from "@/sanity/schemaTypes/validation";

export const profileType = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      initialValue: "Vincent Luu",
      validation: (rule) =>
        rule.required().custom((value) =>
          value === "Vincent Luu" ? true : "Name must remain Vincent Luu"
        )
    }),
    defineField({
      name: "descriptor",
      title: "Descriptor",
      type: "string",
      initialValue: "The Mindful Builder",
      validation: (rule) =>
        rule.required().custom((value) =>
          value === "The Mindful Builder"
            ? true
            : "Descriptor must remain The Mindful Builder"
        )
    }),
    defineField({
      name: "positioning",
      title: "Positioning",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "heroInitialMode",
      title: "Initial hero mode",
      type: "string",
      initialValue: "split",
      options: {
        list: [
          {title: "Operator", value: "operator"},
          {title: "Observer", value: "observer"},
          {title: "Split", value: "split"}
        ],
        layout: "radio"
      },
      validation: (rule) => [
        rule.required(),
        rule.custom(validateHeroInitialMode)
      ]
    }),
    defineField({
      name: "currentQuestions",
      title: "Current questions",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
          validation: (rule) => rule.required().min(1)
        })
      ],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "principles",
      title: "Principles",
      type: "array",
      of: [
        defineArrayMember({
          name: "principle",
          title: "Principle",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required().min(1)
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required().min(1)
            })
          ]
        })
      ],
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      title: "name",
      language: "language"
    },
    prepare: ({title, language}) => ({
      title,
      subtitle: language === "vi" ? "Tiếng Việt" : "English"
    })
  }
});
