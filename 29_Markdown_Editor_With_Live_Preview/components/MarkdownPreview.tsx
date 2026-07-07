import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

interface MarkdownPreviewProps {
  content: string;
  darkMode: boolean;
  className?: string;
}

export function MarkdownPreview({ content, darkMode, className }: MarkdownPreviewProps) {
  return (
    <div
      id="markdown-preview"
      className={cn(
        "prose dark:prose-invert max-w-none p-6 overflow-auto",
        "prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-6",
        "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
        "prose-p:mb-4 prose-p:leading-relaxed",
        "prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4",
        "prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4",
        "prose-li:mb-1",
        "prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400",
        "prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
        "prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto",
        "prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline",
        "prose-img:rounded-lg prose-img:shadow-md",
        "prose-table:border-collapse prose-table:w-full prose-table:mb-4",
        "prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600 prose-th:p-2 prose-th:bg-gray-50 dark:prose-th:bg-gray-800",
        "prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600 prose-td:p-2",
        "prose-hr:border-gray-300 dark:prose-hr:border-gray-600 prose-hr:my-8",
        className
      )}
    >
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={darkMode ? oneDark : oneLight}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
