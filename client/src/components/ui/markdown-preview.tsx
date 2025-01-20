import { marked } from 'marked';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface MarkdownPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
}

export function MarkdownPreview({ content, className, ...props }: MarkdownPreviewProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    marked.parse(content, (err, result) => {
      if (!err && result) {
        setHtml(result);
      }
    });
  }, [content]);

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
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
}