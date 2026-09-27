'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Phone,
  Mail,
  User,
  MapPin,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Truck,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { CitizenUser, CollectorDriver } from '@/types/waste';
import { getStoredCitizenUser, saveStoredCitizenUser, DEMO_DRIVER, saveStoredActiveDriver } from '@/lib/storage';
import { PUNE_ZONES } from '@/constants/wasteCategories';
import { AuthIllustration } from '@/components/AuthIllustration';

interface CitizenLoginPageProps {
  onSuccess: (user: CitizenUser) => void;
  onSuccessDriver?: (driver: CollectorDriver) => void;
  onSuccessAdmin?: () => void;
  onBackToHome?: () => void;
  onTrackPickup?: () => void;
  initialMode?: 'signin' | 'register';
  initialRole?: 'citizen' | 'driver' | 'admin';
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
  onSuccessDriver,
  onSuccessAdmin,
  onBackToHome,
  onTrackPickup,
  initialMode = 'signin',
  initialRole = 'citizen',
  title = 'Login to EcoLoop',
}) => {
  const [role, setRole] = useState<'citizen' | 'driver' | 'admin'>(initialRole);
  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);
  
  // Citizen state
  const [identifier, setIdentifier] = useState('+91 98223 91023');
  const [password, setPassword] = useState('pune@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Driver state
  const [driverIdentifier, setDriverIdentifier] = useState('+91 98231 44521');
  const [driverPin, setDriverPin] = useState('driver@2026');

  // Admin state
  const [adminEmail, setAdminEmail] = useState('admin@gmail.com');
  const [adminPassword, setAdminPassword] = useState('admin@123');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regArea, setRegArea] = useState(PUNE_ZONES[0] || 'Flora Institute of Technology Campus');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fast 1-click Demo Login for Citizen
  const handleQuickDemoLogin = () => {
    setIdentifier('+91 98223 91023');
    setPassword('pune@2026');
    setLoading(true);
    setError('');

    setTimeout(() => {
      saveStoredCitizenUser(DEMO_CITIZEN_USER);
      setLoading(false);
      onSuccess(DEMO_CITIZEN_USER);
    }, 350);
  };

  // Fast 1-click Demo Login for Driver
  const handleQuickDriverDemoLogin = () => {
    setDriverIdentifier('+91 98231 44521');
    setDriverPin('driver@2026');
    setLoading(true);
    setError('');

    setTimeout(() => {
      saveStoredActiveDriver(DEMO_DRIVER);
      setLoading(false);
      if (onSuccessDriver) {
        onSuccessDriver(DEMO_DRIVER);
      }
    }, 350);
  };

  // Fast 1-click Demo Login for Admin
  const handleQuickAdminDemoLogin = () => {
    setAdminEmail('admin@gmail.com');
    setAdminPassword('admin@123');
    setLoading(true);
    setError('');

    setTimeout(() => {
      sessionStorage.setItem('ecoloop_admin_session', 'authenticated');
      setLoading(false);
      if (onSuccessAdmin) {
        onSuccessAdmin();
      } else {
        window.location.href = '/admin';
      }
    }, 350);
  };

  // Admin Sign In Submit
  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (adminEmail.trim().toLowerCase() === 'admin@gmail.com' && adminPassword === 'admin@123') {
      setLoading(true);
      setTimeout(() => {
        sessionStorage.setItem('ecoloop_admin_session', 'authenticated');
        setLoading(false);
        if (onSuccessAdmin) {
          onSuccessAdmin();
        } else {
          window.location.href = '/admin';
        }
      }, 400);
    } else {
      setError('Invalid credentials. Please use seed credentials: admin@gmail.com / admin@123');
    }
  };

  // Driver Sign In Submit
  const handleDriverSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!driverIdentifier.trim() || !driverPin.trim()) {
      setError('Please enter your driver mobile number/ID and security PIN');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      saveStoredActiveDriver(DEMO_DRIVER);
      setLoading(false);
      if (onSuccessDriver) {
        onSuccessDriver(DEMO_DRIVER);
      }
    }, 350);
  };

  // Citizen Sign In Submit
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your email or phone number');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const existingUser = getStoredCitizenUser();
      const isDemo = identifier === '+91 98223 91023' || identifier === 'citizen@punerecycles.org';
      const userPoints = isDemo
        ? 1450
        : (existingUser && (existingUser.phone === identifier || existingUser.email === identifier))
        ? existingUser.ecoPoints
        : 0;

      const user: CitizenUser = {
        id: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: identifier.includes('@') ? identifier.split('@')[0] : 'Pune Citizen',
        phone: identifier.includes('@') ? '+91 98223 91023' : identifier,
        email: identifier.includes('@') ? identifier : 'citizen@punerecycles.org',
        area: 'Flora Institute of Technology Campus',
        ecoPoints: userPoints,
      };

      saveStoredCitizenUser(user);
      setLoading(false);
      onSuccess(user);
    }, 400);
  };

  // Register Submit
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!regName.trim() || !regPhone.trim()) {
      setError('Please fill in your name and phone number');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // New user signup starts with exactly 0 points
      const newUser: CitizenUser = {
        id: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: regName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim() || undefined,
        area: regArea,
        ecoPoints: 0,
      };

      saveStoredCitizenUser(newUser);
      setLoading(false);
      onSuccess(newUser);
    }, 500);
  };

  return (
    <div className="h-screen max-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden select-none font-sans antialiased">
      
      {/* LEFT COLUMN: HERO ILLUSTRATION (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[52%] h-full max-h-screen border-r border-slate-100 overflow-hidden">
        <AuthIllustration
          headline="EcoLoop Pune Waste & Recycling Operations"
          subheadline="Track collectors in real time, order doorstep pickups, and earn verified EcoPoints."
          onLogoClick={onBackToHome}
        />
      </div>

      {/* RIGHT COLUMN: LOGIN FORM AREA */}
      <div className="w-full lg:w-1/2 xl:w-[48%] h-full max-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto lg:overflow-hidden">
        
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between gap-3 w-full pb-2 sm:pb-3 shrink-0">
          {/* Mobile Logo display */}
          <div
            className="flex items-center gap-2 cursor-pointer lg:hidden"
            onClick={onBackToHome}
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
              EL
            </div>
            <span className="font-extrabold text-slate-900 text-base sm:text-lg">Eco<span className="text-teal-600">Loop</span></span>
          </div>

          <div className="hidden lg:block" />

          {/* Top-Right Secondary Action (Track Pickup Button as seen in Shipmozo) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onTrackPickup) {
                  onTrackPickup();
                } else {
                  handleQuickDemoLogin();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Track Pickup</span>
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              title="Municipal Admin Portal"
            >
              <span>Admin</span>
            </Link>
          </div>
        </div>

        {/* Center Card Content */}
        <div className="w-full max-w-[390px] mx-auto my-auto py-1">
          
          {/* Role Switcher: Citizen vs Driver vs Admin */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-3 border border-slate-200/90">
            <button
              type="button"
              onClick={() => { setRole('citizen'); setError(''); }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                role === 'citizen'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="h-3.5 w-3.5 text-teal-600" />
              <span>Citizen</span>
            </button>
            <button
              type="button"
              onClick={() => { setRole('driver'); setError(''); }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                role === 'driver'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Truck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Driver</span>
            </button>
            <button
              type="button"
              onClick={() => { setRole('admin'); setError(''); }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
              <span>Admin</span>
            </button>
          </div>

          {role === 'admin' ? (
            /* ================= ADMIN LOGIN FORM ================= */
            <div>
              <div className="mb-2.5 sm:mb-3">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Login to EcoLoop Admin
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Authorized access for Pune Municipal Corporation officers & supervisors.
                </p>
              </div>

              {/* Decent and Simple Quick Fill for Admin */}
              <div className="mb-3 px-3 py-1.5 rounded-lg bg-slate-50/90 border border-slate-200/80 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span className="text-slate-600 truncate text-[11px]">
                    Demo Admin: <span className="font-mono font-medium text-slate-800">admin@gmail.com</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickAdminDemoLogin}
                  className="text-[11px] font-semibold text-[#0284c7] hover:text-[#0369a1] hover:underline cursor-pointer shrink-0 transition-colors"
                >
                  Quick Fill →
                </button>
              </div>

              {/* Error notice */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Admin Form */}
              <form onSubmit={handleAdminSignIn} className="space-y-2.5 sm:space-y-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                    Official Admin Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="h-3.5 w-3.5" />
                    </div>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@gmail.com"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-[#0284c7] transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                    Security Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="h-3.5 w-3.5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter administrator password"
                      required
                      className="w-full pl-9 pr-10 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-[#0284c7] transition-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] sm:text-xs pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      key="admin-remember"
                      type="checkbox"
                      checked={!!rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#0284c7] border-slate-300 focus:ring-[#0284c7] cursor-pointer"
                    />
                    <span className="text-slate-600 font-medium">Remember admin</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleQuickAdminDemoLogin}
                    className="font-medium text-[#0284c7] hover:underline cursor-pointer"
                  >
                    Use Demo Admin
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1 py-2.5 rounded-lg bg-[#007ba7] hover:bg-[#006a90] text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.99] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Admin Credentials…</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Log In to Operations Console</span>
                    </>
                  )}
                </button>

                {/* Login with Google Workspace */}
                <button
                  type="button"
                  onClick={handleQuickAdminDemoLogin}
                  className="w-full py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-[11px] sm:text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Google Workspace</span>
                </button>
              </form>
            </div>
          ) : role === 'driver' ? (
            /* ================= DRIVER / DELIVERY BOY FORM ================= */
            <div>
              <div className="mb-2.5 sm:mb-3">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Delivery Partner Login
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Receive doorstep pickups, navigate routes & log weighed collections.
                </p>
              </div>

              {/* Decent and Simple Quick Fill for Driver */}
              <div className="mb-3 px-3 py-1.5 rounded-lg bg-slate-50/90 border border-slate-200/80 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-600 truncate text-[11px]">
                    Demo Driver: <span className="font-semibold text-slate-800">Ramesh Patil (DRV-101 • EV Van)</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDriverDemoLogin}
                  className="text-[11px] font-semibold text-[#0284c7] hover:text-[#0369a1] hover:underline cursor-pointer shrink-0 transition-colors"
                >
                  Quick Fill →
                </button>
              </div>

              {/* Error notice */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Driver Form */}
              <form onSubmit={handleDriverSignIn} className="space-y-2.5 sm:space-y-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                    Driver Mobile Number or ID
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone className="h-3.5 w-3.5" />
                    </div>
                    <input
                      type="text"
                      value={driverIdentifier}
                      onChange={(e) => setDriverIdentifier(e.target.value)}
                      placeholder="+91 98231 44521 or DRV-101"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-[#0284c7] transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                    Security PIN / Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="h-3.5 w-3.5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={driverPin}
                      onChange={(e) => setDriverPin(e.target.value)}
                      placeholder="Enter security PIN"
                      required
                      className="w-full pl-9 pr-10 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-[#0284c7] transition-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] sm:text-xs pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      key="driver-remember"
                      type="checkbox"
                      checked={!!rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#0284c7] border-slate-300 focus:ring-[#0284c7] cursor-pointer"
                    />
                    <span className="text-slate-600 font-medium">Keep driver logged in</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleQuickDriverDemoLogin}
                    className="font-medium text-[#0284c7] hover:underline cursor-pointer"
                  >
                    Use Demo Driver
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.99] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Accessing Driver Console…</span>
                    </>
                  ) : (
                    <>
                      <Truck className="h-3.5 w-3.5" />
                      <span>Log In to Driver Console</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ================= CITIZEN / CUSTOMER FORM ================= */
            <div>
              <div className="mb-2.5 sm:mb-3">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {mode === 'signin' ? title : 'Create an Account'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {mode === 'signin' ? (
                    <>
                      OR Simply want to track your pickup?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          if (onTrackPickup) onTrackPickup();
                          else handleQuickDemoLogin();
                        }}
                        className="font-medium text-[#0284c7] hover:underline cursor-pointer"
                      >
                        Track Pickup
                      </button>
                    </>
                  ) : (
                    'Sign up to earn points per kg of segregated waste.'
                  )}
                </p>
              </div>

              {/* Decent and Simple Quick Fill UI */}
              {mode === 'signin' && (
                <div className="mb-3 px-3 py-1.5 rounded-lg bg-slate-50/90 border border-slate-200/80 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-slate-600 truncate text-[11px]">
                      Demo: <span className="font-semibold text-slate-800">Dhananjay (Flora Campus)</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    className="text-[11px] font-semibold text-[#0284c7] hover:text-[#0369a1] hover:underline cursor-pointer shrink-0 transition-colors"
                  >
                    Quick Fill →
                  </button>
                </div>
              )}

              {/* Error notice */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Form */}
              {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-2.5 sm:space-y-3">
              {/* Email or phone */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                  Email or phone
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your email or phone"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-[#0284c7] transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-9 pr-10 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-1.5 focus:ring-[#0284c7] transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-[11px] sm:text-xs pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    key="citizen-remember"
                    type="checkbox"
                    checked={!!rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-[#0284c7] border-slate-300 focus:ring-[#0284c7] cursor-pointer"
                  />
                  <span className="text-slate-600 font-medium">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setError('Password reset instructions will be sent to your registered mobile/email.')}
                  className="font-semibold text-[#0284c7] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary Log In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-2.5 rounded-lg bg-[#007ba7] hover:bg-[#006a90] text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.99] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <span>Log In</span>
                )}
              </button>


              {/* Login with Google */}
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-[11px] sm:text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Login with Google</span>
              </button>

              {/* Mode switch */}
              <div className="pt-1 text-center text-[11px] sm:text-xs text-slate-600">
                New to EcoLoop?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); }}
                  className="font-bold text-[#0284c7] hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </div>

              {/* Outline Track Order / Pickup button */}
              <button
                type="button"
                onClick={() => {
                  if (onTrackPickup) onTrackPickup();
                  else handleQuickDemoLogin();
                }}
                className="w-full mt-1 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Track Pickup</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </button>
            </form>
          ) : (
            /* Register Mode */
            <form onSubmit={handleRegister} className="space-y-2 sm:space-y-2.5">
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-0.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ramesh Kulkarni"
                    required
                    className="w-full pl-9 pr-3 py-1.5 sm:py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:ring-1.5 focus:ring-[#0284c7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-0.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98220 00000"
                    required
                    className="w-full pl-9 pr-3 py-1.5 sm:py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:ring-1.5 focus:ring-[#0284c7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-0.5">
                  Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full pl-9 pr-3 py-1.5 sm:py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:ring-1.5 focus:ring-[#0284c7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-0.5">
                  Pune Municipal Zone
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <select
                    value={regArea}
                    onChange={(e) => setRegArea(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 sm:py-2 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white focus:ring-1.5 focus:ring-[#0284c7]"
                  >
                    {PUNE_ZONES.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-2.5 rounded-lg bg-[#007ba7] hover:bg-[#006a90] text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.99] cursor-pointer"
              >
                {loading ? 'Creating account…' : 'Register & Start Recycling'}
              </button>

              <div className="pt-1 text-center text-[11px] sm:text-xs text-slate-600">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setError(''); }}
                  className="font-bold text-[#0284c7] hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </div>
            </form>
          )}
          </div>
          )}

        </div>

        {/* Bottom Footer Links */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-[10px] sm:text-[11px] text-slate-500 shrink-0">
          <button type="button" onClick={() => alert('EcoLoop adheres to Pune Municipal Corporation data security guidelines.')} className="hover:text-slate-800 hover:underline">
            Privacy policy
          </button>
          <span>·</span>
          <button type="button" onClick={() => alert('Municipal pickups are completely free. Certified EcoPoints can be redeemed anytime.')} className="hover:text-slate-800 hover:underline">
            Refund & Cancellation
          </button>
          <span>·</span>
          <button type="button" onClick={() => alert('Official EcoLoop Terms: Verified segregation ensures 100% recycling compliance.')} className="hover:text-slate-800 hover:underline">
            Terms and Conditions
          </button>
        </div>

      </div>

    </div>
  );
};
