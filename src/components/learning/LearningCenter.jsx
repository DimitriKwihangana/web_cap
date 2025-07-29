import { useState, useEffect } from 'react'
import { Shield, Database, FlaskConical, FileText, Book, Users, BookOpen, Clock, ChevronRight, Play, ArrowLeft, Download, Eye } from 'lucide-react'

export default function LearningCenter() {
  const [language, setLanguage] = useState('en')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentView, setCurrentView] = useState('courses') // 'courses', 'pdf-viewer'
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseProgress, setCourseProgress] = useState({})

  // Course data mapped to actual PDFs
  const courses = [
    {
      _id: 'production-handling',
      title: 'Production Handling & Quality Control',
      description: 'Comprehensive guide on grain production handling, storage techniques, and quality control measures to ensure optimal grain preservation and market value.',
      category: 'food',
      level: 'intermediate',
      duration: '2-3 hours',
      pdfFile: 'productionhandling.pdf',
      pages: '45+ pages',
      topics: [
        'Grain Types and Characteristics',
        'Production Cycle Management', 
        'Quality Control Standards',
        'Storage and Preservation',
        'Handling Best Practices'
      ]
    },
    {
      _id: 'grain-grading',
      title: 'Grain Grading & Classification',
      description: 'Professional grain grading standards, classification systems, and assessment techniques used in commercial grain trading and quality assurance.',
      category: 'business',
      level: '',
      duration: '',
      pdfFile: 'GrainGrading.pdf',
      pages: '',
      topics: [
        'International Grading Standards',
        'Physical Assessment Methods',
        'Quality Parameter Testing',
        'Commercial Applications',
        'Certification Processes'
      ]
    },
    {
      _id: 'mycotoxin-detection',
      title: 'Mycotoxin Sampling & Detection',
      description: 'Advanced training on mycotoxin contamination, sampling protocols, detection methods, and prevention strategies for food safety compliance.',
      category: 'safety',
      level: '',
      duration: '',
      pdfFile: 'MycotoxinSamplingandDetection.pdf',
      pages: '',
      topics: [
        'Mycotoxin Fundamentals',
        'Sampling Protocols',
        'Detection Methods',
        'Prevention Strategies',
        'Risk Management'
      ]
    }
  ]

  // Translation object
  const translations = {
    en: {
      learningCenter: 'Learning Center',
      learningDescription: 'Free professional training materials for grain quality management',
      
      // Navigation
      backToCourses: 'Back to Courses',
      viewPDF: 'View Course Material',
      downloadPDF: 'Download PDF',
      
      // Course details
      duration: 'Estimated Duration',
      level: 'Level',
      category: 'Category',
      pages: 'Content',
      topics: 'Key Topics Covered',
      freeAccess: 'Free Access',
      
      // Levels
      beginner: 'Beginner',
      intermediate: '',
      advanced: '',
      
      // Categories
      categories: 'Categories',
      allCourses: 'All Courses',
      foodSafety: 'Food Safety',
      businessTraining: 'Business Training',
      safetyTraining: 'Safety Training',
      
      // Category types
      food: 'Food Safety',
      business: 'Business',
      safety: 'Safety',
      
      // PDF Viewer
      loadingPDF: 'Loading course material...',
      pdfError: 'Unable to load PDF. You can download it instead.',
      
      // Loading
      loadingCourses: 'Loading courses...'
    },
    rw: {
      learningCenter: 'Ikigo cyo Kwiga',
      learningDescription: 'Ibikoresho by\'amahugurwa y\'ubwuga bw\'ubusa mu gucunga ubwiza bw\'ibinyampeke',
      
      // Navigation
      backToCourses: 'Garuka ku Masomo',
      viewPDF: 'Reba Ibikoresho by\'Isomo',
      downloadPDF: 'Gukuramo PDF',
      
      // Course details
      duration: 'Igihe Giteganijwe',
      level: 'Urwego',
      category: 'Icyiciro',
      pages: 'Ibiri mo',
      topics: 'Ingingo Zingenzi',
      freeAccess: 'Kwinjira Ubusa',
      
      // Levels
      beginner: 'Intangiriro',
      intermediate: 'Hagati',
      advanced: 'Rwihishije',
      
      // Categories
      categories: 'Ibyiciro',
      allCourses: 'Amasomo Yose',
      foodSafety: 'Umutekano w\'Ibiryo',
      businessTraining: 'Amahugurwa y\'Ubucuruzi',
      safetyTraining: 'Amahugurwa y\'Umutekano',
      
      // Category types
      food: 'Umutekano w\'Ibiryo',
      business: 'Ubucuruzi',
      safety: 'Umutekano',
      
      // PDF Viewer
      loadingPDF: 'Gukura ibikoresho by\'isomo...',
      pdfError: 'Ntibyashoboye gukura PDF. Ushobora kuyikuramo.',
      
      // Loading
      loadingCourses: 'Gukura amasomo...'
    }
  }

  const t = translations[language]

  const categories = [
    { key: 'all', label: t.allCourses, icon: Book },
    { key: 'food', label: t.foodSafety, icon: Shield },
    { key: 'business', label: t.businessTraining, icon: Database },
    { key: 'safety', label: t.safetyTraining, icon: FlaskConical }
  ]

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-emerald-50 text-emerald-700'
      case 'intermediate': return 'bg-yellow-50 text-yellow-700'
      case 'advanced': return 'bg-red-50 text-red-700'
      default: return 'bg-emerald-50 text-emerald-700'
    }
  }

  const translateLevel = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return t.beginner
      case 'intermediate': return t.intermediate
      case 'advanced': return t.advanced
      default: return level
    }
  }

  const translateCategory = (category) => {
    switch (category?.toLowerCase()) {
      case 'food': return t.food
      case 'business': return t.business
      case 'safety': return t.safety
      default: return category
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

  const handleDownload = (pdfFile, courseName) => {
    const link = document.createElement('a')
    link.href = `/public/${pdfFile}`
    link.download = pdfFile
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Course List View
  if (currentView === 'courses') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-light bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{t.learningCenter}</h1>
            <p className="text-gray-500 mt-2 font-light text-lg">{t.learningDescription}</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Category Navigation */}
            <div className="lg:col-span-1">
              <div className="backdrop-blur-xl bg-white/80 rounded-2xl border border-white/50 p-6 shadow-xl sticky top-24">
                <h2 className="font-light text-gray-800 mb-6 text-lg">{t.categories}</h2>
                <div className="space-y-3">
                  {categories.map(category => (
                    <button
                      key={category.key}
                      onClick={() => setSelectedCategory(category.key)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 font-light ${
                        selectedCategory === category.key 
                          ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border-l-4 border-emerald-500 text-emerald-700' 
                          : 'text-gray-600 hover:bg-white/50 hover:backdrop-blur-sm'
                      }`}
                    >
                      <category.icon className="w-5 h-5" />
                      <span className="text-sm">{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-8">
                {filteredCourses.map((course) => {
                  const IconComponent = getCategoryIcon(course.category)
                  
                  return (
                    <div key={course._id} className="backdrop-blur-xl bg-white/80 rounded-2xl border border-white/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-3 py-1 text-xs font-light rounded-full ${getLevelColor(course.level)}`}>
                              {translateLevel(course.level)}
                            </span>
                            <span className="text-xs text-gray-400 font-light uppercase tracking-wide">
                              {translateCategory(course.category)}
                            </span>
                          </div>
                          <h3 className="text-xl font-light text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                            {course.title}
                          </h3>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 font-light leading-relaxed mb-4 text-sm">
                        {course.description}
                      </p>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-500 font-light mb-3">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {course.duration}
                          </span>
                          <span className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {course.pages}
                          </span>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 font-medium mb-2">{t.topics}:</p>
                          <ul className="text-xs text-gray-500 space-y-1">
                            {course.topics.slice(0, 3).map((topic, index) => (
                              <li key={index} className="flex items-center">
                                <div className="w-1 h-1 bg-emerald-400 rounded-full mr-2"></div>
                                {topic}
                              </li>
                            ))}
                            {course.topics.length > 3 && (
                              <li className="text-emerald-600">+{course.topics.length - 3} more topics</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-emerald-600">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                          <span className="font-medium text-sm">{t.freeAccess}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleDownload(course.pdfFile, course.title)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-light flex items-center space-x-2 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            <span>{t.downloadPDF}</span>
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedCourse(course)
                              setCurrentView('pdf-viewer')
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg font-light flex items-center space-x-2 text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            <span>{t.viewPDF}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // PDF Viewer
  if (currentView === 'pdf-viewer' && selectedCourse) {
    const IconComponent = getCategoryIcon(selectedCourse.category)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <button 
              onClick={() => setCurrentView('courses')}
              className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 mb-4 font-light"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.backToCourses}</span>
            </button>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-light text-gray-800">{selectedCourse.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedCourse.duration}
                    </span>
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {selectedCourse.pages}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(selectedCourse.level)}`}>
                      {translateLevel(selectedCourse.level)}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDownload(selectedCourse.pdfFile, selectedCourse.title)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-300 font-light flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>{t.downloadPDF}</span>
              </button>
            </div>
          </div>

          {/* PDF Viewer Container */}
          <div className="backdrop-blur-xl bg-white/80 rounded-2xl border border-white/50 shadow-xl overflow-hidden">
            <div className="h-[800px] w-full">
              <iframe
                src={`/public/${selectedCourse.pdfFile}`}
                className="w-full h-full border-0"
                title={selectedCourse.title}
                onError={() => {
                  console.error('Failed to load PDF')
                }}
              />
            </div>
          </div>

          {/* Course Info Panel */}
          <div className="mt-6 backdrop-blur-xl bg-white/80 rounded-2xl border border-white/50 p-6 shadow-xl">
            <h3 className="text-lg font-light text-gray-800 mb-4">{t.topics}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedCourse.topics.map((topic, index) => (
                <div key={index} className="flex items-center p-3 bg-emerald-50 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}