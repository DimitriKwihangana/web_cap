import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { Shield, Home, Zap, Book, User, Globe, Menu, X, LogOut, LogIn, UserPlus, Mail } from 'lucide-react'

export default function Navigation() {
  const { user, logout } = useApp()
  console.log(user, "user in Navigation")
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState('en')

  // Load language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Translation object
  const translations = {
    en: {
      dashboard: 'Dashboard',
      predict: 'Predict',
      test: 'Test',
      learn: 'Learn',
      profile: 'Profile',
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      english: 'English',
      kinyarwanda: 'Kinyarwanda',
      professional: 'Professional',
      switchTo: 'Switch to'
    },
    rw: {
      dashboard: 'Ikibaho',
      predict: 'Guhanura',
      test: 'Gupima',
      learn: 'Kwiga',
      profile: 'Umwirondoro',
      home: 'Ahabanza',
      about: 'Ibyerekeye',
      contact: 'Twandikire',
      login: 'Kwinjira',
      register: 'Kwiyandikisha',
      logout: 'Gusohoka',
      english: 'Icyongereza',
      kinyarwanda: 'Ikinyarwanda',
      professional: 'Abanyamwuga',
      switchTo: 'Hindura ku'
    }
  }

  const t = translations[language]

  const navItems = user ? [
    { key: 'dashboard', label: t.dashboard, icon: Home, href: '/dashboard' },
    { 
      key: 'predict', 
      label: user.type === 'laboratory' ? t.predict : t.test, 
      icon: Zap, 
      href: user.type === 'laboratory' ? '/predict' : '/test' 
    },
    { key: 'learn', label: t.learn, icon: Book, href: '/learn' },
    { key: 'profile', label: t.profile, icon: User, href: '/profile' }
  ] : [
    { key: 'home', label: t.home, icon: Home, href: '/' },
    { key: 'about', label: t.about, icon: Shield, href: '/about' },
    { key: 'contact', label: t.contact, icon: Mail, href: '/contact' }
  ]

  const handleNavigation = (href) => {
    navigate(href)
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'rw' : 'en'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
    
    // Use setTimeout to ensure localStorage is saved before reload
    setTimeout(() => {
      window.location.href = window.location.href
    }, 100)
  }

  const getLanguageDisplay = () => {
    return language === 'en' ? t.english : t.kinyarwanda
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
                <p className="text-sm font-light text-emerald-600">{t.professional}</p>
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
            {/* Language Selector - Always visible */}
            <div className="relative group">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 p-3 rounded-2xl bg-white/80 backdrop-blur-xl hover:bg-white/90 transition-all duration-300 cursor-pointer shadow-lg border border-white/30"
                title={`${t.switchTo} ${language === 'en' ? t.kinyarwanda : t.english}`}
              >
                <Globe className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 hidden sm:inline">
                  {getLanguageDisplay()}
                </span>
              </button>
            </div>

            {user ? (
              <div className="flex items-center space-x-4">
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
                  <span className="hidden sm:inline">{t.logout}</span>
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
                  <span className="hidden sm:inline">{t.login}</span>
                </button>
                
                {/* Register Button */}
                <button 
                  onClick={() => handleNavigation('/auth/register')}
                  className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.register}</span>
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

              {/* Mobile Language Selector */}
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-medium text-slate-600 hover:text-slate-900 hover:bg-white/70 hover:backdrop-blur-xl hover:border hover:border-white/30 transition-all duration-300"
              >
                <Globe className="w-5 h-5" />
                <span>{getLanguageDisplay()}</span>
              </button>
              
              {/* Mobile Auth Buttons */}
              {!user && (
                <div className="pt-4 space-y-3 border-t border-white/30">
                  <button 
                    onClick={() => handleNavigation('/auth/login')}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-white/80 backdrop-blur-xl text-slate-600 font-medium shadow-lg border border-white/30"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>{t.login}</span>
                  </button>
                  <button 
                    onClick={() => handleNavigation('/auth/register')}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-emerald-600 text-white font-medium shadow-lg"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>{t.register}</span>
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