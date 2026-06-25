'use client'

import type { Movie } from '@/lib/types'
import { MovieCard } from './MovieCard'

interface MovieGridProps {
  movies: Movie[]
  isLoading: boolean
  error: string | null
}

export function MovieGrid({ movies, isLoading, error }: MovieGridProps) {
  if (error) {
    const isApiKeyError =
      error.includes('Invalid API key') ||
      error.includes('401') ||
      error.includes('api_key')
    return (
      <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--card)] py-12">
        <div className="text-center max-w-md">
          <p className="text-lg font-semibold text-[var(--card-foreground)]">
            {isApiKeyError ? 'API Key Configuration Issue' : 'Error Loading Movies'}
          </p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {isApiKeyError
              ? 'The TMDB API key is invalid or not properly configured. Please check your environment variables and ensure you have a valid API key from https://www.themoviedb.org/api'
              : error}
          </p>
          {isApiKeyError && (
            <p className="mt-3 text-xs text-[var(--muted-foreground)] bg-[var(--secondary)] p-2 rounded">
              Your API key should be a string like: 1a2b3c4d5e6f7g8h9i0j. If you provided a JWT token, you may need to get a different API key from TMDB.
            </p>
          )}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 auto-rows-max">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]"
          >
            <div className="aspect-[2/3] w-full animate-pulse bg-[var(--muted)]" />
            <div className="flex flex-1 flex-col gap-2 p-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--muted)]" />
              <div className="flex-1" />
              <div className="h-6 w-full animate-pulse rounded bg-[var(--muted)]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--card)] py-12">
        <div className="text-center">
          <p className="text-lg font-semibold text-[var(--card-foreground)]">
            No movies found
          </p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Try adjusting your filters
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 auto-rows-max">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
