'use client';

import React, { useState } from 'react';
import {
  History,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Download,
  Share2,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { WastePickupRequest } from '@/types/waste';
import { WASTE_CATEGORIES } from '@/constants/wasteCategories';

interface PickupHistoryProps {
  requests: WastePickupRequest[];
  onSelectTrackRequest: (id: string) => void;
  onRepeatPickup: (request: WastePickupRequest) => void;
}

export const PickupHistory: React.FC<PickupHistoryProps> = ({
  requests,
  onSelectTrackRequest,
  onRepeatPickup,
}) => {
  const [activeCertModal, setActiveCertModal] = useState<WastePickupRequest | null>(null);

  const completedRequests = requests.filter((r) => r.status === 'completed');
  const pastRequests = requests;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <History className="h-5 w-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Pickup History & Green Records
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete historical audit of your diverted waste, digital certificates, and lifetime carbon savings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Recycled Trips</span>
            <span className="text-base font-extrabold text-emerald-400 block">{completedRequests.length} Finished</span>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {pastRequests.map((req) => {
          const cat = WASTE_CATEGORIES[req.category];
          const isCompleted = req.status === 'completed';

          return (
            <div
              key={req.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${cat.accentBg} shrink-0`}>
                  <Layers className="h-6 w-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{req.trackingCode}</span>
                    <span className="text-xs font-semibold text-emerald-400 capitalize bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                      {req.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : req.status === 'on_the_way'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {req.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1">{req.itemDescription}</p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      {new Date(req.scheduledDate).toLocaleDateString()} ({req.scheduledSlot.split('(')[0]})
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-300">
                      Weight: {req.estimatedWeightKg} kg
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">
                      +{req.ecoPointsEarned} EcoPoints
                    </span>
                    <span>•</span>
                    <span className="text-cyan-400">
                      ~{req.co2OffsetKg} kg CO₂ Saved
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {isCompleted && (
                  <button
                    onClick={() => setActiveCertModal(req)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Award className="h-3.5 w-3.5 text-emerald-400" />
                    <span>View Certificate</span>
                  </button>
                )}

                <button
                  onClick={() => onSelectTrackRequest(req.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Track Pipeline
                </button>

                <button
                  onClick={() => onRepeatPickup(req)}
                  title="Schedule this pickup again"
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* VERIFIABLE DIGITAL RECYCLING CERTIFICATE MODAL */}
      {activeCertModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 space-y-4 shadow-2xl relative">
            <div className="text-center pb-3 border-b border-slate-800">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/30">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-black text-white">Green Recycling Certificate</h3>
              <p className="text-xs text-emerald-400 font-mono mt-0.5">
                {activeCertModal.certificateId || 'REC-CERT-2026-FIT'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Awarded To:</span>
                <span className="font-bold text-white">{activeCertModal.contactName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Waste Material:</span>
                <span className="font-bold text-emerald-400 capitalize">{activeCertModal.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Certified Weight:</span>
                <span className="font-bold text-white">{activeCertModal.estimatedWeightKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verified CO₂ Abatement:</span>
                <span className="font-bold text-cyan-400">{activeCertModal.co2OffsetKg} kg CO₂</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Depot Facility:</span>
                <span className="font-semibold text-slate-300">Flora Tech EcoLoop Recycling Hub</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Cryptographically verified on municipal ledger</span>
              <span className="text-emerald-400 font-bold">100% Landfill Diverted</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => alert('Certificate downloaded as PDF!')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => setActiveCertModal(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
