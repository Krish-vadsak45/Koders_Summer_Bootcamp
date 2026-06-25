'use client'

import type { Movie } from '@/lib/types'
import { getPosterUrl } from '@/lib/tmdb'
import Image from 'next/image'

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.poster_path, 300)
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A'

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] transition-all duration-200 hover:shadow-lg hover:border-[var(--primary)]">
      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[var(--muted)]">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            loading="eager"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm text-[var(--muted-foreground)]">
              No Image
            </span>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 backdrop-blur">
          <span className="text-xs font-semibold text-yellow-400">★</span>
          <span className="text-xs font-semibold text-white">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Movie Details */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold text-[var(--card-foreground)] leading-tight">
            {movie.title}
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            {releaseYear}
          </p>
        </div>

        <p className="line-clamp-3 flex-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
          {movie.overview || 'No overview available'}
        </p>

        {/* Language */}
        <div className="flex items-center gap-1">
          <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-[var(--primary)] text-[var(--primary-foreground)]">
            {movie.original_language.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
}
