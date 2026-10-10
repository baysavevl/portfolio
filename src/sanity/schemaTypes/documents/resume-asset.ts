import {defineArrayMember, defineField, defineType} from "sanity";

import {languageField} from "@/sanity/schemaTypes/fields";

function hasPdf(document: Record<string, unknown> | undefined): boolean {
  const pdf = document?.pdf;

  if (!pdf || typeof pdf !== "object") {
    return false;
  }

  const asset = (pdf as {asset?: unknown}).asset;
  return Boolean(
    asset &&
      typeof asset === "object" &&
      typeof (asset as {_ref?: unknown})._ref === "string"
  );
}

export const resumeAssetType = defineType({
  name: "resumeAsset",
  title: "Résumé",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities",
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
      name: "pdf",
      title: "Résumé PDF",
      type: "file",
      options: {
        accept: "application/pdf"
      }
    }),
    defineField({
      name: "pdfLabel",
      title: "PDF link label",
      type: "string",
      validation: (rule) =>
        rule.custom((value, context) =>
          !hasPdf(context.document) ||
          (typeof value === "string" && value.trim().length > 0)
            ? true
            : "A PDF label is required when a PDF is uploaded"
        )
    }),
    defineField({
      name: "effectiveDate",
      title: "PDF effective date",
      type: "date",
      validation: (rule) =>
        rule.custom((value, context) =>
          !hasPdf(context.document) || Boolean(value)
            ? true
            : "An effective date is required when a PDF is uploaded"
        )
    })
  ],
  preview: {
    select: {
      language: "language",
      effectiveDate: "effectiveDate"
    },
    prepare: ({language, effectiveDate}) => ({
      title: language === "vi" ? "Résumé · Tiếng Việt" : "Résumé · English",
      subtitle: effectiveDate
        ? "PDF effective " + effectiveDate
        : "No PDF published"
    })
  }
});
