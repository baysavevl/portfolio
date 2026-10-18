import {PortableText, type PortableTextComponents} from "@portabletext/react";
import {getTableOfContentsItems} from "@/components/writing/table-of-contents";
import {isSafeHref} from "@/lib/content/link";
import type {RichTextBlock} from "@/lib/content/types";

interface ArticleBodyProps {
  blocks: RichTextBlock[];
}

function reportUnsupported(kind: "block" | "mark" | "type", name?: string) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`Unsupported Portable Text ${kind}: ${name ?? "unknown"}`);
  }
}

export function ArticleBody({blocks}: ArticleBodyProps) {
  const headingIds = new Map(
    getTableOfContentsItems(blocks).map((item) => [item.blockKey, item.id])
  );
  const components: PortableTextComponents = {
    block: {
      normal: ({children}) => <p>{children}</p>,
      h2: ({children, value}) => (
        <h2
          id={headingIds.get(
            typeof value._key === "string" ? value._key : ""
          )}
        >
          {children}
        </h2>
      ),
      blockquote: ({children}) => <blockquote>{children}</blockquote>
    },
    marks: {
      strong: ({children}) => <strong>{children}</strong>,
      em: ({children}) => <em>{children}</em>,
      link: ({children, value}) => {
        const href = typeof value?.href === "string" ? value.href : "";

        if (!isSafeHref(href)) {
          reportUnsupported("mark", "unsafe-link");
          return null;
        }

        const external = href.startsWith("https://");
        return (
          <a href={href} rel={external ? "noreferrer" : undefined}>
            {children}
          </a>
        );
      }
    },
    unknownBlockStyle: ({value}) => {
      reportUnsupported("block", value.style);
      return null;
    },
    unknownMark: ({markType}) => {
      reportUnsupported("mark", markType);
      return null;
    },
    unknownType: ({value}) => {
      reportUnsupported(
        "type",
        typeof value._type === "string" ? value._type : undefined
      );
      return null;
    }
  };

  return (
    <div className="article-body reading-measure">
      <PortableText value={blocks} components={components} />
    </div>
  );
}
