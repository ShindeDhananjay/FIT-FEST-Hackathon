'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  TrendingUp,
  AlertCircle,
  UserCheck,
  ChevronDown,
  Navigation,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { WastePickupRequest, CollectorDriver, RequestStatus, WasteCategory } from '@/types/waste';
import { WASTE_CATEGORIES, PUNE_ZONES } from '@/constants/wasteCategories';

interface AdminDashboardProps {
  requests: WastePickupRequest[];
  drivers: CollectorDriver[];
  onRequestStatusChange: (requestId: string, newStatus: RequestStatus, driverId?: string) => void;
  onSelectTrackRequest: (requestId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  requests,
  drivers,
  onRequestStatusChange,
  onSelectTrackRequest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'table' | 'map'>('table');

  // Assign driver modal state
  const [assigningRequestId, setAssigningRequestId] = useState<string | null>(null);

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.itemDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === 'all' || req.category === selectedCategoryFilter;
    const matchesStatus = selectedStatusFilter === 'all' || req.status === selectedStatusFilter;
    const matchesZone = selectedZoneFilter === 'all' || req.cityZone === selectedZoneFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesZone;
  });

  // Calculate statistics
  const totalWeight = requests.reduce((acc, r) => acc + r.estimatedWeightKg, 0);
  const totalCo2 = requests.reduce((acc, r) => acc + r.co2OffsetKg, 0);
  const pendingCount = requests.filter((r) => r.status === 'submitted').length;
  const inTransitCount = requests.filter((r) => r.status === 'on_the_way' || r.status === 'assigned').length;
  const completedCount = requests.filter((r) => r.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Administrative Collection & Dispatch Console
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time municipal request management, fleet routing, and recycling verification.
          </p>
        </div>

        {/* View toggle (Table vs Interactive Fleet Map) */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'table'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Request Queue ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Fleet Map
          </button>
        </div>
      </div>

      {/* High-level KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">Total Requests</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">{requests.length}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Across Pune zones</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/20">
          <span className="text-[11px] text-amber-400 font-semibold block uppercase">Awaiting Dispatch</span>
          <span className="text-2xl font-extrabold text-amber-400 mt-1 block">{pendingCount}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Ready for driver</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/20">
          <span className="text-[11px] text-cyan-400 font-semibold block uppercase">In Transit / Assigned</span>
          <span className="text-2xl font-extrabold text-cyan-400 mt-1 block">{inTransitCount}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Active on roads</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/20">
          <span className="text-[11px] text-emerald-400 font-semibold block uppercase">Completed / Recycled</span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{completedCount}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">100% diverted</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 col-span-2 lg:col-span-1">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">Total Volume</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">{totalWeight.toFixed(1)} kg</span>
          <span className="text-[10px] text-emerald-400 mt-0.5 block">~{totalCo2.toFixed(1)} kg CO₂ Saved</span>
        </div>
      </div>

      {activeTab === 'map' ? (
        /* LIVE FLEET DISPATCH MAP VIEW */
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Navigation className="h-4 w-4 text-emerald-400" />
                Live Fleet Tracking & Pickup Heatmap (Pune / Flora Tech Sector)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulated real-time vehicle dispatch telemetry with active cluster density.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Truck Active
              </span>
              <span className="flex items-center gap-1.5 text-slate-300 ml-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" /> Pending Pickup
              </span>
            </div>
          </div>

          {/* Interactive GIS Grid Simulation */}
          <div className="h-[420px] rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col justify-between p-6">
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

            {/* Simulated Road Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-800 stroke-[2] fill-none">
              <path d="M 50 150 Q 250 80 500 200 T 900 180" />
              <path d="M 200 400 Q 400 320 650 380 T 1100 250" />
              <path d="M 350 50 L 450 400" strokeDasharray="6 6" className="stroke-emerald-500/40" />
            </svg>

            {/* Depot Hub Pin */}
            <div className="absolute top-12 left-16 z-10 flex items-center gap-2 bg-slate-900/90 border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-lg">
              <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <p className="text-[11px] font-bold text-white">Central Eco Hub (Flora Campus)</p>
                <p className="text-[9px] text-slate-400">Depot #01 • 3 Trucks Online</p>
              </div>
            </div>

            {/* Truck 101 Marker */}
            <div className="absolute top-36 left-1/3 z-10 animate-pulse">
              <div className="flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-500 px-2.5 py-1 rounded-lg text-xs text-white shadow-xl cursor-pointer">
                <Truck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-bold text-[11px]">EV Van 4029 (Patil)</span>
              </div>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mx-auto mt-0.5" />
            </div>

            {/* Truck 103 Marker */}
            <div className="absolute bottom-28 right-1/4 z-10">
              <div className="flex items-center gap-1.5 bg-indigo-950/90 border border-indigo-500 px-2.5 py-1 rounded-lg text-xs text-white shadow-xl cursor-pointer">
                <Truck className="h-3.5 w-3.5 text-indigo-400" />
                <span className="font-bold text-[11px]">E-Waste Unit 5501 (Pooja)</span>
              </div>
            </div>

            {/* Pins for requests */}
            {filteredRequests.map((req, index) => {
              const offsets = [
                { top: '35%', left: '25%' },
                { top: '55%', left: '45%' },
                { top: '25%', left: '65%' },
                { top: '70%', left: '30%' },
                { top: '40%', left: '78%' },
              ];
              const pos = offsets[index % offsets.length];

              return (
                <div
                  key={req.id}
                  style={pos}
                  onClick={() => onSelectTrackRequest(req.id)}
                  title={`Click to track ${req.trackingCode}`}
                  className="absolute z-10 cursor-pointer group"
                >
                  <div className="h-6 w-6 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 group-hover:scale-125 transition-transform shadow-lg shadow-cyan-500/30">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <div className="hidden group-hover:block absolute left-8 top-0 bg-slate-900 border border-slate-700 p-2 rounded-xl w-48 text-[11px] shadow-2xl z-20">
                    <p className="font-bold text-white">{req.trackingCode} • {req.category}</p>
                    <p className="text-slate-400 mt-0.5">{req.pickupAddress.slice(0, 35)}...</p>
                    <p className="text-cyan-400 font-semibold mt-1">Status: {req.status}</p>
                  </div>
                </div>
              );
            })}

            {/* Bottom Map Legend */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
              <span>Flora Tech Main Campus GIS Server • Coordinates: 18.3512° N, 73.8567° E</span>
              <span>Click any pin to inspect real-time dispatch details</span>
            </div>
          </div>
        </div>
      ) : (
        /* TABLE VIEW (Search, Filter, Assign, Manage) */
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          
          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracking #, name, zone..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Waste Categories</option>
              {Object.keys(WASTE_CATEGORIES).map((key) => (
                <option key={key} value={key}>
                  {WASTE_CATEGORIES[key as WasteCategory].name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted (Pending)</option>
              <option value="assigned">Assigned</option>
              <option value="on_the_way">On The Way</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={selectedZoneFilter}
              onChange={(e) => setSelectedZoneFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Pune Zones</option>
              {PUNE_ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          {/* Requests Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Tracking & Category</th>
                  <th className="py-3 px-4">Citizen & Location</th>
                  <th className="py-3 px-4">Weight & Slot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Collector</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No collection requests match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-white">{req.trackingCode}</div>
                        <div className="text-[11px] text-emerald-400 capitalize font-medium flex items-center gap-1 mt-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          {req.category}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-200">{req.contactName}</div>
                        <div className="text-[11px] text-slate-400 truncate">{req.pickupAddress}</div>
                        <div className="text-[10px] text-slate-500">{req.cityZone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{req.estimatedWeightKg} kg</div>
                        <div className="text-[11px] text-slate-400">{req.quantityUnits}</div>
                        <div className="text-[10px] text-slate-500">{req.scheduledSlot.split('(')[0]}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block border ${
                            req.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : req.status === 'on_the_way'
                              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                              : req.status === 'assigned'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {req.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {req.driver ? (
                          <div>
                            <div className="font-semibold text-white">{req.driver.name}</div>
                            <div className="text-[10px] text-slate-400">{req.driver.vehicleNumber}</div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAssigningRequestId(req.id)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 font-semibold text-[11px] cursor-pointer"
                          >
                            + Assign Driver
                          </button>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {req.status === 'submitted' && (
                            <button
                              onClick={() => setAssigningRequestId(req.id)}
                              className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] cursor-pointer"
                              title="Assign Driver & Route"
                            >
                              Dispatch
                            </button>
                          )}

                          {req.status === 'assigned' && (
                            <button
                              onClick={() => onRequestStatusChange(req.id, 'on_the_way')}
                              className="px-2 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-[11px] cursor-pointer"
                            >
                              Start Route
                            </button>
                          )}

                          {req.status === 'on_the_way' && (
                            <button
                              onClick={() => onRequestStatusChange(req.id, 'completed')}
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                            >
                              Verify & Complete
                            </button>
                          )}

                          <button
                            onClick={() => onSelectTrackRequest(req.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                            title="Open in Tracker"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DRIVER ASSIGNMENT MODAL */}
      {assigningRequestId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="h-5 w-5 text-indigo-400" />
                Select Driver to Dispatch
              </h3>
              <button
                onClick={() => setAssigningRequestId(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Assign an available eco-collection driver to pickup request {assigningRequestId}.
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {drivers.map((driver) => (
                <div
                  key={driver.id}
                  onClick={() => {
                    onRequestStatusChange(assigningRequestId, 'assigned', driver.id);
                    setAssigningRequestId(null);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={driver.avatar}
                      alt={driver.name}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{driver.name}</h4>
                      <p className="text-[11px] text-slate-400">{driver.vehicleNumber}</p>
                      <p className="text-[10px] text-emerald-400">{driver.currentZone}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs">
                    Dispatch
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
