import { useState, useEffect } from 'react'
import { usePrediction } from '../../hooks/usePrediction'
import { Zap, Activity, Target, AlertTriangle } from 'lucide-react'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'
import ResultDisplay from './ResultDisplay'
import { useApp } from '../../contexts/AppContext'

export default function PredictionForm() {
  
   const { user, loading } = useApp()
   console.log('User in PredictionForm:', user)

  const { predict, isLoading, result, error } = usePrediction()
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
    // Include all formData parameters
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
    { key: 'moisture_maize_grain', label: 'Moisture Content (%)', icon: Activity, range: '0-30%' },
    { key: 'Immaturegrains', label: 'Immature Grains (%)', icon: Target, range: '0-20%' },
    { key: 'Discolored_grains', label: 'Discolored Grains (%)', icon: AlertTriangle, range: '0-15%' },
    { key: 'broken_kernels_percent_maize_grain', label: 'Broken Kernels (%)', icon: Activity, range: '0-10%' },
    { key: 'foreign_matter_percent_maize_grain', label: 'Foreign Matter (%)', icon: Target, range: '0-5%' },
    { key: 'pest_damaged', label: 'Pest Damage (%)', icon: AlertTriangle, range: '0-25%' },
    { key: 'rotten', label: 'Rotten Grains (%)', icon: Activity, range: '0-10%' }
  ]

  // Sync formData changes to batchInfo
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900">Aflatoxin Prediction</h1>
        <p className="text-gray-600 mt-2">Enter maize grain characteristics to predict aflatoxin contamination</p>
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
          <ResultDisplay result={result} batchInfo={batchInfo} />
        </div>
      </div>
    </div>
  )
}