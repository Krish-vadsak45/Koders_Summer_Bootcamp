'use client'

interface StatisticsCardProps {
  icon: string
  label: string
  value: number
  color: string
}

export default function StatisticsCard({ icon, label, value, color }: StatisticsCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <i className={`pi ${icon} text-4xl ${color}`}></i>
      </div>
    </div>
  )
}
