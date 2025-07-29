import { useState } from 'react'
import PredictionFormAll from '../components/prediction/PredictAll'
import OtherTestComponent from '../components/prediction/OtherTestComponent'

export default function PredictAllPage() {
  const [activeTab, setActiveTab] = useState('test1')

  const tabs = [
    { id: 'test1', label: 'New Test', component: PredictionFormAll },
    { id: 'test2', label: 'Test Results', component: OtherTestComponent }
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || PredictionFormAll

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <ActiveComponent />
      </div>
    </div>
  )
}