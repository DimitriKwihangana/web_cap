import { useState } from 'react'
import { Shield, Database, FlaskConical, FileText, Book, Award } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import ArticleCard from './ArticleCard'

export default function LearningCenter() {
  const [selectedCategory, setSelectedCategory] = useState('prevention')

  const categories = [
    { key: 'prevention', label: 'Prevention Methods', icon: Shield },
    { key: 'storage', label: 'Storage Best Practices', icon: Database },
    { key: 'testing', label: 'Testing Procedures', icon: FlaskConical },
    { key: 'regulations', label: 'Regulations & Standards', icon: FileText }
  ]

  const content = {
    prevention: {
      title: 'Aflatoxin Prevention in Maize',
      description: 'Learn effective strategies to prevent aflatoxin contamination from field to storage',
      articles: [
        {
          title: 'Pre-Harvest Prevention Strategies',
          description: 'Learn how to prevent aflatoxin contamination during crop growth',
          readTime: '8 min read',
          level: 'Beginner',
          image: '/images/prevention-1.jpg'
        },
        {
          title: 'Harvest Timing and Techniques',
          description: 'Optimal harvesting practices to minimize contamination risk',
          readTime: '6 min read',
          level: 'Intermediate',
          image: '/images/harvest-1.jpg'
        },
        {
          title: 'Field Management Best Practices',
          description: 'Comprehensive field management to reduce aflatoxin risk',
          readTime: '12 min read',
          level: 'Advanced',
          image: '/images/field-1.jpg'
        }
      ]
    },
    storage: {
      title: 'Storage Best Practices',
      description: 'Master the art of proper grain storage to maintain quality and safety',
      articles: [
        {
          title: 'Moisture Control in Storage',
          description: 'Maintaining optimal moisture levels to prevent fungal growth',
          readTime: '10 min read',
          level: 'Beginner',
          image: '/images/storage-1.jpg'
        },
        {
          title: 'Temperature Management',
          description: 'Temperature control strategies for long-term storage',
          readTime: '7 min read',
          level: 'Intermediate',
          image: '/images/temperature-1.jpg'
        },
        {
          title: 'Storage Facility Design',
          description: 'Designing storage facilities for maximum safety',
          readTime: '15 min read',
          level: 'Advanced',
          image: '/images/facility-1.jpg'
        }
      ]
    },
    testing: {
      title: 'Testing Procedures',
      description: 'Comprehensive guide to aflatoxin testing methods and procedures',
      articles: [
        {
          title: 'Sampling Techniques',
          description: 'Proper sampling methods for accurate testing results',
          readTime: '9 min read',
          level: 'Beginner',
          image: '/images/sampling-1.jpg'
        },
        {
          title: 'Laboratory Testing Methods',
          description: 'Overview of different aflatoxin testing methods',
          readTime: '11 min read',
          level: 'Intermediate',
          image: '/images/lab-1.jpg'
        },
        {
          title: 'Quality Control in Testing',
          description: 'Ensuring accuracy and reliability in test results',
          readTime: '13 min read',
          level: 'Advanced',
          image: '/images/quality-1.jpg'
        }
      ]
    },
    regulations: {
      title: 'Regulations & Standards',
      description: 'Navigate the complex world of food safety regulations and compliance',
      articles: [
        {
          title: 'International Standards Overview',
          description: 'Understanding global aflatoxin limits and regulations',
          readTime: '8 min read',
          level: 'Beginner',
          image: '/images/standards-1.jpg'
        },
        {
          title: 'Regional Compliance Requirements',
          description: 'Specific requirements for different markets and regions',
          readTime: '10 min read',
          level: 'Intermediate',
          image: '/images/compliance-1.jpg'
        },
        {
          title: 'Certification and Documentation',
          description: 'Managing compliance documentation and certifications',
          readTime: '12 min read',
          level: 'Advanced',
          image: '/images/certification-1.jpg'
        }
      ]
    }
  }

  const currentContent = content[selectedCategory]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Center</h1>
        <p className="text-gray-600 mt-2">Comprehensive resources for aflatoxin prevention and food safety</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Category Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all ${
                    selectedCategory === category.key 
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentContent.title}</h2>
            <p className="text-gray-600">{currentContent.description}</p>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {currentContent.articles.map((article, index) => (
              <ArticleCard key={index} article={article} />
            ))}
          </div>

          {/* Featured Resources */}
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900">Featured Resources</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Book className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Complete Guide to Aflatoxin Prevention</h4>
                    <p className="text-gray-600 text-sm mb-4">Comprehensive 50-page guide covering all aspects of aflatoxin prevention in maize production and storage.</p>
                    <Button size="sm">
                      Download PDF
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Certification Program</h4>
                    <p className="text-gray-600 text-sm mb-4">Get certified in aflatoxin prevention and testing procedures. Recognized by international food safety organizations.</p>
                    <Button size="sm">
                      Learn More
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Video Resources */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Video Tutorials</h4>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Visual Inspection Techniques', duration: '5:30', views: '2.1k' },
                  { title: 'Proper Sampling Methods', duration: '8:45', views: '3.2k' },
                  { title: 'Storage Best Practices', duration: '12:15', views: '1.8k' }
                ].map((video, index) => (
                  <Card key={index} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-3 h-32"></div>
                    <h5 className="font-medium text-gray-900 mb-1">{video.title}</h5>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{video.duration}</span>
                      <span>{video.views} views</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}