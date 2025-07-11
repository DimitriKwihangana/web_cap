import Navigation from './Naviagation'
import { useApp } from '../../contexts/AppContext'

export default function Layout({ children }) {
  const { loading } = useApp()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AflaGuard Pro...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <Navigation />
      <main>{children}</main>
    </div>
  )
}