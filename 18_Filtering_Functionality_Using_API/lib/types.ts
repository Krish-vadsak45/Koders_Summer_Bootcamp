export interface Genre {
  id: number
  name: string
}

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  original_language: string
  popularity: number
}

export interface MovieDetail extends Movie {
  runtime: number
  genres: Genre[]
  revenue: number
  budget: number
}

export interface MovieResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface GenresResponse {
  genres: Genre[]
}

export interface FilterOptions {
  genres: number[]
  yearRange: [number, number]
  rating: [number, number]
  languages: string[]
  sortBy: SortOption
  page: number
}

export type SortOption =
  | 'popularity.desc'
  | 'popularity.asc'
  | 'rating.desc'
  | 'rating.asc'
  | 'release_date.desc'
  | 'release_date.asc'
