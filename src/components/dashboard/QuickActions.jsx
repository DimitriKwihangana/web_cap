import { useNavigate } from 'react-router-dom'
import { Zap, FileText, Database, Book } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

export default function QuickActions() {
  const navigate = useNavigate()

  const actions = [
    { icon: Zap, label: 'New Prediction', href: '/predict' },
    { icon: FileText, label: 'Generate Report', href: '/reports' },
    { icon: Database, label: 'Export Data', href: '/export' },
    { icon: Book, label: 'Learning Center', href: '/learn' }
  ]

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
      <div className="space-y-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            className="w-full justify-start"
            variant="outline"
            onClick={() => navigate(action.href)}
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </Button>
        ))}
      </div>
    </Card>
  )
}