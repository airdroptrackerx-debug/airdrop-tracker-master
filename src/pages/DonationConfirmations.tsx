import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Heart, Calendar, User, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DonationConfirmation {
  id: string;
  userId: string;
  userEmail: string;
  donorName: string;
  message: string;
  createdAt: string;
}

export default function DonationConfirmations() {
  const [confirmations, setConfirmations] = useState<DonationConfirmation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfirmations();
  }, []);

  const fetchConfirmations = async () => {
    try {
      const q = query(
        collection(db, 'donationConfirmations'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DonationConfirmation[];
      setConfirmations(data);
    } catch (error) {
      console.error('Error fetching confirmations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading confirmations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full backdrop-blur-sm border-2 border-border/50 mb-4 shadow-lg relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-red-500 opacity-15 dark:opacity-25"></div>
            <Heart className="h-8 w-8 text-red-500 fill-red-500 relative z-10" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Donation Confirmations</h1>
          <p className="text-muted-foreground">
            Total confirmations: <span className="font-bold text-primary">{confirmations.length}</span>
          </p>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end mb-4">
          <Button onClick={fetchConfirmations} variant="outline">
            Refresh
          </Button>
        </div>

        {/* Confirmations List */}
        <div className="space-y-4">
          {confirmations.length === 0 ? (
            <div className="bg-card border rounded-xl p-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No confirmations yet</h3>
              <p className="text-muted-foreground">
                Donation confirmations will appear here when users submit them.
              </p>
            </div>
          ) : (
            confirmations.map((confirmation) => (
              <div
                key={confirmation.id}
                className="bg-card border rounded-xl p-6 hover:border-primary/50 transition-colors shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="h-12 w-12 rounded-full flex items-center justify-center relative backdrop-blur-sm border-2 border-border/50 shadow-md flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-red-500 opacity-10 dark:opacity-20"></div>
                    <Heart className="h-6 w-6 text-red-500 fill-red-500 relative z-10" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Donor Name */}
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-lg">{confirmation.donorName}</span>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{confirmation.userEmail}</span>
                    </div>

                    {/* Message */}
                    {confirmation.message && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-sm flex-1">{confirmation.message}</p>
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(confirmation.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
