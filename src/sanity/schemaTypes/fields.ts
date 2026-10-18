import {defineArrayMember, defineField} from "sanity";
import {isSafeHref} from "@/lib/content/link";

export const languageField = defineField({
  name: "language",
  title: "Language",
  type: "string",
  readOnly: true,
  hidden: true,
  validation: (rule) =>
    rule.required().custom((value) =>
      value === "en" || value === "vi"
        ? true
        : "Language must be en or vi"
    )
});

export const slugField = defineField({
  name: "slug",
  title: "Slug",
  type: "slug",
  options: {
    source: "title",
    maxLength: 96
  },
  validation: (rule) => rule.required()
});

export const seoField = defineField({
  name: "seo",
  title: "Search and sharing",
  type: "seo",
  validation: (rule) => rule.required()
});

export const featuredField = defineField({
  name: "featured",
  title: "Featured",
  type: "boolean",
  description: "Makes this entry eligible for featured placement.",
  initialValue: false,
  validation: (rule) => rule.required()
});

export const sortOrderField = defineField({
  name: "sortOrder",
  title: "Sort order",
  type: "number",
  initialValue: 100,
  validation: (rule) => rule.required().integer().min(0)
});

export const demonstrationField = defineField({
  name: "isDemo",
  title: "Demonstration content",
  type: "boolean",
  description:
    "Keep enabled for illustrative records that do not describe verified personal history.",
  initialValue: false,
  validation: (rule) => rule.required()
});

export const visibilityField = defineField({
  name: "visibility",
  title: "Visible on the public résumé",
  type: "boolean",
  initialValue: true,
  validation: (rule) => rule.required()
});

export const safeHrefField = defineField({
  name: "href",
  title: "Destination",
  type: "string",
  validation: (rule) =>
    rule.required().custom((value) =>
      isSafeHref(value)
        ? true
        : "Use https:, mailto:, or a root-relative path"
    )
});

export const safeLinkAnnotation = defineArrayMember({
  name: "link",
  title: "Safe link",
  type: "object",
  fields: [safeHrefField]
});

export function safeLinkArrayMember() {
  return defineArrayMember({
    name: "link",
    title: "Link",
    type: "object",
    fields: [
      defineField({
        name: "label",
        title: "Label",
        type: "string",
        validation: (rule) => rule.required().min(1)
      }),
      safeHrefField
    ],
    preview: {
      select: {
        title: "label",
        subtitle: "href"
      }
    }
  });
}
