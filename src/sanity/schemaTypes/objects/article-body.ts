import {defineArrayMember, defineType} from "sanity";

import {safeLinkAnnotation} from "@/sanity/schemaTypes/fields";

export const articleBodyType = defineType({
  name: "articleBody",
  title: "Article body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        {title: "Paragraph", value: "normal"},
        {title: "Heading 2", value: "h2"},
        {title: "Quote", value: "blockquote"}
      ],
      lists: [],
      marks: {
        decorators: [
          {title: "Strong", value: "strong"},
          {title: "Emphasis", value: "em"}
        ],
        annotations: [safeLinkAnnotation]
      }
    })
  ],
  validation: (rule) => rule.required().min(1)
});
