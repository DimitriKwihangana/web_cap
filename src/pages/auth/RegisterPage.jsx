import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { UserPlus, User, Mail, Building, Award, Phone, MapPin, Lock } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import axios from 'axios'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useApp()
  const [formData, setFormData] = useState({
    userType: '',
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    position: '',
    phone: '',
    location: '',
    termsAccepted: false
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const userTypes = [
    { value: 'institution', label: 'Institution (Schools, Prisons, Bulk Buyers)', icon: Building },
    { value: 'processor', label: 'Food Processor', icon: Award },
    { value: 'laboratory', label: 'Laboratory/Research Facility', icon: User },
    { value: 'cooperative', label: 'Cooperatives/ Big Farmer(farmer)', icon: Building },
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.userType) newErrors.userType = 'Please select an organization type'
    if (!formData.fullName) newErrors.fullName = 'Full name is required'
    if (!formData.organizationName) newErrors.organizationName = 'Organization name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!formData.position) newErrors.position = 'Position is required'
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    if (!formData.location) newErrors.location = 'Location is required'
    if (!formData.termsAccepted) newErrors.terms = 'You must accept the terms and conditions'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({}) // Clear previous errors
    
    try {
      // Prepare data for API
      const apiData = {
        username: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: 'student', // Default role as specified
        type: formData.userType,
        organisation: formData.organizationName,
        position: formData.position,
        phone: formData.phone,
        location: formData.location
      }

      // Make API call
      const response = await axios.post('https://back-cap.onrender.com/api/register', apiData, {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.data.status) {
        // Save user information to localStorage
        const userInfo = {
          id: response.data.data._id,
          name: response.data.data.username,
          email: response.data.data.email,
          type: response.data.data.type,
          organization: response.data.data.organisation,
          role: response.data.data.role,
          position: formData.position,
          phone: formData.phone,
          location: formData.location,
          isVerified: response.data.data.isVerified
        }
        
        localStorage.setItem('user', JSON.stringify(userInfo))
        localStorage.setItem('isAuthenticated', 'true')
        
        // Update app context
        login(userInfo)
        
        // Show success message (optional)
        alert('Registration successful! A verification email has been sent.')
        
        // Navigate to dashboard
        navigate('/dashboard')
      } else {
        setErrors({ submit: response.data.message || 'Registration failed. Please try again.' })
      }
    } catch (err) {
      console.error('Registration error:', err)
      
      if (err.response && err.response.data) {
        // Server responded with error
        setErrors({ submit: err.response.data.message || 'Registration failed. Please try again.' })
      } else if (err.request) {
        // Network error
        setErrors({ submit: 'Network error. Please check your connection and try again.' })
      } else {
        // Other error
        setErrors({ submit: 'An unexpected error occurred. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 font-light">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-light text-gray-900">Join AflaGuard Pro</h1>
            <p className="text-gray-600 mt-2">Create your account and start protecting food safety</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-light text-gray-700 mb-3">Organization Type</label>
              <div className="grid grid-cols-2 gap-3">
                {userTypes.map(type => (
                  <label key={type.value} className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value={type.value}
                      checked={formData.userType === type.value}
                      onChange={(e) => setFormData({...formData, userType: e.target.value})}
                      className="mr-3"
                    />
                    <type.icon className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-900">{type.label}</span>
                  </label>
                ))}
              </div>
              {errors.userType && <p className="text-red-600 text-sm mt-1">{errors.userType}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6 font-light">
              <Input
                label="Full Name"
                icon={User}
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                error={errors.fullName}
                required
              />
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                error={errors.email}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Organization Name"
                icon={Building}
                value={formData.organizationName}
                onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                error={errors.organizationName}
                required
              />
              <Input
                label="Position/Title"
                icon={Award}
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                error={errors.position}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Phone Number"
                icon={Phone}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                error={errors.phone}
                required
              />
              <Input
                label="Location"
                icon={MapPin}
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                error={errors.location}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Password"
                type="password"
                icon={Lock}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                error={errors.password}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                error={errors.confirmPassword}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                  className="rounded"
                />
                <label className="text-sm text-gray-600">
                  I agree to the <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>
              {errors.terms && <p className="text-red-600 text-sm">{errors.terms}</p>}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm text-center">
                {errors.submit}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button onClick={() => navigate('/auth/login')} className="text-blue-600 hover:underline">
                Sign in here
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}