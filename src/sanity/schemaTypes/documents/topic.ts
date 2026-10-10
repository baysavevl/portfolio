import {defineField, defineType} from "sanity";

import {topicKeys} from "@/lib/content/types";
import {
  validateTopicAccent,
  validateTopicKey
} from "@/sanity/schemaTypes/validation";

const topicTitles = {
  business: "Business",
  leadership: "Leadership",
  startup: "Startup",
  technology: "Technology",
  product: "Product",
  sport: "Sport",
  mindfulness: "Mindfulness"
} satisfies Record<(typeof topicKeys)[number], string>;

export const topicType = defineType({
  name: "topic",
  title: "Topic",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Stable key",
      type: "string",
      options: {
        list: topicKeys.map((value) => ({
          title: topicTitles[value],
          value
        }))
      },
      validation: (rule) => [
        rule.required(),
        rule.custom(validateTopicKey),
        rule.custom(async (value, context) => {
          if (!value || !context.document?._id) {
            return true;
          }

          const publishedId = context.document._id.replace(/^drafts\./, "");
          const draftId = "drafts." + publishedId;
          const duplicates = await context
            .getClient({apiVersion: "2026-10-10"})
            .fetch<number>(
              'count(*[_type == "topic" && key == $key && !(_id in [$publishedId, $draftId])])',
              {key: value, publishedId, draftId}
            );

          return duplicates === 0 ? true : "Topic key must be unique";
        })
      ]
    }),
    defineField({
      name: "labels",
      title: "Labels",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "string",
          validation: (rule) => rule.required().min(1)
        }),
        defineField({
          name: "vi",
          title: "Tiếng Việt",
          type: "string",
          validation: (rule) => rule.required().min(1)
        })
      ],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "descriptions",
      title: "Descriptions",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required().min(1)
        }),
        defineField({
          name: "vi",
          title: "Tiếng Việt",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required().min(1)
        })
      ],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "accent",
      title: "Accent",
      type: "string",
      options: {
        list: [
          {title: "Field blue", value: "field-blue"},
          {title: "Quiet sage", value: "quiet-sage"},
          {title: "Graphite", value: "graphite"}
        ],
        layout: "radio"
      },
      validation: (rule) => [
        rule.required(),
        rule.custom(validateTopicAccent)
      ]
    })
  ],
  preview: {
    select: {
      title: "labels.en",
      subtitle: "labels.vi"
    }
  }
});
