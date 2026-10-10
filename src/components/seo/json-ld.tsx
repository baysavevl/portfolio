import type {JsonLdData} from "@/lib/seo/structured-data";

interface JsonLdProps {
  data: JsonLdData;
}

export function JsonLd({data}: JsonLdProps) {
  const serialized = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: serialized}}
    />
  );
}
