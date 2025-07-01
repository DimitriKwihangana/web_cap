import { CheckCircle, AlertTriangle, FileText, Database } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

export default function ResultDisplay({ result, batchInfo }) {
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

  // Mock result interpretation (replace with actual API response handling)
  const confidence = Math.random() * 20 + 80
  const isSafe = confidence > 75

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Result</h3>
      
      <div className="space-y-4">
        <div className="text-center">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isSafe ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isSafe ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-red-600" />
            )}
          </div>
          <h4 className={`text-2xl font-bold ${isSafe ? 'text-green-600' : 'text-red-600'}`}>
            {isSafe ? 'Safe to Consume' : 'High Risk Detected'}
          </h4>
          <p className="text-gray-600">
            {isSafe ? 'Low aflatoxin risk detected' : 'High aflatoxin contamination risk'}
          </p>
        </div>

        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Confidence Score:</span>
              <span className="font-semibold">{confidence.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Batch ID:</span>
              <span className="font-semibold">{batchInfo.batchId || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Test Date:</span>
              <span className="font-semibold">{batchInfo.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Supplier:</span>
              <span className="font-semibold">{batchInfo.supplier || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 pt-4">
          <Button size="sm" className="flex-1">
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Database className="w-4 h-4" />
            Save Result
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