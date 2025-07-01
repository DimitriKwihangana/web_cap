import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function RecentTests({ tests }) {
  const navigate = useNavigate()

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Tests</h2>
        <Button size="sm" onClick={() => navigate('/tests')}>
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {tests.map(test => (
          <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">{test.batch}</p>
                <p className="text-sm text-gray-600">{test.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <Badge variant={test.result === 'Safe' ? 'success' : 'warning'}>
                  {test.result}
                </Badge>
                <p className="text-xs text-gray-600 mt-1">{test.confidence}% confidence</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}