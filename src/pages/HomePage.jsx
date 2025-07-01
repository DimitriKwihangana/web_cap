import { Shield, Users, BarChart3, Book, Zap, Target, Award, TrendingUp, CheckCircle, Globe, UserPlus, Phone, ArrowRight, Sparkles } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms for accurate aflatoxin prediction'
    },
    {
      icon: Shield,
      title: 'Food Safety Assurance',
      description: 'Protect consumers with reliable contamination detection'
    },
    {
      icon: TrendingUp,
      title: 'Quality Enhancement',
      description: 'Access premium markets with certified quality standards'
    },
    {
      icon: Globe,
      title: 'Global Standards',
      description: 'Comply with international food safety regulations'
    }
  ]

  const userTypes = [
    {
      icon: Users,
      title: 'Institutions',
      description: 'Schools, prisons, and bulk buyers',
      features: ['Bulk testing', 'Quality assurance', 'Cost optimization']
    },
    {
      icon: BarChart3,
      title: 'Processors',
      description: 'Food processing companies',
      features: ['Premium market access', 'Quality certification', 'Brand protection']
    },
    {
      icon: Book,
      title: 'Laboratories',
      description: 'Testing and research facilities',
      features: ['Model validation', 'Data contribution', 'Research collaboration']
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
              <span className="text-sm font-medium text-slate-700">AI-Powered Detection Platform</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6 max-w-5xl mx-auto">
              <h1 className="text-6xl lg:text-7xl font-light text-slate-900 leading-tight tracking-tight">
                Protect Food Safety
                <br />
                <span className="font-extralight bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  with Intelligence
                </span>
              </h1>
              <p className="text-xl font-light text-slate-600 leading-relaxed max-w-3xl mx-auto">
                Revolutionary aflatoxin prediction platform powered by machine learning. 
                Ensure food safety, access premium markets, and protect consumers worldwide.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group px-8 py-4 bg-emerald-600 text-white rounded-2xl font-medium shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 flex items-center space-x-2 hover:bg-emerald-700">
                <UserPlus className="w-5 h-5" />
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white/60 backdrop-blur-xl text-slate-700 rounded-2xl font-medium border border-white/20 shadow-lg hover:bg-white/80 transition-all duration-300 flex items-center space-x-2">
                <Book className="w-5 h-5" />
                <span>Learn More</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center space-x-12 pt-8">
              <div className="text-center">
                <div className="text-3xl font-light text-slate-900">99.2%</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Accuracy</div>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div className="text-center">
                <div className="text-3xl font-light text-slate-900">500+</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Organizations</div>
              </div>
              <div className="w-px h-12 bg-slate-200"></div>
              <div className="text-center">
                <div className="text-3xl font-light text-slate-900">24/7</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Support</div>
              </div>
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
                        <div className="text-green-800 font-semibold text-lg">Safe to Consume</div>
                        <div className="text-green-600 text-sm mt-2">Confidence: 99.2%</div>
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
            <h2 className="text-5xl font-light text-slate-900">Advanced Technology</h2>
            <p className="text-xl font-light text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Our platform combines advanced AI, real-time analysis, and comprehensive reporting 
              to deliver unmatched accuracy in aflatoxin detection.
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
            <h2 className="text-5xl font-light text-slate-900">Built for Every Stakeholder</h2>
            <p className="text-xl font-light text-slate-600">
              Tailored solutions for institutions, processors, and laboratories
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
                    Get Started
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
                Ready to Transform Your
                <br />
                Food Safety Standards?
              </h2>
              <p className="text-xl font-light text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                Join hundreds of organizations already using AflaGuard Pro to ensure food safety and access premium markets.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="group px-10 py-5 bg-emerald-600 text-white rounded-2xl font-medium shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center space-x-3 hover:bg-emerald-700">
                  <UserPlus className="w-6 h-6" />
                  <span>Start Your Free Trial</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-10 py-5 bg-white/60 backdrop-blur-xl text-slate-700 rounded-2xl font-medium border border-white/20 shadow-lg hover:bg-white/80 transition-all duration-300 flex items-center justify-center space-x-3">
                  <Phone className="w-6 h-6" />
                  <span>Schedule Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}