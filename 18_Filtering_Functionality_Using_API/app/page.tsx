'use client'

import { FilterPanel } from '@/components/FilterPanel'
import { MovieGrid } from '@/components/MovieGrid'
import { useTMDB } from '@/hooks/useTMDB'

export default function Page() {
  const { movies, genres, filters, setFilters, isLoading, error, totalPages } =
    useTMDB()

  const handlePreviousPage = () => {
    if (filters.page > 1) {
      setFilters({ ...filters, page: filters.page - 1 })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNextPage = () => {
    if (filters.page < totalPages) {
      setFilters({ ...filters, page: filters.page + 1 })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)] sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--card-foreground)]">
              Discover Movies
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Filter and explore thousands of movies from TMDB
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Filters */}
          <FilterPanel
            genres={genres}
            filters={filters}
            onFilterChange={setFilters}
          />

          {/* Movies Grid */}
          <div className="flex-1">
            <MovieGrid
              movies={movies}
              isLoading={isLoading}
              error={error}
            />

            {/* Pagination */}
            {!isLoading && !error && movies.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={filters.page === 1}
                  className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] font-medium transition-colors hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="text-sm text-[var(--muted-foreground)]">
                  Page <span className="font-semibold">{filters.page}</span> of{' '}
                  <span className="font-semibold">{totalPages}</span>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={filters.page >= totalPages}
                  className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] font-medium transition-colors hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
