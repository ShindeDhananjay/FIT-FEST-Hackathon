'use client';

import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Download,
  Sparkles,
  Recycle,
  ShieldCheck,
  Truck,
  Leaf,
  Layers,
  MapPin,
  Flame,
} from 'lucide-react';

interface SocialPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialPosterModal: React.FC<SocialPosterModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const socialPostContent = `🚀 Excited to present our submission for the FIT Fest Hackathon organized by Flora Institute of Technology!

🌿 Project: Smart Waste Collection & Recycling Platform (FitFest EcoLoop)
🎯 Problem Statement 4: "Reduce Waste. Recycle More. Build a Cleaner Tomorrow."

🌍 The Real-World Problem:
Citizens often struggle to determine how to segregate and dispose of different types of waste (plastics, e-waste, organic compost, hazardous chemicals), while municipal and college collection services face logistics bottlenecks tracking real-time requests and optimizing truck routes.

💡 Our Proposed Solution:
FitFest EcoLoop is an intelligent, end-to-end smart waste collection platform that bridges citizens and eco-dispatchers.

✨ Key Features:
1️⃣ Multi-Category Smart Pickup: On-demand booking for Plastics, E-Waste, Organic, Paper, and Metal.
2️⃣ AI Vision Waste Scanner: Instant neural material recognition & segregation tips from photos.
3️⃣ Real-Time 4-Stage Live Dispatch Pipeline: Track pickup trucks in real-time with live ETAs (Submitted ➔ Assigned ➔ On The Way ➔ Completed).
4️⃣ Administrative Fleet Console: Geographic zone filtering, driver dispatching, and dynamic route maps.
5️⃣ Gamified EcoPoints & Certificates: Cryptographically verifiable digital recycling certificates + carbon offset calculations.
6️⃣ Google Cloud Run Deployment: Containerized, lightweight, and scalable cloud microservice.

Special thanks to:
🏛️ Flora Institute of Technology
👥 @gdg.fit.pune
🌱 @the_flora_institutes

#FitFest #FitFestHackathon #GoogleCloudRun #GDGPune #Sustainability #SmartWasteManagement #Nextjs #AI`;

  const handleCopy = () => {
    navigator.clipboard.writeText(socialPostContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-3xl w-full rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 flex items-center justify-center">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                Hackathon Project Poster & Social Media Hub
              </h2>
              <p className="text-xs text-slate-400">
                Official submission requirements for Flora Institute of Technology & GDG Pune
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* THE OFFICIAL PROJECT POSTER CARD */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Official Hackathon Project Poster (Screenshot / Save for Submission):
            </label>

            <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-emerald-500/40 relative overflow-hidden shadow-2xl space-y-6">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Poster Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black">
                    <Recycle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight">FITFEST ECOLOOP</h3>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      Flora Institute of Technology • Hackathon 2026
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                    PROBLEM STATEMENT 4
                  </span>
                </div>
              </div>

              {/* Tagline & Core Problem */}
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-white tracking-tight leading-tight">
                  Smart Waste Collection & Recycling Platform
                </h4>
                <p className="text-sm text-emerald-300 font-medium">
                  "Reduce Waste. Recycle More. Build a Cleaner Tomorrow."
                </p>
              </div>

              {/* Problem vs Solution Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                  <span className="font-extrabold text-rose-400 text-xs uppercase flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5" />
                    The Challenge
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Citizens lack clear guidance on waste segregation and pickup options; municipal collectors lack synchronized real-time visibility into collection queues and fleet routes.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                  <span className="font-extrabold text-emerald-400 text-xs uppercase flex items-center gap-1.5">
                    <Leaf className="h-3.5 w-3.5" />
                    The Solution
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    AI-powered multi-category waste classification, automated GPS truck dispatching, 4-stage tracking pipeline, and verifiable digital recycling certificates.
                  </p>
                </div>
              </div>

              {/* 4 Pillars of Architecture */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <Sparkles className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-white block">AI Waste Vision</span>
                  <span className="text-[9px] text-slate-400">Instant segregation</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <MapPin className="h-4 w-4 text-cyan-400 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-white block">Live GIS Radar</span>
                  <span className="text-[9px] text-slate-400">Driver ETA tracking</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <ShieldCheck className="h-4 w-4 text-indigo-400 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-white block">Admin Fleet OS</span>
                  <span className="text-[9px] text-slate-400">Zone-based routing</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <Truck className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-white block">Cloud Run Ready</span>
                  <span className="text-[9px] text-slate-400">Microservice scale</span>
                </div>
              </div>

              {/* Poster Footer with Official Mentions */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
                <span>Mentions: Flora Institute of Technology • @gdg.fit.pune • @the_flora_institutes</span>
                <span className="text-emerald-400 font-bold">100% Software Challenge MVP</span>
              </div>
            </div>
          </div>

          {/* 1-CLICK SOCIAL MEDIA POST COPY (Preformatted for LinkedIn/Instagram) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                1-Click Ready Post for LinkedIn / Instagram (Complies with all rules):
              </label>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer active:scale-95 transition-all"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Social Post'}</span>
              </button>
            </div>

            <textarea
              readOnly
              rows={8}
              value={socialPostContent}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono leading-relaxed focus:outline-none"
            />
          </div>

        </div>

      </div>
    </div>
  );
};
