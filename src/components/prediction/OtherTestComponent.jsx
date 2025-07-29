import { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, Info, Clock, Loader2, RefreshCw, Eye } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'

export default function OtherTestComponent() {
  const { user } = useApp()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTest, setSelectedTest] = useState(null)

  // Fetch tests from API
  const fetchTests = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('https://back-cap.onrender.com/api/batch2')
      
      if (!response.ok) {
        throw new Error('Failed to fetch tests')
      }
      
      const result = await response.json()
      
      if (result.success) {
        // Filter tests by current user's email
        const userEmail = user?.email
        const filteredTests = userEmail 
          ? result.data.filter(test => test.email === userEmail)
          : result.data
        
        setTests(filteredTests)
      } else {
        throw new Error('API returned unsuccessful response')
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching tests:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTests()
  }, [])

  // Aflatoxin assessment logic (same as RecentTests component)
  const getAflatoxinAssessment = (aflatoxinLevel) => {
    const level = parseFloat(aflatoxinLevel) || 0
    
    if (level >= 0 && level <= 5) {
      return {
        result: 'Safe for Children',
        color: 'green',
        icon: CheckCircle
      }
    } else if (level > 5 && level <= 10) {
      return {
        result: 'Adults Only',
        color: 'yellow',
        icon: Info
      }
    } else if (level > 10 && level <= 20) {
      return {
        result: 'Animal Feed Only',
        color: 'orange',
        icon: AlertTriangle
      }
    } else {
      return {
        result: 'Unsafe',
        color: 'red',
        icon: AlertTriangle
      }
    }
  }

  const getResultIcon = (aflatoxinLevel) => {
    const assessment = getAflatoxinAssessment(aflatoxinLevel)
    const IconComponent = assessment.icon
    
    switch (assessment.color) {
      case 'green':
        return <IconComponent className="w-5 h-5 text-emerald-500" />
      case 'yellow':
        return <IconComponent className="w-5 h-5 text-amber-500" />
      case 'orange':
        return <IconComponent className="w-5 h-5 text-orange-500" />
      case 'red':
        return <IconComponent className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getResultColorClass = (aflatoxinLevel) => {
    const assessment = getAflatoxinAssessment(aflatoxinLevel)
    
    switch (assessment.color) {
      case 'green':
        return 'text-emerald-700 bg-gradient-to-r from-emerald-50/80 to-emerald-100/60 border-emerald-200/50'
      case 'yellow':
        return 'text-amber-700 bg-gradient-to-r from-amber-50/80 to-amber-100/60 border-amber-200/50'
      case 'orange':
        return 'text-orange-700 bg-gradient-to-r from-orange-50/80 to-orange-100/60 border-orange-200/50'
      case 'red':
        return 'text-red-700 bg-gradient-to-r from-red-50/80 to-red-100/60 border-red-200/50'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const handleTestClick = (test) => {
    setSelectedTest(test)
  }

  const closeModal = () => {
    setSelectedTest(null)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading tests...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Tests</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchTests}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900">My Batch Tests</h1>
          <p className="text-gray-600 mt-2">View and analyze your aflatoxin test results</p>
          
        </div>
        <button
          onClick={fetchTests}
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Found</h3>
          <p className="text-gray-500">No batch tests available for your account at the moment.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex space-x-6 pb-4" style={{ minWidth: 'max-content' }}>
            {tests.map((test) => {
              const aflatoxinLevel = Math.round(parseFloat(test.aflatoxin) || 0)
              const assessment = getAflatoxinAssessment(aflatoxinLevel)
              
              return (
                <div
                  key={test._id}
                  onClick={() => handleTestClick(test)}
                  className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 p-6"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      {getResultIcon(aflatoxinLevel)}
                    </div>
                    <Eye className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
                  </div>

                  {/* Batch Info */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{test.batchId}</h3>
                    <p className="text-sm text-gray-500">{test.supplier}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(test.date).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Aflatoxin Level */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Aflatoxin Level</span>
                      <span className="text-2xl font-bold text-gray-900">{aflatoxinLevel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">ppb</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-3 py-2 text-sm font-medium rounded-full border text-center ${getResultColorClass(aflatoxinLevel)}`}>
                    {assessment.result}
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div>Moisture: {test.moisture_maize_grain}%</div>
                      <div>Broken: {test.broken_kernels_percent_maize_grain}%</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Modal for detailed view */}
      {selectedTest && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Test Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Batch ID</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedTest.batchId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Supplier</label>
                    <p className="text-lg text-gray-900">{selectedTest.supplier}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Test Date</label>
                    <p className="text-lg text-gray-900">{new Date(selectedTest.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <p className="text-lg text-gray-900">{selectedTest.email}</p>
                  </div>
                </div>

                {/* Aflatoxin Result */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Aflatoxin Level</h3>
                      <p className="text-3xl font-bold text-gray-900">{Math.round(parseFloat(selectedTest.aflatoxin))}</p>
                      <p className="text-sm text-gray-500">parts per billion (ppb)</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full border ${getResultColorClass(selectedTest.aflatoxin)}`}>
                      {getAflatoxinAssessment(selectedTest.aflatoxin).result}
                    </div>
                  </div>
                </div>

                {/* Grain Characteristics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Grain Characteristics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Moisture Content</label>
                      <p className="text-lg text-gray-900">{selectedTest.moisture_maize_grain}%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Immature Grains</label>
                      <p className="text-lg text-gray-900">{selectedTest.Immaturegrains}%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Discolored Grains</label>
                      <p className="text-lg text-gray-900">{selectedTest.Discolored_grains}%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Broken Kernels</label>
                      <p className="text-lg text-gray-900">{selectedTest.broken_kernels_percent_maize_grain}%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Foreign Matter</label>
                      <p className="text-lg text-gray-900">{selectedTest.foreign_matter_percent_maize_grain}%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Pest Damage</label>
                      <p className="text-lg text-gray-900">{selectedTest.pest_damaged}%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Rotten Grains</label>
                      <p className="text-lg text-gray-900">{selectedTest.rotten}%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Live Infestation</label>
                      <p className="text-lg text-gray-900">{selectedTest.Liveinfestation ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Abnormal Odours</label>
                      <p className="text-lg text-gray-900">{selectedTest.abnormal_odours_maize_grain ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="text-sm text-gray-500 border-t pt-4">
                  <p>Created: {new Date(selectedTest.createdAt).toLocaleString()}</p>
                  <p>Updated: {new Date(selectedTest.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}