# Signup Page

## Screenshots

*(Screenshots to be added)*

## Overview
A modern, animated signup page built with Next.js and Framer Motion. Features comprehensive form validation, password confirmation, Google OAuth integration, and a sleek animated gradient background. Designed as the day 20 task of the Summer Bootcamp.

## Features
- **Email Validation**: Validates email format with regex pattern
- **Username Validation**: Enforces 3-20 character limit with alphanumeric, underscore, and hyphen support
- **Password Validation**: Minimum 8 character requirement
- **Confirm Password**: Real-time password matching validation
- **Google OAuth Integration**: One-click Google sign-up button
- **Animated Background**: Smooth gradient animations with floating elements
- **Form Validation**: Real-time error messages for each field
- **Loading States**: Animated loading spinner during form submission
- **Responsive Design**: Fully optimized for desktop and mobile screens
- **Modern UI**: Glassmorphism effects with gradient borders and hover animations

## Tech Stack
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Framer Motion (Animations)
- react-icons (Icons)
- @vercel/analytics

## Local Setup
1. Navigate to the project directory:
   ```bash
   cd 20_Signup_Page
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build
```bash
npm run build
```

## Deployment
This project is configured for GitHub Pages deployment. The deployment workflow is included in the repository's `.github/workflows/deploy_all.yml`.

To deploy manually:
1. Build the project with `GITHUB_PAGES=true`:
```bash
GITHUB_PAGES=true npm run build
```
2. The static files will be in the `out/` directory
3. Upload to GitHub Pages or your preferred hosting service
