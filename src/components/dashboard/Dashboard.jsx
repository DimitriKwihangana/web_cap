import { useState, useEffect } from 'react'
import { useApp } from '../../contexts/AppContext'
import StatsGrid from './StatsGrid'
import RecentTests from './RecentTests'
import QuickActions from './QuickActions'

export default function Dashboard() {
  const { user } = useApp()
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    recentTests: [],
    loading: true
  })

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Mock data - replace with real API call
        const mockData = {
          stats: [
            { label: 'Total Tests', value: '1,247', change: '+12%', icon: 'FlaskConical', color: 'blue' },
            { label: 'Safe Batches', value: '1,186', change: '+8%', icon: 'CheckCircle', color: 'green' },
            { label: 'Alerts', value: '61', change: '-15%', icon: 'AlertTriangle', color: 'red' },
            { label: 'Accuracy', value: '99.2%', change: '+0.3%', icon: 'Target', color: 'purple' }
          ],
          recentTests: [
            { id: 1, batch: 'MB-2025-001', date: '2025-07-01', result: 'Safe', confidence: 98.5 },
            { id: 2, batch: 'MB-2025-002', date: '2025-06-30', result: 'Warning', confidence: 76.2 },
            { id: 3, batch: 'MB-2025-003', date: '2025-06-30', result: 'Safe', confidence: 99.1 },
            { id: 4, batch: 'MB-2025-004', date: '2025-06-29', result: 'Safe', confidence: 97.8 },
          ]
        }

        setTimeout(() => {
          setDashboardData({
            stats: mockData.stats,
            recentTests: mockData.recentTests,
            loading: false
          })
        }, 1000)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setDashboardData(prev => ({ ...prev, loading: false }))
      }
    }

    fetchDashboardData()
  }, [])

  if (dashboardData.loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Here's your food safety overview for today</p>
      </div>

      <StatsGrid stats={dashboardData.stats} />

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <RecentTests tests={dashboardData.recentTests} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}