import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';

// Layout Components
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
import AadhaarServicesCatalog from './pages/AadhaarServicesCatalog';
import PanServicesCatalog from './pages/PanServicesCatalog';
import VoterServicesCatalog from './pages/VoterServicesCatalog';
import CertificateServicesCatalog from './pages/CertificateServicesCatalog';
import LandPattaServicesCatalog from './pages/LandPattaServicesCatalog';
import PassportServicesCatalog from './pages/PassportServicesCatalog';
import DrivingVehicleServicesCatalog from './pages/DrivingVehicleServicesCatalog';
import BusinessServicesCatalog from './pages/BusinessServicesCatalog';
import UtilityServicesCatalog from './pages/UtilityServicesCatalog';
import RationCardServicesCatalog from './pages/RationCardServicesCatalog';
import NotFound from './pages/NotFound';

function RequireCitizenAuth({ children }) {
  const { user, userToken, loading } = useAuth();
  const location = useLocation();

  const token = userToken || localStorage.getItem('token') || localStorage.getItem('eseva_user_token');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl shadow-sm p-8 text-center max-w-sm w-full space-y-4 border border-slate-200">
          <div className="w-12 h-12 border-4 border-[#0b192c] border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-bold text-xs">Verifying citizen authentication...</p>
        </div>
      </div>
    );
  }

  if (!user && !token) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/admin-');

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Info Bar & Main Navbar - Hidden on Admin Pages */}
      {!isAdminRoute && <TopBar />}
      {!isAdminRoute && <Navbar />}

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesDirectory />} />
          <Route path="/services/aadhaar" element={<AadhaarServicesCatalog />} />
          <Route path="/services/aadhaar-services" element={<AadhaarServicesCatalog />} />
          <Route path="/category/aadhaar-services" element={<AadhaarServicesCatalog />} />
          <Route path="/category/aadhaar" element={<AadhaarServicesCatalog />} />

          <Route path="/services/pan-services" element={<PanServicesCatalog />} />
          <Route path="/services/pan" element={<PanServicesCatalog />} />
          <Route path="/pan-services" element={<PanServicesCatalog />} />
          <Route path="/category/pan-services" element={<PanServicesCatalog />} />
          <Route path="/category/pan" element={<PanServicesCatalog />} />

          <Route path="/services/voter" element={<VoterServicesCatalog />} />
          <Route path="/services/voter-id-services" element={<VoterServicesCatalog />} />
          <Route path="/voter-services" element={<VoterServicesCatalog />} />
          <Route path="/category/voter-id-services" element={<VoterServicesCatalog />} />
          <Route path="/category/voter" element={<VoterServicesCatalog />} />

          <Route path="/services/certificates" element={<CertificateServicesCatalog />} />
          <Route path="/services/certificate-services" element={<CertificateServicesCatalog />} />
          <Route path="/certificate-services" element={<CertificateServicesCatalog />} />
          <Route path="/category/certificates" element={<CertificateServicesCatalog />} />
          <Route path="/category/certificate-services" element={<CertificateServicesCatalog />} />

          <Route path="/services/land" element={<LandPattaServicesCatalog />} />
          <Route path="/services/land-patta-services" element={<LandPattaServicesCatalog />} />
          <Route path="/category/land-patta-services" element={<LandPattaServicesCatalog />} />
          <Route path="/category/land" element={<LandPattaServicesCatalog />} />

          <Route path="/services/passport" element={<PassportServicesCatalog />} />
          <Route path="/services/passport-services" element={<PassportServicesCatalog />} />
          <Route path="/category/passport-services" element={<PassportServicesCatalog />} />
          <Route path="/category/passport" element={<PassportServicesCatalog />} />

          <Route path="/services/driving-licence" element={<DrivingVehicleServicesCatalog />} />
          <Route path="/services/vehicle" element={<DrivingVehicleServicesCatalog />} />
          <Route path="/services/driving-licence-vehicle-services" element={<DrivingVehicleServicesCatalog />} />
          <Route path="/services/driving-vehicle-services" element={<DrivingVehicleServicesCatalog />} />
          <Route path="/category/driving-vehicle-services" element={<DrivingVehicleServicesCatalog />} />
          <Route path="/category/vehicle" element={<DrivingVehicleServicesCatalog />} />

          <Route path="/services/business" element={<BusinessServicesCatalog />} />
          <Route path="/services/business-services" element={<BusinessServicesCatalog />} />
          <Route path="/category/business-services" element={<BusinessServicesCatalog />} />
          <Route path="/category/business" element={<BusinessServicesCatalog />} />

          <Route path="/services/utility" element={<UtilityServicesCatalog />} />
          <Route path="/services/utility-services" element={<UtilityServicesCatalog />} />
          <Route path="/category/utility-services" element={<UtilityServicesCatalog />} />
          <Route path="/category/utility" element={<UtilityServicesCatalog />} />

          <Route path="/services/other" element={<RationCardServicesCatalog />} />
          <Route path="/services/other-digital-services" element={<RationCardServicesCatalog />} />
          <Route path="/category/other-digital-services" element={<RationCardServicesCatalog />} />
          <Route path="/category/other-services" element={<RationCardServicesCatalog />} />
          <Route path="/category/other" element={<RationCardServicesCatalog />} />

          <Route path="/services/:category" element={<CategoryView />} />
          <Route path="/category/:slug" element={<CategoryView />} />
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
          <Route path="/profile" element={<RequireCitizenAuth><Profile /></RequireCitizenAuth>} />
          <Route path="/notifications" element={<RequireCitizenAuth><UserNotifications /></RequireCitizenAuth>} />
          <Route path="/profile/notifications" element={<RequireCitizenAuth><UserNotificationPreferences /></RequireCitizenAuth>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/notification-templates" element={<AdminNotificationTemplates />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Footer - Hidden on Admin Pages */}
      {!isAdminRoute && <Footer />}

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <AppContent />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
