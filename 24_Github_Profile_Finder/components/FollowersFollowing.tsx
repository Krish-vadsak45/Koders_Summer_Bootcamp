'use client'

import { useMemo } from 'react'
import { Card } from 'primereact/card'
import { ProgressBar } from 'primereact/progressbar'

interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  repos_url: string
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
  updated_at: string
  public_gists: number
  twitter_username: string | null
  email: string | null
  hireable: boolean | null
}

interface Repository {
  id: number
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  topics: string[]
  created_at: string
  updated_at: string
  homepage: string | null
}

interface FollowersFollowingProps {
  user: GitHubUser
  repositories: Repository[]
}

export default function FollowersFollowing({
  user,
  repositories,
}: FollowersFollowingProps) {
  const stats = useMemo(() => {
    // Calculate language statistics
    const languageStats: { [key: string]: number } = {}
    let totalStars = 0
    let totalForks = 0
    let totalWatchers = 0
    let totalIssues = 0

    repositories.forEach((repo) => {
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1
      }
      totalStars += repo.stargazers_count
      totalForks += repo.forks_count
      totalWatchers += repo.watchers_count
      totalIssues += repo.open_issues_count
    })

    // Sort languages by count
    const sortedLanguages = Object.entries(languageStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)

    return {
      languageStats: sortedLanguages,
      totalStars,
      totalForks,
      totalWatchers,
      totalIssues,
      maxLanguageCount: Math.max(...Object.values(languageStats), 1),
    }
  }, [repositories])

  const accountAge = useMemo(() => {
    const created = new Date(user.created_at)
    const now = new Date()
    const years = now.getFullYear() - created.getFullYear()
    const months = now.getMonth() - created.getMonth()
    return years * 12 + months
  }, [user.created_at])

  return (
    <div className="space-y-8">
      {/* Overview Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              <i className="pi pi-star mr-2 text-yellow-500"></i>Total Stars
            </h3>
            <p className="text-4xl font-bold text-yellow-600">{stats.totalStars}</p>
            <ProgressBar
              value={(stats.totalStars / Math.max(stats.totalStars, 100)) * 100}
              className="h-2"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Across {repositories.length} public repositories
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              <i className="pi pi-sitemap mr-2 text-green-500"></i>Total Forks
            </h3>
            <p className="text-4xl font-bold text-green-600">{stats.totalForks}</p>
            <ProgressBar
              value={(stats.totalForks / Math.max(stats.totalForks, 100)) * 100}
              className="h-2"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Projects replicated by others
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              <i className="pi pi-eye mr-2 text-blue-500"></i>Total Watchers
            </h3>
            <p className="text-4xl font-bold text-blue-600">{stats.totalWatchers}</p>
            <ProgressBar
              value={(stats.totalWatchers / Math.max(stats.totalWatchers, 100)) * 100}
              className="h-2"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              People watching repositories
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              <i className="pi pi-exclamation-circle mr-2 text-red-500"></i>Open Issues
            </h3>
            <p className="text-4xl font-bold text-red-600">{stats.totalIssues}</p>
            <ProgressBar
              value={(stats.totalIssues / Math.max(stats.totalIssues, 100)) * 100}
              className="h-2"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Issues across all repositories
            </p>
          </div>
        </Card>
      </div>

      {/* Account Information */}
      <Card className="bg-blue-50 dark:bg-blue-900">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              <i className="pi pi-calendar mr-2"></i>Account Age
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {Math.floor(accountAge / 12)} <span className="text-lg">yrs</span>
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              <i className="pi pi-code mr-2"></i>Profile Contribution
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600">{user.public_repos}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Public repositories</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              <i className="pi pi-file mr-2"></i>Gists
            </p>
            <p className="mt-2 text-3xl font-bold text-purple-600">{user.public_gists}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Public gists</p>
          </div>
        </div>
      </Card>

      {/* Language Statistics */}
      {stats.languageStats.length > 0 && (
        <Card>
          <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            <i className="pi pi-code mr-2"></i>Programming Languages Used
          </h3>
          <div className="space-y-4">
            {stats.languageStats.map(([language, count]) => (
              <div key={language}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{language}</span>
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {count} {count === 1 ? 'repo' : 'repos'}
                  </span>
                </div>
                <ProgressBar
                  value={(count / stats.maxLanguageCount) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Engagement Metrics */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          <i className="pi pi-heart-fill mr-2 text-red-500"></i>Engagement Score
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Follower Ratio</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {user.followers > 0 ? (user.following / user.followers).toFixed(2) : 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Avg Stars per Repo</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {repositories.length > 0
                ? Math.round(stats.totalStars / repositories.length)
                : 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Avg Forks per Repo</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {repositories.length > 0
                ? Math.round(stats.totalForks / repositories.length)
                : 'N/A'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
