'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Truck,
  CheckCheck,
  MapPin,
  Phone,
  ShieldCheck,
  Award,
  Navigation,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { WastePickupRequest, RequestStatus } from '@/types/waste';
import { WASTE_CATEGORIES } from '@/constants/wasteCategories';

interface LiveTrackerProps {
  requests: WastePickupRequest[];
  selectedRequestId?: string;
  onRequestSelect: (id: string) => void;
  onOpenNewBooking: () => void;
}

export const LiveTracker: React.FC<LiveTrackerProps> = ({
  requests,
  selectedRequestId,
  onRequestSelect,
  onOpenNewBooking,
}) => {
  // If no specific request is selected, pick the first active or latest request
  const activeRequests = requests.filter((r) => r.status !== 'cancelled');
  const currentRequest =
    activeRequests.find((r) => r.id === selectedRequestId) ||
    activeRequests.find((r) => r.status === 'on_the_way') ||
    activeRequests.find((r) => r.status === 'assigned') ||
    activeRequests.find((r) => r.status === 'submitted') ||
    activeRequests[0];

  const [simulatedEta, setSimulatedEta] = useState<number>(
    currentRequest?.driver?.etaMinutes || 12
  );

  useEffect(() => {
    if (currentRequest?.status === 'on_the_way') {
      const interval = setInterval(() => {
        setSimulatedEta((prev) => (prev > 1 ? prev - 1 : 1));
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [currentRequest?.status]);

  if (!currentRequest) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="h-16 w-16 mx-auto rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
          <Truck className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white">No Active Pickups Found</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
          You haven't requested any waste collection yet. Create your first pickup request to track our smart collection trucks in real-time.
        </p>
        <button
          onClick={onOpenNewBooking}
          className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          Create Pickup Request
        </button>
      </div>
    );
  }

  const categoryInfo = WASTE_CATEGORIES[currentRequest.category];

  // Pipeline step calculation
  const getStepState = (targetStatus: RequestStatus) => {
    const order: RequestStatus[] = ['submitted', 'assigned', 'on_the_way', 'completed'];
    const currentIndex = order.indexOf(currentRequest.status);
    const targetIndex = order.indexOf(targetStatus);

    if (currentRequest.status === 'cancelled') return 'cancelled';
    if (targetIndex < currentIndex) return 'completed';
    if (targetIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Active Pickup Selector Bar */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Your Pickups:
          </span>
          <div className="flex items-center gap-2">
            {activeRequests.slice(0, 5).map((req) => (
              <button
                key={req.id}
                onClick={() => onRequestSelect(req.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
                  req.id === currentRequest.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {req.trackingCode} • {req.category}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenNewBooking}
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <span>+ New Request</span>
        </button>
      </div>

      {/* Main Tracking Board */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        
        {/* Header with Tracking ID & Live Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-white tracking-tight">
                {currentRequest.trackingCode}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  currentRequest.status === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : currentRequest.status === 'on_the_way'
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse'
                    : currentRequest.status === 'assigned'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {currentRequest.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Registered on {new Date(currentRequest.createdAt).toLocaleDateString()} at{' '}
              {new Date(currentRequest.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Category</span>
              <span className="text-sm font-bold text-emerald-400 capitalize">{currentRequest.category}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Estimated Weight</span>
              <span className="text-sm font-bold text-white">{currentRequest.estimatedWeightKg} kg</span>
            </div>
          </div>
        </div>

        {/* 4-STAGE PIPELINE (Problem statement requirement) */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">
            Live Dispatch & Collection Pipeline
          </label>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
            
            {/* Step 1: Request Submitted */}
            {(() => {
              const state = getStepState('submitted');
              return (
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    state === 'current'
                      ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                      : state === 'completed'
                      ? 'bg-slate-950/80 border-emerald-500/40'
                      : 'bg-slate-950/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="h-7 w-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    {state === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Clock className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white">Request Submitted</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Order verified & entered into dispatch queue</p>
                </div>
              );
            })()}

            {/* Step 2: Collector Assigned */}
            {(() => {
              const state = getStepState('assigned');
              return (
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    state === 'current'
                      ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                      : state === 'completed'
                      ? 'bg-slate-950/80 border-emerald-500/40'
                      : 'bg-slate-950/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="h-7 w-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    {state === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Clock className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white">Collector Assigned</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {currentRequest.driver ? `${currentRequest.driver.name} assigned` : 'Routing nearest eco-vehicle'}
                  </p>
                </div>
              );
            })()}

            {/* Step 3: On The Way */}
            {(() => {
              const state = getStepState('on_the_way');
              return (
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    state === 'current'
                      ? 'bg-cyan-950/50 border-cyan-400 ring-2 ring-cyan-500/20 shadow-lg shadow-cyan-950/40'
                      : state === 'completed'
                      ? 'bg-slate-950/80 border-emerald-500/40'
                      : 'bg-slate-950/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="h-7 w-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    {state === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : state === 'current' ? (
                      <Truck className="h-4 w-4 text-cyan-400 animate-bounce" />
                    ) : (
                      <Clock className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white">On The Way</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {state === 'current' ? `En route • ETA ~${simulatedEta} mins` : 'Live navigation in progress'}
                  </p>
                </div>
              );
            })()}

            {/* Step 4: Completed / Recycled */}
            {(() => {
              const state = getStepState('completed');
              return (
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    state === 'completed' || state === 'current'
                      ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-950/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="h-7 w-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    {state === 'completed' ? (
                      <CheckCheck className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Clock className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white">Completed & Recycled</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Weighed, certificate minted & points awarded</p>
                </div>
              );
            })()}

          </div>
        </div>

        {/* DRIVER & LIVE GPS DISPATCH SIMULATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Driver Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-emerald-400" />
                Assigned Eco-Collector
              </span>
              {currentRequest.status === 'on_the_way' && (
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Live GPS En Route
                </span>
              )}
            </div>

            {currentRequest.driver ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={currentRequest.driver.avatar}
                    alt={currentRequest.driver.name}
                    className="h-12 w-12 rounded-2xl object-cover border-2 border-emerald-500/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{currentRequest.driver.name}</h4>
                    <p className="text-xs text-slate-400">{currentRequest.driver.vehicleNumber}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-amber-400 font-bold bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20">
                        ★ 4.9 Driver Rating
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        EV Zero-Emission Truck
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-850">
                  <a
                    href={`tel:${currentRequest.driver.phone}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Call Driver ({currentRequest.driver.phone})</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500 text-xs">
                <Clock className="h-6 w-6 text-slate-600 mx-auto mb-2" />
                Dispatch matching is active. Driver will appear here shortly.
              </div>
            )}
          </div>

          {/* Location & Instructions Details */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              Pickup Location & Schedule
            </span>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Address</span>
                <span className="font-semibold text-slate-200">{currentRequest.pickupAddress}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block text-[10px]">Zone</span>
                  <span className="font-semibold text-slate-200">{currentRequest.cityZone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Time Slot</span>
                  <span className="font-semibold text-slate-200">{currentRequest.scheduledSlot.split('(')[0]}</span>
                </div>
              </div>
              {currentRequest.specialInstructions && (
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-850 text-[11px] text-slate-300">
                  <span className="font-bold text-slate-400">Note: </span>
                  {currentRequest.specialInstructions}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* COMPLETED RECYCLING CERTIFICATE BANNER (If Completed) */}
        {currentRequest.status === 'completed' && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-teal-950/60 border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-400" />
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Official Green Recycling Certificate Minted
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-500/30">
                {currentRequest.certificateId || 'REC-CERT-2026'}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Verified by Flora Institute EcoLoop Depot. Your waste was diverted 100% from landfills, generating{' '}
              <strong className="text-emerald-400">+{currentRequest.ecoPointsEarned} EcoPoints</strong> and saving{' '}
              <strong className="text-cyan-400">{currentRequest.co2OffsetKg} kg of CO₂</strong> emissions.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
