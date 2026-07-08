# Movie Discovery Application

A modern, responsive movie filtering application built with Next.js 16, TypeScript, and Tailwind CSS. Discover movies using the TMDB API with advanced filtering capabilities.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)

## Features

- **Advanced Filtering**
  - Filter by genre (20+ TMDB genres)
  - Filter by release year range (1950-2027)
  - Filter by rating range (0-10)
  - Filter by language (10 popular languages)
  - Sort by popularity, rating, or release date

- **Responsive Design**
  - 5-column grid on desktop (xl)
  - 3-column grid on large screens (lg)
  - 2-column grid on tablets (sm)
  - Single column on mobile
  - Mobile-responsive filter panel

- **User Experience**
  - Real-time filtering
  - Pagination with page indicator
  - Loading skeleton states
  - Error handling with helpful messages
  - Empty state messaging
  - Movie cards with poster, title, year, rating, and overview

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **API**: TMDB (The Movie Database)
- **State Management**: React Hooks
- **Images**: Next.js Image component

## Installation

1. Navigate to the project directory:
`ash
cd 18_Filtering_Functionality_Using_API
`

2. Install dependencies:
`ash
npm install
# or
pnpm install
`

3. Set up environment variables:
`ash
cp .env.example .env.local
`

4. Add your TMDB API key to .env.local:
`
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
`

5. Run the development server:
`ash
npm run dev
`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Getting a TMDB API Key

1. Go to [TMDB API](https://www.themoviedb.org/settings/api)
2. Sign up or log in to your account
3. Request an API Key (v3 auth)
4. Copy the key and add it to your .env.local file

## Project Structure

`
18_Filtering_Functionality_Using_API/
+-- app/
¦   +-- layout.tsx              # Root layout with metadata
¦   +-- page.tsx                # Main page component
¦   +-- globals.css             # Design system
+-- components/
¦   +-- MovieCard.tsx           # Individual movie card
¦   +-- MovieGrid.tsx           # Grid layout with states
¦   +-- FilterPanel.tsx         # Filter controls
+-- hooks/
¦   +-- useTMDB.ts              # Custom TMDB hook
+-- lib/
¦   +-- tmdb.ts                 # TMDB API utilities
¦   +-- types.ts                # TypeScript interfaces
+-- .github/
¦   +-- workflows/
¦       +-- deploy.yml          # GitHub Pages deployment
+-- next.config.mjs             # Next.js configuration
`

## Usage

### Filtering Movies

1. **Sort By**: Choose sorting preference (popularity, rating, release date)
2. **Genres**: Select genres from the checkbox list
3. **Release Year**: Use dual sliders to set year range
4. **Rating**: Use dual sliders to set rating range
5. **Languages**: Select languages from the checkbox list
6. **Reset**: Click  Reset Filters to clear all filters

### Viewing Movie Details

- Each movie card displays poster, title, year, rating, and overview
- Hover over cards for visual feedback

### Pagination

- Use Previous/Next buttons to navigate through results
- Page indicator shows current page

## Deployment

### GitHub Pages

The project is configured for GitHub Pages deployment:

1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. Select the gh-pages branch as the source
4. The GitHub Actions workflow will automatically build and deploy

The app will be available at:
`
https://yourusername.github.io/Summer-Bootcamp/18_Filtering_Functionality_Using_API/
`

### Manual Deployment

Build the project for production:
`ash
npm run build
`

The output will be in the out/ directory, ready for static hosting.

## Development

### Available Scripts

`ash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
`

## API Integration

The application uses the TMDB API endpoints:

- **Get Genres**: /genre/movie/list - Fetch available genres
- **Discover Movies**: /discover/movie - Fetch movies with filters

Rate limiting is handled automatically (~40 requests/10 seconds).

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational purposes. TMDB API data is subject to TMDB's terms of service.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie database API
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
