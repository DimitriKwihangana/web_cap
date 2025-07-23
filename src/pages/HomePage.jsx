import { useState, useEffect } from 'react'
import { Shield, Users, BarChart3, Book, Zap, Target, Award, TrendingUp, CheckCircle, Globe, UserPlus, Phone, ArrowRight, Sparkles } from 'lucide-react'

export default function HomePage() {
  const [language, setLanguage] = useState('en')

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
      // Badge and Hero
      aiPoweredPlatform: 'AI-Powered Detection Platform',
      protectFoodSafety: 'Protect Food Safety',
      withIntelligence: 'with Intelligence',
      heroDescription: 'Revolutionary aflatoxin prediction platform powered by machine learning. Ensure food safety, access premium markets, and protect consumers worldwide.',
      startFreeTrial: 'Start Free Trial',
      learnMore: 'Learn More',
      
      // Product Preview
      safeToConsume: 'Safe to Consume',
      confidence: 'Confidence',
      
      // Features Section
      advancedTechnology: 'Advanced Technology',
      technologyDescription: 'Our platform combines advanced AI, real-time analysis, and comprehensive reporting to deliver unmatched accuracy in aflatoxin detection.',
      
      // Features
      aiDetectionTitle: 'AI-Powered Detection',
      aiDetectionDesc: 'Advanced machine learning algorithms for accurate aflatoxin prediction',
      foodSafetyTitle: 'Food Safety Assurance',
      foodSafetyDesc: 'Protect consumers with reliable contamination detection',
      qualityTitle: 'Quality Enhancement',
      qualityDesc: 'Access premium markets with certified quality standards',
      globalTitle: 'Global Standards',
      globalDesc: 'Comply with international food safety regulations',
      
      // User Types Section
      builtForStakeholders: 'Built for Every Stakeholder',
      stakeholdersDescription: 'Tailored solutions for institutions, processors, and laboratories',
      
      // User Types
      institutions: 'Institutions',
      institutionsDesc: 'Schools, prisons, and bulk buyers',
      institutionFeature1: 'Bulk testing',
      institutionFeature2: 'Quality assurance',
      institutionFeature3: 'Cost optimization',
      
      processors: 'Processors',
      processorsDesc: 'Food processing companies',
      processorFeature1: 'Premium market access',
      processorFeature2: 'Quality certification',
      processorFeature3: 'Brand protection',
      
      laboratories: 'Laboratories',
      laboratoriesDesc: 'Testing and research facilities',
      labFeature1: 'Model validation',
      labFeature2: 'Data contribution',
      labFeature3: 'Research collaboration',
      
      getStarted: 'Get Started',
      
      // CTA Section
      ctaTitle: 'Ready to Transform Your',
      ctaSubtitle: 'Food Safety Standards?',
      ctaDescription: 'Join hundreds of organizations already using AflaGuard Pro to ensure food safety and access premium markets.',
      startYourFreeTrial: 'Start Your Free Trial',
      scheduleDemo: 'Schedule Demo'
    },
    rw: {
      // Badge and Hero
      aiPoweredPlatform: 'Urubuga rukoresha Ubwenge Bwubucuruzi',
      protectFoodSafety: 'Kurinda Umutekano',
      withIntelligence: "w'Ibiryo n'Ubwenge",
      heroDescription: 'Urubuga ruhindagurika rwo guhanura aflatoxin rukoresheje tekinoroji yubwenge bwubucuruzi. Emeza umutekano wibiryo, injira mumasoko akomeye, kandi urinde abaguzi kwisi.',
      startFreeTrial: 'Tangira Igerageza kubuntu',
      learnMore: 'Menya byinshi',
      
      // Product Preview
      safeToConsume: 'Biryo byiza kurya',
      confidence: 'Ikizere',
      
      // Features Section
      advancedTechnology: 'Ikoranabuhanga Rigezweho',
      technologyDescription: 'Urubuga rwacu ruhuza ubwenge bwubucuruzi bwateye imbere, isesengura ryigihe nyacyo, no gutanga raporo yuzuye kugirango dutange ukuri guhebera aflatoxin.',
      
      // Features
      aiDetectionTitle: 'Ubwenge bwo Guhebera',
      aiDetectionDesc: 'Algorisme zatejwe imbere zo kwiga imashini zo guhanura aflatoxin neza',
      foodSafetyTitle: 'Kwemeza Umutekano wibiryo',
      foodSafetyDesc: 'Kurinda abaguzi hamwe no guhebera kwizewe kwandura',
      qualityTitle: 'Kuzamura Ubwiza',
      qualityDesc: 'Injira mumasoko akomeye hamwe nibipimo byemejwe byubwiza',
      globalTitle: 'Ibipimo byamahanga',
      globalDesc: 'Kubahiriza amategeko mpuzamahanga yumutekano wibiryo',
      
      // User Types Section
      builtForStakeholders: 'Byubatswe kuri buri wese',
      stakeholdersDescription: 'Ibisubizo byagenewe inzego, ibigo bikora ibiryo, nubushakashatsi',
      
      // User Types
      institutions: 'Inzego',
      institutionsDesc: 'Amashuri, gereza, nabaguzi benshi',
      institutionFeature1: 'Igerageza ryinshi',
      institutionFeature2: 'Kwemeza ubwiza',
      institutionFeature3: 'Kugabanya ibiciro',
      
      processors: 'Abo bakora ibiryo',
      processorsDesc: 'Ibigo bikora ibiryo',
      processorFeature1: 'Kwinjira mumasoko akomeye',
      processorFeature2: 'Icyemezo cyubwiza',
      processorFeature3: 'Kurinda ikimenyetso',
      
      laboratories: 'Ubushakashatsi',
      laboratoriesDesc: 'Ibigo byigerageza nubushakashatsi',
      labFeature1: 'Kwemeza moderi',
      labFeature2: 'Gutanga amakuru',
      labFeature3: 'Ubufatanye mubushakashatsi',
      
      getStarted: 'Tangira',
      
      // CTA Section
      ctaTitle: 'Urabikora guhindura',
      ctaSubtitle: 'Ibipimo byawe byumutekano wibiryo?',
      ctaDescription: 'Fataana nibigo byinshi bikoresha AflaGuard Pro kugirango bemeze umutekano wibiryo kandi binjire mumasoko akomeye.',
      startYourFreeTrial: 'Tangira Igerageza ryawe kubuntu',
      scheduleDemo: 'Shiraho Inyigisho'
    }
  }

  const t = translations[language]

  const features = [
    {
      icon: Zap,
      title: t.aiDetectionTitle,
      description: t.aiDetectionDesc
    },
    {
      icon: Shield,
      title: t.foodSafetyTitle,
      description: t.foodSafetyDesc
    },
    {
      icon: TrendingUp,
      title: t.qualityTitle,
      description: t.qualityDesc
    },
    {
      icon: Globe,
      title: t.globalTitle,
      description: t.globalDesc
    }
  ]

  const userTypes = [
    {
      icon: Users,
      title: t.institutions,
      description: t.institutionsDesc,
      features: [t.institutionFeature1, t.institutionFeature2, t.institutionFeature3]
    },
    {
      icon: BarChart3,
      title: t.processors,
      description: t.processorsDesc,
      features: [t.processorFeature1, t.processorFeature2, t.processorFeature3]
    },
    {
      icon: Book,
      title: t.laboratories,
      description: t.laboratoriesDesc,
      features: [t.labFeature1, t.labFeature2, t.labFeature3]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-green-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-12">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-xl rounded-full border border-white/20 shadow-lg">
              <Sparkles className="w-4 h-4 mr-2 text-emerald-600" />
              <span className="text-sm font-medium text-slate-700">{t.aiPoweredPlatform}</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6 max-w-5xl mx-auto">
              <h1 className="text-6xl lg:text-7xl font-light text-slate-900 leading-tight tracking-tight">
                {t.protectFoodSafety}
                <br />
                <span className="font-extralight bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  {t.withIntelligence}
                </span>
              </h1>
              <p className="text-xl font-light text-slate-600 leading-relaxed max-w-3xl mx-auto">
                {t.heroDescription}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group px-8 py-4 bg-emerald-600 text-white rounded-2xl font-medium shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 flex items-center space-x-2 hover:bg-emerald-700">
                <UserPlus className="w-5 h-5" />
                <span>{t.startFreeTrial}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white/60 backdrop-blur-xl text-slate-700 rounded-2xl font-medium border border-white/20 shadow-lg hover:bg-white/80 transition-all duration-300 flex items-center space-x-2">
                <Book className="w-5 h-5" />
                <span>{t.learnMore}</span>
              </button>
            </div>
          </div>

          {/* Product Preview */}
          <div className="mt-24 relative">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-white/40 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 rounded-3xl"></div>
                <div className="relative space-y-8">
                  {/* Window Controls */}
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  
                  {/* Interface Preview */}
                  <div className="space-y-6">
                    <div className="h-4 bg-slate-200/60 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-slate-200/60 rounded-lg w-1/2"></div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200/50">
                      <div className="text-center">
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <div className="text-green-800 font-semibold text-lg">{t.safeToConsume}</div>
                        <div className="text-green-600 text-sm mt-2">{t.confidence}: 99.2%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-5xl font-light text-slate-900">{t.advancedTechnology}</h2>
            <p className="text-xl font-light text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {t.technologyDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 font-light leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-5xl font-light text-slate-900">{t.builtForStakeholders}</h2>
            <p className="text-xl font-light text-slate-600">
              {t.stakeholdersDescription}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <div key={index} className="group">
                <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-300">
                    <type.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-medium text-slate-900 mb-3">{type.title}</h3>
                  <p className="text-slate-600 font-light mb-8 leading-relaxed">{type.description}</p>
                  <ul className="space-y-3 mb-8">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-slate-700 font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-medium hover:bg-emerald-700 transition-colors duration-300">
                    {t.getStarted}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="max-w-5xl mx-auto text-center px-6 lg:px-8">
          <div className="bg-white/40 backdrop-blur-2xl rounded-3xl p-16 border border-white/20 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/5 to-green-900/10 rounded-3xl"></div>
            <div className="relative">
              <h2 className="text-5xl font-light text-slate-900 mb-8 leading-tight">
                {t.ctaTitle}
                <br />
                {t.ctaSubtitle}
              </h2>
              <p className="text-xl font-light text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                {t.ctaDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="group px-10 py-5 bg-emerald-600 text-white rounded-2xl font-medium shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center space-x-3 hover:bg-emerald-700">
                  <UserPlus className="w-6 h-6" />
                  <span>{t.startYourFreeTrial}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-10 py-5 bg-white/60 backdrop-blur-xl text-slate-700 rounded-2xl font-medium border border-white/20 shadow-lg hover:bg-white/80 transition-all duration-300 flex items-center justify-center space-x-3">
                  <Phone className="w-6 h-6" />
                  <span>{t.scheduleDemo}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}