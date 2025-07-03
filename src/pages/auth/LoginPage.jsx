import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import axios from 'axios'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useApp()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required')
      return false
    }
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setError('')
    
    try {
      // Make API call to login endpoint
      const response = await axios.post('https://back-cap.onrender.com/api/login', {
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.data.status) {
        // Prepare user information for storage
        const userInfo = {
          id: response.data.user._id,
          name: response.data.user.username,
          email: response.data.user.email,
          type: response.data.user.type,
          organization: response.data.user.organisation,
          role: response.data.user.role,
          position: response.data.user.position || '',
          phone: response.data.user.phone || '',
          location: response.data.user.location || '',
          isVerified: response.data.user.isVerified
        }
        
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(userInfo))
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('isAuthenticated', 'true')
        
        // Set token expiry time (1 hour from now)
        const expiryTime = new Date().getTime() + (60 * 60 * 1000) // 1 hour
        localStorage.setItem('tokenExpiry', expiryTime.toString())
        
        // Remember me functionality
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true')
          localStorage.setItem('rememberedEmail', formData.email)
        } else {
          localStorage.removeItem('rememberMe')
          localStorage.removeItem('rememberedEmail')
        }
        
        // Update app context
        login(userInfo)
        
        // Navigate to dashboard
        navigate('/dashboard')
      } else {
        setError(response.data.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      console.error('Login error:', err)
      
      if (err.response && err.response.data) {
        // Server responded with error
        const errorMessage = err.response.data.message
        
        // Handle specific error cases
        if (err.response.status === 404) {
          setError('User not found. Please check your email or create an account.')
        } else if (err.response.status === 403) {
          setError('Please verify your email before logging in. Check your inbox for verification link.')
        } else if (err.response.status === 400) {
          setError('Invalid email or password. Please try again.')
        } else {
          setError(errorMessage || 'Login failed. Please try again.')
        }
      } else if (err.request) {
        // Network error
        setError('Network error. Please check your connection and try again.')
      } else {
        // Other error
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Load remembered email on component mount
  useState(() => {
    const rememberMe = localStorage.getItem('rememberMe')
    const rememberedEmail = localStorage.getItem('rememberedEmail')
    
    if (rememberMe === 'true' && rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-light text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your AflaGuard Pro account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button onClick={() => navigate('/auth/register')} className="text-blue-600 hover:underline">
                Create one here
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}