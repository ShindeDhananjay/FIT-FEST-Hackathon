'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Recycle,
  PlusCircle,
  MapPin,
  History,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Leaf,
  Menu,
  X,
  Home,
  ExternalLink,
  User,
  LogOut,
} from 'lucide-react';
import { CitizenImpactProfile, CitizenUser } from '@/types/waste';

export type ActiveTab = 'home' | 'request' | 'track' | 'history' | 'analytics' | 'login';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAiScanner: () => void;
  userProfile: CitizenImpactProfile;
  dbConnected?: boolean;
  currentUser?: CitizenUser | null;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiScanner,
  userProfile,
  dbConnected = true,
  currentUser,
  onLoginClick,
  onLogoutClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'request' as ActiveTab, label: 'Request Pickup', icon: PlusCircle },
    { id: 'track' as ActiveTab, label: 'Track Pickup', icon: MapPin },
    { id: 'history' as ActiveTab, label: 'History', icon: History },
    { id: 'analytics' as ActiveTab, label: 'Impact', icon: BarChart3 },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    if (tab === 'request' && !currentUser) {
      setActiveTab('login');
    } else {
      setActiveTab(tab);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div
              className="flex items-center gap-2.5 cursor-pointer group select-none"
              onClick={() => setActiveTab('home')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Recycle className="h-5 w-5 text-white animate-spin-slow" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-gray-900 text-lg tracking-tight">
                    Eco<span className="text-emerald-600">Loop</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wide uppercase">
                    Pune
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-medium -mt-0.5 hidden sm:inline">
                  Smart Waste & Recycling
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1 rounded-xl border border-gray-100">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-emerald-700 shadow-sm shadow-black/5 font-bold'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
                    }`}
                  >
                    <item.icon className={`h-3.5 w-3.5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* AI Scanner */}
              <button
                onClick={onOpenAiScanner}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/60 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer"
                title="AI Material Detection Scanner"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                <span>AI Scanner</span>
              </button>

              {/* Dedicated /admin link */}
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200/90 text-slate-700 border border-slate-200/80 transition-all shadow-xs cursor-pointer"
                title="Open Admin Operations Console at /admin"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Admin</span>
                <span className="sm:hidden">Admin</span>
              </Link>

              {/* EcoPoints Badge */}
              <div
                onClick={() => setActiveTab('analytics')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/15 transition-colors"
                title="Your EcoPoints balance"
              >
                <Leaf className="h-3.5 w-3.5 text-emerald-600 fill-emerald-500/30" />
                <span className="text-xs font-black text-emerald-800 tracking-tight">{userProfile.ecoPoints}</span>
                <span className="text-[10px] font-bold text-emerald-600/80 uppercase hidden sm:inline">pts</span>
              </div>

              {/* Citizen Auth Status */}
              {currentUser ? (
                <div className="flex items-center gap-1.5 pl-1.5 border-l border-gray-200">
                  <div
                    className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-gray-100/90 text-gray-800 text-xs font-semibold"
                    title={`Logged in as ${currentUser.name} (${currentUser.phone})`}
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="hidden md:inline max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
                  </div>
                  {onLogoutClick && (
                    <button
                      onClick={onLogoutClick}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Sign Out"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer"
                  title="Citizen Login / Registration"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md animate-fade-in shadow-xl">
            <div className="px-4 py-3 space-y-1.5">
              {/* Mobile Citizen Profile Status */}
              {currentUser ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{currentUser.name}</p>
                      <p className="text-[11px] text-gray-500">{currentUser.phone}</p>
                    </div>
                  </div>
                  {onLogoutClick && (
                    <button
                      onClick={() => { onLogoutClick(); setMobileMenuOpen(false); }}
                      className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => { if (onLoginClick) onLoginClick(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 text-white font-bold text-xs mb-2 shadow-xs cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  <span>Citizen Sign In / Register</span>
                </button>
              )}
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              ))}

              <div className="border-t border-gray-100 pt-2.5 mt-2 space-y-1.5">
                <button
                  onClick={() => { onOpenAiScanner(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50/60 border border-emerald-100 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <span>AI Waste Scanner</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-emerald-200/80 px-1.5 py-0.5 rounded text-emerald-800">New</span>
                </button>

                <Link
                  href="/admin"
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-indigo-600" />
                    <span>Admin Operations Console (/admin)</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 safe-area-bottom shadow-lg">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg cursor-pointer transition-colors min-w-[56px] ${
                  isActive ? 'text-emerald-600 font-bold' : 'text-gray-400 font-medium'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
