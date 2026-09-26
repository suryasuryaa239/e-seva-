import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';

// Layout Components
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppSupport from './components/WhatsAppSupport';
import FloatingBackButton from './components/FloatingBackButton';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Home from './pages/Home';
import ServicesDirectory from './pages/ServicesDirectory';
import CategoryView from './pages/CategoryView';
import ServiceDetails from './pages/ServiceDetails';
import ApplyService from './pages/ApplyService';
import MyApplications from './pages/MyApplications';
import ApplicationDetailView from './pages/ApplicationDetailView';
import ApplicationTracker from './pages/ApplicationTracker';
import About from './pages/About';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import UserPayments from './pages/UserPayments';
import PaymentCallback from './pages/PaymentCallback';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ContactUs from './pages/ContactUs';
import Careers from './pages/Careers';
import UserNotifications from './pages/UserNotifications';
import AdminNotifications from './pages/AdminNotifications';
import UserNotificationPreferences from './pages/UserNotificationPreferences';
import AdminNotificationTemplates from './pages/AdminNotificationTemplates';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import RefundPolicy from './pages/RefundPolicy';
import NotFound from './pages/NotFound';

function RequireCitizenAuth({ children }) {
  const { user, userToken, loading } = useAuth();
  const location = useLocation();

  const token = userToken || localStorage.getItem('token') || localStorage.getItem('eseva_user_token');
  const savedUser = localStorage.getItem('eseva_saved_user');

  if (loading && !token && !savedUser) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl shadow-sm p-8 text-center max-w-sm w-full space-y-4 border border-slate-200">
          <div className="w-12 h-12 border-4 border-[#0b192c] border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-bold text-xs">Verifying citizen authentication...</p>
        </div>
      </div>
    );
  }

  if (!user && !token && !savedUser) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}

function RequireAdminAuth({ children }) {
  const { admin, adminToken, loading } = useAuth();

  const token = adminToken || localStorage.getItem('eseva_admin_token') || localStorage.getItem('adminToken');
  const savedAdmin = localStorage.getItem('eseva_saved_admin');

  if (loading && !token && !savedAdmin) {
    return (
      <div className="min-h-screen bg-[#0b192c] py-16 px-4 flex items-center justify-center font-sans text-white">
        <div className="bg-slate-800 rounded-3xl shadow-sm p-8 text-center max-w-sm w-full space-y-4 border border-slate-700">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-300 font-bold text-xs">Verifying administrator authentication...</p>
        </div>
      </div>
    );
  }

  if (!admin && !token && !savedAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdminDashboard = (location.pathname.startsWith('/admin') || location.pathname.startsWith('/admin-')) && !['/admin/login', '/admin-login'].includes(location.pathname);
  const isLoginPage = ['/login', '/register', '/admin/login', '/admin-login'].includes(location.pathname);
  const hideFooter = isAdminDashboard || isLoginPage;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      <ScrollToTop />
      
      {/* Top Info Bar & Main Navbar - Hidden only on Admin Dashboard Pages */}
      {!isAdminDashboard && <TopBar />}
      {!isAdminDashboard && <Navbar />}

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesDirectory />} />
          {/* Dynamic Services & Category Routing (100% Admin & Database driven) */}
          <Route path="/services/:category" element={<CategoryView />} />
          <Route path="/category/:slug" element={<CategoryView />} />
          <Route path="/category/:category" element={<CategoryView />} />
          {/* Service Enquiry Routes */}
          <Route path="/enquiry/:slug" element={<ServiceDetails />} />
          <Route path="/enquiry/:serviceId" element={<ServiceDetails />} />
          <Route path="/service/:serviceId" element={<ServiceDetails />} />
          <Route path="/service/:slug" element={<ServiceDetails />} />
          {/* Protected Application Routes */}
          <Route path="/apply/:serviceId" element={<RequireCitizenAuth><ApplyService /></RequireCitizenAuth>} />
          <Route path="/apply/slug/:slug" element={<RequireCitizenAuth><ApplyService /></RequireCitizenAuth>} />
          <Route path="/my-applications" element={<RequireCitizenAuth><MyApplications /></RequireCitizenAuth>} />
          <Route path="/my-applications/:id" element={<RequireCitizenAuth><ApplicationDetailView /></RequireCitizenAuth>} />
          <Route path="/track" element={<ApplicationTracker />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<RequireCitizenAuth><UserDashboard /></RequireCitizenAuth>} />
          <Route path="/payments" element={<RequireCitizenAuth><UserPayments /></RequireCitizenAuth>} />
          <Route path="/payment/callback" element={<PaymentCallback />} />
          <Route path="/profile" element={<RequireCitizenAuth><Profile /></RequireCitizenAuth>} />
          <Route path="/notifications" element={<RequireCitizenAuth><UserNotifications /></RequireCitizenAuth>} />
          <Route path="/profile/notifications" element={<RequireCitizenAuth><UserNotificationPreferences /></RequireCitizenAuth>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAdminAuth><AdminDashboard /></RequireAdminAuth>} />
          <Route path="/admin/dashboard" element={<RequireAdminAuth><AdminDashboard /></RequireAdminAuth>} />
          <Route path="/admin-dashboard" element={<RequireAdminAuth><AdminDashboard /></RequireAdminAuth>} />
          <Route path="/admin/notifications" element={<RequireAdminAuth><AdminNotifications /></RequireAdminAuth>} />
          <Route path="/admin/notification-templates" element={<RequireAdminAuth><AdminNotificationTemplates /></RequireAdminAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Footer, Back Navigation & WhatsApp Floating Support */}
      {!hideFooter && <Footer />}
      {!hideFooter && <FloatingBackButton />}
      {!hideFooter && <WhatsAppSupport />}

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <Router>
              <AppContent />
            </Router>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
