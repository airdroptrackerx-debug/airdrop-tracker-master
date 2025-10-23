import { Link } from 'react-router-dom';
import { Shield, Info, Compass } from 'lucide-react';
import { LiveCommunityIndicator } from './LiveCommunityIndicator';

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Airdrop Tracker</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-xs">Personal Task Management Tool</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <LiveCommunityIndicator variant="footer" />
            
            <Link 
              to="/explorer" 
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Compass className="h-3 w-3" />
              Explorer
            </Link>
            
            <Link 
              to="/about" 
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Info className="h-3 w-3" />
              About Us
            </Link>
            
            <Link 
              to="/privacy" 
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Shield className="h-3 w-3" />
              Privacy Policy
            </Link>
            
            <div className="flex items-center gap-1 text-xs">
              <span className="text-green-500">●</span>
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-center text-xs text-muted-foreground/70">
          <p>
            ⚠️ Not a financial service. Always verify airdrop legitimacy independently. 
            We never ask for wallet private keys or seed phrases.
          </p>
        </div>
      </div>
    </footer>
  );
}
