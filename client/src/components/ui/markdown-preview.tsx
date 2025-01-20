import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
}

export function MarkdownPreview({ content, className, ...props }: MarkdownPreviewProps) {
  return (
    <div 
      className={cn(
        "prose prose-slate dark:prose-invert max-w-none",
        "prose-headings:font-bold prose-headings:text-foreground",
        "prose-p:text-muted-foreground",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-code:text-foreground prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:py-0.5",
        "prose-pre:bg-muted prose-pre:text-foreground prose-pre:shadow-sm",
        "prose-ul:text-muted-foreground prose-ol:text-muted-foreground",
        "prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary",
        className
      )} 
      {...props}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeHighlight, { ignoreMissing: true }]]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}