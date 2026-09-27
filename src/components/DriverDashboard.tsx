'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Scale,
  Award,
  Navigation,
  Check,
  AlertCircle,
  Sparkles,
  LogOut,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Package,
  Calendar,
  ShieldCheck,
  User,
  ArrowRight,
} from 'lucide-react';
import { WastePickupRequest, CollectorDriver, RequestStatus, WasteCategory } from '@/types/waste';
import { WASTE_CATEGORIES } from '@/constants/wasteCategories';
import { getApiUrl } from '@/lib/api';

const CATEGORY_EMOJI: Record<WasteCategory, string> = {
  organic: '🍏',
  plastic: '🧴',
  ewaste: '💻',
  hazardous: '⚠️',
  paper: '📦',
  metal: '🥫',
};

interface DriverDashboardProps {
  driver: CollectorDriver;
  requests: WastePickupRequest[];
  onRequestUpdate: (updatedRequests: WastePickupRequest[]) => void;
  onLogout: () => void;
  onSwitchToCitizen?: () => void;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({
  driver,
  requests,
  onRequestUpdate,
  onLogout,
  onSwitchToCitizen,
}) => {
  const [activeTab, setActiveTab] = useState<'my_pickups' | 'available' | 'completed'>('my_pickups');
  const [driverDutyStatus, setDriverDutyStatus] = useState<'available' | 'on_route' | 'off_duty'>(driver.status || 'available');
  
  // Weigh & Complete Modal
  const [weighingRequest, setWeighingRequest] = useState<WastePickupRequest | null>(null);
  const [actualWeight, setActualWeight] = useState<number>(0);
  const [segregationVerified, setSegregationVerified] = useState<boolean>(true);
  const [isSubmittingWeight, setIsSubmittingWeight] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter requests
  // My active pickups: assigned to this driver AND not completed or cancelled
  const myActivePickups = requests.filter(
    (r) => r.driver?.id === driver.id && (r.status === 'assigned' || r.status === 'on_the_way')
  );

  // My completed pickups
  const myCompletedPickups = requests.filter(
    (r) => r.driver?.id === driver.id && r.status === 'completed'
  );

  // Available requests in zone/city to receive & accept
  const availablePickups = requests.filter(
    (r) =>
      r.status === 'submitted' ||
      (!r.driver && r.status !== 'completed' && r.status !== 'cancelled')
  );

  // Stats calculation
  const totalCompletedCount = myCompletedPickups.length;
  const totalKgCollected = myCompletedPickups.reduce((acc, r) => acc + (r.estimatedWeightKg || 0), 0);

  // 1. Accept Order (Receive Order)
  const handleAcceptOrder = async (reqId: string) => {
    const updated = requests.map((r) => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'assigned' as RequestStatus,
          driver: {
            id: driver.id,
            name: driver.name,
            phone: driver.phone,
            vehicleNumber: driver.vehicleNumber,
            avatar: driver.avatar,
            etaMinutes: 15,
          },
        };
      }
      return r;
    });

    onRequestUpdate(updated);
    showToast(`Order ${reqId} accepted! Added to your active route.`);

    // Sync to backend / MongoDB Atlas
    try {
      await fetch(getApiUrl('/api/requests'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reqId,
          status: 'assigned',
          driver: {
            id: driver.id,
            name: driver.name,
            phone: driver.phone,
            vehicleNumber: driver.vehicleNumber,
            avatar: driver.avatar,
            etaMinutes: 15,
          },
        }),
      });
    } catch (err) {
      console.warn('Accepted order saved locally, backend sync warning:', err);
    }
  };

  // 2. Start Route (Update to on_the_way)
  const handleStartRoute = async (reqId: string) => {
    const updated = requests.map((r) => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'on_the_way' as RequestStatus,
        };
      }
      return r;
    });

    onRequestUpdate(updated);
    showToast(`Status updated: On the way to customer doorstep!`);

    try {
      await fetch(getApiUrl('/api/requests'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reqId,
          status: 'on_the_way',
        }),
      });
    } catch (err) {
      console.warn('Backend sync warning:', err);
    }
  };

  // 3. Open Weigh & Complete Modal
  const handleOpenWeighModal = (req: WastePickupRequest) => {
    setWeighingRequest(req);
    setActualWeight(req.estimatedWeightKg || 5);
    setSegregationVerified(true);
  };

  // 4. Confirm Weighed & Complete Pickup
  const handleConfirmCompletion = async () => {
    if (!weighingRequest) return;
    setIsSubmittingWeight(true);

    const certId = `CERT-${Math.floor(100000 + Math.random() * 900000)}`;
    const pointsAwarded = Math.round(actualWeight * 10);
    const nowIso = new Date().toISOString();

    const updated = requests.map((r) => {
      if (r.id === weighingRequest.id) {
        return {
          ...r,
          status: 'completed' as RequestStatus,
          estimatedWeightKg: actualWeight,
          ecoPointsEarned: pointsAwarded,
          certificateId: certId,
          completedAt: nowIso,
        };
      }
      return r;
    });

    onRequestUpdate(updated);

    try {
      await fetch(getApiUrl('/api/requests'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: weighingRequest.id,
          status: 'completed',
          completedAt: nowIso,
          certificateId: certId,
        }),
      });
    } catch (err) {
      console.warn('Backend sync warning:', err);
    }

    setIsSubmittingWeight(false);
    setWeighingRequest(null);
    showToast(`✅ Pickup ${weighingRequest.id} completed! ${pointsAwarded} EcoPoints credited to citizen.`);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans antialiased text-slate-900 pb-16">
      
      {/* Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-medium shadow-2xl flex items-center gap-2 border border-slate-700"
          >
            <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Logo & Driver Portal Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-emerald-600/30">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base tracking-tight">EcoLoop</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Delivery Partner
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block -mt-0.5">
                Doorstep Waste Collection & Recycling Logistics
              </p>
            </div>
          </div>

          {/* Right Action Profile & Duty Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Duty status toggle */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
              <span className={`w-2 h-2 rounded-full ${
                driverDutyStatus === 'available' ? 'bg-emerald-500 animate-pulse' :
                driverDutyStatus === 'on_route' ? 'bg-cyan-500' : 'bg-slate-400'
              }`} />
              <select
                value={driverDutyStatus}
                onChange={(e) => {
                  setDriverDutyStatus(e.target.value as any);
                  showToast(`Duty status updated to ${e.target.value}`);
                }}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="available">🟢 On Duty & Ready</option>
                <option value="on_route">🟡 On Route</option>
                <option value="off_duty">⚪ Off Duty</option>
              </select>
            </div>

            {/* Driver Profile Chip */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
              <img
                src={driver.avatar}
                alt={driver.name}
                className="w-7 h-7 rounded-full object-cover border border-emerald-300"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">{driver.name}</div>
                <div className="text-[10px] text-emerald-700 font-medium">{driver.vehicleType}</div>
              </div>
              <span className="text-xs font-bold text-amber-500 pl-1">★ {driver.rating}</span>
            </div>

            {/* Switch to citizen portal */}
            {onSwitchToCitizen && (
              <button
                type="button"
                onClick={onSwitchToCitizen}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                title="Switch to Citizen Public Portal"
              >
                <span>Citizen View</span>
              </button>
            )}

            {/* Logout */}
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-medium transition-colors flex items-center gap-1"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* WELCOME BANNER & STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Active Route</span>
              <Truck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{myActivePickups.length}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Pickups pending completion</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Available to Receive</span>
              <Sparkles className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{availablePickups.length}</div>
            <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">Ready to claim & collect</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Completed Today</span>
              <CheckCircle2 className="h-4 w-4 text-teal-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{totalCompletedCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Verified collections</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>Weighed Recycled</span>
              <Scale className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-700">{totalKgCollected.toFixed(1)} <span className="text-xs font-semibold text-slate-500">kg</span></div>
            <div className="text-[11px] text-slate-500 mt-0.5">Logged with digital scale</div>
          </div>

        </div>

        {/* TABS SELECTOR */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl mb-6 max-w-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('my_pickups')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'my_pickups'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="h-3.5 w-3.5 text-emerald-600" />
            <span>My Active Route ({myActivePickups.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'available'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="h-3.5 w-3.5 text-indigo-600" />
            <span>Receive Orders ({availablePickups.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
            <span>Completed ({myCompletedPickups.length})</span>
          </button>
        </div>

        {/* TAB 1: MY ACTIVE PICKUPS */}
        {activeTab === 'my_pickups' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Assigned Pickups on Your Route</h2>
                <p className="text-xs text-slate-500">Update order status as you navigate to doorstep and weigh items.</p>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {myActivePickups.length} order{myActivePickups.length === 1 ? '' : 's'} assigned
              </span>
            </div>

            {myActivePickups.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Your Route is Clear!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  You have completed all assigned collections. Check the Available Orders tab to claim new pickups in your zone.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('available')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Receive & Accept Pickups ({availablePickups.length})</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {myActivePickups.map((req) => {
                  const catConfig = WASTE_CATEGORIES[req.category as WasteCategory] || WASTE_CATEGORIES.plastic;
                  const isEnRoute = req.status === 'on_the_way';

                  return (
                    <div
                      key={req.id}
                      className={`bg-white rounded-2xl border transition-all p-5 shadow-2xs flex flex-col justify-between ${
                        isEnRoute ? 'border-cyan-400 ring-1 ring-cyan-200' : 'border-slate-200'
                      }`}
                    >
                      <div>
                        {/* Top row: Order ID, Category, Status badge */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                              {req.id}
                            </span>
                            <span className="text-[11px] text-slate-400">·</span>
                            <span className="text-xs font-semibold text-slate-600">{req.trackingCode}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                                isEnRoute ? 'bg-cyan-100 text-cyan-800' : 'bg-indigo-100 text-indigo-800'
                              }`}
                            >
                              {isEnRoute ? '🚚 On The Way' : 'Assigned to You'}
                            </span>
                          </div>
                        </div>

                        {/* Customer & Item details */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-slate-900">{req.contactName}</span>
                            <a
                              href={`tel:${req.contactPhone}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
                            >
                              <Phone className="h-3 w-3" />
                              <span>{req.contactPhone}</span>
                            </a>
                          </div>

                          <div className="flex items-start gap-1.5 text-xs text-slate-600 mt-2">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>
                              {req.pickupAddress}
                              {req.landmark && <strong className="text-slate-700"> ({req.landmark})</strong>}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>{req.scheduledDate} · {req.scheduledSlot}</span>
                          </div>
                        </div>

                        {/* Waste description banner */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{CATEGORY_EMOJI[req.category as WasteCategory] || '📦'}</span>
                            <div>
                              <div className="text-xs font-bold text-slate-800 capitalize">{req.category} Waste</div>
                              <div className="text-[11px] text-slate-500 line-clamp-1">{req.itemDescription}</div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-emerald-700">~{req.estimatedWeightKg} kg</span>
                            <span className="block text-[10px] text-slate-400">Est. Weight</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons footer */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        {/* Maps Navigation Link */}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${req.pickupAddress} Pune`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                        >
                          <Navigation className="h-3 w-3 text-slate-500" />
                          <span>Google Maps</span>
                        </a>

                        {/* Status progression CTA */}
                        {req.status === 'assigned' && (
                          <button
                            type="button"
                            onClick={() => handleStartRoute(req.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                          >
                            <Truck className="h-3.5 w-3.5" />
                            <span>Start Route (On The Way)</span>
                          </button>
                        )}

                        {req.status === 'on_the_way' && (
                          <button
                            type="button"
                            onClick={() => handleOpenWeighModal(req)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer animate-pulse"
                          >
                            <Scale className="h-3.5 w-3.5" />
                            <span>Arrived — Weigh & Complete</span>
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RECEIVE & ACCEPT ORDERS */}
        {activeTab === 'available' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Available Orders in Pune Zone</h2>
                <p className="text-xs text-slate-500">Pickups requested by citizens awaiting driver allocation.</p>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {availablePickups.length} order{availablePickups.length === 1 ? '' : 's'} available
              </span>
            </div>

            {availablePickups.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Package className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No Pending Orders Right Now</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  All citizen waste pickups have been allocated. New requests will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availablePickups.map((req) => {
                  const catConfig = WASTE_CATEGORIES[req.category as WasteCategory] || WASTE_CATEGORIES.plastic;

                  return (
                    <div
                      key={req.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                            {req.id}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                            Awaiting Driver
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{CATEGORY_EMOJI[req.category as WasteCategory] || '📦'}</span>
                          <div>
                            <span className="text-xs font-bold text-slate-900 capitalize block">{req.category} Waste</span>
                            <span className="text-[11px] text-slate-500">~{req.estimatedWeightKg} kg · {req.quantityUnits}</span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 mb-2">
                          <div className="font-semibold text-slate-800">{req.contactName}</div>
                          <div className="text-[11px] text-slate-500 truncate">{req.pickupAddress}</div>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-3">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>Slot: {req.scheduledSlot}</span>
                        </div>
                      </div>

                      {/* Accept Order Button */}
                      <button
                        type="button"
                        onClick={() => handleAcceptOrder(req.id)}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Accept & Assign to Me</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COMPLETED DELIVERIES */}
        {activeTab === 'completed' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Completed Collections</h2>
                <p className="text-xs text-slate-500">Pickups weighed and verified for recycling.</p>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {myCompletedPickups.length} order{myCompletedPickups.length === 1 ? '' : 's'} completed
              </span>
            </div>

            {myCompletedPickups.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Scale className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No Pickups Completed Yet Today</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Once you weigh and confirm collections on your active route, they will be logged here with digital certificate IDs.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="divide-y divide-slate-100">
                  {myCompletedPickups.map((req) => (
                    <div key={req.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-slate-900">{req.id}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-xs font-semibold text-slate-700">{req.contactName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Verified Pickup
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {req.pickupAddress} · {req.category} waste ({req.estimatedWeightKg} kg)
                        </div>
                        {req.certificateId && (
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            Certificate ID: {req.certificateId}
                          </div>
                        )}
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                          <Award className="h-3 w-3" />
                          <span>+{req.ecoPointsEarned || Math.round((req.estimatedWeightKg || 5) * 10)} EcoPoints</span>
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-1">
                          {req.completedAt ? new Date(req.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Completed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* WEIGH & COMPLETE PICKUP MODAL */}
      <AnimatePresence>
        {weighingRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Scale className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Digital Scale Verification</h3>
                    <p className="text-xs text-slate-500">Order {weighingRequest.id} · {weighingRequest.contactName}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWeighingRequest(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Weight reading input */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Actual Digital Scale Reading (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={actualWeight}
                    onChange={(e) => setActualWeight(parseFloat(e.target.value) || 0)}
                    className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-300 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    kg
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Estimated was: {weighingRequest.estimatedWeightKg} kg
                </p>
              </div>

              {/* Points calculation preview */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-900">Citizen Reward Points</span>
                </div>
                <span className="text-sm font-extrabold text-emerald-700">
                  +{Math.round(actualWeight * 10)} EcoPoints
                </span>
              </div>

              {/* Quality verification checkbox */}
              <label className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer mb-5">
                <input
                  type="checkbox"
                  checked={segregationVerified}
                  onChange={(e) => setSegregationVerified(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  <strong>Segregation Quality Verified:</strong> Material is uncontaminated and ready for municipal recycling.
                </span>
              </label>

              {/* Confirm / Cancel */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWeighingRequest(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmittingWeight || actualWeight <= 0}
                  onClick={handleConfirmCompletion}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSubmittingWeight ? (
                    <span>Syncing…</span>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Confirm & Complete</span>
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
