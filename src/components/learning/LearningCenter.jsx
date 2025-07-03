import { useState, useEffect } from 'react'
import { Shield, Database, FlaskConical, FileText, Book, Award, Users, BookOpen, Star, Clock } from 'lucide-react'

export default function LearningCenter() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('https://trainingbackend-3447cabed34b.herokuapp.com/api/course/')
      const data = await response.json()
      if (data.status === 'success') {
        setCourses(data.data)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { key: 'all', label: 'All Courses', icon: Book },
    { key: 'food', label: 'Food Safety', icon: Shield },
    { key: 'safety', label: 'Safety Training', icon: FlaskConical },
    { key: 'compliance', label: 'Compliance', icon: FileText }
  ]

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-emerald-50 text-emerald-700'
      case 'intermediate': return 'bg-yellow-50 text-yellow-700'
      case 'advanced': return 'bg-red-50 text-red-700'
      default: return 'bg-emerald-50 text-emerald-700'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'food': return Shield
      case 'business': return Database
      case 'safety': return FlaskConical
      default: return Book
    }
  }

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category?.toLowerCase() === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-500 font-light">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-light bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Learning Center</h1>
          <p className="text-gray-500 mt-2 font-light text-lg">Comprehensive training resources for professional development</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Category Navigation */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-xl bg-white/20 rounded-2xl border border-white/30 p-6 shadow-2xl sticky top-24">
              <h2 className="font-light text-gray-800 mb-6 text-lg">Categories</h2>
              <div className="space-y-3">
                {categories.map(category => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 font-light ${
                      selectedCategory === category.key 
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border-l-4 border-emerald-500 text-emerald-700' 
                        : 'text-gray-600 hover:bg-white/30 hover:backdrop-blur-sm'
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <span className="text-sm">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-light text-gray-800 mb-2">
                {selectedCategory === 'all' ? 'All Available Courses' : categories.find(c => c.key === selectedCategory)?.label}
              </h2>
              <p className="text-gray-500 font-light">
                {selectedCategory === 'all' 
                  ? 'Explore our complete collection of professional training courses'
                  : `Specialized training in ${categories.find(c => c.key === selectedCategory)?.label.toLowerCase()}`
                }
              </p>
            </div>

            {/* Courses Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-8 mb-12">
              {filteredCourses.map((course) => {
                const IconComponent = getCategoryIcon(course.category)
                return (
                  <div key={course._id} className="backdrop-blur-xl bg-white/20 rounded-2xl border border-white/30 p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-r from-emerald-500 to-teal-500">
                        {course.image ? (
                          <img 
                            src={course.image} 
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full ${course.image ? 'hidden' : 'flex'} items-center justify-center`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-3 py-1 text-xs font-light rounded-full ${getLevelColor(course.level)}`}>
                            {course.level}
                          </span>
                          <span className="text-xs text-gray-400 font-light uppercase tracking-wide">
                            {course.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-light text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                          {course.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 font-light leading-relaxed mb-6">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between mb-6 text-sm text-gray-500 font-light">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {course.modules.length} modules
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {course.enrolledStudents.length} enrolled
                        </span>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-light text-emerald-600">
                        ${(course.price / 100).toFixed(2)}
                      </div>
                      <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg font-light">
                        Enroll Now
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Featured Resources */}
            <div className="space-y-8">
              <h3 className="text-2xl font-light text-gray-800">Featured Resources</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="backdrop-blur-xl bg-white/20 rounded-2xl border border-white/30 p-6 shadow-2xl bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Book className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-light text-gray-800 mb-2 text-lg">Complete Training Guide</h4>
                      <p className="text-gray-600 text-sm font-light mb-4 leading-relaxed">Comprehensive guide covering all aspects of professional development and training best practices.</p>
                      <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md font-light text-sm">
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-white/20 rounded-2xl border border-white/30 p-6 shadow-2xl bg-gradient-to-r from-teal-50/50 to-emerald-50/50">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-light text-gray-800 mb-2 text-lg">Certification Program</h4>
                      <p className="text-gray-600 text-sm font-light mb-4 leading-relaxed">Get certified in professional skills development. Recognized by international organizations.</p>
                      <button className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 shadow-md font-light text-sm">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>

             
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}