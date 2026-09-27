'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  AlertCircle,
  UserCheck,
  ChevronDown,
  RefreshCw,
  ArrowUpRight,
  Package,
  Filter,
  Download,
  Check,
  X,
  Phone,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import { WastePickupRequest, CollectorDriver, RequestStatus, WasteCategory } from '@/types/waste';
import { WASTE_CATEGORIES, PUNE_ZONES } from '@/constants/wasteCategories';

interface AdminDashboardProps {
  requests: WastePickupRequest[];
  drivers: CollectorDriver[];
  onRequestStatusChange: (requestId: string, newStatus: RequestStatus, driverId?: string) => void;
  onSelectTrackRequest: (requestId: string) => void;
}

const STATUSES: RequestStatus[] = [
  'submitted',
  'assigned',
  'on_the_way',
  'completed',
  'cancelled',
];

const STATUS_BADGE: Record<RequestStatus, { bg: string; text: string; border: string }> = {
  submitted: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  assigned: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  on_the_way: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

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
  const [assigningRequestId, setAssigningRequestId] = useState<string | null>(null);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.pickupAddress && req.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategoryFilter === 'all' || req.category === selectedCategoryFilter;
    const matchesStatus = selectedStatusFilter === 'all' || req.status === selectedStatusFilter;
    const matchesZone = selectedZoneFilter === 'all' || req.cityZone === selectedZoneFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesZone;
  });

  // Quick Stats Calculation
  const totalActive = requests.filter((r) => r.status !== 'completed' && r.status !== 'cancelled').length;
  const completedCount = requests.filter((r) => r.status === 'completed').length;
  const pendingAssignment = requests.filter((r) => r.status === 'submitted').length;
  const totalKg = requests.reduce((acc, r) => acc + r.estimatedWeightKg, 0);
  const totalCo2 = requests.reduce((acc, r) => acc + r.co2OffsetKg, 0);

  const exportCSV = () => {
    const headers = 'TrackingCode,Category,WeightKg,Zone,Address,Contact,Phone,Status,EcoPoints,CreatedAt\n';
    const rows = filteredRequests
      .map(
        (r) =>
          `"${r.trackingCode}","${r.category}",${r.estimatedWeightKg},"${r.cityZone}","${r.pickupAddress}","${r.contactName}","${r.contactPhone}","${r.status}",${r.ecoPointsEarned},"${r.createdAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecoloop-requests-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Title & Ops Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              Pune Municipal Waste Logistics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Municipal Operations Console
          </h1>
          <p className="mt-1 text-gray-500 text-xs sm:text-sm">
            Live dispatcher hub: assign electric collection vehicles, advance pickup statuses, and track diversion KPIs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Active Pickups',
            value: totalActive,
            sub: 'Pending or In-Transit',
            icon: Package,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
          },
          {
            label: 'Pending Assignment',
            value: pendingAssignment,
            sub: 'Require driver allocation',
            icon: AlertCircle,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
          },
          {
            label: 'Total Diverted',
            value: `${totalKg.toFixed(0)} kg`,
            sub: 'Recycled waste tonnage',
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
          {
            label: 'CO₂ Emissions Offset',
            value: `${totalCo2.toFixed(1)} kg`,
            sub: 'Carbon credit equivalency',
            icon: CheckCircle2,
            color: 'text-teal-600',
            bg: 'bg-teal-50',
          },
        ].map((stat) => (
          <div key={stat.label} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</span>
              <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</p>
            <p className="text-[11px] text-gray-400 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs mb-6 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by code (e.g. ECO-1234), citizen name, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Materials</option>
              {(Object.keys(WASTE_CATEGORIES) as WasteCategory[]).map((c) => (
                <option key={c} value={c}>
                  {WASTE_CATEGORIES[c].name.split('(')[0].trim()}
                </option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>

            <select
              value={selectedZoneFilter}
              onChange={(e) => setSelectedZoneFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Pune Wards</option>
              {PUNE_ZONES.map((z) => (
                <option key={z} value={z}>
                  {z.split(',')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count Bar */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
          <span>
            Showing <strong className="text-gray-700">{filteredRequests.length}</strong> of{' '}
            <strong className="text-gray-700">{requests.length}</strong> requests
          </span>
          {(searchQuery || selectedCategoryFilter !== 'all' || selectedStatusFilter !== 'all' || selectedZoneFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryFilter('all');
                setSelectedStatusFilter('all');
                setSelectedZoneFilter('all');
              }}
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Main Requests Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden mb-8">
        {filteredRequests.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-bold">No matching pickup records found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-left">
                  <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tracking / Citizen</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Material Class</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Weight & Reward</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ward & Address</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Dispatch Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((req) => {
                  const badge = STATUS_BADGE[req.status] || STATUS_BADGE.submitted;
                  const isFinished = req.status === 'completed' || req.status === 'cancelled';

                  return (
                    <tr key={req.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Tracking code & Citizen */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono font-black text-gray-900 text-sm">
                            {req.trackingCode}
                          </span>
                          <span className="text-xs text-gray-600 font-semibold">{req.contactName || 'Citizen'}</span>
                          <span className="text-[10px] text-gray-400">{req.contactPhone || '—'}</span>
                        </div>
                      </td>

                      {/* Material */}
                      <td className="px-5 py-4">
                        <span className="font-bold text-gray-800 capitalize block">
                          {req.category}
                        </span>
                        <span className="text-[11px] text-gray-400 line-clamp-1">
                          {req.itemDescription || '—'}
                        </span>
                      </td>

                      {/* Weight & EcoPoints */}
                      <td className="px-5 py-4">
                        <span className="font-extrabold text-gray-900 block">{req.estimatedWeightKg} kg</span>
                        <span className="text-[10px] font-bold text-emerald-600">+{req.ecoPointsEarned} pts</span>
                      </td>

                      {/* Ward */}
                      <td className="px-5 py-4">
                        <span className="font-bold text-gray-800 block">{req.cityZone?.split(',')[0]}</span>
                        <span className="text-[10px] text-gray-400 line-clamp-1">{req.pickupAddress}</span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {req.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {!isFinished ? (
                            <>
                              {req.status === 'submitted' && (
                                <button
                                  onClick={() => setAssigningRequestId(req.id)}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <UserCheck className="h-3 w-3" />
                                  <span>Assign</span>
                                </button>
                              )}

                              {req.status !== 'submitted' && (
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) onRequestStatusChange(req.id, e.target.value as RequestStatus);
                                  }}
                                  defaultValue=""
                                  className="px-2 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 border border-gray-200 text-gray-700 cursor-pointer"
                                >
                                  <option value="" disabled>
                                    Advance Status →
                                  </option>
                                  {STATUSES.slice(STATUSES.indexOf(req.status) + 1).map((s) => (
                                    <option key={s} value={s}>
                                      {s.replace(/_/g, ' ').toUpperCase()}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-gray-400 font-medium">Completed</span>
                          )}

                          <a
                            href="/"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="View tracking"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Driver Assignment Modal */}
      {assigningRequestId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setAssigningRequestId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900">Assign Municipal Collector</h3>
              <button
                onClick={() => setAssigningRequestId(null)}
                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Select an available electric collection vehicle driver for this dispatch.
            </p>

            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {drivers.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    onRequestStatusChange(assigningRequestId, 'assigned', d.id);
                    setAssigningRequestId(null);
                  }}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center font-black text-indigo-700 text-sm">
                    {d.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-gray-900 group-hover:text-indigo-700 transition-colors">
                      {d.name}
                    </p>
                    <p className="text-xs text-gray-500">{d.vehicleType} · {d.vehicleNumber}</p>
                  </div>
                  <span className="text-xs text-amber-500 font-bold">★ {d.rating}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fleet Overview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <Truck className="h-5 w-5 text-indigo-600" />
            <span>Active Collection Fleet (Pune PMC)</span>
          </h2>
          <span className="text-xs font-bold text-gray-500">{drivers.length} Vehicles Online</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((d) => (
            <div key={d.id} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center font-black text-white text-sm shadow-xs">
                  {d.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="font-extrabold text-gray-900">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.vehicleType}</p>
                </div>
                <span className="text-xs font-bold text-amber-500">★ {d.rating}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs font-mono">
                <span className="text-gray-400 font-sans font-semibold">{d.vehicleNumber}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    d.status === 'available'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                  }`}
                >
                  {d.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
