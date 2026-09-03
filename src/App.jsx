import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

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
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
            
            {/* Top Info Bar */}
            <TopBar />

            {/* Main Navigation Header */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<ServicesDirectory />} />
                <Route path="/services/aadhaar" element={<AadhaarServicesCatalog />} />
                <Route path="/services/pan-services" element={<PanServicesCatalog />} />
                <Route path="/services/pan" element={<PanServicesCatalog />} />
                <Route path="/pan-services" element={<PanServicesCatalog />} />
                <Route path="/services/:category" element={<CategoryView />} />
                <Route path="/category/:slug" element={<CategoryView />} />
                <Route path="/service/:serviceId" element={<ServiceDetails />} />
                <Route path="/service/:slug" element={<ServiceDetails />} />
                <Route path="/apply/:serviceId" element={<ApplyService />} />
                <Route path="/apply/slug/:slug" element={<ApplyService />} />
                <Route path="/my-applications" element={<MyApplications />} />
                <Route path="/my-applications/:id" element={<ApplicationDetailView />} />
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
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/payments" element={<UserPayments />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<UserNotifications />} />
                <Route path="/profile/notifications" element={<UserNotificationPreferences />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/notification-templates" element={<AdminNotificationTemplates />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Global Footer */}
            <Footer />

          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
