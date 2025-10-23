import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Eye, EyeOff, Check, ArrowLeft, AlertCircle, Clock } from 'lucide-react';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import { generateOTP, storeOTP, verifyOTP, clearOTP } from '@/utils/otpUtils';
import { sendOTPEmail, isValidEmail } from '@/services/emailService';

type SignupStep = 'email' | 'otp' | 'details';

export function OTPSignupForm() {
  // Form state
  const [currentStep, setCurrentStep] = useState<SignupStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // OTP state
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpSentTime, setOtpSentTime] = useState<number | null>(null);
  
  const { signUp } = useAuth();
  const { executeRecaptcha } = useRecaptcha();
  const navigate = useNavigate();

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Step 1: Send OTP to email
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate and store OTP
      const otpCode = generateOTP();
      storeOTP(email, otpCode);
      
      // Send OTP via email
      await sendOTPEmail(email, otpCode);
      
      // Move to OTP verification step
      setCurrentStep('otp');
      setOtpSentTime(Date.now());
      setResendCooldown(60); // 60 seconds cooldown
      setSuccessMessage('OTP sent! Check your email (and spam folder).');
    } catch (err: any) {
      setError('Failed to send OTP. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    
    try {
      const otpCode = generateOTP();
      storeOTP(email, otpCode);
      await sendOTPEmail(email, otpCode);
      
      setOtpSentTime(Date.now());
      setResendCooldown(60);
      setSuccessMessage('New OTP sent! Check your email.');
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }
    
    const result = verifyOTP(email, otp);
    
    if (result.success) {
      setCurrentStep('details');
      setSuccessMessage('Email verified! Complete your profile.');
    } else {
      setError(result.error || 'Invalid OTP');
    }
  };

  // Step 3: Complete signup
  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      if (!name.trim() || !nickname.trim()) {
        setError('Please fill in all fields');
        setIsSubmitting(false);
        return;
      }
      
      // Execute reCAPTCHA
      const recaptchaToken = await executeRecaptcha('signup');
      
      // Create account
      await signUp(email, password, name.trim(), nickname.trim(), recaptchaToken || undefined);
      
      // Clear OTP data
      clearOTP();
      
      // Navigate to home
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go back to previous step
  const handleGoBack = () => {
    setError('');
    setSuccessMessage('');
    
    if (currentStep === 'otp') {
      setCurrentStep('email');
      setOtp('');
    } else if (currentStep === 'details') {
      setCurrentStep('otp');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
          currentStep === 'email' ? 'border-primary bg-primary text-white' : 
          'border-green-500 bg-green-500 text-white'
        }`}>
          {currentStep === 'email' ? '1' : <Check className="h-4 w-4" />}
        </div>
        <div className={`h-0.5 w-12 ${currentStep !== 'email' ? 'bg-green-500' : 'bg-gray-300'}`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
          currentStep === 'otp' ? 'border-primary bg-primary text-white' : 
          currentStep === 'details' ? 'border-green-500 bg-green-500 text-white' :
          'border-gray-300 text-gray-400'
        }`}>
          {currentStep === 'details' ? <Check className="h-4 w-4" /> : '2'}
        </div>
        <div className={`h-0.5 w-12 ${currentStep === 'details' ? 'bg-green-500' : 'bg-gray-300'}`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
          currentStep === 'details' ? 'border-primary bg-primary text-white' : 
          'border-gray-300 text-gray-400'
        }`}>
          3
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-center gap-8 text-xs text-muted-foreground">
        <span className={currentStep === 'email' ? 'text-primary font-medium' : ''}>Email</span>
        <span className={currentStep === 'otp' ? 'text-primary font-medium' : ''}>Verify</span>
        <span className={currentStep === 'details' ? 'text-primary font-medium' : ''}>Complete</span>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2">
          <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{successMessage}</p>
        </div>
      )}

      {/* Step 1: Email Input */}
      {currentStep === 'email' && (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
                className="pl-10"
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground">
              We'll send a verification code to this email
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Verification Code'}
          </Button>
        </form>
      )}

      {/* Step 2: OTP Verification */}
      {currentStep === 'otp' && (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Change email
          </button>
          
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              placeholder="000000"
              className="text-center text-2xl tracking-widest font-mono"
              maxLength={6}
              autoFocus
            />
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Code sent to: <span className="font-medium">{email}</span>
              </p>
              <p className="text-xs text-yellow-600 flex items-start gap-1">
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>⚠️ Check your <strong>spam/junk folder</strong> if you don't see the email</span>
              </p>
              {otpSentTime && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Code expires in 10 minutes
                </p>
              )}
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={otp.length !== 6}>
            Verify Code
          </Button>
          
          <div className="text-center">
            {resendCooldown > 0 ? (
              <p className="text-sm text-muted-foreground">
                Resend code in {resendCooldown}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-sm text-primary hover:underline"
                disabled={isSubmitting}
              >
                Didn't receive code? Resend
              </button>
            )}
          </div>
        </form>
      )}

      {/* Step 3: Complete Profile */}
      {currentStep === 'details' && (
        <form onSubmit={handleCompleteSignup} className="space-y-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              placeholder="John"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum 6 characters
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Protected by reCAPTCHA. By signing up, you agree to our terms and privacy policy.
          </p>
        </form>
      )}
    </div>
  );
}
