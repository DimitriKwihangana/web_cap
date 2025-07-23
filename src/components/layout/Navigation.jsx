import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { Shield, Home, Zap, Book, User, Bell, Menu, X, LogOut, LogIn, UserPlus, Mail } from 'lucide-react'

export default function Navigation() {
  const { user, logout } = useApp()
  console.log(user, "user in Navigation")
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = user ? [
    { key: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
    { 
      key: 'predict', 
      label: user.type === 'laboratory' ? 'Predict' : 'Test', 
      icon: Zap, 
      href: user.type === 'laboratory' ? '/predict' : '/test' 
    },
    { key: 'learn', label: 'Learn', icon: Book, href: '/learn' },
    { key: 'profile', label: 'Profile', icon: User, href: '/profile' }
  ] : [
    { key: 'home', label: 'Home', icon: Home, href: '/' },
    { key: 'about', label: 'About', icon: Shield, href: '/about' },
    { key: 'contact', label: 'Contact', icon: Mail, href: '/contact' }
  ]

  const handleNavigation = (href) => {
    navigate(href)
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white/95 backdrop-blur-2xl border-b border-white/30 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer group" onClick={() => handleNavigation('/')}>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-light text-slate-900">AflaGuard</h1>
                <p className="text-sm font-light text-emerald-600">Professional</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => handleNavigation(item.href)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  location.pathname === item.href 
                    ? 'bg-white/80 text-emerald-700 backdrop-blur-xl shadow-lg border border-emerald-200/50' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70 hover:backdrop-blur-xl hover:shadow-md hover:border hover:border-white/30'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative group">
                  <div className="p-3 rounded-2xl bg-white/80 backdrop-blur-xl hover:bg-white/90 transition-all duration-300 cursor-pointer shadow-lg border border-white/30">
                    <Bell className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
                  </div>
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg">
                    3
                  </span>
                </div>

                {/* User Avatar & Info */}
                <div className="flex items-center space-x-3 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-xl shadow-lg border border-white/30">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-medium">
                      {user.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                    {user.name}
                  </span>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-xl hover:bg-white/90 text-slate-600 hover:text-slate-900 font-medium transition-all duration-300 shadow-lg border border-white/30"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Login Button */}
                <button 
                  onClick={() => handleNavigation('/auth/login')}
                  className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white/80 backdrop-blur-xl hover:bg-white/90 text-slate-600 hover:text-slate-900 font-medium transition-all duration-300 shadow-lg border border-white/30"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </button>
                
                {/* Register Button */}
                <button 
                  onClick={() => handleNavigation('/auth/register')}
                  className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Register</span>
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-2xl bg-white/80 backdrop-blur-xl hover:bg-white/90 text-slate-600 hover:text-slate-900 transition-all duration-300 shadow-lg border border-white/30"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-white/30 bg-white/95 backdrop-blur-2xl">
            <div className="space-y-3">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-medium transition-all duration-300 ${
                    location.pathname === item.href 
                      ? 'bg-white/80 text-emerald-700 backdrop-blur-xl shadow-lg border border-emerald-200/50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70 hover:backdrop-blur-xl hover:border hover:border-white/30'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
              
              {/* Mobile Auth Buttons */}
              {!user && (
                <div className="pt-4 space-y-3 border-t border-white/30">
                  <button 
                    onClick={() => handleNavigation('/auth/login')}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-white/80 backdrop-blur-xl text-slate-600 font-medium shadow-lg border border-white/30"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                  <button 
                    onClick={() => handleNavigation('/auth/register')}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-emerald-600 text-white font-medium shadow-lg"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Register</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}