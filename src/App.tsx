'use client';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { TasksProvider } from "@/context/TasksContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { useActivityTracking } from "@/hooks/useActivityTracking";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Privacy from "./pages/Privacy";
import Donate from "./pages/Donate";
import DonationConfirmations from "./pages/DonationConfirmations";
import About from "./pages/About";
import Explorer from "./pages/Explorer";
import AdminAirdrops from "./pages/AdminAirdrops";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminHub from "./pages/AdminHub";
import AdminMonetization from "./pages/AdminMonetization";
import { EmailVerification } from "./pages/EmailVerification";
import { LoginForm } from "./components/auth/LoginForm";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";

const queryClient = new QueryClient();

// Activity tracking wrapper
function ActivityTracker({ children }: { children: React.ReactNode }) {
  useActivityTracking();
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <TasksProvider>
            <ActivityTracker>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                <ScrollToTop />
                <div className="flex flex-col min-h-screen">
                  <Navigation />
                <main className="flex-1">
                  <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/verify-email" element={<EmailVerification />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Index />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/explorer" element={<Explorer />} />
                    <Route 
                      path="/admin" 
                      element={
                        <AdminRoute>
                          <AdminHub />
                        </AdminRoute>
                      } 
                    />
                    <Route 
                      path="/admin/analytics" 
                      element={
                        <AdminRoute>
                          <AdminAnalytics />
                        </AdminRoute>
                      } 
                    />
                    <Route 
                      path="/admin/donations" 
                      element={
                        <AdminRoute>
                          <DonationConfirmations />
                        </AdminRoute>
                      } 
                    />
                    <Route 
                      path="/admin/airdrops" 
                      element={
                        <AdminRoute>
                          <AdminAirdrops />
                        </AdminRoute>
                      } 
                    />
                    <Route 
                      path="/admin/monetization" 
                      element={
                        <AdminRoute>
                          <AdminMonetization />
                        </AdminRoute>
                      } 
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </TooltipProvider>
            </ActivityTracker>
        </TasksProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
