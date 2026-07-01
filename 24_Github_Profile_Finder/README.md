# GitHub Profile Finder

A modern, responsive web application to search and explore GitHub user profiles, repositories, and statistics. Built with Next.js, TypeScript, and PrimeReact.

## Features

### 🔍 Search Functionality
- **Username Search**: Enter any GitHub username to fetch their profile
- **Real-time API Integration**: Direct connection to GitHub REST API
- **Error Handling**: Graceful error messages for invalid usernames or API limits
- **Loading States**: Beautiful loading indicators while fetching data

### 👤 Profile Header
- **User Avatar**: Display user's GitHub avatar with professional styling
- **Profile Info**: Full name, username, location, company, and availability status
- **Quick Stats**: At-a-glance followers, following, and repository counts
- **Action Buttons**: Direct links to view full profile on GitHub

### 📊 Statistics Cards
- **Public Repositories**: Total number of public repositories
- **Followers Count**: Number of GitHub followers
- **Following Count**: Number of users followed
- **Public Gists**: Number of public gists created
- **Color-coded Icons**: Each stat has a unique color for easy visual identification

### 📚 Repositories Tab
- **Advanced Filtering**: Search repositories by name, description, or language
- **Smart Sorting**: Sort by Stars, Forks, Name, Recently Updated, or Recently Created
- **Rich Repository Cards**: Each repository shows:
  - Repository name with direct GitHub link
  - Programming language with color coding
  - Description (truncated for readability)
  - Stars, forks, watchers, and open issues count
  - Topic tags (up to 5 visible)
  - Last update date
  - External links to documentation/homepage
- **Pagination**: View 10 repositories per page
- **Result Counter**: Shows filtered results vs total repositories

### 📋 Profile Details Tab
- **Comprehensive Information**:
  - Bio/About section
  - Location with icon
  - Company/Organization
  - Personal website/blog link
  - Email address
  - Twitter profile link
  - Account creation date
  - Last profile update date
- **Profile Navigation**: Direct "View on GitHub" button for full profile access

### 📈 Stats & Languages Tab
- **Repository Statistics**:
  - Total Stars across all repositories
  - Total Forks count
  - Total Watchers count
  - Open Issues count
  - Progress bars for visual representation
- **Account Insights**:
  - Account age in years
  - Total public repositories
  - Public gists count
- **Programming Languages**:
  - Language distribution across repositories
  - Shows top 8 languages used
  - Repository count per language
  - Progress bars for comparison
- **Engagement Metrics**:
  - Follower to Following ratio
  - Average Stars per Repository
  - Average Forks per Repository

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **UI Components**: PrimeReact 10.9.8
- **Icons**: PrimeIcons, Lucide React
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS 4.2
- **API**: GitHub REST API (public data, no authentication required)

## Components Architecture

```
GitHubProfileFinder (Main)
├── ProfileHeader
├── StatisticsCard
├── RepositoriesList
└── FollowersFollowing
```

### Component Details

**GitHubProfileFinder**: Main container managing state and API calls
- Handles user search and GitHub API integration
- Manages tabs and loading states
- Displays error messages
- Coordinates all child components

**ProfileHeader**: User profile display
- Avatar image
- User name and username
- Location and company info
- Follow/viewing action buttons
- Quick stats (followers, following, repos)

**StatisticsCard**: Reusable statistics display
- Icon, label, and value
- Color-coded for different stat types
- Responsive grid layout

**RepositoriesList**: Repository exploration
- Search and filter functionality
- Sorting options
- Pagination support
- Language color coding
- Topic tags display

**FollowersFollowing**: Advanced statistics
- Repository metrics
- Language usage statistics
- Engagement analytics
- Account age calculation
- Progress bar visualizations

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager (recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd 24_Github_Profile_Finder

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open browser
# Navigate to http://localhost:3000
```

### Build for Production

```bash
# Create optimized production build
pnpm build

# Start production server
pnpm start
```

### Usage

1. Enter a GitHub username in the search box
2. Click "Search" or press Enter
3. Explore the user's profile, repositories, and statistics
4. Click on any repository name to view it on GitHub
5. Use the tabs to switch between repositories, profile details, and statistics

## API Information

This application uses the GitHub REST API v3 (public access):

- **Endpoint**: `https://api.github.com/users/{username}`
- **Repositories Endpoint**: `https://api.github.com/users/{username}/repos`
- **Rate Limit**: 60 requests/hour for unauthenticated users

### Note on Rate Limits

If you encounter rate limit errors, you can provide a GitHub personal access token by modifying the API calls in the code to include authentication headers.

## PrimeReact Components Used

- **InputText**: Search input field
- **Button**: Search and action buttons
- **Card**: Container components
- **TabView/TabPanel**: Tab navigation
- **Message**: Error notifications
- **ProgressSpinner**: Loading indicator
- **Divider**: Visual separators
- **Dropdown**: Sort options
- **Tag**: Topic labels
- **Paginator**: Repository pagination

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Add GitHub authentication for higher API rate limits
- User followers/following list display
- Repository commit history
- Code contribution statistics
- Dark mode toggle
- Compare multiple users
- Export profile data

## Performance Optimizations

- Lazy loading of repository data
- Efficient state management with React hooks
- Memoized components for reduced re-renders
- Optimized API calls with proper error handling
- Client-side filtering for immediate feedback

## License

MIT

## Credits

Built with Next.js, TypeScript, PrimeReact, Tailwind CSS, and the GitHub API.
