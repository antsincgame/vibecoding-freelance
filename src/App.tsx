import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './lib/auth';
import Header from './components/Header';
import { megaMenuCategories } from './data/megaMenu';
import NotificationBell from './components/NotificationBell';
import WishlistBadge from './components/WishlistBadge';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import CommandPalette from './components/CommandPalette';
import CursorTrail from './components/CursorTrail';
import Home from './pages/Home';
import Category from './pages/Category';
import GigDetail from './pages/GigDetail';
import UserProfile from './pages/UserProfile';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import CreateGig from './pages/CreateGig';
import SetupProfile from './pages/SetupProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminGigs from './pages/admin/AdminGigs';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReviews from './pages/admin/AdminReviews';
import AdminTickets from './pages/admin/AdminTickets';
import AdminChat from './pages/admin/AdminChat';
import Support from './pages/Support';
import OrderDetail from './pages/OrderDetail';
import Chat from './pages/Chat';
import EditProfile from './pages/EditProfile';
import EditGig from './pages/EditGig';
import Projects from './pages/Projects';
import ForSellers from './pages/ForSellers';
import FAQ from './pages/FAQ';
import HowItWorks from './pages/HowItWorks';
import News from './pages/News';
import NewsPost from './pages/NewsPost';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import { getCurrentFreelancerProfile } from './lib/freelance-db';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function RequireFlProfile({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const existing = await getCurrentFreelancerProfile();
      if (!existing) {
        // Auto-create fl_profile from Appwrite account data
        const { createFreelancerProfile } = await import('./lib/freelance-db');
        const { getAdminRole } = await import('./lib/admin-api');
        const name = profile?.full_name || user.name || user.email?.split('@')[0] || 'User';
        const username = (user.email?.split('@')[0] || 'user_' + Date.now()).toLowerCase().replace(/[^a-z0-9_]/g, '');
        const adminRole = await getAdminRole();
        await createFreelancerProfile({
          username,
          name,
          avatar: profile?.avatar_url || '',
          role: adminRole || 'client',
        });
      }
      setReady(true);
    })();
  }, [user]);

  if (loading || !ready) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AppContent() {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { user } = useAuth();

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const handler = () => setSearchOpen(true);
    document.addEventListener('open-search', handler);
    return () => document.removeEventListener('open-search', handler);
  }, []);

  // Admin/Moderator routes — no main layout, access checked in AdminLayout
  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/gigs" element={<AdminGigs />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/tickets" element={<AdminTickets />} />
        <Route path="/admin/chat" element={<AdminChat />} />
      </Routes>
    );
  }

  return (
    <>
      <CursorTrail />
      <ScrollToTop />
      <Header onOpenSearch={openSearch} />
      <div className="fixed top-3 right-[200px] z-[51] hidden md:flex items-center gap-2">
        <WishlistBadge />
        <NotificationBell />
      </div>
      <main className="min-h-screen bg-[#0a0a0f] relative z-[1]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories/:slug" element={<Category />} />
          <Route path="/gigs/:id" element={<GigDetail />} />
          <Route path="/projects" element={
            <ProtectedRoute><Projects /></ProtectedRoute>
          } />
          <Route path="/for-sellers" element={<ForSellers />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsPost />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/users/:username" element={<UserProfile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/setup-profile" element={
            <ProtectedRoute><SetupProfile /></ProtectedRoute>
          } />
          <Route path="/support" element={
            <ProtectedRoute><Support /></ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute><OrderDetail /></ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute><Chat /></ProtectedRoute>
          } />
          <Route path="/chat/:id" element={
            <ProtectedRoute><Chat /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <RequireFlProfile><Dashboard /></RequireFlProfile>
          } />
          <Route path="/dashboard/freelancer" element={
            <RequireFlProfile><FreelancerDashboard /></RequireFlProfile>
          } />
          <Route path="/dashboard/create-gig" element={
            <RequireFlProfile><CreateGig /></RequireFlProfile>
          } />
          <Route path="/dashboard/edit-gig/:id" element={
            <RequireFlProfile><EditGig /></RequireFlProfile>
          } />
          <Route path="/profile/edit" element={
            <ProtectedRoute><EditProfile /></ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav onOpenSearch={openSearch} />
      <CommandPalette isOpen={searchOpen} onClose={closeSearch} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#12121f',
            color: '#fff',
            border: '1px solid rgba(0, 245, 255, 0.15)',
            fontFamily: "'Inter', system-ui, sans-serif",
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(0, 245, 255, 0.08)',
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
