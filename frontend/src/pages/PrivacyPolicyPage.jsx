import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: '1. Information We Collect',
      content: [
        'We collect information that you provide directly to us when you register for an account, submit land requests, or report infrastructure issues. This includes:',
        '• Personal identification information (name, national ID, email address, phone number)',
        '• Address and location information',
        '• Documents uploaded for land requests',
        '• Photos and descriptions of infrastructure issues',
        '• Communication records with our support team'
      ]
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: '2. How We Use Your Information',
      content: [
        'We use the information we collect to:',
        '• Process and manage your land requests and infrastructure reports',
        '• Communicate with you about your requests and system updates',
        '• Verify your identity and prevent fraud',
        '• Improve our services and user experience',
        '• Comply with legal obligations and government regulations',
        '• Generate anonymous statistics for system improvement'
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: '3. Data Security',
      content: [
        'We implement robust security measures to protect your personal information:',
        '• All data is encrypted in transit and at rest using industry-standard encryption',
        '• Access to personal information is restricted to authorized personnel only',
        '• Regular security audits and vulnerability assessments',
        '• Secure backup systems to prevent data loss',
        '• Multi-factor authentication for government officers',
        'However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.'
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: '4. Information Sharing',
      content: [
        'We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:',
        '• With government agencies as required for processing land requests',
        '• With authorized municipal officers for reviewing and approving requests',
        '• When required by law or legal process',
        '• To protect the rights, property, or safety of our users or the public',
        '• With your explicit consent'
      ]
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: '5. Your Rights',
      content: [
        'You have the following rights regarding your personal information:',
        '• Access: You can view and download your personal data at any time',
        '• Correction: You can update or correct your information through your profile settings',
        '• Deletion: You can request deletion of your account and associated data',
        '• Objection: You can object to certain processing of your data',
        '• Data Portability: You can request a copy of your data in a portable format',
        'To exercise these rights, please contact us at birukb1152@gmail.com'
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '6. Data Retention',
      content: [
        'We retain your personal information for as long as necessary to:',
        '• Provide our services to you',
        '• Comply with legal obligations (e.g., tax and accounting requirements)',
        '• Resolve disputes and enforce our agreements',
        'Land request records are retained for 10 years as required by law. Infrastructure reports are retained for 5 years. You can request deletion of your account, but some information may be retained as required by law.'
      ]
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: '7. Cookies and Tracking',
      content: [
        'We use cookies and similar tracking technologies to:',
        '• Keep you logged in to your account',
        '• Remember your preferences',
        '• Analyze how our system is used',
        '• Improve system performance',
        'You can control cookies through your browser settings. However, disabling cookies may affect the functionality of the system.'
      ]
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
            <Shield className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy <span className="text-emerald-500">Policy</span>
          </h1>
          <p className="text-xl text-gray-400 mb-4">
            Your privacy is important to us
          </p>
          <p className="text-sm text-gray-500">
            Last updated: May 7, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">
            <p className="text-gray-300 leading-relaxed">
              This Privacy Policy describes how the Urban Land Management System ("we", "us", or "our") collects, uses, and protects your personal information when you use our platform. By using our services, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-emerald-500/50 transition">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold flex-1">{section.title}</h2>
                </div>
                <div className="ml-16 space-y-3">
                  {section.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-gray-300 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Sections */}
          <div className="mt-8 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Significant changes will be communicated via email or a prominent notice on our platform.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-300">
                <p>• Email: birukb1152@gmail.com</p>
                <p>• Phone: +251 903 22 44 46</p>
                <p>• Address: 123 Government Center, Adiss Ababa, Ethiopia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions about your privacy?</h2>
          <p className="text-gray-400 mb-8">
            Our team is here to help you understand how we protect your data.
          </p>
          <button
            onClick={() => navigate('/#contact')}
            className="px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-semibold"
          >
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
