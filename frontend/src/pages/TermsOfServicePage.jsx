import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, FileText, CheckCircle, XCircle, AlertTriangle, Scale } from 'lucide-react';

const TermsOfServicePage = () => {
  const navigate = useNavigate();

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
            <Scale className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of <span className="text-emerald-500">Service</span>
          </h1>
          <p className="text-xl text-gray-400 mb-4">
            Please read these terms carefully before using our services
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
              These Terms of Service ("Terms") govern your access to and use of the Urban Land Management System. By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
            </p>
          </div>

          <div className="space-y-8">
            {/* Section 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold flex-1">1. Acceptance of Terms</h2>
              </div>
              <div className="ml-16 space-y-3 text-gray-300">
                <p>By creating an account and using the Urban Land Management System, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.</p>
                <p>These Terms apply to all users of the system, including citizens, government officers, and administrators.</p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold flex-1">2. Eligibility</h2>
              </div>
              <div className="ml-16 space-y-3 text-gray-300">
                <p>To use our services, you must:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Be at least 18 years of age</li>
                  <li>Have the legal capacity to enter into binding contracts</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Be a citizen or authorized government officer</li>
                  <li>Not be prohibited from using the service under applicable laws</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold flex-1">3. User Responsibilities</h2>
              </div>
              <div className="ml-16 space-y-3 text-gray-300">
                <p>As a user of the system, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Use the system only for lawful purposes</li>
                  <li>Not attempt to interfere with or disrupt the system</li>
                  <li>Not upload malicious code or harmful content</li>
                  <li>Not impersonate another person or entity</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">4. Land Requests and Infrastructure Reports</h2>
              <div className="space-y-3 text-gray-300">
                <p><strong>Land Requests:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All land requests are subject to government approval and verification</li>
                  <li>Submission of false information may result in account suspension and legal action</li>
                  <li>Processing times may vary based on request complexity</li>
                  <li>Approval is not guaranteed and depends on eligibility criteria</li>
                </ul>
                <p className="mt-4"><strong>Infrastructure Reports:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Reports should be accurate and truthful</li>
                  <li>False or malicious reports may result in account termination</li>
                  <li>Response times depend on issue severity and available resources</li>
                </ul>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
              <div className="space-y-3 text-gray-300">
                <p>The Urban Land Management System, including its design, features, and content, is owned by the government and protected by intellectual property laws.</p>
                <p>You may not:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Copy, modify, or distribute any part of the system</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                  <li>Use the system's branding without permission</li>
                  <li>Create derivative works based on the system</li>
                </ul>
              </div>
            </div>

            {/* Section 6 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-red-500/10 p-3 rounded-xl text-red-500">
                  <XCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold flex-1">6. Prohibited Activities</h2>
              </div>
              <div className="ml-16 space-y-3 text-gray-300">
                <p>You are expressly prohibited from:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Using the system for any illegal purpose</li>
                  <li>Submitting fraudulent land requests or reports</li>
                  <li>Harassing or threatening other users or staff</li>
                  <li>Attempting to gain unauthorized access to the system</li>
                  <li>Interfering with system security features</li>
                  <li>Collecting user data without authorization</li>
                  <li>Using automated tools to access the system</li>
                </ul>
              </div>
            </div>

            {/* Section 7 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">7. Account Termination</h2>
              <div className="space-y-3 text-gray-300">
                <p>We reserve the right to suspend or terminate your account if:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You violate these Terms of Service</li>
                  <li>You provide false or misleading information</li>
                  <li>Your account is used for fraudulent activities</li>
                  <li>We are required to do so by law</li>
                </ul>
                <p className="mt-4">You may also request account deletion at any time through your account settings.</p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">8. Disclaimer of Warranties</h2>
              <div className="space-y-3 text-gray-300">
                <p>The system is provided "as is" and "as available" without warranties of any kind, either express or implied.</p>
                <p>We do not guarantee that:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The system will be uninterrupted or error-free</li>
                  <li>All defects will be corrected</li>
                  <li>The system is free from viruses or harmful components</li>
                  <li>Your land request will be approved</li>
                </ul>
              </div>
            </div>

            {/* Section 9 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
              <div className="space-y-3 text-gray-300">
                <p>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your use or inability to use the system</li>
                  <li>Unauthorized access to your account</li>
                  <li>Errors or omissions in the system</li>
                  <li>Delays in processing requests</li>
                </ul>
              </div>
            </div>

            {/* Section 10 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">10. Changes to Terms</h2>
              <div className="space-y-3 text-gray-300">
                <p>We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or a prominent notice on the platform.</p>
                <p>Your continued use of the system after changes are posted constitutes acceptance of the modified Terms.</p>
              </div>
            </div>

            {/* Section 11 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">11. Governing Law</h2>
              <div className="space-y-3 text-gray-300">
                <p>These Terms shall be governed by and construed in accordance with the laws of the Ethiopia, without regard to its conflict of law provisions.</p>
                <p>Any disputes arising from these Terms shall be resolved in the courts of Adiss Ababa, Ethiopia.</p>
              </div>
            </div>

            {/* Section 12 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
              <div className="space-y-3 text-gray-300">
                <p>If you have questions about these Terms, please contact us:</p>
                <ul className="space-y-2 ml-4">
                  <li>• Email: birukb1152@gmail.com</li>
                  <li>• Phone: +251 903 22 44 46</li>
                  <li>• Address: 123 Government Center, Adiss Ababa, Ethiopia</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-8">
            By creating an account, you agree to these Terms of Service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-semibold"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate('/#contact')}
              className="px-8 py-3 border border-slate-700 text-white rounded-lg hover:bg-slate-800 transition font-semibold"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfServicePage;
