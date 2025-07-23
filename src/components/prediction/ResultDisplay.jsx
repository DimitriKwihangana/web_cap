import { useState } from 'react'
import { CheckCircle, AlertTriangle, FileText, Database, Info, Loader2 } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useApp } from '../../contexts/AppContext'

export default function ResultDisplay({ result, batchInfo, userId, userName, testId }) {

  const { user } = useApp()
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) 

  console.log(user, "user")
  console.log(testId, "testId")
  
const saveBatch = async () => {
  if (!user || !batchInfo || !result) {
    setSaveStatus('error')
    return
  }

  setIsSaving(true)
  setSaveStatus(null)

  try {
    const predictionValue = typeof result === 'number' ? result :
                            (typeof result.prediction === 'number' ? result.prediction : 0)

    const batchData = {
      batchId: batchInfo.batchId,
      supplier: batchInfo.supplier,
      date: batchInfo.date,
      userId: userId,
      userName: userName,
      moisture_maize_grain: parseFloat(batchInfo.moisture_maize_grain) || 0,
      Immaturegrains: parseFloat(batchInfo.Immaturegrains) || 0,
      Discolored_grains: parseFloat(batchInfo.Discolored_grains) || 0,
      broken_kernels_percent_maize_grain: parseFloat(batchInfo.broken_kernels_percent_maize_grain) || 0,
      foreign_matter_percent_maize_grain: parseFloat(batchInfo.foreign_matter_percent_maize_grain) || 0,
      pest_damaged: parseFloat(batchInfo.pest_damaged) || 0,
      rotten: parseFloat(batchInfo.rotten) || 0,
      Liveinfestation: parseInt(batchInfo.Liveinfestation) || 0,
      abnormal_odours_maize_grain: parseInt(batchInfo.abnormal_odours_maize_grain) || 0,
      aflatoxin: predictionValue
    }

    const response = await fetch('https://back-cap.onrender.com/api/batches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batchData)
    })

    const responseData = await response.json()

    if (response.ok && responseData.success) {
      console.log('Batch saved successfully:', responseData.data)

      
      const updateTestResponse = await fetch(`https://back-cap.onrender.com/api/tests/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tested: true,
          testedId: responseData.data._id  
        })
      })

      if (!updateTestResponse.ok) {
        throw new Error('Failed to update test status')
      }

      setSaveStatus('success')
    } else {
      setSaveStatus('error')
      console.error('Failed to save batch:', responseData.message || responseData.error)
    }
  } catch (error) {
    setSaveStatus('error')
    console.error('Error saving batch or updating test:', error)
  } finally {
    setIsSaving(false)
  }
}

  
  if (!result) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Result</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Enter grain characteristics and click predict to see results</p>
        </div>
      </Card>
    )
  }

  if (result.error) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Result</h3>
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{result.error}</p>
        </div>
      </Card>
    )
  }

  // Extract the actual prediction value - fix for the React error
  const predictionValue = typeof result === 'number' ? result : 
                         (typeof result.prediction === 'number' ? result.prediction : 0)

  // Determine category based on result value
  const getResultCategory = (value) => {
    if (value >= 0 && value <= 5) {
      return {
        status: 'safe',
        title: 'Safe for Children',
        description: 'Low aflatoxin levels - safe for all consumption',
        color: 'green',
        icon: CheckCircle
      }
    } else if (value > 5 && value <= 10) {
      return {
        status: 'adults-only',
        title: 'Safe for Adults Only',
        description: 'Moderate aflatoxin levels - not recommended for children',
        color: 'yellow',
        icon: Info
      }
    } else if (value > 10 && value <= 20) {
      return {
        status: 'animals-only',
        title: 'Suitable for Animal Feed Only',
        description: 'High aflatoxin levels - not safe for human consumption',
        color: 'orange',
        icon: AlertTriangle
      }
    } else {
      return {
        status: 'unsafe',
        title: 'Not Safe for Any Use',
        description: 'Very high aflatoxin contamination detected',
        color: 'red',
        icon: AlertTriangle
      }
    }
  }

  const category = getResultCategory(predictionValue)
  const IconComponent = category.icon

  const getColorClasses = (color) => {
    const colorMap = {
      green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        border: 'border-green-200'
      },
      yellow: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-600',
        border: 'border-yellow-200'
      },
      orange: {
        bg: 'bg-orange-100',
        text: 'text-orange-600',
        border: 'border-orange-200'
      },
      red: {
        bg: 'bg-red-100',
        text: 'text-red-600',
        border: 'border-red-200'
      }
    }
    return colorMap[color]
  }

  const colors = getColorClasses(category.color)

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Result</h3>
      
      <div className="space-y-4">
        <div className="text-center">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${colors.bg}`}>
            <IconComponent className={`w-10 h-10 ${colors.text}`} />
          </div>
          <h4 className={`text-2xl font-bold ${colors.text}`}>
            {category.title}
          </h4>
          <p className="text-gray-600">
            {category.description}
          </p>
        </div>

        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Aflatoxin Level (ppb):</span>
             <span className="font-semibold">
  {Number(predictionValue).toFixed(2)}
</span>

            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Batch ID:</span>
              <span className="font-semibold">{batchInfo?.batchId || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Test Date:</span>
              <span className="font-semibold">{batchInfo?.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Supplier:</span>
              <span className="font-semibold">{batchInfo?.supplier || 'N/A'}</span>
            </div>
            {user && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tested by:</span>
                <span className="font-semibold">{user.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Save Status Messages */}
        {saveStatus === 'success' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium">✓ Batch saved successfully!</p>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">✗ Failed to save batch. Please try again.</p>
          </div>
        )}

        {/* Sorting Machine Recommendation for unsafe grains */}
        {predictionValue > 20 && (
          <div className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}>
            <h4 className={`font-medium ${colors.text} mb-2`}>Recommendation</h4>
            <p className="text-sm text-gray-700 mb-3">
              Due to very high aflatoxin contamination, we strongly recommend using a sorting machine to separate affected grains and reduce contamination levels.
            </p>
            <Button size="sm" variant="outline" className={`${colors.text} border-current`}>
              Learn About Sorting Solutions
            </Button>
          </div>
        )}

        <div className="flex space-x-2 pt-4">
          <Button size="sm" className="flex-1">
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={saveBatch}
            disabled={isSaving || !user || !batchInfo || !result || saveStatus === 'success'}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            {isSaving ? 'Saving...' : 
             saveStatus === 'success' ? 'Saved!' : 
             'Save Result'}
          </Button>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Quick Tips</h4>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p>Ensure accurate measurements for better predictions</p>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p>Test multiple samples from large batches</p>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p>Keep detailed records for traceability</p>
          </div>
        </div>
      </div>
    </Card>
  )
}