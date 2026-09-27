'use client';

import React from 'react';
import {
  Recycle,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  History,
  MapPin,
  Share2,
  Leaf,
  PlusCircle,
} from 'lucide-react';
import { CitizenImpactProfile } from '@/types/waste';

export type ActiveTab = 'request' | 'track' | 'history' | 'admin' | 'analytics';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAiScanner: () => void;
  onOpenSocialModal: () => void;
  userProfile: CitizenImpactProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiScanner,
  onOpenSocialModal,
  userProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-900/20 bg-slate-950/85 backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('request')}>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/25 flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Recycle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400 animate-spin-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  FitFest EcoLoop
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest hidden sm:inline-block">
                  Smart Waste OS
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Flora Institute of Technology • Problem Statement 4</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('request')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'request'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Request Pickup</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'track'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Live Tracking</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'history'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>History</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'admin'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400 group-hover:text-white" />
              <span>Admin Console</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'analytics'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>City Stats</span>
            </button>
          </nav>

          {/* Action Hub & Eco Points */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Waste Scanner Button */}
            <button
              onClick={onOpenAiScanner}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-emerald-300 border border-emerald-500/40 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">AI Waste Scanner</span>
              <span className="sm:hidden">AI Scan</span>
            </button>

            {/* Social & Poster Share Modal */}
            <button
              onClick={onOpenSocialModal}
              title="Generate Hackathon Poster & Social Media Post"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden lg:inline">Poster & Share</span>
            </button>

            {/* User EcoPoints Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30">
              <div className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Leaf className="h-3.5 w-3.5" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-slate-400 uppercase font-semibold leading-none">EcoPoints</div>
                <div className="text-xs font-bold text-emerald-400 leading-tight">{userProfile.ecoPoints} pts</div>
              </div>
            </div>

          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('request')}
            className={`py-1 px-2 font-medium ${activeTab === 'request' ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Request
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`py-1 px-2 font-medium ${activeTab === 'track' ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Tracking
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-1 px-2 font-medium ${activeTab === 'history' ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-1 px-2 font-medium ${activeTab === 'admin' ? 'text-indigo-400 border-b-2 border-indigo-400 font-bold' : 'text-slate-400'}`}
          >
            Admin
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-1 px-2 font-medium ${activeTab === 'analytics' ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Stats
          </button>
        </div>

      </div>
    </header>
  );
};
