import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Building2, Eye, EyeOff, LogIn, ArrowLeft, Mail, Lock, CheckCircle, Users, FileText, BarChart3 } from 'lucide-react'

export default function LoginPage() {
  const { login, darkMode } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.success) navigate('/dashboard')
    else setError(result.error)
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      darkMode ? 'bg-slate-950 text-white' : 'bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-gray-900'
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className={`absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse ${
          darkMode ? 'bg-emerald-500/10' : 'bg-emerald-500/20'
        }`} />
        <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
          darkMode ? 'bg-cyan-500/10' : 'bg-cyan-500/20'
        }`} style={{ animationDelay: '1s' }} />
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl ${
          darkMode ? 'bg-emerald-500/5' : 'bg-emerald-500/10'
        }`} />
      </div>

      {/* Grid Pattern */}
      <div className={`absolute inset-0 ${darkMode ? 'opacity-[0.03]' : 'opacity-[0.05]'}`}>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgb(16 185 129) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(16 185 129) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Panel - Hero Section */}
        <div className={`hidden lg:flex lg:w-1/2 xl:w-2/5 backdrop-blur-sm border-r flex-col justify-between p-12 ${
          darkMode 
            ? 'bg-slate-900/50 border-slate-800' 
            : 'bg-white/50 border-gray-200'
        }`}>
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              darkMode
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30'
                : 'bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-emerald-600/30'
            }`}>
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>URBAN LAND</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>MANAGEMENT SYSTEM</div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="space-y-8">
            <div>
              <h1 className={`text-5xl font-bold leading-tight mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Manage Land &<br />
                Infrastructure<br />
                <span className={darkMode ? 'text-emerald-500' : 'text-emerald-600'}>Efficiently</span>
              </h1>
              <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                A modern government platform for land allocation, property registration, and infrastructure issue reporting.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {[
                { icon: <CheckCircle className="w-5 h-5" />, text: 'Digital land request processing' },
                { icon: <CheckCircle className="w-5 h-5" />, text: 'Real-time status tracking' },
                { icon: <CheckCircle className="w-5 h-5" />, text: 'Secure document management' },
                { icon: <CheckCircle className="w-5 h-5" />, text: 'Infrastructure reporting system' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <div className={darkMode ? 'text-emerald-500' : 'text-emerald-600'}>{item.icon}</div>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Users className="w-5 h-5" />, value: '10K+', label: 'Active Users' },
              { icon: <FileText className="w-5 h-5" />, value: '5K+', label: 'Land Requests' },
              { icon: <BarChart3 className="w-5 h-5" />, value: '15K+', label: 'Reports Filed' },
              { icon: <CheckCircle className="w-5 h-5" />, value: '98%', label: 'Satisfaction' }
            ].map((stat, idx) => (
              <div key={idx} className={`backdrop-blur-sm border rounded-2xl p-4 transition ${
                darkMode
                  ? 'bg-slate-800/50 border-slate-700 hover:border-emerald-500/50'
                  : 'bg-white/60 border-gray-200 hover:border-emerald-500 shadow-lg'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <div className={darkMode ? 'text-emerald-500' : 'text-emerald-600'}>{stat.icon}</div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-emerald-500' : 'text-emerald-600'}`}>{stat.value}</p>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <Link 
              to="/" 
              className={`inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition ${
                darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            {/* Mobile Logo */}
            <div className="flex items-center space-x-3 mb-8 lg:hidden">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                darkMode
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30'
                  : 'bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-emerald-600/30'
              }`}>
                <Building2 size={24} className="text-white" />
              </div>
              <div>
                <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>URBAN LAND</div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>MANAGEMENT SYSTEM</div>
              </div>
            </div>

            {/* Form Card */}
            <div className={`backdrop-blur-xl border rounded-3xl p-8 shadow-2xl ${
              darkMode
                ? 'bg-slate-900/50 border-slate-800'
                : 'bg-white/80 border-gray-200'
            }`}>
              {/* Header */}
              <div className="mb-8">
                <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Welcome back</h2>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Sign in to your account to continue</p>
              </div>

              {/* Quick Login Demo */}
              <div className={`border rounded-2xl p-4 mb-6 ${
                darkMode
                  ? 'bg-slate-800/50 border-slate-700'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Quick Demo Login
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setForm({ email: 'biruk.officer@gov.et', password: 'birukb0322' })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition group"
                  >
                    <span className="text-lg">🏛</span>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-sm">Municipality Officer</p>
                      <p className="text-xs opacity-70">biruk.officer@gov.et</p>
                    </div>
                    <span className="text-xs opacity-50 group-hover:opacity-100 transition">birukb0322</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ email: 'abebe@example.com', password: 'citizen123' })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition group"
                  >
                    <span className="text-lg">👤</span>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-sm">Citizen</p>
                      <p className="text-xs opacity-70">abebe@example.com</p>
                    </div>
                    <span className="text-xs opacity-50 group-hover:opacity-100 transition">citizen123</span>
                  </button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Email Address</label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input 
                      type="email" 
                      value={form.email} 
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com" 
                      required 
                      className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition ${
                        darkMode
                          ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:ring-emerald-600/20'
                      }`}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Password</label>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <input 
                      type={showPw ? 'text' : 'password'} 
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••" 
                      required 
                      className={`w-full pl-12 pr-12 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition ${
                        darkMode
                          ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:ring-emerald-600/20'
                      }`}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPw(!showPw)}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition ${
                        darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2.5 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="peer sr-only" 
                      />
                      <div className={`w-5 h-5 rounded-md border-2 transition-all duration-300 peer-focus:ring-2 group-hover:border-emerald-500/50 peer-checked:scale-110 peer-checked:shadow-lg ${
                        darkMode
                          ? 'border-slate-700 bg-slate-800 peer-checked:bg-gradient-to-br peer-checked:from-emerald-500 peer-checked:to-emerald-600 peer-checked:border-emerald-500 peer-focus:ring-emerald-500/20 peer-checked:shadow-emerald-500/50'
                          : 'border-gray-300 bg-gray-50 peer-checked:bg-gradient-to-br peer-checked:from-emerald-600 peer-checked:to-emerald-700 peer-checked:border-emerald-600 peer-focus:ring-emerald-600/20 peer-checked:shadow-emerald-600/50'
                      }`}>
                        {/* Nike Swoosh Style Checkmark */}
                        <svg 
                          className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 transition-all duration-500 scale-50 peer-checked:scale-100 pointer-events-none" 
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path 
                            d="M3 12.5L8.5 18L21 5.5" 
                            strokeWidth="3.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="animate-draw"
                          />
                        </svg>
                      </div>
                    </div>
                    <span className={`transition select-none ${
                      darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-900'
                    }`}>Remember me</span>
                  </label>
                  <button type="button" className={`transition ${
                    darkMode ? 'text-emerald-500 hover:text-emerald-400' : 'text-emerald-600 hover:text-emerald-700'
                  }`}>
                    Forgot password?
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl flex items-start space-x-2">
                    <span className="text-lg">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-4 text-white font-semibold rounded-xl transition active:scale-95 disabled:opacity-60 shadow-lg ${
                    darkMode
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/30'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-600/30'
                  }`}
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn size={20} />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>

              {/* Register Link */}
              <p className={`text-center text-sm mt-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Don't have an account?{' '}
                <Link to="/register" className={`font-semibold transition ${
                  darkMode ? 'text-emerald-500 hover:text-emerald-400' : 'text-emerald-600 hover:text-emerald-700'
                }`}>
                  Create account
                </Link>
              </p>
            </div>

            {/* Trust Badges */}
            <div className={`mt-8 flex items-center justify-center space-x-6 text-xs ${
              darkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>
              <div className="flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Secure Login</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Government Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
