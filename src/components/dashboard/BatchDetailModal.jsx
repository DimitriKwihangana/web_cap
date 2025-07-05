import { useState } from 'react'
import { X, Calendar, User, Building, Droplets, AlertTriangle, ShoppingCart, DollarSign, Package, CheckCircle, XCircle } from 'lucide-react'

export default function BatchDetailModal({ isOpen, onClose, batch, user, onBatchUpdate }) {
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false)
  const [marketplaceForm, setMarketplaceForm] = useState({
    quantity: '',
    pricePerKg: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [marketplaceError, setMarketplaceError] = useState('')
  const [marketplaceSuccess, setMarketplaceSuccess] = useState('')

  if (!isOpen || !batch) return null

  // Check if current user owns this batch
  const isOwner = user && (
    batch.userId === user.id || 
    batch.userName === user.email || 
    batch.userName === user.username
  )

  // Calculate aflatoxin assessment
  const calculateAflatoxinAssessment = (aflatoxinLevel) => {
    const level = parseFloat(aflatoxinLevel) || 0
    
    if (level >= 0 && level <= 5) {
      return {
        result: 'Safe for Children',
        description: 'Low aflatoxin levels - safe for all consumption',
        color: 'green'
      }
    } else if (level > 5 && level <= 10) {
      return {
        result: 'Safe for Adults Only',
        description: 'Moderate aflatoxin levels - not recommended for children',
        color: 'yellow'
      }
    } else if (level > 10 && level <= 20) {
      return {
        result: 'Suitable for Animal Feed Only',
        description: 'High aflatoxin levels - not safe for human consumption',
        color: 'orange'
      }
    } else {
      return {
        result: 'Not Safe for Any Use',
        description: 'Very high aflatoxin contamination detected',
        color: 'red'
      }
    }
  }

  const aflatoxinLevel = Math.round(parseFloat(batch.aflatoxin) || 0)
  const assessment = calculateAflatoxinAssessment(aflatoxinLevel)

  const getColorClasses = (color) => {
    const colorMap = {
      green: { 
        bg: 'bg-gradient-to-br from-emerald-50/80 to-green-100/60', 
        text: 'text-emerald-700', 
        border: 'border-emerald-200/50',
        glow: 'shadow-emerald-500/20'
      },
      yellow: { 
        bg: 'bg-gradient-to-br from-amber-50/80 to-yellow-100/60', 
        text: 'text-amber-700', 
        border: 'border-amber-200/50',
        glow: 'shadow-amber-500/20'
      },
      orange: { 
        bg: 'bg-gradient-to-br from-orange-50/80 to-orange-100/60', 
        text: 'text-orange-700', 
        border: 'border-orange-200/50',
        glow: 'shadow-orange-500/20'
      },
      red: { 
        bg: 'bg-gradient-to-br from-red-50/80 to-red-100/60', 
        text: 'text-red-700', 
        border: 'border-red-200/50',
        glow: 'shadow-red-500/20'
      }
    }
    return colorMap[color]
  }

  const colors = getColorClasses(assessment.color)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Handle marketplace form input changes
  const handleMarketplaceChange = (e) => {
    const { name, value } = e.target
    setMarketplaceForm(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear errors when user starts typing
    if (marketplaceError) setMarketplaceError('')
  }

  // Handle putting batch on market
  const handlePutOnMarket = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMarketplaceError('')
    setMarketplaceSuccess('')

    try {
      // Validate form
      if (!marketplaceForm.quantity || parseFloat(marketplaceForm.quantity) <= 0) {
        throw new Error('Please enter a valid quantity')
      }
      if (!marketplaceForm.pricePerKg || parseFloat(marketplaceForm.pricePerKg) <= 0) {
        throw new Error('Please enter a valid price per kg')
      }

      const response = await fetch(`http://localhost:5000/api/batches/${batch._id}/market`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: parseFloat(marketplaceForm.quantity),
          pricePerKg: parseFloat(marketplaceForm.pricePerKg)
        })
      })

      const data = await response.json()

      if (data.success) {
        setMarketplaceSuccess('Batch successfully listed on marketplace!')
        setIsMarketplaceOpen(false)
        setMarketplaceForm({ quantity: '', pricePerKg: '' })
        
        // Call parent callback to refresh data if provided
        if (onBatchUpdate) {
          onBatchUpdate(data.data)
        }
      } else {
        throw new Error(data.message || 'Failed to list batch on market')
      }
    } catch (error) {
      console.error('Error listing batch on market:', error)
      setMarketplaceError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle removing batch from market
  const handleRemoveFromMarket = async () => {
    setIsSubmitting(true)
    setMarketplaceError('')
    setMarketplaceSuccess('')

    try {
      const response = await fetch(`http://localhost:5000/api/batches/${batch._id}/market`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (data.success) {
        setMarketplaceSuccess('Batch removed from marketplace!')
        
        // Call parent callback to refresh data if provided
        if (onBatchUpdate) {
          onBatchUpdate(data.data)
        }
      } else {
        throw new Error(data.message || 'Failed to remove batch from market')
      }
    } catch (error) {
      console.error('Error removing batch from market:', error)
      setMarketplaceError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay with glass effect */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-xl transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal content with glass morphism */}
      <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden border border-white/20">
        {/* Header with gradient */}
        <div className="relative px-8 py-6 border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/80 via-white/40 to-slate-50/80 backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-light text-gray-900 tracking-tight">Batch Analysis</h2>
              <p className="text-gray-600 font-light mt-1">Comprehensive quality assessment</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/30 rounded-full transition-all duration-200 backdrop-blur-sm"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-8 py-6">
          {/* Success/Error Messages */}
          {marketplaceSuccess && (
            <div className="mb-6 p-4 bg-green-50/80 border border-green-200/50 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <p className="text-green-700 font-medium">{marketplaceSuccess}</p>
              </div>
            </div>
          )}

          {marketplaceError && (
            <div className="mb-6 p-4 bg-red-50/80 border border-red-200/50 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-3" />
                <p className="text-red-700 font-medium">{marketplaceError}</p>
              </div>
            </div>
          )}

          {/* Hero Section - Aflatoxin Assessment */}
          <div className="mb-8">
            <div className={`relative p-8 rounded-3xl border ${colors.border} ${colors.bg} backdrop-blur-sm shadow-2xl ${colors.glow}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl"></div>
              <div className="relative text-center">
                <div className="mb-6">
                  <div className={`inline-flex items-center px-6 py-3 rounded-full text-base font-medium ${colors.text} bg-white/30 backdrop-blur-sm border border-white/20 shadow-lg`}>
                    {assessment.result}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-6xl font-ultralight text-gray-900 mb-2">{aflatoxinLevel}</p>
                  <p className="text-xl font-light text-gray-600">ppb aflatoxin</p>
                </div>
                <p className="text-lg font-light text-gray-700 max-w-md mx-auto">
                  {assessment.description}
                </p>
              </div>
            </div>
          </div>

          {/* Marketplace Section */}
          {isOwner && (
            <div className="mb-8">
              <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-light text-gray-900 flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-3 text-blue-600" />
                    Marketplace
                  </h3>
                  
                  {/* Market Status Badge */}
                  {batch.isOnMarket ? (
                    <div className="flex items-center space-x-3">
                      <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-green-700 bg-green-100/80 border border-green-200/50">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Listed on Market
                      </div>
                      {batch.availableQuantity > 0 && (
                        <span className="text-sm text-gray-600">
                          {batch.availableQuantity}kg available at ${batch.pricePerKg}/kg
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-gray-600 bg-gray-100/80 border border-gray-200/50">
                      <Package className="w-4 h-4 mr-2" />
                      Not Listed
                    </div>
                  )}
                </div>

                {/* Market Actions */}
                {!batch.isOnMarket && (
                  <div>
                    {!isMarketplaceOpen ? (
                      <button
                        onClick={() => setIsMarketplaceOpen(true)}
                        className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl backdrop-blur-sm flex items-center justify-center"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        List on Marketplace
                      </button>
                    ) : (
                      <form onSubmit={handlePutOnMarket} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Quantity (kg)
                            </label>
                            <div className="relative">
                              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="number"
                                name="quantity"
                                value={marketplaceForm.quantity}
                                onChange={handleMarketplaceChange}
                                placeholder="Enter quantity in kg"
                                className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 backdrop-blur-sm"
                                step="0.1"
                                min="0.1"
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Price per kg ($)
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="number"
                                name="pricePerKg"
                                value={marketplaceForm.pricePerKg}
                                onChange={handleMarketplaceChange}
                                placeholder="Enter price per kg"
                                className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 backdrop-blur-sm"
                                step="0.01"
                                min="0.01"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? 'Listing...' : 'List on Market'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsMarketplaceOpen(false)
                              setMarketplaceForm({ quantity: '', pricePerKg: '' })
                              setMarketplaceError('')
                            }}
                            className="py-3 px-6 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl backdrop-blur-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* Remove from Market */}
                {batch.isOnMarket && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-800">Market Listing Details</p>
                          <p className="text-blue-600">
                            {batch.availableQuantity}kg available • ${batch.pricePerKg}/kg • 
                            Total value: ${(batch.availableQuantity * batch.pricePerKg).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveFromMarket}
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Removing...' : 'Remove from Market'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Basic Information and Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Basic Information */}
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-xl font-light text-gray-900 mb-6 flex items-center">
                <Building className="w-5 h-5 mr-3 text-blue-600" />
                Basic Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Batch ID</p>
                    <p className="text-lg font-light text-gray-900">{batch.batchId}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Supplier</p>
                    <p className="text-lg font-light text-gray-900">{batch.supplier}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Test Date</p>
                    <p className="text-lg font-light text-gray-900">{formatDate(batch.date)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tested By</p>
                    <p className="text-lg font-light text-gray-900">{batch.userName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-xl font-light text-gray-900 mb-6">Metadata</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                  <p className="text-sm font-medium text-gray-500 mb-2">Created</p>
                  <p className="text-lg font-light text-gray-900">{formatDateTime(batch.createdAt)}</p>
                </div>
                
                <div className="p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                  <p className="text-sm font-medium text-gray-500 mb-2">Last Updated</p>
                  <p className="text-lg font-light text-gray-900">{formatDateTime(batch.updatedAt)}</p>
                </div>

                {/* Show ownership indicator */}
                <div className="p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                  <p className="text-sm font-medium text-gray-500 mb-2">Ownership</p>
                  <div className="flex items-center">
                    {isOwner ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-green-700 bg-green-100/80">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        You own this batch
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-gray-600 bg-gray-100/80">
                        <User className="w-4 h-4 mr-2" />
                        Owned by {batch.userName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grain Quality Metrics */}
          <div className="mb-8">
            <h3 className="text-2xl font-light text-gray-900 mb-6 flex items-center">
              <Droplets className="w-6 h-6 mr-3 text-blue-600" />
              Grain Quality Metrics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Moisture Content */}
              <div className="bg-white/40 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/50">
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-600">Moisture Content</span>
                </div>
                <p className="text-3xl font-ultralight text-gray-900">{batch.moisture_maize_grain}<span className="text-lg text-gray-500">%</span></p>
              </div>

              {/* Immature Grains */}
              <div className="bg-white/40 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/50">
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-600">Immature Grains</span>
                </div>
                <p className="text-3xl font-ultralight text-gray-900">{batch.Immaturegrains}<span className="text-lg text-gray-500">%</span></p>
              </div>

              {/* Discolored Grains */}
              <div className="bg-white/40 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/50">
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-600">Discolored Grains</span>
                </div>
                <p className="text-3xl font-ultralight text-gray-900">{batch.Discolored_grains}<span className="text-lg text-gray-500">%</span></p>
              </div>

              {/* Broken Kernels */}
              <div className="bg-white/40 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/50">
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-600">Broken Kernels</span>
                </div>
                <p className="text-3xl font-ultralight text-gray-900">{batch.broken_kernels_percent_maize_grain}<span className="text-lg text-gray-500">%</span></p>
              </div>

              {/* Foreign Matter */}
              <div className="bg-white/40 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/50">
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-600">Foreign Matter</span>
                </div>
                <p className="text-3xl font-ultralight text-gray-900">{batch.foreign_matter_percent_maize_grain}<span className="text-lg text-gray-500">%</span></p>
              </div>

              {/* Pest Damaged */}
              <div className="bg-white/40 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/50">
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-600">Pest Damaged</span>
                </div>
                <p className="text-3xl font-ultralight text-gray-900">{batch.pest_damaged}<span className="text-lg text-gray-500">%</span></p>
              </div>

              {/* Rotten Grains */}
              <div className="bg-white/40 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/50">
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-600">Rotten Grains</span>
                </div>
                <p className="text-3xl font-ultralight text-gray-900">{batch.rotten}<span className="text-lg text-gray-500">%</span></p>
              </div>

              {/* Live Infestation */}
              <div className="bg-white/40 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/50">
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-600">Live Infestation</span>
                </div>
                <p className="text-3xl font-ultralight text-gray-900">
                  {batch.Liveinfestation ? 'Present' : 'None'}
                </p>
              </div>

              {/* Abnormal Odours */}
              <div className="bg-white/40 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/50">
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-600">Abnormal Odours</span>
                </div>
                <p className="text-3xl font-ultralight text-gray-900">
                  {batch.abnormal_odours_maize_grain ? 'Detected' : 'None'}
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-6">
            <h3 className="text-2xl font-light text-gray-900 mb-6">Recommendations</h3>
            <div className={`p-6 rounded-2xl border ${colors.border} ${colors.bg} backdrop-blur-sm shadow-lg`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl"></div>
                <div className="relative">
                  {assessment.result === 'Safe for Children' && (
                    <div>
                      <p className="text-xl font-medium text-emerald-800 mb-3">✓ Safe for all consumption</p>
                      <p className="text-base font-light text-emerald-700">Low aflatoxin levels detected. This batch is safe for children, adults, and all food applications.</p>
                    </div>
                  )}
                  {assessment.result === 'Safe for Adults Only' && (
                    <div>
                      <p className="text-xl font-medium text-amber-800 mb-3">⚠ Adults only consumption</p>
                      <p className="text-base font-light text-amber-700">Moderate aflatoxin levels detected. Safe for adult consumption but not recommended for children.</p>
                    </div>
                  )}
                  {assessment.result === 'Suitable for Animal Feed Only' && (
                    <div>
                      <p className="text-xl font-medium text-orange-800 mb-3">🔶 Animal feed use only</p>
                      <p className="text-base font-light text-orange-700">High aflatoxin levels detected. Not safe for human consumption. May be used for animal feed with proper processing.</p>
                    </div>
                  )}
                  {assessment.result === 'Not Safe for Any Use' && (
                    <div>
                      <p className="text-xl font-medium text-red-800 mb-3">🚨 Unsafe for any use</p>
                      <p className="text-base font-light text-red-700">Very high aflatoxin contamination detected. Not safe for human or animal consumption. Consider disposal or industrial use only.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-8 py-6 bg-white/30 backdrop-blur-sm">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}