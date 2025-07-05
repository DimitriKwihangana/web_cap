import { useNavigate } from 'react-router-dom'
import { Zap, FileText, Database, Book, Brain, Settings, Users, Shield, ShoppingCart } from 'lucide-react'
import Button from '../ui/Button'
import { useApp } from '../../contexts/AppContext'

export default function QuickActions() {
  const { user } = useApp()
  const navigate = useNavigate()

  console.log(user, 'user__________')

  // Base actions for all users
  const baseActions = [
    { icon: Zap, label: 'New Prediction', href: '/predict' },
    { icon: FileText, label: 'Generate Report', href: '/reports' },
    { icon: Database, label: 'Export Data', href: '/export' },
    { icon: Book, label: 'Learning Center', href: '/learn' }
  ]

  // Conditional actions based on user type
  const getConditionalActions = () => {
    const conditionalActions = []

    // Add marketplace for processor, admin, or institution users
    if (user?.type === 'processor' || user?.type === 'admin' || user?.type === 'institution') {
      conditionalActions.push({
        icon: ShoppingCart,
        label: 'Marketplace',
        href: '/marketplace',
        className: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 border-emerald-500'
      })
    }

    // Add retraining model card for laboratory or admin users
    if (user?.type === 'laboratory' || user?.type === 'admin') {
      conditionalActions.push({
        icon: Brain,
        label: 'Fine-tune Model',
        href: '/finetune',
        className: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 border-purple-500'
      })
    }

    // Add admin-specific actions
    if (user?.type === 'admin') {
      conditionalActions.push({
        icon: Users,
        label: 'Manage Users',
        href: '/admin/users',
        className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 border-blue-500'
      })
      conditionalActions.push({
        icon: Settings,
        label: 'System Settings',
        href: '/admin/settings',
        className: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 border-gray-500'
      })
      conditionalActions.push({
        icon: Shield,
        label: 'Security Center',
        href: '/admin/security',
        className: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 border-red-500'
      })
    }

    return conditionalActions
  }

  const conditionalActions = getConditionalActions()
  const allActions = [...baseActions, ...conditionalActions]

  return (
    <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8">
      <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">Quick Actions</h2>
      
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
              {user?.type} 
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
              {user?.type === 'admin' ? 'Administrator Access' : 'Laboratory Access'}
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
              {user?.type === 'processor' ? 'Grain Processor Access' : 'Institution Access'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}