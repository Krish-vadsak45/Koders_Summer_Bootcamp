import { Copy, Trash2, Download, FileText, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  onCopy: () => void;
  onClear: () => void;
  onExportHTML: () => void;
  onExportPDF: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  className?: string;
}

export function Toolbar({
  onCopy,
  onClear,
  onExportHTML,
  onExportPDF,
  darkMode,
  onToggleDarkMode,
  className,
}: ToolbarProps) {
  return (
    <div className={cn("flex items-center gap-3 flex-wrap", className)}>
      <button
        onClick={onCopy}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg text-sm font-medium"
        title="Copy to clipboard"
      >
        <Copy className="w-4 h-4" />
        <span className="hidden sm:inline">Copy</span>
      </button>
      <button
        onClick={onClear}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg text-sm font-medium"
        title="Clear editor"
      >
        <Trash2 className="w-4 h-4" />
        <span className="hidden sm:inline">Clear</span>
      </button>
      <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />
      <button
        onClick={onExportHTML}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg text-sm font-medium"
        title="Export as HTML"
      >
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">HTML</span>
      </button>
      <button
        onClick={onExportPDF}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg text-sm font-medium"
        title="Export as PDF"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">PDF</span>
      </button>
      <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />
      <button
        onClick={onToggleDarkMode}
        className="p-2.5 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-md hover:shadow-lg"
        title="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-amber-500 dark:text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        )}
      </button>
    </div>
  );
}
