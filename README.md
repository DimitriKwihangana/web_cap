# AflaGuard Pro - Advanced Aflatoxin Detection Platform

A comprehensive React application for predicting aflatoxin contamination in maize grain using machine learning. Built with Vite, React Router, Tailwind CSS, and enterprise-grade architecture.

![AflaGuard Pro](https://img.shields.io/badge/AflaGuard-Pro-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-4.5.0-646CFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC)

## 🌟 Features

### 🔐 **Multi-Role Authentication System**
- **Institutions**: Schools, prisons, bulk buyers
- **Processors**: Food processing companies  
- **Laboratories**: Testing and research facilities
- **Administrators**: System management and analytics

### 🤖 **AI-Powered Prediction Engine**
- Real-time aflatoxin contamination prediction
- Integration with ML API endpoint
- Confidence scoring and risk assessment
- Batch tracking and historical data

### 📊 **Comprehensive Dashboard**
- Real-time statistics and metrics
- Recent test history and trends
- Quick action shortcuts
- Performance indicators

### 📚 **Learning Center**
- Prevention strategies and best practices
- Storage guidelines and techniques
- Testing procedures and protocols
- Regulatory compliance information

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Roboto font for professional appearance
- Gradient backgrounds and glass morphism
- Micro-animations and smooth transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/aflaguard-pro.git
cd aflaguard-pro
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
VITE_API_URL=https://model-api-capstone.onrender.com
VITE_APP_NAME=AflaGuard Pro
VITE_APP_VERSION=1.0.0
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
aflaguard-pro/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── layout/        # Layout components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── prediction/    # Prediction components
│   │   └── learning/      # Learning center components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🔧 API Integration

The application integrates with your aflatoxin prediction API:

### Prediction Endpoint
```javascript
POST https://model-api-capstone.onrender.com/predict
Content-Type: application/json

{
  "moisture_maize_grain": 20,
  "Immaturegrains": 6.91,
  "Discolored_grains": 4.12,
  "broken_kernels_percent_maize_grain": 3.66,
  "foreign_matter_percent_maize_grain": 0.13,
  "pest_damaged": 7.82,
  "rotten": 2.4,
  "Liveinfestation": 1,
  "abnormal_odours_maize_grain": 0
}
```

### Response Format
```javascript
{
  "prediction": "safe",
  "confidence": 0.952,
  "risk_level": "low",
  "recommendations": ["Store in dry conditions", "Monitor regularly"]
}
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#2563eb) - Trust, reliability
- **Secondary**: Green (#22c55e) - Safety, natural
- **Warning**: Amber (#f59e0b) - Caution, attention
- **Danger**: Red (#ef4444) - Risk, alerts

### Typography
- **Font Family**: Roboto (300, 400, 500, 700, 900)
- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable, accessible contrast

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Multiple variants with loading states
- **Forms**: Validation, error handling, accessibility
- **Navigation**: Responsive, role-based menus

## 🔐 Authentication & Security

### User Registration Flow
1. User selects organization type
2. Fills personal and company information
3. Local storage for session management
4. Role-based dashboard access

### Security Features
- Client-side authentication with localStorage
- Role-based access control
- Input validation and sanitization
- API error handling and timeout management
- Secure form handling

## 📊 User Roles & Permissions

### Institution Users
- Bulk testing capabilities
- Cost optimization tools
- Quality assurance reports
- Supply chain tracking

### Processor Users
- Premium market access features
- Quality certification tools
- Brand protection measures
- Compliance documentation

### Laboratory Users
- Model validation tools
- Data contribution features
- Research collaboration
- Advanced analytics

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Deploy dist folder to Netlify
```

### Manual Deployment
```bash
npm run build
# Upload dist folder to your hosting provider
```

### Environment Variables for Production
```env
VITE_API_URL=https://your-api-domain.com
VITE_APP_NAME=AflaGuard Pro
VITE_APP_VERSION=1.0.0
```

## 🧪 Testing

### Run Linting
```bash
npm run lint
# or
yarn lint
```

### Build for Production
```bash
npm run build
# or
yarn build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality
- ESLint configuration for React
- Prettier for code formatting (recommended)
- Modern ES6+ syntax
- Functional components with hooks

## 📈 Performance Optimization

### Built-in Optimizations
- Vite's fast HMR and bundling
- React 18 features
- Lazy loading for routes
- Optimized bundle splitting

### Custom Optimizations
- Component lazy loading
- Debounced search inputs
- Optimized re-renders
- Efficient state management

## 🌍 Internationalization

Future support for multiple languages:
- English (default)
- French
- Spanish
- Swahili
- Portuguese

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Update documentation as needed
- Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)

### Contact
- **Email**: support@aflaguard.com
- **Phone**: +1-800-AFLA-GUARD
- **Website**: https://aflaguard.com
- **Issues**: [GitHub Issues](https://github.com/your-username/aflaguard-pro/issues)

## 🏆 Acknowledgments

- **Machine Learning API**: Powered by advanced AI algorithms
- **Design Inspiration**: Modern food safety applications
- **Open Source Libraries**: React, Vite, Tailwind CSS
- **Icons**: Lucide React icon library

## 🔄 Changelog

### Version 1.0.0 (Current)
- Initial release with Vite + React
- Multi-role authentication system
- AI-powered prediction engine
- Comprehensive dashboard
- Learning center with educational content
- Responsive design and modern UI

### Planned Features
- Real-time notifications
- Advanced analytics and reporting
- Multi-language support
- Integration with additional ML models
- Batch processing capabilities
- Mobile responsiveness improvements

---

**AflaGuard Pro** - Protecting food safety through advanced technology 🛡️

Built with ❤️ using React, Vite, and Tailwind CSS# web_cap
