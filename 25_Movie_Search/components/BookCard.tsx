"use client";

import { Book } from "@/types/book";
import { BookOpen, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export function BookCard({ book, onClick }: BookCardProps) {
  const { title, authors, publishedDate, imageLinks } = book.volumeInfo;
  const thumbnail = imageLinks?.thumbnail || imageLinks?.smallThumbnail;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden border-2",
        "hover:border-blue-400 dark:hover:border-blue-500"
      )}
    >
      <div className="aspect-[2/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden relative">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <BookOpen className="w-16 h-16 text-gray-400" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        {authors && authors.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-2">
            <User className="w-3.5 h-3.5" />
            <span className="line-clamp-1">{authors.join(", ")}</span>
          </p>
        )}
        {publishedDate && (
          <Badge variant="secondary" className="text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(publishedDate).getFullYear()}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
