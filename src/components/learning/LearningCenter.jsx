import { useState, useEffect } from 'react'
import { Shield, Database, FlaskConical, FileText, Book, Award, Users, BookOpen, Star, Clock, Download } from 'lucide-react'

export default function LearningCenter() {
  const [language, setLanguage] = useState('en')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Load language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Translation object
  const translations = {
    en: {
      // Main titles
      learningCenter: 'Learning Center',
      learningDescription: 'Comprehensive training resources for professional development',
      
      // Categories
      categories: 'Categories',
      allCourses: 'All Courses',
      foodSafety: 'Food Safety',
      safetyTraining: 'Safety Training',
      compliance: 'Compliance',
      
      // Course navigation
      allAvailableCourses: 'All Available Courses',
      exploreCollection: 'Explore our complete collection of professional training courses',
      specializedTraining: 'Specialized training in',
      
      // Course details
      modules: 'modules',
      enrolled: 'enrolled',
      enrollNow: 'Enroll Now',
      
      // Levels
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      
      // Categories (for courses)
      food: 'Food',
      business: 'Business',
      safety: 'Safety',
      
      // Featured resources
      featuredResources: 'Featured Resources',
      samplingGuide: 'Sampling Guide for Grains',
      samplingDescription: 'Comprehensive guide on proper grain sampling techniques, quality assessment methods, and best practices for accurate results in agricultural testing.',
      physicalTesting: 'Physical Components Testing',
      physicalDescription: 'Detailed manual covering physical component analysis, testing procedures, equipment specifications, and quality control measures for grain evaluation.',
      downloadPdf: 'Download PDF',
      
      // Loading
      loadingCourses: 'Loading courses...',
      
      // Currency
      currency: 'Rwf'
    },
    rw: {
      // Main titles
      learningCenter: 'Ikigo cyo Kwiga',
      learningDescription: 'Ibikoresho byuzuye byo guhugura mu iterambere ry\'umwuga',
      
      // Categories
      categories: 'Ibyiciro',
      allCourses: 'Amasomo Yose',
      foodSafety: 'Umutekano w\'Ibiryo',
      safetyTraining: 'Amahugurwa y\'Umutekano',
      compliance: 'Kubahiriza Amategeko',
      
      // Course navigation
      allAvailableCourses: 'Amasomo Yose Aboneka',
      exploreCollection: 'Shakisha urutonde rwacu rwuzuye rw\'amasomo y\'ubwuga',
      specializedTraining: 'Amahugurwa yihariye mu',
      
      // Course details
      modules: 'ibice',
      enrolled: 'biyandikije',
      enrollNow: 'Iyandikishe Ubu',
      
      // Levels
      beginner: 'Intangiriro',
      intermediate: 'Hagati',
      advanced: 'Rwihishije',
      
      // Categories (for courses)
      food: 'Ibiryo',
      business: 'Ubucuruzi',
      safety: 'Umutekano',
      
      // Featured resources
      featuredResources: 'Ibikoresho Byibanze',
      samplingGuide: 'Ubuyobozi bwo Gufata Ingero z\'Ibinyampeke',
      samplingDescription: 'Ubuyobozi buzuye ku buhanga bwiza bwo gufata ingero z\'ibinyampeke, uburyo bwo gusuzuma ubwiza, n\'imikorere myiza yo kubona ibisubizo byukuri mu gerageza ry\'ubuhinzi.',
      physicalTesting: 'Igerageza ry\'Ibice by\'Umubiri',
      physicalDescription: 'Igitabo kirambuye kirimo isesengura ry\'ibice by\'umubiri, uburyo bw\'igerageza, ibipimo by\'ibikoresho, n\'ingamba zo kugenzura ubwiza mu gusuzuma ibinyampeke.',
      downloadPdf: 'Gukuramo PDF',
      
      // Loading
      loadingCourses: 'Gukura amasomo...',
      
      // Currency
      currency: 'Frw'
    }
  }

  const t = translations[language]

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('https://trainingbackend-3447cabed34b.herokuapp.om/api/course/')
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

  const handlePdfDownload = (pdfName, fileName) => {
    const link = document.createElement('a')
    link.href = `/public/${pdfName}`
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const categories = [
    { key: 'all', label: t.allCourses, icon: Book },
    { key: 'food', label: t.foodSafety, icon: Shield },
    { key: 'safety', label: t.safetyTraining, icon: FlaskConical },
    { key: 'compliance', label: t.compliance, icon: FileText }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-500 font-light">{t.loadingCourses}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-light bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{t.learningCenter}</h1>
          <p className="text-gray-500 mt-2 font-light text-lg">{t.learningDescription}</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Category Navigation */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-xl bg-white/20 rounded-2xl border border-white/30 p-6 shadow-2xl sticky top-24">
              <h2 className="font-light text-gray-800 mb-6 text-lg">{t.categories}</h2>
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
                {selectedCategory === 'all' ? t.allAvailableCourses : categories.find(c => c.key === selectedCategory)?.label}
              </h2>
              <p className="text-gray-500 font-light">
                {selectedCategory === 'all' 
                  ? t.exploreCollection
                  : `${t.specializedTraining} ${categories.find(c => c.key === selectedCategory)?.label.toLowerCase()}`
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
                    
                    <p className="text-gray-600 font-light leading-relaxed mb-6">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between mb-6 text-sm text-gray-500 font-light">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {course.modules.length} {t.modules}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {course.enrolledStudents.length} {t.enrolled}
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
                        {(course.price / 1).toFixed(2)} {t.currency}
                      </div>
                      <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg font-light">
                        {t.enrollNow}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Featured Resources */}
            <div className="space-y-8">
              <h3 className="text-2xl font-light text-gray-800">{t.featuredResources}</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="backdrop-blur-xl bg-white/20 rounded-2xl border border-white/30 p-6 shadow-2xl bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FlaskConical className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-light text-gray-800 mb-2 text-lg">{t.samplingGuide}</h4>
                      <p className="text-gray-600 text-sm font-light mb-4 leading-relaxed">{t.samplingDescription}</p>
                      <button 
                        onClick={() => handlePdfDownload('1.pdf', language === 'en' ? 'Sampling_Guide_for_Grains.pdf' : 'Ubuyobozi_bwo_Gufata_Ingero_z_Ibinyampeke.pdf')}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md font-light text-sm flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>{t.downloadPdf}</span>
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
                      <h4 className="font-light text-gray-800 mb-2 text-lg">{t.physicalTesting}</h4>
                      <p className="text-gray-600 text-sm font-light mb-4 leading-relaxed">{t.physicalDescription}</p>
                      <button 
                        onClick={() => handlePdfDownload('2.pdf', language === 'en' ? 'Physical_Components_Testing.pdf' : 'Igerageza_ry_Ibice_by_Umubiri.pdf')}
                        className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 shadow-md font-light text-sm flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>{t.downloadPdf}</span>
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