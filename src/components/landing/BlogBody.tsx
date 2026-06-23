type BlogBodyBlock =
  | { type: "heading"; text: string; id: string }
  | { type: "subheading"; text: string; id: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string };

export interface BlogBodyHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

function headingId(text: string, usedIds: Map<string, number>) {
  const base = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "section";
  const count = usedIds.get(base) ?? 0;
  usedIds.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

function flushParagraph(lines: string[], blocks: BlogBodyBlock[]) {
  if (lines.length === 0) return;
  blocks.push({ type: "paragraph", text: lines.join(" ") });
  lines.length = 0;
}

function flushList(items: string[], blocks: BlogBodyBlock[]) {
  if (items.length === 0) return;
  blocks.push({ type: "list", items: [...items] });
  items.length = 0;
}

function parseBlogBody(body: string): BlogBodyBlock[] {
  const blocks: BlogBodyBlock[] = [];
  const paragraphLines: string[] = [];
  const listItems: string[] = [];
  const usedHeadingIds = new Map<string, number>();

  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph(paragraphLines, blocks);
      flushList(listItems, blocks);
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph(paragraphLines, blocks);
      flushList(listItems, blocks);
      const text = line.slice(3).trim();
      blocks.push({ type: "heading", text, id: headingId(text, usedHeadingIds) });
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph(paragraphLines, blocks);
      flushList(listItems, blocks);
      const text = line.slice(4).trim();
      blocks.push({ type: "subheading", text, id: headingId(text, usedHeadingIds) });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph(paragraphLines, blocks);
      listItems.push(line.slice(2).trim());
      continue;
    }

    flushList(listItems, blocks);
    paragraphLines.push(line);
  }

  flushParagraph(paragraphLines, blocks);
  flushList(listItems, blocks);
  return blocks;
}

export function getBlogBodyHeadings(body: string): BlogBodyHeading[] {
  return parseBlogBody(body)
    .filter((block): block is Extract<BlogBodyBlock, { type: "heading" | "subheading" }> => block.type === "heading" || block.type === "subheading")
    .map((block) => ({
      id: block.id,
      text: block.text,
      level: block.type === "heading" ? 2 : 3
    }));
}

export function BlogBody({ body }: { body: string }) {
  const blocks = parseBlogBody(body);
  return (
    <div className="blog-body">
      {blocks.map((block, index) => {
        if (block.type === "heading") return <h2 id={block.id} key={index}>{block.text}</h2>;
        if (block.type === "subheading") return <h3 id={block.id} key={index}>{block.text}</h3>;
        if (block.type === "list") {
          return (
            <ul key={index}>
              {block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
            </ul>
          );
        }
        return <p key={index}>{block.text}</p>;
      })}
    </div>
  );
}
