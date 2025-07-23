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
  const [language, setLanguage] = useState('en')
  
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

  // Load language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Translation object
  const translations = {
    en: {
      // Page titles and descriptions
      laboratoryTests: 'Laboratory Tests',
      selectTestDescription: 'Select a test from your laboratory to predict aflatoxin contamination',
      laboratory: 'Laboratory',
      aflatoxinPrediction: 'Aflatoxin Prediction',
      predictFor: 'Predict aflatoxin contamination for:',
      supplier: 'Supplier',
      
      // Navigation
      backToTests: 'Back to Tests',
      
      // Search
      searchPlaceholder: 'Search laboratory tests by batch ID, supplier, or test ID...',
      noMatchingTests: 'No matching laboratory tests',
      adjustSearchTerms: 'Try adjusting your search terms',
      noTestsFound: 'No laboratory tests found',
      noTestsAvailable: 'No tests are available for your laboratory',
      
      // Loading and errors
      loadingTests: 'Loading laboratory tests...',
      errorLoadingTests: 'Error loading laboratory tests',
      alreadyCompleted: 'This test has already been completed and cannot be predicted again.',
      
      // Test status
      completed: 'Completed',
      ready: 'Ready',
      pending: 'Pending',
      failed: 'Failed',
      alreadyTested: 'Already Tested',
      selectTest: 'Select Test',
      
      // Form sections
      sampleInformation: 'Sample Information',
      grainCharacteristics: 'Grain Characteristics',
      
      // Batch information
      batchId: 'Batch ID',
      batchIdPlaceholder: 'MB-2025-001',
      supplierName: 'Supplier',
      supplierPlaceholder: 'Supplier name',
      testDate: 'Test Date',
      
      // Form fields
      moistureContent: 'Moisture Content (%)',
      immatureGrains: 'Immature Grains (%)',
      discoloredGrains: 'Discolored Grains (%)',
      brokenKernels: 'Broken Kernels (%)',
      foreignMatter: 'Foreign Matter (%)',
      pestDamage: 'Pest Damage (%)',
      rottenGrains: 'Rotten Grains (%)',
      liveInfestation: 'Live Infestation',
      abnormalOdours: 'Abnormal Odours',
      
      // Field ranges
      moistureRange: '0-30%',
      immatureRange: '0-20%',
      discoloredRange: '0-15%',
      brokenRange: '0-10%',
      foreignRange: '0-5%',
      pestRange: '0-25%',
      rottenRange: '0-10%',
      range: 'Range',
      
      // Binary options
      no: 'No',
      yes: 'Yes',
      
      // Actions
      predictAflatoxin: 'Predict Aflatoxin Level',
      
      // Date and user info
      noDate: 'No date',
      unknown: 'Unknown',
      unknownSupplier: 'Unknown Supplier',
      unknownUser: 'Unknown User',
      lab: 'Lab'
    },
    rw: {
      // Page titles and descriptions
      laboratoryTests: 'Igerageza ry\'Ubushakashatsi',
      selectTestDescription: 'Hitamo igerageza kuva mubushakashatsi bwawe kugirango uhanure aflatoxin',
      laboratory: 'Ubushakashatsi',
      aflatoxinPrediction: 'Guhanura Aflatoxin',
      predictFor: 'Hanura aflatoxin kuri:',
      supplier: 'Uwatanze',
      
      // Navigation
      backToTests: 'Subira ku Magerageza',
      
      // Search
      searchPlaceholder: 'Shakisha igerageza ry\'ubushakashatsi ukoresha ID ya batch, uwatanze, cyangwa ID y\'igerageza...',
      noMatchingTests: 'Nta magerageza y\'ubushakashatsi ahuye',
      adjustSearchTerms: 'Gerageza guhindura ijambo ushaka',
      noTestsFound: 'Nta magerageza y\'ubushakashatsi aboneka',
      noTestsAvailable: 'Nta magerageza aboneka kubushakashatsi bwawe',
      
      // Loading and errors
      loadingTests: 'Gukura amagerageza y\'ubushakashatsi...',
      errorLoadingTests: 'Ikosa mu gukura amagerageza y\'ubushakashatsi',
      alreadyCompleted: 'Iri gerageza ryarangiye kandi ntirashobora guhanurwa ukundi.',
      
      // Test status
      completed: 'Ryarangiye',
      ready: 'Ryteguye',
      pending: 'Ryitegereje',
      failed: 'Ryaranatsinze',
      alreadyTested: 'Ryasanzwe Ryageragejwe',
      selectTest: 'Hitamo Igerageza',
      
      // Form sections
      sampleInformation: 'Amakuru y\'Icyitegererezo',
      grainCharacteristics: 'Imiterere y\'Ibinyampeke',
      
      // Batch information
      batchId: 'ID ya Batch',
      batchIdPlaceholder: 'MB-2025-001',
      supplierName: 'Uwatanze',
      supplierPlaceholder: 'Izina ry\'uwatanze',
      testDate: 'Itariki y\'Igerageza',
      
      // Form fields
      moistureContent: 'Ubusembure (%)',
      immatureGrains: 'Ibinyampeke bitabaze (%)',
      discoloredGrains: 'Ibinyampeke byahinduye ibara (%)',
      brokenKernels: 'Ibinyampeke bimenetse (%)',
      foreignMatter: 'Ibindi bintu (%)',
      pestDamage: 'Ibyangiritse ku dumu (%)',
      rottenGrains: 'Ibinyampeke byaboyse (%)',
      liveInfestation: 'Udumu buzima',
      abnormalOdours: 'Impumuro zidasanzwe',
      
      // Field ranges
      moistureRange: '0-30%',
      immatureRange: '0-20%',
      discoloredRange: '0-15%',
      brokenRange: '0-10%',
      foreignRange: '0-5%',
      pestRange: '0-25%',
      rottenRange: '0-10%',
      range: 'Urwego',
      
      // Binary options
      no: 'Oya',
      yes: 'Yego',
      
      // Actions
      predictAflatoxin: 'Hanura Urwego rwa Aflatoxin',
      
      // Date and user info
      noDate: 'Nta tariki',
      unknown: 'Bitazwi',
      unknownSupplier: 'Uwatanze atazwi',
      unknownUser: 'Ukoresha atazwi',
      lab: 'Ubushakashatsi'
    }
  }

  const t = translations[language]
  
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
    { key: 'moisture_maize_grain', label: t.moistureContent, icon: Activity, range: t.moistureRange },
    { key: 'Immaturegrains', label: t.immatureGrains, icon: Target, range: t.immatureRange },
    { key: 'Discolored_grains', label: t.discoloredGrains, icon: AlertTriangle, range: t.discoloredRange },
    { key: 'broken_kernels_percent_maize_grain', label: t.brokenKernels, icon: Activity, range: t.brokenRange },
    { key: 'foreign_matter_percent_maize_grain', label: t.foreignMatter, icon: Target, range: t.foreignRange },
    { key: 'pest_damaged', label: t.pestDamage, icon: AlertTriangle, range: t.pestRange },
    { key: 'rotten', label: t.rottenGrains, icon: Activity, range: t.rottenRange }
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
        setTestsError(err.message || t.errorLoadingTests);
        console.error('Error fetching tests:', err);
      } finally {
        setTestsLoading(false);
      }
    };

    fetchTests();
  }, [user, t.errorLoadingTests]);

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
      alert(t.alreadyCompleted)
      return
    }

    setSelectedTest(test)
    
    // Extract user information from test data
    const userId = test.userId || test.user_id || test.createdById || test.creator_id || test.id || test._id || ''
    const userName = test.userName || test.user_name || test.createdBy || test.creator || test.user || user?.name || t.unknownUser
    const testId = test.id || test._id || test.name || `Test-${test.batchId || test.batch_id || t.unknown}`
    
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

  // Helper function to get status translation
  const getStatusTranslation = (status, tested) => {
    if (tested) return t.completed
    switch(status) {
      case 'completed': return t.completed
      case 'pending': return t.pending
      case 'failed': return t.failed
      default: return t.ready
    }
  }

  // Tests List View
  if (currentView === 'tests') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900">{t.laboratoryTests}</h1>
          <p className="text-gray-600 mt-2">{t.selectTestDescription}</p>
          {user?.email && (
            <p className="text-sm text-gray-500 mt-1">
              {t.laboratory}: {user.organization}
            </p>
          )}
        </div>

        {/* Search Bar */}
        <Card className="p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
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
              <p className="text-gray-600">{t.loadingTests}</p>
            </div>
          </Card>
        )}

        {testsError && (
          <Card className="p-6 mb-8">
            <div className="text-center text-red-600">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
              <p className="font-medium mb-2">{t.errorLoadingTests}</p>
              <p className="text-sm">{testsError}</p>
            </div>
          </Card>
        )}

        {!testsLoading && !testsError && filteredTests.length === 0 && tests.length > 0 && (
          <Card className="p-8">
            <div className="text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">{t.noMatchingTests}</p>
              <p className="text-sm">{t.adjustSearchTerms}</p>
            </div>
          </Card>
        )}
        
        {!testsLoading && !testsError && filteredTests.length === 0 && tests.length === 0 && (
          <Card className="p-8">
            <div className="text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">{t.noTestsFound}</p>
              <p className="text-sm">{t.noTestsAvailable} ({user?.email})</p>
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
                        {test.supplier || test.company || test.source || t.unknownSupplier}
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
                    {getStatusTranslation(test.status, test.tested)}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {test.date ? new Date(test.date).toLocaleDateString() : 
                       test.createdAt ? new Date(test.createdAt).toLocaleDateString() :
                       test.created_at ? new Date(test.created_at).toLocaleDateString() : 
                       t.noDate}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {test.createdBy || test.creator || test.user || user?.name || t.unknown}
                    </span>
                  </div>
                  {test.description && (
                    <div className="text-sm text-gray-500 truncate">
                      {test.description}
                    </div>
                  )}
                  {(test.laboratoryEmail || test.laboratory_email) && (
                    <div className="text-xs text-gray-400 truncate">
                      {t.lab}: {test.laboratoryEmail || test.laboratory_email}
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
                      {t.alreadyTested}
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      {t.selectTest}
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
          {t.backToTests}
        </Button>
        
        <h1 className="text-3xl font-light text-gray-900">{t.aflatoxinPrediction}</h1>
        <p className="text-gray-600 mt-2">
          {t.predictFor}
          <span className="font-medium text-gray-800 ml-1">
            {selectedTest?.batchId || selectedTest?.batch_id || selectedTest?.name || 'Selected Test'}
          </span>
        </p>
        {selectedTest?.supplier && (
          <p className="text-sm text-gray-500 mt-1">
            {t.supplier}: {selectedTest.supplier}
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-light text-gray-900 mb-6">{t.sampleInformation}</h2>
            
            {/* Batch Information */}
            <div className="grid md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <Input
                label={t.batchId}
                value={batchInfo.batchId}
                onChange={(e) => handleBatchMetadataChange('batchId', e.target.value)}
                placeholder={t.batchIdPlaceholder}
              />
              <Input
                label={t.supplierName}
                value={batchInfo.supplier}
                onChange={(e) => handleBatchMetadataChange('supplier', e.target.value)}
                placeholder={t.supplierPlaceholder}
              />
              <Input
                label={t.testDate}
                type="date"
                value={batchInfo.date}
                onChange={(e) => handleBatchMetadataChange('date', e.target.value)}
              />
            </div>

            {/* Input Fields */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">{t.grainCharacteristics}</h3>
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
                    <p className="text-xs text-gray-500 mt-1">{t.range}: {field.range}</p>
                  </div>
                ))}
              </div>

              {/* Binary Inputs */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.liveInfestation}</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="0"
                        checked={formData.Liveinfestation === 0}
                        onChange={(e) => handleFormDataChange('Liveinfestation', parseInt(e.target.value))}
                        className="mr-2"
                      />
                      {t.no}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="1"
                        checked={formData.Liveinfestation === 1}
                        onChange={(e) => handleFormDataChange('Liveinfestation', parseInt(e.target.value))}
                        className="mr-2"
                      />
                      {t.yes}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.abnormalOdours}</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="0"
                        checked={formData.abnormal_odours_maize_grain === 0}
                        onChange={(e) => handleFormDataChange('abnormal_odours_maize_grain', parseInt(e.target.value))}
                        className="mr-2"
                      />
                      {t.no}
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="1"
                        checked={formData.abnormal_odours_maize_grain === 1}
                        onChange={(e) => handleFormDataChange('abnormal_odours_maize_grain', parseInt(e.target.value))}
                        className="mr-2"
                      />
                      {t.yes}
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
              {t.predictAflatoxin}
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