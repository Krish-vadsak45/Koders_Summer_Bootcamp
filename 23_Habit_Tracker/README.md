# Habit Tracker

A modern, feature-rich habit tracking application built with Next.js, TypeScript, and PrimeReact. Track your daily habits, visualize your progress with analytics, and maintain a history of your achievements.

## Features

- **Dashboard**: View all your habits at a glance with quick completion tracking
- **Habit Management**: Add, edit, and delete habits with custom icons and colors
- **Analytics**: Visual charts showing habit completion trends over time
- **History View**: Detailed history of each habit's completion records
- **Statistics**: Overview statistics including total habits, completion rates, and streaks
- **Data Export**: Export your habit data as JSON for backup or analysis
- **Local Storage**: All data is stored locally in your browser - no server required
- **Dark Mode**: Automatic dark mode support based on system preferences
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16.2.6
- **Language**: TypeScript 5.7.3
- **UI Library**: PrimeReact 10.9.8
- **Styling**: TailwindCSS 4.2.0
- **Icons**: PrimeIcons 7.0.0, Lucide React 1.16.0
- **Fonts**: Geist Sans & Geist Mono (Google Fonts)
- **Analytics**: Vercel Analytics (production only)

## Installation

1. Navigate to the project directory:
```bash
cd 23_Habit_Tracker
```

2. Install dependencies using pnpm:
```bash
pnpm install
```

## Usage

### Development

Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Create a production build:
```bash
pnpm build
```

### Start Production Server

Run the production build:
```bash
pnpm start
```

## Project Structure

```
23_Habit_Tracker/
├── app/
│   ├── globals.css          # Global styles and Tailwind configuration
│   ├── layout.tsx           # Root layout with metadata and fonts
│   └── page.tsx             # Main page component
├── components/
│   ├── HabitCard.tsx        # Individual habit display card
│   ├── HabitChart.tsx       # Analytics chart for habit progress
│   ├── HabitForm.tsx        # Form for adding/editing habits
│   ├── HabitTracker.tsx     # Main habit tracker component
│   ├── HistoryView.tsx      # Detailed history view for a habit
│   ├── Statistics.tsx       # Overview statistics component
│   └── ui/                  # Reusable UI components
├── lib/
│   └── habitUtils.ts        # Utility functions for habit storage
├── types/
│   └── habit.ts             # TypeScript types for habits
├── public/                  # Static assets (icons, images)
└── package.json             # Dependencies and scripts
```

## How It Works

### Data Storage
All habit data is stored in the browser's localStorage using the `habitUtils.ts` utility functions. This ensures:
- Data persists across browser sessions
- No server or database required
- Complete privacy - data never leaves your device

### Habit Structure
Each habit contains:
- `id`: Unique identifier
- `name`: Habit name
- `icon`: PrimeIcon class for display
- `color`: Custom color for the habit
- `completions`: Array of completion dates
- `createdAt`: Creation timestamp

### Key Components

- **HabitTracker**: Main component managing state and tabs
- **HabitForm**: Modal form for creating/editing habits
- **HabitCard**: Displays individual habit with completion toggle
- **HabitChart**: Visualizes completion trends using charts
- **HistoryView**: Shows detailed completion history
- **Statistics**: Displays overall habit statistics

## Features in Detail

### Dashboard Tab
- View all habits in card format
- Quick completion toggle for today
- Edit and delete habits
- Visual indicators for completion status

### Analytics Tab
- Visual charts for each habit
- Track completion trends over time
- Identify patterns in your behavior

### History Tab
- Select a habit to view detailed history
- See all completion dates
- Navigate back to habit list

### Settings Tab
- Export habit data as JSON
- Clear all data (with confirmation)
- View app information

## Customization

### Adding New Icons
The app uses PrimeIcons. You can find available icons at [PrimeIcons Documentation](https://primereact.org/icons/).

### Color Customization
Habits support custom colors. When creating a habit, you can choose from a predefined color palette or add your own.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Privacy

- All data is stored locally in your browser
- No data is sent to any server
- No tracking or analytics in development mode
- Vercel Analytics enabled in production mode only

## License

This project is part of the Koders Summer Bootcamp.

## Author

Built as part of the Koders Summer Bootcamp curriculum.
