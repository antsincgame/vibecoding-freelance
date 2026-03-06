import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@vibecoding/shared';
import { Header } from '@vibecoding/shared';
import '@vibecoding/shared/styles';
import CategoriesBar from './components/CategoriesBar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import CommandPalette from './components/CommandPalette';
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
import Support from './pages/Support';
import OrderDetail from './pages/OrderDetail';
import Chat from './pages/Chat';
import EditProfile from './pages/EditProfile';
import EditGig from './pages/EditGig';
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
        const { isAdmin } = await import('./lib/admin-api');
        const name = profile?.full_name || user.name || user.email?.split('@')[0] || 'User';
        const username = (user.email?.split('@')[0] || 'user_' + Date.now()).toLowerCase().replace(/[^a-z0-9_]/g, '');
        const admin = await isAdmin();
        await createFreelancerProfile({
          username,
          name,
          avatar: profile?.avatar_url || '',
          role: admin ? 'admin' : 'client',
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

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const handler = () => setSearchOpen(true);
    document.addEventListener('open-search', handler);
    return () => document.removeEventListener('open-search', handler);
  }, []);

  // Admin routes — no main layout
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
      </Routes>
    );
  }

  return (
    <>
      <div className="cyber-grid-bg" />
      <div className="scan-line" />
      <ScrollToTop />
      <Header
        logoText="VIBECODER" logoImage="/logo.png"
        logoTo="/"
        onOpenSearch={openSearch}
        searchPlaceholder="Найти услуги"
        loginPath="/auth"
        profilePath="/dashboard"
        extraLinks={[{ to: '/admin', label: 'Админка', style: { color: '#ff006e' } }]}
      />
      <CategoriesBar />
      <main className="pt-[100px] min-h-screen bg-void relative z-[1]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories/:slug" element={<Category />} />
          <Route path="/gigs/:id" element={<GigDetail />} />
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
            background: '#13131a',
            color: '#e0e0e0',
            border: '1px solid rgba(0, 255, 249, 0.2)',
            fontFamily: "'Rajdhani', sans-serif",
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
