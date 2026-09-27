'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import { LandingPage } from '@/components/LandingPage';
import { Navbar, ActiveTab } from '@/components/Navbar';
import { BookingWizard } from '@/components/BookingWizard';
import { LiveTracker } from '@/components/LiveTracker';
import { PickupHistory } from '@/components/PickupHistory';
import { CityAnalytics } from '@/components/CityAnalytics';
import { AiWasteScannerModal } from '@/components/AiWasteScannerModal';
import { SocialPosterModal } from '@/components/SocialPosterModal';
import { ChatbotModal } from '@/components/ChatbotModal';
import { CitizenLoginPage, DEMO_CITIZEN_USER } from '@/components/CitizenLoginPage';
import { DriverDashboard } from '@/components/DriverDashboard';
import {
  getStoredRequests,
  saveStoredRequests,
  getStoredDrivers,
  getStoredProfile,
  saveStoredProfile,
  getStoredCitizenUser,
  saveStoredCitizenUser,
  getStoredActiveDriver,
  saveStoredActiveDriver,
} from '@/lib/storage';
import { WastePickupRequest, CollectorDriver, CitizenImpactProfile, RequestStatus, WasteCategory, CitizenUser } from '@/types/waste';
import { getApiUrl } from '@/lib/api';
import { playLoginWelcomeVoice } from '@/lib/voice';
import { CheckCircle2, Bot } from 'lucide-react';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [requests, setRequests] = useState<WastePickupRequest[]>([]);
  const [drivers, setDrivers] = useState<CollectorDriver[]>([]);
  const [userProfile, setUserProfile] = useState<CitizenImpactProfile>(getStoredProfile());
  const [citizenUser, setCitizenUser] = useState<CitizenUser | null>(null);
  const [activeDriver, setActiveDriver] = useState<CollectorDriver | null>(null);
  const [dbConnected, setDbConnected] = useState<boolean>(true);

  // Modals state
  const [isAiScannerOpen, setIsAiScannerOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatScannedContext, setChatScannedContext] = useState<any>(null);

  // Prefill state from AI Scanner
  const [prefilledCategory, setPrefilledCategory] = useState<WasteCategory | undefined>(undefined);
  const [prefilledDescription, setPrefilledDescription] = useState<string | undefined>(undefined);
  const [prefilledWeight, setPrefilledWeight] = useState<number | undefined>(undefined);

  // Gated navigation target (remembers where user wanted to go before login)
  const [pendingTab, setPendingTab] = useState<ActiveTab>('request');

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch from MongoDB Atlas API with fallback
  useEffect(() => {
    const localRequests = getStoredRequests();
    const localDrivers = getStoredDrivers();
    const localProfile = getStoredProfile();
    const localCitizen = getStoredCitizenUser();
    const localActiveDriver = getStoredActiveDriver();

    setRequests(localRequests);
    setDrivers(localDrivers);
    setUserProfile(localProfile);
    setCitizenUser(localCitizen);
    if (localActiveDriver) {
      setActiveDriver(localActiveDriver);
    }

    // Check URL query parameters for ?tab=
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as ActiveTab | null;
      if (tabParam && tabParam !== 'home') {
        if (!localCitizen) {
          setPendingTab(tabParam);
          setActiveTab('login');
        } else {
          setActiveTab(tabParam);
        }
      }
    }

    // Test MongoDB Atlas connection
    fetch(getApiUrl('/api/db-status'))
      .then((res) => res.json())
      .then((data) => {
        if (data.connected) {
          setDbConnected(true);
        } else {
          setDbConnected(false);
        }
      })
      .catch(() => setDbConnected(false));

    // Fetch live requests from MongoDB Atlas
    fetch(getApiUrl('/api/requests'))
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data && resData.data.length > 0) {
          setRequests(resData.data);
          saveStoredRequests(resData.data);
        }
      })
      .catch((err) => {
        console.warn('Using local requests cache:', err);
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Centralized navigation gate — any non-home tab requires citizen login
  const handleNavigate = (targetTab: ActiveTab) => {
    if (targetTab === 'home') {
      setActiveTab('home');
      return;
    }
    if (targetTab === 'login') {
      setActiveTab('login');
      return;
    }
    if (!citizenUser) {
      setPendingTab(targetTab);
      setActiveTab('login');
      const tabLabels: Record<string, string> = {
        request: 'request a pickup',
        track: 'track pickups live',
        history: 'view pickup history',
        analytics: 'view impact & EcoPoints',
      };
      showToast(`Please sign in first to ${tabLabels[targetTab] || 'proceed'}.`);
    } else {
      setActiveTab(targetTab);
    }
  };

  // AI Scanner gate — requires citizen login
  const handleOpenAiScanner = () => {
    if (!citizenUser) {
      setPendingTab('request');
      setActiveTab('login');
      showToast('Please sign in first to use the AI Waste Scanner.');
    } else {
      setIsAiScannerOpen(true);
    }
  };

  // Start pickup gate - calls centralized gate with optional pre-selected category
  const handleStartPickup = (category?: WasteCategory) => {
    if (category) {
      setPrefilledCategory(category);
    }
    handleNavigate('request');
  };

  // Successful citizen login — forwards to pending tab and plays natural male voice note
  const handleLoginSuccess = (user: CitizenUser) => {
    setCitizenUser(user);
    saveStoredCitizenUser(user);
    setUserProfile((prev) => ({
      ...prev,
      name: user.name,
      email: user.email || prev.email,
      phone: user.phone,
    }));
    showToast(`Welcome back, ${user.name}!`);

    // Voice note: "Hello, welcome back [Name]. Your current score is [Points] points. Keep settling up garbage and earn rewards!"
    playLoginWelcomeVoice(user.name, user.ecoPoints);

    const destination = pendingTab && pendingTab !== 'login' ? pendingTab : 'request';
    setActiveTab(destination);
    setPendingTab('request');
  };

  // Citizen sign out
  const handleLogout = () => {
    setCitizenUser(null);
    saveStoredCitizenUser(null);
    showToast('Signed out of citizen session.');
    setActiveTab('home');
  };

  // Successful driver login
  const handleDriverLoginSuccess = (driver: CollectorDriver) => {
    setActiveDriver(driver);
    saveStoredActiveDriver(driver);
    showToast(`Welcome back, Delivery Partner ${driver.name}!`);
  };

  // Driver sign out
  const handleDriverLogout = () => {
    setActiveDriver(null);
    saveStoredActiveDriver(null);
    showToast('Signed out of driver console.');
    setActiveTab('home');
  };

  // Add new pickup request
  const handleNewRequestSuccess = async (newRequest: WastePickupRequest) => {
    const updated = [newRequest, ...requests];
    setRequests(updated);
    saveStoredRequests(updated);

    const updatedProfile: CitizenImpactProfile = {
      ...userProfile,
      ecoPoints: userProfile.ecoPoints + newRequest.ecoPointsEarned,
      totalPickups: userProfile.totalPickups + 1,
      totalKgRecycled: Number((userProfile.totalKgRecycled + newRequest.estimatedWeightKg).toFixed(1)),
      co2SavedKg: Number((userProfile.co2SavedKg + newRequest.co2OffsetKg).toFixed(1)),
    };
    setUserProfile(updatedProfile);
    saveStoredProfile(updatedProfile);

    showToast(`Request ${newRequest.trackingCode} created! Tracking is now live.`);
    setActiveTab('track');

    try {
      await fetch(getApiUrl('/api/requests'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest),
      });
    } catch (err) {
      console.error('Failed syncing new request to MongoDB Atlas', err);
    }
  };

  // Redeem circular recycled reward
  const handleRedeemReward = (reward: any) => {
    if (!citizenUser) return;
    const newPoints = Math.max(0, (citizenUser.ecoPoints || userProfile.ecoPoints) - reward.points);
    const updatedProfile = {
      ...userProfile,
      ecoPoints: newPoints,
    };
    setUserProfile(updatedProfile);
    saveStoredProfile(updatedProfile);

    const updatedUser = {
      ...citizenUser,
      ecoPoints: newPoints,
    };
    setCitizenUser(updatedUser);
    saveStoredCitizenUser(updatedUser);

    showToast(`Claimed ${reward.title}! ${reward.points} EcoPoints redeemed.`);
  };

  // Admin changes status
  const handleRequestStatusChange = async (
    requestId: string,
    newStatus: RequestStatus,
    driverId?: string
  ) => {
    let assignedDriverInfo: any = undefined;

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
          assignedDriverInfo = assignedDriver;
        }
      }

      const completedAt = newStatus === 'completed' ? new Date().toISOString() : req.completedAt;
      const certificateId =
        newStatus === 'completed' && !req.certificateId
          ? `REC-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`
          : req.certificateId;

      return {
        ...req,
        status: newStatus,
        driver: assignedDriver,
        completedAt,
        certificateId,
      };
    });

    setRequests(updated);
    saveStoredRequests(updated);
    showToast(`Status updated to ${newStatus.replace(/_/g, ' ')}`);

    try {
      const targetReq = updated.find((r) => r.id === requestId);
      await fetch(getApiUrl('/api/requests'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: requestId,
          status: newStatus,
          driver: assignedDriverInfo,
          completedAt: targetReq?.completedAt,
          certificateId: targetReq?.certificateId,
        }),
      });
    } catch (err) {
      console.error('Failed patching request in MongoDB Atlas', err);
    }
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
    if (!citizenUser) {
      setPendingTab('request');
      setActiveTab('login');
      showToast(`AI detected ${data.category.toUpperCase()}! Sign in to book.`);
    } else {
      setActiveTab('request');
      showToast(`AI detected ${data.category.toUpperCase()}! Form prefilled.`);
    }
  };

  // Repeat request from history
  const handleRepeatPickup = (oldReq: WastePickupRequest) => {
    setPrefilledCategory(oldReq.category);
    setPrefilledDescription(oldReq.itemDescription);
    setPrefilledWeight(oldReq.estimatedWeightKg);
    if (!citizenUser) {
      setPendingTab('request');
      setActiveTab('login');
      showToast('Please sign in first to repeat this pickup.');
    } else {
      setActiveTab('request');
      showToast(`Loaded details from ${oldReq.trackingCode}`);
    }
  };

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  // --- RENDER ---

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Active delivery partner dashboard view
  if (activeDriver) {
    return (
      <DriverDashboard
        driver={activeDriver}
        requests={requests}
        onRequestUpdate={(updated) => {
          setRequests(updated);
          saveStoredRequests(updated);
        }}
        onLogout={handleDriverLogout}
        onSwitchToCitizen={() => {
          setActiveDriver(null);
          saveStoredActiveDriver(null);
          setActiveTab('home');
        }}
      />
    );
  }

  const isAuthGatedView = activeTab === 'login' || (!citizenUser && activeTab !== 'home');

  return (
    <div className={isAuthGatedView ? "h-screen max-h-screen w-full overflow-hidden flex flex-col bg-white" : "min-h-screen flex flex-col bg-[var(--bg-primary)]"}>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-fade-in-up">
          <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-emerald-600 text-white font-medium text-sm shadow-lg shadow-emerald-600/20">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Navbar — rendered on all screens except dedicated login/auth view */}
      {!isAuthGatedView && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          onOpenAiScanner={handleOpenAiScanner}
          userProfile={userProfile}
          dbConnected={dbConnected}
          currentUser={citizenUser}
          onLoginClick={() => setActiveTab('login')}
          onLogoutClick={handleLogout}
        />
      )}

      {/* Main Content */}
      <main className={isAuthGatedView ? "h-screen max-h-screen w-full overflow-hidden" : "flex-1 pb-20 md:pb-0"}>
        {activeTab === 'home' && (
          <LandingPage
            onStartPickup={handleStartPickup}
            onLoginClick={() => setActiveTab('login')}
            onScrollToHowItWorks={() => {
              const el = document.getElementById('how-it-works');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            currentUser={citizenUser}
            userEcoPoints={citizenUser ? citizenUser.ecoPoints : userProfile.ecoPoints}
            onRedeemReward={handleRedeemReward}
            onOpenAiScanner={handleOpenAiScanner}
            onTrackPickup={() => handleNavigate('track')}
          />
        )}

        {/* Unauthenticated gate guard — prevents accessing any internal view without signing in */}
        {!citizenUser && activeTab !== 'home' && (
          <CitizenLoginPage
            onSuccess={handleLoginSuccess}
            onSuccessDriver={handleDriverLoginSuccess}
            onSuccessAdmin={() => {
              window.location.href = '/admin';
            }}
            onBackToHome={() => setActiveTab('home')}
            onTrackPickup={() => {
              handleLoginSuccess(DEMO_CITIZEN_USER);
              setActiveTab('track');
            }}
            title="Login to EcoLoop"
            subtitle="OR Simply want to track your pickup? Track Pickup"
          />
        )}

        {/* Authenticated views */}
        {citizenUser && activeTab === 'request' && (
          <BookingWizard
            onSuccess={handleNewRequestSuccess}
            onOpenAiScanner={handleOpenAiScanner}
            prefilledCategory={prefilledCategory}
            prefilledDescription={prefilledDescription}
            prefilledWeight={prefilledWeight}
            citizenUser={citizenUser}
          />
        )}

        {citizenUser && activeTab === 'track' && (
          <LiveTracker
            requests={requests}
            onRequestsUpdate={(updated) => {
              setRequests(updated);
              saveStoredRequests(updated);
            }}
            onNavigateToBooking={() => handleNavigate('request')}
          />
        )}

        {citizenUser && activeTab === 'history' && (
          <PickupHistory
            requests={requests}
            onSelectTrackRequest={(id) => {
              handleNavigate('track');
            }}
            onRepeatPickup={handleRepeatPickup}
          />
        )}

        {citizenUser && activeTab === 'analytics' && (
          <CityAnalytics requests={requests} userProfile={userProfile} />
        )}
      </main>

      {/* AI Scanner Modal */}
      <AiWasteScannerModal
        isOpen={isAiScannerOpen}
        onClose={() => setIsAiScannerOpen(false)}
        onApplyDetectedWaste={handleApplyDetectedWaste}
        onOpenChatWithContext={(ctx) => {
          setChatScannedContext(ctx);
          setIsChatbotOpen(true);
        }}
      />

      {/* Social Media & Official Poster Modal */}
      <SocialPosterModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
      />

      {/* Floating EcoBot AI Assistant Button */}
      {!isChatbotOpen && (
        <button
          type="button"
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-xl shadow-emerald-600/30 flex items-center gap-2.5 font-bold text-xs transition-all active:scale-95 group cursor-pointer border border-emerald-400/30"
          title="Chat with EcoBot AI Assistant"
        >
          <div className="relative">
            <Bot className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <span>Need Help? Ask EcoBot AI</span>
        </button>
      )}

      {/* EcoBot Chatbot Modal */}
      <ChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onOpenBooking={handleStartPickup}
        onOpenScanner={handleOpenAiScanner}
        scannedContext={chatScannedContext}
      />
    </div>
  );
}
