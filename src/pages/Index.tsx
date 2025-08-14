import React from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { AuthPage } from '@/components/auth/AuthPage';
import { Dashboard } from '@/components/dashboard/Dashboard';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading WiSend...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthPage />;
};

export default Index;
