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
import FineTunePage from './pages/FinetuningPage'
import MarketplacePage from './pages/MarketPlace'
import OrderManagementDashboard from './pages/OrderManagement'
import TestPage from './pages/TestPage'
import ProfilePage from './pages/ProfilePage'
import LegalAgreementsPage from './pages/Licence'
import PredictionAll from './pages/NewPrediction' 

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
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <MarketplacePage />
            </ProtectedRoute>
          } />
            <Route path="/finetune" element={
            <ProtectedRoute>
              <FineTunePage />
            </ProtectedRoute>
          } />
           <Route path="/ordermanagement" element={
            <ProtectedRoute>
              <OrderManagementDashboard />
            </ProtectedRoute>
          } />
          <Route path="/predict" element={
            <ProtectedRoute>
              <PredictPage />
            </ProtectedRoute>
          } />
          <Route path="/allpredict" element={
            <ProtectedRoute>
              <PredictionAll /></ProtectedRoute>
          } />
           <Route path="/test" element={
            <ProtectedRoute>
              <TestPage /></ProtectedRoute>
          } />
          <Route path="/legal" element={
            <ProtectedRoute>
              <LegalAgreementsPage /></ProtectedRoute>
          } />
           <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage /></ProtectedRoute>
          } />
          <Route path="/learn" element={<LearnPage />} />

        </Routes>
      </Layout>
    </AppProvider>
  )
}

export default App