import { useState, useEffect } from 'react'
import { useApp } from '../../contexts/AppContext'
import StatsGrid from './StatsGrid'
import RecentTests from './RecentTests'
import QuickActions from './QuickActions'
import BatchDetailModal from './BatchDetailModal'

export default function Dashboard() {
  const { user } = useApp()
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    recentTests: [],
    loading: true
  })
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [showBatchDetail, setShowBatchDetail] = useState(false)
  const [allBatches, setAllBatches] = useState([]) // Store all batch data for details

  // Handle clicking on a test to show details
  const handleTestClick = (testId) => {
    const batch = allBatches.find(b => b._id === testId)
    if (batch) {
      setSelectedBatch(batch)
      setShowBatchDetail(true)
    }
  }

  // Close batch detail modal
  const closeBatchDetail = () => {
    setShowBatchDetail(false)
    setSelectedBatch(null)
  }

  // Handle batch updates from marketplace actions
  const handleBatchUpdate = (updatedBatch) => {
    // Update the batch in allBatches array
    setAllBatches(prev => 
      prev.map(batch => 
        batch._id === updatedBatch._id ? updatedBatch : batch
      )
    )
    
    // Update the selected batch
    setSelectedBatch(updatedBatch)
    
    // Refresh dashboard data to reflect changes
    fetchDashboardData()
  }

  // Calculate aflatoxin assessment
  const calculateAflatoxinAssessment = (aflatoxinLevel) => {
    const level = parseFloat(aflatoxinLevel) || 0
    
    if (level >= 0 && level <= 5) {
      return { result: 'Safe for Children', color: 'green' }
    } else if (level > 5 && level <= 10) {
      return { result: 'Adults Only', color: 'yellow' }
    } else if (level > 10 && level <= 20) {
      return { result: 'Animal Feed Only', color: 'orange' }
    } else {
      return { result: 'Unsafe', color: 'red' }
    }
  }

  // Transform API batch data to RecentTests format
  const transformBatchesToTests = (batches) => {
    return batches.map(batch => {
      const aflatoxinLevel = parseFloat(batch.aflatoxin) || 0
      const assessment = calculateAflatoxinAssessment(aflatoxinLevel)
      
      return {
        id: batch._id,
        batchId: batch.batchId, // Make sure to include batchId
        date: batch.date,
        supplier: batch.supplier,
        aflatoxin: aflatoxinLevel, // Include aflatoxin level
        result: assessment.result,
        color: assessment.color,
        createdAt: batch.createdAt,
        // Include other fields that might be needed
        userId: batch.userId,
        userName: batch.userName,
        // Include marketplace fields
        isOnMarket: batch.isOnMarket,
        availableQuantity: batch.availableQuantity,
        pricePerKg: batch.pricePerKg
      }
    })
  }

  // Calculate dashboard statistics from batch data
  const calculateStats = (userBatches) => {
    const totalTests = userBatches.length
    
    // Count by aflatoxin levels
    const safeForChildren = userBatches.filter(batch => {
      const level = parseFloat(batch.aflatoxin) || 0
      return level >= 0 && level <= 5
    }).length
    
    const alertCount = userBatches.filter(batch => {
      const level = parseFloat(batch.aflatoxin) || 0
      return level > 20 // Unsafe
    }).length

    const warningCount = userBatches.filter(batch => {
      const level = parseFloat(batch.aflatoxin) || 0
      return level > 5 && level <= 20 // Adults only + Animal feed only
    }).length

    // Calculate average aflatoxin level
    const avgAflatoxin = userBatches.length > 0 
      ? userBatches.reduce((sum, batch) => {
          return sum + (parseFloat(batch.aflatoxin) || 0)
        }, 0) / userBatches.length
      : 0

    // Count batches on market (for owners)
    const batchesOnMarket = userBatches.filter(batch => batch.isOnMarket).length

    return [
      { 
        label: user?.type === 'admin' ? 'Total Tests (All Users)' : 'Total Tests', 
        value: totalTests.toString(), 
        change: totalTests > 0 ? '+' + Math.floor(Math.random() * 20) + '%' : '0%', 
        icon: 'FlaskConical', 
        color: 'blue' 
      },
      { 
        label: user?.type === 'admin' ? 'Safe for Children (All)' : 'Safe for Children', 
        value: safeForChildren.toString(), 
        change: safeForChildren > 0 ? '+' + Math.floor(Math.random() * 15) + '%' : '0%', 
        icon: 'CheckCircle', 
        color: 'green' 
      },
      { 
        label: user?.type === 'admin' ? 'Alerts (System-wide)' : 'Alerts', 
        value: (alertCount + warningCount).toString(), 
        change: alertCount > 0 ? '+' + Math.floor(Math.random() * 10) + '%' : '0%', 
        icon: 'AlertTriangle', 
        color: 'red' 
      },
      { 
        label: user?.type === 'admin' ? 'System Avg. Aflatoxin' : 'Avg. Aflatoxin', 
        value: avgAflatoxin.toFixed(1) + ' ppb', 
        change: '+' + (Math.random() * 2).toFixed(1) + '%', 
        icon: 'Target', 
        color: 'purple' 
      }
    ]
  }

  const fetchDashboardData = async () => {
    if (!user) {
      setDashboardData(prev => ({ ...prev, loading: false }))
      return
    }

    try {
      console.log('Fetching batches for user:', user)
      
      // Fetch all batches from API
      const response = await fetch('https://back-cap.onrender.com/api/batches')
      const apiData = await response.json()

      if (apiData.success && apiData.data) {
        console.log('API Response:', apiData)
        
        // Filter batches based on user type
        // Admin users see all batches in the system
        // Regular users only see their own batches
        const userBatches = user.type === 'admin' 
          ? apiData.data // Admin sees all batches
          : apiData.data.filter(batch => 
              batch.userId === user.id || 
              batch.userName === user.email || 
              batch.userName === user.username
            )

        console.log(user?.type === 'admin' ? 'Admin viewing all batches:' : 'User batches:', userBatches)

        // Store all user batches for detail modal
        setAllBatches(userBatches)

        // Transform batches to test format
        const recentTests = transformBatchesToTests(userBatches)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by newest first
          .slice(0, 10) // Get latest 10

        // Calculate stats
        const stats = calculateStats(userBatches)

        setDashboardData({
          stats,
          recentTests,
          loading: false
        })
      } else {
        console.error('API Error:', apiData.message || 'Failed to fetch batches')
        // Set empty data if API fails
        setDashboardData({
          stats: [
            { label: user?.type === 'admin' ? 'Total Tests (All Users)' : 'Total Tests', value: '0', change: '0%', icon: 'FlaskConical', color: 'blue' },
            { label: user?.type === 'admin' ? 'Safe for Children (All)' : 'Safe for Children', value: '0', change: '0%', icon: 'CheckCircle', color: 'green' },
            { label: user?.type === 'admin' ? 'Alerts (System-wide)' : 'Alerts', value: '0', change: '0%', icon: 'AlertTriangle', color: 'red' },
            { label: user?.type === 'admin' ? 'System Avg. Aflatoxin' : 'Avg. Aflatoxin', value: '0 ppb', change: '0%', icon: 'Target', color: 'purple' }
          ],
          recentTests: [],
          loading: false
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set empty data on error
      setDashboardData({
        stats: [
          { label: user?.type === 'admin' ? 'Total Tests (All Users)' : 'Total Tests', value: '0', change: '0%', icon: 'FlaskConical', color: 'blue' },
          { label: user?.type === 'admin' ? 'Safe for Children (All)' : 'Safe for Children', value: '0', change: '0%', icon: 'CheckCircle', color: 'green' },
          { label: user?.type === 'admin' ? 'Alerts (System-wide)' : 'Alerts', value: '0', change: '0%', icon: 'AlertTriangle', color: 'red' },
          { label: user?.type === 'admin' ? 'System Avg. Aflatoxin' : 'Avg. Aflatoxin', value: '0 ppb', change: '0%', icon: 'Target', color: 'purple' }
        ],
        recentTests: [],
        loading: false
      })
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [user])

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
        <h1 className="text-3xl font-light text-gray-900">
          Welcome back, {user?.name || user?.email}!
        </h1>
        <p className="text-gray-600 mt-2">
          {user?.type === 'admin' 
            ? "Here's the complete food safety overview for all users"
            : "Here's your food safety overview for today"
          }
        </p>
        {user?.type === 'admin' && (
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-200/50 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-700 font-medium">
                Administrator View - Showing all system tests
              </span>
            </div>
          </div>
        )}
      </div>

      <StatsGrid stats={dashboardData.stats} />

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <RecentTests tests={dashboardData.recentTests} onTestClick={handleTestClick} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Enhanced Batch Detail Modal with Marketplace */}
      <BatchDetailModal 
        isOpen={showBatchDetail}
        onClose={closeBatchDetail}
        batch={selectedBatch}
        user={user}
        onBatchUpdate={handleBatchUpdate}
      />
    </div>
  )
}