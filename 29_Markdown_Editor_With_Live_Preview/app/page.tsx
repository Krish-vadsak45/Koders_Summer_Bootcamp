"use client";

import { useState, useEffect } from "react";
import { Toolbar } from "@/components/Toolbar";
import { StatsBar } from "@/components/StatsBar";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { storage } from "@/lib/storage";
import { exportAsHTML, exportAsPDF } from "@/lib/export";
import { toast } from "sonner";

const defaultMarkdown = `# Welcome to Markdown Editor

This is a **live preview** markdown editor. Start typing on the left and see the results on the right!

## Features

- Real-time markdown rendering
- Syntax highlighting for code blocks
- Export as HTML or PDF
- Dark/Light mode toggle
- Word, character, and line count
- Auto-save to local storage

## Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\`

## Lists

- Item 1
- Item 2
  - Nested item
- Item 3

1. First
2. Second
3. Third

## Blockquote

> This is a blockquote. It's great for highlighting important information.

## Links and Images

[Visit GitHub](https://github.com)

---

Happy writing! ✨
`;

export default function Home() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMarkdown = storage.getMarkdown();
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    }

    const savedDarkMode = storage.getDarkMode();
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    storage.setMarkdown(markdown);
  }, [markdown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    toast.success("Copied to clipboard!");
  };

  const handleClear = () => {
    setMarkdown("");
    toast.success("Editor cleared!");
  };

  const handleExportHTML = () => {
    const previewDiv = document.getElementById("markdown-preview");
    if (previewDiv) {
      exportAsHTML(markdown, previewDiv.innerHTML);
      toast.success("Exported as HTML!");
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportAsPDF("markdown-preview");
      toast.success("Exported as PDF!");
    } catch (error) {
      toast.error("Failed to export PDF");
    }
  };

  const handleToggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    storage.setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    toast.success(newMode ? "Dark mode enabled!" : "Light mode enabled!");
  };

  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const charCount = markdown.length;
  const lineCount = markdown.split("\n").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Markdown Editor
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                Real-time markdown editor with live preview
              </p>
            </div>
            <Toolbar
              onCopy={handleCopy}
              onClear={handleClear}
              onExportHTML={handleExportHTML}
              onExportPDF={handleExportPDF}
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
            />
          </div>
        </header>

        {/* Stats Bar */}
        <div className="mb-6">
          <StatsBar wordCount={wordCount} charCount={charCount} lineCount={lineCount} />
        </div>

        {/* Editor and Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-300px)] min-h-[500px]">
          {/* Editor */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                Editor
              </h2>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="flex-1 w-full p-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent font-mono text-sm text-gray-900 dark:text-gray-100 transition-all shadow-sm hover:shadow-md"
              placeholder="Start typing your markdown here..."
              spellCheck={false}
            />
          </div>

          {/* Preview */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                Preview
              </h2>
            </div>
            <div className="flex-1 w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-auto transition-all shadow-sm hover:shadow-md">
              <MarkdownPreview content={markdown} darkMode={darkMode} className="h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
