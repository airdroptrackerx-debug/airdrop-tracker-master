export interface AirdropProject {
  id: string;
  name: string;
  description: string;
  logoUrl?: string; // Auto-fetched from URL or manually uploaded
  registrationUrl: string; // Your referral link
  aboutUrl?: string; // Link to project's about page
  category?: string; // e.g., "DeFi", "Gaming", "Infrastructure"
  status?: 'active' | 'upcoming' | 'ended';
  featured?: boolean; // Featured projects shown first
  requirements?: string; // Brief requirements text
  reward?: string; // Potential reward info
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Admin user ID
  views?: number; // Track popularity
  clicks?: number; // Track click-through
}

export interface AirdropFilter {
  category?: string;
  status?: string;
  searchQuery?: string;
}
