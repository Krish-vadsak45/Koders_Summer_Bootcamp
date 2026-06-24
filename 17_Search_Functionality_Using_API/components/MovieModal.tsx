"use client";

import { Movie } from "@/types/movie";
import { X, Calendar, User, Building, ExternalLink, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieModal({ movie, isOpen, onClose }: MovieModalProps) {
  if (!movie || !isOpen) return null;

  const { title, authors, publisher, publishedDate, description, imageLinks, pageCount, categories, language, previewLink, infoLink } = movie.volumeInfo;
  const thumbnail = imageLinks?.thumbnail || imageLinks?.smallThumbnail;

  const handleCopyDetails = () => {
    const details = `${title}\n${authors ? `By: ${authors.join(", ")}` : ""}\n${publisher ? `Publisher: ${publisher}` : ""}\n${publishedDate ? `Published: ${publishedDate}` : ""}`;
    navigator.clipboard.writeText(details);
    toast.success("Movie details copied to clipboard");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        <CardHeader className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10 flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl">Movie Details</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-48 h-72 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden shadow-lg flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                {thumbnail ? (
                  <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <ExternalLink className="w-20 h-20 text-gray-400" />
                )}
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">{title}</h3>
                {authors && authors.length > 0 && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {authors.join(", ")}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {publisher && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{publisher}</span>
                  </div>
                )}
                {publishedDate && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{publishedDate}</span>
                  </div>
                )}
                {pageCount && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{pageCount} pages</span>
                  </div>
                )}
                {language && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <span className="font-medium">Language: {language.toUpperCase()}</span>
                  </div>
                )}
              </div>
              {categories && categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge key={category} variant="default" className="text-sm">{category}</Badge>
                  ))}
                </div>
              )}
              {description && (
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{description}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-3 pt-2">
                {previewLink && (
                  <a href={previewLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Preview
                  </a>
                )}
                {infoLink && (
                  <a href={infoLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 h-10 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-50">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    More Info
                  </a>
                )}
                <Button variant="outline" onClick={handleCopyDetails}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Details
                </Button>
              </div>
            </div>
          </div>
</CardContent>
        </Card>
      </div>
  );
}
