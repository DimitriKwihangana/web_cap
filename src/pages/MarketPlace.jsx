import { useState, useEffect } from 'react'
import { Search, Filter, ShoppingCart, Package, DollarSign, Calendar, User, Building, CheckCircle, AlertTriangle, XCircle, Eye, MapPin, Phone, MessageSquare } from 'lucide-react'

export default function MarketplacePage() {
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    minQuantity: '',
    supplier: '',
    sortBy: 'marketListedAt',
    sortOrder: 'desc'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orderForm, setOrderForm] = useState({
    quantity: '',
    buyerDetails: {
      name: '',
      email: '',
      organization: '',
      phone: ''
    },
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Rwanda'
    },
    notes: ''
  })
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState('')
  const [orderError, setOrderError] = useState('')

  // Mock user data - replace with actual user context
  const user = {
    id: 'user123',
    name: 'John Processor',
    email: 'john@processor.com',
    type: 'processor'
  }

  // Fetch market batches
  const fetchMarketBatches = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...(filters.search && { supplier: filters.search }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.minQuantity && { minQuantity: filters.minQuantity }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      })

      const response = await fetch(`https://back-cap.onrender.com/api/batches/market?${queryParams}`)
      const data = await response.json()

      if (data.success) {
        setBatches(data.data)
        setTotalPages(data.pagination.totalPages)
        setError('')
      } else {
        setError(data.message || 'Failed to fetch batches')
      }
    } catch (err) {
      setError('Error connecting to server')
      console.error('Error fetching market batches:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMarketBatches()
  }, [currentPage, filters])

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  // Calculate aflatoxin safety
  const getSafetyInfo = (aflatoxin) => {
    const level = parseFloat(aflatoxin) || 0
    
    if (level >= 0 && level <= 5) {
      return { label: 'Safe for Children', color: 'green', icon: CheckCircle }
    } else if (level > 5 && level <= 10) {
      return { label: 'Adults Only', color: 'yellow', icon: AlertTriangle }
    } else if (level > 10 && level <= 20) {
      return { label: 'Animal Feed Only', color: 'orange', icon: AlertTriangle }
    } else {
      return { label: 'Not Safe', color: 'red', icon: XCircle }
    }
  }

  // FIXED: Handle order submission with better error handling
  const handleOrderSubmit = async () => {
    setOrderSubmitting(true)
    setOrderError('')

    try {
      const orderQuantity = parseFloat(orderForm.quantity)
      
      if (!orderQuantity || orderQuantity <= 0) {
        throw new Error('Please enter a valid quantity')
      }

      if (orderQuantity > selectedBatch.availableQuantity) {
        throw new Error(`Maximum available quantity is ${selectedBatch.availableQuantity}kg`)
      }

      // Validate required fields
      if (!orderForm.buyerDetails.name.trim()) {
        throw new Error('Please enter your name')
      }
      if (!orderForm.buyerDetails.email.trim()) {
        throw new Error('Please enter your email')
      }
      if (!orderForm.deliveryAddress.street.trim()) {
        throw new Error('Please enter delivery street address')
      }
      if (!orderForm.deliveryAddress.city.trim()) {
        throw new Error('Please enter delivery city')
      }

      console.log('Submitting order for batch:', selectedBatch._id)

      const response = await fetch(`https://back-cap.onrender.com/api/batches/${selectedBatch._id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantityPurchased: orderQuantity,
          buyerUserId: user.id,
          buyerUserName: orderForm.buyerDetails.name,
          buyerEmail: orderForm.buyerDetails.email,
          buyerContact: orderForm.buyerDetails.phone,
          deliveryAddress: orderForm.deliveryAddress,
          notes: orderForm.notes
        })
      })

      const data = await response.json()
      console.log('Order response:', data)

      if (data.success) {
        // Enhanced error checking for the response structure
        if (data.data && data.data.order && data.data.order.orderId && data.data.purchaseDetails) {
          const orderId = data.data.order.orderId
          const totalAmount = data.data.purchaseDetails.totalAmount
          
          setOrderSuccess(`Order placed successfully! Order ID: ${orderId} | Total: ${totalAmount.toFixed(2)} Rwf`)
          setShowOrderModal(false)
          resetOrderForm()
          fetchMarketBatches() // Refresh batches
        } else {
          console.error('Unexpected response structure:', data)
          setOrderSuccess('Order placed successfully! Please check your email for details.')
          setShowOrderModal(false)
          resetOrderForm()
          fetchMarketBatches()
        }
      } else {
        throw new Error(data.message || 'Failed to place order')
      }
    } catch (err) {
      console.error('Order submission error:', err)
      setOrderError(err.message || 'An error occurred while placing the order')
    } finally {
      setOrderSubmitting(false)
    }
  }

  // Reset order form
  const resetOrderForm = () => {
    setOrderForm({
      quantity: '',
      buyerDetails: {
        name: '',
        email: '',
        organization: '',
        phone: ''
      },
      deliveryAddress: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Rwanda'
      },
      notes: ''
    })
  }

  // Open order modal
  const openOrderModal = (batch) => {
    setSelectedBatch(batch)
    setOrderForm(prev => ({
      ...prev,
      buyerDetails: {
        name: user.name,
        email: user.email,
        organization: '',
        phone: ''
      }
    }))
    setShowOrderModal(true)
    setOrderError('')
    setOrderSuccess('')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-4">Grain Marketplace</h1>
          <p className="text-xl text-gray-600 font-light">Quality-tested grain batches ready for purchase</p>
        </div>

        {/* Success Message */}
        {orderSuccess && (
          <div className="mb-6 p-4 bg-green-50/80 border border-green-200/50 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <p className="text-green-700 font-medium">{orderSuccess}</p>
              <button 
                onClick={() => setOrderSuccess('')}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-white/20 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by supplier..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 backdrop-blur-sm"
              />
            </div>

            {/* Price Range */}
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 backdrop-blur-sm"
                step="0.01"
              />
              <input
                type="number"
                placeholder="Max price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 backdrop-blur-sm"
                step="0.01"
              />
            </div>

            {/* Min Quantity */}
            <div>
              <input
                type="number"
                placeholder="Min quantity (kg)"
                value={filters.minQuantity}
                onChange={(e) => handleFilterChange('minQuantity', e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 backdrop-blur-sm"
              />
            </div>

            {/* Sort */}
            <div className="flex space-x-2">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="flex-1 px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 backdrop-blur-sm"
              >
                <option value="marketListedAt">Date Listed</option>
                <option value="pricePerKg">Price</option>
                <option value="availableQuantity">Quantity</option>
                <option value="supplier">Supplier</option>
              </select>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 backdrop-blur-sm"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/40 p-6 rounded-2xl">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Batches</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchMarketBatches}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Batch Grid */}
        {!loading && !error && (
          <>
            {batches.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Batches Available</h3>
                <p className="text-gray-600">No batches match your current filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {batches.map((batch) => {
                  const safety = getSafetyInfo(batch.aflatoxin)
                  const SafetyIcon = safety.icon
                  
                  return (
                    <div key={batch._id} className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/70">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-medium text-gray-900 mb-1">{batch.batchId}</h3>
                          <p className="text-gray-600 flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            {batch.supplier}
                          </p>
                        </div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          safety.color === 'green' ? 'text-green-700 bg-green-100/80' :
                          safety.color === 'yellow' ? 'text-yellow-700 bg-yellow-100/80' :
                          safety.color === 'orange' ? 'text-orange-700 bg-orange-100/80' :
                          'text-red-700 bg-red-100/80'
                        }`}>
                          <SafetyIcon className="w-4 h-4 mr-1" />
                          {safety.label}
                        </div>
                      </div>

                      {/* Price and Quantity */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white/50 p-4 rounded-xl">
                          <p className="text-sm text-gray-600 mb-1">Price per kg</p>
                          <p className="text-2xl font-light text-gray-900">{batch.pricePerKg} Rwf</p>
                        </div>
                        <div className="bg-white/50 p-4 rounded-xl">
                          <p className="text-sm text-gray-600 mb-1">Available</p>
                          <p className="text-2xl font-light text-gray-900">{batch.availableQuantity}kg</p>
                        </div>
                      </div>

                      {/* Quality Highlights */}
                      <div className="mb-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Moisture:</span>
                            <span className="font-medium">{Number(batch.moisture_maize_grain).toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Aflatoxin:</span>
                            <span className="font-medium">{Number(batch.aflatoxin).toFixed(2)} ppb</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Broken:</span>
                            <span className="font-medium">{Number(batch.broken_kernels_percent_maize_grain).toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Foreign:</span>
                            <span className="font-medium">{Number(batch.foreign_matter_percent_maize_grain).toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                        <div className="text-sm text-gray-600 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Listed {formatDate(batch.marketListedAt)}
                        </div>
                        <button
                          onClick={() => openOrderModal(batch)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Order</span>
                        </button>
                      </div>

                      {/* Total Value */}
                      <div className="mt-3 pt-3 border-t border-gray-200/50">
                        <p className="text-center text-lg font-medium text-gray-900">
                          Total Value: {(batch.availableQuantity * batch.pricePerKg).toFixed(2)} Rwf
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/60 border border-gray-200/50 rounded-xl disabled:opacity-50 hover:bg-white/80 transition-colors"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-xl transition-colors ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/60 border border-gray-200/50 hover:bg-white/80'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/60 border border-gray-200/50 rounded-xl disabled:opacity-50 hover:bg-white/80 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Enhanced Order Modal */}
        {showOrderModal && selectedBatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/20 backdrop-blur-xl"
              onClick={() => setShowOrderModal(false)}
            />
            
            <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20">
              {/* Header */}
              <div className="px-8 py-6 border-b border-white/10">
                <h2 className="text-2xl font-light text-gray-900">Place Order</h2>
                <p className="text-gray-600 mt-1">Batch: {selectedBatch.batchId} from {selectedBatch.supplier}</p>
              </div>

              {/* Content */}
              <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
                {orderError && (
                  <div className="mb-6 p-4 bg-red-50/80 border border-red-200/50 rounded-2xl">
                    <div className="flex items-center">
                      <XCircle className="w-5 h-5 text-red-600 mr-3" />
                      <p className="text-red-700 font-medium">{orderError}</p>
                    </div>
                  </div>
                )}

                {/* Batch Summary */}
                <div className="bg-gray-50/80 p-6 rounded-2xl mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Batch Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Supplier:</span>
                      <span className="ml-2 font-medium">{selectedBatch.supplier}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Price per kg:</span>
                      <span className="ml-2 font-medium">{selectedBatch.pricePerKg} Rwf</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Available:</span>
                      <span className="ml-2 font-medium">{selectedBatch.availableQuantity}kg</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Safety:</span>
                      <span className="ml-2 font-medium">{getSafetyInfo(selectedBatch.aflatoxin).label}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Order Details */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
                    
                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity (kg) *
                      </label>
                      <input
                        type="number"
                        value={orderForm.quantity}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, quantity: e.target.value }))}
                        placeholder={`Max: ${selectedBatch.availableQuantity}kg`}
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                        step="0.1"
                        min="0.1"
                        max={selectedBatch.availableQuantity}
                        required
                      />
                    </div>

                    {/* Buyer Details */}
                    <h4 className="text-md font-medium text-gray-900">Contact Information</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="w-4 h-4 inline mr-1" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={orderForm.buyerDetails.name}
                          onChange={(e) => setOrderForm(prev => ({
                            ...prev,
                            buyerDetails: { ...prev.buyerDetails, name: e.target.value }
                          }))}
                          className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={orderForm.buyerDetails.email}
                          onChange={(e) => setOrderForm(prev => ({
                            ...prev,
                            buyerDetails: { ...prev.buyerDetails, email: e.target.value }
                          }))}
                          className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={orderForm.buyerDetails.phone}
                          onChange={(e) => setOrderForm(prev => ({
                            ...prev,
                            buyerDetails: { ...prev.buyerDetails, phone: e.target.value }
                          }))}
                          placeholder="+250 XXX XXX XXX"
                          className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Building className="w-4 h-4 inline mr-1" />
                          Organization/Company
                        </label>
                        <input
                          type="text"
                          value={orderForm.buyerDetails.organization}
                          onChange={(e) => setOrderForm(prev => ({
                            ...prev,
                            buyerDetails: { ...prev.buyerDetails, organization: e.target.value }
                          }))}
                          placeholder="Optional"
                          className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Delivery & Notes */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Delivery Information</h3>
                    
                    {/* Delivery Address */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          Street Address *
                        </label>
                        <input
                          type="text"
                          value={orderForm.deliveryAddress.street}
                          onChange={(e) => setOrderForm(prev => ({
                            ...prev,
                            deliveryAddress: { ...prev.deliveryAddress, street: e.target.value }
                          }))}
                          placeholder="Street address, building, etc."
                          className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                          <input
                            type="text"
                            value={orderForm.deliveryAddress.city}
                            onChange={(e) => setOrderForm(prev => ({
                              ...prev,
                              deliveryAddress: { ...prev.deliveryAddress, city: e.target.value }
                            }))}
                            className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Province/State</label>
                          <input
                            type="text"
                            value={orderForm.deliveryAddress.state}
                            onChange={(e) => setOrderForm(prev => ({
                              ...prev,
                              deliveryAddress: { ...prev.deliveryAddress, state: e.target.value }
                            }))}
                            className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                          <input
                            type="text"
                            value={orderForm.deliveryAddress.postalCode}
                            onChange={(e) => setOrderForm(prev => ({
                              ...prev,
                              deliveryAddress: { ...prev.deliveryAddress, postalCode: e.target.value }
                            }))}
                            className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                          <input
                            type="text"
                            value={orderForm.deliveryAddress.country}
                            onChange={(e) => setOrderForm(prev => ({
                              ...prev,
                              deliveryAddress: { ...prev.deliveryAddress, country: e.target.value }
                            }))}
                            className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MessageSquare className="w-4 h-4 inline mr-1" />
                        Special Instructions
                      </label>
                      <textarea
                        value={orderForm.notes}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any special delivery instructions or notes..."
                        rows={4}
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 resize-none"
                      />
                    </div>

                    {/* Order Summary */}
                    {orderForm.quantity && (
                      <div className="bg-blue-50/80 p-6 rounded-2xl">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Quantity:</span>
                            <span className="font-medium">{orderForm.quantity}kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Price per kg:</span>
                            <span className="font-medium">{selectedBatch.pricePerKg} Rwf</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 text-lg font-bold">
                            <span>Total Amount:</span>
                            <span>{(parseFloat(orderForm.quantity) * selectedBatch.pricePerKg).toFixed(2)} Rwf</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-white/10 flex space-x-4">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 py-3 px-6 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOrderSubmit}
                  disabled={orderSubmitting || !orderForm.quantity || !orderForm.buyerDetails.name || !orderForm.buyerDetails.email || !orderForm.deliveryAddress.street || !orderForm.deliveryAddress.city}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {orderSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}