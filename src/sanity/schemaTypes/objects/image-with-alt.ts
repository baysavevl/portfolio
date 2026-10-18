import {defineField, defineType} from "sanity";

export const imageWithAltType = defineType({
  name: "imageWithAlt",
  title: "Accessible image",
  type: "image",
  options: {
    hotspot: true
  },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describe the image's meaning in the current language.",
      validation: (rule) =>
        rule.required().min(5).custom((value) => {
          const normalized = value?.trim().toLocaleLowerCase();
          return normalized && !["image", "photo", "picture"].includes(normalized)
            ? true
            : "Write meaningful alternative text"
        })
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string"
    })
  ],
  validation: (rule) => rule.required()
});
