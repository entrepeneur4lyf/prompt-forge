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
        components={{
          pre: ({ node, ...props }) => (
            <pre className="overflow-auto p-4 rounded-lg bg-muted" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            if (inline) {
              return <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm" {...props}>{children}</code>;
            }
            return (
              <code
                className={cn(
                  "block p-4 overflow-x-auto font-mono text-sm leading-relaxed",
                  className
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-medium mt-4 mb-2" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mt-2 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mt-2 space-y-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}