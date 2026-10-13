import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  FileText, 
  CheckCircle, 
  Bell, 
  BarChart3, 
  Upload,
  Shield,
  Zap,
  Users,
  MapPin,
  Mail,
  Phone,
  Menu,
  X,
  ChevronRight,
  Star,
  Lock,
  Globe,
  Sun,
  Moon,
  ArrowUp
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LandingPage = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => {
        // On mobile, cycle through all testimonials one by one
        if (window.innerWidth < 768) {
          return (prev + 1) % testimonials.length;
        }
        // On desktop, cycle through groups of 3
        const nextGroup = prev + 3;
        return nextGroup >= testimonials.length ? 0 : nextGroup;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError('');
    setContactSuccess(false);

    try {
      await axios.post(`${API_URL}/contact/submit`, contactForm);
      
      setContactSuccess(true);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setContactSuccess(false);
      }, 5000);
    } catch (error) {
      setContactError(error.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const features = [
    {
      icon: <Building2 className="w-12 h-12" />,
      title: 'Land Request',
      description: 'Apply for land digitally'
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: 'Infrastructure Reports',
      description: 'Report issues & track status'
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: 'Approvals',
      description: 'Track and manage approvals'
    },
    {
      icon: <Bell className="w-12 h-12" />,
      title: 'Notifications',
      description: 'Get real-time updates'
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: 'Dashboard',
      description: 'Analytics and insights'
    },
    {
      icon: <Upload className="w-12 h-12" />,
      title: 'Documents',
      description: 'Upload and manage documents'
    }
  ];

  const benefits = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Transparent',
      description: 'Track and open procedures'
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'Efficient',
      description: 'Save time and resources'
    },
    {
      icon: <Lock className="w-12 h-12" />,
      title: 'Secure',
      description: 'Data privacy and protection'
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: 'Accessible',
      description: 'Services available for everyone'
    }
  ];

  const testimonials = [
    {
      name: 'Danie Abate',
      role: 'City Engineer',
      text: 'The system made land management so much easier. The transparency and real-time tracking improved our efficiency.',
      rating: 5,
      image: '/person-1.jfif'
    },
    {
      name: 'Fikre Markos',
      role: 'Citizen',
      text: 'I can track my land request online. Very convenient and the approval process is much faster now.',
      rating: 5,
      image: '/person-5-w.jfif'
    },
    {
      name: 'Alemu Debebe',
      role: 'Government Officer',
      text: 'The digital approval system reduced paperwork and improved transparency significantly.',
      rating: 5,
      image: '/person-2.jfif'
    },
    {
      name: 'Bisrat F/Maryam',
      role: 'Urban Planner',
      text: 'This platform streamlined our workflow. The dashboard analytics help us make better decisions.',
      rating: 5,
      image: '/person-6-w.jfif'
    },
    {
      name: 'Yosef Habtamu',
      role: 'Property Owner',
      text: 'Filing infrastructure reports is now so simple. I get updates instantly on my phone.',
      rating: 5,
      image: '/person-3.jfif'
    },
    {
      name: 'Robel Desalegn',
      role: 'Municipal Administrator',
      text: 'The approval workflow is excellent. We can process requests faster and more efficiently than ever.',
      rating: 5,
      image: '/person-4.jfif'
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'}`}>
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? darkMode 
            ? 'bg-slate-950/95 backdrop-blur-lg shadow-lg' 
            : 'bg-white/95 backdrop-blur-lg shadow-lg'
          : darkMode
            ? 'bg-slate-950/50 backdrop-blur-sm'
            : 'bg-white/50 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Building2 className={`w-8 h-8 ${darkMode ? 'text-emerald-500' : 'text-emerald-600'}`} />
              <div>
                <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>URBAN LAND</div>
                <div className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'} -mt-1`}>MANAGEMENT SYSTEM</div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className={`${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'} transition`}>Home</button>
              <button onClick={() => scrollToSection('about')} className={`${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'} transition`}>About</button>
              <button onClick={() => scrollToSection('features')} className={`${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'} transition`}>Features</button>
              <button onClick={() => scrollToSection('testimonials')} className={`${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'} transition`}>Testimonials</button>
              <button onClick={() => scrollToSection('contact')} className={`${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'} transition`}>Contact</button>
            </div>

            {/* Auth Buttons & Theme Toggle */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition ${
                  darkMode 
                    ? 'hover:bg-slate-800 text-yellow-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title="Toggle theme"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={() => navigate('/login')}
                className={`px-5 py-2 border rounded-lg transition ${
                  darkMode
                    ? 'border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                    : 'border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                }`}
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')}
                className={`px-5 py-2 rounded-lg transition ${
                  darkMode
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                Register
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('home')} className={`block w-full text-left py-2 ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>Home</button>
              <button onClick={() => scrollToSection('about')} className={`block w-full text-left py-2 ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>About</button>
              <button onClick={() => scrollToSection('features')} className={`block w-full text-left py-2 ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>Features</button>
              <button onClick={() => scrollToSection('testimonials')} className={`block w-full text-left py-2 ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>Testimonials</button>
              <button onClick={() => scrollToSection('contact')} className={`block w-full text-left py-2 ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>Contact</button>
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg text-center transition ${
                    darkMode 
                      ? 'bg-slate-800 text-yellow-400' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {darkMode ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
                </button>
                <button onClick={() => navigate('/login')} className={`block w-full px-4 py-2 border rounded-lg text-center ${darkMode ? 'border-emerald-500 text-emerald-500' : 'border-emerald-600 text-emerald-600'}`}>Login</button>
                <button onClick={() => navigate('/register')} className={`block w-full px-4 py-2 rounded-lg text-center ${darkMode ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white'}`}>Register</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            darkMode
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/50'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/50'
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* Hero Section - Matching Design */}
      <section id="home" className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-16 ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-emerald-50 via-white to-cyan-50'}`}>
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-slate-900"
          style={{
            backgroundImage: 'url(/hero-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Dark Overlay - Adjusted for better visibility */}
        <div className={`absolute inset-0 z-0 ${darkMode ? 'bg-slate-950/70' : 'bg-white/40'}`} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div>
              <div className={`inline-block mb-4 px-4 py-2 rounded-full text-sm font-medium ${
                darkMode 
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-emerald-100 border border-emerald-300 text-emerald-700'
              }`}>
                ✨ Smart City. Better Future.
              </div>
              
              <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Modern Urban Land<br />
                <span className={darkMode ? 'text-emerald-500' : 'text-emerald-600'}>Management</span> System
              </h1>
              
              <p className={`text-lg md:text-xl mb-8 max-w-xl ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Manage land requests, infrastructure reports, approvals, and citizen services digitally and transparently.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button 
                  onClick={() => navigate('/register')}
                  className={`px-8 py-4 rounded-lg transition flex items-center justify-center space-x-2 text-lg font-semibold shadow-lg ${
                    darkMode
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/30'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/30'
                  }`}
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className={`px-8 py-4 rounded-lg backdrop-blur-sm transition text-lg font-semibold ${
                    darkMode
                      ? 'border-2 border-white/20 text-white hover:bg-white/10'
                      : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Login
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className={`px-8 py-4 transition text-lg font-semibold flex items-center justify-center space-x-2 ${
                    darkMode
                      ? 'text-emerald-500 hover:text-emerald-400'
                      : 'text-emerald-600 hover:text-emerald-700'
                  }`}
                >
                  <span>Learn More</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Side - Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Building2 className="w-8 h-8" />, title: 'Land Request', desc: 'Apply for land digitally' },
                { icon: <FileText className="w-8 h-8" />, title: 'Infrastructure Reports', desc: 'Report issues & track status' },
                { icon: <CheckCircle className="w-8 h-8" />, title: 'Approvals', desc: 'Track and manage approvals' },
                { icon: <Bell className="w-8 h-8" />, title: 'Notifications', desc: 'Get real-time updates' },
                { icon: <BarChart3 className="w-8 h-8" />, title: 'Dashboard', desc: 'Analytics and insights' },
                { icon: <Upload className="w-8 h-8" />, title: 'Documents', desc: 'Upload and manage documents' }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`rounded-xl p-6 border transition group cursor-pointer ${
                    darkMode
                      ? 'bg-slate-900/60 backdrop-blur-lg border-slate-700/50 hover:border-emerald-500/50 hover:bg-slate-900/80'
                      : 'bg-white/60 backdrop-blur-lg border-white/40 hover:border-emerald-400 hover:bg-white/80 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <div className={`mb-3 group-hover:scale-110 transition ${
                    darkMode ? 'text-emerald-500' : 'text-emerald-600'
                  }`}>{item.icon}</div>
                  <h3 className={`text-base font-semibold mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>{item.title}</h3>
                  <p className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section - With Image */}
      <section id="about" className={`py-20 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className={`text-sm font-semibold mb-3 ${
              darkMode ? 'text-emerald-500' : 'text-emerald-600'
            }`}>• ABOUT US •</div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Building Transparent and <span className={darkMode ? 'text-emerald-500' : 'text-emerald-600'}>Smart Cities</span>
            </h2>
          </div>

          {/* Image and Description Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
            {/* Image Side */}
            <div className={`relative rounded-2xl overflow-hidden shadow-2xl group ${
              darkMode ? '' : 'ring-4 ring-emerald-100'
            }`}>
              <img 
                src="/about-city.png" 
                alt="Modern Smart City" 
                className="w-full h-[500px] object-cover group-hover:scale-105 transition duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${
                darkMode 
                  ? 'from-slate-950 via-slate-950/50 to-transparent'
                  : 'from-gray-900/60 via-gray-900/30 to-transparent'
              }`} />
              <div className="absolute bottom-8 left-8 right-8">
                <div className={`backdrop-blur-xl border rounded-2xl p-6 ${
                  darkMode
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-white/90 border-emerald-200'
                }`}>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className={`p-3 rounded-xl ${
                      darkMode ? 'bg-emerald-500' : 'bg-emerald-600'
                    }`}>
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>Building Better Cities</h3>
                      <p className={`text-sm ${
                        darkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`}>For a brighter tomorrow</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div>
              <p className={`text-xl mb-8 leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Our Urban Land Management System helps citizens and government offices manage land services efficiently, securely, and transparently.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className={`rounded-xl p-6 border transition group cursor-pointer ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 hover:border-emerald-500/50'
                      : 'bg-white border-gray-200 hover:border-emerald-500 shadow-lg hover:shadow-xl'
                  }`}>
                    <div className={`mb-4 group-hover:scale-110 transition ${
                      darkMode ? 'text-emerald-500' : 'text-emerald-600'
                    }`}>
                      {benefit.icon}
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{benefit.title}</h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Professional Design */}
      <section id="features" className={`py-20 relative overflow-hidden ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-emerald-500/3 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgb(16 185 129) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(16 185 129) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }} />
        </div>

        {/* Floating Dots */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <div className="absolute top-40 right-32 w-3 h-3 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-32 left-40 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 right-20 w-3 h-3 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }} />
        </div>

        {/* Diagonal Lines */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, rgb(16 185 129) 50px, rgb(16 185 129) 51px)',
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className={`inline-block mb-4 px-4 py-2 rounded-full text-sm font-semibold ${
              darkMode
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-emerald-100 border border-emerald-300 text-emerald-700'
            }`}>
              • FEATURES •
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Everything You Need in <span className={darkMode ? 'text-emerald-500' : 'text-emerald-600'}>One</span> Platform
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Powerful tools designed to streamline land management and infrastructure reporting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="relative group"
              >
                {/* Card Glow Effect */}
                <div className={`absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500 ${
                  darkMode
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                    : 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                }`} />
                
                {/* Card Content */}
                <div className={`relative rounded-2xl p-8 h-full border transition-all duration-300 group-hover:transform group-hover:-translate-y-2 ${
                  darkMode
                    ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
                    : 'bg-white border-gray-200 hover:border-emerald-500 shadow-lg hover:shadow-2xl'
                }`}>
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 rounded-2xl blur-xl transition ${
                      darkMode
                        ? 'bg-emerald-500/20 group-hover:bg-emerald-500/30'
                        : 'bg-emerald-400/20 group-hover:bg-emerald-400/30'
                    }`} />
                    <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center border transition ${
                      darkMode
                        ? 'bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-emerald-500/20 group-hover:border-emerald-500/50'
                        : 'bg-gradient-to-br from-emerald-100 to-cyan-100 border-emerald-300 group-hover:border-emerald-500'
                    }`}>
                      <div className={`group-hover:scale-110 transition-transform duration-300 ${
                        darkMode ? 'text-emerald-500' : 'text-emerald-600'
                      }`}>
                        {feature.icon}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className={`text-xl font-semibold mb-3 transition ${
                    darkMode
                      ? 'text-white group-hover:text-emerald-500'
                      : 'text-gray-900 group-hover:text-emerald-600'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`leading-relaxed ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>

                  {/* Decorative Corner */}
                  <div className={`absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-2xl transition ${
                    darkMode
                      ? 'border-emerald-500/0 group-hover:border-emerald-500/50'
                      : 'border-emerald-500/0 group-hover:border-emerald-500'
                  }`} />
                  <div className={`absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-2xl transition ${
                    darkMode
                      ? 'border-emerald-500/0 group-hover:border-emerald-500/50'
                      : 'border-emerald-500/0 group-hover:border-emerald-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className={`inline-flex items-center gap-4 rounded-2xl p-6 border ${
              darkMode
                ? 'bg-slate-900/50 backdrop-blur-sm border-slate-800'
                : 'bg-white border-gray-200 shadow-lg'
            }`}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 border-2 border-slate-900 flex items-center justify-center text-white font-bold text-sm">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className={`font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Join 10,000+ users</p>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Already using our platform</p>
              </div>
              <button
                onClick={() => navigate('/register')}
                className={`ml-4 px-6 py-3 rounded-xl font-semibold shadow-lg transition ${
                  darkMode
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/30'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/30'
                }`}
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Modern & Professional with 3 Cards Display */}
      <section id="testimonials" className={`py-20 relative overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className={`text-sm font-semibold mb-3 ${
              darkMode ? 'text-emerald-500' : 'text-emerald-600'
            }`}>• TESTIMONIALS •</div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              What <span className={darkMode ? 'text-emerald-500' : 'text-emerald-600'}>People</span> Say About Us
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Trusted by thousands of citizens and government officials across the country
            </p>
          </div>

          {/* Horizontal Scrolling Testimonials - 3 Cards at Once (Desktop), 1 Card (Mobile) */}
          <div className="relative">
            {/* Navigation Buttons - Hidden on Mobile */}
            <button
              onClick={() => {
                const newIndex = activeTestimonial === 0 ? Math.max(0, testimonials.length - 3) : Math.max(0, activeTestimonial - 3);
                setActiveTestimonial(newIndex);
              }}
              className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 border rounded-full items-center justify-center transition group ${
                darkMode
                  ? 'bg-slate-950 border-slate-700 hover:bg-emerald-500 hover:border-emerald-500'
                  : 'bg-white border-gray-300 hover:bg-emerald-600 hover:border-emerald-600 shadow-lg'
              }`}
            >
              <ChevronRight className={`w-6 h-6 rotate-180 transition ${
                darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-white'
              }`} />
            </button>
            <button
              onClick={() => {
                const newIndex = activeTestimonial + 3 >= testimonials.length ? 0 : activeTestimonial + 3;
                setActiveTestimonial(newIndex);
              }}
              className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 border rounded-full items-center justify-center transition group ${
                darkMode
                  ? 'bg-slate-950 border-slate-700 hover:bg-emerald-500 hover:border-emerald-500'
                  : 'bg-white border-gray-300 hover:bg-emerald-600 hover:border-emerald-600 shadow-lg'
              }`}
            >
              <ChevronRight className={`w-6 h-6 transition ${
                darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-white'
              }`} />
            </button>

            {/* Testimonials Container */}
            <div className="overflow-hidden md:px-12">
              {/* Desktop View - 3 Cards */}
              <div className="hidden md:block">
                <div 
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${(activeTestimonial / 3) * 100}%)` }}
                >
                  {/* Group testimonials in sets of 3 */}
                  {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, groupIdx) => (
                    <div key={groupIdx} className="w-full flex-shrink-0 grid grid-cols-3 gap-6 px-2">
                      {testimonials.slice(groupIdx * 3, groupIdx * 3 + 3).map((testimonial, idx) => (
                        <div 
                          key={groupIdx * 3 + idx}
                          className={`rounded-2xl p-6 border transition-all duration-300 flex flex-col ${
                            darkMode
                              ? 'bg-slate-950 border-slate-800 hover:border-emerald-500/50'
                              : 'bg-white border-gray-200 hover:border-emerald-500 shadow-lg hover:shadow-xl'
                          }`}
                        >
                          {/* Quote Icon */}
                          <div className={darkMode ? 'text-emerald-500' : 'text-emerald-600 mb-4'}>
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                          </div>

                          {/* Stars */}
                          <div className="flex mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            ))}
                          </div>

                          {/* Testimonial Text */}
                          <p className={`mb-6 leading-relaxed text-sm flex-grow ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            "{testimonial.text}"
                          </p>

                          {/* Author Info */}
                          <div className={`flex items-center space-x-3 pt-4 border-t ${
                            darkMode ? 'border-slate-800' : 'border-gray-200'
                          }`}>
                            <div className={`w-12 h-12 rounded-full overflow-hidden border-2 shadow-lg flex-shrink-0 ${
                              darkMode ? 'border-emerald-500' : 'border-emerald-600'
                            }`}>
                              <img 
                                src={testimonial.image} 
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className={`font-semibold ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>{testimonial.name}</div>
                              <div className={`text-xs ${
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>{testimonial.role}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile View - 1 Card with Swipe */}
              <div className="md:hidden">
                <div 
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial, idx) => (
                    <div 
                      key={idx}
                      className="w-full flex-shrink-0 px-2"
                    >
                      <div className={`rounded-2xl p-6 border transition-all duration-300 ${
                        darkMode
                          ? 'bg-slate-950 border-slate-800 hover:border-emerald-500/50'
                          : 'bg-white border-gray-200 hover:border-emerald-500 shadow-lg hover:shadow-xl'
                      }`}>
                        {/* Quote Icon */}
                        <div className={`mb-4 ${darkMode ? 'text-emerald-500' : 'text-emerald-600'}`}>
                          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                        </div>

                        {/* Stars */}
                        <div className="flex mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>

                        {/* Testimonial Text */}
                        <p className={`mb-6 leading-relaxed text-base ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          "{testimonial.text}"
                        </p>

                        {/* Author Info */}
                        <div className={`flex items-center space-x-4 pt-6 border-t ${
                          darkMode ? 'border-slate-800' : 'border-gray-200'
                        }`}>
                          <div className={`w-16 h-16 rounded-full overflow-hidden border-2 shadow-lg flex-shrink-0 ${
                            darkMode ? 'border-emerald-500' : 'border-emerald-600'
                          }`}>
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className={`font-semibold text-lg ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>{testimonial.name}</div>
                            <div className={`text-sm ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Navigation Arrows */}
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={() => {
                      const newIndex = activeTestimonial === 0 ? testimonials.length - 1 : activeTestimonial - 1;
                      setActiveTestimonial(newIndex);
                    }}
                    className={`w-10 h-10 border rounded-full flex items-center justify-center transition ${
                      darkMode
                        ? 'bg-slate-950 border-slate-700 hover:bg-emerald-500 hover:border-emerald-500'
                        : 'bg-white border-gray-300 hover:bg-emerald-600 hover:border-emerald-600'
                    }`}
                  >
                    <ChevronRight className={`w-5 h-5 rotate-180 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  </button>
                  <span className={`text-sm font-medium ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {activeTestimonial + 1} / {testimonials.length}
                  </span>
                  <button
                    onClick={() => {
                      const newIndex = activeTestimonial === testimonials.length - 1 ? 0 : activeTestimonial + 1;
                      setActiveTestimonial(newIndex);
                    }}
                    className={`w-10 h-10 border rounded-full flex items-center justify-center transition ${
                      darkMode
                        ? 'bg-slate-950 border-slate-700 hover:bg-emerald-500 hover:border-emerald-500'
                        : 'bg-white border-gray-300 hover:bg-emerald-600 hover:border-emerald-600'
                    }`}
                  >
                    <ChevronRight className={`w-5 h-5 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots - Desktop Only */}
          <div className="hidden md:flex justify-center items-center space-x-3 mt-12">
            {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx * 3)}
                className={`transition-all duration-300 ${
                  Math.floor(activeTestimonial / 3) === idx
                    ? darkMode
                      ? 'bg-emerald-500 w-10 h-3 rounded-full'
                      : 'bg-emerald-600 w-10 h-3 rounded-full'
                    : darkMode
                      ? 'bg-slate-700 w-3 h-3 rounded-full hover:bg-slate-600'
                      : 'bg-gray-300 w-3 h-3 rounded-full hover:bg-gray-400'
                }`}
                aria-label={`View testimonials ${idx * 3 + 1} to ${Math.min((idx + 1) * 3, testimonials.length)}`}
              />
            ))}
          </div>

          {/* Navigation Dots - Mobile Only */}
          <div className="md:hidden flex justify-center items-center space-x-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`transition-all duration-300 ${
                  activeTestimonial === idx
                    ? darkMode
                      ? 'bg-emerald-500 w-8 h-2 rounded-full'
                      : 'bg-emerald-600 w-8 h-2 rounded-full'
                    : darkMode
                      ? 'bg-slate-700 w-2 h-2 rounded-full hover:bg-slate-600'
                      : 'bg-gray-300 w-2 h-2 rounded-full hover:bg-gray-400'
                }`}
                aria-label={`View testimonial ${idx + 1}`}
              />
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Active Users', icon: <Users className="w-6 h-6" /> },
              { number: '5K+', label: 'Land Requests', icon: <Building2 className="w-6 h-6" /> },
              { number: '15K+', label: 'Reports Filed', icon: <FileText className="w-6 h-6" /> },
              { number: '98%', label: 'Satisfaction Rate', icon: <Star className="w-6 h-6" /> }
            ].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className={`rounded-2xl p-6 border transition ${
                  darkMode
                    ? 'bg-slate-950 border-slate-800 hover:border-emerald-500/50'
                    : 'bg-white border-gray-200 hover:border-emerald-500 shadow-lg hover:shadow-xl'
                }`}>
                  <div className={`flex justify-center mb-3 transition ${
                    darkMode
                      ? 'text-emerald-500 group-hover:scale-110'
                      : 'text-emerald-600 group-hover:scale-110'
                  }`}>
                    {stat.icon}
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${
                    darkMode ? 'text-emerald-500' : 'text-emerald-600'
                  }`}>{stat.number}</div>
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Modern Design */}
      <section id="contact" className={`py-20 relative overflow-hidden ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
        {/* Animated Background Gradient Orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgb(16 185 129) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(16 185 129) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Diagonal Lines Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgb(16 185 129) 35px, rgb(16 185 129) 36px)',
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className={`text-sm font-semibold mb-3 ${
              darkMode ? 'text-emerald-500' : 'text-emerald-600'
            }`}>• CONTACT US •</div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              We're Here to <span className={darkMode ? 'text-emerald-500' : 'text-emerald-600'}>Help</span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Have questions or need assistance? Reach out to us!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <div className={`rounded-2xl p-8 border transition group ${
              darkMode
                ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
                : 'bg-white border-gray-200 hover:border-emerald-500 shadow-lg hover:shadow-xl'
            }`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition ${
                darkMode
                  ? 'bg-emerald-500/10 group-hover:bg-emerald-500'
                  : 'bg-emerald-100 group-hover:bg-emerald-600'
              }`}>
                <Mail className={`w-8 h-8 transition ${
                  darkMode
                    ? 'text-emerald-500 group-hover:text-white'
                    : 'text-emerald-600 group-hover:text-white'
                }`} />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Email</h3>
              <p className={`mb-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Drop us a line anytime</p>
              <a href="mailto:birukb1152@gmail.com" className={`block transition ${
                darkMode
                  ? 'text-emerald-500 hover:text-emerald-400'
                  : 'text-emerald-600 hover:text-emerald-700'
              }`}>
                birukb1152@gmail.com
              </a>
              <a href="mailto:amha03@gmail.com" className={`block transition ${
                darkMode
                  ? 'text-emerald-500 hover:text-emerald-400'
                  : 'text-emerald-600 hover:text-emerald-700'
              }`}>
                amha03@gmail.com
              </a>
            </div>

            <div className={`rounded-2xl p-8 border transition group ${
              darkMode
                ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
                : 'bg-white border-gray-200 hover:border-emerald-500 shadow-lg hover:shadow-xl'
            }`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition ${
                darkMode
                  ? 'bg-emerald-500/10 group-hover:bg-emerald-500'
                  : 'bg-emerald-100 group-hover:bg-emerald-600'
              }`}>
                <Phone className={`w-8 h-8 transition ${
                  darkMode
                    ? 'text-emerald-500 group-hover:text-white'
                    : 'text-emerald-600 group-hover:text-white'
                }`} />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Phone</h3>
              <p className={`mb-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Mon-Fri from 8am to 5pm</p>
              <a href="tel:+2519032244" className={`block transition ${
                darkMode
                  ? 'text-emerald-500 hover:text-emerald-400'
                  : 'text-emerald-600 hover:text-emerald-700'
              }`}>
                +251 903 22 44 46
              </a>
              <a href="tel:+251952080673" className={`block transition ${
                darkMode
                  ? 'text-emerald-500 hover:text-emerald-400'
                  : 'text-emerald-600 hover:text-emerald-700'
              }`}>
                +251 952 08 08 73
              </a>
            </div>

            <div className={`rounded-2xl p-8 border transition group ${
              darkMode
                ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
                : 'bg-white border-gray-200 hover:border-emerald-500 shadow-lg hover:shadow-xl'
            }`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition ${
                darkMode
                  ? 'bg-emerald-500/10 group-hover:bg-emerald-500'
                  : 'bg-emerald-100 group-hover:bg-emerald-600'
              }`}>
                <MapPin className={`w-8 h-8 transition ${
                  darkMode
                    ? 'text-emerald-500 group-hover:text-white'
                    : 'text-emerald-600 group-hover:text-white'
                }`} />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Address</h3>
              <p className={`mb-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Visit our office</p>
              <p className={darkMode ? 'text-emerald-500' : 'text-emerald-600'}>
                123 Government Center<br />
                Adiss Ababa, Ethiopia
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-4xl mx-auto">
            <div className={`rounded-2xl p-8 md:p-12 border ${
              darkMode
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-gray-200 shadow-xl'
            }`}>
              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Send us a Message</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Fill out the form below and we'll get back to you shortly</p>
              </div>

              {contactSuccess && (
                <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Your message has been sent successfully! We will get back to you soon.</span>
                </div>
              )}

              {contactError && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-start space-x-2">
                  <span className="text-lg">⚠️</span>
                  <span>{contactError}</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-700'
                    }`}>Your Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition ${
                        darkMode
                          ? 'bg-slate-950 border border-slate-700 text-white'
                          : 'bg-gray-50 border border-gray-300 text-gray-900'
                      }`}
                      placeholder="Abebe Kebede"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-700'
                    }`}>Your Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition ${
                        darkMode
                          ? 'bg-slate-950 border border-slate-700 text-white'
                          : 'bg-gray-50 border border-gray-300 text-gray-900'
                      }`}
                      placeholder="example@gmail.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-700'
                    }`}>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleContactChange}
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition ${
                        darkMode
                          ? 'bg-slate-950 border border-slate-700 text-white'
                          : 'bg-gray-50 border border-gray-300 text-gray-900'
                      }`}
                      placeholder="+251 9********"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-700'
                    }`}>Subject *</label>
                    <input 
                      type="text" 
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition ${
                        darkMode
                          ? 'bg-slate-950 border border-slate-700 text-white'
                          : 'bg-gray-50 border border-gray-300 text-gray-900'
                      }`}
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-700'
                  }`}>Your Message *</label>
                  <textarea 
                    rows="6"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition resize-none ${
                      darkMode
                        ? 'bg-slate-950 border border-slate-700 text-white'
                        : 'bg-gray-50 border border-gray-300 text-gray-900'
                    }`}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={contactLoading}
                  className={`w-full px-8 py-4 text-white rounded-xl transition font-semibold flex items-center justify-center space-x-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${
                    darkMode
                      ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                  }`}
                >
                  {contactLoading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              For urgent matters, please call our hotline: <a href="tel:+251903224446" className={`font-semibold ${
                darkMode ? 'text-emerald-500 hover:text-emerald-400' : 'text-emerald-600 hover:text-emerald-700'
              }`}>+251 903 22 44 46</a>
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              We typically respond within 24 hours during business days
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Building2 className={`w-8 h-8 ${darkMode ? 'text-emerald-500' : 'text-emerald-600'}`} />
                <div>
                  <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>URBAN LAND</div>
                  <div className={`text-[10px] -mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>MANAGEMENT SYSTEM</div>
                </div>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Building transparent and smart cities for a brighter tomorrow.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Links</h3>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><button onClick={() => scrollToSection('home')} className={`transition ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>Home</button></li>
                <li><button onClick={() => scrollToSection('about')} className={`transition ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>About</button></li>
                <li><button onClick={() => scrollToSection('features')} className={`transition ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>Features</button></li>
                <li><button onClick={() => scrollToSection('testimonials')} className={`transition ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>Testimonials</button></li>
                <li><button onClick={() => scrollToSection('contact')} className={`transition ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>Contact</button></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Services</h3>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li className={`transition cursor-pointer ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>Land Requests</li>
                <li className={`transition cursor-pointer ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>Infrastructure Reports</li>
                <li className={`transition cursor-pointer ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>Approvals</li>
                <li className={`transition cursor-pointer ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>Dashboard</li>
                <li className={`transition cursor-pointer ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>Documents</li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Support</h3>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><button onClick={() => navigate('/faq')} className={`transition cursor-pointer ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>FAQ</button></li>
                <li><button onClick={() => navigate('/privacy-policy')} className={`transition cursor-pointer ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>Privacy Policy</button></li>
                <li><button onClick={() => navigate('/terms-of-service')} className={`transition cursor-pointer ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>Terms of Service</button></li>
                <li><button onClick={() => navigate('/help-center')} className={`transition cursor-pointer ${darkMode ? 'hover:text-emerald-500' : 'hover:text-emerald-600'}`}>Help Center</button></li>
              </ul>
            </div>
          </div>

          <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center ${
            darkMode ? 'border-slate-800' : 'border-gray-200'
          }`}>
            <p className={`text-sm mb-4 md:mb-0 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2026 Urban Land Management System. All rights reserved.
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Designed with <span className="text-red-500">❤</span> for better cities
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
