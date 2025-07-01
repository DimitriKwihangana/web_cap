import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { UserPlus, User, Mail, Building, Award, Phone, MapPin, Lock } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'

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
    { value: 'laboratory', label: 'Laboratory/Research Facility', icon: User }
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.userType) newErrors.userType = 'Please select an organization type'
    if (!formData.fullName) newErrors.fullName = 'Full name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!formData.termsAccepted) newErrors.terms = 'You must accept the terms and conditions'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock registration success
      login({
        id: 1,
        name: formData.fullName,
        email: formData.email,
        type: formData.userType,
        organization: formData.organizationName
      })
      
      navigate('/dashboard')
    } catch (err) {
      setErrors({ submit: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Join AflaGuard Pro</h1>
            <p className="text-gray-600 mt-2">Create your account and start protecting food safety</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Organization Type</label>
              <div className="grid gap-3">
                {userTypes.map(type => (
                  <label key={type.value} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
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

            <div className="grid md:grid-cols-2 gap-6">
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
                required
              />
              <Input
                label="Position/Title"
                icon={Award}
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Phone Number"
                icon={Phone}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
              <Input
                label="Location"
                icon={MapPin}
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
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
              <div className="text-red-600 text-sm text-center">{errors.submit}</div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={isLoading}>
              Create Account
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