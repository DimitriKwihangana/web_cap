import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Briefcase, 
  GraduationCap, 
  Shield, 
  CheckCircle, 
  Edit3, 
  Settings,
  Calendar,
  Star
} from 'lucide-react'

import { useApp } from '../contexts/AppContext'

export default function ProfilePage() {
    const { user } = useApp()
 
  const ProfileSection = ({ icon: Icon, title, children }) => (
    <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-2xl shadow-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-light text-gray-900 tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  )

  const InfoItem = ({ icon: Icon, label, value, verified = false }) => (
    <div className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/60 transition-all duration-300">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-gray-900 font-medium">{value}</p>
        </div>
      </div>
      {verified && (
        <div className="flex items-center space-x-1 text-emerald-600">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Verified</span>
        </div>
      )}
    </div>
  )

  const AccessBadge = ({ type, role }) => {
    const getTypeInfo = () => {
      switch (type) {
        case 'laboratory':
          return {
            color: 'from-purple-500 to-purple-600',
            text: 'Laboratory Access',
            icon: Shield
          }
        case 'admin':
          return {
            color: 'from-red-500 to-red-600',
            text: 'Administrator',
            icon: Settings
          }
        case 'processor':
          return {
            color: 'from-blue-500 to-blue-600',
            text: 'Processor Access',
            icon: Building
          }
        default:
          return {
            color: 'from-gray-500 to-gray-600',
            text: 'Standard Access',
            icon: User
          }
      }
    }

    const typeInfo = getTypeInfo()
    const TypeIcon = typeInfo.icon

    return (
      <div className="flex flex-wrap gap-3">
        <div className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${typeInfo.color} text-white rounded-2xl shadow-lg`}>
          <TypeIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{typeInfo.text}</span>
        </div>
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl shadow-lg">
          <GraduationCap className="w-4 h-4" />
          <span className="text-sm font-medium capitalize">{role}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-white text-3xl font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-light text-gray-900 tracking-tight">{user.name}</h1>
                <p className="text-xl text-gray-600 mt-1">{user.position}</p>
                <p className="text-lg text-emerald-600 font-medium">{user.organization}</p>
                <div className="mt-4">
                  <AccessBadge type={user.type} role={user.role} />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-xl text-gray-700 rounded-2xl hover:bg-white/90 transition-all duration-300 shadow-lg border border-white/30">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Contact Information */}
          <ProfileSection icon={Mail} title="Contact Information">
            <div className="space-y-4">
              <InfoItem 
                icon={Mail} 
                label="Email Address" 
                value={user.email} 
                verified={user.isVerified}
              />
              <InfoItem 
                icon={Phone} 
                label="Phone Number" 
                value={user.phone} 
              />
              <InfoItem 
                icon={MapPin} 
                label="Location" 
                value={user.location} 
              />
            </div>
          </ProfileSection>

          {/* Professional Information */}
          <ProfileSection icon={Briefcase} title="Professional Details">
            <div className="space-y-4">
              <InfoItem 
                icon={Building} 
                label="Organization" 
                value={user.organization} 
              />
              <InfoItem 
                icon={Briefcase} 
                label="Position" 
                value={user.position} 
              />
              <InfoItem 
                icon={Shield} 
                label="Account Type" 
                value={user.type.charAt(0).toUpperCase() + user.type.slice(1)} 
              />
            </div>
          </ProfileSection>
        </div>

        {/* Account Status */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-2xl shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-light text-gray-900 tracking-tight">Account Status</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200/50">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Verified Account</h3>
              <p className="text-sm text-gray-600">Email verified and active</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50">
              <Star className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Professional User</h3>
              <p className="text-sm text-gray-600">Full platform access</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-50 rounded-2xl border border-purple-200/50">
              <Calendar className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Active Member</h3>
              <p className="text-sm text-gray-600">Since 2025</p>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  )
}