'use client';

import React, { useState } from 'react';
import {
  History,
  CheckCircle2,
  Calendar,
  Award,
  Download,
  Share2,
  RotateCcw,
  Recycle,
  Leaf,
  FileText,
  X,
  Package,
} from 'lucide-react';
import { WastePickupRequest } from '@/types/waste';
import { WASTE_CATEGORIES } from '@/constants/wasteCategories';

interface PickupHistoryProps {
  requests: WastePickupRequest[];
  onSelectTrackRequest: (id: string) => void;
  onRepeatPickup: (request: WastePickupRequest) => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
  organic: '🌿', plastic: '♻️', ewaste: '🔋', hazardous: '⚠️', paper: '📄', metal: '🔩',
};

export const PickupHistory: React.FC<PickupHistoryProps> = ({
  requests,
  onSelectTrackRequest,
  onRepeatPickup,
}) => {
  const [activeCertModal, setActiveCertModal] = useState<WastePickupRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed'>('all');

  const displayed = filterStatus === 'completed'
    ? requests.filter((r) => r.status === 'completed')
    : requests;

  const completedCount = requests.filter((r) => r.status === 'completed').length;
  const totalKg = requests.reduce((acc, r) => acc + r.estimatedWeightKg, 0);
  const totalCo2 = requests.reduce((acc, r) => acc + r.co2OffsetKg, 0);

  return (
    <div className="w-full min-h-[calc(100vh-4.5rem)] bg-gradient-to-b from-[#f8faf9] to-[#edf3ef] py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Full-width Header */}
        <div className="mb-8 pb-6 border-b border-gray-200/80">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
              Recycling Ledger
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Doorstep Pickup History
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            Your verified municipal recycling records, environmental impact, and digital certificates.
          </p>
        </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-extrabold text-gray-900">{requests.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Total Pickups</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-extrabold text-emerald-600">{totalKg.toFixed(1)} <span className="text-sm font-normal text-gray-400">kg</span></p>
          <p className="text-xs text-gray-400 mt-0.5">Waste Diverted</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-extrabold text-teal-600">{totalCo2.toFixed(1)} <span className="text-sm font-normal text-gray-400">kg</span></p>
          <p className="text-xs text-gray-400 mt-0.5">CO₂ Saved</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            filterStatus === 'all' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
          }`}>
          All ({requests.length})
        </button>
        <button onClick={() => setFilterStatus('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            filterStatus === 'completed' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:bg-gray-100'
          }`}>
          Completed ({completedCount})
        </button>
      </div>

      {/* Request List */}
      {displayed.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No pickups yet</p>
          <p className="text-sm text-gray-300 mt-1">Schedule your first waste pickup to see it here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((req) => (
            <div key={req.id} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg">
                    {CATEGORY_EMOJI[req.category] || '📦'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{req.trackingCode}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        req.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {req.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 capitalize">{req.category} · {req.estimatedWeightKg} kg · {req.scheduledDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {req.status === 'completed' && req.certificateId && (
                    <button onClick={() => setActiveCertModal(req)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer">
                      <Award className="h-3.5 w-3.5" /> Certificate
                    </button>
                  )}
                  <button onClick={() => onRepeatPickup(req)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 cursor-pointer">
                    <RotateCcw className="h-3.5 w-3.5" /> Repeat
                  </button>
                  {req.status !== 'completed' && (
                    <button onClick={() => onSelectTrackRequest(req.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer">
                      Track
                    </button>
                  )}
                </div>
              </div>

              {/* Impact mini bar */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Leaf className="h-3 w-3 text-emerald-500" /> +{req.ecoPointsEarned} pts</span>
                <span className="flex items-center gap-1"><Recycle className="h-3 w-3 text-teal-500" /> ~{req.co2OffsetKg.toFixed(1)} kg CO₂</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {req.cityZone?.split(',')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {activeCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setActiveCertModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveCertModal(null)} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">Green Recycling Certificate</h3>
              <p className="text-sm text-gray-400 mt-1">Verified digital certificate of responsible waste disposal</p>
            </div>

            <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Certificate ID</span>
                <span className="font-semibold text-gray-900">{activeCertModal.certificateId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tracking Code</span>
                <span className="font-semibold text-gray-900">{activeCertModal.trackingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Material</span>
                <span className="font-semibold text-gray-900 capitalize">{activeCertModal.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Weight Recycled</span>
                <span className="font-semibold text-emerald-600">{activeCertModal.estimatedWeightKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">CO₂ Offset</span>
                <span className="font-semibold text-teal-600">{activeCertModal.co2OffsetKg.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Completed On</span>
                <span className="font-semibold text-gray-900">{activeCertModal.completedAt ? new Date(activeCertModal.completedAt).toLocaleDateString() : '—'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold cursor-pointer flex items-center justify-center gap-2">
                <Download className="h-4 w-4" /> Download PDF
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
