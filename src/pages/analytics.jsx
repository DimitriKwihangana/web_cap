import { useState, useEffect, useMemo } from 'react'
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, 
  BarChart3, PieChart, Activity, Calendar, Filter,
  Users, Package, Zap, Eye
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  ScatterChart, Scatter, PieChart as RechartsPieChart, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import axios from 'axios'

export default function AdminAnalyticsDashboard() {
  console.log('🎯 Analytics Dashboard initialized')
  
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('all')
  const [selectedSupplier, setSelectedSupplier] = useState('all')
  const [activeView, setActiveView] = useState('overview')

  // Color schemes for charts - Emerald focused
  const colors = ['#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#6ee7b7', '#34d399', '#a7f3d0']
  const aflatoxinColors = { 
    children: '#10b981',    // 0-5 ppb - Safe for children (emerald-500)
    adults: '#f59e0b',      // 5-10 ppb - Adults only (amber-500) 
    animals: '#ef4444',     // 10-20 ppb - Animals only (red-500)
    unsafe: '#dc2626'       // 20+ ppb - Unsafe (red-600)
  }
  const emeraldPalette = {
    50: '#ecfdf5',
    100: '#d1fae5', 
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b'
  }

  // Fetch batches data
  const fetchBatches = async () => {
    console.log('🚀 fetchBatches called')
    try {
      setLoading(true)
      console.log('📡 Making API call to: http://localhost:5000/api/batches')
      const response = await axios.get('http://localhost:5000/api/batches')
      console.log('✅ API Response:', response.data)
      
      if (response.data.success) {
        console.log('📊 Batches data:', response.data.data)
        setBatches(response.data.data)
      }
    } catch (error) {
      console.error('❌ Error fetching batches:', error)
    } finally {
      setLoading(false)
    }
  }

  // Process and analyze data
  const analyticsData = useMemo(() => {
    console.log('🧮 Processing analytics data')
    if (!batches.length) return null

    // Filter data based on selections
    let filteredBatches = batches
    
    if (selectedSupplier !== 'all') {
      filteredBatches = filteredBatches.filter(batch => batch.supplier === selectedSupplier)
    }

    // Convert string numbers to actual numbers for calculations
    const processedBatches = filteredBatches.map(batch => ({
      ...batch,
      moisture: parseFloat(batch.moisture_maize_grain) || 0,
      immature: parseFloat(batch.Immaturegrains) || 0,
      discolored: parseFloat(batch.Discolored_grains) || 0,
      broken: parseFloat(batch.broken_kernels_percent_maize_grain) || 0,
      foreign: parseFloat(batch.foreign_matter_percent_maize_grain) || 0,
      pestDamaged: parseFloat(batch.pest_damaged) || 0,
      rotten: parseFloat(batch.rotten) || 0,
      aflatoxin: parseFloat(batch.aflatoxin) || 0,
      date: new Date(batch.date)
    }))

    // Calculate quality score (0-100)
    const calculateQualityScore = (batch) => {
      let score = 100
      score -= batch.moisture > 14 ? (batch.moisture - 14) * 2 : 0 // Penalty for high moisture
      score -= batch.immature * 3 // Penalty for immature grains
      score -= batch.discolored * 4 // Penalty for discolored grains
      score -= batch.broken * 2 // Penalty for broken kernels
      score -= batch.foreign * 5 // Penalty for foreign matter
      score -= batch.pestDamaged * 6 // Penalty for pest damage
      score -= batch.rotten * 8 // Heavy penalty for rotten grains
      score -= batch.aflatoxin > 5 ? (batch.aflatoxin - 5) * 10 : 0 // Heavy penalty for high aflatoxin
      return Math.max(0, Math.min(100, score))
    }

    // Aflatoxin safety classification
    const getAflatoxinCategory = (level) => {
      if (level <= 5) return { category: 'children', label: 'Safe for Children', color: aflatoxinColors.children }
      if (level <= 10) return { category: 'adults', label: 'Adults Only', color: aflatoxinColors.adults }
      if (level <= 20) return { category: 'animals', label: 'Animals Only', color: aflatoxinColors.animals }
      return { category: 'unsafe', label: 'Unsafe for Consumption', color: aflatoxinColors.unsafe }
    }

    // Add quality scores and aflatoxin categories
    const enrichedBatches = processedBatches.map(batch => {
      const qualityScore = calculateQualityScore(batch)
      const aflatoxinCategory = getAflatoxinCategory(batch.aflatoxin)
      
      return { ...batch, qualityScore, ...aflatoxinCategory }
    })

    // Key metrics
    const totalBatches = enrichedBatches.length
    const avgQuality = enrichedBatches.reduce((sum, b) => sum + b.qualityScore, 0) / totalBatches
    const avgAflatoxin = enrichedBatches.reduce((sum, b) => sum + b.aflatoxin, 0) / totalBatches
    const childrenSafeBatches = enrichedBatches.filter(b => b.category === 'children').length
    const adultsOnlyBatches = enrichedBatches.filter(b => b.category === 'adults').length
    const animalsOnlyBatches = enrichedBatches.filter(b => b.category === 'animals').length
    const unsafeBatches = enrichedBatches.filter(b => b.category === 'unsafe').length
    const suppliers = [...new Set(enrichedBatches.map(b => b.supplier))]

    // Supplier performance with aflatoxin safety focus
    const supplierStats = suppliers.map(supplier => {
      const supplierBatches = enrichedBatches.filter(b => b.supplier === supplier)
      const categoryStats = {
        children: supplierBatches.filter(b => b.category === 'children').length,
        adults: supplierBatches.filter(b => b.category === 'adults').length,
        animals: supplierBatches.filter(b => b.category === 'animals').length,
        unsafe: supplierBatches.filter(b => b.category === 'unsafe').length
      }
      
      return {
        supplier,
        batchCount: supplierBatches.length,
        avgQuality: supplierBatches.reduce((sum, b) => sum + b.qualityScore, 0) / supplierBatches.length,
        avgAflatoxin: supplierBatches.reduce((sum, b) => sum + b.aflatoxin, 0) / supplierBatches.length,
        avgMoisture: supplierBatches.reduce((sum, b) => sum + b.moisture, 0) / supplierBatches.length,
        avgRotten: supplierBatches.reduce((sum, b) => sum + b.rotten, 0) / supplierBatches.length,
        categoryStats,
        safetyScore: (categoryStats.children * 100 + categoryStats.adults * 70 + categoryStats.animals * 30) / supplierBatches.length
      }
    }).sort((a, b) => b.safetyScore - a.safetyScore)

    // Time series data for trends
    const timeSeriesData = enrichedBatches
      .sort((a, b) => a.date - b.date)
      .map(batch => ({
        date: batch.date.toLocaleDateString(),
        quality: batch.qualityScore,
        aflatoxin: batch.aflatoxin,
        moisture: batch.moisture,
        rotten: batch.rotten,
        immature: batch.immature,
        discolored: batch.discolored,
        broken: batch.broken,
        foreign: batch.foreign,
        pestDamaged: batch.pestDamaged,
        supplier: batch.supplier,
        category: batch.category,
        categoryColor: batch.color
      }))

    // Parameter trends over time (monthly averages)
    const parameterTrends = timeSeriesData.reduce((acc, batch) => {
      const month = new Date(batch.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      if (!acc[month]) {
        acc[month] = {
          month,
          moisture: [],
          rotten: [],
          immature: [],
          discolored: [],
          broken: [],
          foreign: [],
          pestDamaged: [],
          aflatoxin: []
        }
      }
      acc[month].moisture.push(batch.moisture)
      acc[month].rotten.push(batch.rotten)
      acc[month].immature.push(batch.immature)
      acc[month].discolored.push(batch.discolored)
      acc[month].broken.push(batch.broken)
      acc[month].foreign.push(batch.foreign)
      acc[month].pestDamaged.push(batch.pestDamaged)
      acc[month].aflatoxin.push(batch.aflatoxin)
      return acc
    }, {})

    const parameterTrendData = Object.values(parameterTrends).map(monthData => ({
      month: monthData.month,
      avgMoisture: monthData.moisture.reduce((sum, val) => sum + val, 0) / monthData.moisture.length,
      avgRotten: monthData.rotten.reduce((sum, val) => sum + val, 0) / monthData.rotten.length,
      avgImmature: monthData.immature.reduce((sum, val) => sum + val, 0) / monthData.immature.length,
      avgDiscolored: monthData.discolored.reduce((sum, val) => sum + val, 0) / monthData.discolored.length,
      avgBroken: monthData.broken.reduce((sum, val) => sum + val, 0) / monthData.broken.length,
      avgForeign: monthData.foreign.reduce((sum, val) => sum + val, 0) / monthData.foreign.length,
      avgPestDamaged: monthData.pestDamaged.reduce((sum, val) => sum + val, 0) / monthData.pestDamaged.length,
      avgAflatoxin: monthData.aflatoxin.reduce((sum, val) => sum + val, 0) / monthData.aflatoxin.length
    }))

    // Quality parameter distributions
    const parameterStats = [
      { name: 'Moisture', avg: enrichedBatches.reduce((sum, b) => sum + b.moisture, 0) / totalBatches, threshold: 14 },
      { name: 'Immature Grains', avg: enrichedBatches.reduce((sum, b) => sum + b.immature, 0) / totalBatches, threshold: 5 },
      { name: 'Discolored', avg: enrichedBatches.reduce((sum, b) => sum + b.discolored, 0) / totalBatches, threshold: 2 },
      { name: 'Broken Kernels', avg: enrichedBatches.reduce((sum, b) => sum + b.broken, 0) / totalBatches, threshold: 5 },
      { name: 'Foreign Matter', avg: enrichedBatches.reduce((sum, b) => sum + b.foreign, 0) / totalBatches, threshold: 1 },
      { name: 'Pest Damaged', avg: enrichedBatches.reduce((sum, b) => sum + b.pestDamaged, 0) / totalBatches, threshold: 2 },
      { name: 'Rotten', avg: enrichedBatches.reduce((sum, b) => sum + b.rotten, 0) / totalBatches, threshold: 1 }
    ]

    // Aflatoxin safety distribution
    const aflatoxinDistribution = [
      { name: 'Safe for Children (0-5 ppb)', value: childrenSafeBatches, color: aflatoxinColors.children, percentage: (childrenSafeBatches/totalBatches*100).toFixed(1) },
      { name: 'Adults Only (5-10 ppb)', value: adultsOnlyBatches, color: aflatoxinColors.adults, percentage: (adultsOnlyBatches/totalBatches*100).toFixed(1) },
      { name: 'Animals Only (10-20 ppb)', value: animalsOnlyBatches, color: aflatoxinColors.animals, percentage: (animalsOnlyBatches/totalBatches*100).toFixed(1) },
      { name: 'Unsafe (20+ ppb)', value: unsafeBatches, color: aflatoxinColors.unsafe, percentage: (unsafeBatches/totalBatches*100).toFixed(1) }
    ].filter(item => item.value > 0)

    // Correlation analysis (simplified)
    const correlationData = enrichedBatches.map(batch => ({
      aflatoxin: batch.aflatoxin,
      moisture: batch.moisture,
      quality: batch.qualityScore,
      rotten: batch.rotten
    }))

    console.log('📈 Analytics processing complete:', {
      totalBatches,
      avgQuality: avgQuality.toFixed(1),
      suppliers: suppliers.length,
      childrenSafe: childrenSafeBatches,
      adultsOnly: adultsOnlyBatches
    })

    return {
      totalBatches,
      avgQuality,
      avgAflatoxin,
      childrenSafeBatches,
      adultsOnlyBatches,
      animalsOnlyBatches,
      unsafeBatches,
      suppliers,
      supplierStats,
      timeSeriesData,
      parameterTrendData,
      parameterStats,
      aflatoxinDistribution,
      correlationData,
      enrichedBatches
    }
  }, [batches, selectedSupplier, selectedTimeRange])

  useEffect(() => {
    fetchBatches()
  }, [])

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">No Data Available</h2>
          <p className="text-gray-500">No batch data found for analysis</p>
        </div>
      </div>
    )
  }

  const { 
    totalBatches, avgQuality, avgAflatoxin, 
    childrenSafeBatches, adultsOnlyBatches, animalsOnlyBatches, unsafeBatches,
    suppliers, supplierStats, timeSeriesData, parameterTrendData, parameterStats, 
    aflatoxinDistribution, correlationData, enrichedBatches
  } = analyticsData

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-light text-gray-900">Grain Analytics Dashboard</h1>
            <p className="text-gray-600">Advanced insights and quality analysis</p>
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="px-4 py-2 bg-white/30 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Suppliers</option>
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
            <div className="flex bg-white/20 backdrop-blur-md rounded-lg p-1">
              {['overview', 'quality', 'suppliers', 'correlations'].map(view => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-4 py-2 rounded-md capitalize transition-colors ${
                    activeView === view 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-white/20'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Children Safe Batches</p>
                <p className="text-2xl font-bold text-emerald-600">{childrenSafeBatches}</p>
                <p className="text-xs text-emerald-600 flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {((childrenSafeBatches / totalBatches) * 100).toFixed(1)}% (0-5 ppb)
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Adults Only</p>
                <p className="text-2xl font-bold text-amber-600">{adultsOnlyBatches}</p>
                <p className="text-xs text-amber-600 flex items-center mt-1">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {((adultsOnlyBatches / totalBatches) * 100).toFixed(1)}% (5-10 ppb)
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Animals Only</p>
                <p className="text-2xl font-bold text-red-600">{animalsOnlyBatches}</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {((animalsOnlyBatches / totalBatches) * 100).toFixed(1)}% (10-20 ppb)
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Quality Score</p>
                <p className="text-2xl font-bold text-emerald-600">{avgQuality.toFixed(1)}</p>
                <p className={`text-xs flex items-center mt-1 ${avgQuality > 80 ? 'text-emerald-600' : avgQuality > 60 ? 'text-amber-600' : 'text-red-600'}`}>
                  {avgQuality > 80 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {avgQuality > 80 ? 'Excellent' : avgQuality > 60 ? 'Good' : 'Needs attention'}
                </p>
              </div>
              <div className={`w-12 h-12 ${avgQuality > 80 ? 'bg-emerald-500' : avgQuality > 60 ? 'bg-amber-500' : 'bg-red-500'} rounded-full flex items-center justify-center`}>
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* Aflatoxin Trends */}
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-emerald-800">Aflatoxin Safety Trends Over Time</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                  <XAxis dataKey="date" stroke="#047857" />
                  <YAxis stroke="#047857" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  {/* Safety threshold lines */}
                  <Line type="monotone" dataKey={5} stroke="#10b981" strokeDasharray="5 5" strokeWidth={1} name="Children Safe Limit (5 ppb)" dot={false} />
                  <Line type="monotone" dataKey={10} stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={1} name="Adults Only Limit (10 ppb)" dot={false} />
                  <Line type="monotone" dataKey={20} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1} name="Animals Only Limit (20 ppb)" dot={false} />
                  
                  <Line type="monotone" dataKey="aflatoxin" stroke="#059669" strokeWidth={3} name="Aflatoxin Level (ppb)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Parameter Trends */}
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-emerald-800">Quality Parameters Trends (Monthly Averages)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={parameterTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                  <XAxis dataKey="month" stroke="#047857" />
                  <YAxis stroke="#047857" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="avgMoisture" stroke="#10b981" strokeWidth={2} name="Moisture %" />
                  <Line type="monotone" dataKey="avgRotten" stroke="#ef4444" strokeWidth={2} name="Rotten %" />
                  <Line type="monotone" dataKey="avgImmature" stroke="#f59e0b" strokeWidth={2} name="Immature Grains %" />
                  <Line type="monotone" dataKey="avgDiscolored" stroke="#8b5cf6" strokeWidth={2} name="Discolored %" />
                  <Line type="monotone" dataKey="avgBroken" stroke="#06b6d4" strokeWidth={2} name="Broken Kernels %" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Aflatoxin Safety Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-emerald-800">Aflatoxin Safety Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <PieChart
                      data={aflatoxinDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {aflatoxinDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </PieChart>
                    <Tooltip formatter={(value, name) => [value, name]} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Safety Summary */}
              <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-emerald-800">Safety Summary</h3>
                <div className="space-y-4">
                  {aflatoxinDistribution.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: `${category.color}20`}}>
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{backgroundColor: category.color}}
                        ></div>
                        <span className="font-medium text-gray-800">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{category.value} batches</div>
                        <div className="text-sm text-gray-600">{category.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'quality' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Moisture vs Aflatoxin Correlation */}
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-emerald-800">Moisture vs Aflatoxin Correlation</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={correlationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                  <XAxis dataKey="moisture" stroke="#047857" name="Moisture %" />
                  <YAxis dataKey="aflatoxin" stroke="#047857" name="Aflatoxin (ppb)" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                  />
                  <Scatter dataKey="moisture" fill="#10b981" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Parameter Safety Analysis */}
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-emerald-800">Parameter Safety Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={parameterStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                  <XAxis dataKey="name" stroke="#047857" />
                  <YAxis stroke="#047857" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="avg" fill="#10b981" name="Current Average" />
                  <Bar dataKey="threshold" fill="#ef4444" name="Safety Threshold" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quality Issues Alert */}
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-emerald-800">Quality Alert System</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {parameterStats
                  .filter(param => param.avg > param.threshold)
                  .sort((a, b) => (b.avg - b.threshold) - (a.avg - a.threshold))
                  .slice(0, 3)
                  .map((param, index) => (
                    <div key={param.name} className="bg-red-50/80 backdrop-blur-sm p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-red-800">{param.name}</h4>
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <p className="text-sm text-red-700">
                        Current: {param.avg.toFixed(2)}% (Limit: {param.threshold}%)
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        {((param.avg - param.threshold) / param.threshold * 100).toFixed(1)}% above safe limit
                      </p>
                      <div className="mt-2">
                        <div className="w-full bg-red-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full" 
                            style={{width: `${Math.min(100, (param.avg / param.threshold) * 100)}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {parameterStats.filter(param => param.avg <= param.threshold).length > 0 && (
                  <div className="bg-emerald-50/80 backdrop-blur-sm p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-emerald-800">Safe Parameters</h4>
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-sm text-emerald-700">
                      {parameterStats.filter(param => param.avg <= param.threshold).length} parameters within safe limits
                    </p>
                    <div className="mt-2 space-y-1">
                      {parameterStats
                        .filter(param => param.avg <= param.threshold)
                        .slice(0, 3)
                        .map(param => (
                          <p key={param.name} className="text-xs text-emerald-600">
                            ✓ {param.name}: {param.avg.toFixed(1)}%
                          </p>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeView === 'suppliers' && (
          <div className="space-y-6">
            {/* Supplier Performance Rankings */}
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-emerald-800">Supplier Safety Performance Rankings</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-emerald-50/80 backdrop-blur-sm">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-emerald-700 uppercase">Rank</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-emerald-700 uppercase">Supplier</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-emerald-700 uppercase">Total Batches</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-emerald-700 uppercase">Children Safe</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-emerald-700 uppercase">Adults Only</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-emerald-700 uppercase">Animals Only</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-emerald-700 uppercase">Avg Quality</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-emerald-700 uppercase">Safety Score</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/5 backdrop-blur-sm divide-y divide-emerald-200/20">
                    {supplierStats.map((supplier, index) => (
                      <tr key={supplier.supplier} className="hover:bg-emerald-50/20 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-emerald-500 text-white' :
                              index === 1 ? 'bg-emerald-400 text-white' :
                              index === 2 ? 'bg-emerald-300 text-emerald-800' :
                              'bg-gray-200 text-gray-700'
                            }`}>
                              {index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{supplier.supplier}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                          {supplier.batchCount}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              {supplier.categoryStats.children}
                            </span>
                            <span className="ml-2 text-xs text-emerald-600">
                              ({((supplier.categoryStats.children/supplier.batchCount)*100).toFixed(0)}%)
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              {supplier.categoryStats.adults}
                            </span>
                            <span className="ml-2 text-xs text-amber-600">
                              ({((supplier.categoryStats.adults/supplier.batchCount)*100).toFixed(0)}%)
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {supplier.categoryStats.animals}
                            </span>
                            <span className="ml-2 text-xs text-red-600">
                              ({((supplier.categoryStats.animals/supplier.batchCount)*100).toFixed(0)}%)
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            supplier.avgQuality > 80 ? 'bg-emerald-100 text-emerald-800' :
                            supplier.avgQuality > 60 ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {supplier.avgQuality.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  supplier.safetyScore > 80 ? 'bg-emerald-500' :
                                  supplier.safetyScore > 60 ? 'bg-amber-500' :
                                  'bg-red-500'
                                }`}
                                style={{width: `${supplier.safetyScore}%`}}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {supplier.safetyScore.toFixed(0)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Supplier Safety Distribution */}
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-6 text-emerald-800">Supplier Aflatoxin Safety Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supplierStats.slice(0, 6).map((supplier, index) => (
                  <div key={supplier.supplier} className="bg-white/30 backdrop-blur-sm p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">{supplier.supplier}</h4>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index < 3 ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-emerald-700">Children Safe:</span>
                        <span className="font-bold text-emerald-600">{supplier.categoryStats.children}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-amber-700">Adults Only:</span>
                        <span className="font-bold text-amber-600">{supplier.categoryStats.adults}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700">Animals Only:</span>
                        <span className="font-bold text-red-600">{supplier.categoryStats.animals}</span>
                      </div>
                      {supplier.categoryStats.unsafe > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-red-800">Unsafe:</span>
                          <span className="font-bold text-red-800">{supplier.categoryStats.unsafe}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Avg Aflatoxin:</span>
                        <span className={`font-bold ${
                          supplier.avgAflatoxin <= 5 ? 'text-emerald-600' :
                          supplier.avgAflatoxin <= 10 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {supplier.avgAflatoxin.toFixed(1)} ppb
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supplier Improvement Recommendations */}
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-emerald-800">Supplier Quality Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {supplierStats
                  .filter(supplier => supplier.safetyScore < 80)
                  .slice(0, 3)
                  .map((supplier, index) => (
                    <div key={supplier.supplier} className="bg-amber-50/80 backdrop-blur-sm p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
                        <h4 className="font-medium text-amber-800">{supplier.supplier}</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        {supplier.avgAflatoxin > 10 && (
                          <p className="text-red-700">• Critical: Aflatoxin levels too high for human consumption</p>
                        )}
                        {supplier.avgMoisture > 14 && (
                          <p className="text-amber-700">• High moisture detected - improve drying protocols</p>
                        )}
                        {supplier.avgRotten > 1 && (
                          <p className="text-red-700">• Excessive rotten grains - enhance storage conditions</p>
                        )}
                        <p className="text-emerald-700 font-medium">
                          Focus: {supplier.categoryStats.children < supplier.batchCount * 0.7 ? 'Reduce aflatoxin contamination' : 'Maintain current standards'}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'correlations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Advanced Correlation Matrix */}
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-emerald-800">Parameter Correlation Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={correlationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                    <XAxis dataKey="rotten" stroke="#047857" name="Rotten %" />
                    <YAxis dataKey="aflatoxin" stroke="#047857" name="Aflatoxin (ppb)" />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        borderRadius: '8px'
                      }}
                    />
                    <Scatter dataKey="rotten" fill="#ef4444" name="Rotten vs Aflatoxin" />
                  </ScatterChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={correlationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                    <XAxis dataKey="quality" stroke="#047857" name="Quality Score" />
                    <YAxis dataKey="aflatoxin" stroke="#047857" name="Aflatoxin (ppb)" />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        borderRadius: '8px'
                      }}
                    />
                    <Scatter dataKey="quality" fill="#10b981" name="Quality vs Aflatoxin" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Aflatoxin Safety Insights */}
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-emerald-800">Aflatoxin Safety Insights & Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-emerald-50/80 backdrop-blur-sm p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600 mr-2" />
                    <h4 className="font-medium text-emerald-800">Children Safe Analysis</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-emerald-700">
                      <span className="font-bold">{childrenSafeBatches}</span> batches (
                      <span className="font-bold">{((childrenSafeBatches/totalBatches)*100).toFixed(1)}%</span>) 
                      are safe for children consumption
                    </p>
                    <p className="text-emerald-600">
                      Aflatoxin levels: 0-5 ppb
                    </p>
                    <div className="mt-2">
                      <div className="w-full bg-emerald-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full" 
                          style={{width: `${(childrenSafeBatches/totalBatches)*100}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50/80 backdrop-blur-sm p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Users className="w-6 h-6 text-amber-600 mr-2" />
                    <h4 className="font-medium text-amber-800">Adults Only Analysis</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-amber-700">
                      <span className="font-bold">{adultsOnlyBatches}</span> batches (
                      <span className="font-bold">{((adultsOnlyBatches/totalBatches)*100).toFixed(1)}%</span>) 
                      suitable for adults only
                    </p>
                    <p className="text-amber-600">
                      Aflatoxin levels: 5-10 ppb
                    </p>
                    <div className="mt-2">
                      <div className="w-full bg-amber-200 rounded-full h-2">
                        <div 
                          className="bg-amber-600 h-2 rounded-full" 
                          style={{width: `${(adultsOnlyBatches/totalBatches)*100}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50/80 backdrop-blur-sm p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                    <h4 className="font-medium text-red-800">Risk Assessment</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-red-700">
                      <span className="font-bold">{animalsOnlyBatches + unsafeBatches}</span> batches require attention
                    </p>
                    <p className="text-red-600">
                      {animalsOnlyBatches} animals only, {unsafeBatches} unsafe
                    </p>
                    <div className="mt-2">
                      <div className="w-full bg-red-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{width: `${((animalsOnlyBatches + unsafeBatches)/totalBatches)*100}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-emerald-800">Action Plan for Suppliers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-emerald-700">✅ Best Practices (Top Performers)</h4>
                  {supplierStats.slice(0, 2).map(supplier => (
                    <div key={supplier.supplier} className="bg-emerald-50/60 p-3 rounded-lg">
                      <p className="font-medium text-emerald-800">{supplier.supplier}</p>
                      <p className="text-sm text-emerald-700">
                        {supplier.categoryStats.children} children-safe batches ({((supplier.categoryStats.children/supplier.batchCount)*100).toFixed(0)}%)
                      </p>
                      <p className="text-xs text-emerald-600">
                        Quality Score: {supplier.avgQuality.toFixed(1)} | Aflatoxin: {supplier.avgAflatoxin.toFixed(1)} ppb
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-red-700">⚠️ Improvement Needed</h4>
                  {supplierStats
                    .filter(s => s.avgAflatoxin > 5 || s.categoryStats.children < s.batchCount * 0.5)
                    .slice(0, 2)
                    .map(supplier => (
                      <div key={supplier.supplier} className="bg-red-50/60 p-3 rounded-lg">
                        <p className="font-medium text-red-800">{supplier.supplier}</p>
                        <p className="text-sm text-red-700">
                          Priority: {supplier.avgAflatoxin > 10 ? 'Critical - High aflatoxin' : 'Moderate - Improve drying'}
                        </p>
                        <p className="text-xs text-red-600">
                          Only {supplier.categoryStats.children} children-safe batches | Avg: {supplier.avgAflatoxin.toFixed(1)} ppb
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Key Insights Summary */}
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-emerald-800">Executive Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-emerald-50/60 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600 mb-2">
                    {((childrenSafeBatches/totalBatches)*100).toFixed(0)}%
                  </div>
                  <p className="text-sm text-emerald-700">of batches meet children safety standards</p>
                </div>
                
                <div className="text-center p-4 bg-amber-50/60 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600 mb-2">
                    {avgAflatoxin.toFixed(1)} ppb
                  </div>
                  <p className="text-sm text-amber-700">average aflatoxin across all batches</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50/60 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {suppliers.length}
                  </div>
                  <p className="text-sm text-blue-700">suppliers contributing to analysis</p>
                </div>
              </div>
              
             
            </div>
          </div>
        )}
      </div>
    </div>
  )
}