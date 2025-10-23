import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnimatedInput } from './AnimatedInput';
import { Eye, EyeOff, Chrome, Apple, Sparkles } from 'lucide-react';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import { gsap } from 'gsap';
import { AnimatedBackground } from './AnimatedBackground';
import { AirdropIllustrations } from './AirdropIllustrations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn, signUp, resetPassword, signInWithGoogle, signInWithApple, signInWithTwitter } = useAuth();
  const { executeRecaptcha } = useRecaptcha();
  const navigate = useNavigate();
  
  const formRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const switchRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        await signIn(email, password, rememberMe);
        // Navigate to home page on successful login
        navigate('/');
      } else {
        if (!name.trim() || !nickname.trim()) {
          setError('Please fill in all fields');
          setIsSubmitting(false);
          return;
        }
        
        // Execute reCAPTCHA for signup
        const recaptchaToken = await executeRecaptcha('signup');
        if (!recaptchaToken) {
          console.warn('reCAPTCHA verification failed, but continuing with signup');
        }
        
        await signUp(email, password, name.trim(), nickname.trim(), recaptchaToken || undefined);
        // Navigate to email verification page after signup
        navigate('/verify-email');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple' | 'twitter') => {
    setError('');
    setIsSubmitting(true);
    
    try {
      switch (provider) {
        case 'google':
          await signInWithGoogle();
          break;
        case 'apple':
          await signInWithApple();
          break;
        case 'twitter':
          await signInWithTwitter();
          break;
      }
      navigate('/');
    } catch (err: any) {
      // Use proper branding for error messages
      const providerName = provider === 'twitter' ? '𝕏' : provider;
      setError(err.message || `Failed to sign in with ${providerName}. Please try again.`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess(false);

    if (!resetEmail.trim()) {
      setResetError('Please enter your email address');
      return;
    }

    try {
      await resetPassword(resetEmail.trim());
      setResetSuccess(true);
      setTimeout(() => {
        setShowResetDialog(false);
        setResetEmail('');
        setResetSuccess(false);
      }, 3000);
    } catch (err: any) {
      setResetError(err.message || 'Failed to send reset email');
    }
  };

  // Initial entrance animation
  useEffect(() => {
    if (!formRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(formRef.current,
      { opacity: 0, scale: 0.9, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8 }
    );

    if (headerRef.current) {
      tl.fromTo(headerRef.current.children,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 },
        '-=0.4'
      );
    }

    if (fieldsRef.current) {
      tl.fromTo(fieldsRef.current.children,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.5 },
        '-=0.3'
      );
    }

    if (socialRef.current) {
      tl.fromTo(socialRef.current.children,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, stagger: 0.1, duration: 0.4 },
        '-=0.2'
      );
    }

    if (switchRef.current) {
      tl.fromTo(switchRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        '-=0.2'
      );
    }
  }, []);

  // Transition animation when switching between login/signup
  useEffect(() => {
    if (!fieldsRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    tl.to(fieldsRef.current.children, {
      opacity: 0,
      x: isLogin ? 20 : -20,
      duration: 0.3,
      stagger: 0.05
    }).to(fieldsRef.current.children, {
      opacity: 1,
      x: 0,
      duration: 0.4,
      stagger: 0.05
    });

    // Animate header text change
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { scale: 0.95, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }
      );
    }
  }, [isLogin]);

  // Success pulse animation
  const animateSuccess = () => {
    if (!formRef.current) return;
    
    gsap.fromTo(formRef.current,
      { scale: 1 },
      { 
        scale: 1.02, 
        duration: 0.2, 
        yoyo: true, 
        repeat: 1,
        ease: 'power2.inOut'
      }
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <AnimatedBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Illustration Section - Hidden on mobile */}
          <div className="hidden lg:block">
            <AirdropIllustrations />
          </div>

          {/* Form Section */}
          <div className="w-full max-w-md mx-auto">
            <div 
              ref={formRef}
              className="relative bg-card/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary/10 overflow-hidden"
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
              
              <div className="relative p-6 sm:p-8 space-y-6">
      <div ref={headerRef} className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">Airdrop Tracker</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {isLogin ? 'Welcome Back!' : 'Join the Hunt'}
        </h2>
        <p className="text-muted-foreground">
          {isLogin ? 'Sign in to continue your airdrop journey' : 'Start tracking airdrops today'}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div ref={fieldsRef} className="space-y-4">
        {!isLogin && (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <AnimatedInput
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <AnimatedInput
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required={!isLogin}
                placeholder="John"
              />
            </div>
          </>
        )}
        
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <AnimatedInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={() => setShowResetDialog(true)}
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>
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
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          {/* Remember Me checkbox - only show on login */}
          {isLogin && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full relative overflow-hidden group" 
          disabled={isSubmitting}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1.02,
              duration: 0.2,
              ease: 'power2.out'
            });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1,
              duration: 0.2,
              ease: 'power2.out'
            });
          }}
        >
          <span className="relative z-10">
            {isSubmitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
        
        {!isLogin && (
          <p className="text-xs text-center text-muted-foreground">
            Protected by reCAPTCHA. By signing up, you agree to our terms and privacy policy.
          </p>
        )}
      </form>
        
      <div ref={socialRef} className="space-y-4">
      {/* Social Authentication Buttons - Available for both Login and Signup */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialAuth('google')}
          disabled={isSubmitting}
          className="w-full"
        >
          <Chrome className="h-4 w-4 mr-2" />
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialAuth('twitter')}
          disabled={isSubmitting}
          className="w-full"
        >
          𝕏
        </Button>
      </div>
      </div>

      <div ref={switchRef} className="text-center text-sm">
        {isLogin ? 'Need an account? ' : 'Already have an account? '}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          className="text-primary hover:underline"
          disabled={isSubmitting}
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          {resetSuccess ? (
            <div className="space-y-3">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                ✅ Password reset email sent! Check your inbox.
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-800 mb-1">Can't find the email?</p>
                    <p className="text-yellow-700">
                      Please check your <strong>spam/junk folder</strong>. Password reset emails often end up there!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {resetError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                  {resetError}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Send Reset Link
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowResetDialog(false);
                    setResetEmail('');
                    setResetError('');
                    setResetSuccess(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
