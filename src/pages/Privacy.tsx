import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, Database, Mail, Copy, Check, MessageSquare } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { toast } from 'sonner';

export default function Privacy() {
  const navigate = useNavigate();
  const [showContactForm, setShowContactForm] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const contactEmail = 'airdrop.tracker.1.0@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setEmailCopied(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="mb-6 -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">What We Collect</h2>
            </div>
            <p className="text-muted-foreground mb-2">
              Airdrop Tracker is a personal task management tool. We collect minimal information necessary to provide our services:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li><strong>Account Information:</strong> Email, name, and nickname (for personalization)</li>
              <li><strong>Task Data:</strong> Your airdrop tasks, URLs, and completion status</li>
              <li><strong>Authentication:</strong> Managed securely by Firebase Authentication</li>
              <li><strong>Activity Data:</strong> Last active timestamp (for live user count feature)</li>
              <li><strong>Usage Analytics:</strong> Airdrop project views and clicks (anonymous, for improving our platform)</li>
              <li><strong>Profile Picture:</strong> If you sign in with Google/Twitter (optional)</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">How We Protect Your Data</h2>
            </div>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>All data is stored securely in Firebase Firestore with encryption</li>
              <li>We use Firebase Authentication for secure login</li>
              <li>Your password is never stored in plain text</li>
              <li>Data is only accessible to you when logged in</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">What We DON'T Collect</h2>
            </div>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li><strong>NO</strong> crypto wallet addresses or private keys</li>
              <li><strong>NO</strong> seed phrases or recovery phrases</li>
              <li><strong>NO</strong> financial information or payment details</li>
              <li><strong>NO</strong> tracking cookies or third-party analytics</li>
              <li><strong>NO</strong> selling or sharing of your data</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">How We Use Your Data</h2>
            </div>
            <p className="text-muted-foreground mb-2">
              Your data is used solely for:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Providing task tracking functionality</li>
              <li>Personalizing your experience (welcome messages, profile)</li>
              <li>Sending password reset and verification emails (only when requested)</li>
              <li>Displaying live community activity (anonymous user counts)</li>
              <li>Improving airdrop recommendations based on usage patterns</li>
              <li>Preventing spam and abuse via Google reCAPTCHA</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
            <p className="text-muted-foreground mb-2">
              We use the following trusted third-party services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Firebase (Google):</strong> Authentication, database, and hosting. 
                View <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firebase Privacy Policy</a>
              </li>
              <li>
                <strong>Google reCAPTCHA:</strong> Bot protection on signup forms. 
                View <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a>
              </li>
              <li>
                <strong>EmailJS:</strong> Contact form delivery. 
                View <a href="https://www.emailjs.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">EmailJS Privacy Policy</a>
              </li>
            </ul>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>Note:</strong> We do not share your personal data with these services beyond what's necessary for functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Cookies & Local Storage</h2>
            <p className="text-muted-foreground mb-2">
              We use browser storage for essential functionality:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li><strong>Authentication Cookies:</strong> Keep you logged in (Firebase managed)</li>
              <li><strong>Local Storage:</strong> Store your preferences and task data locally</li>
              <li><strong>Session Storage:</strong> Temporary data during your browsing session</li>
            </ul>
            <p className="text-muted-foreground mt-2 text-sm">
              We do NOT use tracking cookies or third-party advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
            <p className="text-muted-foreground mb-2">You have full control over your data:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>View and edit your profile information anytime</li>
              <li>Delete your tasks whenever you want</li>
              <li>Request account deletion by contacting us</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Important Notice</h2>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm">
                <strong>⚠️ This is NOT a financial service.</strong> Airdrop Tracker is a personal 
                productivity tool for tracking crypto airdrop tasks. We do not handle any cryptocurrency, 
                wallets, or financial transactions. Always verify airdrop legitimacy independently.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Contact</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              If you have questions about this Privacy Policy, your data, or want to leave feedback 
              about Airdrop Tracker, we'd love to hear from you!
            </p>
            
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 border">
                <p className="text-sm text-muted-foreground mb-2">Email us directly at:</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <a 
                    href={`mailto:${contactEmail}`}
                    className="text-primary font-medium hover:underline flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    {contactEmail}
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyEmail}
                    className="h-8"
                  >
                    {emailCopied ? (
                      <><Check className="h-3 w-3 mr-1" /> Copied!</>
                    ) : (
                      <><Copy className="h-3 w-3 mr-1" /> Copy</>  
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowContactForm(true)}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Send us a Message
                </Button>
                <p className="text-sm text-muted-foreground flex items-center">
                  Quick feedback form - we typically respond within 24 hours
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
    </div>
  );
}
