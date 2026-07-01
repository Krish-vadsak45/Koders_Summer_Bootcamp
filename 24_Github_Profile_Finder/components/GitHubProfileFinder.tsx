'use client'

import { useState, useCallback } from 'react'
import axios from 'axios'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Message } from 'primereact/message'
import { TabView, TabPanel } from 'primereact/tabview'
import { Divider } from 'primereact/divider'
import ProfileHeader from './ProfileHeader'
import RepositoriesList from './RepositoriesList'
import StatisticsCard from './StatisticsCard'
import FollowersFollowing from './FollowersFollowing'

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

export default function GitHubProfileFinder() {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  const searchUser = useCallback(async (searchUsername: string) => {
    if (!searchUsername.trim()) {
      setError('Please enter a username')
      return
    }

    setLoading(true)
    setError(null)
    setUser(null)
    setRepositories([])

    try {
      // Fetch user data
      const userResponse = await axios.get(`https://api.github.com/users/${searchUsername}`)
      setUser(userResponse.data)

      // Fetch user repositories
      const reposResponse = await axios.get(
        `https://api.github.com/users/${searchUsername}/repos?sort=stars&order=desc&per_page=100`
      )
      setRepositories(reposResponse.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError(`User "${searchUsername}" not found. Please check the username and try again.`)
        } else if (err.response?.status === 403) {
          setError(
            'API rate limit exceeded. Please wait a few minutes and try again, or provide a GitHub personal access token.'
          )
        } else {
          setError(`Error: ${err.response?.statusText || 'Failed to fetch user data'}`)
        }
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchUser(username)
    }
  }

  const handleSearchClick = () => {
    searchUser(username)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <i className="pi pi-github text-4xl text-white"></i>
            <h1 className="text-4xl font-bold text-white">GitHub Profile Finder</h1>
          </div>
          <p className="text-lg text-gray-300">
            Search for GitHub profiles and explore repositories, statistics, and more
          </p>
        </div>

        {/* Search Card */}
        <Card className="mb-8 shadow-2xl">
          <div className="flex gap-2">
            <InputText
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Enter GitHub username..."
              className="flex-1"
            />
            <Button
              onClick={handleSearchClick}
              loading={loading}
              icon="pi pi-search"
              label="Search"
              className="bg-blue-600 hover:bg-blue-700"
            />
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <Message severity="error" text={error} />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <ProgressSpinner
              style={{ width: '50px', height: '50px' }}
              strokeWidth="8"
              fill="transparent"
              animationDuration=".5s"
            />
          </div>
        )}

        {/* User Profile */}
        {user && !loading && (
          <>
            <ProfileHeader user={user} />

            {/* Statistics */}
            <div className="mb-8 grid gap-4 md:grid-cols-4">
              <StatisticsCard
                icon="pi pi-star-fill"
                label="Public Repos"
                value={user.public_repos}
                color="text-yellow-500"
              />
              <StatisticsCard
                icon="pi pi-users"
                label="Followers"
                value={user.followers}
                color="text-green-500"
              />
              <StatisticsCard
                icon="pi pi-user-plus"
                label="Following"
                value={user.following}
                color="text-blue-500"
              />
              <StatisticsCard
                icon="pi pi-file"
                label="Public Gists"
                value={user.public_gists}
                color="text-purple-500"
              />
            </div>

            {/* Tabs */}
            <Card className="shadow-2xl">
              <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                <TabPanel header={`Repositories (${repositories.length})`} leftIcon="pi pi-code">
                  <RepositoriesList repositories={repositories} />
                </TabPanel>

                <TabPanel header="Profile Details" leftIcon="pi pi-info-circle">
                  <div className="grid gap-6 md:grid-cols-2">
                    {user.bio && (
                      <div>
                        <h3 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">Bio</h3>
                        <p className="text-gray-600 dark:text-gray-400">{user.bio}</p>
                      </div>
                    )}

                    {user.location && (
                      <div>
                        <h3 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                          <i className="pi pi-map-marker mr-2"></i>Location
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{user.location}</p>
                      </div>
                    )}

                    {user.company && (
                      <div>
                        <h3 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                          <i className="pi pi-briefcase mr-2"></i>Company
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{user.company}</p>
                      </div>
                    )}

                    {user.blog && (
                      <div>
                        <h3 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                          <i className="pi pi-globe mr-2"></i>Website
                        </h3>
                        <a
                          href={user.blog}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline dark:text-blue-400"
                        >
                          {user.blog}
                        </a>
                      </div>
                    )}

                    {user.email && (
                      <div>
                        <h3 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                          <i className="pi pi-envelope mr-2"></i>Email
                        </h3>
                        <a
                          href={`mailto:${user.email}`}
                          className="text-blue-500 hover:underline dark:text-blue-400"
                        >
                          {user.email}
                        </a>
                      </div>
                    )}

                    {user.twitter_username && (
                      <div>
                        <h3 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                          <i className="pi pi-twitter mr-2"></i>Twitter
                        </h3>
                        <a
                          href={`https://twitter.com/${user.twitter_username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline dark:text-blue-400"
                        >
                          @{user.twitter_username}
                        </a>
                      </div>
                    )}

                    <div>
                      <h3 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                        <i className="pi pi-calendar mr-2"></i>Joined
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                        <i className="pi pi-refresh mr-2"></i>Last Updated
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(user.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Divider className="my-6" />

                  <div className="text-center">
                    <Button
                      onClick={() => window.open(user.html_url, '_blank')}
                      label="View on GitHub"
                      icon="pi pi-external-link"
                      className="bg-gray-800 hover:bg-gray-900"
                    />
                  </div>
                </TabPanel>

                <TabPanel header="Stats & Languages" leftIcon="pi pi-chart-bar">
                  <FollowersFollowing user={user} repositories={repositories} />
                </TabPanel>
              </TabView>
            </Card>
          </>
        )}

        {/* Initial State Message */}
        {!user && !loading && !error && (
          <div className="text-center">
            <Card className="bg-opacity-50 shadow-2xl">
              <div className="py-12 text-center">
                <i className="pi pi-search mb-4 inline-block text-5xl text-gray-400"></i>
                <p className="mt-4 text-lg text-gray-400">
                  Enter a GitHub username to get started
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
