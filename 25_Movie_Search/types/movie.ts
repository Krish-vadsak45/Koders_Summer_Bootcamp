export interface Movie {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[]; // directors or cast could be added later
    publisher?: string;
    publishedDate?: string; // release date
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    pageCount?: number;
    categories?: string[];
    language?: string;
    previewLink?: string;
    infoLink?: string;
  };
}

export interface MovieSearchResponse {
  kind: string;
  totalItems: number;
  items: Movie[];
}
