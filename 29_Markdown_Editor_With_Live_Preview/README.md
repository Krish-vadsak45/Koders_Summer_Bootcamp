# Markdown Editor with Live Preview

A real-time markdown editor with live preview, syntax highlighting, and export capabilities.

## Features

- **Real-time Markdown Rendering**: Type markdown on the left and see the rendered preview on the right instantly
- **Syntax Highlighting**: Code blocks are highlighted with Prism.js themes (dark/light mode support)
- **Export Options**: Export your markdown as HTML or PDF files
- **Dark/Light Mode**: Toggle between dark and light themes with persistence
- **Word Count**: Real-time word, character, and line count statistics
- **Copy to Clipboard**: Quickly copy your markdown content
- **Clear Editor**: One-click clear to start fresh
- **Auto-save**: Content is automatically saved to local storage
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Next.js 16.2.6** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **react-markdown** - Markdown rendering
- **react-syntax-highlighter** - Code syntax highlighting
- **html2canvas** - HTML to canvas conversion for PDF export
- **jspdf** - PDF generation
- **sonner** - Toast notifications
- **lucide-react** - Icons

## Local Setup

1. Navigate to the project directory:
   ```bash
   cd 29_Markdown_Editor_With_Live_Preview
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Write Markdown**: Type your markdown content in the editor on the left
2. **Live Preview**: See the rendered output on the right in real-time
3. **Export**: Click the HTML or PDF buttons to export your content
4. **Copy**: Use the Copy button to copy markdown to clipboard
5. **Clear**: Use the Clear button to reset the editor
6. **Dark Mode**: Toggle the moon/sun icon to switch themes

## Project Structure

```
29_Markdown_Editor_With_Live_Preview/
├── app/
│   ├── layout.tsx          # Root layout with Toaster
│   ├── page.tsx            # Main editor component
│   └── globals.css         # Global styles
├── components/
│   ├── Toolbar.tsx         # Action buttons (copy, clear, export, dark mode)
│   ├── StatsBar.tsx        # Word/character/line count display
│   └── MarkdownPreview.tsx # Markdown rendering with syntax highlighting
├── lib/
│   ├── utils.ts            # Utility functions (cn helper)
│   ├── storage.ts          # Local storage helpers
│   └── export.ts           # HTML and PDF export functions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## Working Features

- Real-time markdown to HTML conversion
- Split-screen editor and preview layout
- Syntax highlighting for code blocks (multiple languages supported)
- Export as standalone HTML file with embedded styles
- Export as PDF using html2canvas and jspdf
- Dark/light mode toggle with localStorage persistence
- Word, character, and line count statistics
- Copy markdown to clipboard with toast notification
- Clear editor with confirmation toast
- Auto-save markdown content to localStorage
- Responsive design (stacked on mobile, side-by-side on desktop)
- Toast notifications for all user actions
