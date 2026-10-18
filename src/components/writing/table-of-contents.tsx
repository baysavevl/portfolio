import type {RichTextBlock} from "@/lib/content/types";

export interface TableOfContentsItem {
  id: string;
  label: string;
  blockKey: string;
}

function toHeadingId(value: string): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "section";
}

export function getTableOfContentsItems(
  blocks: RichTextBlock[]
): TableOfContentsItem[] {
  const collisions = new Map<string, number>();

  return blocks
    .filter((block) => block.style === "h2")
    .map((block) => {
      const label = block.children.map((span) => span.text).join("").trim();
      const baseId = toHeadingId(label);
      const count = (collisions.get(baseId) ?? 0) + 1;
      collisions.set(baseId, count);

      return {
        id: count === 1 ? baseId : `${baseId}-${count}`,
        label,
        blockKey: block._key
      };
    });
}

interface TableOfContentsProps {
  blocks: RichTextBlock[];
  label: string;
}

export function TableOfContents({blocks, label}: TableOfContentsProps) {
  const items = getTableOfContentsItems(blocks);

  if (items.length < 2) {
    return null;
  }

  return (
    <nav className="article-toc" aria-labelledby="article-toc-title">
      <p id="article-toc-title">{label}</p>
      <ol>
        {items.map((item) => (
          <li key={item.blockKey}>
            <a href={`#${item.id}`}>{item.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
