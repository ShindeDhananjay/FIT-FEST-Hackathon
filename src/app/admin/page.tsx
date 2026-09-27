'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  LogOut,
  Recycle,
  Sparkles,
  ArrowLeft,
  KeyRound,
  Check,
} from 'lucide-react';
import { AdminDashboard } from '@/components/AdminDashboard';
import {
  getStoredRequests,
  saveStoredRequests,
  getStoredDrivers,
} from '@/lib/storage';
import { WastePickupRequest, CollectorDriver, RequestStatus } from '@/types/waste';
import { getApiUrl } from '@/lib/api';

const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'admin@123',
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedPill, setCopiedPill] = useState(false);

  const [requests, setRequests] = useState<WastePickupRequest[]>([]);
  const [drivers, setDrivers] = useState<CollectorDriver[]>([]);

  // Check existing session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('ecoloop_admin_session');
      if (session === 'authenticated') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Load data once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    setRequests(getStoredRequests());
    setDrivers(getStoredDrivers());

    // Try MongoDB Atlas
    fetch(getApiUrl('/api/requests'))
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data && resData.data.length > 0) {
          setRequests(resData.data);
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (email.trim().toLowerCase() === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        setIsAuthenticated(true);
        sessionStorage.setItem('ecoloop_admin_session', 'authenticated');
        setLoading(false);
      } else {
        setError('Invalid credentials. Please use seed credentials: admin@gmail.com / admin@123');
        setLoading(false);
      }
    }, 600);
  };

  const handleQuickFill = () => {
    setEmail(ADMIN_CREDENTIALS.email);
    setPassword(ADMIN_CREDENTIALS.password);
    setError('');
    setCopiedPill(true);
    setTimeout(() => setCopiedPill(false), 2000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ecoloop_admin_session');
    setEmail('');
    setPassword('');
  };

  const handleRequestStatusChange = async (
    requestId: string,
    newStatus: RequestStatus,
    driverId?: string
  ) => {
    let assignedDriverInfo: any = undefined;

    const updated = requests.map((req) => {
      if (req.id !== requestId) return req;

      let assignedDriver = req.driver;
      if (driverId) {
        const found = drivers.find((d) => d.id === driverId);
        if (found) {
          assignedDriver = {
            id: found.id,
            name: found.name,
            phone: found.phone,
            vehicleNumber: found.vehicleNumber,
            avatar: found.avatar,
            etaMinutes: 20,
          };
          assignedDriverInfo = assignedDriver;
        }
      }

      const completedAt = newStatus === 'completed' ? new Date().toISOString() : req.completedAt;
      const certificateId =
        newStatus === 'completed' && !req.certificateId
          ? `REC-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`
          : req.certificateId;

      return {
        ...req,
        status: newStatus,
        driver: assignedDriver,
        completedAt,
        certificateId,
      };
    });

    setRequests(updated);
    saveStoredRequests(updated);

    try {
      const targetReq = updated.find((r) => r.id === requestId);
      await fetch(getApiUrl('/api/requests'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: requestId,
          status: newStatus,
          driver: assignedDriverInfo,
          completedAt: targetReq?.completedAt,
          certificateId: targetReq?.certificateId,
        }),
      });
    } catch (err) {
      console.error('Failed patching request in MongoDB Atlas', err);
    }
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden text-slate-100 font-sans">
        {/* Ambient lighting effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-600/20 via-indigo-600/20 to-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar */}
        <div className="max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-10">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Public Portal</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Admin Authorization / Pune Ops</span>
          </div>
        </div>

        {/* Central Login Card */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-md"
          >
            {/* Header Badge */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20 mb-4 ring-8 ring-indigo-500/10">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Operations Console
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                EcoLoop Municipal & Logistics Control Center
              </p>
            </div>

            {/* Seed Credentials Quick Fill Box (Requested by User) */}
            <div className="mb-5 p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Seed Credentials</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer flex items-center gap-1"
                >
                  {copiedPill ? <Check className="h-3 w-3 text-emerald-300" /> : <Sparkles className="h-3 w-3 text-emerald-400" />}
                  <span>{copiedPill ? 'Auto-filled!' : '⚡ Quick-Fill'}</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">Email</span>
                  <span className="text-slate-200 select-all font-semibold">admin@gmail.com</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">Password</span>
                  <span className="text-slate-200 select-all font-semibold">admin@123</span>
                </div>
              </div>
            </div>

            {/* Main Form Card */}
            <form onSubmit={handleLogin} className="p-7 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl shadow-black/60 space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="admin@123"
                    required
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Access…</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Authorize & Access /admin</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="py-4 text-center text-xs text-slate-600 relative z-10">
          EcoLoop Pune Civic Waste Orchestration Engine · Secure Ops Channel
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Branding & Breadcrumbs */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-xs">
                  <Recycle className="h-5 w-5 text-white" />
                </div>
                <span className="font-extrabold text-gray-900 text-base">
                  Eco<span className="text-emerald-600">Loop</span>
                </span>
              </Link>
              <div className="w-px h-5 bg-gray-200" />
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100/80">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
                  Admin Control Panel (/admin)
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Ops Live</span>
              </div>

              <span className="text-xs text-gray-500 hidden md:inline font-mono bg-gray-100 px-2 py-1 rounded">
                admin@gmail.com
              </span>

              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Public Site
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100/80 border border-red-100 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign out</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Admin Dashboard */}
      <main className="flex-1 pb-16">
        <AdminDashboard
          requests={requests}
          drivers={drivers}
          onRequestStatusChange={handleRequestStatusChange}
          onSelectTrackRequest={() => {}}
        />
      </main>
    </div>
  );
}
