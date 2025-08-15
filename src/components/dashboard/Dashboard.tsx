import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthContext';
import { SendMoney } from './SendMoney';
import { TransactionHistory } from './TransactionHistory';
import { AdsCarousel } from './AdsCarousel';
import { User, Wallet } from 'lucide-react';
import { Header } from '@/components/ui/Header';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-50 to-background/80 dark:from-background dark:via-slate-900 dark:to-background/80">
      <Header />

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
                <img src="/wire_white.png" alt="WiSend Logo" className="h-6 w-6 object-contain" />
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