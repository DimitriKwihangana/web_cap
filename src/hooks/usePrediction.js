import { useState } from 'react'

export const usePrediction = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const predict = async (data) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://model-api-capstone.onrender.com'
      
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        
        setResult(result)
        return { success: true, data: result }
      } else {
        setError(result.error || 'Prediction failed')
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMessage = 'Network error. Please check your connection and try again.'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const clearResult = () => {
    setResult(null)
    setError(null)
  }

  return {
    predict,
    isLoading,
    result,
    error,
    clearResult
  }
}