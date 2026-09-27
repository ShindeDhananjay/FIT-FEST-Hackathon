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
  Edit3,
  Save,
  Calendar,
} from 'lucide-react';
import { WastePickupRequest, CollectorDriver, RequestStatus, WasteCategory } from '@/types/waste';
import { WASTE_CATEGORIES, PUNE_ZONES } from '@/constants/wasteCategories';

interface AdminDashboardProps {
  requests: WastePickupRequest[];
  drivers: CollectorDriver[];
  onRequestStatusChange: (requestId: string, newStatus: RequestStatus, driverId?: string) => void;
  onRequestUpdate?: (updatedRequest: WastePickupRequest) => void;
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
  onRequestUpdate,
  onSelectTrackRequest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');
  const [assigningRequestId, setAssigningRequestId] = useState<string | null>(null);

  // Edit/Update Modal State
  const [editingRequest, setEditingRequest] = useState<WastePickupRequest | null>(null);
  const [editCategory, setEditCategory] = useState<WasteCategory>('plastic');
  const [editWeight, setEditWeight] = useState<number>(5);
  const [editDescription, setEditDescription] = useState<string>('');
  const [editZone, setEditZone] = useState<string>('Flora Institute of Technology Campus');
  const [editAddress, setEditAddress] = useState<string>('');
  const [editContactName, setEditContactName] = useState<string>('');
  const [editContactPhone, setEditContactPhone] = useState<string>('');
  const [editScheduledDate, setEditScheduledDate] = useState<string>('');
  const [editScheduledSlot, setEditScheduledSlot] = useState<string>('');
  const [editStatus, setEditStatus] = useState<RequestStatus>('submitted');
  const [editDriverId, setEditDriverId] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const handleOpenEdit = (req: WastePickupRequest) => {
    setEditingRequest(req);
    setEditCategory(req.category);
    setEditWeight(req.estimatedWeightKg);
    setEditDescription(req.itemDescription || '');
    setEditZone(req.cityZone);
    setEditAddress(req.pickupAddress || '');
    setEditContactName(req.contactName || '');
    setEditContactPhone(req.contactPhone || '');
    setEditScheduledDate(req.scheduledDate || '');
    setEditScheduledSlot(req.scheduledSlot || '');
    setEditStatus(req.status);
    setEditDriverId(req.driver?.id || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRequest) return;

    const catInfo = WASTE_CATEGORIES[editCategory];
    const co2PerKg = catInfo ? catInfo.co2Factor : 1.5;
    const pointsPerKg = catInfo ? catInfo.ecoPointsPerKg : 15;

    let assignedDriver = editingRequest.driver;
    if (editDriverId) {
      const foundDriver = drivers.find((d) => d.id === editDriverId);
      if (foundDriver) {
        assignedDriver = {
          id: foundDriver.id,
          name: foundDriver.name,
          phone: foundDriver.phone,
          vehicleNumber: foundDriver.vehicleNumber,
          avatar: foundDriver.avatar,
          etaMinutes: 15,
        };
      }
    } else if (editStatus === 'submitted') {
      assignedDriver = undefined;
    }

    const updated: WastePickupRequest = {
      ...editingRequest,
      category: editCategory,
      estimatedWeightKg: Number(editWeight),
      itemDescription: editDescription,
      cityZone: editZone,
      pickupAddress: editAddress,
      contactName: editContactName,
      contactPhone: editContactPhone,
      scheduledDate: editScheduledDate,
      scheduledSlot: editScheduledSlot,
      status: editStatus,
      driver: assignedDriver,
      ecoPointsEarned: Math.round(Number(editWeight) * pointsPerKg),
      co2OffsetKg: Number((Number(editWeight) * co2PerKg).toFixed(1)),
      completedAt:
        editStatus === 'completed' && !editingRequest.completedAt
          ? new Date().toISOString()
          : editingRequest.completedAt,
    };

    if (onRequestUpdate) {
      onRequestUpdate(updated);
    } else {
      onRequestStatusChange(updated.id, updated.status, assignedDriver?.id);
    }

    setSaveSuccessMsg(`Updated ${updated.trackingCode} successfully!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
    setEditingRequest(null);
  };

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
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-4 lg:px-6">
      
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
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
          <div key={stat.label} className="p-3 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1 sm:space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</span>
              <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{stat.value}</p>
            <p className="text-[11px] text-gray-400 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter and Search Controls */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white border border-gray-100 shadow-xs mb-4 sm:mb-6 space-y-3">
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

          <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-2">
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
          <div className="overflow-x-auto -mx-0">
            <table className="w-full text-xs min-w-[640px]">
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
                          {/* Edit / Update Entry Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(req)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 hover:border-indigo-300 shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                            title="Edit or update this pickup entry"
                          >
                            <Edit3 className="h-3 w-3 text-indigo-600" />
                            <span>Edit</span>
                          </button>

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

      {/* Edit / Update Request Modal */}
      {editingRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setEditingRequest(null)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-xl w-full p-4 sm:p-6 lg:p-7 space-y-4 sm:space-y-5 my-4 sm:my-8 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Edit3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    Edit Pickup Entry: {editingRequest.trackingCode}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Update waste details, weight, dispatch status & logistics assignment.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingRequest(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              
              {/* Category & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Material Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as WasteCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {Object.values(WASTE_CATEGORIES).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.ecoPointsPerKg} pts/kg)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Estimated Weight (Kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={editWeight}
                    onChange={(e) => setEditWeight(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Item Description */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Item Description
                </label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="e.g. Cardboard boxes and study notes"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Zone and Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Pune Municipal Ward / Zone
                  </label>
                  <select
                    value={editZone}
                    onChange={(e) => setEditZone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {PUNE_ZONES.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Pickup Address
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="Doorstep address"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Citizen Contact Name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Citizen Contact Name
                  </label>
                  <input
                    type="text"
                    value={editContactName}
                    onChange={(e) => setEditContactName(e.target.value)}
                    placeholder="Contact Name"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Citizen Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editContactPhone}
                    onChange={(e) => setEditContactPhone(e.target.value)}
                    placeholder="+91 98220 00000"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status & Assigned Driver */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Dispatch Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as RequestStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st.replace(/_/g, ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Assigned Municipal Collector
                  </label>
                  <select
                    value={editDriverId}
                    onChange={(e) => setEditDriverId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">— Unassigned (Auto Allocate) —</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.vehicleNumber} · {d.vehicleType})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Schedule Date & Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={editScheduledDate}
                    onChange={(e) => setEditScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={editScheduledSlot}
                    onChange={(e) => setEditScheduledSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (01:00 PM - 04:00 PM)">Afternoon (01:00 PM - 04:00 PM)</option>
                    <option value="Evening (04:30 PM - 07:30 PM)">Evening (04:30 PM - 07:30 PM)</option>
                  </select>
                </div>
              </div>

              {/* Recalculated Impact Preview */}
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-indigo-950">
                <span className="font-semibold">Calculated Impact:</span>
                <span className="font-bold">
                  +{Math.round(editWeight * (WASTE_CATEGORIES[editCategory]?.ecoPointsPerKg || 15))} EcoPoints · ~{((editWeight) * (WASTE_CATEGORIES[editCategory]?.co2Factor || 1.5)).toFixed(1)} kg CO₂ Saved
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingRequest(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/30">
            <CheckCircle2 className="h-4 w-4" />
            <span>{saveSuccessMsg}</span>
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
