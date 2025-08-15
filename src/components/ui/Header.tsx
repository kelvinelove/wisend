import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLastUpdated } from '@/services/fxRates';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const lastUpdate = getLastUpdated();
    setLastUpdated(lastUpdate);

    const interval = setInterval(() => {
      const update = getLastUpdated();
      setLastUpdated(update);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-gradient-to-r from-primary/80 to-secondary/80 shadow-lg rounded-b-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full shadow-lg overflow-hidden">
              <img src="/wire_white.png" alt="WiSend Logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow">WiSend</h1>
              <p className="text-xs text-white/80 font-medium">by WiRemit</p>
            </div>
          </Link>
          
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
            <div className="relative group">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 shadow focus:outline-none transition-all">
                <User className="h-8 w-8 text-white" />
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
  );
};