import { useState, useEffect } from 'react'
import { Search, Filter, ShoppingCart, Package, DollarSign, Calendar, User, Building, CheckCircle, AlertTriangle, XCircle, Eye, MapPin, Phone, MessageSquare, ArrowLeft, Clock, Truck, Star, FileText } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export default function MarketplacePage() {
  const { user, loading: appLoading } = useApp()
  const [currentView, setCurrentView] = useState('marketplace') // 'marketplace' or 'orders'
  const [batches, setBatches] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
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
  const [expandedOrders, setExpandedOrders] = useState(new Set())

  // Format numbers with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Number(num) || 0)
  }

  // Toggle order expansion
  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  // Fetch user orders
  const fetchUserOrders = async () => {
    if (!user?.email) return
    
    try {
      setOrdersLoading(true)
      const response = await fetch(`https://back-cap.onrender.com/api/batches/orders/buyer/${encodeURIComponent(user.email)}`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.data)
      } else {
        console.error('Failed to fetch orders:', data.message)
      }
    } catch (err) {
      console.error('Error fetching user orders:', err)
    } finally {
      setOrdersLoading(false)
    }
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
    if (currentView === 'marketplace') {
      fetchMarketBatches()
    } else if (currentView === 'orders') {
      fetchUserOrders()
    }
  }, [currentPage, filters, currentView, user])

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

  // Get order status styling
  const getOrderStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
      preparing: { label: 'Preparing', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Package },
      shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Truck },
      delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-200', icon: Star },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
      cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle }
    }
    return statusMap[status] || statusMap.pending
  }

  // Handle order submission
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

      if (!user?.name?.trim()) {
        throw new Error('User name not available. Please ensure you are logged in.')
      }
      if (!user?.email?.trim()) {
        throw new Error('User email not available. Please ensure you are logged in.')
      }
      if (!orderForm.deliveryAddress.street.trim()) {
        throw new Error('Please enter delivery street address')
      }
      if (!orderForm.deliveryAddress.city.trim()) {
        throw new Error('Please enter delivery city')
      }

      const response = await fetch(`https://back-cap.onrender.com/api/batches/${selectedBatch._id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantityPurchased: orderQuantity,
          buyerUserId: user.id,
          buyerUserName: user.name,
          buyerEmail: user.email,
          buyerContact: orderForm.buyerDetails.phone,
          deliveryAddress: orderForm.deliveryAddress,
          notes: orderForm.notes
        })
      })

      const data = await response.json()

      if (data.success) {
        if (data.data && data.data.order && data.data.order.orderId && data.data.purchaseDetails) {
          const orderId = data.data.order.orderId
          const totalAmount = data.data.purchaseDetails.totalAmount
          
          setOrderSuccess(`Order placed successfully! Order ID: ${orderId} | Total: ${formatNumber(totalAmount)} Rwf`)
          setShowOrderModal(false)
          resetOrderForm()
          fetchMarketBatches() // Refresh batches
        } else {
          setOrderSuccess('Order placed successfully! Please check your email for details.')
          setShowOrderModal(false)
          resetOrderForm()
          fetchMarketBatches()
        }
      } else {
        throw new Error(data.message || 'Failed to place order')
      }
    } catch (err) {
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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Show loading if app is still loading user data
  if (appLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show message if user not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600">Please log in to access the marketplace.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-2">
                {currentView === 'marketplace' ? 'Grain Marketplace' : 'My Orders'}
              </h1>
              <p className="text-xl text-gray-600 font-light">
                {currentView === 'marketplace' 
                  ? 'Quality-tested grain batches ready for purchase'
                  : 'Track your orders and delivery status'
                }
              </p>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('marketplace')}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  currentView === 'marketplace'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80 border border-gray-200/50'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Marketplace</span>
              </button>
              <button
                onClick={() => setCurrentView('orders')}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 flex items-center space-x-2 relative ${
                  currentView === 'orders'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80 border border-gray-200/50'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>My Orders</span>
                {orders.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {orders.length}
                  </span>
                )}
              </button>
            </div>
          </div>
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

        {/* MARKETPLACE VIEW */}
        {currentView === 'marketplace' && (
          <>
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
                              <p className="text-2xl font-light text-gray-900">{formatNumber(batch.pricePerKg)} Rwf</p>
                            </div>
                            <div className="bg-white/50 p-4 rounded-xl">
                              <p className="text-sm text-gray-600 mb-1">Available</p>
                              <p className="text-2xl font-light text-gray-900">{formatNumber(batch.availableQuantity)}kg</p>
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
                              Total Value: {formatNumber(batch.availableQuantity * batch.pricePerKg)} Rwf
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
          </>
        )}

        {/* ORDERS VIEW */}
        {currentView === 'orders' && (
          <>
            {ordersLoading ? (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 bg-gray-100/50 rounded-xl">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="flex-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-28"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
                <button
                  onClick={() => setCurrentView('marketplace')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
                {/* List Header */}
                <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200/50">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                    <div className="col-span-3">Order Details</div>
                    <div className="col-span-2">Batch</div>
                    <div className="col-span-2">Seller</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-1 text-center">Action</div>
                  </div>
                </div>

                {/* Orders List */}
                <div className="divide-y divide-gray-200/30">
                  {orders.map((order) => {
                    const statusInfo = getOrderStatusInfo(order.status)
                    const StatusIcon = statusInfo.icon
                    const isExpanded = expandedOrders.has(order._id)
                    
                    return (
                      <div key={order._id} className="hover:bg-white/40 transition-colors duration-150">
                        {/* Main Row */}
                        <div className="px-6 py-4">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            {/* Order Details */}
                            <div className="col-span-3">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <p className="font-medium text-gray-900">#{order.orderId}</p>
                                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${statusInfo.color}`}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusInfo.label}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Batch */}
                            <div className="col-span-2">
                              <p className="font-medium text-gray-900">{order.batchNumber}</p>
                              <p className="text-sm text-gray-600">{formatNumber(order.quantityOrdered)}kg</p>
                            </div>

                            {/* Seller */}
                            <div className="col-span-2">
                              <p className="font-medium text-gray-900">{order.sellerName}</p>
                            </div>

                            {/* Amount */}
                            <div className="col-span-2">
                              <p className="font-medium text-gray-900">{formatNumber(order.totalAmount)} Rwf</p>
                              <p className="text-sm text-gray-600">{formatNumber(order.pricePerKg)} Rwf/kg</p>
                            </div>

                            {/* Date */}
                            <div className="col-span-2">
                              <p className="text-sm text-gray-900">{formatDate(order.orderDate)}</p>
                              <p className="text-xs text-gray-500">{formatDateTime(order.orderDate).split(',')[1]}</p>
                            </div>

                            {/* Action */}
                            <div className="col-span-1 text-center">
                              <button
                                onClick={() => toggleOrderExpansion(order._id)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100/80 transition-colors duration-150"
                                aria-label={isExpanded ? "Collapse details" : "Expand details"}
                              >
                                <svg 
                                  className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="px-6 pb-6 bg-gray-50/40">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
                              {/* Left Column */}
                              <div className="space-y-6">
                                {/* Order Summary */}
                                <div className="bg-white/70 rounded-xl p-5 border border-gray-200/50">
                                  <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                                    Order Summary
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">Order ID:</span>
                                      <span className="font-medium text-gray-900">#{order.orderId}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">Quantity:</span>
                                      <span className="font-medium text-gray-900">{formatNumber(order.quantityOrdered)} kg</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-gray-600">Unit Price:</span>
                                      <span className="font-medium text-gray-900">{formatNumber(order.pricePerKg)} Rwf</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-200/50">
                                      <span className="font-medium text-gray-900">Total Amount:</span>
                                      <span className="font-light text-lg text-gray-900">{formatNumber(order.totalAmount)} Rwf</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-white/70 rounded-xl p-5 border border-gray-200/50">
                                  <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-green-600" />
                                    Contact Information
                                  </h4>
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-sm text-gray-600 mb-1">Buyer</p>
                                      <p className="font-medium text-gray-900">{order.buyerName}</p>
                                      <p className="text-sm text-gray-600">{order.buyerEmail}</p>
                                      {order.buyerContact && (
                                        <p className="text-sm text-gray-600">{order.buyerContact}</p>
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600 mb-1">Seller</p>
                                      <p className="font-light text-gray-900">{order.sellerName}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right Column */}
                              <div className="space-y-6">
                                {/* Delivery Address */}
                                {order.deliveryAddress && (
                                  <div className="bg-white/70 rounded-xl p-5 border border-gray-200/50">
                                    <h4 className="font-light text-gray-900 mb-4 flex items-center">
                                      <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                                      Delivery Address
                                    </h4>
                                    <div className="text-gray-700 space-y-1">
                                      <p>{order.deliveryAddress.street}</p>
                                      <p>{order.deliveryAddress.city}{order.deliveryAddress.state ? `, ${order.deliveryAddress.state}` : ''}</p>
                                      <p>{order.deliveryAddress.postalCode} {order.deliveryAddress.country}</p>
                                    </div>
                                  </div>
                                )}

                                {/* Tracking Information */}
                                {(order.trackingNumber || order.estimatedDelivery) && (
                                  <div className="bg-white/70 rounded-xl p-5 border border-gray-200/50">
                                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                                      <Truck className="w-5 h-5 mr-2 text-blue-600" />
                                      Tracking Information
                                    </h4>
                                    <div className="space-y-3">
                                      {order.trackingNumber && (
                                        <div>
                                          <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                                          <p className="font-mono text-sm bg-gray-100/80 px-3 py-2 rounded-lg border">
                                            {order.trackingNumber}
                                          </p>
                                        </div>
                                      )}
                                      {order.estimatedDelivery && (
                                        <div>
                                          <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                                          <p className="font-medium text-gray-900">{formatDate(order.estimatedDelivery)}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Order Timeline */}
                                <div className="bg-white/70 rounded-xl p-5 border border-gray-200/50">
                                  <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                                    <Clock className="w-5 h-5 mr-2 text-orange-600" />
                                    Order Timeline
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="flex items-center text-sm">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                      <span className="text-gray-600">Order placed:</span>
                                      <span className="ml-auto font-medium text-gray-900">{formatDateTime(order.orderDate)}</span>
                                    </div>
                                    {order.confirmedAt && (
                                      <div className="flex items-center text-sm">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                        <span className="text-gray-600">Confirmed:</span>
                                        <span className="ml-auto font-medium text-gray-900">{formatDateTime(order.confirmedAt)}</span>
                                      </div>
                                    )}
                                    {order.shippedAt && (
                                      <div className="flex items-center text-sm">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                                        <span className="text-gray-600">Shipped:</span>
                                        <span className="ml-auto font-medium text-gray-900">{formatDateTime(order.shippedAt)}</span>
                                      </div>
                                    )}
                                    {order.deliveredAt && (
                                      <div className="flex items-center text-sm">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                                        <span className="text-gray-600">Delivered:</span>
                                        <span className="ml-auto font-medium text-gray-900">{formatDateTime(order.deliveredAt)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Notes Section */}
                            {(order.notes || order.sellerNotes) && (
                              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {order.notes && (
                                  <div className="bg-amber-50/70 rounded-xl p-5 border border-amber-200/50">
                                    <h4 className="font-medium text-amber-800 mb-3 flex items-center">
                                      <MessageSquare className="w-4 h-4 mr-2" />
                                      Your Notes
                                    </h4>
                                    <p className="text-amber-700 italic text-sm">"{order.notes}"</p>
                                  </div>
                                )}
                                {order.sellerNotes && (
                                  <div className="bg-emerald-50/70 rounded-xl p-5 border border-emerald-200/50">
                                    <h4 className="font-medium text-emerald-800 mb-3 flex items-center">
                                      <FileText className="w-4 h-4 mr-2" />
                                      Seller Message
                                    </h4>
                                    <p className="text-emerald-700 italic text-sm">"{order.sellerNotes}"</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
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
            
            <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-white/20 flex flex-col">
              {/* Header */}
              <div className="px-8 py-6 border-b border-white/10 flex-shrink-0">
                <h2 className="text-2xl font-light text-gray-900">Place Order</h2>
                <p className="text-gray-600 mt-1">Batch: {selectedBatch.batchId} from {selectedBatch.supplier}</p>
                <p className="text-sm text-blue-600 mt-2">Ordering as: {user.name} ({user.email})</p>
              </div>

              {/* Content - Scrollable */}
              <div className="px-8 py-6 flex-1 overflow-y-auto">
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
                      <span className="ml-2 font-medium">{formatNumber(selectedBatch.pricePerKg)} Rwf</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Available:</span>
                      <span className="ml-2 font-medium">{formatNumber(selectedBatch.availableQuantity)}kg</span>
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
                      <label className="block text-sm font-light text-gray-700 mb-2">
                        Quantity (kg) *
                      </label>
                      <input
                        type="number"
                        value={orderForm.quantity}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, quantity: e.target.value }))}
                        placeholder={`Max: ${formatNumber(selectedBatch.availableQuantity)}kg`}
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                        step="0.1"
                        min="0.1"
                        max={selectedBatch.availableQuantity}
                        required
                      />
                    </div>

                    {/* Additional Contact Info */}
                    <h4 className="text-md font-medium text-gray-900">Additional Information</h4>
                    <div className="grid grid-cols-1 gap-4">
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
                            <span className="font-medium">{formatNumber(orderForm.quantity)}kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Price per kg:</span>
                            <span className="font-medium">{formatNumber(selectedBatch.pricePerKg)} Rwf</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 text-lg font-bold">
                            <span>Total Amount:</span>
                            <span>{formatNumber(parseFloat(orderForm.quantity) * selectedBatch.pricePerKg)} Rwf</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer - Always Visible */}
              <div className="px-8 py-4 border-t border-white/10 flex space-x-4 flex-shrink-0 bg-white/90 backdrop-blur-sm">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 py-3 px-6 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOrderSubmit}
                  disabled={orderSubmitting || !orderForm.quantity || !orderForm.deliveryAddress.street || !orderForm.deliveryAddress.city}
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