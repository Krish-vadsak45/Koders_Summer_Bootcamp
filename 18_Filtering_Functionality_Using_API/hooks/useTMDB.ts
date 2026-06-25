'use client'

import type { FilterOptions, Genre, Movie, MovieResponse } from '@/lib/types'
import { discoverMovies, getGenres } from '@/lib/tmdb'
import { YEAR_RANGE } from '@/lib/tmdb'
import { useEffect, useState } from 'react'

interface UseTMDBReturn {
  movies: Movie[]
  genres: Genre[]
  filters: FilterOptions
  setFilters: (filters: FilterOptions) => void
  isLoading: boolean
  error: string | null
  totalPages: number
  currentPage: number
}

export function useTMDB(): UseTMDBReturn {
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)

  const [filters, setFilters] = useState<FilterOptions>({
    genres: [],
    yearRange: [YEAR_RANGE.MIN, YEAR_RANGE.MAX],
    rating: [0, 10],
    languages: [],
    sortBy: 'popularity.desc',
    page: 1,
  })

  // Fetch genres on mount
  useEffect(() => {
    let isMounted = true

    const fetchGenres = async () => {
      try {
        const genresData = await getGenres()
        if (isMounted) {
          setGenres(
            Object.entries(genresData).map(([id, name]) => ({
              id: parseInt(id),
              name,
            }))
          )
        }
      } catch (err) {
        console.error('Failed to fetch genres:', err)
        if (isMounted) {
          setError('Failed to load genres')
        }
      }
    }

    fetchGenres()

    return () => {
      isMounted = false
    }
  }, [])

  // Fetch movies when filters change
  useEffect(() => {
    let isMounted = true

    const fetchMovies = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await discoverMovies(filters)

        if (isMounted) {
          setMovies(response.results)
          setTotalPages(response.total_pages)
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Failed to load movies'
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchMovies()

    return () => {
      isMounted = false
    }
  }, [filters])

  return {
    movies,
    genres,
    filters,
    setFilters,
    isLoading,
    error,
    totalPages,
    currentPage: filters.page,
  }
}
