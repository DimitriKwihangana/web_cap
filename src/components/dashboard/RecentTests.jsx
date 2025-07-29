import { CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react'
import Card from '../ui/Card'

export default function RecentTests({ tests, onTestClick }) {
  console.log(tests,"______")
  
  const getAflatoxinAssessment = (aflatoxinLevel) => {
    const level = parseFloat(aflatoxinLevel) || 0
    
    if (level >= 0 && level <= 5) {
      return {
        result: 'Safe for Children',
        color: 'green',
        icon: CheckCircle
      }
    } else if (level > 5 && level <= 10) {
      return {
        result: 'Adults Only',
        color: 'yellow',
        icon: Info
      }
    } else if (level > 10 && level <= 20) {
      return {
        result: 'Animal Feed Only',
        color: 'orange',
        icon: AlertTriangle
      }
    } else {
      return {
        result: 'Unsafe',
        color: 'red',
        icon: AlertTriangle
      }
    }
  }

  const getResultIcon = (aflatoxinLevel) => {
    const assessment = getAflatoxinAssessment(aflatoxinLevel)
    const IconComponent = assessment.icon
    
    switch (assessment.color) {
      case 'green':
        return <IconComponent className="w-5 h-5 text-emerald-500" />
      case 'yellow':
        return <IconComponent className="w-5 h-5 text-amber-500" />
      case 'orange':
        return <IconComponent className="w-5 h-5 text-orange-500" />
      case 'red':
        return <IconComponent className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getResultColorClass = (aflatoxinLevel) => {
    const assessment = getAflatoxinAssessment(aflatoxinLevel)
    
    switch (assessment.color) {
      case 'green':
        return 'text-emerald-700 bg-gradient-to-r from-emerald-50/80 to-emerald-100/60 border-emerald-200/50 shadow-emerald-500/10'
      case 'yellow':
        return 'text-amber-700 bg-gradient-to-r from-amber-50/80 to-amber-100/60 border-amber-200/50 shadow-amber-500/10'
      case 'orange':
        return 'text-orange-700 bg-gradient-to-r from-orange-50/80 to-orange-100/60 border-orange-200/50 shadow-orange-500/10'
      case 'red':
        return 'text-red-700 bg-gradient-to-r from-red-50/80 to-red-100/60 border-red-200/50 shadow-red-500/10'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8">
      <h3 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">Recent Tests</h3>
      
      {tests.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-light">No tests found</p>
          <p className="text-sm text-gray-400 font-light mt-1">Your recent batch tests will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tests.map((test) => {
            const aflatoxinLevel = Math.round(parseFloat(test.aflatoxin) || 0)
            const assessment = getAflatoxinAssessment(aflatoxinLevel)
            
            return (
              <div
                key={test.id}
                onClick={() => onTestClick && onTestClick(test.id)}
                className="flex items-center justify-between p-6 border border-white/20 rounded-2xl hover:bg-white/50 cursor-pointer transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl bg-white/30"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-700-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                    {getResultIcon(aflatoxinLevel)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-lg">{test.batchId}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 font-light">
                      <span>{new Date(test.date).toLocaleDateString()}</span>
                      {test.supplier && (
                        <>
                          <span>•</span>
                          <span>{test.supplier}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`px-4 py-2 text-sm font-medium rounded-full border backdrop-blur-sm shadow-lg ${getResultColorClass(aflatoxinLevel)}`}>
                    {assessment.result}
                  </span>
                  <div className="text-right bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <p className="text-lg font-light text-gray-900">{aflatoxinLevel}</p>
                    <p className="text-xs text-gray-500 font-medium">ppb</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}