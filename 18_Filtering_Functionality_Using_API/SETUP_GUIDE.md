# Movie Discovery Application - Setup Guide

## Overview

This is a modern, responsive movie filtering application built with Next.js 16, TypeScript, and Tailwind CSS. It uses the TMDB (The Movie Database) API to fetch real movie data with advanced filtering capabilities.

## Features

- **Advanced Filtering**: Filter movies by:
  - Genre (20+ genres from TMDB)
  - Release year range (1950-2027)
  - Rating range (0-10)
  - Original language (10 popular languages)
  - Sorting options (popularity, rating, release date)

- **Responsive Design**: 
  - 5-column grid on desktop (xl)
  - 3-column grid on large screens (lg)
  - 2-column grid on tablets (sm)
  - Single column on mobile

- **Performance Optimized**:
  - Client-side data fetching (no server overhead)
  - Smooth filtering and pagination
  - Image lazy loading via Next.js Image component
  - Skeleton loading states

- **Clean Architecture**:
  - Separate concerns with components, hooks, utilities, and types
  - TypeScript for maintainability
  - Reusable filter and grid components
  - Custom `useTMDB` hook for data management

## Getting a TMDB API Key

1. Visit [https://www.themoviedb.org/api](https://www.themoviedb.org/api)
2. Click "Click here" to access the documentation
3. Register for a free TMDB account or sign in
4. Go to your account settings → API
5. Copy your **API Key (v3 auth)** - it should look like: `1a2b3c4d5e6f7g8h9i0j` (alphanumeric string)
6. **Important**: Make sure you're copying the **API Key**, not the Bearer token or Access Token

## Environment Setup

1. Open the v0 project settings (top right)
2. Go to **Settings** → **Vars**
3. Add a new environment variable:
   - **Key**: `NEXT_PUBLIC_TMDB_API_KEY`
   - **Value**: Paste your TMDB API key from step 5 above
4. Save and the app will automatically reload

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Design system with color tokens
├── components/
│   ├── MovieCard.tsx       # Individual movie card
│   ├── MovieGrid.tsx       # Grid layout with loading/error states
│   └── FilterPanel.tsx     # Advanced filter controls
├── hooks/
│   └── useTMDB.ts          # Custom hook for TMDB API calls
├── lib/
│   ├── tmdb.ts             # TMDB API utilities
│   └── types.ts            # TypeScript interfaces
└── SETUP_GUIDE.md          # This file
```

## Component Breakdown

### MovieCard
- Displays individual movie with poster, title, year, rating, and overview
- Hover effects for better interactivity
- Language badge for original language
- Responsive image with fallback

### MovieGrid
- Responsive grid layout (5 columns on desktop)
- Loading skeleton states
- Error handling with helpful messages
- Empty state messaging

### FilterPanel
- Organized filter controls
- Mobile-responsive (collapsible on small screens)
- Real-time filtering with debouncing
- Reset button to clear all filters

### useTMDB Hook
- Manages all TMDB API interactions
- Handles genres fetching
- Manages filter state
- Error and loading states
- Automatic data refetch on filter changes

## Key Features Explained

### Filtering Logic

The app uses TMDB's `/discover/movie` endpoint with these parameters:

- `with_genres`: Comma-separated genre IDs
- `vote_average.gte/lte`: Rating range
- `primary_release_date.gte/lte`: Year range
- `with_original_language`: Language codes
- `sort_by`: Sort option (popularity, rating, release date)

### Design System

The app uses CSS custom properties for theming:

- **Light Mode**:
  - Background: White (`#ffffff`)
  - Foreground: Dark gray (`#1a1a1a`)
  - Primary: Blue (`#0066cc`)

- **Dark Mode**:
  - Background: Near black (`#0f0f0f`)
  - Foreground: Off-white (`#fafafa`)
  - Primary: Light blue (`#3b82f6`)

### Movie Card Grid

The grid uses Tailwind's responsive classes:
- `sm:grid-cols-2` - 2 columns on mobile
- `lg:grid-cols-3` - 3 columns on large screens
- `xl:grid-cols-5` - 5 columns on extra-large screens

## Troubleshooting

### "API Key Configuration Issue"

This means your TMDB API key is invalid or missing. Solutions:

1. Check you copied the **API Key (v3 auth)** from TMDB (not Access Token)
2. Make sure `NEXT_PUBLIC_TMDB_API_KEY` is set in environment variables
3. Verify there are no extra spaces in the API key
4. Try generating a new key from TMDB dashboard

### No movies showing

1. Make sure API key is valid (check error message)
2. Try resetting filters by clicking the "Reset" button
3. Check browser console (F12) for any errors
4. Verify your TMDB account has API access enabled

### Images not loading

1. This is normal - TMDB updates movie data frequently
2. Some older movies may not have poster images
3. The app shows "No Image" placeholder when unavailable

## Development

To run the development server:

```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:3000`

## Production

To build for production:

```bash
npm run build
npm run start
```

The app is optimized for performance with:
- Turbopack bundler (default in Next.js 16)
- Image optimization
- CSS-in-JS with Tailwind
- Minimal JavaScript bundle

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Fetch API
- **State Management**: React Hooks
- **API**: TMDB API v3

## Notes

- The app is client-side only - all API calls go directly to TMDB
- No backend server needed
- API key is public (it's embedded in the frontend with `NEXT_PUBLIC_` prefix)
- TMDB API has rate limits (~40 requests/10 seconds)

## Support

For TMDB API documentation: https://www.themoviedb.org/settings/api
For Next.js documentation: https://nextjs.org/docs
