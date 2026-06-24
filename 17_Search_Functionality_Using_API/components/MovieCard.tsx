"use client";

import { Movie } from "@/types/movie";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, Calendar, User } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const { title, authors, publishedDate, imageLinks } = movie.volumeInfo;
  const thumbnail = imageLinks?.thumbnail || imageLinks?.smallThumbnail;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group cursor-pointer hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 overflow-hidden border",
        "hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 w-[calc(25%-18px)] rounded-xl shadow-md"
      )}
    >
      <div className="aspect-[2/3] w-full flex items-center justify-center overflow-hidden relative bg-gray-100 dark:bg-gray-900">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <Film className="w-12 h-12 mb-2" />
            <span className="text-xs">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-xs font-medium line-clamp-2">{title}</p>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors min-h-[2.5rem]">
          {title}
        </h3>
        {publishedDate && (
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs font-normal bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <Calendar className="w-3 h-3 mr-1.5" />
              {new Date(publishedDate).getFullYear()}
            </Badge>
            <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
