import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import PredictPage from './pages/PredictPage'
import LearnPage from './pages/LearnPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/predict" element={
            <ProtectedRoute>
              <PredictPage />
            </ProtectedRoute>
          } />
          <Route path="/learn" element={<LearnPage />} />
        </Routes>
      </Layout>
    </AppProvider>
  )
}

export default App