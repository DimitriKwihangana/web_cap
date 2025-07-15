import { useState, useEffect, useCallback } from 'react'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  AlertTriangle, 
  Eye, 
  Edit3, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign,
  Filter,
  Search,
  RefreshCw,
  Plus,
  Building2,
  TrendingUp,
  BarChart3,
  Download,
  ArrowUpDown
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export default function OrderManagementDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statistics, setStatistics] = useState([])
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    searchTerm: '',
    sortBy: 'orderDate',
    sortOrder: 'desc'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    sellerNotes: '',
    trackingNumber: '',
    estimatedDelivery: ''
  })
  const [updating, setUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState('')
  const [updateError, setUpdateError] = useState('')

  // Mock seller data - replace with actual user context/auth
  const { user } = useApp();
console.log(user)
const seller = {
  id: user?.id || '',            
  name: user?.name || '',          
  email: user?.email || ''         
};

  // Status configurations
  const statusConfig = {
    pending: { 
      label: 'Pending', 
      color: 'orange', 
      bgColor: 'bg-orange-100/80', 
      textColor: 'text-orange-700', 
      icon: Clock,
      description: 'Awaiting confirmation from seller'
    },
    confirmed: { 
      label: 'Confirmed', 
      color: 'blue', 
      bgColor: 'bg-blue-100/80', 
      textColor: 'text-blue-700', 
      icon: CheckCircle,
      description: 'Order confirmed, preparing for shipment'
    },
    preparing: { 
      label: 'Preparing', 
      color: 'purple', 
      bgColor: 'bg-purple-100/80', 
      textColor: 'text-purple-700', 
      icon: Package,
      description: 'Order is being prepared for shipment'
    },
    shipped: { 
      label: 'Shipped', 
      color: 'green', 
      bgColor: 'bg-green-100/80', 
      textColor: 'text-green-700', 
      icon: Truck,
      description: 'Order has been shipped to buyer'
    },
    delivered: { 
      label: 'Delivered', 
      color: 'emerald', 
      bgColor: 'bg-emerald-100/80', 
      textColor: 'text-emerald-700', 
      icon: CheckCircle,
      description: 'Order successfully delivered'
    },
    rejected: { 
      label: 'Rejected', 
      color: 'red', 
      bgColor: 'bg-red-100/80', 
      textColor: 'text-red-700', 
      icon: XCircle,
      description: 'Order has been rejected'
    },
    cancelled: { 
      label: 'Cancelled', 
      color: 'gray', 
      bgColor: 'bg-gray-100/80', 
      textColor: 'text-gray-700', 
      icon: XCircle,
      description: 'Order has been cancelled'
    }
  }

  // Fetch orders for seller with useCallback to prevent infinite re-renders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '15',
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.searchTerm && { search: filters.searchTerm }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      })

      const response = await fetch(`https://back-cap.onrender.com/api/batches/orders/seller/${seller.id}?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      if (data.success) {
        setOrders(data.data || [])
        setStatistics(data.statistics || [])
        setTotalPages(data.pagination?.totalPages || 1)
        setTotalItems(data.pagination?.totalItems || 0)
        setError('')
      } else {
        throw new Error(data.message || 'Failed to fetch orders')
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err.message || 'Error connecting to server')
      setOrders([])
      setStatistics([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, filters, seller.id])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  // Handle status update
  const handleStatusUpdate = async () => {
    if (updating) return
    
    setUpdating(true)
    setUpdateError('')

    try {
      // Validation
      if (statusUpdate.status === 'shipped' && !statusUpdate.trackingNumber.trim()) {
        throw new Error('Tracking number is required when marking as shipped')
      }

      const response = await fetch(`https://back-cap.onrender.com/api/batches/orders/${selectedOrder.orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerId: seller.id,
          status: statusUpdate.status,
          sellerNotes: statusUpdate.sellerNotes.trim(),
          trackingNumber: statusUpdate.trackingNumber.trim(),
          estimatedDelivery: statusUpdate.estimatedDelivery || null
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setUpdateSuccess(`Order status updated to ${statusConfig[statusUpdate.status]?.label || statusUpdate.status}`)
        setShowStatusModal(false)
        resetStatusUpdate()
        await fetchOrders() // Refresh orders
        
        // Clear success message after 5 seconds
        setTimeout(() => setUpdateSuccess(''), 5000)
      } else {
        throw new Error(data.message || 'Failed to update order status')
      }
    } catch (err) {
      console.error('Status update error:', err)
      setUpdateError(err.message || 'Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  // Reset status update form
  const resetStatusUpdate = () => {
    setStatusUpdate({
      status: '',
      sellerNotes: '',
      trackingNumber: '',
      estimatedDelivery: ''
    })
  }

  // Open status update modal
  const openStatusModal = (order, newStatus) => {
    setSelectedOrder(order)
    setStatusUpdate({
      status: newStatus,
      sellerNotes: order.sellerNotes || '',
      trackingNumber: order.trackingNumber || '',
      estimatedDelivery: order.estimatedDelivery ? 
        new Date(order.estimatedDelivery).toISOString().split('T')[0] : ''
    })
    setShowStatusModal(true)
    setUpdateError('')
    setUpdateSuccess('')
  }

  // Open order details modal
  const openOrderModal = (order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  // Get next possible statuses based on current status
  const getNextStatuses = (currentStatus) => {
    const workflows = {
      pending: ['confirmed', 'rejected'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      rejected: [],
      cancelled: []
    }
    return workflows[currentStatus] || []
  }

  // Format date with error handling
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  // Calculate statistics totals
  const totalOrders = statistics.reduce((sum, stat) => sum + (stat.count || 0), 0)
  const totalRevenue = statistics.reduce((sum, stat) => sum + (stat.totalAmount || 0), 0)

  // Get status icon component
  const getStatusIcon = (status) => {
    const config = statusConfig[status]
    return config ? config.icon : Clock
  }

  // Handle search with debouncing
  const handleSearch = (searchTerm) => {
    handleFilterChange('searchTerm', searchTerm)
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: '',
      startDate: '',
      endDate: '',
      searchTerm: '',
      sortBy: 'orderDate',
      sortOrder: 'desc'
    })
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-4">Order Management</h1>
              <p className="text-xl text-gray-600 font-light">
                Manage orders for your grain batches • {totalItems} total orders
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="px-4 py-2 bg-white/60 border border-gray-200/50 rounded-xl hover:bg-white/80 transition-colors disabled:opacity-50"
                title="Refresh orders"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {updateSuccess && (
          <div className="mb-6 p-4 bg-green-50/80 border border-green-200/50 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <p className="text-green-700 font-medium">{updateSuccess}</p>
              <button 
                onClick={() => setUpdateSuccess('')}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-light text-gray-900">{totalOrders}</p>
                <p className="text-sm text-gray-500">All time</p>
              </div>
              <div className="bg-blue-100/80 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-light text-gray-900">{totalRevenue.toLocaleString()} Rwf</p>
                <p className="text-sm text-gray-500">All orders</p>
              </div>
              <div className="bg-green-100/80 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Status Breakdown - Show top 2 statuses */}
          {statistics.slice(0, 2).map((stat) => {
            const config = statusConfig[stat._id] || statusConfig.pending
            const StatusIcon = config.icon
            return (
              <div key={stat._id} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{config.label} Orders</p>
                    <p className="text-3xl font-light text-gray-900">{stat.count}</p>
                    <p className="text-sm text-gray-500">{(stat.totalAmount || 0).toLocaleString()} Rwf</p>
                  </div>
                  <div className={`${config.bgColor} p-3 rounded-xl`}>
                    <StatusIcon className={`w-6 h-6 ${config.textColor}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, buyers..."
                value={filters.searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
              >
                <option value="">All Statuses</option>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                placeholder="Start Date"
              />
            </div>

            <div>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                placeholder="End Date"
              />
            </div>

            {/* Sort */}
            <div>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
              >
                <option value="orderDate">Order Date</option>
                <option value="totalAmount">Amount</option>
                <option value="quantityOrdered">Quantity</option>
                <option value="status">Status</option>
                <option value="buyerName">Buyer Name</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl hover:bg-white/80 transition-colors"
                title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <ArrowUpDown className="w-5 h-5" />
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                title="Clear all filters"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="w-20 h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Orders Table */}
        {!loading && !error && (
          <>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
                <p className="text-gray-600">
                  {Object.values(filters).some(f => f) ? 
                    'No orders match your current filters.' : 
                    'You haven\'t received any orders yet.'
                  }
                </p>
                {Object.values(filters).some(f => f) && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/80 border-b border-gray-200/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Order</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Buyer</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Batch</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Quantity</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50">
                      {orders.map((order) => {
                        const config = statusConfig[order.status] || statusConfig.pending
                        const StatusIcon = config.icon
                        const nextStatuses = getNextStatuses(order.status)
                        
                        return (
                          <tr key={order._id} className="hover:bg-white/40 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900">{order.orderId}</p>
                                <p className="text-sm text-gray-600">{formatDate(order.orderDate)}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900">{order.buyerName}</p>
                                <p className="text-sm text-gray-600">{order.buyerEmail}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900">{order.batchNumber}</p>
                                <p className="text-sm text-gray-600">{order.batchId?.supplier || 'N/A'}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-gray-900">{order.quantityOrdered} kg</p>
                              <p className="text-sm text-gray-600">{order.pricePerKg} Rwf/kg</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-gray-900">{order.totalAmount.toLocaleString()} Rwf</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
                                <StatusIcon className="w-4 h-4 mr-1" />
                                {config.label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-600">{formatDate(order.orderDate)}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => openOrderModal(order)}
                                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                
                                {nextStatuses.length > 0 && (
                                  <div className="relative group">
                                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                      <div className="p-2">
                                        {nextStatuses.map(status => {
                                          const statusConf = statusConfig[status]
                                          const StatusConfIcon = statusConf.icon
                                          return (
                                            <button
                                              key={status}
                                              onClick={() => openStatusModal(order, status)}
                                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center"
                                            >
                                              <StatusConfIcon className="w-4 h-4 mr-2" />
                                              Mark as {statusConf.label}
                                            </button>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 p-6 border-t border-gray-200/50">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white/60 border border-gray-200/50 rounded-xl disabled:opacity-50 hover:bg-white/80 transition-colors"
                    >
                      Previous
                    </button>
                    
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white/60 border border-gray-200/50 rounded-xl disabled:opacity-50 hover:bg-white/80 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/20 backdrop-blur-xl"
              onClick={() => setShowOrderModal(false)}
            />
            
            <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20">
              {/* Header */}
              <div className="px-8 py-6 border-b border-white/10">
                <h2 className="text-2xl font-light text-gray-900">Order Details</h2>
                <p className="text-gray-600 mt-1">Order ID: {selectedOrder.orderId}</p>
              </div>

              {/* Content */}
              <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Order Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Order Information</h3>
                      <div className="bg-gray-50/80 p-4 rounded-xl space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-medium">{selectedOrder.orderId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Batch:</span>
                          <span className="font-medium">{selectedOrder.batchNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-medium">{selectedOrder.quantityOrdered} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price per kg:</span>
                          <span className="font-medium">{selectedOrder.pricePerKg} Rwf</span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                          <span className="text-gray-600 font-medium">Total Amount:</span>
                          <span className="font-bold text-lg">{selectedOrder.totalAmount.toLocaleString()} Rwf</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Buyer Information</h3>
                      <div className="bg-gray-50/80 p-4 rounded-xl space-y-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-600" />
                          <span className="font-medium">{selectedOrder.buyerName}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-600" />
                          <span>{selectedOrder.buyerEmail}</span>
                        </div>
                        {selectedOrder.buyerContact && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-600" />
                            <span>{selectedOrder.buyerContact}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedOrder.deliveryAddress && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Address</h3>
                        <div className="bg-gray-50/80 p-4 rounded-xl">
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 mr-2 text-gray-600 mt-1" />
                            <div>
                              <p>{selectedOrder.deliveryAddress.street}</p>
                              <p>{selectedOrder.deliveryAddress.city}{selectedOrder.deliveryAddress.state && `, ${selectedOrder.deliveryAddress.state}`}</p>
                              <p>{selectedOrder.deliveryAddress.postalCode} {selectedOrder.deliveryAddress.country}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Status & Notes */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
                      <div className="bg-gray-50/80 p-4 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Current Status:</span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[selectedOrder.status]?.bgColor} ${statusConfig[selectedOrder.status]?.textColor}`}>
                            {statusConfig[selectedOrder.status]?.label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Date:</span>
                          <span className="font-medium">{formatDate(selectedOrder.orderDate)}</span>
                        </div>
                        {selectedOrder.confirmedAt && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Confirmed:</span>
                            <span className="font-medium">{formatDate(selectedOrder.confirmedAt)}</span>
                          </div>
                        )}
                        {selectedOrder.shippedAt && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipped:</span>
                            <span className="font-medium">{formatDate(selectedOrder.shippedAt)}</span>
                          </div>
                        )}
                        {selectedOrder.deliveredAt && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivered:</span>
                            <span className="font-medium">{formatDate(selectedOrder.deliveredAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedOrder.trackingNumber && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tracking Information</h3>
                        <div className="bg-gray-50/80 p-4 rounded-xl">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tracking Number:</span>
                            <span className="font-medium">{selectedOrder.trackingNumber}</span>
                          </div>
                          {selectedOrder.estimatedDelivery && (
                            <div className="flex justify-between mt-2">
                              <span className="text-gray-600">Estimated Delivery:</span>
                              <span className="font-medium">{new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {(selectedOrder.notes || selectedOrder.sellerNotes) && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
                        <div className="space-y-3">
                          {selectedOrder.notes && (
                            <div className="bg-blue-50/80 p-4 rounded-xl">
                              <p className="text-sm font-medium text-blue-900 mb-1">Buyer Notes:</p>
                              <p className="text-blue-800">{selectedOrder.notes}</p>
                            </div>
                          )}
                          {selectedOrder.sellerNotes && (
                            <div className="bg-green-50/80 p-4 rounded-xl">
                              <p className="text-sm font-medium text-green-900 mb-1">Seller Notes:</p>
                              <p className="text-green-800">{selectedOrder.sellerNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/20 backdrop-blur-xl"
              onClick={() => setShowStatusModal(false)}
            />
            
            <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-2xl w-full border border-white/20">
              {/* Header */}
              <div className="px-8 py-6 border-b border-white/10">
                <h2 className="text-2xl font-light text-gray-900">Update Order Status</h2>
                <p className="text-gray-600 mt-1">Order: {selectedOrder.orderId}</p>
              </div>

              {/* Content */}
              <div className="px-8 py-6">
                {updateError && (
                  <div className="mb-6 p-4 bg-red-50/80 border border-red-200/50 rounded-2xl">
                    <div className="flex items-center">
                      <XCircle className="w-5 h-5 text-red-600 mr-3" />
                      <p className="text-red-700 font-medium">{updateError}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Status
                    </label>
                    <div className={`p-4 rounded-xl ${statusConfig[statusUpdate.status]?.bgColor || 'bg-gray-100'}`}>
                      <div className="flex items-center">
                        {(() => {
                          const StatusIcon = getStatusIcon(statusUpdate.status)
                          return (
                            <StatusIcon className={`w-5 h-5 mr-2 ${statusConfig[statusUpdate.status]?.textColor || 'text-gray-600'}`} />
                          )
                        })()}
                        <span className={`font-medium ${statusConfig[statusUpdate.status]?.textColor || 'text-gray-600'}`}>
                          {statusConfig[statusUpdate.status]?.label || 'Unknown Status'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {statusConfig[statusUpdate.status]?.description || 'Status update'}
                      </p>
                    </div>
                  </div>

                  {/* Tracking Number */}
                  {(statusUpdate.status === 'shipped' || statusUpdate.status === 'preparing') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tracking Number {statusUpdate.status === 'shipped' ? '(Required)' : '(Optional)'}
                      </label>
                      <input
                        type="text"
                        value={statusUpdate.trackingNumber}
                        onChange={(e) => setStatusUpdate(prev => ({ ...prev, trackingNumber: e.target.value }))}
                        placeholder="Enter tracking number"
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                        required={statusUpdate.status === 'shipped'}
                      />
                    </div>
                  )}

                  {/* Estimated Delivery */}
                  {(statusUpdate.status === 'shipped' || statusUpdate.status === 'preparing') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Delivery Date
                      </label>
                      <input
                        type="date"
                        value={statusUpdate.estimatedDelivery}
                        onChange={(e) => setStatusUpdate(prev => ({ ...prev, estimatedDelivery: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                      />
                    </div>
                  )}

                  {/* Seller Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes for Buyer
                    </label>
                    <textarea
                      value={statusUpdate.sellerNotes}
                      onChange={(e) => setStatusUpdate(prev => ({ ...prev, sellerNotes: e.target.value }))}
                      placeholder="Add any notes for the buyer..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 resize-none"
                      maxLength={500}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {statusUpdate.sellerNotes.length}/500 characters
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-white/10 flex space-x-4">
                <button
                  onClick={() => setShowStatusModal(false)}
                  disabled={updating}
                  className="flex-1 py-3 px-6 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || (statusUpdate.status === 'shipped' && !statusUpdate.trackingNumber?.trim())}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}