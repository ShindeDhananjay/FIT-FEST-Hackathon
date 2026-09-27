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
import { AuthIllustration } from '@/components/AuthIllustration';
import { CitizenLoginPage } from '@/components/CitizenLoginPage';
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

  const handleRequestUpdate = async (updatedReq: WastePickupRequest) => {
    const updated = requests.map((req) => (req.id === updatedReq.id ? updatedReq : req));
    setRequests(updated);
    saveStoredRequests(updated);

    try {
      await fetch(getApiUrl('/api/requests'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReq),
      });
    } catch (err) {
      console.error('Failed updating request in MongoDB Atlas', err);
    }
  };

  // LOGIN SCREEN (Exact same component and theme as Citizen & Driver login)
  if (!isAuthenticated) {
    return (
      <CitizenLoginPage
        initialRole="admin"
        title="Login to EcoLoop Admin"
        onSuccessAdmin={() => {
          setIsAuthenticated(true);
          sessionStorage.setItem('ecoloop_admin_session', 'authenticated');
        }}
        onSuccess={() => { window.location.href = '/'; }}
        onSuccessDriver={() => { window.location.href = '/driver'; }}
        onBackToHome={() => { window.location.href = '/'; }}
        onTrackPickup={() => { window.location.href = '/?tab=track'; }}
      />
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
          onRequestUpdate={handleRequestUpdate}
          onSelectTrackRequest={() => {}}
        />
      </main>
    </div>
  );
}
