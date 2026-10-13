import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { 
  Building2, 
  Eye, 
  EyeOff, 
  UserPlus, 
  ArrowLeft, 
  User, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin, 
  Lock,
  CheckCircle,
  Shield,
  Zap,
  Users
} from 'lucide-react'

const INIT = {
  fullName: '', nationalId: '', phoneNumber: '',
  email: '', address: '', password: '', confirmPassword: '',
  acceptedTerms: false,
}

export default function RegisterPage() {
  const { register, darkMode } = useApp()
  const navigate = useNavigate()
  const [form, setForm]           = useState(INIT)
  const [showPw, setShowPw]       = useState(false)
  const [errors, setErrors]       = useState({})
  const [serverErr, setServerErr] = useState('')
  const [loading, setLoading]     = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleNationalId = (e) => {
    set('nationalId', e.target.value.replace(/\D/g, ''))
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim())                 e.fullName        = 'Full name is required'
    if (!/^\d{8,12}$/.test(form.nationalId))   e.nationalId      = 'National ID must be 8–12 digits'
    if (!/^\d{10}$/.test(form.phoneNumber))    e.phoneNumber     = 'Enter a valid 10-digit phone number'
    if (!/\S+@\S+\.\S+/.test(form.email))      e.email           = 'Enter a valid email'
    if (!form.address.trim())                  e.address         = 'Address is required'
    if (form.password.length < 6)              e.password        = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!form.acceptedTerms)                   e.acceptedTerms   = 'You must accept the Terms of Service and Privacy Policy'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerErr('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    const result = await register({
      fullName:    form.fullName,
      nationalId:  form.nationalId,
      phoneNumber: form.phoneNumber,
      email:       form.email,
      address:     form.address,
      password:    form.password,
    })
    setLoading(false)
    if (result.success) navigate('/dashboard')
    else setServerErr(result.error)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Left Panel - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-between">
        <div className="relative z-10">
          {/* Back to Home */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-12"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          {/* Logo */}
          <div className="flex items-center space-x-3 mb-12">
            <Building2 className="w-10 h-10 text-emerald-500" />
            <div>
              <div className="text-xl font-bold">URBAN LAND</div>
              <div className="text-xs text-gray-400 -mt-1">MANAGEMENT SYSTEM</div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Join Our<br />
              <span className="text-emerald-500">Smart City</span> Platform
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Register now to access digital land services, submit infrastructure reports, and track your requests in real-time.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-12">
            {[
              { icon: <Shield className="w-5 h-5" />, title: 'Secure & Private', desc: 'Your data is encrypted and protected' },
              { icon: <Zap className="w-5 h-5" />, title: 'Fast Processing', desc: 'Quick approval and response times' },
              { icon: <Users className="w-5 h-5" />, title: 'Trusted by 10K+', desc: 'Join thousands of satisfied citizens' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <div className="font-semibold text-sm">{feature.title}</div>
                  <div className="text-gray-400 text-xs">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-6">
          {[
            { number: '10K+', label: 'Active Users' },
            { number: '5K+', label: 'Land Requests' },
            { number: '98%', label: 'Satisfaction' }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl font-bold text-emerald-500">{stat.number}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Back Button */}
          <Link 
            to="/" 
            className="lg:hidden inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          {/* Form Card */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 mb-4">
                <UserPlus size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Create Account</h2>
              <p className="text-gray-400 text-sm">
                Join our platform to access all services
              </p>
              <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <CheckCircle size={14} className="text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-400">Citizen Account</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={e => set('fullName', e.target.value)}
                    placeholder="Abebe Kebede"
                    autoComplete="name"
                    className={`w-full pl-11 pr-4 py-3 bg-slate-950 border rounded-xl outline-none transition text-sm ${
                      errors.fullName 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-700 focus:border-emerald-500'
                    } focus:ring-2 focus:ring-emerald-500/20`}
                  />
                </div>
                {errors.fullName && <p className="text-red-400 text-xs mt-1.5">{errors.fullName}</p>}
              </div>

              {/* National ID */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  National ID <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    value={form.nationalId}
                    onChange={handleNationalId}
                    placeholder="123456789"
                    maxLength={12}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-950 border rounded-xl outline-none transition text-sm ${
                      errors.nationalId 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-700 focus:border-emerald-500'
                    } focus:ring-2 focus:ring-emerald-500/20`}
                  />
                </div>
                {errors.nationalId 
                  ? <p className="text-red-400 text-xs mt-1.5">{errors.nationalId}</p>
                  : <p className="text-gray-500 text-xs mt-1.5">8-12 digits</p>
                }
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="tel"
                    value={form.phoneNumber}
                    onChange={e => set('phoneNumber', e.target.value)}
                    placeholder="0911000000"
                    autoComplete="tel"
                    className={`w-full pl-11 pr-4 py-3 bg-slate-950 border rounded-xl outline-none transition text-sm ${
                      errors.phoneNumber 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-700 focus:border-emerald-500'
                    } focus:ring-2 focus:ring-emerald-500/20`}
                  />
                </div>
                {errors.phoneNumber && <p className="text-red-400 text-xs mt-1.5">{errors.phoneNumber}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full pl-11 pr-4 py-3 bg-slate-950 border rounded-xl outline-none transition text-sm ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-700 focus:border-emerald-500'
                    } focus:ring-2 focus:ring-emerald-500/20`}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => set('address', e.target.value)}
                    placeholder="Sub-city, City"
                    autoComplete="street-address"
                    className={`w-full pl-11 pr-4 py-3 bg-slate-950 border rounded-xl outline-none transition text-sm ${
                      errors.address 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-700 focus:border-emerald-500'
                    } focus:ring-2 focus:ring-emerald-500/20`}
                  />
                </div>
                {errors.address && <p className="text-red-400 text-xs mt-1.5">{errors.address}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="Min. 6 characters"
                    autoComplete="new-password"
                    className={`w-full pl-11 pr-11 py-3 bg-slate-950 border rounded-xl outline-none transition text-sm ${
                      errors.password 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-700 focus:border-emerald-500'
                    } focus:ring-2 focus:ring-emerald-500/20`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={e => set('confirmPassword', e.target.value)}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    className={`w-full pl-11 pr-4 py-3 bg-slate-950 border rounded-xl outline-none transition text-sm ${
                      errors.confirmPassword 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-700 focus:border-emerald-500'
                    } focus:ring-2 focus:ring-emerald-500/20`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword}</p>}
              </div>

              </div>

              {/* Terms and Privacy Policy Acceptance */}
              <div className="pt-2">
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={form.acceptedTerms}
                      onChange={(e) => set('acceptedTerms', e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-6 h-6 rounded-lg border-2 border-slate-700 bg-slate-950 peer-checked:bg-gradient-to-br peer-checked:from-emerald-500 peer-checked:to-emerald-600 peer-checked:border-emerald-500 transition-all duration-300 peer-focus:ring-2 peer-focus:ring-emerald-500/20 group-hover:border-emerald-500/50 peer-checked:scale-110 peer-checked:shadow-lg peer-checked:shadow-emerald-500/50 peer-checked:rotate-[5deg]">
                      {/* Nike Swoosh Style Checkmark */}
                      <svg 
                        className="absolute inset-0 w-6 h-6 text-white opacity-0 peer-checked:opacity-100 transition-all duration-500 scale-50 peer-checked:scale-100 -rotate-[5deg] peer-checked:rotate-0 pointer-events-none" 
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path 
                          d="M3 12.5L8.5 18L21 5.5" 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          style={{
                            strokeDasharray: '30',
                            strokeDashoffset: '30',
                            animation: 'drawCheck 0.5s ease-out forwards'
                          }}
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-gray-300 group-hover:text-white transition select-none">
                      I accept the{' '}
                      <Link 
                        to="/terms-of-service" 
                        target="_blank"
                        className="text-emerald-500 hover:text-emerald-400 underline decoration-emerald-500/30 hover:decoration-emerald-400 underline-offset-2 font-medium transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link 
                        to="/privacy-policy" 
                        target="_blank"
                        className="text-emerald-500 hover:text-emerald-400 underline decoration-emerald-500/30 hover:decoration-emerald-400 underline-offset-2 font-medium transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Privacy Policy
                      </Link>
                      <span className="text-red-400 ml-1">*</span>
                    </span>
                    {errors.acceptedTerms && (
                      <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5 animate-shake">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                        {errors.acceptedTerms}
                      </p>
                    )}
                  </div>
                </label>
              </div>

              {serverErr && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                  {serverErr}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !form.acceptedTerms}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 mt-2"
              >
                {loading
                  ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><UserPlus size={18} /> Create Account</>
                }
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-emerald-500 font-semibold hover:text-emerald-400 transition">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Shield size={14} className="text-emerald-500" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock size={14} className="text-emerald-500" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
