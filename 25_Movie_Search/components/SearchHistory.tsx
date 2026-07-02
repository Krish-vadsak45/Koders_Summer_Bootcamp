"use client";

import { Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchHistoryProps {
  history: string[];
  onSelect: (query: string) => void;
  onClear: () => void;
}

export function SearchHistory({ history, onSelect, onClear }: SearchHistoryProps) {
  if (history.length === 0) return null;

  const handleClear = () => {
    onClear();
    toast.success("Search history cleared");
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          Recent Searches
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 h-8"
        >
          <X className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((query, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-3 py-1.5"
            onClick={() => onSelect(query)}
          >
            {query}
          </Badge>
        ))}
      </div>
    </div>
  );
}
