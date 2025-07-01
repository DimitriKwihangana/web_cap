import { FlaskConical, CheckCircle, AlertTriangle, Target } from 'lucide-react'
import Card from '../ui/Card'

const iconMap = {
  FlaskConical,
  CheckCircle,
  AlertTriangle,
  Target
}

export default function StatsGrid({ stats }) {
  const getIconComponent = (iconName) => {
    const IconComponent = iconMap[iconName]
    return IconComponent || FlaskConical
  }

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600'
    }
    return colorMap[color] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = getIconComponent(stat.icon)
        const colorClasses = getColorClasses(stat.color)
        
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses}`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}