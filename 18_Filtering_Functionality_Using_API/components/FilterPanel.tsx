'use client'

import type { FilterOptions, Genre } from '@/lib/types'
import { AVAILABLE_LANGUAGES, YEAR_RANGE } from '@/lib/tmdb'
import { useState } from 'react'

interface FilterPanelProps {
  genres: Genre[]
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
}

export function FilterPanel({
  genres,
  filters,
  onFilterChange,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleGenreToggle = (genreId: number) => {
    const newGenres = filters.genres.includes(genreId)
      ? filters.genres.filter((id) => id !== genreId)
      : [...filters.genres, genreId]

    onFilterChange({ ...filters, genres: newGenres, page: 1 })
  }

  const handleYearChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isStart: boolean
  ) => {
    const value = parseInt(e.target.value)
    const [start, end] = filters.yearRange
    const newRange: [number, number] = isStart ? [value, end] : [start, value]
    onFilterChange({ ...filters, yearRange: newRange, page: 1 })
  }

  const handleRatingChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isMin: boolean
  ) => {
    const value = parseFloat(e.target.value)
    const [min, max] = filters.rating
    const newRange: [number, number] = isMin ? [value, max] : [min, value]
    onFilterChange({ ...filters, rating: newRange, page: 1 })
  }

  const handleLanguageToggle = (langCode: string) => {
    const newLanguages = filters.languages.includes(langCode)
      ? filters.languages.filter((code) => code !== langCode)
      : [...filters.languages, langCode]

    onFilterChange({ ...filters, languages: newLanguages, page: 1 })
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value as FilterOptions['sortBy'],
      page: 1,
    })
  }

  const handleReset = () => {
    onFilterChange({
      genres: [],
      yearRange: [YEAR_RANGE.MIN, YEAR_RANGE.MAX],
      rating: [0, 10],
      languages: [],
      sortBy: 'popularity.desc',
      page: 1,
    })
  }

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden mb-4 w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] font-medium transition-colors hover:bg-[var(--secondary)]"
      >
        {isOpen ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Filter Panel */}
      <aside
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 space-y-4`}
      >
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-[var(--card-foreground)]">
              Filters
            </h2>
            <button
              onClick={handleReset}
              className="text-xs px-2 py-1 rounded bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Sort By */}
          <div className="mb-4 pb-4 border-b border-[var(--border)]">
            <label className="mb-2 block text-sm font-medium text-[var(--card-foreground)]">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="popularity.asc">Least Popular</option>
              <option value="rating.desc">Highest Rated</option>
              <option value="rating.asc">Lowest Rated</option>
              <option value="release_date.desc">Newest</option>
              <option value="release_date.asc">Oldest</option>
            </select>
          </div>

          {/* Genres */}
          <div className="mb-4 pb-4 border-b border-[var(--border)]">
            <label className="mb-2 block text-sm font-medium text-[var(--card-foreground)]">
              Genres
            </label>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {genres.map((genre) => (
                <label
                  key={genre.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-[var(--secondary)] p-1 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.genres.includes(genre.id)}
                    onChange={() => handleGenreToggle(genre.id)}
                    className="w-4 h-4 rounded border-[var(--border)] cursor-pointer accent-[var(--primary)]"
                  />
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {genre.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Release Year Range */}
          <div className="mb-4 pb-4 border-b border-[var(--border)]">
            <label className="mb-3 block text-sm font-medium text-[var(--card-foreground)]">
              Release Year Range
            </label>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-[var(--muted-foreground)]">
                  From: {filters.yearRange[0]}
                </label>
                <input
                  type="range"
                  min={YEAR_RANGE.MIN}
                  max={YEAR_RANGE.MAX}
                  value={filters.yearRange[0]}
                  onChange={(e) => handleYearChange(e, true)}
                  className="w-full h-2 rounded appearance-none accent-[var(--primary)] cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted-foreground)]">
                  To: {filters.yearRange[1]}
                </label>
                <input
                  type="range"
                  min={YEAR_RANGE.MIN}
                  max={YEAR_RANGE.MAX}
                  value={filters.yearRange[1]}
                  onChange={(e) => handleYearChange(e, false)}
                  className="w-full h-2 rounded appearance-none accent-[var(--primary)] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Rating Range */}
          <div className="mb-4 pb-4 border-b border-[var(--border)]">
            <label className="mb-3 block text-sm font-medium text-[var(--card-foreground)]">
              Rating Range
            </label>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-[var(--muted-foreground)]">
                  Min: {filters.rating[0].toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={filters.rating[0]}
                  onChange={(e) => handleRatingChange(e, true)}
                  className="w-full h-2 rounded appearance-none accent-[var(--primary)] cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted-foreground)]">
                  Max: {filters.rating[1].toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={filters.rating[1]}
                  onChange={(e) => handleRatingChange(e, false)}
                  className="w-full h-2 rounded appearance-none accent-[var(--primary)] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--card-foreground)]">
              Languages
            </label>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {AVAILABLE_LANGUAGES.map((lang) => (
                <label
                  key={lang.code}
                  className="flex items-center gap-2 cursor-pointer hover:bg-[var(--secondary)] p-1 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.languages.includes(lang.code)}
                    onChange={() => handleLanguageToggle(lang.code)}
                    className="w-4 h-4 rounded border-[var(--border)] cursor-pointer accent-[var(--primary)]"
                  />
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {lang.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
