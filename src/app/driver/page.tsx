'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CollectorDriver, WastePickupRequest } from '@/types/waste';
import {
  getStoredDrivers,
  getStoredRequests,
  saveStoredRequests,
  getStoredActiveDriver,
  saveStoredActiveDriver,
  DEMO_DRIVER,
} from '@/lib/storage';
import { getApiUrl } from '@/lib/api';
import { DriverDashboard } from '@/components/DriverDashboard';
import { CitizenLoginPage } from '@/components/CitizenLoginPage';

export default function DriverPage() {
  const [activeDriver, setActiveDriver] = useState<CollectorDriver | null>(null);
  const [requests, setRequests] = useState<WastePickupRequest[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const localDriver = getStoredActiveDriver();
    const localRequests = getStoredRequests();
    setActiveDriver(localDriver);
    setRequests(localRequests);

    // Fetch latest requests from MongoDB Atlas
    fetch(getApiUrl('/api/requests'))
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data && resData.data.length > 0) {
          setRequests(resData.data);
          saveStoredRequests(resData.data);
        }
      })
      .catch((err) => {
        console.warn('Driver portal using local requests store:', err);
      });
  }, []);

  const handleDriverLoginSuccess = (driver: CollectorDriver) => {
    setActiveDriver(driver);
    saveStoredActiveDriver(driver);
  };

  const handleDriverLogout = () => {
    setActiveDriver(null);
    saveStoredActiveDriver(null);
  };

  const handleRequestsUpdate = (updated: WastePickupRequest[]) => {
    setRequests(updated);
    saveStoredRequests(updated);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!activeDriver) {
    return (
      <CitizenLoginPage
        initialRole="driver"
        title="Delivery Partner Login"
        onSuccess={() => {}}
        onSuccessDriver={handleDriverLoginSuccess}
        onBackToHome={() => { window.location.href = '/'; }}
      />
    );
  }

  return (
    <DriverDashboard
      driver={activeDriver}
      requests={requests}
      onRequestUpdate={handleRequestsUpdate}
      onLogout={handleDriverLogout}
      onSwitchToCitizen={() => { window.location.href = '/'; }}
    />
  );
}
