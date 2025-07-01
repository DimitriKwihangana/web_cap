import { Clock, User } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function ArticleCard({ article }) {
  const getLevelVariant = (level) => {
    switch (level) {
      case 'Beginner':
        return 'success'
      case 'Intermediate':
        return 'warning'
      case 'Advanced':
        return 'danger'
      default:
        return 'default'
    }
  }

  return (
    <Card hover className="overflow-hidden">
      {/* Article Image */}
      <div className="h-48 bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-2">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <p className="text-sm text-gray-600">Article Thumbnail</p>
        </div>
      </div>

      <div className="p-6">
        {/* Article Meta */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant={getLevelVariant(article.level)}>
            {article.level}
          </Badge>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {article.readTime}
          </div>
        </div>

        {/* Article Content */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.description}
        </p>

        {/* Article Actions */}
        <div className="flex items-center justify-between">
          <Button size="sm">
            Read Article
          </Button>
          <button className="text-sm text-gray-500 hover:text-gray-700">
            Bookmark
          </button>
        </div>
      </div>
    </Card>
  )
}