import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  HelpCircle, 
  FileText, 
  Mail, 
  Phone, 
  MessageCircle,
  Book,
  Video,
  Download,
  Users,
  Settings,
  Shield,
  Search
} from 'lucide-react';

const HelpCenterPage = () => {
  const navigate = useNavigate();

  const categories = [
    {
      icon: <Book className="w-8 h-8" />,
      title: 'Getting Started',
      description: 'Learn the basics of using the system',
      articles: [
        'How to create an account',
        'Setting up your profile',
        'Understanding the dashboard',
        'First-time user guide'
      ]
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Land Requests',
      description: 'Everything about land applications',
      articles: [
        'How to submit a land request',
        'Required documents checklist',
        'Tracking your application',
        'Understanding approval process'
      ]
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'Infrastructure Reports',
      description: 'Report and track infrastructure issues',
      articles: [
        'How to report an issue',
        'Adding photos to reports',
        'Checking report status',
        'Issue priority levels'
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Account Management',
      description: 'Manage your account settings',
      articles: [
        'Updating profile information',
        'Changing your password',
        'Email notifications settings',
        'Deleting your account'
      ]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Security & Privacy',
      description: 'Keep your account secure',
      articles: [
        'Account security best practices',
        'Understanding data privacy',
        'Two-factor authentication',
        'Reporting suspicious activity'
      ]
    },
    {
      icon: <HelpCircle className="w-8 h-8" />,
      title: 'Troubleshooting',
      description: 'Fix common issues',
      articles: [
        'Login problems',
        'Upload errors',
        'Browser compatibility',
        'Mobile app issues'
      ]
    }
  ];

  const quickLinks = [
    {
      icon: <Video className="w-6 h-6" />,
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      action: 'Watch Now'
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'User Manual',
      description: 'Download complete documentation',
      action: 'Download PDF'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Live Chat',
      description: 'Chat with support team',
      action: 'Start Chat'
    }
  ];

  const contactOptions = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'birukb1152@gmail.com',
      time: 'Response within 24 hours'
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: 'Phone Support',
      description: 'Call our hotline',
      contact: '+251 903 22 44 46',
      time: 'Mon-Fri, 8 AM - 5 PM'
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Live Chat',
      description: 'Chat with an agent',
      contact: 'Available now',
      time: 'Mon-Fri, 9 AM - 6 PM'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-emerald-500" />
              <div>
                <div className="text-lg font-bold">URBAN LAND</div>
                <div className="text-[10px] text-gray-400 -mt-1">MANAGEMENT SYSTEM</div>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How can we <span className="text-emerald-500">help</span> you?
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Search our knowledge base or browse categories below
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((link, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition cursor-pointer group"
              >
                <div className="text-emerald-500 mb-4 group-hover:scale-110 transition">
                  {link.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{link.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{link.description}</p>
                <span className="text-emerald-500 text-sm font-semibold group-hover:underline">
                  {link.action} →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 transition group cursor-pointer"
              >
                <div className="text-emerald-500 mb-4 group-hover:scale-110 transition">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.articles.map((article, aIdx) => (
                    <li key={aIdx} className="text-gray-300 text-sm hover:text-emerald-500 transition cursor-pointer">
                      • {article}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'How to submit your first land request', views: '2.5K views' },
              { title: 'Understanding the approval process', views: '1.8K views' },
              { title: 'Uploading documents correctly', views: '1.5K views' },
              { title: 'Tracking your application status', views: '1.2K views' },
              { title: 'Reporting infrastructure issues', views: '980 views' },
              { title: 'Account security best practices', views: '850 views' }
            ].map((article, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-500 transition">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{article.views}</p>
                  </div>
                  <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
            <p className="text-gray-400">Our support team is here to assist you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactOptions.map((option, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center hover:border-emerald-500/50 transition group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-2xl mb-6 group-hover:bg-emerald-500 transition">
                  <div className="text-emerald-500 group-hover:text-white transition">
                    {option.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{option.description}</p>
                <p className="text-emerald-500 font-semibold mb-2">{option.contact}</p>
                <p className="text-gray-500 text-sm">{option.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 mb-8">
            Find quick answers to common questions
          </p>
          <button
            onClick={() => navigate('/faq')}
            className="px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-semibold"
          >
            View FAQ
          </button>
        </div>
      </section>
    </div>
  );
};

export default HelpCenterPage;
