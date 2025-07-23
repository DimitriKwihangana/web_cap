import { useState, useEffect } from 'react'
import { usePrediction } from '../../hooks/usePrediction'
import { Zap, Activity, Target, AlertTriangle, Search, Calendar, User, Package, ArrowLeft, Eye, CheckCircle } from 'lucide-react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'
import ResultDisplay from './ResultDisplay'
import { useApp } from '../../contexts/AppContext'
import axios from 'axios';


export default function PredictionForm() {
  const { user, loading } = useApp()
  console.log('User in PredictionForm:', user)
  
  const { predict, isLoading, result, error } = usePrediction()
  
  // View state management
  const [currentView, setCurrentView] = useState('tests') // 'tests' or 'form'
  const [selectedTest, setSelectedTest] = useState(null)
  
  
  // Tests data
  const [tests, setTests] = useState([])
  const [filteredTests, setFilteredTests] = useState([])
  const [testsLoading, setTestsLoading] = useState(false)
  const [testsError, setTestsError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Form data
  const [formData, setFormData] = useState({
    moisture_maize_grain: '',
    Immaturegrains: '',
    Discolored_grains: '',
    broken_kernels_percent_maize_grain: '',
    foreign_matter_percent_maize_grain: '',
    pest_damaged: '',
    rotten: '',
    Liveinfestation: 0,
    abnormal_odours_maize_grain: 0
  })
  
  const [batchInfo, setBatchInfo] = useState({
    batchId: '',
    supplier: '',
    date: new Date().toISOString().split('T')[0],
    moisture_maize_grain: '',
    Immaturegrains: '',
    Discolored_grains: '',
    broken_kernels_percent_maize_grain: '',
    foreign_matter_percent_maize_grain: '',
    pest_damaged: '',
    rotten: '',
    Liveinfestation: 0,
    abnormal_odours_maize_grain: 0
  })

  // User info for ResultDisplay
  const [userInfo, setUserInfo] = useState({
    userId: '',
    userName: '',
    testId:''
  })

  const inputFields = [
    { key: 'moisture_maize_grain', label: 'Moisture Content (%)', icon: Activity, range: '0-30%' },
    { key: 'Immaturegrains', label: 'Immature Grains (%)', icon: Target, range: '0-20%' },
    { key: 'Discolored_grains', label: 'Discolored Grains (%)', icon: AlertTriangle, range: '0-15%' },
    { key: 'broken_kernels_percent_maize_grain', label: 'Broken Kernels (%)', icon: Activity, range: '0-10%' },
    { key: 'foreign_matter_percent_maize_grain', label: 'Foreign Matter (%)', icon: Target, range: '0-5%' },
    { key: 'pest_damaged', label: 'Pest Damage (%)', icon: AlertTriangle, range: '0-25%' },
    { key: 'rotten', label: 'Rotten Grains (%)', icon: Activity, range: '0-10%' }
  ]

  // Fetch tests from API
useEffect(() => {
  const fetchTests = async () => {
    if (!user || !user.email) {
      console.log('No user or user email found, skipping laboratory test fetch');
      return;
    }

    setTestsLoading(true);
    setTestsError('');

    try {
      const response = await axios.get('https://back-cap.onrender.com/api/tests');

      const data = response.data.data;
      console.log('Fetched tests data:', data);

      // Filter tests for current laboratory based on email
      const laboratoryTests = Array.isArray(data)
        ? data.filter(test =>
            test.laboratoryEmail === user.email ||
            test.laboratory_email === user.email ||
            test.lab_email === user.email ||
            test.labEmail === user.email
          )
        : data.tests?.filter(test =>
            test.laboratoryEmail === user.email ||
            test.laboratory_email === user.email ||
            test.lab_email === user.email ||
            test.labEmail === user.email
          ) || [];

      console.log('Laboratory tests filtered for email:', user.email, laboratoryTests);
      setTests(laboratoryTests);
      setFilteredTests(laboratoryTests);

    } catch (err) {
      setTestsError(err.message || 'Error fetching tests');
      console.error('Error fetching tests:', err);
    } finally {
      setTestsLoading(false);
    }
  };

  fetchTests();
}, [user]);

  // Filter tests based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTests(tests)
      return
    }
    
    const filtered = tests.filter(test => 
      test.batchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.batch_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.id?.toString().includes(searchTerm) ||
      test._id?.toString().includes(searchTerm)
    )
    setFilteredTests(filtered)
  }, [searchTerm, tests])

  // Handle test selection with tested check
  const handleTestSelect = (test) => {
    // Check if test is already marked as tested
    if (test.tested === true) {
      alert('This test has already been completed and cannot be predicted again.')
      return
    }

    setSelectedTest(test)
    
    // Extract user information from test data
    const userId = test.userId || test.user_id || test.createdById || test.creator_id || test.id || test._id || ''
    const userName = test.userName || test.user_name || test.createdBy || test.creator || test.user || user?.name || 'Unknown User'
    const testId = test.id || test._id || test.name || `Test-${test.batchId || test.batch_id || 'Unknown'}`
    
    setUserInfo({
      userId: userId.toString(),
      userName: userName,
      testId: testId
    })
    
    // Pre-populate form with test data if available
    const testParams = test.parameters || test.data || test.measurements || {}
    
    setFormData({
      moisture_maize_grain: testParams.moisture_maize_grain?.toString() || '',
      Immaturegrains: testParams.Immaturegrains?.toString() || '',
      Discolored_grains: testParams.Discolored_grains?.toString() || '',
      broken_kernels_percent_maize_grain: testParams.broken_kernels_percent_maize_grain?.toString() || '',
      foreign_matter_percent_maize_grain: testParams.foreign_matter_percent_maize_grain?.toString() || '',
      pest_damaged: testParams.pest_damaged?.toString() || '',
      rotten: testParams.rotten?.toString() || '',
      Liveinfestation: testParams.Liveinfestation || 0,
      abnormal_odours_maize_grain: testParams.abnormal_odours_maize_grain || 0
    })
    
    setBatchInfo({
      batchId: test.batchId || test.batch_id || test.name || `Test-${test.id || test._id}`,
      supplier: test.supplier || test.company || test.source || '',
      date: test.date || test.createdAt || test.created_at || new Date().toISOString().split('T')[0],
      ...formData
    })
    
    setCurrentView('form')
  }

  useEffect(() => {
    setBatchInfo(prevBatchInfo => ({
      ...prevBatchInfo,
      ...formData
    }))
  }, [formData])

  // Update formData and let useEffect handle batchInfo sync
  const handleFormDataChange = (key, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [key]: value
    }))
  }

  // Update batch metadata (batchId, supplier, date)
  const handleBatchMetadataChange = (key, value) => {
    setBatchInfo(prevBatchInfo => ({
      ...prevBatchInfo,
      [key]: value
    }))
  }

  const handlePredict = async () => {
    const predictionData = {
      ...formData,
      moisture_maize_grain: parseFloat(formData.moisture_maize_grain),
      Immaturegrains: parseFloat(formData.Immaturegrains),
      Discolored_grains: parseFloat(formData.Discolored_grains),
      broken_kernels_percent_maize_grain: parseFloat(formData.broken_kernels_percent_maize_grain),
      foreign_matter_percent_maize_grain: parseFloat(formData.foreign_matter_percent_maize_grain),
      pest_damaged: parseFloat(formData.pest_damaged),
      rotten: parseFloat(formData.rotten),
    }

    await predict(predictionData)
  }

  const isFormValid = Object.values(formData).some(val => val !== '' && val !== 0)

  // Tests List View
  if (currentView === 'tests') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900">Laboratory Tests</h1>
          <p className="text-gray-600 mt-2">Select a test from your laboratory to predict aflatoxin contamination</p>
          {user?.email && (
            <p className="text-sm text-gray-500 mt-1">
              Laboratory: {user.organization}
            </p>
          )}
        </div>

        {/* Search Bar */}
        <Card className="p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search laboratory tests by batch ID, supplier, or test ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </Card>

        {/* Tests Grid */}
        {testsLoading && (
          <Card className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading laboratory tests...</p>
            </div>
          </Card>
        )}

        {testsError && (
          <Card className="p-6 mb-8">
            <div className="text-center text-red-600">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
              <p className="font-medium mb-2">Error loading laboratory tests</p>
              <p className="text-sm">{testsError}</p>
            </div>
          </Card>
        )}

        {!testsLoading && !testsError && filteredTests.length === 0 && tests.length > 0 && (
          <Card className="p-8">
            <div className="text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No matching laboratory tests</p>
              <p className="text-sm">Try adjusting your search terms</p>
            </div>
          </Card>
        )}
        
        {!testsLoading && !testsError && filteredTests.length === 0 && tests.length === 0 && (
          <Card className="p-8">
            <div className="text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No laboratory tests found</p>
              <p className="text-sm">No tests are available for your laboratory ({user?.email})</p>
            </div>
          </Card>
        )}

        {!testsLoading && !testsError && filteredTests.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test, index) => (
              <Card key={test.id || test._id || index} className={`p-6 hover:shadow-lg transition-shadow cursor-pointer ${test.tested ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <Package className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {test.batchId || test.batch_id || test.name || `Test #${test.id || test._id}`}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {test.supplier || test.company || test.source || 'Unknown Supplier'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                    test.tested ? 'bg-green-100 text-green-800' :
                    test.status === 'completed' ? 'bg-green-100 text-green-800' :
                    test.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    test.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {test.tested ? 'Completed' : (test.status || 'Ready')}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {test.date ? new Date(test.date).toLocaleDateString() : 
                       test.createdAt ? new Date(test.createdAt).toLocaleDateString() :
                       test.created_at ? new Date(test.created_at).toLocaleDateString() : 
                       'No date'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {test.createdBy || test.creator || test.user || user?.name || 'Unknown'}
                    </span>
                  </div>
                  {test.description && (
                    <div className="text-sm text-gray-500 truncate">
                      {test.description}
                    </div>
                  )}
                  {(test.laboratoryEmail || test.laboratory_email) && (
                    <div className="text-xs text-gray-400 truncate">
                      Lab: {test.laboratoryEmail || test.laboratory_email}
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={() => handleTestSelect(test)}
                  className="w-full"
                  size="sm"
                  disabled={test.tested}
                >
                  {test.tested ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Already Tested
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Select Test
                    </>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Form View (Original form styling)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button
          onClick={() => setCurrentView('tests')}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tests
        </Button>
        
        <h1 className="text-3xl font-light text-gray-900">Aflatoxin Prediction</h1>
        <p className="text-gray-600 mt-2">
          Predict aflatoxin contamination for: 
          <span className="font-medium text-gray-800 ml-1">
            {selectedTest?.batchId || selectedTest?.batch_id || selectedTest?.name || 'Selected Test'}
          </span>
        </p>
        {selectedTest?.supplier && (
          <p className="text-sm text-gray-500 mt-1">
            Supplier: {selectedTest.supplier}
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-light text-gray-900 mb-6">Sample Information</h2>
            
            {/* Batch Information */}
            <div className="grid md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <Input
                label="Batch ID"
                value={batchInfo.batchId}
                onChange={(e) => handleBatchMetadataChange('batchId', e.target.value)}
                placeholder="MB-2025-001"
              />
              <Input
                label="Supplier"
                value={batchInfo.supplier}
                onChange={(e) => handleBatchMetadataChange('supplier', e.target.value)}
                placeholder="Supplier name"
              />
              <Input
                label="Test Date"
                type="date"
                value={batchInfo.date}
                onChange={(e) => handleBatchMetadataChange('date', e.target.value)}
              />
            </div>

            {/* Input Fields */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Grain Characteristics</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {inputFields.map(field => (
                  <div key={field.key}>
                    <Input
                      label={field.label}
                      type="number"
                      step="0.01"
                      icon={field.icon}
                      value={formData[field.key]}
                      onChange={(e) => handleFormDataChange(field.key, e.target.value)}
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">Range: {field.range}</p>
                  </div>
                ))}
              </div>

              {/* Binary Inputs */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Live Infestation</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="0"
                        checked={formData.Liveinfestation === 0}
                        onChange={(e) => handleFormDataChange('Liveinfestation', parseInt(e.target.value))}
                        className="mr-2"
                      />
                      No
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="1"
                        checked={formData.Liveinfestation === 1}
                        onChange={(e) => handleFormDataChange('Liveinfestation', parseInt(e.target.value))}
                        className="mr-2"
                      />
                      Yes
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Abnormal Odours</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="0"
                        checked={formData.abnormal_odours_maize_grain === 0}
                        onChange={(e) => handleFormDataChange('abnormal_odours_maize_grain', parseInt(e.target.value))}
                        className="mr-2"
                      />
                      No
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="1"
                        checked={formData.abnormal_odours_maize_grain === 1}
                        onChange={(e) => handleFormDataChange('abnormal_odours_maize_grain', parseInt(e.target.value))}
                        className="mr-2"
                      />
                      Yes
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <Button 
              onClick={handlePredict} 
              className="w-full mt-8" 
              size="lg" 
              loading={isLoading}
              disabled={!isFormValid}
            >
              <Zap className="w-5 h-5" />
              Predict Aflatoxin Level
            </Button>
          </Card>
        </div>

        <div>
          <ResultDisplay 
            result={result} 
            batchInfo={batchInfo}
            userId={userInfo.userId}
            userName={userInfo.userName}
            testId={userInfo.testId}
          
          />
        </div>
      </div>
    </div>
  )
}