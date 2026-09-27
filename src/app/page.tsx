'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from '@/components/Navbar';
import { BookingWizard } from '@/components/BookingWizard';
import { LiveTracker } from '@/components/LiveTracker';
import { AdminDashboard } from '@/components/AdminDashboard';
import { PickupHistory } from '@/components/PickupHistory';
import { CityAnalytics } from '@/components/CityAnalytics';
import { AiWasteScannerModal } from '@/components/AiWasteScannerModal';
import { SocialPosterModal } from '@/components/SocialPosterModal';
import {
  getStoredRequests,
  saveStoredRequests,
  getStoredDrivers,
  saveStoredDrivers,
  getStoredProfile,
  saveStoredProfile,
} from '@/lib/storage';
import { WastePickupRequest, CollectorDriver, CitizenImpactProfile, RequestStatus, WasteCategory } from '@/types/waste';
import { CheckCircle2, Sparkles, MapPin, Truck } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('request');
  const [requests, setRequests] = useState<WastePickupRequest[]>([]);
  const [drivers, setDrivers] = useState<CollectorDriver[]>([]);
  const [userProfile, setUserProfile] = useState<CitizenImpactProfile>(getStoredProfile());

  // Modals state
  const [isAiScannerOpen, setIsAiScannerOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  // Selected request for LiveTracker
  const [selectedRequestId, setSelectedRequestId] = useState<string | undefined>(undefined);

  // Prefill state from AI Scanner
  const [prefilledCategory, setPrefilledCategory] = useState<WasteCategory | undefined>(undefined);
  const [prefilledDescription, setPrefilledDescription] = useState<string | undefined>(undefined);
  const [prefilledWeight, setPrefilledWeight] = useState<number | undefined>(undefined);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadedRequests = getStoredRequests();
    const loadedDrivers = getStoredDrivers();
    const loadedProfile = getStoredProfile();

    setRequests(loadedRequests);
    setDrivers(loadedDrivers);
    setUserProfile(loadedProfile);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add new pickup request
  const handleNewRequestSuccess = (newRequest: WastePickupRequest) => {
    const updated = [newRequest, ...requests];
    setRequests(updated);
    saveStoredRequests(updated);

    // Update user profile points
    const updatedProfile: CitizenImpactProfile = {
      ...userProfile,
      ecoPoints: userProfile.ecoPoints + newRequest.ecoPointsEarned,
      totalPickups: userProfile.totalPickups + 1,
      totalKgRecycled: Number((userProfile.totalKgRecycled + newRequest.estimatedWeightKg).toFixed(1)),
      co2SavedKg: Number((userProfile.co2SavedKg + newRequest.co2OffsetKg).toFixed(1)),
    };
    setUserProfile(updatedProfile);
    saveStoredProfile(updatedProfile);

    setSelectedRequestId(newRequest.id);
    showToast(`Request ${newRequest.trackingCode} scheduled! Switched to Live Tracking.`);
    setActiveTab('track');
  };

  // Admin changes status
  const handleRequestStatusChange = (
    requestId: string,
    newStatus: RequestStatus,
    driverId?: string
  ) => {
    const updated = requests.map((req) => {
      if (req.id !== requestId) return req;

      let assignedDriver = req.driver;
      if (driverId) {
        const found = drivers.find((d) => d.id === driverId);
        if (found) {
          assignedDriver = {
            id: found.id,
            name: found.name,
            phone: found.phone,
            vehicleNumber: found.vehicleNumber,
            avatar: found.avatar,
            etaMinutes: 20,
          };
        }
      }

      return {
        ...req,
        status: newStatus,
        driver: assignedDriver,
        completedAt: newStatus === 'completed' ? new Date().toISOString() : req.completedAt,
        certificateId:
          newStatus === 'completed' && !req.certificateId
            ? `REC-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`
            : req.certificateId,
      };
    });

    setRequests(updated);
    saveStoredRequests(updated);
    showToast(`Request status updated to ${newStatus.replace(/_/g, ' ')}!`);
  };

  // AI Scanner detection handler
  const handleApplyDetectedWaste = (data: {
    category: WasteCategory;
    description: string;
    weight: number;
  }) => {
    setPrefilledCategory(data.category);
    setPrefilledDescription(data.description);
    setPrefilledWeight(data.weight);
    setActiveTab('request');
    showToast(`EcoAI detected ${data.category.toUpperCase()}! Form prefilled.`);
  };

  // Repeat request from history
  const handleRepeatPickup = (oldReq: WastePickupRequest) => {
    setPrefilledCategory(oldReq.category);
    setPrefilledDescription(oldReq.itemDescription);
    setPrefilledWeight(oldReq.estimatedWeightKg);
    setActiveTab('request');
    showToast(`Loaded details from ${oldReq.trackingCode}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl shadow-emerald-500/40">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main High-Tech Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiScanner={() => setIsAiScannerOpen(true)}
        onOpenSocialModal={() => setIsSocialModalOpen(true)}
        userProfile={userProfile}
      />

      {/* Active Tab Viewport */}
      <main className="flex-1 pb-16">
        {activeTab === 'request' && (
          <BookingWizard
            onSuccess={handleNewRequestSuccess}
            onOpenAiScanner={() => setIsAiScannerOpen(true)}
            prefilledCategory={prefilledCategory}
            prefilledDescription={prefilledDescription}
            prefilledWeight={prefilledWeight}
          />
        )}

        {activeTab === 'track' && (
          <LiveTracker
            requests={requests}
            selectedRequestId={selectedRequestId}
            onRequestSelect={(id) => setSelectedRequestId(id)}
            onOpenNewBooking={() => setActiveTab('request')}
          />
        )}

        {activeTab === 'history' && (
          <PickupHistory
            requests={requests}
            onSelectTrackRequest={(id) => {
              setSelectedRequestId(id);
              setActiveTab('track');
            }}
            onRepeatPickup={handleRepeatPickup}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            requests={requests}
            drivers={drivers}
            onRequestStatusChange={handleRequestStatusChange}
            onSelectTrackRequest={(id) => {
              setSelectedRequestId(id);
              setActiveTab('track');
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <CityAnalytics requests={requests} userProfile={userProfile} />
        )}
      </main>

      {/* AI Scanner Modal */}
      <AiWasteScannerModal
        isOpen={isAiScannerOpen}
        onClose={() => setIsAiScannerOpen(false)}
        onApplyDetectedWaste={handleApplyDetectedWaste}
      />

      {/* Social Media & Official Poster Modal */}
      <SocialPosterModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
      />

      {/* Footer with Mandatory Flora Institute & GDG Pune Accreditation */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">FITFEST ECOLOOP</span>
            <span>• Problem Statement 4</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Flora Institute of Technology • @gdg.fit.pune • @the_flora_institutes
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={() => setIsSocialModalOpen(true)}
              className="text-emerald-400 hover:underline cursor-pointer"
            >
              View Poster & Social Copy
            </button>
            <span>•</span>
            <span className="text-slate-400">Deployed on Google Cloud Run</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
