'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CitizenLoginPage } from '@/components/CitizenLoginPage';
import { CitizenUser } from '@/types/waste';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTab = searchParams.get('tab') || 'request';

  const handleSuccess = (user: CitizenUser) => {
    router.push(`/?tab=${redirectTab}`);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <CitizenLoginPage
      onSuccess={handleSuccess}
      onBackToHome={handleBackToHome}
      title="Citizen Sign In"
      subtitle="Sign in to request doorstep waste collections, track vehicles, and earn green rewards."
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
