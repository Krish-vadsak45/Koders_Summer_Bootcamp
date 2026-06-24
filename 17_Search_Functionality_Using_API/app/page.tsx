"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/types/movie";
import { searchMovies } from "@/lib/tmdb-api";
import { SearchBar } from "@/components/SearchBar";
import { MovieCard } from "@/components/MovieCard";
import { MovieModal } from "@/components/MovieModal";
import { SearchHistory } from "@/components/SearchHistory";
import { Pagination } from "@/components/Pagination";
import { toast } from "sonner";
import { Film, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const RESULTS_PER_PAGE = 10;
const MAX_HISTORY_ITEMS = 10;

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentQuery, setCurrentQuery] = useState("");

  useEffect(() => {
    const savedHistory = localStorage.getItem("movieSearchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setCurrentQuery(query);
    setCurrentPage(1);
    setMovies([]);
    setTotalItems(0);

    try {
      const response = await searchMovies(query, 1, RESULTS_PER_PAGE);
      setMovies(response.items || []);
      setTotalItems(response.totalItems);

      // Update search history
      const newHistory = [query, ...searchHistory.filter((q) => q !== query)].slice(0, MAX_HISTORY_ITEMS);
      setSearchHistory(newHistory);
      localStorage.setItem("movieSearchHistory", JSON.stringify(newHistory));

      if (response.items && response.items.length > 0) {
        toast.success(`Found ${response.totalItems} movies`);
      } else {
        toast.info("No movies found for your search");
      }
    } catch (error) {
      toast.error("Failed to search movies. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    if (page === currentPage || isLoading) return;

    setIsLoading(true);
    setCurrentPage(page);

    try {
      const response = await searchMovies(currentQuery, page, RESULTS_PER_PAGE);
      setMovies(response.items || []);
      setTotalItems(response.totalItems);
    } catch (error) {
      toast.error("Failed to load page. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleHistorySelect = (query: string) => {
    handleSearch(query);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("movieSearchHistory");
  };

  const totalPages = Math.ceil(totalItems / RESULTS_PER_PAGE);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Movie Search
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover millions of movies using the TMDB API
          </p>
        </header>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {searchHistory.length > 0 && !currentQuery && (
          <SearchHistory
            history={searchHistory}
            onSelect={handleHistorySelect}
            onClear={handleClearHistory}
          />
        )}

        {isLoading && (
          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">Searching for movies...</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && movies.length === 0 && !currentQuery && (
          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mb-6">
                <Film className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 text-center font-medium">
                Search for movies by title, director, or keywords... to get started
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && movies.length === 0 && currentQuery && (
          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-6">
                <Film className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 text-center font-medium">
                No movies found for "{currentQuery}"
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Try a different search term
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && movies.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {Math.min((currentPage - 1) * RESULTS_PER_PAGE + 1, totalItems)}-{Math.min(currentPage * RESULTS_PER_PAGE, totalItems)} of {totalItems} movies
              </p>
            </div>
            <div className="flex flex-wrap m-4 gap-6 mb-8">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={() => handleMovieClick(movie)} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </>
        )}

        <MovieModal
            movie={selectedMovie}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedMovie(null);
            }}
          />
      </div>
    </main>
  );
}
