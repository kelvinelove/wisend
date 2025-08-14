import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthContext';
import { SendMoney } from './SendMoney';
import { TransactionHistory } from './TransactionHistory';
import { AdsCarousel } from './AdsCarousel';
import { Building2, LogOut, User, Wallet, Clock } from 'lucide-react';
import { getLastUpdated } from '@/services/fxRates';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Check for last updated time on mount
    const lastUpdate = getLastUpdated();
    setLastUpdated(lastUpdate);

    // Update every minute
    const interval = setInterval(() => {
      const update = getLastUpdated();
      setLastUpdated(update);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-background/80 dark:from-background dark:via-slate-900 dark:to-background/80">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary/80 to-secondary/80 shadow-lg rounded-b-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full shadow-lg overflow-hidden">
                <img src="/wire_white.png" alt="WiRemit Logo" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow">WiSend</h1>
                <p className="text-xs text-white/80 font-medium">by WiRemit</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {lastUpdated && (
                <div className="text-white text-right hidden sm:block">
                  <div className="flex items-center space-x-1 text-xs opacity-90">
                    <Clock className="h-3 w-3" />
                    <span>Rates updated {lastUpdated.toLocaleTimeString()}</span>
                  </div>
                </div>
              )}
              <div className="text-white text-right hidden sm:block">
                <p className="text-sm font-medium">Welcome back,</p>
                <p className="text-xs opacity-90">{user?.name}</p>
              </div>
              {/* User avatar/profile dropdown */}
              <div className="relative group">
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 shadow focus:outline-none transition-all">
                  <img src="/wire_white.png" alt="Profile" className="w-8 h-8 object-contain" />
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl py-2 z-50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Profile</Link>
                  <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Settings</Link>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Sign Out</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Section */}
        <div className="mb-10">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none shadow-xl rounded-2xl">
            <CardContent className="p-8">
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-gradient-primary rounded-2xl shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-1">Welcome, {user?.name}!</h2>
                  <p className="text-muted-foreground text-lg">
                    Send money securely to your family studying in the UK and South Africa
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Send Money - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <SendMoney />
          </div>
          
          {/* Ads Carousel - Takes 1 column */}
          <div>
            <AdsCarousel />
          </div>
          
          {/* Transaction History - Takes full width */}
          <div className="lg:col-span-3">
            <TransactionHistory />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="text-center shadow-lg border-none rounded-xl hover:scale-105 hover:shadow-2xl transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full mx-auto mb-3 shadow">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">Total Sent</p>
              <p className="text-2xl font-bold">$2,450</p>
            </CardContent>
          </Card>
          
          <Card className="text-center shadow-lg border-none rounded-xl hover:scale-105 hover:shadow-2xl transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-secondary rounded-full mx-auto mb-3 shadow">
                <img src="/wire_white.png" alt="WiRemit Logo" className="h-6 w-6 object-contain" />
              </div>
              <p className="text-sm text-muted-foreground">Transfers</p>
              <p className="text-2xl font-bold">12</p>
            </CardContent>
          </Card>
          
          <Card className="text-center shadow-lg border-none rounded-xl hover:scale-105 hover:shadow-2xl transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-accent rounded-full mx-auto mb-3 shadow">
                <User className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">Since</p>
              <p className="text-2xl font-bold">Jan 2024</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};