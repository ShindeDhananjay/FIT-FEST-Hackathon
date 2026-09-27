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
  Truck,
  ChevronRight,
  Gift,
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

  const navItems = currentUser
    ? [
        { id: 'home' as ActiveTab, label: 'Home', icon: Home },
        { id: 'request' as ActiveTab, label: 'Request Pickup', icon: PlusCircle },
        { id: 'track' as ActiveTab, label: 'Track Pickup', icon: MapPin },
        { id: 'history' as ActiveTab, label: 'History', icon: History },
        { id: 'analytics' as ActiveTab, label: 'Impact', icon: BarChart3 },
      ]
    : [{ id: 'home' as ActiveTab, label: 'Home', icon: Home }];

  const publicLinks = [
    { label: 'How It Works', targetId: 'how-it-works' },
    { label: 'Categories', targetId: 'categories' },
    { label: 'Rewards 🎁', targetId: 'rewards' },
    { label: 'Why EcoLoop', targetId: 'why-ecoloop' },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleScrollTo = (targetId: string) => {
    setMobileMenuOpen(false);
    const scrollTarget = () => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (activeTab !== 'home') {
      setActiveTab('home');
      setTimeout(scrollTarget, 120);
    } else {
      scrollTarget();
    }
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
            <nav className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1 rounded-xl border border-gray-100 shrink-0">
              {currentUser ? (
                // Authenticated Application Tabs — Cleanly sized, includes Rewards 🎁 but NOT Categories or Why EcoLoop
                <>
                  {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
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
                  <button
                    onClick={() => handleScrollTo('rewards')}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    title="View & Claim Recycled Rewards"
                  >
                    <Gift className="h-3.5 w-3.5 text-amber-600" />
                    <span>Rewards 🎁</span>
                  </button>
                </>
              ) : (
                // Unauthenticated Landing Page Links
                <>
                  <button
                    onClick={() => setActiveTab('home')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'home'
                        ? 'bg-white text-emerald-700 shadow-sm shadow-black/5 font-bold'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
                    }`}
                  >
                    <Home className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Home</span>
                  </button>
                  {publicLinks.map((link) => (
                    <button
                      key={link.targetId}
                      onClick={() => handleScrollTo(link.targetId)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-white/60 transition-colors cursor-pointer"
                    >
                      {link.label}
                    </button>
                  ))}
                </>
              )}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Authenticated Only: AI Scanner & EcoPoints */}
              {currentUser && (
                <>
                  <button
                    onClick={onOpenAiScanner}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/60 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer"
                    title="AI Material Detection Scanner"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                    <span>AI Scanner</span>
                  </button>

                  <div
                    onClick={() => handleNavClick('analytics')}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/15 transition-colors"
                    title="Your EcoPoints balance"
                  >
                    <Leaf className="h-3.5 w-3.5 text-emerald-600 fill-emerald-500/30" />
                    <span className="text-xs font-black text-emerald-800 tracking-tight">{userProfile.ecoPoints}</span>
                    <span className="text-[10px] font-bold text-emerald-600/80 uppercase hidden sm:inline">pts</span>
                  </div>
                </>
              )}



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
                <div className="flex items-center gap-2">
                  <button
                    onClick={onLoginClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#007ba7] hover:bg-[#006a90] text-white shadow-md shadow-[#007ba7]/20 transition-all cursor-pointer active:scale-95"
                    title="Citizen Login / Registration"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>Sign In</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('request')}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
                  >
                    <span>Request Pickup</span>
                  </button>
                </div>
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
              {currentUser && navItems.map((item) => (
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

              {/* After Login: Only keep Rewards option (not Categories or Why EcoLoop) */}
              {currentUser ? (
                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleScrollTo('rewards')}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-colors text-left flex items-center justify-between cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-amber-600" />
                      <span>Recycled Rewards Scheme 🎁</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-amber-600" />
                  </button>
                </div>
              ) : (
                /* Unauthenticated Mobile Explore Links */
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 block mb-1">
                    Explore EcoLoop
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 px-1">
                    {publicLinks.map((link) => (
                      <button
                        key={link.targetId}
                        onClick={() => handleScrollTo(link.targetId)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 bg-gray-50/60 border border-gray-100 transition-colors text-left flex items-center justify-between cursor-pointer active:scale-95"
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-100 pt-2.5 mt-2 space-y-1.5">
                <button
                  onClick={() => {
                    onOpenAiScanner();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50/60 border border-emerald-100 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <span>AI Waste Scanner</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-emerald-200/80 px-1.5 py-0.5 rounded text-emerald-800">New</span>
                </button>


              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar - only displayed for logged-in citizens */}
      {currentUser && (
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
      )}
    </>
  );
};
