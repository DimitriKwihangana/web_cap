import { useState, useEffect } from 'react'
import { usePrediction } from '../../hooks/usePrediction'
import { Zap, Activity, Target, AlertTriangle } from 'lucide-react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'
import ResultDisplay2 from './ResultDisplay2'
import { useApp } from '../../contexts/AppContext'

export default function PredictionFormAll() {
  const { user } = useApp()
  const [language, setLanguage] = useState('en')
  
  const { predict, isLoading, result, error } = usePrediction()

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
      aflatoxinPrediction: 'Aflatoxin Prediction',
      predictionDescription: 'Enter sample characteristics to predict aflatoxin contamination levels',
      laboratory: 'Laboratory',
      
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
      
      // Validation
      fillAllFields: 'Please fill in at least one field to make a prediction',
      
      // User info
      unknownUser: 'Unknown User',
      lab: 'Lab'
    },
    rw: {
      // Page titles and descriptions
      aflatoxinPrediction: 'Guhanura Aflatoxin',
      predictionDescription: 'Injiza imiterere y\'icyitegererezo kugirango uhanure urwego rwa aflatoxin',
      laboratory: 'Ubushakashatsi',
      
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
      
      // Validation
      fillAllFields: 'Nyamuneka uzuza byibuze umurongo umwe kugirango uhanure',
      
      // User info
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



  const inputFields = [
    { key: 'moisture_maize_grain', label: t.moistureContent, icon: Activity, range: t.moistureRange },
    { key: 'Immaturegrains', label: t.immatureGrains, icon: Target, range: t.immatureRange },
    { key: 'Discolored_grains', label: t.discoloredGrains, icon: AlertTriangle, range: t.discoloredRange },
    { key: 'broken_kernels_percent_maize_grain', label: t.brokenKernels, icon: Activity, range: t.brokenRange },
    { key: 'foreign_matter_percent_maize_grain', label: t.foreignMatter, icon: Target, range: t.foreignRange },
    { key: 'pest_damaged', label: t.pestDamage, icon: AlertTriangle, range: t.pestRange },
    { key: 'rotten', label: t.rottenGrains, icon: Activity, range: t.rottenRange }
  ]

  // Sync formData changes with batchInfo
  useEffect(() => {
    setBatchInfo(prevBatchInfo => ({
      ...prevBatchInfo,
      ...formData
    }))
  }, [formData])

  // Update formData
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
      moisture_maize_grain: parseFloat(formData.moisture_maize_grain) || 0,
      Immaturegrains: parseFloat(formData.Immaturegrains) || 0,
      Discolored_grains: parseFloat(formData.Discolored_grains) || 0,
      broken_kernels_percent_maize_grain: parseFloat(formData.broken_kernels_percent_maize_grain) || 0,
      foreign_matter_percent_maize_grain: parseFloat(formData.foreign_matter_percent_maize_grain) || 0,
      pest_damaged: parseFloat(formData.pest_damaged) || 0,
      rotten: parseFloat(formData.rotten) || 0,
    }

    await predict(predictionData)
  }

  // Check if at least one field is filled
  const isFormValid = Object.entries(formData).some(([key, value]) => {
    if (key === 'Liveinfestation' || key === 'abnormal_odours_maize_grain') {
      return true // Binary fields are always valid
    }
    return value !== '' && value !== '0' && parseFloat(value) > 0
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900">{t.aflatoxinPrediction}</h1>
        <p className="text-gray-600 mt-2">{t.predictionDescription}</p>
        {user?.email && (
          <p className="text-sm text-gray-500 mt-1">
            {t.laboratory}: {user.organization || user.email}
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
                      min="0"
                      icon={field.icon}
                      value={formData[field.key]}
                      onChange={(e) => handleFormDataChange(field.key, e.target.value)}
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t.range}: {field.range}</p>
                  </div>
                ))}
              </div>

         
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

            {!isFormValid && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700 text-sm">{t.fillAllFields}</p>
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
          <ResultDisplay2
            result={result} 
            batchInfo={batchInfo}
            
          />
        </div>
      </div>
    </div>
  )
}