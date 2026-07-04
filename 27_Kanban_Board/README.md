# Kanban Board

## Screenshots

*Screenshots will be added here after capture*

## Overview

A modern, responsive Kanban board UI built with Next.js, React, and Tailwind CSS. This project demonstrates a clean implementation of a task management interface with drag-and-drop functionality using dummy data.

## Features

- **Three-column layout**: To Do, In Progress, and Done columns
- **Drag-and-drop functionality**: Move tasks between columns with visual feedback
- **Task cards with details**: Each card displays title, description, priority, and tags
- **Priority indicators**: Color-coded badges (High/Medium/Low priority)
- **Tag system**: Visual tags for task categorization
- **Responsive design**: Horizontal scroll on desktop, optimized for mobile
- **Toast notifications**: Feedback when tasks are moved between columns
- **Modern UI**: Clean design with gradient background and smooth transitions
- **Task counter**: Shows number of tasks in each column

## Tech Stack

- **Next.js 16.2.6** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **lucide-react** - Icon library
- **Custom components** - shadcn-style UI components

## Local Setup

1. Navigate to the project directory:
   ```bash
   cd 27_Kanban_Board
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Project Structure

```
27_Kanban_Board/
├── app/
│   ├── globals.css          # Global styles and Tailwind configuration
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page component
├── components/
│   ├── KanbanBoard.tsx      # Main board component with state management
│   ├── KanbanColumn.tsx     # Column component for task lists
│   ├── KanbanCard.tsx       # Individual task card component
│   └── ui/
│       ├── button.tsx       # Reusable button component
│       ├── toast.tsx        # Toast notification component
│       └── toaster.tsx      # Toast context and provider
├── lib/
│   └── utils.ts             # Utility functions (cn helper)
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── next.config.ts           # Next.js configuration
└── .gitignore               # Git ignore rules
```

## Usage

The Kanban board comes pre-loaded with dummy task data to demonstrate functionality:

1. **Drag and drop**: Click and hold on any task card to drag it
2. **Move between columns**: Drop the card on a different column to move it
3. **Visual feedback**: Columns highlight when dragging over them
4. **Toast notifications**: Success messages appear when tasks are moved

## Dummy Data

The board includes sample tasks across all three columns:
- **To Do**: Design System Setup, User Research, API Documentation
- **In Progress**: Dashboard Implementation, Database Schema
- **Done**: Project Setup, CI/CD Pipeline

Each task includes:
- Title and description
- Priority level (High/Medium/Low)
- Relevant tags

## Deployment

This project is ready for deployment on Vercel. To deploy:

1. Push the code to GitHub
2. Import the project in Vercel
3. Deploy with default settings

## Notes

- This is a UI-only implementation with dummy data
- No backend or database integration
- State is managed in-memory (resets on refresh)
- No authentication or user management
- Designed as a demonstration of modern React/Next.js patterns
