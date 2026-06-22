type BlogBodyBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string };

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
      blocks.push({ type: "heading", text: line.slice(3).trim() });
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph(paragraphLines, blocks);
      flushList(listItems, blocks);
      blocks.push({ type: "subheading", text: line.slice(4).trim() });
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

export function BlogBody({ body }: { body: string }) {
  const blocks = parseBlogBody(body);
  return (
    <div className="blog-body">
      {blocks.map((block, index) => {
        if (block.type === "heading") return <h2 key={index}>{block.text}</h2>;
        if (block.type === "subheading") return <h3 key={index}>{block.text}</h3>;
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
