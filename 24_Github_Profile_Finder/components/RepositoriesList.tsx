'use client'

import { useState, useMemo } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'

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

interface RepositoriesListProps {
  repositories: Repository[]
}

type SortOption = 'stars' | 'forks' | 'name' | 'updated' | 'created'

export default function RepositoriesList({ repositories }: RepositoriesListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('stars')
  const [first, setFirst] = useState(0)
  const rows = 10

  const sortOptions = [
    { label: 'Stars (Highest)', value: 'stars' },
    { label: 'Forks (Highest)', value: 'forks' },
    { label: 'Name (A-Z)', value: 'name' },
    { label: 'Recently Updated', value: 'updated' },
    { label: 'Recently Created', value: 'created' },
  ]

  const filteredAndSorted = useMemo(() => {
    let filtered = repositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (repo.language && repo.language.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count
        case 'forks':
          return b.forks_count - a.forks_count
        case 'name':
          return a.name.localeCompare(b.name)
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    return sorted
  }, [repositories, searchTerm, sortBy])

  const paginatedRepos = filteredAndSorted.slice(first, first + rows)

  const getLanguageColor = (language: string | null) => {
    const colors: { [key: string]: string } = {
      JavaScript: 'bg-yellow-200 text-yellow-800',
      TypeScript: 'bg-blue-200 text-blue-800',
      Python: 'bg-green-200 text-green-800',
      Java: 'bg-red-200 text-red-800',
      'C#': 'bg-purple-200 text-purple-800',
      Go: 'bg-cyan-200 text-cyan-800',
      Rust: 'bg-orange-200 text-orange-800',
      PHP: 'bg-indigo-200 text-indigo-800',
      Ruby: 'bg-red-300 text-red-900',
      Swift: 'bg-orange-300 text-orange-900',
    }
    return colors[language || ''] || 'bg-gray-200 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search Repositories
          </label>
          <InputText
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setFirst(0)
            }}
            placeholder="Search by name, description, or language..."
            className="w-full"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort By
          </label>
          <Dropdown
            value={sortBy}
            onChange={(e) => setSortBy(e.value)}
            options={sortOptions}
            className="w-full"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {paginatedRepos.length} of {filteredAndSorted.length} repositories
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {/* Repositories */}
      <div className="space-y-4">
        {paginatedRepos.length > 0 ? (
          paginatedRepos.map((repo) => (
            <Card key={repo.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                {/* Repository Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {repo.name}
                    </a>
                    {repo.homepage && (
                      <div className="mt-1">
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        >
                          <i className="pi pi-globe mr-1"></i>
                          {repo.homepage}
                        </a>
                      </div>
                    )}
                  </div>
                  {repo.language && (
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${getLanguageColor(repo.language)}`}>
                      {repo.language}
                    </span>
                  )}
                </div>

                {/* Description */}
                {repo.description && (
                  <p className="text-gray-700 dark:text-gray-300">
                    {repo.description.length > 200
                      ? `${repo.description.substring(0, 200)}...`
                      : repo.description}
                  </p>
                )}

                {/* Topics */}
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {repo.topics.slice(0, 5).map((topic) => (
                      <Tag
                        key={topic}
                        value={topic}
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      />
                    ))}
                    {repo.topics.length > 5 && (
                      <Tag
                        value={`+${repo.topics.length - 5}`}
                        className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      />
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-4 pt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <i className="pi pi-star-fill text-yellow-500"></i>
                    <span className="font-medium">{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="pi pi-sitemap text-gray-600 dark:text-gray-400"></i>
                    <span className="font-medium">{repo.forks_count} Forks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="pi pi-eye text-blue-500"></i>
                    <span className="font-medium">{repo.watchers_count} Watchers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="pi pi-exclamation-circle text-red-500"></i>
                    <span className="font-medium">{repo.open_issues_count} Issues</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="pi pi-calendar text-green-500"></i>
                    <span className="font-medium">
                      Updated: {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => window.open(repo.html_url, '_blank')}
                  label="View on GitHub"
                  icon="pi pi-external-link"
                  text
                  className="p-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                />
              </div>
            </Card>
          ))
        ) : (
          <div className="py-12 text-center">
            <i className="pi pi-search mb-4 inline-block text-5xl text-gray-400"></i>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {searchTerm ? `No repositories found matching "${searchTerm}"` : 'No repositories found'}
            </p>
          </div>
        )}
      </div>

      {/* Paginator */}
      {filteredAndSorted.length > rows && (
        <div className="mt-6">
          <Paginator
            first={first}
            rows={rows}
            totalRecords={filteredAndSorted.length}
            onPageChange={(e: PaginatorPageChangeEvent) => setFirst(e.first)}
          />
        </div>
      )}
    </div>
  )
}
