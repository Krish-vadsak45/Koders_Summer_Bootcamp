import { cn } from "@/lib/utils";

interface StatsBarProps {
  wordCount: number;
  charCount: number;
  lineCount: number;
  className?: string;
}

export function StatsBar({ wordCount, charCount, lineCount, className }: StatsBarProps) {
  return (
    <div className={cn(
      "flex items-center gap-6 text-sm bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700",
      className
    )}>
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        <span className="font-semibold text-gray-700 dark:text-gray-300">Words:</span>
        <span className="font-bold text-gray-900 dark:text-white">{wordCount}</span>
      </span>
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        <span className="font-semibold text-gray-700 dark:text-gray-300">Characters:</span>
        <span className="font-bold text-gray-900 dark:text-white">{charCount}</span>
      </span>
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
        <span className="font-semibold text-gray-700 dark:text-gray-300">Lines:</span>
        <span className="font-bold text-gray-900 dark:text-white">{lineCount}</span>
      </span>
    </div>
  );
}
