'use client';

import React from 'react';
import {
  TrendingUp,
  PieChart,
  Recycle,
  Award,
  Trees,
  Zap,
  Droplets,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { WastePickupRequest, CitizenImpactProfile } from '@/types/waste';
import { WASTE_CATEGORIES } from '@/constants/wasteCategories';

interface CityAnalyticsProps {
  requests: WastePickupRequest[];
  userProfile: CitizenImpactProfile;
}

export const CityAnalytics: React.FC<CityAnalyticsProps> = ({ requests, userProfile }) => {
  // Aggregate stats by category
  const categoryBreakdown = Object.keys(WASTE_CATEGORIES).map((catKey) => {
    const matching = requests.filter((r) => r.category === catKey);
    const weight = matching.reduce((acc, r) => acc + r.estimatedWeightKg, 0);
    const co2 = matching.reduce((acc, r) => acc + r.co2OffsetKg, 0);
    return {
      category: catKey,
      name: WASTE_CATEGORIES[catKey as keyof typeof WASTE_CATEGORIES].name,
      count: matching.length,
      weight,
      co2,
      color: WASTE_CATEGORIES[catKey as keyof typeof WASTE_CATEGORIES].color,
    };
  });

  const totalKg = requests.reduce((acc, r) => acc + r.estimatedWeightKg, 0);
  const totalCo2 = requests.reduce((acc, r) => acc + r.co2OffsetKg, 0);

  // Equivalencies
  const treesEquivalent = Math.round(totalCo2 / 21); // 1 mature tree absorbs ~21 kg CO2/year
  const kwhEnergySaved = Math.round(totalKg * 1.8);
  const waterLitersSaved = Math.round(totalKg * 14.5);

  const LEADERBOARD_USERS = [
    { rank: 1, name: 'Ananya Deshpande', zone: 'Kothrud', points: 2840, kg: 210, badge: 'Zero-Waste Champion' },
    { rank: 2, name: 'Flora Tech C-Mess Team', zone: 'Campus Hub', points: 2190, kg: 175, badge: 'Eco Pioneer' },
    { rank: 3, name: userProfile.name, zone: 'Innovation Lab', points: userProfile.ecoPoints, kg: userProfile.totalKgRecycled, badge: userProfile.tier },
    { rank: 4, name: 'Rohit Kulkarni', zone: 'Hadapsar', points: 1220, kg: 94, badge: 'Green Contributor' },
    { rank: 5, name: 'Priya Sharma', zone: 'Viman Nagar', points: 980, kg: 76, badge: 'Eco Citizen' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Collection Statistics & Environmental Impact
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time municipal divert rate, environmental offsets, and community recycling benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-right">
            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Landfill Diversion</span>
            <span className="text-lg font-black text-white block">94.8%</span>
          </div>
        </div>
      </div>

      {/* Environmental Equivalencies Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/50 to-slate-900 border border-emerald-500/30 flex items-center gap-4 shadow-lg">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Trees className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Tree Absorption Equivalent</span>
            <span className="text-2xl font-black text-white mt-0.5 block">{treesEquivalent} Urban Trees</span>
            <span className="text-[11px] text-emerald-400">Carbon offset achieved</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/50 to-slate-900 border border-amber-500/30 flex items-center gap-4 shadow-lg">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Electricity Saved</span>
            <span className="text-2xl font-black text-white mt-0.5 block">{kwhEnergySaved} kWh</span>
            <span className="text-[11px] text-amber-400">By circular raw processing</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-950/50 to-slate-900 border border-cyan-500/30 flex items-center gap-4 shadow-lg">
          <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Droplets className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Freshwater Conserved</span>
            <span className="text-2xl font-black text-white mt-0.5 block">{waterLitersSaved} Liters</span>
            <span className="text-[11px] text-cyan-400">Saved from industrial usage</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Leaderboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown Bars */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-400" />
            Waste Category Diversion Breakdown
          </h3>

          <div className="space-y-3.5 pt-2">
            {categoryBreakdown.map((item) => {
              const percentage = totalKg > 0 ? Math.round((item.weight / totalKg) * 100) : 0;
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.name}</span>
                    <span className="font-mono text-slate-400">
                      {item.weight.toFixed(1)} kg ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Community Leaderboard (Gamification) */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              Flora Campus & City EcoLeaderboard
            </h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Weekly Standings
            </span>
          </div>

          <div className="space-y-2.5 pt-2">
            {LEADERBOARD_USERS.map((user) => {
              const isCurrentUser = user.name === userProfile.name;
              return (
                <div
                  key={user.rank}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                    isCurrentUser
                      ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                        user.rank === 1
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : user.rank === 2
                          ? 'bg-slate-300/20 text-slate-300 border border-slate-300/40'
                          : user.rank === 3
                          ? 'bg-amber-700/20 text-amber-600 border border-amber-700/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {user.rank}
                    </span>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {isCurrentUser && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded font-normal">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{user.zone} • {user.badge}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-emerald-400">{user.points} pts</div>
                    <div className="text-[10px] text-slate-500">{user.kg} kg recycled</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
