import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { Building2 } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 overflow-hidden">
            <img src="/wire_white.png" alt="WiRemit Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">WiSend</h1>
          <p className="text-white/80">by WiRemit <br /> <br />  Secure money transfers to your family abroad</p>
        </div>

        {/* Auth forms */}
        {isLogin ? (
          <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};