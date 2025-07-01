// API configuration and helper functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://model-api-capstone.onrender.com'

class ApiError extends Error {
  constructor(message, status, response) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.response = response
  }
}

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('aflaguard_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }
    
    return await response.text()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    // Network or other errors
    throw new ApiError(
      error.message || 'Network error occurred',
      0,
      null
    )
  }
}

// Specific API functions
export const authApi = {
  login: (credentials) => apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  register: (userData) => apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  logout: () => apiRequest('/api/auth/logout', {
    method: 'POST',
  }),
}

export const predictionApi = {
  predict: (data) => apiRequest('/predict', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getHistory: (userId) => apiRequest(`/api/predictions/${userId}`),
  
  savePrediction: (predictionData) => apiRequest('/api/predictions', {
    method: 'POST',
    body: JSON.stringify(predictionData),
  }),
}

export const dashboardApi = {
  getStats: (userId) => apiRequest(`/api/dashboard/stats/${userId}`),
  
  getRecentTests: (userId, limit = 10) => apiRequest(`/api/dashboard/recent-tests/${userId}?limit=${limit}`),
}

export const userApi = {
  getProfile: (userId) => apiRequest(`/api/users/${userId}`),
  
  updateProfile: (userId, data) => apiRequest(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
}

// Error handling helper
export const handleApiError = (error) => {
  console.error('API Error:', error)
  
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        // Unauthorized - redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('aflaguard_token')
          localStorage.removeItem('aflaguard_user')
          window.location.href = '/auth/login'
        }
        return 'Session expired. Please log in again.'
      
      case 403:
        return 'Access denied. You do not have permission to perform this action.'
      
      case 404:
        return 'The requested resource was not found.'
      
      case 429:
        return 'Too many requests. Please wait a moment and try again.'
      
      case 500:
        return 'Server error. Please try again later.'
      
      default:
        return error.message
    }
  }
  
  return 'An unexpected error occurred. Please check your connection and try again.'
}