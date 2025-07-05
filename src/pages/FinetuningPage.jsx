import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, AlertTriangle, Brain, Target, TrendingUp, Download, Sparkles } from 'lucide-react'

export default function FineTunePage() {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null) // 'success', 'error', null
  const [result, setResult] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  // Handle file selection
  const handleFileSelect = (selectedFile) => {
    if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx'))) {
      setFile(selectedFile)
      setUploadStatus(null)
      setResult(null)
    } else {
      alert('Please select a CSV or Excel file for training data')
    }
  }

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  // Fine-tune model
  const handleFineTune = async () => {
    if (!file) {
      alert('Please select a training file first')
      return
    }

    setIsUploading(true)
    setUploadStatus(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('https://model-api-capstone.onrender.com/fine_tune', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.status === 'success') {
        setUploadStatus('success')
        setResult(data)
      } else {
        setUploadStatus('error')
        setResult(data)
      }
    } catch (error) {
      console.error('Fine-tuning error:', error)
      setUploadStatus('error')
      setResult({
        status: 'error',
        message: 'Network error: Could not connect to the fine-tuning service'
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Remove selected file
  const removeFile = () => {
    setFile(null)
    setUploadStatus(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 relative overflow-hidden">
      {/* Background Glass Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 via-transparent to-teal-100/20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-teal-200/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 backdrop-blur-xl rounded-3xl border border-emerald-200/30 mb-6">
            <Brain className="text-emerald-600" size={40} />
          </div>
          <h1 className="text-3xl font-thin text-gray-900 tracking-tight mb-4">
            AI Model
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-medium"> Fine-Tuning</span>
          </h1>
          <p className="text-xl text-gray-600/80 max-w-2xl mx-auto leading-relaxed font-light">
            Enhance your aflatoxin prediction model with cutting-edge machine learning capabilities
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Upload Section */}
          <div className="space-y-8">
            <div className="bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-emerald-500/5 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mr-4">
                  <Upload className="text-emerald-600" size={24} />
                </div>
                <h2 className="text-2xl font-light text-gray-900">Upload Training Data</h2>
              </div>
              
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-emerald-400/60 bg-emerald-50/30 backdrop-blur-xl' 
                    : 'border-gray-300/50 hover:border-emerald-400/40 hover:bg-white/30 backdrop-blur-sm'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 backdrop-blur-xl rounded-2xl">
                      <FileText className="text-emerald-600" size={32} />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500/80">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-sm text-red-500/80 hover:text-red-600 transition-colors font-medium"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100/50 to-gray-200/30 backdrop-blur-xl rounded-3xl">
                      <Upload className="text-gray-400" size={40} />
                    </div>
                    <div>
                      <p className="text-2xl font-light text-gray-900 mb-2">
                        Drop your training file here
                      </p>
                      <p className="text-gray-500/80">
                        or click to browse files
                      </p>
                    </div>
                    <p className="text-xs text-gray-400/80 font-medium tracking-wide uppercase">
                      Supports CSV and Excel files
                    </p>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInputChange}
                />
                
                {!file && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-8 px-8 py-4 bg-gradient-to-r from-emerald-500/90 to-teal-500/90 backdrop-blur-xl text-white rounded-2xl hover:from-emerald-600/90 hover:to-teal-600/90 transition-all duration-300 font-medium shadow-lg shadow-emerald-500/20 border border-emerald-400/20"
                  >
                    Choose File
                  </button>
                )}
              </div>

              {/* Training Requirements */}
              <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 backdrop-blur-xl rounded-2xl border border-emerald-200/30">
                <div className="flex items-center mb-4">
                  <Sparkles className="text-emerald-600 mr-2" size={18} />
                  <h3 className="font-medium text-emerald-800">Training Data Requirements</h3>
                </div>
                <ul className="text-sm text-emerald-700/80 space-y-2 leading-relaxed">
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    CSV or Excel format with proper headers
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    Include all feature columns: moisture, grains, kernels, etc.
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    Target column should contain aflatoxin levels (ppb)
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    Minimum 50 samples recommended for optimal performance
                  </li>
                </ul>
              </div>

              {/* Fine-tune Button */}
              <button
                onClick={handleFineTune}
                disabled={!file || isUploading}
                className={`w-full mt-8 px-8 py-5 rounded-2xl font-medium transition-all duration-300 shadow-xl ${
                  !file || isUploading
                    ? 'bg-gray-200/50 text-gray-400 cursor-not-allowed backdrop-blur-xl'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:shadow-2xl transform hover:-translate-y-0.5'
                }`}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    <span className="text-lg">Training Model...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <TrendingUp className="mr-3" size={22} />
                    <span className="text-lg">Start Fine-Tuning</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            {/* Current Model Info */}
            <div className="bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-emerald-500/5 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mr-4">
                  <Target className="text-purple-600" size={24} />
                </div>
                <h2 className="text-2xl font-light text-gray-900">Current Model Status</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-white/30 backdrop-blur-xl rounded-xl border border-white/20">
                  <span className="text-gray-600/80">Model Type</span>
                  <span className="font-medium text-gray-900">Linear Regression</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/30 backdrop-blur-xl rounded-xl border border-white/20">
                  <span className="text-gray-600/80">Status</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="font-medium text-emerald-600">Active</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/30 backdrop-blur-xl rounded-xl border border-white/20">
                  <span className="text-gray-600/80">Features</span>
                  <span className="font-medium text-gray-900">9 Parameters</span>
                </div>
              </div>
            </div>

            {/* Results Display */}
            {uploadStatus && (
              <div className="bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-emerald-500/5 p-8">
                <h2 className="text-2xl font-light text-gray-900 mb-6">
                  Training Results
                </h2>
                
                {uploadStatus === 'success' ? (
                  <div className="space-y-6">
                    <div className="flex items-center text-emerald-600 p-4 bg-emerald-50/50 backdrop-blur-xl rounded-xl border border-emerald-200/30">
                      <CheckCircle className="mr-3" size={24} />
                      <span className="font-medium text-lg">Model trained successfully!</span>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/30 backdrop-blur-xl p-6 rounded-2xl border border-emerald-200/30">
                      <p className="text-emerald-800/90 mb-2">
                        <strong>Status:</strong> {result?.message}
                      </p>
                      <p className="text-emerald-800/90">
                        <strong>Model Type:</strong> {result?.model_type}
                      </p>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl border border-emerald-300/20">
                      <p className="text-emerald-700/90 flex items-start">
                        <CheckCircle className="mr-2 mt-0.5 flex-shrink-0" size={16} />
                        Your model has been updated and is now ready for predictions with the new training data.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center text-red-600 p-4 bg-red-50/50 backdrop-blur-xl rounded-xl border border-red-200/30">
                      <AlertTriangle className="mr-3" size={24} />
                      <span className="font-medium text-lg">Training failed</span>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-50/50 to-red-100/30 backdrop-blur-xl p-6 rounded-2xl border border-red-200/30">
                      <p className="text-red-800/90">
                        <strong>Error:</strong> {result?.message || 'Unknown error occurred'}
                      </p>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl border border-red-300/20">
                      <p className="text-red-700/90">
                        Please check your training data format and try again. Make sure all required columns are present.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Help Section */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-600/5 backdrop-blur-2xl rounded-3xl p-8 border border-emerald-200/30 shadow-xl shadow-emerald-500/5">
              <h3 className="text-xl font-light text-emerald-800 mb-6 flex items-center">
                <Sparkles className="mr-2" size={20} />
                Need Help?
              </h3>
              <div className="space-y-3 text-emerald-700/80 leading-relaxed">
                <p className="flex items-start">
                  <span className="text-emerald-500 mr-2 mt-1">•</span>
                  Ensure your data includes all required feature columns
                </p>
                <p className="flex items-start">
                  <span className="text-emerald-500 mr-2 mt-1">•</span>
                  Check that the target column contains valid aflatoxin values
                </p>
                <p className="flex items-start">
                  <span className="text-emerald-500 mr-2 mt-1">•</span>
                  Verify data quality and remove any corrupted entries
                </p>
                <p className="flex items-start">
                  <span className="text-emerald-500 mr-2 mt-1">•</span>
                  Contact support if issues persist
                </p>
              </div>
              
              <button className="mt-8 px-6 py-3 bg-gradient-to-r from-emerald-500/90 to-teal-500/90 backdrop-blur-xl text-white rounded-xl hover:from-emerald-600/90 hover:to-teal-600/90 transition-all duration-300 font-medium shadow-lg shadow-emerald-500/20 border border-emerald-400/20 flex items-center">
                <Download className="mr-2" size={18} />
                Download Sample Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}