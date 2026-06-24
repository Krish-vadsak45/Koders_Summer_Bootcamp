import { Book, BookSearchResponse } from "@/types/book";

const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com/books/v1/volumes";

export async function searchBooks(
  query: string,
  startIndex: number = 0,
  maxResults: number = 10
): Promise<BookSearchResponse> {
  const url = `${GOOGLE_BOOKS_API_BASE}?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${maxResults}`;

  // Helper to retry on rate limiting (429)
  const fetchWithRetry = async (attempts: number = 3): Promise<Response> => {
    const res = await fetch(url);
    if (res.ok) return res;
    if (res.status === 429 && attempts > 0) {
      const retryAfter = res.headers.get('Retry-After');
      const delayMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : 1000 * Math.pow(2, 3 - attempts);
      await new Promise((r) => setTimeout(r, delayMs));
      return fetchWithRetry(attempts - 1);
    }
    throw new Error(`Failed to fetch books: ${res.statusText}`);
  };

  const response = await fetchWithRetry();

  return response.json();
}

export async function getBookById(bookId: string): Promise<Book> {
  const url = `${GOOGLE_BOOKS_API_BASE}/${bookId}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch book: ${response.statusText}`);
  }
  
  return response.json();
}
