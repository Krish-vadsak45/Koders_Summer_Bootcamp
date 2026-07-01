'use client'

import { Card } from 'primereact/card'
import { Avatar } from 'primereact/avatar'
import { Button } from 'primereact/button'

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

interface ProfileHeaderProps {
  user: GitHubUser
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card className="mb-8 overflow-hidden shadow-2xl">
      <div className="flex flex-col items-center gap-6 md:flex-row">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="h-32 w-32 rounded-full border-4 border-blue-500 shadow-lg"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="mb-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {user.name || user.login}
            </h2>
            {user.name && (
              <p className="text-lg text-gray-600 dark:text-gray-400">@{user.login}</p>
            )}
          </div>

          {user.bio && (
            <p className="mb-4 text-gray-700 dark:text-gray-300">{user.bio}</p>
          )}

          <div className="mb-4 flex flex-wrap gap-2">
            {user.location && (
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm dark:bg-gray-700">
                <i className="pi pi-map-marker"></i>
                {user.location}
              </span>
            )}
            {user.company && (
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm dark:bg-gray-700">
                <i className="pi pi-briefcase"></i>
                {user.company}
              </span>
            )}
            {user.blog && (
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm dark:bg-gray-700">
                <i className="pi pi-globe"></i>
                Website
              </span>
            )}
            {user.hireable && (
              <span className="inline-flex items-center gap-2 rounded-full bg-green-200 px-3 py-1 text-sm text-green-800 dark:bg-green-900 dark:text-green-200">
                <i className="pi pi-check-circle"></i>
                Available for hire
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 md:flex-row">
            <Button
              onClick={() => window.open(user.html_url, '_blank')}
              label="View Profile"
              icon="pi pi-github"
              className="bg-gray-800 hover:bg-gray-900"
            />
            <Button
              onClick={() => window.open(`https://github.com/${user.login}?tab=followers`, '_blank')}
              label="View Followers"
              icon="pi pi-users"
              outlined
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-6 md:flex-col">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{user.followers}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{user.following}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Repos</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {user.public_repos}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
