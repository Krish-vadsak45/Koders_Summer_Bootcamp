import { Book, BookSearchResponse } from "@/types/book";
import type { Movie, MovieSearchResponse } from "@/types/movie";

/**
 * TMDB API helper
 * Returns a BookSearchResponse compatible object.
 */
export async function searchMovies(
  query: string,
  page: number = 1,
  perPage: number = 10
): Promise<BookSearchResponse> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB API key is missing. Add NEXT_PUBLIC_TMDB_API_KEY to .env.local");
  }
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;

  // Retry on rate limiting (429)
  const fetchWithRetry = async (attempts: number = 3): Promise<Response> => {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    console.log("Response:", res);
    if (res.ok) return res;
    if (res.status === 429 && attempts > 0) {
      const retryAfter = res.headers.get('Retry-After');
      const delayMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : 1000 * Math.pow(2, 3 - attempts);
      await new Promise((r) => setTimeout(r, delayMs));
      return fetchWithRetry(attempts - 1);
    }
    throw new Error(`Failed to fetch movies: ${res.statusText}`);
  };

  const response = await fetchWithRetry();
  const data = await response.json();

  const items: Book[] = (data.results || []).map((m: any) => ({
    id: String(m.id),
    volumeInfo: {
      title: m.title ?? "",
      authors: [],
      description: m.overview,
      imageLinks: {
        thumbnail: m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : undefined,
        smallThumbnail: m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : undefined,
      },
      publishedDate: m.release_date,
    },
  }));

  return {
    kind: "tmdb#search",
    totalItems: data.total_results ?? 0,
    items,
  };
}
