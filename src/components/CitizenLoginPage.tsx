'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Recycle,
  Lock,
  Phone,
  Mail,
  User,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Leaf,
  Check,
} from 'lucide-react';
import { CitizenUser } from '@/types/waste';
import { saveStoredCitizenUser } from '@/lib/storage';
import { PUNE_ZONES } from '@/constants/wasteCategories';

interface CitizenLoginPageProps {
  onSuccess: (user: CitizenUser) => void;
  onBackToHome?: () => void;
  initialMode?: 'signin' | 'register';
  title?: string;
  subtitle?: string;
}

export const DEMO_CITIZEN_USER: CitizenUser = {
  id: 'CIT-9822',
  name: 'Dhananjay Shinde',
  phone: '+91 98223 91023',
  email: 'dhananjay.shinde@flora.ac.in',
  area: 'Flora Institute of Technology Campus',
  ecoPoints: 1450,
};

export const CitizenLoginPage: React.FC<CitizenLoginPageProps> = ({
  onSuccess,
  onBackToHome,
  initialMode = 'signin',
  title = 'Citizen Sign In',
  subtitle = 'Sign in to schedule waste collections, track collectors live, and earn verified green rewards.',
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');

  // Sign-in fields
  const [loginIdentifier, setLoginIdentifier] = useState('+91 98223 91023');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regArea, setRegArea] = useState(PUNE_ZONES[0] || 'Kothrud & Karve Nagar');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedDemo, setCopiedDemo] = useState(false);

  // Fast 1-click Demo Login
  const handleQuickDemoLogin = () => {
    setLoading(true);
    setError('');
    setCopiedDemo(true);

    setTimeout(() => {
      saveStoredCitizenUser(DEMO_CITIZEN_USER);
      setLoading(false);
      onSuccess(DEMO_CITIZEN_USER);
    }, 400);
  };

  // Sign In Submit
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginIdentifier.trim()) {
      setError('Please enter your mobile number or email address');
      return;
    }

    if (authMethod === 'otp') {
      if (!otpSent) {
        setOtpSent(true);
        setOtpCode('123456'); // auto-fill demo OTP for painless UX
        return;
      }
      if (!otpCode || otpCode.trim().length < 4) {
        setError('Please enter the 6-digit OTP sent to your phone');
        return;
      }
    } else {
      if (!password || password.trim().length < 4) {
        setError('Please enter your password (min 4 characters)');
        return;
      }
    }

    setLoading(true);

    setTimeout(() => {
      // Create user session
      const user: CitizenUser = {
        id: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: loginIdentifier.includes('@')
          ? loginIdentifier.split('@')[0].replace(/[._]/g, ' ')
          : 'Dhananjay Shinde',
        phone: loginIdentifier.startsWith('+91') ? loginIdentifier : `+91 ${loginIdentifier}`,
        email: loginIdentifier.includes('@') ? loginIdentifier : 'citizen@ecoloop.org',
        area: 'Pune Central',
        ecoPoints: 350,
      };

      saveStoredCitizenUser(user);
      setLoading(false);
      onSuccess(user);
    }, 500);
  };

  // Register Submit
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!regName.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!regPhone.trim() || regPhone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newUser: CitizenUser = {
        id: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: regName.trim(),
        phone: regPhone.startsWith('+91') ? regPhone.trim() : `+91 ${regPhone.trim()}`,
        email: regEmail.trim() || `${regName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        area: regArea,
        ecoPoints: 50, // Welcome gift points
      };

      saveStoredCitizenUser(newUser);
      setLoading(false);
      onSuccess(newUser);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-emerald-50/70 via-slate-50 to-white text-gray-900 px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Top Bar */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
        {onBackToHome ? (
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-700 bg-white/80 hover:bg-white px-3.5 py-2 rounded-xl border border-gray-200/80 shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
        ) : (
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-700 bg-white/80 hover:bg-white px-3.5 py-2 rounded-xl border border-gray-200/80 shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        )}

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-xs">
            <Recycle className="h-4 w-4 text-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-gray-900">
            Eco<span className="text-emerald-600">Loop</span>
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
            Citizen Portal
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto my-8">
        
        {/* Quick Demo Pill Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-600/20 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-amber-200 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Fast 1-Click Evaluation</p>
              <p className="text-[11px] text-emerald-100">Sign in instantly as Dhananjay Shinde</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
          >
            {copiedDemo ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>1-Click Demo Login</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </motion.div>

        <div className="bg-white rounded-3xl border border-gray-100/90 shadow-xl shadow-gray-200/50 p-6 sm:p-8">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-3 text-emerald-600">
              <User className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {mode === 'signin' ? title : 'Create Citizen Account'}
            </h1>
            <p className="mt-1.5 text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              {mode === 'signin' ? subtitle : 'Join thousands of Pune citizens recycling responsibly and earning EcoPoints.'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Register (+50 Pts)
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              
              {/* Identifier */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="+91 98223 91023 or user@gmail.com"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium text-gray-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Auth Method Selector */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-500 font-medium">Verify via:</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('otp'); setError(''); }}
                    className={`font-semibold cursor-pointer ${authMethod === 'otp' ? 'text-emerald-600 underline' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    SMS OTP
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('password'); setError(''); }}
                    className={`font-semibold cursor-pointer ${authMethod === 'password' ? 'text-emerald-600 underline' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Password
                  </button>
                </div>
              </div>

              {/* Method 1: OTP */}
              {authMethod === 'otp' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      6-Digit OTP Code
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(true);
                        setOtpCode('123456');
                      }}
                      className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                    >
                      {otpSent ? 'Resend (Demo: 123456)' : 'Send Demo OTP'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 123456"
                      className="w-full px-4 py-3 pl-10 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold tracking-widest text-gray-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                    <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">
                    💡 For this demo, OTP is auto-set to <span className="font-bold text-emerald-600">123456</span>.
                  </p>
                </div>
              )}

              {/* Method 2: Password */}
              {authMethod === 'password' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 pl-10 pr-10 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium text-gray-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In & Request Pickup</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium text-gray-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Mobile Number (WhatsApp Enabled)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium text-gray-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Pune Area / Ward
                </label>
                <div className="relative">
                  <select
                    value={regArea}
                    onChange={(e) => setRegArea(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium text-gray-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all cursor-pointer"
                  >
                    {PUNE_ZONES.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Bonus badge */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-800">
                <Leaf className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>+50 EcoPoints</strong> will be credited to your account upon signing up!
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account & Book Pickup</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

            </form>
          )}

          {/* Civic Trust Badge */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Pune Smart Civic Waste · Verified & Encrypted</span>
          </div>

        </div>
      </div>

      {/* Footer link to municipal admin */}
      <div className="text-center text-xs text-gray-400">
        <span>Are you a municipal or fleet administrator? </span>
        <a href="/admin" className="font-semibold text-slate-700 hover:text-indigo-600 underline">
          Admin Console (/admin)
        </a>
      </div>

    </div>
  );
};
