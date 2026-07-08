# Search Functionality Using API

A modern search application that demonstrates API integration with both Google Books API and TMDB (The Movie Database) API. Features include movie search, book search, search history, pagination, and detailed modal views with a beautiful responsive UI.

## Features

### 🎬 Movie Search
- Search millions of movies using TMDB API
- Real-time search with instant results
- Detailed movie information in modal view
- Movie posters and ratings
- Release date and overview
- Pagination support for large result sets

### 📚 Book Search
- Search books using Google Books API
- Book titles, authors, and descriptions
- Book cover thumbnails
- Detailed book information
- Pagination support

### 🔍 Search Features
- **Search History**: Automatically saves your last 10 searches
- **Quick History Access**: Click on history items to re-search
- **Clear History**: Option to clear search history
- **Local Storage Persistence**: Search history persists across sessions
- **Pagination**: Navigate through large result sets efficiently
- **Loading States**: Beautiful loading indicators during API calls
- **Error Handling**: Graceful error handling with toast notifications
- **Empty States**: Helpful empty state messages when no results found

### 🎨 UI/UX Features
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Beautiful Cards**: Card-based layout for movies and books
- **Modal Views**: Detailed information in elegant modal dialogs
- **Toast Notifications**: Success, error, and info notifications
- **Gradient Backgrounds**: Modern gradient backgrounds
- **Smooth Animations**: Smooth transitions and hover effects

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui-inspired components
- **Icons**: lucide-react
- **Notifications**: Sonner (toast notifications)
- **APIs**: 
  - TMDB API (The Movie Database)
  - Google Books API
- **State Management**: React hooks (useState, useEffect)
- **Storage**: LocalStorage API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- TMDB API key (free from [themoviedb.org](https://www.themoviedb.org/))

### Installation

1. Navigate to the project directory:
```bash
cd 17_Search_Functionality_Using_API
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your TMDB API key:
```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

To get a TMDB API key:
1. Go to [themoviedb.org](https://www.themoviedb.org/)
2. Sign up for a free account
3. Go to Settings > API
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
17_Search_Functionality_Using_API/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main search page
│   └── globals.css         # Global styles
├── components/
│   ├── MovieCard.tsx       # Movie card component
│   ├── MovieModal.tsx      # Movie detail modal
│   ├── BookCard.tsx        # Book card component
│   ├── BookModal.tsx       # Book detail modal
│   ├── SearchBar.tsx       # Search input component
│   ├── SearchHistory.tsx   # Search history component
│   ├── Pagination.tsx      # Pagination component
│   ├── ThemeToggle.tsx     # Theme toggle button
│   └── ui/                 # shadcn/ui-inspired components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── dialog.tsx
├── lib/
│   ├── tmdb-api.ts         # TMDB API integration
│   ├── google-books-api.ts # Google Books API integration
│   └── utils.ts            # Utility functions
├── types/
│   ├── movie.ts            # Movie type definitions
│   └── book.ts             # Book type definitions
├── .env.local              # Environment variables (not in git)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Features in Detail

### API Integration

**TMDB API**
- Search movies by title, keywords
- Retry logic for rate limiting (429 errors)
- Exponential backoff for retries
- Bearer token authentication
- Image URL construction for posters

**Google Books API**
- Search books by title, author, ISBN
- Retry logic for rate limiting
- Volume information retrieval
- Book cover thumbnails
- Detailed book metadata

### Search History
- Automatically saves last 10 searches
- Persists across browser sessions using localStorage
- Quick access to previous searches
- Clear history option
- Duplicate prevention

### Pagination
- Configurable results per page (default: 10)
- Page navigation with previous/next buttons
- Page number display
- Total results count
- Loading state during page changes

### Error Handling
- API key validation
- Network error handling
- Rate limit handling with retries
- User-friendly error messages
- Toast notifications for all states

### Responsive Design
- Mobile-first approach
- Flexible grid layout
- Touch-friendly interactions
- Adaptive card sizes
- Responsive typography

## API Keys

### TMDB API Key
Required for movie search functionality. Get your free API key from [themoviedb.org](https://www.themoviedb.org/).

### Google Books API
No API key required for basic search functionality (uses public API).

## Deployment

This project can be deployed to various platforms:

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

Remember to add your environment variables in Vercel dashboard:
- `NEXT_PUBLIC_TMDB_API_KEY`

### Other Platforms
Ensure you add the `NEXT_PUBLIC_TMDB_API_KEY` environment variable to your deployment platform.

## License

This project is part of the Koders Summer Bootcamp 2026.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Movie data provided by [TMDB](https://www.themoviedb.org/)
- Book data provided by [Google Books API](https://developers.google.com/books)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- Icons from [lucide-react](https://lucide.dev/)
- Toast notifications by [Sonner](https://sonner.emilkowalski.com/)
