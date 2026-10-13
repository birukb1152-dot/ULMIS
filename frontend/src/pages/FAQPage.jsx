import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ChevronDown, ChevronUp, ArrowLeft, Search } from 'lucide-react';

const FAQPage = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      category: 'General Questions',
      questions: [
        {
          question: 'What is the Urban Land Management System?',
          answer: 'The Urban Land Management System is a digital platform that helps citizens and government offices manage land services efficiently, securely, and transparently. It allows citizens to apply for land, report infrastructure issues, and track their requests online.'
        },
        {
          question: 'Who can use this system?',
          answer: 'The system is available for citizens who want to apply for land or report infrastructure issues, and government officers who need to review and approve requests. You need to register for an account to access the services.'
        },
        {
          question: 'Is the system free to use?',
          answer: 'Yes, creating an account and accessing the system is completely free. However, there may be government fees associated with specific land requests or services, which will be clearly indicated during the application process.'
        },
        {
          question: 'How do I get started?',
          answer: 'Simply click the "Register" button on the homepage, fill in your details, and create an account. Once registered, you can log in and start using all available services.'
        }
      ]
    },
    {
      category: 'Land Requests',
      questions: [
        {
          question: 'How do I apply for land?',
          answer: 'After logging in, navigate to the "Land Requests" section, click "New Request", fill in the required information including location, size, and purpose, upload necessary documents, and submit your application.'
        },
        {
          question: 'What documents do I need to submit?',
          answer: 'Typically, you need: National ID, proof of address, income verification, and any other documents specified in the application form. The exact requirements may vary based on the type of land request.'
        },
        {
          question: 'How long does the approval process take?',
          answer: 'The approval process typically takes 2-4 weeks, depending on the complexity of the request and the workload of the reviewing officers. You can track the status of your application in real-time through your dashboard.'
        },
        {
          question: 'Can I track my land request status?',
          answer: 'Yes! Once you submit a request, you can track its status in real-time from your dashboard. You will also receive email and in-app notifications when there are updates to your request.'
        }
      ]
    },
    {
      category: 'Infrastructure Reports',
      questions: [
        {
          question: 'What types of infrastructure issues can I report?',
          answer: 'You can report issues related to roads (potholes, damage), water supply problems, electricity outages, street lighting, drainage issues, and other public infrastructure concerns.'
        },
        {
          question: 'How do I report an infrastructure issue?',
          answer: 'Go to the "Infrastructure Reports" section, click "Report Issue", select the issue type, provide location details, add a description, upload photos if available, and submit the report.'
        },
        {
          question: 'Will I get updates on my report?',
          answer: 'Yes, you will receive notifications when your report is reviewed, when action is taken, and when the issue is resolved. You can also check the status anytime from your dashboard.'
        },
        {
          question: 'Can I report issues anonymously?',
          answer: 'No, you need to be logged in to report issues. This helps us verify reports and keep you updated on the resolution progress. However, your personal information is kept confidential.'
        }
      ]
    },
    {
      category: 'Account & Security',
      questions: [
        {
          question: 'How do I reset my password?',
          answer: 'On the login page, click "Forgot Password", enter your registered email address, and follow the instructions sent to your email to reset your password.'
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Yes, we take security very seriously. All data is encrypted, and we follow strict security protocols to protect your personal information. We never share your data with third parties without your consent.'
        },
        {
          question: 'Can I update my profile information?',
          answer: 'Yes, you can update your profile information anytime by going to Settings > Profile. Some information like National ID may require verification before changes are approved.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'To delete your account, go to Settings > Account > Delete Account. Please note that this action is permanent and all your data will be removed from our system.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'What browsers are supported?',
          answer: 'The system works best on modern browsers including Google Chrome, Mozilla Firefox, Safari, and Microsoft Edge. We recommend keeping your browser updated to the latest version.'
        },
        {
          question: 'Can I use the system on my mobile phone?',
          answer: 'Yes! The system is fully responsive and works on all devices including smartphones and tablets. You can access all features from your mobile browser.'
        },
        {
          question: 'What should I do if I encounter an error?',
          answer: 'If you encounter an error, try refreshing the page first. If the problem persists, contact our support team through the Help Center or email support@urbanland.gov with details about the error.'
        },
        {
          question: 'How do I contact technical support?',
          answer: 'You can reach our technical support team via email at support@urbanland.gov, call our hotline at +63 (02) 1234 5678, or use the contact form on our website. Support is available Monday to Friday, 8 AM to 5 PM.'
        }
      ]
    }
  ];

  const allQuestions = faqCategories.flatMap((cat, catIdx) =>
    cat.questions.map((q, qIdx) => ({
      ...q,
      category: cat.category,
      index: `${catIdx}-${qIdx}`
    }))
  );

  const filteredQuestions = searchQuery
    ? allQuestions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-emerald-500">Questions</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Find answers to common questions about our Urban Land Management System
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchQuery && filteredQuestions ? (
            // Search Results
            <div>
              <p className="text-gray-400 mb-6">
                Found {filteredQuestions.length} result{filteredQuestions.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
              <div className="space-y-4">
                {filteredQuestions.map((item) => (
                  <div
                    key={item.index}
                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleQuestion(item.index)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800 transition"
                    >
                      <div className="text-left">
                        <span className="text-xs text-emerald-500 font-semibold">{item.category}</span>
                        <h3 className="text-lg font-semibold mt-1">{item.question}</h3>
                      </div>
                      {openIndex === item.index ? (
                        <ChevronUp className="w-5 h-5 text-emerald-500 flex-shrink-0 ml-4" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                      )}
                    </button>
                    {openIndex === item.index && (
                      <div className="px-6 py-4 bg-slate-950 border-t border-slate-800">
                        <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Categories
            <div className="space-y-8">
              {faqCategories.map((category, catIdx) => (
                <div key={catIdx}>
                  <h2 className="text-2xl font-bold mb-4 text-emerald-500">{category.category}</h2>
                  <div className="space-y-4">
                    {category.questions.map((item, qIdx) => {
                      const index = `${catIdx}-${qIdx}`;
                      return (
                        <div
                          key={index}
                          className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition"
                        >
                          <button
                            onClick={() => toggleQuestion(index)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800 transition"
                          >
                            <h3 className="text-lg font-semibold text-left">{item.question}</h3>
                            {openIndex === index ? (
                              <ChevronUp className="w-5 h-5 text-emerald-500 flex-shrink-0 ml-4" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                            )}
                          </button>
                          {openIndex === index && (
                            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800">
                              <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-400 mb-8">
            Can't find the answer you're looking for? Please contact our support team.
          </p>
          <button
            onClick={() => navigate('/#contact')}
            className="px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-semibold"
          >
            Contact Support
          </button>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
