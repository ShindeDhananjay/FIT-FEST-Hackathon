'use client';

import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  Recycle,
  Leaf,
  ExternalLink,
} from 'lucide-react';

interface SocialPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialPosterModal: React.FC<SocialPosterModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const socialPostContent = `🌿 Presenting our hackathon submission:

EcoLoop — Smart Waste Management Platform

🎯 Problem Statement 4: "Reduce Waste. Recycle More. Build a Cleaner Tomorrow."

💡 Solution: An intelligent waste collection platform that bridges citizens and eco-dispatchers.

✨ Key Features:
1️⃣ Multi-Category Smart Pickup: On-demand booking for Plastics, E-Waste, Organic, Paper, and Metal
2️⃣ AI Vision Waste Scanner: Instant material recognition & segregation tips
3️⃣ Real-Time 4-Stage Live Dispatch Pipeline: Track pickups in real-time
4️⃣ Administrative Fleet Console: Zone filtering, driver dispatching
5️⃣ Gamified EcoPoints & Digital Certificates
6️⃣ Cloud-Native Deployment: Next.js + MongoDB Atlas

Built by Team EcoLoop
Flora Institute of Technology • @gdg.fit.pune

#EcoLoop #SmartWaste #Sustainability #Hackathon #NextJS`;

  const handleCopy = () => {
    navigator.clipboard.writeText(socialPostContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Share2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Share EcoLoop</h2>
              <p className="text-xs text-gray-500">Social media copy & project poster</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Project Summary Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Recycle className="h-6 w-6" />
              <span className="font-bold text-lg">EcoLoop</span>
            </div>
            <h3 className="text-xl font-extrabold leading-tight mb-2">
              Smart Waste Management & Pickup Platform
            </h3>
            <p className="text-emerald-100 text-sm mb-4">
              Smarter pickups. Cleaner communities. Track, recycle, and earn rewards for proper waste disposal.
            </p>
            <div className="flex items-center gap-4 text-xs text-emerald-200">
              <span>Next.js</span>
              <span>•</span>
              <span>MongoDB Atlas</span>
              <span>•</span>
              <span>AI Vision</span>
            </div>
          </div>

          {/* Features list */}
          <div className="space-y-2.5">
            {[
              { icon: '📦', label: 'Multi-Category Smart Booking' },
              { icon: '🤖', label: 'AI Waste Scanner' },
              { icon: '📍', label: 'Real-Time Live Tracking' },
              { icon: '🏆', label: 'Gamified EcoPoints & Certificates' },
              { icon: '📊', label: 'Impact Analytics & Leaderboard' },
              { icon: '☁️', label: 'Cloud-Native Architecture' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-lg">{f.icon}</span>
                <span className="text-sm font-medium text-gray-700">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Social Copy */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Social Media Copy</p>
              <button onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 max-h-48 overflow-y-auto">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans">{socialPostContent}</pre>
            </div>
          </div>

          {/* Credits */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center text-xs text-gray-400">
            <p>Flora Institute of Technology · @gdg.fit.pune · @the_flora_institutes</p>
            <p className="mt-1 text-gray-300">Problem Statement 4 · FIT Fest Hackathon 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};
