import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { MarkdownPreview } from "@/components/ui/markdown-preview";

const MARKDOWN_EXAMPLE = `# Markdown Guide

## Basic Syntax

### Headings
# Heading 1
## Heading 2
### Heading 3

### Emphasis
*Italic text* or _italic text_
**Bold text** or __bold text__
***Bold and italic*** or ___bold and italic___

### Lists
Unordered:
* Item 1
* Item 2
  * Nested item
  * Another nested item

Ordered:
1. First item
2. Second item
   1. Nested item
   2. Another nested item

### Code
Inline code: \`console.log('Hello world!')\`

Code block:
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Links & Images
[Link text](https://example.com)
![Alt text](image-url.jpg)

### Blockquotes
> This is a blockquote
> It can span multiple lines
>
> And have multiple paragraphs

### Tables
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`;

export function MarkdownHelp() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Markdown help</span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-[600px] p-4" align="start">
        <div className="space-y-2">
          <h3 className="font-semibold">Markdown Formatting Guide</h3>
          <p className="text-sm text-muted-foreground">
            You can use Markdown to format your prompts. Here's a quick guide:
          </p>
          <div className="max-h-[400px] overflow-y-auto rounded border p-4">
            <MarkdownPreview content={MARKDOWN_EXAMPLE} />
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
