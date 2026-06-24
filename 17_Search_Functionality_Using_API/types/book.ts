export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
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

export interface BookSearchResponse {
  kind: string;
  totalItems: number;
  items: Book[];
}
