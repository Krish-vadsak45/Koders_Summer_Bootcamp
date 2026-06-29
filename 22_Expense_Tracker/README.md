# Expense Tracker

A modern, feature-rich expense tracking application built with Next.js, React, and PrimeReact. Track your expenses, visualize spending patterns, and manage your budget efficiently.

## Features

- **Expense Management**: Add, edit, and delete expenses with ease
- **Category Organization**: 8 pre-defined categories with icons (Food, Transportation, Entertainment, Utilities, Healthcare, Shopping, Bills, Other)
- **Data Persistence**: All expenses are saved to localStorage
- **Search & Filter**: Search by description and filter by category
- **Analytics Dashboard**:
  - Doughnut chart for category distribution
  - Bar chart for monthly trends
  - Detailed category breakdown
- **Summary View**: Monthly summaries and quick statistics
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and PrimeReact components

## Tech Stack

- **Framework**: Next.js 16.2.6
- **UI Library**: PrimeReact 10.9.8
- **Styling**: Tailwind CSS 4.2.0
- **Charts**: Chart.js 4.5.1 with react-chartjs-2
- **Icons**: PrimeIcons
- **Language**: TypeScript

## Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd 22_Expense_Tracker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Build

Build the application for production:
```bash
npm run build
```

## Deployment

This project is configured to deploy on GitHub Pages. The build output is set to the `out` directory.

To deploy:
1. Build the project:
   ```bash
   npm run build
   ```
2. The static files will be in the `out` directory
3. Configure your GitHub repository settings to use the `out` folder as the source for GitHub Pages

## Project Structure

```
22_Expense_Tracker/
├── app/
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/
│   ├── ExpenseTracker.tsx # Main expense tracker component
│   └── ui/               # UI components
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Usage

1. **Add Expense**: Click the "Add Expense" button and fill in the details (description, amount, category, date)
2. **Edit Expense**: Click the pencil icon on any expense row to edit it
3. **Delete Expense**: Click the trash icon on any expense row to delete it (with confirmation)
4. **Filter**: Use the search bar to find expenses by description or the dropdown to filter by category
5. **View Analytics**: Switch to the "Analytics" tab to see visual representations of your spending
6. **View Summary**: Check the "Summary" tab for monthly breakdowns and quick stats

## Data Storage

All expense data is stored in the browser's localStorage, ensuring your data persists between sessions. No backend or database is required.

## License

This project is part of the Summer Bootcamp program.
