import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from './AuthContext';
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getEmailValidation = () => {
    if (!email) return { isValid: false, message: '', type: 'neutral' };
    if (!validateEmail(email)) return { isValid: false, message: 'Please enter a valid email address', type: 'error' };
    return { isValid: true, message: 'Email format is valid', type: 'success' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailValidation = getEmailValidation();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    if (!emailValidation.isValid) {
      toast({
        title: "Invalid Email",
        description: emailValidation.message,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const success = await login(email, password);
    
    if (!success) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotEmail.trim() || !validateEmail(forgotEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsResettingPassword(true);
    
    // Simulate password reset process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Password Reset Email Sent",
      description: `If an account exists for ${forgotEmail}, you will receive password reset instructions.`,
    });
    
    setIsResettingPassword(false);
    setShowForgotPassword(false);
    setForgotEmail('');
  };

  const emailValidation = getEmailValidation();

  if (showForgotPassword) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-medium">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Forgot Password
          </CardTitle>
          <CardDescription>
            Enter your email to receive reset instructions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="your@email.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={isResettingPassword}
            >
              {isResettingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Reset Email...
                </>
              ) : (
                'Send Reset Email'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="flex items-center justify-center w-full text-primary hover:text-primary-glow font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Sign In
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-medium">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription>
          Sign in to your WiSend account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 ${emailValidation.type === 'error' ? 'border-destructive' : emailValidation.type === 'success' ? 'border-green-500' : ''}`}
                required
              />
              {email && (
                <div className="absolute right-3 top-3">
                  {emailValidation.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : emailValidation.type === 'error' ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : null}
                </div>
              )}
            </div>
            {email && (
              <div className={`text-sm ${emailValidation.type === 'error' ? 'text-destructive' : emailValidation.type === 'success' ? 'text-green-600' : 'text-muted-foreground'}`}>
                {emailValidation.message}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-primary hover:text-primary-glow font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            disabled={isLoading || !emailValidation.isValid}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <button
            onClick={onSwitchToSignup}
            className="text-primary hover:text-primary-glow font-medium transition-colors"
          >
            Sign up
          </button>
        </div>

        <Alert className="mt-4">
          <AlertDescription className="text-xs">
            <strong>Demo Account:</strong> Use any email/password combination to sign in. This is a demo application.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};