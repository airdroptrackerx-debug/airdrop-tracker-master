import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Send, MessageSquare, X, Mail } from 'lucide-react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import { useAuth } from '@/context/AuthContext';

export function ContactForm({ onClose }: { onClose: () => void }) {
  const { user, userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (user && userProfile) {
      setFormData(prev => ({
        ...prev,
        name: userProfile.name || '',
        email: user.email || ''
      }));
    }
  }, [user, userProfile]);

  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // EmailJS configuration - You'll need to set these up
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

      // Debug logging
      console.log('EmailJS Config:', {
        serviceId,
        templateId,
        publicKey: publicKey?.substring(0, 5) + '...',
        hasServiceId: !!serviceId,
        hasTemplateId: !!templateId,
        hasPublicKey: !!publicKey
      });

      // Check if EmailJS is configured
      if (!serviceId || serviceId === 'YOUR_SERVICE_ID') {
        // Fallback: Show message with email link
        toast.info('Email service not configured', {
          description: (
            <div>
              Please send your message to{' '}
              <a 
                href={`mailto:airdrop.tracker.1.0@gmail.com?subject=Feedback from ${formData.name}&body=${formData.message}`}
                className="underline font-semibold"
              >
                airdrop.tracker.1.0@gmail.com
              </a>
            </div>
          ),
          duration: 6000,
        });
        return;
      }

      // Send email using EmailJS
      // IMPORTANT: These parameter names MUST match your EmailJS template variables exactly!
      const templateParams = {
        name: formData.name,           // Matches {{name}} in template
        email: formData.email,         // Matches {{email}} in template - used for auto-reply
        message: formData.message,     // Matches {{message}} in template
        time: new Date().toLocaleString(), // Matches {{time}} in template
      };

      console.log('Sending email with params:', templateParams);

      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );
      
      console.log('EmailJS Response:', response);
      
      toast.success('Message sent successfully! 🎉', {
        description: 'Thank you for your feedback. We\'ll get back to you within 24 hours!',
      });
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
      onClose();
    } catch (error: any) {
      console.error('EmailJS Error:', error);
      console.error('Error details:', {
        message: error?.message,
        text: error?.text,
        status: error?.status
      });
      
      const errorMessage = error?.text || error?.message || 'Unknown error';
      
      toast.error('Failed to send message', {
        description: (
          <div>
            <p className="mb-1">Error: {errorMessage}</p>
            <p>Please email us directly at{' '}
            <a 
              href="mailto:airdrop.tracker.1.0@gmail.com"
              className="underline font-semibold"
            >
              airdrop.tracker.1.0@gmail.com
            </a></p>
          </div>
        ),
        duration: 8000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Centered modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 pointer-events-none">
        <div className="bg-card border rounded-xl shadow-2xl overflow-hidden w-full max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto animate-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Send us a message
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-primary/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {user && userProfile && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 p-2 rounded-lg">
              <Mail className="h-3 w-3" />
              <span>Fields pre-filled with your account info</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">
              Your Message or Review
            </Label>
            <Textarea
              id="message"
              placeholder="Share your feedback, suggestions, or questions about Airdrop Tracker..."
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Your feedback helps us improve Airdrop Tracker!
            </p>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
}

// Floating Action Button
export function ContactFAB({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
      aria-label="Contact support"
    >
      <MessageSquare className="h-6 w-6" />
    </button>
  );
}
