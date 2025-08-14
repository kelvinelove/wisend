import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from './AuthContext';
import { Loader2, Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();
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

  const checkPasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include lowercase letter');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include uppercase letter');
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include number');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include special character');
    }

    return {
      score,
      feedback,
      isValid: score >= 4 && password.length >= 8
    };
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 2) return 'bg-destructive';
    if (score <= 3) return 'bg-orange-500';
    if (score <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailValidation = getEmailValidation();
    const passwordStrength = checkPasswordStrength(password);
    
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
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

    if (!passwordStrength.isValid) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password.",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const success = await signup(name, email, password);
    
    if (success) {
      toast({
        title: "Welcome to WiSend!",
        description: "Your account has been created successfully.",
      });
    } else {
      toast({
        title: "Signup Failed",
        description: "An account with this email already exists.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const emailValidation = getEmailValidation();
  const passwordStrength = checkPasswordStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  return (
    <Card className="w-full max-w-md mx-auto shadow-medium">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Create Account
        </CardTitle>
        <CardDescription>
          Join WiSend to send money securely
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <img src="/wire_white.png" alt="WiRemit Logo" className="absolute left-3 top-2 h-6 w-6 object-contain rounded-full bg-white/10" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

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
                placeholder="Create a strong password"
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
            
            {/* Password Strength Meter */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Password strength:</span>
                  <span className={`font-medium ${
                    passwordStrength.score <= 2 ? 'text-destructive' :
                    passwordStrength.score <= 3 ? 'text-orange-500' :
                    passwordStrength.score <= 4 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {getPasswordStrengthText(passwordStrength.score)}
                  </span>
                </div>
                <Progress 
                  value={passwordStrength.score * 20} 
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  {passwordStrength.feedback.length > 0 && (
                    <div className="flex items-start space-x-1">
                      <XCircle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />
                      <span>{passwordStrength.feedback[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`pl-10 pr-10 ${confirmPassword && !passwordsMatch ? 'border-destructive' : confirmPassword && passwordsMatch ? 'border-green-500' : ''}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && (
              <div className={`text-sm ${!passwordsMatch ? 'text-destructive' : 'text-green-600'}`}>
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            disabled={isLoading || !emailValidation.isValid || !passwordStrength.isValid || !passwordsMatch}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <button
            onClick={onSwitchToLogin}
            className="text-primary hover:text-primary-glow font-medium transition-colors"
          >
            Sign in
          </button>
        </div>

        <Alert className="mt-4">
          <AlertDescription className="text-xs">
            <strong>Security Note:</strong> Your password is securely hashed and never stored in plain text. We recommend using a unique password for your WiSend account.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};