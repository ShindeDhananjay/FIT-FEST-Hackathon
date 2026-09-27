'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  Package,
  ArrowRight,
  User,
  Search,
  Recycle,
  RefreshCw,
  Share2,
  Check,
  ShieldCheck,
  Navigation,
  Radio,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { WastePickupRequest, CollectorDriver, RequestStatus } from '@/types/waste';

interface LiveTrackerProps {
  requests: WastePickupRequest[];
  onRequestsUpdate: (updatedRequests: WastePickupRequest[]) => void;
  onNavigateToBooking: () => void;
}

const STATUS_STEPS: { key: RequestStatus; title: string; subtitle: string; icon: any }[] = [
  { key: 'submitted', title: 'Pickup Booked', subtitle: 'Order received', icon: Package },
  { key: 'assigned', title: 'Driver Assigned', subtitle: 'Collector allocated', icon: User },
  { key: 'on_the_way', title: 'On The Way', subtitle: 'Driver coming to you', icon: Truck },
  { key: 'completed', title: 'Picked Up & Recycled', subtitle: 'Points credited', icon: CheckCircle2 },
];

const MOCK_DRIVERS: CollectorDriver[] = [
  {
    id: 'D-01',
    name: 'Ramesh Patil',
    vehicleNumber: 'MH-12-AB-4321',
    vehicleType: 'Electric Mini-Van',
    phone: '+91 98223 91023',
    currentZone: 'Kothrud',
    rating: 4.9,
    status: 'on_route',
    assignedRequestsCount: 4,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'D-02',
    name: 'Sneha Kulkarni',
    vehicleNumber: 'MH-14-CD-7890',
    vehicleType: 'Electric Auto',
    phone: '+91 90112 34567',
    currentZone: 'Shivaji Nagar',
    rating: 4.8,
    status: 'available',
    assignedRequestsCount: 2,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
  },
];

export const LiveTracker: React.FC<LiveTrackerProps> = ({
  requests,
  onRequestsUpdate,
  onNavigateToBooking,
}) => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [etaMinutes, setEtaMinutes] = useState(12);
  const [copiedCode, setCopiedCode] = useState(false);
  const [mapMode, setMapMode] = useState<'google' | 'radar'>('google');

  // Active requests sorted newest first
  const activeRequests = requests
    .filter((r) => r.status !== 'cancelled')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const selectedRequest = selectedRequestId
    ? requests.find((r) => r.id === selectedRequestId) || null
    : activeRequests[0] || null;

  const driver: CollectorDriver = selectedRequest?.driver
    ? {
        id: selectedRequest.driver.id,
        name: selectedRequest.driver.name,
        phone: selectedRequest.driver.phone,
        vehicleNumber: selectedRequest.driver.vehicleNumber,
        vehicleType: 'Electric Mini-Van',
        currentZone: selectedRequest.cityZone || 'Pune Central',
        status: 'on_route' as const,
        assignedRequestsCount: 3,
        rating: 4.9,
        avatar: selectedRequest.driver.avatar,
      }
    : MOCK_DRIVERS[0];

  const statusIndex = STATUS_STEPS.findIndex((s) => s.key === selectedRequest?.status);

  // Advance simulation step
  const simulateProgress = useCallback(() => {
    if (!selectedRequest || isSimulating) return;
    setIsSimulating(true);

    const statuses: RequestStatus[] = ['submitted', 'assigned', 'on_the_way', 'completed'];
    const currentIndex = statuses.indexOf(selectedRequest.status);
    let nextIndex = (currentIndex + 1) % statuses.length;

    setTimeout(() => {
      const updated = requests.map((r) => {
        if (r.id !== selectedRequest.id) return r;
        return {
          ...r,
          status: statuses[nextIndex],
          driver:
            nextIndex >= 1
              ? {
                  id: driver.id,
                  name: driver.name,
                  phone: driver.phone,
                  vehicleNumber: driver.vehicleNumber,
                  avatar: driver.avatar,
                  etaMinutes: nextIndex === 2 ? 8 : 15,
                }
              : r.driver,
        };
      });
      setEtaMinutes(nextIndex === 2 ? 8 : 14);
      onRequestsUpdate(updated);
      setIsSimulating(false);
    }, 600);
  }, [selectedRequest, requests, onRequestsUpdate, isSimulating, driver]);

  const copyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (activeRequests.length === 0) {
    return (
      <div className="w-full min-h-[calc(100vh-4.5rem)] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <Truck className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Pickups Right Now</h2>
          <p className="text-gray-500 text-sm mb-6">
            Schedule a free waste collection and you&apos;ll be able to track your driver here in real-time.
          </p>
          <button
            onClick={onNavigateToBooking}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            Book a Free Pickup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4.5rem)] bg-gradient-to-b from-[#f8faf9] to-[#edf3ef] py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Full-width Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Live Doorstep Telemetry
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Live Pickup Tracker
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Watch your municipal driver en route to your doorstep in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={simulateProgress}
              disabled={isSimulating}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Advance step for demonstration"
            >
              <RefreshCw className={`h-4 w-4 ${isSimulating ? 'animate-spin text-emerald-600' : ''}`} />
              <span>Advance Step (Demo)</span>
            </button>
          </div>
        </div>

        {selectedRequest && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Order Details & Driver Card (5 Cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Main Status Hero Card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {selectedRequest.status === 'completed'
                        ? '🎉 Pickup Finished'
                        : selectedRequest.status === 'on_the_way'
                        ? '🚚 Driver On The Way'
                        : '⏳ Order Confirmed'}
                    </span>
                    <h2 className="text-2xl font-black text-gray-900 mt-2 tracking-tight">
                      {selectedRequest.status === 'completed'
                        ? 'Recycled & Certified!'
                        : `Arriving in ~${etaMinutes} mins`}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedRequest.pickupAddress || selectedRequest.cityZone}
                    </p>
                  </div>

                  {/* Copy Code */}
                  <button
                    type="button"
                    onClick={() => copyTracking(selectedRequest.trackingCode)}
                    className="flex items-center gap-1.5 text-xs font-mono bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    <span>{selectedRequest.trackingCode}</span>
                    {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5 text-gray-400" />}
                  </button>
                </div>

                {/* Driver Card */}
                {statusIndex >= 1 && (
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-base shadow-sm">
                        {driver.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{driver.name}</h4>
                        <p className="text-xs text-gray-500">{driver.vehicleType} · {driver.vehicleNumber}</p>
                        <span className="text-xs text-amber-500 font-bold">★ {driver.rating}</span>
                      </div>
                    </div>

                    <a
                      href={`tel:${driver.phone}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call Driver</span>
                    </a>
                  </div>
                )}

                {/* Simple 4-Step Progress */}
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Collection Pipeline
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {STATUS_STEPS.map((s, idx) => {
                      const isDone = idx <= statusIndex;
                      const isCurrent = idx === statusIndex;
                      return (
                        <div key={s.key} className="flex flex-col items-center text-center">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-all mb-1 ${
                              isDone
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-400'
                            } ${isCurrent ? 'ring-4 ring-emerald-100 ring-offset-1' : ''}`}
                          >
                            {isDone ? <Check className="h-4 w-4 stroke-[3]" /> : idx + 1}
                          </div>
                          <span className={`text-[10px] font-bold leading-tight ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                            {s.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details Snapshot */}
                <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Waste Material:</span>
                    <span className="font-bold text-gray-900 capitalize">{selectedRequest.category} ({selectedRequest.estimatedWeightKg} kg)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reward:</span>
                    <span className="font-bold text-emerald-700">+{selectedRequest.ecoPointsEarned} EcoPoints</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Schedule:</span>
                    <span className="font-semibold text-gray-800">{selectedRequest.scheduledDate} · {selectedRequest.scheduledSlot?.split('(')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Other Active Requests list */}
              {activeRequests.length > 1 && (
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Switch Active Pickup
                  </span>
                  <div className="space-y-1.5">
                    {activeRequests.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRequestId(r.id)}
                        className={`w-full p-3 rounded-2xl text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          r.id === selectedRequest.id
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                            : 'hover:bg-gray-50 text-gray-600 border border-transparent'
                        }`}
                      >
                        <span>{r.trackingCode} · {r.category}</span>
                        <span className="capitalize text-[11px] text-gray-400">{r.status.replace(/_/g, ' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Expansive Full Screen Live Map (7 Cols) */}
            <div className="lg:col-span-7">
              {(() => {
                const depotAddress = 'PMC Solid Waste Transfer Station, Karve Road, Pune, Maharashtra';
                const pickupAddressText = selectedRequest.pickupAddress
                  ? `${selectedRequest.pickupAddress}, Pune, Maharashtra`
                  : `${selectedRequest.cityZone}, Pune, Maharashtra`;
                const googleMapEmbedUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(
                  depotAddress
                )}&daddr=${encodeURIComponent(pickupAddressText)}&t=m&z=13&output=embed`;
                const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                  depotAddress
                )}&destination=${encodeURIComponent(pickupAddressText)}`;

                return (
                  <div className="bg-slate-950 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between gap-5">
                    
                    {/* Top Radar & View Switcher Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800">
                        <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                        <span className="text-xs font-mono text-emerald-300 font-bold">
                          PMC GPS Live: Ward {selectedRequest.cityZone.split(',')[0]}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Map Mode Toggle */}
                        <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => setMapMode('google')}
                            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                              mapMode === 'google'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <MapPin className="h-3 w-3" />
                            <span>Google Map</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setMapMode('radar')}
                            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                              mapMode === 'radar'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Radio className="h-3 w-3" />
                            <span>Radar</span>
                          </button>
                        </div>

                        {/* Open in Google Maps External App */}
                        <a
                          href={googleMapsDirectionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-bold transition-all shadow-xs cursor-pointer"
                          title="Open turn-by-turn navigation in Google Maps"
                        >
                          <span>Directions</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    {/* Route Address Pin Header */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <Recycle className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Origin (PMC Depot)</span>
                          <span className="text-white font-semibold truncate block">PMC Solid Waste Depot, Karve Rd</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3">
                        <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                          <MapPin className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Pickup Point (Address)</span>
                          <span className="text-white font-semibold truncate block" title={selectedRequest.pickupAddress || selectedRequest.cityZone}>
                            {selectedRequest.pickupAddress || selectedRequest.cityZone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* MAP DISPLAY: Real Google Map OR Radar Schematic */}
                    {mapMode === 'google' ? (
                      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 min-h-[380px] sm:min-h-[420px] shadow-inner">
                        {/* Interactive Google Map iframe */}
                        <iframe
                          title="PMC Depot to Pickup Location Route"
                          src={googleMapEmbedUrl}
                          className="w-full h-[380px] sm:h-[420px] border-0 filter contrast-[1.05]"
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                        />



                        {/* Direct map attribution notice */}
                        <div className="absolute bottom-2 right-2 z-10 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400 pointer-events-none">
                          PMC Depot ➔ {selectedRequest.cityZone}
                        </div>
                      </div>
                    ) : (
                      /* Schematic Radar Display */
                      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 min-h-[380px] sm:min-h-[420px] flex flex-col justify-center">
                        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id="fullGrid" width="48" height="48" patternUnits="userSpaceOnUse">
                              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#475569" strokeWidth="0.8" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#fullGrid)" />
                          <path d="M 0 200 Q 300 160 600 240 T 1200 260" fill="none" stroke="#0284c7" strokeWidth="8" opacity="0.3" />
                          <path d="M 80 80 L 320 220 L 640 180 L 900 120" fill="none" stroke="#64748b" strokeWidth="4" />
                          <path d="M 160 380 L 320 220 L 480 340 L 800 360" fill="none" stroke="#64748b" strokeWidth="4" />
                          <path d="M 120 100 Q 320 220 700 280" fill="none" stroke="#10b981" strokeWidth="5" strokeDasharray="10 6" className="animate-pulse" />
                        </svg>

                        <div className="relative z-10 flex items-center justify-around py-12 px-4">
                          {/* Municipal Depot */}
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-300 shadow-xl">
                              <Recycle className="h-6 w-6 text-emerald-400" />
                            </div>
                            <span className="text-xs font-bold text-slate-300 mt-2">PMC Depot</span>
                            <span className="text-[10px] text-slate-500 font-mono">Karve Rd Hub</span>
                          </div>

                          {/* Electric Vehicle Pulse */}
                          <div className="flex flex-col items-center">
                            <div className="relative">
                              <span className="absolute -inset-3 rounded-full bg-emerald-500/20 animate-ping" />
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 ring-4 ring-emerald-400/30">
                                <Truck className="h-7 w-7" />
                              </div>
                            </div>
                            <span className="text-xs font-mono font-black text-emerald-300 mt-3 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/40 shadow-xs">
                              {driver.vehicleNumber}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                              {driver.name}
                            </span>
                          </div>

                          {/* Citizen Doorstep */}
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center shadow-xl">
                              <MapPin className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-bold text-emerald-300 mt-2">Pickup Point</span>
                            <span className="text-[10px] text-slate-400 font-mono max-w-[120px] truncate text-center" title={selectedRequest.pickupAddress || selectedRequest.cityZone}>
                              {selectedRequest.pickupAddress || selectedRequest.cityZone}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bottom Live Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] uppercase font-sans font-bold block">Vehicle Type</span>
                        <span className="text-white font-bold">{driver.vehicleType}</span>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] uppercase font-sans font-bold block">Driver Phone</span>
                        <span className="text-emerald-400 font-bold">{driver.phone}</span>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] uppercase font-sans font-bold block">Status</span>
                        <span className="text-amber-300 font-bold capitalize">{selectedRequest.status.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] uppercase font-sans font-bold block">CO₂ Saved</span>
                        <span className="text-teal-300 font-bold">~{selectedRequest.co2OffsetKg} kg</span>
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
