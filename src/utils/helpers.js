// General utility functions

// Date formatting
export const formatDate = (dateString, options = {}) => {
    const date = new Date(dateString)
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    }
    return date.toLocaleDateString('en-US', defaultOptions)
  }
  
  export const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Number formatting
  export const formatNumber = (number, decimals = 2) => {
    return Number(number).toFixed(decimals)
  }
  
  export const formatPercentage = (value, decimals = 1) => {
    return `${Number(value).toFixed(decimals)}%`
  }
  
  export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }
  
  // String utilities
  export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }
  
  export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + '...'
  }
  
  export const slugify = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
  }
  
  // Validation utilities
  export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  export const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }
  
  export const validatePassword = (password) => {
    const errors = []
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  // Data processing utilities
  export const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
      const group = item[key]
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    }, {})
  }
  
  export const sortBy = (array, key, direction = 'asc') => {
    return [...array].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }
  
  export const filterBy = (array, filters) => {
    return array.filter(item => {
      return Object.keys(filters).every(key => {
        const filterValue = filters[key]
        const itemValue = item[key]
        
        if (typeof filterValue === 'string') {
          return itemValue.toLowerCase().includes(filterValue.toLowerCase())
        }
        
        return itemValue === filterValue
      })
    })
  }
  
  // Local storage utilities
  export const storage = {
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
        return true
      } catch (error) {
        console.error('Error saving to localStorage:', error)
        return false
      }
    },
    
    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
      } catch (error) {
        console.error('Error reading from localStorage:', error)
        return defaultValue
      }
    },
    
    remove: (key) => {
      try {
        localStorage.removeItem(key)
        return true
      } catch (error) {
        console.error('Error removing from localStorage:', error)
        return false
      }
    },
    
    clear: () => {
      try {
        localStorage.clear()
        return true
      } catch (error) {
        console.error('Error clearing localStorage:', error)
        return false
      }
    }
  }
  
  // File utilities
  export const downloadFile = (data, filename, type = 'application/json') => {
    const blob = new Blob([data], { type })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
  
  export const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(e)
      reader.readAsText(file)
    })
  }
  
  // URL utilities
  export const buildQueryString = (params) => {
    const searchParams = new URLSearchParams()
    
    Object.keys(params).forEach(key => {
      const value = params[key]
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value)
      }
    })
    
    return searchParams.toString()
  }
  
  export const parseQueryString = (queryString) => {
    const params = new URLSearchParams(queryString)
    const result = {}
    
    for (let [key, value] of params) {
      result[key] = value
    }
    
    return result
  }
  
  // Error handling utilities
  export const createErrorMessage = (error, defaultMessage = 'An error occurred') => {
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    if (error?.error) return error.error
    return defaultMessage
  }
  
  // Debounce utility
  export const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
  
  // Throttle utility
  export const throttle = (func, limit) => {
    let lastFunc
    let lastRan
    return function(...args) {
      if (!lastRan) {
        func(...args)
        lastRan = Date.now()
      } else {
        clearTimeout(lastFunc)
        lastFunc = setTimeout(() => {
          if ((Date.now() - lastRan) >= limit) {
            func(...args)
            lastRan = Date.now()
          }
        }, limit - (Date.now() - lastRan))
      }
    }
  }
  
  // Array utilities
  export const chunk = (array, size) => {
    const chunks = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }
  
  export const unique = (array, key = null) => {
    if (key) {
      const seen = new Set()
      return array.filter(item => {
        const value = item[key]
        if (seen.has(value)) return false
        seen.add(value)
        return true
      })
    }
    return [...new Set(array)]
  }
  
  // Random utilities
  export const generateId = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
  
  export const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }