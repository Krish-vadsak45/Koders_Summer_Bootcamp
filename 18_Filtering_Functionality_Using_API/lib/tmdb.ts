import type {
  Movie,
  MovieResponse,
  GenresResponse,
  FilterOptions,
} from './types'

const API_KEY = (process.env.NEXT_PUBLIC_TMDB_API_KEY || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDRjNWUzYjE0ZjY4Zjg2NDJjNTdjNTk3NTgyNDhkZSIsIm5iZiI6MTc0OTk4NDc2MC45OTUwMDAxLCJzdWIiOiI2ODRlYTVmODkzMzYwZTVjOTg1YzdkNDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Di7e80KGOjPjkRVzbgvfzxeOqnV9wV9dvKgkkIhdoHA').trim()
const BASE_URL = 'https://api.themoviedb.org/3'

if (!API_KEY) {
  console.error(
    'NEXT_PUBLIC_TMDB_API_KEY is not defined. Please set it in your environment variables.'
  )
}

interface FetchOptions {
  method?: string
  headers?: Record<string, string>
}

async function fetchTMDB<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.append('api_key', API_KEY || '')

  try {
    const response = await fetch(url.toString(), {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `[v0] TMDB API Error: ${response.status} ${response.statusText}`,
        errorText
      )
      throw new Error(
        `TMDB API error: ${response.status} ${response.statusText}`
      )
    }

    return response.json() as Promise<T>
  } catch (error) {
    console.error('[v0] TMDB Fetch Error:', error)
    throw error
  }
}

export async function getGenres(): Promise<Record<number, string>> {
  try {
    const data = await fetchTMDB<GenresResponse>('/genre/movie/list')
    const genreMap: Record<number, string> = {}
    data.genres.forEach((genre) => {
      genreMap[genre.id] = genre.name
    })
    return genreMap
  } catch (error) {
    console.error('Error fetching genres:', error)
    return {}
  }
}

export async function discoverMovies(
  filters: Partial<FilterOptions>
): Promise<MovieResponse> {
  try {
    const params = new URLSearchParams()

    params.append('page', String(filters.page || 1))

    // Add genre filter
    if (filters.genres && filters.genres.length > 0) {
      params.append('with_genres', filters.genres.join(','))
    }

    // Add rating filter (vote_average)
    if (filters.rating) {
      const [minRating, maxRating] = filters.rating
      if (minRating > 0) {
        params.append('vote_average.gte', String(minRating))
      }
      if (maxRating < 10) {
        params.append('vote_average.lte', String(maxRating))
      }
    }

    // Add language filter
    if (filters.languages && filters.languages.length > 0) {
      params.append('with_original_language', filters.languages.join('|'))
    }

    // Add year range filter
    if (filters.yearRange) {
      const [startYear, endYear] = filters.yearRange
      const startDate = `${startYear}-01-01`
      const endDate = `${endYear}-12-31`
      params.append('primary_release_date.gte', startDate)
      params.append('primary_release_date.lte', endDate)
    }

    // Add sorting
    if (filters.sortBy) {
      params.append('sort_by', filters.sortBy)
    }

    const response = await fetchTMDB<MovieResponse>(
      `/discover/movie?${params.toString()}`
    )
    return response
  } catch (error) {
    console.error('Error discovering movies:', error)
    throw error
  }
}

export async function searchMovies(query: string): Promise<MovieResponse> {
  try {
    const params = new URLSearchParams()
    params.append('query', query)
    params.append('page', '1')

    const response = await fetchTMDB<MovieResponse>(
      `/search/movie?${params.toString()}`
    )
    return response
  } catch (error) {
    console.error('Error searching movies:', error)
    throw error
  }
}

export function getPosterUrl(posterPath: string | null, width: number = 300) {
  if (!posterPath) {
    return null
  }
  return `https://image.tmdb.org/t/p/w${width}${posterPath}`
}

export function getBackdropUrl(backdropPath: string | null, width: number = 1280) {
  if (!backdropPath) {
    return null
  }
  return `https://image.tmdb.org/t/p/w${width}${backdropPath}`
}

export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ru', name: 'Russian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ko', name: 'Korean' },
]

export const YEAR_RANGE = {
  MIN: 1950,
  MAX: new Date().getFullYear() + 1,
}
