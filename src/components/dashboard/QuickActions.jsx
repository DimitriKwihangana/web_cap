import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, FileText, Database, Book, Brain, Settings, Users, Shield, ShoppingCart, Package } from 'lucide-react'
import Button from '../ui/Button'
import { useApp } from '../../contexts/AppContext'

export default function QuickActions() {
  const { user } = useApp()
  const navigate = useNavigate()
  const [language, setLanguage] = useState('en')

  // Load language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  console.log(user, 'user_________')

  // Translation object
  const translations = {
    en: {
      // Main title
      quickActions: 'Quick Actions',
      
      // Base actions
      newPrediction: 'New Prediction',
      test: 'Test',
      learningCenter: 'Learning Center',
      
      // Conditional actions
      orderTracking: 'Order Tracking',
      marketplace: 'Marketplace',
      finetune: 'Fine-tune Model',
      manageUsers: 'Manage Users',
      systemSettings: 'System Settings',
      securityCenter: 'Security Center',
      
      // User types
      laboratory: 'laboratory',
      processor: 'processor',
      admin: 'admin',
      institution: 'institution',
      cooperative: 'cooperative',
      
      // Access indicators
      administratorAccess: 'Administrator Access',
      laboratoryAccess: 'Laboratory Access',
      grainProcessorAccess: 'Grain Processor Access',
      institutionAccess: 'Institution Access',
      cooperativeAccess: 'Cooperative Access'
    },
    rw: {
      // Main title
      quickActions: 'Ibikorwa Byihuse',
      
      // Base actions
      newPrediction: 'Guhanura Gushya',
      test: 'Gupima',
      learningCenter: 'Ikigo cyo Kwiga',
      
      // Conditional actions
      orderTracking: 'Gukurikirana Ibitabo',
      marketplace: 'Isoko',
      finetune: 'Kuzamura Moderi',
      manageUsers: 'Gucunga Abakoresha',
      systemSettings: 'Igenamiterere rya Sisitemu',
      securityCenter: 'Ikigo cy\'Umutekano',
      
      // User types
      laboratory: 'ubushakashatsi',
      processor: 'ukora ibiryo',
      admin: 'umuyobozi',
      institution: 'ikigo',
      cooperative: 'ubwiyunge',
      
      // Access indicators
      administratorAccess: 'Uburenganzira bw\'Umuyobozi',
      laboratoryAccess: 'Uburenganzira bw\'Ubushakashatsi',
      grainProcessorAccess: 'Uburenganzira bw\'Ukora Ibinyampeke',
      institutionAccess: 'Uburenganzira bw\'Ikigo',
      cooperativeAccess: 'Uburenganzira bw\'Ubwiyunge'
    }
  }

  const t = translations[language]

  const baseActions = [
    { 
      icon: Zap, 
      label: user?.type === 'laboratory' ? t.newPrediction : t.test, 
      href: user?.type === 'laboratory' ? '/predict' : '/test' 
    },
    { icon: Book, label: t.learningCenter, href: '/learn' }
  ]

  const getConditionalActions = () => {
    const conditionalActions = []

    if (user?.type === 'cooperative' ) {
      conditionalActions.push({
        icon: Package,
        label: t.orderTracking,
        href: '/ordermanagement',
      })
    }

    if (user?.type === 'processor' || user?.type === 'admin' || user?.type === 'institution') {
      conditionalActions.push({
        icon: ShoppingCart,
        label: t.marketplace,
        href: '/marketplace',
        className: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 border-emerald-500'
      })
    }

    // Add retraining model card for laboratory or admin users
    if (user?.type === 'laboratory' || user?.type === 'admin') {
      conditionalActions.push({
        icon: Brain,
        label: t.finetune,
        href: '/finetune',
        className: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 border-purple-500'
      })
    }

    // Add admin-specific actions
    if (user?.type === 'admin') {
      conditionalActions.push({
        icon: Users,
        label: t.manageUsers,
        href: '/admin/users',
        className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 border-blue-500'
      })
      conditionalActions.push({
        icon: Settings,
        label: t.systemSettings,
        href: '/admin/settings',
        className: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 border-gray-500'
      })
      conditionalActions.push({
        icon: Shield,
        label: t.securityCenter,
        href: '/admin/security',
        className: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 border-red-500'
      })
    }

    return conditionalActions
  }

  const conditionalActions = getConditionalActions()
  const allActions = [...baseActions, ...conditionalActions]

  // Helper function to get translated user type
  const getUserTypeTranslation = (userType) => {
    switch(userType) {
      case 'laboratory': return t.laboratory
      case 'processor': return t.processor
      case 'admin': return t.admin
      case 'institution': return t.institution
      case 'cooperative': return t.cooperative
      default: return userType
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8">
      <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">{t.quickActions}</h2>
      
      {/* User info badge */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-200/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-medium text-sm">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{user?.name || user?.email}</p>
            <p className="text-xs text-gray-500 capitalize">
              {getUserTypeTranslation(user?.type)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {allActions.map((action, index) => (
          <Button
            key={index}
            className={`w-full justify-start transition-all duration-200 ${
              action.className || 
              'bg-white/40 backdrop-blur-sm border-white/20 hover:bg-white/60 text-gray-700 hover:text-gray-900 shadow-lg hover:shadow-xl'
            }`}
            variant={action.className ? "default" : "outline"}
            onClick={() => navigate(action.href)}
          >
            <action.icon className="w-5 h-5 mr-3" />
            {action.label}
          </Button>
        ))}
      </div>

      {/* Special access indicator for privileged users */}
      {(user?.type === 'laboratory' || user?.type === 'admin') && (
        <div className="mt-6 p-3 bg-gradient-to-r from-emerald-50/80 to-green-50/80 rounded-xl border border-emerald-200/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-700 font-medium">
              {user?.type === 'admin' ? t.administratorAccess : t.laboratoryAccess}
            </span>
          </div>
        </div>
      )}

      {/* Marketplace access indicator */}
      {(user?.type === 'processor' || user?.type === 'institution') && (
        <div className="mt-6 p-3 bg-gradient-to-r from-emerald-50/80 to-green-50/80 rounded-xl border border-emerald-200/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-700 font-medium">
              {user?.type === 'processor' ? t.grainProcessorAccess : t.institutionAccess}
            </span>
          </div>
        </div>
      )}

      {/* Cooperative access indicator */}
      {user?.type === 'cooperative' && (
        <div className="mt-6 p-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-200/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">
              {t.cooperativeAccess}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}