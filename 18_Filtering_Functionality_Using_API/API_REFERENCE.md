# TMDB API Reference Guide

This document shows example API requests used by the Movie Discovery application.

## Base URL

```
https://api.themoviedb.org/3
```

## Endpoints Used

### 1. Get Genres

Fetches list of all movie genres from TMDB.

```bash
GET /genre/movie/list?api_key={API_KEY}
```

**Response Example:**
```json
{
  "genres": [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    }
  ]
}
```

### 2. Discover Movies

Fetches movies with advanced filtering options.

```bash
GET /discover/movie?api_key={API_KEY}&page=1&sort_by=popularity.desc&with_genres=28,12
```

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | integer | Page number for pagination | `1` |
| `sort_by` | string | Sort order | `popularity.desc`, `rating.desc`, `release_date.desc` |
| `with_genres` | string | Comma-separated genre IDs | `28,12,16` |
| `vote_average.gte` | float | Minimum rating | `7.0` |
| `vote_average.lte` | float | Maximum rating | `9.5` |
| `primary_release_date.gte` | date | Start release date | `2020-01-01` |
| `primary_release_date.lte` | date | End release date | `2024-12-31` |
| `with_original_language` | string | Language code(s) | `en`, `es`, `fr` (pipe-separated for multiple) |

**Response Example:**
```json
{
  "page": 1,
  "results": [
    {
      "adult": false,
      "backdrop_path": "/backdrop.jpg",
      "genre_ids": [28, 12, 878],
      "id": 123456,
      "original_language": "en",
      "original_title": "Example Movie",
      "overview": "An action-packed adventure...",
      "popularity": 892.5,
      "poster_path": "/poster.jpg",
      "release_date": "2023-05-15",
      "title": "Example Movie",
      "vote_average": 7.8,
      "vote_count": 2543
    }
  ],
  "total_pages": 45820,
  "total_results": 916400
}
```

### 3. Search Movies

Search for movies by title.

```bash
GET /search/movie?api_key={API_KEY}&query=Inception&page=1
```

**Response:** Same structure as Discover endpoint

## Example Requests Used by App

### Get Action Movies (2020+) Sorted by Popularity

```bash
GET /discover/movie?api_key={API_KEY}&with_genres=28&primary_release_date.gte=2020-01-01&sort_by=popularity.desc&page=1
```

### Get High-Rated English Movies

```bash
GET /discover/movie?api_key={API_KEY}&vote_average.gte=7.0&with_original_language=en&sort_by=rating.desc&page=1
```

### Get Movies by Release Year Range with Rating Filter

```bash
GET /discover/movie?api_key={API_KEY}&primary_release_date.gte=2010-01-01&primary_release_date.lte=2024-12-31&vote_average.gte=6.0&vote_average.lte=10.0&sort_by=release_date.desc&page=1
```

### Get Movies by Multiple Genres

```bash
GET /discover/movie?api_key={API_KEY}&with_genres=28,12,16&sort_by=popularity.desc&page=1
```

### Get Movies by Language

```bash
GET /discover/movie?api_key={API_KEY}&with_original_language=es&sort_by=popularity.desc&page=1
```

## Image URLs

TMDB provides poster and backdrop images at different widths.

### Poster Images
```
https://image.tmdb.org/t/p/w300{poster_path}   # 300px width
https://image.tmdb.org/t/p/w500{poster_path}   # 500px width (used in app)
https://image.tmdb.org/t/p/original{poster_path} # Original size
```

### Backdrop Images
```
https://image.tmdb.org/t/p/w1280{backdrop_path}  # 1280px width (used in app)
https://image.tmdb.org/t/p/original{backdrop_path} # Original size
```

**Example:**
```
Poster: https://image.tmdb.org/t/p/w300/rCzpDsMWWQeJmxvUPKu7F5wDv2J.jpg
Backdrop: https://image.tmdb.org/t/p/w1280/bnMEVBnKnJHxsAO0HaTOZiAU8f.jpg
```

## Sort Options

Available values for `sort_by` parameter:

| Value | Description |
|-------|-------------|
| `popularity.desc` | Most popular first |
| `popularity.asc` | Least popular first |
| `rating.desc` | Highest rated first |
| `rating.asc` | Lowest rated first |
| `release_date.desc` | Newest first |
| `release_date.asc` | Oldest first |

## Supported Languages

List of language codes used in filters:

| Code | Language |
|------|----------|
| `en` | English |
| `es` | Spanish |
| `fr` | French |
| `de` | German |
| `it` | Italian |
| `ja` | Japanese |
| `zh` | Chinese |
| `ru` | Russian |
| `pt` | Portuguese |
| `ko` | Korean |

## Rate Limiting

TMDB API has rate limits:
- ~40 requests per 10 seconds
- ~1,000 requests per day (for free tier)

The app uses client-side caching to minimize requests.

## Error Codes

| Status | Meaning | Solution |
|--------|---------|----------|
| 7 | Invalid API Key | Check API key is correct v3 API key, not Bearer token |
| 22 | Invalid Page | Use valid page number (1-max_pages) |
| 34 | Resource Not Found | Movie/genre ID doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded, wait before retrying |

## Implementation Details

### Fetch Function

```typescript
async function fetchTMDB<T>(endpoint: string): Promise<T> {
  const url = new URL(`https://api.themoviedb.org/3${endpoint}`)
  url.searchParams.append('api_key', process.env.NEXT_PUBLIC_TMDB_API_KEY)
  
  const response = await fetch(url.toString())
  
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`)
  }
  
  return response.json()
}
```

### Using Discover Endpoint

```typescript
const response = await fetchTMDB<MovieResponse>(
  `/discover/movie?page=1&sort_by=popularity.desc&with_genres=28`
)
```

## Useful Links

- **TMDB API Documentation**: https://www.themoviedb.org/settings/api
- **TMDB API V3 Docs**: https://developer.themoviedb.org/docs/getting-started
- **Movie Database**: https://www.themoviedb.org/
- **API Status**: https://www.themoviedb.org/status
