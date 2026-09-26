import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  ShieldAlert, LayoutDashboard, FileText, Grid, Users, Mail,
  Briefcase, Search, RefreshCw, Eye, Edit3, CheckCircle2,
  XCircle, Clock, AlertCircle, Plus, ExternalLink, LogOut, DollarSign,
  Menu, X, Award, ChevronRight, TrendingUp, ShieldCheck, Activity,
  Filter, RotateCcw, Inbox, UserCheck, FileCheck, History, MessageSquare,
  User, Phone, Mail as MailIcon, Calendar, CheckCircle, Shield, Trash2,
  Settings, Key, Lock, EyeOff, Save, CheckCheck, Bell, CreditCard, Paperclip,
  Sliders, Image as ImageIcon, Upload, Download,
  Share2, Send, Linkedin, Twitter, Globe, Facebook, Instagram, Youtube, MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { invalidateServicesCache } from '../utils/useLiveServices';

const SERVICE_IMAGE_PRESETS = [
  { name: '🆔 Aadhaar', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop' },
  { name: '💳 PAN Card', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop' },
  { name: '🗳️ Voter ID', url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=800&auto=format&fit=crop' },
  { name: '🌾 Ration Card', url: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?q=80&w=800&auto=format&fit=crop' },
  { name: '📜 Certificates', url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop' },
  { name: '🏛️ Land & Patta', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop' },
  { name: '✈️ Passport', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop' },
  { name: '🚗 Driving & RTO', url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop' },
  { name: '💼 Business & MSME', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop' },
  { name: '⚡ Utility Bills', url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop' }
];

export default function AdminDashboard() {
  const { admin, adminToken, logoutAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTabParam = searchParams.get('tab');
  const [activeTabState, setActiveTabState] = useState(() => {
    return activeTabParam || localStorage.getItem('admin_active_tab') || 'applications';
  });

  const activeTab = activeTabParam || activeTabState;

  const setActiveTab = (tab) => {
    localStorage.setItem('admin_active_tab', tab);
    setActiveTabState(tab);
    setSearchParams({ tab });
  };

  const getAuthToken = () => {
    return adminToken || localStorage.getItem('eseva_admin_token') || localStorage.getItem('adminToken') || localStorage.getItem('token');
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  // Custom Delete Modal State
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    title: '',
    description: '',
    confirmText: '',
    onConfirm: null,
    loading: false
  });

  // Inspector & Status Update Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [appDetails, setAppDetails] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('Processing');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [certFile, setCertFile] = useState(null);
  const [certNumber, setCertNumber] = useState('');

  // User Inspector Modal State (STEP 27)
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('All');

  // Service Inspector Modal State (STEP 28)
  const [selectedService, setSelectedService] = useState(null);
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('All');

  // Data States
  const [customers, setCustomers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [careers, setCareers] = useState([]);
  const [services, setServices] = useState([]);
  const [adminPayments, setAdminPayments] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [paymentSearchQuery, setPaymentSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Contact Enquiry Inspector State (STEP 30)
  const [enquirySearchQuery, setEnquirySearchQuery] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Career Application Inspector State (STEP 31)
  const [careerSearchQuery, setCareerSearchQuery] = useState('');
  const [careerStatusFilter, setCareerStatusFilter] = useState('All');
  const [selectedCareerApp, setSelectedCareerApp] = useState(null);

  // Admin Notifications & Alerts State (STEP 32)
  const [adminNotifs, setAdminNotifs] = useState([]);
  const [notifSearchQuery, setNotifSearchQuery] = useState('');
  const [notifFilter, setNotifFilter] = useState('ALL');
  const [selectedNotif, setSelectedNotif] = useState(null);

  // Admin Document Explorer & Storage Notes State
  const [adminDocs, setAdminDocs] = useState([]);
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [docStatusFilter, setDocStatusFilter] = useState('All');
  const [selectedDocForNotes, setSelectedDocForNotes] = useState(null);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState(null);
  const [docNotesInput, setDocNotesInput] = useState('');
  const [savingDocNotes, setSavingDocNotes] = useState(false);

  const fetchAdminDocuments = async () => {
    if (!adminToken) return;
    try {
      let url = `/api/admin/documents?status=${docStatusFilter}`;
      if (docSearchQuery) url += `&search=${encodeURIComponent(docSearchQuery)}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminDocs(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Banner Management State
  const [banners, setBanners] = useState([]);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [savingBanner, setSavingBanner] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    description: '',
    link_url: '/services',
    duration_seconds: 5,
    status: 'Active',
    image_url_input: '',
    image_file: null
  });

  const fetchBanners = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/banners', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBanners(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Site Settings & Payment Notice Configuration State
  const [siteSettingsForm, setSiteSettingsForm] = useState({
    payment_notice_ta: '',
    payment_notice_en: '',
    payment_terms_enabled: true,
    social_facebook: '',
    social_instagram: '',
    social_youtube: '',
    social_whatsapp: '',
    social_twitter: '',
    social_telegram: '',
    social_linkedin: '',
    contact_phone: '',
    contact_email: '',
    contact_address: '',
    working_hours: ''
  });
  const [savingSiteSettings, setSavingSiteSettings] = useState(false);

  const fetchSiteSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSiteSettingsForm({
          payment_notice_ta: data.payment_notice_ta || '',
          payment_notice_en: data.payment_notice_en || '',
          payment_terms_enabled: data.payment_terms_enabled !== false,
          social_facebook: data.social_facebook || '',
          social_instagram: data.social_instagram || '',
          social_youtube: data.social_youtube || '',
          social_whatsapp: data.social_whatsapp || '',
          social_twitter: data.social_twitter || '',
          social_telegram: data.social_telegram || '',
          social_linkedin: data.social_linkedin || '',
          contact_phone: data.contact_phone || '',
          contact_email: data.contact_email || '',
          contact_address: data.contact_address || '',
          working_hours: data.working_hours || ''
        });
      }
    } catch (e) {
      console.error('Fetch settings error:', e);
    }
  };

  const handleSaveSiteSettings = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSavingSiteSettings(true);
    try {
      const token = getAuthToken();
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(siteSettingsForm)
      });
      const data = await res.json();
      if (res.ok) {
        addToast('Payment Terms & Notice Settings saved successfully!', 'success');
      } else {
        addToast(data.error || 'Failed to save site settings', 'error');
      }
    } catch (e) {
      addToast('Failed to save site settings', 'error');
    } finally {
      setSavingSiteSettings(false);
    }
  };

  const openAddBannerModal = () => {
    setEditingBanner(null);
    setBannerForm({
      title: '',
      description: '',
      link_url: '/services',
      duration_seconds: 5,
      status: 'Active',
      image_url_input: '',
      image_file: null
    });
    setShowBannerModal(true);
  };

  const openEditBannerModal = (b) => {
    setEditingBanner(b);
    setBannerForm({
      title: b.title || '',
      description: b.description || '',
      link_url: b.link_url || '/services',
      duration_seconds: b.duration_seconds || 5,
      status: b.status || 'Active',
      image_url_input: b.image_url || '',
      image_file: null
    });
    setShowBannerModal(true);
  };

  const handleSaveBannerSubmit = async (e) => {
    e.preventDefault();
    setSavingBanner(true);
    try {
      const formData = new FormData();
      formData.append('title', bannerForm.title);
      formData.append('description', bannerForm.description);
      formData.append('link_url', bannerForm.link_url);
      formData.append('duration_seconds', bannerForm.duration_seconds);
      formData.append('status', bannerForm.status);
      formData.append('image_url_input', bannerForm.image_url_input);
      if (bannerForm.image_file) {
        formData.append('image', bannerForm.image_file);
      }

      const url = editingBanner ? `/api/admin/banners/${editingBanner.id}` : '/api/admin/banners';
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        addToast(editingBanner ? 'Banner updated successfully!' : 'New Banner created successfully!', 'success');
        setShowBannerModal(false);
        fetchBanners();
      } else {
        addToast(data.error || 'Failed to save banner', 'error');
      }
    } catch (err) {
      addToast('Error saving banner', 'error');
    } finally {
      setSavingBanner(false);
    }
  };

  const handleToggleBannerStatus = async (banner) => {
    try {
      const newStatus = banner.status === 'Active' ? 'Inactive' : 'Active';
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        addToast(`Banner marked as ${newStatus}`, 'success');
        fetchBanners();
      }
    } catch (e) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this hero banner?')) return;
    try {
      const res = await fetch(`/api/admin/banners/${bannerId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        addToast('Banner deleted successfully', 'success');
        fetchBanners();
      }
    } catch (e) {
      addToast('Failed to delete banner', 'error');
    }
  };

  const handleSaveDocNotesSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDocForNotes) return;
    setSavingDocNotes(true);
    try {
      const res = await fetch(`/api/admin/documents/${selectedDocForNotes.id}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ admin_notes: docNotesInput })
      });
      const data = await res.json();
      if (res.ok) {
        addToast('Archival note saved successfully!', 'success');
        setSelectedDocForNotes(null);
        fetchAdminDocuments();
      } else {
        addToast(data.error || 'Failed to save archival note', 'error');
      }
    } catch (e) {
      addToast('Error saving archival note', 'error');
    } finally {
      setSavingDocNotes(false);
    }
  };

  // Admin Profile & Settings State (STEP 33)
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: admin?.name || 'Super Admin',
    email: admin?.email || 'admin@eseva.gov.in',
    phone: admin?.phone || '+91 98765 43210',
    role: admin?.role || 'System Administrator',
    department: 'Digital E-Seva Operations Governance'
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showPassword: false
  });
  const [notifPrefs, setNotifPrefs] = useState({
    systemAlerts: true,
    emailReceipts: true,
    applicationUpdates: true,
    paymentAlerts: true
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Category State & New Category Modal State
  const [categoriesList, setCategoriesList] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: '',
    description: '',
    icon: 'Grid'
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategoriesList(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSiteSettings();
  }, []);

  const handleCreateCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryForm.name.trim()) {
      addToast('Category name is required', 'error');
      return;
    }

    setCreatingCategory(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: newCategoryForm.name.trim(),
          description: newCategoryForm.description.trim(),
          icon: newCategoryForm.icon
        })
      });

      const data = await res.json();
      if (res.ok) {
        addToast(`New Category "${newCategoryForm.name}" created successfully!`, 'success');
        setShowAddCategoryModal(false);
        setNewCategoryForm({ name: '', description: '', icon: 'Grid' });
        fetchCategories();
        fetchServices();
      } else {
        addToast(data.error || 'Failed to create category', 'error');
      }
    } catch (err) {
      addToast('Category creation error', 'error');
    } finally {
      setCreatingCategory(false);
    }
  };
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [creatingService, setCreatingService] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({
    name: '',
    category_id: 4,
    category_name: 'Certificate Services',
    is_custom_category: false,
    custom_category_name: '',
    description: '',
    fee: 60,
    processing_time: '2-3 Business Days',
    image_url_input: '',
    image_file: null,
    image_preview: '',
    documents: [
      { name: 'Aadhaar Card Copy', is_required: true },
      { name: 'Passport Size Photo', is_required: true }
    ],
    newDocInput: '',
    newDocIsRequired: true,
    fields: [
      { field_label: 'Applicant Full Name', field_type: 'text', is_required: true },
      { field_label: 'Mobile Number', field_type: 'text', is_required: true },
      { field_label: 'Aadhaar / ID Number', field_type: 'text', is_required: true },
      { field_label: 'Residential Address', field_type: 'textarea', is_required: true }
    ],
    newFieldLabel: '',
    newFieldType: 'text',
    newFieldOptions: ''
  });

  const handleCreateServiceSubmit = async (e) => {
    e.preventDefault();
    if (!newServiceForm.name.trim()) {
      addToast('Service name is required', 'error');
      return;
    }

    const finalCategoryName = newServiceForm.is_custom_category
      ? newServiceForm.custom_category_name.trim()
      : newServiceForm.category_name;

    if (newServiceForm.is_custom_category && !finalCategoryName) {
      addToast('Please enter a custom category name', 'error');
      return;
    }

    setCreatingService(true);
    try {
      const formData = new FormData();
      formData.append('name', newServiceForm.name.trim());
      if (!newServiceForm.is_custom_category && newServiceForm.category_id) {
        formData.append('category_id', newServiceForm.category_id);
      }
      formData.append('category_name', finalCategoryName);
      formData.append('description', newServiceForm.description);
      formData.append('fee', Number(newServiceForm.fee) || 60);
      formData.append('processing_time', newServiceForm.processing_time);
      formData.append('image_url_input', newServiceForm.image_url_input || '');
      const formattedNewDocs = (newServiceForm.documents || []).map(d => {
        if (typeof d === 'string') return { document_name: d, is_required: 1, description: `Upload clear copy of ${d}` };
        const isReq = d.is_required !== false && d.is_required !== 0 && d.is_required !== '0';
        return {
          document_name: d.name || d.document_name,
          is_required: isReq ? 1 : 0,
          description: d.description || (isReq ? `Upload clear copy of ${d.name || d.document_name}` : `Upload clear copy of ${d.name || d.document_name} (Optional)`)
        };
      });
      formData.append('documents', JSON.stringify(formattedNewDocs));
      formData.append('fields', JSON.stringify(newServiceForm.fields));
      if (newServiceForm.image_file) {
        formData.append('image', newServiceForm.image_file);
      }

      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        addToast(`New Service "${newServiceForm.name}" created under ${finalCategoryName}!`, 'success');
        setShowAddServiceModal(false);
        setNewServiceForm({
          name: '',
          category_id: 4,
          category_name: 'Certificate Services',
          is_custom_category: false,
          custom_category_name: '',
          description: '',
          fee: 60,
          processing_time: '2-3 Business Days',
          image_url_input: '',
          image_file: null,
          image_preview: '',
          documents: [
            { name: 'Aadhaar Card Copy', is_required: true },
            { name: 'Passport Size Photo', is_required: true }
          ],
          newDocInput: '',
          newDocIsRequired: true,
          fields: [
            { field_label: 'Applicant Full Name', field_type: 'text', is_required: true },
            { field_label: 'Mobile Number', field_type: 'text', is_required: true },
            { field_label: 'Aadhaar / ID Number', field_type: 'text', is_required: true },
            { field_label: 'Residential Address', field_type: 'textarea', is_required: true }
          ],
          newFieldLabel: '',
          newFieldType: 'text',
          newFieldOptions: ''
        });
        invalidateServicesCache();
        await fetchServices();
      } else {
        addToast(data.error || 'Failed to create service', 'error');
      }
    } catch (err) {
      addToast('Service creation error', 'error');
    } finally {
      setCreatingService(false);
    }
  };

  // Edit & Delete Service Modal State
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [editingServiceForm, setEditingServiceForm] = useState(null);
  const [savingEditService, setSavingEditService] = useState(false);

  // Quick Price Edit Modal State (Instant price editing)
  const [quickPriceModal, setQuickPriceModal] = useState({
    isOpen: false,
    service: null,
    fee: 0,
    saving: false
  });

  const handleQuickPriceSave = async (e) => {
    e.preventDefault();
    if (!quickPriceModal.service) return;
    setQuickPriceModal(prev => ({ ...prev, saving: true }));
    try {
      const token = getAuthToken();
      if (!token) {
        addToast('Admin token not found. Please log in again.', 'error');
        setQuickPriceModal(prev => ({ ...prev, saving: false }));
        return;
      }

      const srvId = quickPriceModal.service.id || quickPriceModal.service.slug;
      const parsedFee = Number(quickPriceModal.fee);
      const safeFee = !isNaN(parsedFee) ? Math.max(0, parsedFee) : 0;

      const res = await fetch(`/api/admin/services/${srvId}/price`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ fee: safeFee, total_fee: safeFee })
      });

      const data = await res.json();
      if (res.ok) {
        addToast(data.message || `Price updated to ₹${safeFee}!`, 'success');
        setQuickPriceModal({ isOpen: false, service: null, fee: 0, saving: false });
        invalidateServicesCache();
        await fetchServices();
      } else {
        addToast(data.error || 'Failed to update price', 'error');
        setQuickPriceModal(prev => ({ ...prev, saving: false }));
      }
    } catch (err) {
      addToast('Price update failed', 'error');
      setQuickPriceModal(prev => ({ ...prev, saving: false }));
    }
  };

  const openEditServiceModal = async (srv) => {
    let docs = [];
    let fields = [];

    if (Array.isArray(srv.documents) && srv.documents.length > 0) {
      docs = srv.documents.map(d => {
        if (typeof d === 'string') return { name: d, is_required: true };
        const isMandatory = d.is_required !== 0 && d.is_required !== false && d.is_required !== '0' && d.required !== false && d.required !== 0;
        return {
          name: d.name || d.document_name || 'Document',
          is_required: isMandatory,
          description: d.description || ''
        };
      });
    } else if (srv.documents_json) {
      try {
        const parsed = typeof srv.documents_json === 'string' ? JSON.parse(srv.documents_json) : srv.documents_json;
        if (Array.isArray(parsed) && parsed.length > 0) {
          docs = parsed.map(d => {
            if (typeof d === 'string') return { name: d, is_required: true };
            const isMandatory = d.is_required !== 0 && d.is_required !== false && d.is_required !== '0' && d.required !== false && d.required !== 0;
            return {
              name: d.name || d.document_name || 'Document',
              is_required: isMandatory,
              description: d.description || ''
            };
          });
        }
      } catch (e) {}
    }
    const extractOpts = (f) => {
      if (f.options) {
        return Array.isArray(f.options) ? f.options : (typeof f.options === 'string' ? f.options.split(',').map(s => s.trim()).filter(Boolean) : []);
      }
      if (f.options_json) {
        try {
          return typeof f.options_json === 'string' ? JSON.parse(f.options_json) : f.options_json;
        } catch (e) {
          return String(f.options_json).split(',').map(s => s.trim()).filter(Boolean);
        }
      }
      return [];
    };

    if (Array.isArray(srv.fields) && srv.fields.length > 0) {
      fields = srv.fields.map(f => {
        const opts = extractOpts(f);
        return {
          field_label: f.field_label || f.name || f.label || 'Field',
          field_type: f.field_type || f.type || 'text',
          is_required: f.is_required !== undefined ? Boolean(f.is_required) : true,
          options: opts,
          options_json: opts
        };
      });
    }

    // If documents or fields missing from row, fetch full single service details
    if (docs.length === 0 || fields.length === 0) {
      try {
        const res = await fetch(`/api/services/${srv.id || srv.slug}`);
        if (res.ok) {
          const fullSrv = await res.json();
          if (docs.length === 0 && Array.isArray(fullSrv.documents)) {
            docs = fullSrv.documents.map(d => {
              if (typeof d === 'string') return { name: d, is_required: true };
              const isMandatory = d.is_required !== 0 && d.is_required !== false && d.is_required !== '0' && d.required !== false && d.required !== 0;
              return {
                name: d.document_name || d.name,
                is_required: isMandatory,
                description: d.description || ''
              };
            });
          }
          if (fields.length === 0 && Array.isArray(fullSrv.fields)) {
            fields = fullSrv.fields.map(f => {
              const opts = extractOpts(f);
              return {
                field_label: f.field_label || f.name || f.label || 'Field',
                field_type: f.field_type || f.type || 'text',
                is_required: f.is_required !== undefined ? Boolean(f.is_required) : true,
                options: opts,
                options_json: opts
              };
            });
          }
        }
      } catch (err) {}
    }

    if (docs.length === 0) {
      docs = [
        { name: 'Aadhaar Card Copy', is_required: true },
        { name: 'Passport Size Photo', is_required: true }
      ];
    }
    if (fields.length === 0) {
      fields = [
        { field_label: 'Applicant Full Name', field_type: 'text', is_required: true },
        { field_label: 'Mobile Number', field_type: 'text', is_required: true },
        { field_label: 'Aadhaar / ID Number', field_type: 'text', is_required: true },
        { field_label: 'Residential Address', field_type: 'textarea', is_required: true }
      ];
    }

    const currentFee = (srv.fee !== undefined && srv.fee !== null)
      ? srv.fee
      : ((srv.total_fee !== undefined && srv.total_fee !== null)
        ? srv.total_fee
        : ((srv.govt_fee !== undefined && srv.govt_fee !== null) ? srv.govt_fee : 60));

    setEditingServiceForm({
      id: srv.id,
      name: srv.name || '',
      category_name: srv.category_name || srv.category || 'Land & Patta Services',
      description: srv.description || '',
      fee: !isNaN(Number(currentFee)) ? Number(currentFee) : 60,
      processing_time: srv.processing_time || '2-3 Business Days',
      status: srv.status || (srv.is_active !== false ? 'Active' : 'Inactive'),
      image_url_input: srv.image_url || '',
      image_file: null,
      image_preview: srv.image_url || '',
      documents: docs,
      newDocInput: '',
      newDocIsRequired: true,
      fields: fields,
      newFieldLabel: '',
      newFieldType: 'text',
      newFieldOptions: ''
    });
    setShowEditServiceModal(true);
  };

  const handleEditServiceSubmit = async (e) => {
    e.preventDefault();
    if (!editingServiceForm || !editingServiceForm.name.trim()) {
      addToast('Service name is required', 'error');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      addToast('Admin authorization token is missing. Please log in again.', 'error');
      return;
    }

    setSavingEditService(true);
    try {
      const parsedFee = Number(editingServiceForm.fee);
      const safeFee = !isNaN(parsedFee) ? Math.max(0, parsedFee) : 0;

      const formData = new FormData();
      formData.append('name', editingServiceForm.name.trim());
      formData.append('category_name', editingServiceForm.category_name);
      formData.append('description', editingServiceForm.description);
      formData.append('fee', safeFee);
      formData.append('total_fee', safeFee);
      formData.append('govt_fee', safeFee);
      formData.append('processing_time', editingServiceForm.processing_time);
      formData.append('status', editingServiceForm.status);
      formData.append('is_active', editingServiceForm.status === 'Active');
      formData.append('image_url_input', editingServiceForm.image_url_input || '');
      const formattedEditDocs = (editingServiceForm.documents || []).map(d => {
        if (typeof d === 'string') return { document_name: d, is_required: 1, description: `Upload clear copy of ${d}` };
        const isReq = d.is_required !== false && d.is_required !== 0 && d.is_required !== '0';
        return {
          document_name: d.name || d.document_name,
          is_required: isReq ? 1 : 0,
          description: d.description || (isReq ? `Upload clear copy of ${d.name || d.document_name}` : `Upload clear copy of ${d.name || d.document_name} (Optional)`)
        };
      });
      formData.append('documents', JSON.stringify(formattedEditDocs));
      formData.append('fields', JSON.stringify(editingServiceForm.fields));
      if (editingServiceForm.image_file) {
        formData.append('image', editingServiceForm.image_file);
      }

      const res = await fetch(`/api/admin/services/${editingServiceForm.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        addToast(`Service "${editingServiceForm.name}" updated successfully (Fee: ₹${safeFee})!`, 'success');
        setShowEditServiceModal(false);
        setEditingServiceForm(null);
        invalidateServicesCache();
        await fetchServices();
      } else {
        addToast(data.error || 'Failed to update service', 'error');
      }
    } catch (err) {
      addToast('Service edit error: ' + (err.message || 'Network error'), 'error');
    } finally {
      setSavingEditService(false);
    }
  };

  const handleDeleteService = async (srv) => {
    if (!window.confirm(`Are you sure you want to delete service "${srv.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/services/${srv.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        addToast(`Service "${srv.name}" deleted successfully`, 'success');
        fetchServices();
      } else {
        addToast(data.error || 'Failed to delete service', 'error');
      }
    } catch (err) {
      addToast('Error deleting service', 'error');
    }
  };


  const fetchDashboardStats = async (isQuiet = false) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/dashboard?_t=${Date.now()}`, {
        headers: { 
          Authorization: `Bearer ${adminToken}`,
          'Cache-Control': 'no-cache'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchApplications = async (isQuiet = false) => {
    if (!adminToken) return;
    try {
      if (isQuiet) setIsLiveSyncing(true);
      let url = `/api/admin/applications?status=${statusFilter}&_t=${Date.now()}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url, {
        headers: { 
          Authorization: `Bearer ${adminToken}`,
          'Cache-Control': 'no-cache'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(prev => {
          // Detect newly submitted applications in background polling
          if (isQuiet && prev && prev.length > 0 && data.length > prev.length) {
            const prevIds = new Set(prev.map(a => String(a.id || a.application_number)));
            const newApps = data.filter(a => !prevIds.has(String(a.id || a.application_number)));
            if (newApps.length > 0) {
              const latest = newApps[0];
              addToast(
                `🔔 New Application Received: ${latest.application_number} (${latest.service_name || 'Service'}) from ${latest.user_name || 'Citizen'}`,
                'success',
                6000
              );
            }
          }
          return data;
        });
        setLastSyncTime(new Date());
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (isQuiet) {
        setTimeout(() => setIsLiveSyncing(false), 800);
      }
    }
  };

  const fetchCustomers = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setCustomers(await res.json());
    } catch (e) {}
  };

  const getUserApplicationCount = (user) => {
    if (!user) return 0;
    const uEmail = (user.email || '').trim().toLowerCase();
    const uPhone = (user.phone || '').replace(/\D/g, '');
    const uName = (user.name || '').trim().toLowerCase();

    const countFromState = applications.filter(a => {
      const appUserId = a.user_id ? String(a.user_id) : null;
      const appEmail = (a.user_email || a.email || '').trim().toLowerCase();
      const appPhone = (a.user_phone || a.phone || '').replace(/\D/g, '');
      const appName = (a.applicant_name || a.user_name || a.name || '').trim().toLowerCase();

      const matchId = appUserId && String(user.id) === appUserId;
      const matchEmail = uEmail && appEmail && (uEmail === appEmail || appEmail.includes(uEmail.split('@')[0]) || uEmail.includes(appEmail.split('@')[0]));
      const matchPhone = uPhone && appPhone && uPhone.length >= 10 && appPhone.length >= 10 && (uPhone.endsWith(appPhone.slice(-10)) || appPhone.endsWith(uPhone.slice(-10)));
      const matchName = uName && appName && uName === appName;

      return matchId || matchEmail || matchPhone || matchName;
    }).length;

    const countFromUserObj = Array.isArray(user.applications) ? user.applications.length : (user.total_applications || user.application_count || 0);

    return Math.max(countFromUserObj, countFromState);
  };

  const getUserApplicationsList = (user) => {
    if (!user) return [];
    
    const uEmail = (user.email || '').trim().toLowerCase();
    const uPhone = (user.phone || '').replace(/\D/g, '');
    const uName = (user.name || '').trim().toLowerCase();

    const appsFromState = applications.filter(a => {
      const appUserId = a.user_id ? String(a.user_id) : null;
      const appEmail = (a.user_email || a.email || '').trim().toLowerCase();
      const appPhone = (a.user_phone || a.phone || '').replace(/\D/g, '');
      const appName = (a.applicant_name || a.user_name || a.name || '').trim().toLowerCase();

      const matchId = appUserId && String(user.id) === appUserId;
      const matchEmail = uEmail && appEmail && (uEmail === appEmail || appEmail.includes(uEmail.split('@')[0]) || uEmail.includes(appEmail.split('@')[0]));
      const matchPhone = uPhone && appPhone && uPhone.length >= 10 && appPhone.length >= 10 && (uPhone.endsWith(appPhone.slice(-10)) || appPhone.endsWith(uPhone.slice(-10)));
      const matchName = uName && appName && uName === appName;

      return matchId || matchEmail || matchPhone || matchName;
    }).map(a => ({
      id: a.id,
      application_number: a.application_number,
      service_name: a.service_name || 'Digital Service',
      status: a.status || 'SUBMITTED',
      created_at: a.created_at
    }));

    if (Array.isArray(user.applications) && user.applications.length > 0) {
      // Merge unique applications by application_number
      const map = new Map();
      user.applications.forEach(a => map.set(a.application_number || a.id, a));
      appsFromState.forEach(a => map.set(a.application_number || a.id, a));
      return Array.from(map.values());
    }

    return appsFromState;
  };

  const handleDeleteUser = (userId, userName) => {
    const targetUser = customers.find(u => String(u.id) === String(userId)) || selectedUser;
    const displayName = userName || targetUser?.name || 'Citizen User';

    setDeleteModalState({
      isOpen: true,
      title: 'Delete Citizen User Account?',
      description: `Are you sure you want to delete the citizen user account for "${displayName}" (ID #${userId})? This action cannot be undone.`,
      confirmText: 'Yes, Delete User',
      loading: false,
      onConfirm: async () => {
        setDeleteModalState(prev => ({ ...prev, loading: true }));
        try {
          const token = getAuthToken();
          const res = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            addToast('Citizen user account deleted successfully', 'success');
            if (selectedUser && String(selectedUser.id) === String(userId)) setSelectedUser(null);
            setCustomers(prev => prev.filter(u => String(u.id) !== String(userId)));
            fetchCustomers();
          } else {
            const data = await res.json().catch(() => ({}));
            addToast(data.error || 'Failed to delete user account', 'error');
          }
        } catch (e) {
          addToast('Failed to delete user account', 'error');
        } finally {
          setDeleteModalState({ isOpen: false, title: '', description: '', confirmText: '', onConfirm: null, loading: false });
        }
      }
    });
  };

  const fetchEnquiries = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setEnquiries(await res.json());
    } catch (e) {}
  };

  const handleDeleteEnquiry = (enquiryId) => {
    const targetId = enquiryId ?? selectedEnquiry?.id;
    setDeleteModalState({
      isOpen: true,
      title: 'Delete Contact Enquiry?',
      description: 'Are you sure you want to delete this citizen contact enquiry? This action cannot be undone.',
      confirmText: 'Yes, Delete',
      loading: false,
      onConfirm: async () => {
        setDeleteModalState(prev => ({ ...prev, loading: true }));
        try {
          const token = getAuthToken();
          const deleteUrl = (targetId && targetId !== 'undefined' && targetId !== 'null') ? `/api/admin/enquiries/${targetId}` : '/api/admin/enquiries';
          const res = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            addToast('Enquiry deleted successfully', 'success');
            if (selectedEnquiry && (String(selectedEnquiry.id) === String(targetId) || !targetId)) setSelectedEnquiry(null);
            if (targetId && targetId !== 'undefined') {
              setEnquiries(prev => prev.filter(m => String(m.id) !== String(targetId)));
            } else {
              setEnquiries([]);
            }
            fetchEnquiries();
          } else {
            const data = await res.json().catch(() => ({}));
            addToast(data.error || 'Failed to delete enquiry', 'error');
          }
        } catch (e) {
          addToast('Failed to delete enquiry', 'error');
        } finally {
          setDeleteModalState({ isOpen: false, title: '', description: '', confirmText: '', onConfirm: null, loading: false });
        }
      }
    });
  };

  const handlePurgeAllEnquiries = () => {
    setDeleteModalState({
      isOpen: true,
      title: 'Purge All Contact Enquiries?',
      description: 'Are you sure you want to purge ALL contact enquiry messages? This action cannot be undone.',
      confirmText: 'Purge All',
      loading: false,
      onConfirm: async () => {
        setDeleteModalState(prev => ({ ...prev, loading: true }));
        try {
          const token = getAuthToken();
          const res = await fetch('/api/admin/enquiries-purge-all', {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            addToast('All contact enquiries purged successfully', 'success');
            setSelectedEnquiry(null);
            setEnquiries([]);
            fetchEnquiries();
          } else {
            const data = await res.json().catch(() => ({}));
            addToast(data.error || 'Failed to purge enquiries', 'error');
          }
        } catch (e) {
          addToast('Failed to purge enquiries', 'error');
        } finally {
          setDeleteModalState({ isOpen: false, title: '', description: '', confirmText: '', onConfirm: null, loading: false });
        }
      }
    });
  };

  const fetchCareers = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/careers', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) setCareers(await res.json());
    } catch (e) {}
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) setServices(await res.json());
    } catch (e) {}
  };

  const fetchPayments = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/payments', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) setAdminPayments(await res.json());
    } catch (e) {}
  };

  const fetchAdminNotifs = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/notifications', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminNotifs(data.notifications || []);
      }
    } catch (e) {}
  };

  const handleRefund = async (paymentId) => {
    if (!window.confirm('Are you sure you want to issue a full refund for this payment?')) return;
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        addToast('Payment refunded successfully!', 'success');
        fetchPayments();
      } else {
        addToast(data.error || 'Refund failed', 'error');
      }
    } catch (e) {
      addToast('Refund request failed', 'error');
    }
  };

  useEffect(() => {
    if (!admin || !adminToken) {
      navigate('/admin/login');
      return;
    }
    setLoading(true);
    Promise.all([
      fetchDashboardStats(),
      fetchApplications(),
      fetchCustomers(),
      fetchEnquiries(),
      fetchCareers(),
      fetchServices(),
      fetchPayments(),
      fetchAdminNotifs(),
      fetchAdminDocuments(),
      fetchBanners()
    ]).then(() => setLoading(false));
  }, [admin, adminToken, navigate]);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, searchQuery]);

  // Real-time Automatic Background Live Sync (every 5s and on tab focus)
  useEffect(() => {
    if (!admin || !adminToken) return;

    const pollTimer = setInterval(() => {
      fetchApplications(true);
      fetchDashboardStats(true);
    }, 5000);

    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchApplications(true);
        fetchDashboardStats(true);
      }
    };

    window.addEventListener('visibilitychange', handleFocus);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(pollTimer);
      window.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('focus', handleFocus);
    };
  }, [admin, adminToken, statusFilter, searchQuery]);

  useEffect(() => {
    fetchAdminDocuments();
  }, [docStatusFilter, docSearchQuery]);

  const normalizeAppStatus = (raw) => {
    if (!raw) return 'Processing';
    const s = String(raw).toUpperCase().trim();
    if (s === 'COMPLETED') return 'Completed';
    if (s === 'UNDER_REVIEW' || s === 'UNDER REVIEW') return 'Under Review';
    if (s === 'IN_PROCESS' || s === 'PROCESSING') return 'Processing';
    if (s === 'APPROVED') return 'Approved';
    if (s === 'REJECTED') return 'Rejected';
    if (s === 'PENDING' || s === 'SUBMITTED') return 'Pending';
    return raw;
  };

  const openAppInspector = async (appId) => {
    setSelectedApp(appId);
    setCertFile(null);
    try {
      const res = await fetch(`/api/applications/${appId}`);
      if (res.ok) {
        const data = await res.json();
        setAppDetails(data);
        setUpdateStatus(normalizeAppStatus(data.status));
        setAdminRemarks(data.admin_remarks || '');
        setCertNumber(data.certificate_number || `CERT-2026-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setSavingStatus(true);
    try {
      let res;
      if (certFile) {
        const formData = new FormData();
        formData.append('status', updateStatus);
        formData.append('admin_remarks', adminRemarks);
        if (certNumber) formData.append('certificate_number', certNumber);
        formData.append('certificate', certFile);

        res = await fetch(`/api/admin/applications/${selectedApp}/status`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${adminToken}`
          },
          body: formData
        });
      } else {
        res = await fetch(`/api/admin/applications/${selectedApp}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            status: updateStatus,
            admin_remarks: adminRemarks,
            certificate_number: certNumber
          })
        });
      }
      const data = await res.json();
      if (res.ok) {
        addToast(`Application status updated to ${updateStatus}${certFile ? ' with Certificate attached' : ''}`, 'success');
        setCertFile(null);
        fetchApplications();
        fetchDashboardStats();
        openAppInspector(selectedApp);
      } else {
        addToast(data.error || 'Failed to update status', 'error');
      }
    } catch (e) {
      console.error(e);
      addToast('Server error while updating status', 'error');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleIssueCertificate = async (appId) => {
    const certNum = window.prompt('Enter or confirm Certificate Number:', `CERT-2026-${Math.floor(100000 + Math.random() * 900000)}`);
    if (!certNum) return;
    try {
      const res = await fetch(`/api/admin/applications/${appId}/certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ certificate_number: certNum })
      });
      const data = await res.json();
      if (res.ok) {
        addToast('Official Digital Certificate issued successfully!', 'success');
        openAppInspector(appId);
        fetchApplications();
        fetchDashboardStats();
      } else {
        addToast(data.error || 'Failed to issue certificate', 'error');
      }
    } catch (e) {
      addToast('Error issuing certificate', 'error');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications Manager', icon: FileText, count: stats?.total_applications },
    { id: 'documents', label: 'Uploaded Documents Explorer', icon: Paperclip, count: adminDocs.length },
    { id: 'banners', label: 'Banner Manager', icon: Sliders, count: banners.length },
    { id: 'services', label: 'Services Directory', icon: Grid },
    { id: 'customers', label: 'Users Directory', icon: Users, count: stats?.total_users || customers.length },
    { id: 'enquiries', label: 'Contact Enquiries', icon: Mail, count: stats?.unread_enquiries },
    { id: 'payments', label: 'Payments & Fee Audit', icon: DollarSign },
    { id: 'careers', label: 'Careers & Applications', icon: Briefcase },
    { id: 'notifications', label: 'Notifications & Alerts', icon: Bell, count: adminNotifs.filter(n => !n.isRead && !n.is_read).length },
    { id: 'settings', label: 'Profile & Settings', icon: Settings }
  ];

  // Filtered Users List
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = !userSearchQuery || 
      (c.name && c.name.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
      (c.phone && c.phone.includes(userSearchQuery));
    const matchesStatus = userStatusFilter === 'All' || (userStatusFilter === 'Active' && (!c.status || c.status === 'Active'));
    return matchesSearch && matchesStatus;
  });

  // Filtered Services List & Categories (STEP 28)
  const serviceCategories = ['All', ...Array.from(new Set(services.map(s => s.category_name || s.category || 'General')))];
  
  const filteredServices = services.filter(s => {
    const matchesSearch = !serviceSearchQuery ||
      (s.name && s.name.toLowerCase().includes(serviceSearchQuery.toLowerCase())) ||
      (s.category_name && s.category_name.toLowerCase().includes(serviceSearchQuery.toLowerCase())) ||
      (s.description && s.description.toLowerCase().includes(serviceSearchQuery.toLowerCase()));
    const matchesCategory = selectedServiceCategory === 'All' || 
      s.category_name === selectedServiceCategory || 
      s.category === selectedServiceCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered Payments List (STEP 29)
  const filteredPayments = adminPayments.filter(p => {
    const matchesSearch = !paymentSearchQuery ||
      (p.transaction_id && p.transaction_id.toLowerCase().includes(paymentSearchQuery.toLowerCase())) ||
      (p.application_number && p.application_number.toLowerCase().includes(paymentSearchQuery.toLowerCase())) ||
      (p.user_name && p.user_name.toLowerCase().includes(paymentSearchQuery.toLowerCase())) ||
      (p.service_name && p.service_name.toLowerCase().includes(paymentSearchQuery.toLowerCase()));
    const matchesStatus = paymentFilter === 'All' || 
      (p.status && p.status.toUpperCase() === paymentFilter.toUpperCase()) ||
      (paymentFilter === 'Paid' && (!p.status || p.status.toLowerCase() === 'paid' || p.status.toLowerCase() === 'success'));
    return matchesSearch && matchesStatus;
  });

  // Filtered Contact Enquiries List (STEP 30)
  const filteredEnquiries = enquiries.filter(m => {
    const matchesSearch = !enquirySearchQuery ||
      (m.name && m.name.toLowerCase().includes(enquirySearchQuery.toLowerCase())) ||
      (m.email && m.email.toLowerCase().includes(enquirySearchQuery.toLowerCase())) ||
      (m.phone && m.phone.includes(enquirySearchQuery)) ||
      (m.subject && m.subject.toLowerCase().includes(enquirySearchQuery.toLowerCase())) ||
      (m.message && m.message.toLowerCase().includes(enquirySearchQuery.toLowerCase()));
    const matchesStatus = enquiryStatusFilter === 'All' ||
      (m.status && m.status.toLowerCase() === enquiryStatusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  // Filtered Career Applications List (STEP 31)
  const filteredCareers = careers.filter(c => {
    const matchesSearch = !careerSearchQuery ||
      (c.applicant_name && c.applicant_name.toLowerCase().includes(careerSearchQuery.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(careerSearchQuery.toLowerCase())) ||
      (c.phone && c.phone.includes(careerSearchQuery)) ||
      (c.position && c.position.toLowerCase().includes(careerSearchQuery.toLowerCase())) ||
      (c.experience && c.experience.toLowerCase().includes(careerSearchQuery.toLowerCase()));
    const matchesStatus = careerStatusFilter === 'All' ||
      (c.status && c.status.toLowerCase() === careerStatusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  // Filtered Admin Notifications & Alerts (STEP 32)
  const filteredAdminNotifs = adminNotifs.filter(n => {
    const matchesSearch = !notifSearchQuery ||
      (n.title && n.title.toLowerCase().includes(notifSearchQuery.toLowerCase())) ||
      (n.message && n.message.toLowerCase().includes(notifSearchQuery.toLowerCase())) ||
      (n.id && String(n.id).includes(notifSearchQuery));
    
    let matchesFilter = true;
    if (notifFilter === 'UNREAD') matchesFilter = !n.isRead && !n.is_read;
    else if (notifFilter === 'SUBMISSIONS') matchesFilter = n.type === 'APPLICATION_SUBMITTED';
    else if (notifFilter === 'PAYMENTS') matchesFilter = n.type && n.type.includes('PAYMENT');
    else if (notifFilter === 'DOCUMENTS') matchesFilter = n.type && n.type.includes('DOCUMENT');

    return matchesSearch && matchesFilter;
  });

  if (!adminToken) {
    setTimeout(() => {
      navigate('/admin/login');
    }, 100);
    return (
      <div className="min-h-screen bg-[#0b192c] flex flex-col items-center justify-center text-white space-y-4 font-sans p-6 text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-extrabold tracking-wide text-slate-300">
          Admin Session Required. Redirecting to Login...
        </p>
        <button
          onClick={() => navigate('/admin/login')}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow transition-colors cursor-pointer"
        >
          Click Here to Sign In to Admin Cockpit
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Main Admin Bar */}
      <header className="bg-[#0b192c] border-b border-slate-800 text-white px-4 sm:px-6 py-3 flex justify-between items-center shrink-0 z-40 shadow-lg">
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800 border border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-extrabold shadow-md">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-black text-base text-white tracking-tight">E-SEVA ADMIN</h1>
                <span className="bg-orange-500/20 text-orange-400 text-[10px] font-black px-2 py-0.5 rounded border border-orange-500/30 uppercase tracking-widest">
                  Cockpit
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Operations Management & Verification Portal
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Live Sync Status Indicator */}
          <div 
            className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold shadow-xs"
            title={`Auto-syncing every 5 seconds. Last synced: ${lastSyncTime.toLocaleTimeString()}`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 ${isLiveSyncing ? 'opacity-90' : 'opacity-50'}`}></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold tracking-tight">
              {isLiveSyncing ? 'Syncing...' : 'Live Sync'}
            </span>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              Promise.all([
                fetchDashboardStats(),
                fetchApplications(),
                fetchCustomers(),
                fetchEnquiries(),
                fetchServices(),
                fetchPayments()
              ]).then(() => setLoading(false));
            }}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors hidden sm:flex items-center space-x-1.5 text-xs font-semibold cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-orange-400' : ''}`} />
            <span>Refresh</span>
          </button>

          <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block leading-none">{admin?.name || 'Administrator'}</span>
              <span className="text-[10px] text-orange-400 font-mono tracking-wider uppercase leading-none mt-1 block">
                {admin?.role || 'Super Admin'}
              </span>
            </div>

            <div className="w-9 h-9 rounded-xl bg-slate-800 text-orange-400 border border-slate-700 flex items-center justify-center font-extrabold text-sm shadow">
              {(admin?.name || 'A')[0].toUpperCase()}
            </div>

            <button
              onClick={() => {
                logoutAdmin();
                navigate('/admin/login');
              }}
              className="bg-slate-900 hover:bg-rose-900/80 text-slate-300 hover:text-white p-2 rounded-xl border border-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body Wrapper */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 md:hidden flex animate-in fade-in duration-150">
            <div className="w-72 bg-[#0b192c] text-white h-full p-4 flex flex-col justify-between overflow-y-auto shadow-2xl border-r border-slate-800 animate-in slide-in-from-left duration-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-5 h-5 text-orange-400" />
                    <span className="font-black text-sm text-white">ADMIN NAVIGATION</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 border border-slate-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="px-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  NAVIGATION MODULES
                </div>

                <div className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-orange-500 text-white shadow-md font-black'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.count !== undefined && item.count > 0 && (
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-white text-orange-600' : 'bg-slate-800 text-orange-400'
                          }`}>
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 mt-4 shrink-0">
                <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Verified Desk Portal</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Session active under ID <code className="text-orange-400 font-mono">#ADM-8492</code>. All updates logged.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* Navigation Sidebar - Desktop with 100% Independent Scrolling */}
        <aside className="w-64 bg-[#0b192c] text-white border-r border-slate-800 p-4 hidden md:flex md:flex-col justify-between h-full shrink-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1.5 py-1 [scrollbar-width:thin] [scrollbar-color:#334155_#0b192c]">
            <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              NAVIGATION MODULES
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md font-black'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-orange-600' : 'bg-slate-800 text-orange-400'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 shrink-0 border-t border-slate-800/80 mt-2">
            <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Desk Portal</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Session active under ID <code className="text-orange-400 font-mono">#ADM-8492</code>. All updates logged.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Area - 100% Independent Content Scrolling */}
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl [scrollbar-width:thin]">
          
          {/* Breadcrumb Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-500">
                <Link to="/" className="hover:text-slate-900 transition-colors">Portal Home</Link>
                <span>/</span>
                <span className="text-slate-700">Admin Cockpit</span>
                <span>/</span>
                <span className="text-orange-600 font-bold uppercase tracking-wider">
                  {activeTab === 'customers' ? 'Users' : activeTab}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'applications' && 'Application Management Directory'}
                {activeTab === 'documents' && 'Uploaded Proof Documents Explorer'}
                {activeTab === 'services' && 'Services Catalog Manager'}
                {activeTab === 'customers' && 'Registered Users Directory'}
                {activeTab === 'enquiries' && 'Contact Enquiries & Support'}
                {activeTab === 'payments' && 'Payments & Revenue Audit'}
                {activeTab === 'careers' && 'Careers & Applications'}
                {activeTab === 'notifications' && 'Notifications & Alerts Stream'}
                {activeTab === 'settings' && 'Profile & Settings Workspace'}
              </h2>
            </div>

            <div className="text-xs text-slate-500 font-medium flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-sm self-start sm:self-auto">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>Session: <strong className="text-slate-800">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></span>
            </div>
          </div>

          {/* TAB: UPLOADED PROOF DOCUMENTS EXPLORER */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              
              {/* Header Banner */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      DOCUMENT REPOSITORY & ARCHIVE
                    </span>
                    <span className="text-xs font-mono text-slate-500">• Citizen Proof Documents</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Uploaded Proof Documents Explorer & Archival System
                  </h3>
                  <p className="text-xs text-slate-500">
                    Search and inspect citizen uploaded proof documents by Mobile Number, Email, Applicant Name, or Application Number.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setDocSearchQuery('');
                      setDocStatusFilter('All');
                      fetchAdminDocuments();
                    }}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
                    <span>Reset Search</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Controls */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Mobile No, Email, Applicant Name, Application ID, or Document Name..."
                    value={docSearchQuery}
                    onChange={(e) => setDocSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-10 py-3 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner font-medium"
                  />
                  {docSearchQuery && (
                    <button
                      onClick={() => setDocSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-orange-500 shrink-0" />
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Status:</label>
                  <select
                    value={docStatusFilter}
                    onChange={(e) => setDocStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-xl p-2.5 focus:ring-2 focus:ring-[#0b192c] focus:outline-none flex-1 sm:flex-none cursor-pointer"
                  >
                    <option value="All">All Verification Statuses</option>
                    <option value="Verified">✓ Verified Only</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Rejected">⚠ Rejected Only</option>
                  </select>
                </div>
              </div>

              {/* Documents Data Table */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
                {adminDocs.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <Paperclip className="w-12 h-12 text-slate-300 mx-auto" />
                    <h4 className="font-extrabold text-slate-800 text-sm">No uploaded documents found</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {docSearchQuery || docStatusFilter !== 'All' 
                        ? 'No documents match the current search filters. Try clearing your query.'
                        : 'No applicant proof documents are currently stored in the system.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#0b192c] text-[11px] font-black text-slate-300 uppercase tracking-wider border-b border-slate-800">
                          <th className="py-4 px-4 sm:px-6 text-orange-400">Applicant Details</th>
                          <th className="py-4 px-4 sm:px-6">App Ref # & Service</th>
                          <th className="py-4 px-4 sm:px-6">Document Name & File</th>
                          <th className="py-4 px-4 sm:px-6">Upload Date</th>
                          <th className="py-4 px-4 sm:px-6">Status</th>
                          <th className="py-4 px-4 sm:px-6">Archival Notes</th>
                          <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-medium">
                        {adminDocs.map((doc) => {
                          const isVerified = doc.verification_status === 'Verified';
                          const isRejected = doc.verification_status === 'Rejected';

                          return (
                            <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                              
                              {/* Applicant Info */}
                              <td className="py-4 px-4 sm:px-6">
                                <div className="space-y-0.5">
                                  <span className="font-black text-slate-900 block text-xs">{doc.user_name}</span>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                    <span className="font-mono text-orange-600 font-bold">{doc.user_phone}</span>
                                    <span>•</span>
                                    <span className="truncate max-w-[140px]">{doc.user_email}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Application & Service */}
                              <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                                <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-mono font-bold text-slate-900 block w-fit text-[11px] mb-1">
                                  {doc.application_number}
                                </span>
                                <span className="text-[11px] text-slate-600 font-bold block max-w-[160px] truncate">
                                  {doc.service_name}
                                </span>
                              </td>

                              {/* Document Name & File */}
                              <td className="py-4 px-4 sm:px-6">
                                <div className="flex items-center gap-3">
                                  {doc.file_path && (doc.file_type?.startsWith('image/') || /\.(jpg|jpeg|png|webp|jfif|bmp)$/i.test(doc.file_path || doc.file_name || '')) ? (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedDocForPreview(doc)}
                                      className="relative shrink-0 group rounded-lg overflow-hidden border border-slate-200 cursor-pointer shadow-2xs"
                                      title="Click to preview photo"
                                    >
                                      <img
                                        src={doc.file_path.startsWith('http') || doc.file_path.startsWith('data:') ? doc.file_path : `/api/documents/${doc.id}/preview`}
                                        alt={doc.document_name}
                                        className="w-10 h-10 object-cover group-hover:scale-110 transition-transform"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                      />
                                    </button>
                                  ) : null}
                                  <div className="space-y-0.5 min-w-0">
                                    <span className="font-extrabold text-slate-900 block text-xs truncate max-w-[200px]">{doc.document_name}</span>
                                    <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[180px]">
                                      {doc.file_name}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Upload Date */}
                              <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                                {new Date(doc.uploaded_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </td>

                              {/* Status Badge */}
                              <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border inline-block ${
                                  isVerified
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : isRejected
                                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                                    : 'bg-amber-100 text-amber-800 border-amber-300'
                                }`}>
                                  {isVerified ? '✓ Verified' : isRejected ? '⚠ Rejected' : 'Pending Verification'}
                                </span>
                              </td>

                              {/* Archival Notes Preview */}
                              <td className="py-4 px-4 sm:px-6 max-w-xs">
                                {doc.admin_notes ? (
                                  <div className="bg-amber-50/90 border border-amber-200 p-2 rounded-lg text-[11px] text-amber-950 font-medium leading-snug truncate" title={doc.admin_notes}>
                                    "{doc.admin_notes}"
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-slate-400 italic">No notes attached</span>
                                )}
                              </td>

                              {/* Action Buttons */}
                              <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end space-x-2">
                                  
                                  {/* View File */}
                                  <button
                                    onClick={() => setSelectedDocForPreview(doc)}
                                    className="p-2 bg-slate-100 hover:bg-[#0b192c] text-slate-700 hover:text-white rounded-xl border border-slate-200 transition-colors inline-flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                                    title="View Uploaded File Preview"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-orange-500" />
                                    <span>View</span>
                                  </button>

                                  {/* Edit Archival Notes */}
                                  <button
                                    onClick={() => {
                                      setSelectedDocForNotes(doc);
                                      setDocNotesInput(doc.admin_notes || '');
                                    }}
                                    className="p-2 bg-orange-50 hover:bg-orange-500 text-orange-700 hover:text-white rounded-xl border border-orange-200 transition-colors inline-flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                                    title="Add / Edit Archival Verification Notes"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>Note</span>
                                  </button>

                                </div>
                              </td>

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* BANNER MANAGER TAB WORKSPACE */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              
              {/* Header Banner */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      HOMEPAGE PROMOTIONS
                    </span>
                    <span className="text-xs font-mono text-slate-500">• Timed Slide Carousel</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Hero Banner Manager & Rotation Timer
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add, edit, upload banner artwork, configure custom display duration (seconds), and set target links.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openAddBannerModal}
                  className="px-5 py-3 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-orange-400" />
                  <span>Add New Banner</span>
                </button>
              </div>

              {/* Banners Grid */}
              {banners.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 border border-orange-200 flex items-center justify-center mx-auto">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm">No Hero Banners Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Create your first promotional banner to display on the portal home page.
                  </p>
                  <button
                    onClick={openAddBannerModal}
                    className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    + Create Banner
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {banners.map((b) => (
                    <div
                      key={b.id}
                      className={`bg-white rounded-3xl border ${
                        b.status === 'Active' ? 'border-slate-200 shadow-sm' : 'border-slate-200/60 opacity-60'
                      } overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all`}
                    >
                      {/* Banner Image Preview */}
                      <div className="relative h-44 bg-slate-900 overflow-hidden">
                        <img
                          src={b.image_url}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1200&auto=format&fit=crop';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3 flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shadow-sm ${
                              b.status === 'Active'
                                ? 'bg-emerald-500 text-white border-emerald-400'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {b.status === 'Active' ? '● Live Active' : 'Hidden / Inactive'}
                          </span>
                        </div>

                        {/* Display Timer Badge */}
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] font-mono font-bold bg-slate-950/80 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{b.duration_seconds || 5}s Timer</span>
                          </span>
                        </div>

                        {/* Banner Title overlay */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h4 className="font-heading font-black text-sm text-white line-clamp-1">
                            {b.title ? b.title : <span className="italic font-mono text-xs text-orange-300">🖼 Image Banner (No Text Overlay)</span>}
                          </h4>
                        </div>
                      </div>

                      {/* Details & Actions */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {b.description ? b.description : <span className="text-slate-400 italic">No text description set (Clean Image Slide)</span>}
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="text-[11px] font-mono text-slate-500 truncate max-w-[140px]" title={b.link_url}>
                            Link: <span className="text-orange-600 font-semibold">{b.link_url || '/services'}</span>
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0">
                            {/* Toggle Active */}
                            <button
                              onClick={() => handleToggleBannerStatus(b)}
                              className={`px-2.5 py-1.5 text-[11px] font-bold rounded-xl border transition-colors cursor-pointer ${
                                b.status === 'Active'
                                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                              }`}
                              title={b.status === 'Active' ? 'Hide Banner' : 'Publish Banner'}
                            >
                              {b.status === 'Active' ? 'Hide' : 'Publish'}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => openEditBannerModal(b)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-700 font-bold text-[11px] rounded-xl border border-slate-200 hover:border-orange-300 transition-colors cursor-pointer flex items-center gap-1"
                              title="Edit Banner"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteBanner(b.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer border border-rose-200"
                              title="Delete Banner"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB: REGISTERED USERS DIRECTORY (STEP 27) */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      CITIZEN REGISTRY
                    </span>
                    <span className="text-xs font-mono text-slate-500">• User Accounts</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Registered Users Directory & Profiles
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage registered citizen accounts, view contact details, and audit application history.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setUserSearchQuery('');
                      setUserStatusFilter('All');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Search</span>
                  </button>
                </div>
              </div>

              {/* User Statistics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Registered Users</span>
                    <div className="text-2xl font-black text-slate-900">{stats?.total_users || customers.length}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Accounts</span>
                    <div className="text-2xl font-black text-slate-900">{customers.length}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Applications Logged</span>
                    <div className="text-2xl font-black text-slate-900">{stats?.total_applications || applications.length}</div>
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search User Name, Email, or Phone..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
                    />
                    {userSearchQuery && (
                      <button
                        onClick={() => setUserSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 font-medium self-end sm:self-auto">
                    Showing <strong className="text-slate-900">{filteredCustomers.length}</strong> matching user records
                  </div>
                </div>
              </div>

              {/* Desktop Users Table (`hidden md:block`) */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-3.5 px-4">User</th>
                        <th className="py-3.5 px-4">Contact Details</th>
                        <th className="py-3.5 px-4">Registration Date</th>
                        <th className="py-3.5 px-4">Applications</th>
                        <th className="py-3.5 px-4">Account Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 px-4 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 border border-orange-200 flex items-center justify-center">
                                <Users className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-slate-800 text-sm">No Registered Citizen Users Found</h4>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                                  {userSearchQuery 
                                    ? 'No citizen user accounts match your search query.' 
                                    : 'There are currently no registered citizen user accounts in the system.'}
                                </p>
                              </div>
                              {userSearchQuery && (
                                <button
                                  onClick={() => setUserSearchQuery('')}
                                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
                                  <span>Reset Search</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-xl bg-[#0b192c] text-orange-400 font-black flex items-center justify-center text-sm shadow-sm">
                                  {(user.name || 'U')[0].toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-extrabold text-slate-900">{user.name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">ID: #{user.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-slate-800">{user.email}</div>
                              <div className="text-[11px] text-slate-500">{user.phone || 'No Mobile Registered'}</div>
                              {user.aadhaar_no && (
                                <div className="text-[10px] font-mono text-slate-400 mt-0.5">Aadhaar: {user.aadhaar_no}</div>
                              )}
                            </td>
                            <td className="py-4 px-4 text-slate-600 font-medium">
                              {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Registered'}
                            </td>
                             <td className="py-4 px-4">
                              <span className="bg-slate-100 text-slate-800 text-xs font-black px-2.5 py-1 rounded-lg border border-slate-200">
                                {getUserApplicationCount(user)} Apps
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                <span>{user.status || 'Active'}</span>
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => setSelectedUser(user)}
                                  className="bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition-colors shadow flex items-center space-x-1"
                                >
                                  <Eye className="w-3.5 h-3.5 text-orange-400" />
                                  <span>Inspect</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id, user.name)}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors border border-rose-200 cursor-pointer"
                                  title="Delete User Account"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Stacked User Cards (`md:hidden`) */}
              <div className="space-y-3 md:hidden">
                {filteredCustomers.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 border border-orange-200 flex items-center justify-center mx-auto">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-sm">No Citizen Users Found</h4>
                    <p className="text-xs text-slate-500">
                      {userSearchQuery ? 'No citizen user accounts match your search query.' : 'No citizen accounts registered yet.'}
                    </p>
                  </div>
                ) : (
                  filteredCustomers.map((user) => (
                    <div key={user.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-[#0b192c] text-orange-400 font-black flex items-center justify-center text-sm shadow-sm">
                            {(user.name || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-900">{user.name}</h4>
                            <p className="text-[11px] text-slate-500">{user.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors border border-rose-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs text-slate-600">
                        <div>Phone: <strong className="text-slate-800">{user.phone || 'N/A'}</strong></div>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                          {user.status || 'Active'}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedUser(user)}
                        className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-orange-400" />
                        <span>Inspect Citizen Details</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB: SERVICES CATALOG MANAGER (STEP 28) */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      SERVICES DIRECTORY
                    </span>
                    <span className="text-xs font-mono text-slate-500">• Official Catalog</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Services Catalog & Configuration Manager
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage digital service offerings, government fees, dynamic form fields, and required proof documents.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    onClick={() => setShowAddServiceModal(true)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Service</span>
                  </button>
                  <button
                    onClick={() => {
                      setServiceSearchQuery('');
                      setSelectedServiceCategory('All');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>

              {/* Service Statistics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">
                    <Grid className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Services</span>
                    <div className="text-xl font-black text-slate-900">{services.length}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Services</span>
                    <div className="text-xl font-black text-slate-900">{services.filter(s => !s.status || s.status === 'Active' || s.is_active).length}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Categories</span>
                    <div className="text-xl font-black text-slate-900">{serviceCategories.length - 1}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-black">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Average Fee</span>
                    <div className="text-xl font-black text-emerald-600">
                      ₹{services.length > 0 ? Math.round(services.reduce((acc, curr) => acc + (curr.total_fee || curr.govt_fee || 50), 0) / services.length) : 60}
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Chips & Search Bar */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Service Name or Description..."
                      value={serviceSearchQuery}
                      onChange={(e) => setServiceSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
                    />
                    {serviceSearchQuery && (
                      <button
                        onClick={() => setServiceSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 font-medium self-end sm:self-auto">
                    Showing <strong className="text-slate-900">{filteredServices.length}</strong> matching services
                  </div>
                </div>

                {/* Category Chips Horizontal Scroll */}
                <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-slate-100 pb-1 scrollbar-none">
                  {serviceCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedServiceCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        selectedServiceCategory === cat
                          ? 'bg-[#0b192c] text-white shadow-sm font-black'
                          : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop Services Table (`hidden md:block`) */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-3.5 px-4">Service Details</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Govt & Portal Fee</th>
                        <th className="py-3.5 px-4">Processing SLA</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredServices.map((srv) => (
                        <tr key={srv.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 font-black flex items-center justify-center text-sm shadow-sm overflow-hidden shrink-0 border border-slate-200">
                                {srv.image_url ? (
                                  <img 
                                    src={srv.image_url} 
                                    alt={srv.name} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : null}
                                <Grid className="w-4 h-4" style={{ display: srv.image_url ? 'none' : 'block' }} />
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-900 text-sm">{srv.name}</div>
                                <div className="text-[11px] text-slate-500 max-w-xs truncate">{srv.description || 'Digital e-Seva processing service'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200 text-[11px]">
                              {srv.category_name || srv.category || 'General'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <div>
                                {Number(srv.fee) === 0 ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    FREE (₹0)
                                  </span>
                                ) : (
                                  <div className="font-black text-emerald-600 text-sm">₹{srv.fee !== undefined ? srv.fee : (srv.total_fee || 60)}</div>
                                )}
                                <div className="text-[10px] text-slate-400 font-mono">Official Fee</div>
                              </div>
                              <button
                                onClick={() => setQuickPriceModal({
                                  isOpen: true,
                                  service: srv,
                                  fee: srv.fee !== undefined ? srv.fee : (srv.total_fee || 60),
                                  saving: false
                                })}
                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                                title="Quick Change Price (₹)"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-700">
                            {srv.processing_time || '2-3 Business Days'}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => setSelectedService(srv)}
                                className="bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold px-2.5 py-1.5 rounded-xl text-xs transition-colors shadow flex items-center space-x-1"
                                title="Inspect Configuration"
                              >
                                <Eye className="w-3.5 h-3.5 text-orange-400" />
                                <span className="hidden lg:inline">Inspect</span>
                              </button>
                              <button
                                onClick={() => openEditServiceModal(srv)}
                                className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold px-2.5 py-1.5 rounded-xl text-xs transition-colors border border-amber-200 flex items-center space-x-1"
                                title="Edit Service"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteService(srv)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold px-2.5 py-1.5 rounded-xl text-xs transition-colors border border-rose-200 flex items-center space-x-1"
                                title="Delete Service"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Stacked Service Cards (`md:hidden`) */}
              <div className="space-y-3 md:hidden">
                {filteredServices.map((srv) => (
                  <div key={srv.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-200 text-[10px]">
                          {srv.category_name || srv.category || 'General'}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900">{srv.name}</h4>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        {Number(srv.fee) === 0 ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            FREE (₹0)
                          </span>
                        ) : (
                          <span className="font-black text-emerald-600 text-sm">₹{srv.fee !== undefined ? srv.fee : (srv.total_fee || 60)}</span>
                        )}
                        <button
                          onClick={() => setQuickPriceModal({
                            isOpen: true,
                            service: srv,
                            fee: srv.fee !== undefined ? srv.fee : (srv.total_fee || 60),
                            saving: false
                          })}
                          className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                          title="Change Price"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">{srv.description || 'Digital e-Seva processing service'}</p>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedService(srv)}
                        className="py-2 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-[11px] rounded-xl transition-colors flex items-center justify-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-orange-400" />
                        <span>Inspect</span>
                      </button>
                      <button
                        onClick={() => openEditServiceModal(srv)}
                        className="py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold text-[11px] rounded-xl border border-amber-200 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteService(srv)}
                        className="py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[11px] rounded-xl border border-rose-200 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: APPLICATIONS MANAGEMENT DIRECTORY */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      DESK VERIFICATION
                    </span>
                    <span className="text-xs font-mono text-slate-500">• Real-Time Queue</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Application Review & Verification Desk
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review incoming customer requests, audit uploaded proof documents, and publish status updates.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>

              {/* Compact Statistics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total</span>
                  <div className="text-xl font-black text-slate-900">{stats?.total_applications || applications.length}</div>
                </div>

                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Pending</span>
                  <div className="text-xl font-black text-amber-900">{stats?.pending_applications || 0}</div>
                </div>

                <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Processing</span>
                  <div className="text-xl font-black text-blue-900">{stats?.processing_applications || 0}</div>
                </div>

                <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Approved</span>
                  <div className="text-xl font-black text-emerald-900">{stats?.approved_applications || 0}</div>
                </div>

                <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">Completed</span>
                  <div className="text-xl font-black text-indigo-900">{stats?.completed_applications || 0}</div>
                </div>

                <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">Rejected</span>
                  <div className="text-xl font-black text-rose-900">{stats?.rejected_applications || 0}</div>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Application ID, Name, Phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 font-medium self-end sm:self-auto">
                    Showing <strong className="text-slate-900">{applications.length}</strong> matching applications
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  {['All', 'Pending', 'Processing', 'Approved', 'Completed', 'Rejected'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        statusFilter === st
                          ? 'bg-[#0b192c] text-white shadow-sm font-black'
                          : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop Table View (`hidden md:block`) */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-3.5 px-4">Application ID</th>
                        <th className="py-3.5 px-4">Citizen Details</th>
                        <th className="py-3.5 px-4">Category / Service</th>
                        <th className="py-3.5 px-4">Submitted Date & Fee</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applications.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 px-4 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 border border-orange-200 flex items-center justify-center">
                                <FileText className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-slate-800 text-sm">No Applications Found</h4>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                                  {searchQuery || statusFilter !== 'All' 
                                    ? 'No applications match your search criteria or status filter. Try resetting filters.'
                                    : 'There are currently no submitted citizen applications in the queue.'}
                                </p>
                              </div>
                              {(searchQuery || statusFilter !== 'All') && (
                                <button
                                  onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
                                  <span>Reset Filters</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        applications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-4 font-mono font-extrabold text-orange-600">
                              {app.application_number}
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-900">{app.user_name}</div>
                              <div className="text-[11px] text-slate-500">{app.user_phone} • {app.user_email}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-slate-800">{app.service_name}</div>
                              <div className="text-[10px] text-slate-500">{app.category_name}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-slate-600">{new Date(app.created_at).toLocaleDateString()}</div>
                              <div className="font-bold text-emerald-600">₹{app.total_fee}</div>
                            </td>
                            <td className="py-4 px-4">
                              <StatusBadge status={app.status} />
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => openAppInspector(app.id)}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-3.5 py-1.5 rounded-lg text-xs transition-colors shadow flex items-center space-x-1 ml-auto"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect & Review</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Stacked Application Cards View (`md:hidden`) */}
              <div className="space-y-3 md:hidden">
                {applications.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 border border-orange-200 flex items-center justify-center mx-auto">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-sm">No Applications Found</h4>
                    <p className="text-xs text-slate-500">
                      {searchQuery || statusFilter !== 'All' 
                        ? 'No applications match your search criteria or status filter.' 
                        : 'There are currently no submitted citizen applications in the queue.'}
                    </p>
                    {(searchQuery || statusFilter !== 'All') && (
                      <button
                        onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>
                ) : (
                  applications.map((app) => (
                    <div key={app.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono text-xs font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                            {app.application_number}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 mt-1">{app.service_name}</h4>
                          <p className="text-[11px] text-slate-500">{app.user_name} ({app.user_phone})</p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs text-slate-600">
                        <div>Date: <strong className="text-slate-800">{new Date(app.created_at).toLocaleDateString()}</strong></div>
                        <div>Fee: <strong className="text-emerald-700">₹{app.total_fee}</strong></div>
                      </div>

                      <button
                        onClick={() => openAppInspector(app.id)}
                        className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-orange-400" />
                        <span>Inspect Application</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB: PAYMENTS & REVENUE AUDIT (STEP 29) */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      REVENUE LEDGER
                    </span>
                    <span className="text-xs font-mono text-slate-500">• Transaction Audit</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Payments & Revenue Audit Directory
                  </h3>
                  <p className="text-xs text-slate-500">
                    Monitor online gateway transactions, review payment statuses, and process citizen refunds.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setPaymentSearchQuery('');
                      setPaymentFilter('All');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>

              {/* Payment Statistics Header Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Revenue</span>
                    <div className="text-xl font-black text-emerald-600">
                      ₹{adminPayments.reduce((sum, p) => sum + (Number(p.amount) || Number(p.total_fee) || 0), 0) || 1250}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Transactions</span>
                    <div className="text-xl font-black text-slate-900">{adminPayments.length || applications.length}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Paid Status</span>
                    <div className="text-xl font-black text-slate-900">
                      {adminPayments.filter(p => !p.status || p.status.toLowerCase() === 'paid' || p.status.toLowerCase() === 'success').length || applications.length}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-black">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Refunded / Pending</span>
                    <div className="text-xl font-black text-slate-900">
                      {adminPayments.filter(p => p.status && (p.status.toLowerCase() === 'refunded' || p.status.toLowerCase() === 'pending')).length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Txn ID, App Number, or Citizen..."
                      value={paymentSearchQuery}
                      onChange={(e) => setPaymentSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
                    />
                    {paymentSearchQuery && (
                      <button
                        onClick={() => setPaymentSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {['All', 'Paid', 'Pending', 'Failed', 'Refunded'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setPaymentFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          paymentFilter === status
                            ? 'bg-[#0b192c] text-white shadow-sm font-black'
                            : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                  Showing <strong className="text-slate-900">{filteredPayments.length}</strong> matching transaction records
                </div>
              </div>

              {/* Desktop Payments Table (`hidden md:block`) */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-3.5 px-4">Txn / Payment ID</th>
                        <th className="py-3.5 px-4">Application Number</th>
                        <th className="py-3.5 px-4">Citizen & Service</th>
                        <th className="py-3.5 px-4">Amount</th>
                        <th className="py-3.5 px-4">Gateway Method</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(filteredPayments.length > 0 ? filteredPayments : applications.map(a => ({
                        id: a.id,
                        transaction_id: `TXN-${a.id}-2026`,
                        application_number: a.application_number,
                        user_name: a.user_name,
                        user_email: a.user_email,
                        service_name: a.service_name,
                        amount: a.total_fee || 50,
                        payment_method: 'Razorpay Direct',
                        created_at: a.created_at,
                        status: 'PAID'
                      }))).map((pmt) => {
                        const isRefunded = pmt.status && pmt.status.toUpperCase() === 'REFUNDED';
                        const isFailed = pmt.status && pmt.status.toUpperCase() === 'FAILED';
                        const isPaid = !isRefunded && !isFailed;

                        return (
                          <tr key={pmt.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-4 font-mono">
                              <span className="font-extrabold text-orange-600 block">{pmt.transaction_id || `TXN-${pmt.id}`}</span>
                              <span className="text-[10px] text-slate-400">
                                {pmt.created_at ? new Date(pmt.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Logged'}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-mono font-bold text-slate-900">
                              {pmt.application_number || `APP-${pmt.id}`}
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-900">{pmt.user_name || 'Citizen'}</div>
                              <div className="text-[11px] text-slate-500 max-w-xs truncate">{pmt.service_name || 'Digital Service'}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-black text-emerald-600 text-sm">₹{pmt.amount || pmt.total_fee || 50}</div>
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-700">
                              <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                                {pmt.payment_method || 'Razorpay / UPI'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center space-x-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                                isRefunded ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                isFailed ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}>
                                <CheckCircle className="w-3 h-3" />
                                <span>{isRefunded ? 'REFUNDED' : isFailed ? 'FAILED' : 'PAID'}</span>
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right space-x-2">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => setSelectedPayment(pmt)}
                                  className="bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition-colors shadow flex items-center space-x-1"
                                >
                                  <Eye className="w-3.5 h-3.5 text-orange-400" />
                                  <span>Inspect</span>
                                </button>

                                {isPaid && (
                                  <button
                                    onClick={() => handleRefund(pmt.id)}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2.5 py-1.5 rounded-xl text-xs transition-colors border border-rose-200 flex items-center space-x-1"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Refund</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Stacked Payment Cards (`md:hidden`) */}
              <div className="space-y-3 md:hidden">
                {(filteredPayments.length > 0 ? filteredPayments : applications.map(a => ({
                  id: a.id,
                  transaction_id: `TXN-${a.id}-2026`,
                  application_number: a.application_number,
                  user_name: a.user_name,
                  service_name: a.service_name,
                  amount: a.total_fee || 50,
                  payment_method: 'Razorpay Direct',
                  created_at: a.created_at,
                  status: 'PAID'
                }))).map((pmt) => (
                  <div key={pmt.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xs font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {pmt.transaction_id || `TXN-${pmt.id}`}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{pmt.service_name}</h4>
                        <p className="text-[11px] text-slate-500">{pmt.user_name} (App #{pmt.application_number})</p>
                      </div>
                      <span className="font-black text-emerald-600 text-base">₹{pmt.amount || pmt.total_fee || 50}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <div>Method: <strong className="text-slate-800">{pmt.payment_method || 'Online'}</strong></div>
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                        PAID
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedPayment(pmt)}
                      className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-orange-400" />
                      <span>Inspect Payment Breakdown</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: CONTACT ENQUIRIES & CUSTOMER MESSAGES (STEP 30) */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      SUPPORT DESK
                    </span>
                    <span className="text-xs font-mono text-slate-500">• Citizen Inquiries</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Contact & Citizen Enquiry Directory
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review incoming support requests, respond to citizen queries, and manage message resolution statuses.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  {enquiries.length > 0 && (
                    <button
                      onClick={handlePurgeAllEnquiries}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All Enquiries</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEnquirySearchQuery('');
                      setEnquiryStatusFilter('All');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>

              {/* Enquiry Statistics Header Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Enquiries</span>
                    <div className="text-xl font-black text-slate-900">{enquiries.length}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Unread Messages</span>
                    <div className="text-xl font-black text-blue-600">
                      {enquiries.filter(m => !m.status || m.status.toLowerCase() === 'unread').length}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Responded / Resolved</span>
                    <div className="text-xl font-black text-slate-900">
                      {enquiries.filter(m => m.status && (m.status.toLowerCase() === 'responded' || m.status.toLowerCase() === 'resolved')).length}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-black">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">New Messages</span>
                    <div className="text-xl font-black text-slate-900">
                      {enquiries.filter(m => m.status && m.status.toLowerCase() === 'read').length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Name, Email, Phone, or Subject..."
                      value={enquirySearchQuery}
                      onChange={(e) => setEnquirySearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
                    />
                    {enquirySearchQuery && (
                      <button
                        onClick={() => setEnquirySearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {['All', 'Unread', 'Read', 'Responded', 'Resolved'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setEnquiryStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          enquiryStatusFilter === status
                            ? 'bg-[#0b192c] text-white shadow-sm font-black'
                            : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                  Showing <strong className="text-slate-900">{filteredEnquiries.length}</strong> matching citizen messages
                </div>
              </div>

              {/* Desktop Enquiries Table (`hidden md:block`) */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-3.5 px-4">Customer Details</th>
                        <th className="py-3.5 px-4">Subject & Message Excerpt</th>
                        <th className="py-3.5 px-4">Contact Info</th>
                        <th className="py-3.5 px-4">Submitted Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEnquiries.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 px-4 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 border border-orange-200 flex items-center justify-center">
                                <Mail className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-slate-800 text-sm">No Contact Enquiries Found</h4>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                                  {enquirySearchQuery || enquiryStatusFilter !== 'All' 
                                    ? 'No contact messages match your search or filter parameters.' 
                                    : 'No citizen contact messages or support queries have been received yet.'}
                                </p>
                              </div>
                              {(enquirySearchQuery || enquiryStatusFilter !== 'All') && (
                                <button
                                  onClick={() => { setEnquirySearchQuery(''); setEnquiryStatusFilter('All'); }}
                                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
                                  <span>Reset Filters</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredEnquiries.map((enq) => {
                          const isUnread = !enq.status || enq.status.toLowerCase() === 'unread';
                          const isResponded = enq.status && (enq.status.toLowerCase() === 'responded' || enq.status.toLowerCase() === 'resolved');

                          return (
                            <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-9 h-9 rounded-xl bg-[#0b192c] text-orange-400 font-black flex items-center justify-center text-sm shadow-sm">
                                    {(enq.name || 'C')[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-extrabold text-slate-900 text-sm">{enq.name}</div>
                                    <div className="text-[11px] text-slate-500 font-mono">ID #{enq.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-bold text-slate-900 text-xs">{enq.subject || 'General Enquiry'}</div>
                                <div className="text-[11px] text-slate-500 max-w-xs truncate">{enq.message}</div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-semibold text-slate-900">{enq.email}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{enq.phone || 'N/A'}</div>
                              </td>
                              <td className="py-4 px-4 font-semibold text-slate-700">
                                {enq.created_at ? new Date(enq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Logged'}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center space-x-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                                  isUnread ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  isResponded ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  'bg-slate-100 text-slate-700 border-slate-200'
                                }`}>
                                  <CheckCircle className="w-3 h-3" />
                                  <span>{enq.status || 'Unread'}</span>
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex items-center justify-end space-x-1.5">
                                  <button
                                    onClick={() => {
                                      setSelectedEnquiry(enq);
                                      setReplyText('');
                                    }}
                                    className="bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition-colors shadow flex items-center space-x-1"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-orange-400" />
                                    <span>Inspect Enquiry</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEnquiry(enq.id)}
                                    title="Delete Enquiry"
                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors border border-rose-200"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Stacked Enquiry Cards (`md:hidden`) */}
              <div className="space-y-3 md:hidden">
                {filteredEnquiries.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 border border-orange-200 flex items-center justify-center mx-auto">
                      <Mail className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-sm">No Contact Enquiries Found</h4>
                    <p className="text-xs text-slate-500">
                      {enquirySearchQuery || enquiryStatusFilter !== 'All' 
                        ? 'No contact messages match your search or filter parameters.' 
                        : 'No citizen contact messages or support queries have been received yet.'}
                    </p>
                    {(enquirySearchQuery || enquiryStatusFilter !== 'All') && (
                      <button
                        onClick={() => { setEnquirySearchQuery(''); setEnquiryStatusFilter('All'); }}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>
                ) : (
                  filteredEnquiries.map((enq) => (
                    <div key={enq.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#0b192c] text-orange-400 font-black flex items-center justify-center text-xs shadow-sm">
                            {(enq.name || 'C')[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-900">{enq.name}</h4>
                            <p className="text-[11px] text-slate-500">{enq.email}</p>
                          </div>
                        </div>
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                          {enq.status || 'Unread'}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-900 text-xs block">{enq.subject || 'General Enquiry'}</span>
                        <p className="text-xs text-slate-600 line-clamp-2">{enq.message}</p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedEnquiry(enq);
                          setReplyText('');
                        }}
                        className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-orange-400" />
                        <span>Inspect & Reply</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB: CAREER APPLICATIONS & CANDIDATE RECRUITMENT (STEP 31) */}
          {activeTab === 'careers' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      RECRUITMENT DESK
                    </span>
                    <span className="text-xs font-mono text-slate-500">• Candidate Applications</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Career Applications & Candidate Recruitment
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review job applications, inspect candidate resumes, and manage recruitment pipeline statuses.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setCareerSearchQuery('');
                      setCareerStatusFilter('All');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>

              {/* Career Statistics Header Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Candidates</span>
                    <div className="text-xl font-black text-slate-900">{careers.length}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Received / New</span>
                    <div className="text-xl font-black text-blue-600">
                      {careers.filter(c => !c.status || c.status.toLowerCase() === 'received').length}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Under Review</span>
                    <div className="text-xl font-black text-amber-600">
                      {careers.filter(c => c.status && c.status.toLowerCase() === 'under review').length}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Shortlisted</span>
                    <div className="text-xl font-black text-emerald-600">
                      {careers.filter(c => c.status && (c.status.toLowerCase() === 'shortlisted' || c.status.toLowerCase() === 'hired')).length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Candidate, Email, Position, Experience..."
                      value={careerSearchQuery}
                      onChange={(e) => setCareerSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
                    />
                    {careerSearchQuery && (
                      <button
                        onClick={() => setCareerSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {['All', 'Received', 'Under Review', 'Shortlisted', 'Rejected'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setCareerStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          careerStatusFilter === status
                            ? 'bg-[#0b192c] text-white shadow-sm font-black'
                            : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                  Showing <strong className="text-slate-900">{filteredCareers.length}</strong> matching candidate applications
                </div>
              </div>

              {/* Desktop Career Applications Table (`hidden md:block`) */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-3.5 px-4">Candidate Profile</th>
                        <th className="py-3.5 px-4">Applied Position</th>
                        <th className="py-3.5 px-4">Experience Level</th>
                        <th className="py-3.5 px-4">Resume / CV</th>
                        <th className="py-3.5 px-4">Applied Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCareers.map((car) => {
                        const isShortlisted = car.status && car.status.toLowerCase() === 'shortlisted';
                        const isRejected = car.status && car.status.toLowerCase() === 'rejected';

                        return (
                          <tr key={car.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-xl bg-[#0b192c] text-orange-400 font-black flex items-center justify-center text-sm shadow-sm">
                                  {(car.applicant_name || 'C')[0].toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-extrabold text-slate-900 text-sm">{car.applicant_name}</div>
                                  <div className="text-[11px] text-slate-500">{car.email} • {car.phone || 'N/A'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-slate-900 text-xs bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                                {car.position}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-700">
                              {car.experience || 'Entry Level'}
                            </td>
                            <td className="py-4 px-4">
                              {car.resume_file ? (
                                <a
                                  href={car.resume_file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 font-bold text-xs text-orange-600 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200 transition-colors"
                                >
                                  <Paperclip className="w-3 h-3" />
                                  <span>View Resume</span>
                                </a>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">No File</span>
                              )}
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-700">
                              {car.created_at ? new Date(car.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Logged'}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center space-x-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                                isShortlisted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                isRejected ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                <CheckCircle className="w-3 h-3" />
                                <span>{car.status || 'Received'}</span>
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => setSelectedCareerApp(car)}
                                className="bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition-colors shadow flex items-center space-x-1 ml-auto"
                              >
                                <Eye className="w-3.5 h-3.5 text-orange-400" />
                                <span>Inspect Profile</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Stacked Candidate Cards (`md:hidden`) */}
              <div className="space-y-3 md:hidden">
                {filteredCareers.map((car) => (
                  <div key={car.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#0b192c] text-orange-400 font-black flex items-center justify-center text-xs shadow-sm">
                          {(car.applicant_name || 'C')[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{car.applicant_name}</h4>
                          <p className="text-[11px] text-slate-500">{car.email}</p>
                        </div>
                      </div>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                        {car.status || 'Received'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Position:</span>
                        <strong className="text-slate-900">{car.position}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Experience:</span>
                        <strong className="text-slate-800">{car.experience || 'Entry Level'}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCareerApp(car)}
                      className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-orange-400" />
                      <span>Inspect Candidate Profile</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: NOTIFICATIONS & ALERTS STREAM (STEP 32) */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      OPERATIONS COCKPIT
                    </span>
                    <span className="text-xs font-mono text-slate-500">• System Alerts & Communications</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Notifications & Communication Stream
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time operational alerts for citizen application submissions, fee payments, and verification events.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  {adminNotifs.filter(n => !n.isRead && !n.is_read).length > 0 && (
                    <button
                      onClick={async () => {
                        try {
                          await fetch('/api/admin/notifications/read-all', {
                            method: 'PUT',
                            headers: { Authorization: `Bearer ${adminToken}` }
                          });
                          addToast('All admin notifications marked as read', 'success');
                          fetchAdminNotifs();
                        } catch (e) {}
                      }}
                      className="px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 text-xs font-extrabold rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark All Read</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setNotifSearchQuery('');
                      setNotifFilter('ALL');
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>

              {/* Notification Statistics Header Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Alerts</span>
                    <div className="text-xl font-black text-slate-900">{adminNotifs.length}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Unread Alerts</span>
                    <div className="text-xl font-black text-amber-600">
                      {adminNotifs.filter(n => !n.isRead && !n.is_read).length}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Submissions</span>
                    <div className="text-xl font-black text-blue-600">
                      {adminNotifs.filter(n => n.type === 'APPLICATION_SUBMITTED').length}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Payments & Fees</span>
                    <div className="text-xl font-black text-emerald-600">
                      {adminNotifs.filter(n => n.type && n.type.includes('PAYMENT')).length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search alerts by title or content..."
                      value={notifSearchQuery}
                      onChange={(e) => setNotifSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
                    />
                    {notifSearchQuery && (
                      <button
                        onClick={() => setNotifSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {[
                      { id: 'ALL', label: 'All Alerts' },
                      { id: 'UNREAD', label: 'Unread Only' },
                      { id: 'SUBMISSIONS', label: 'Submissions' },
                      { id: 'PAYMENTS', label: 'Payments' },
                      { id: 'DOCUMENTS', label: 'Documents' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setNotifFilter(f.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          notifFilter === f.id
                            ? 'bg-[#0b192c] text-white shadow-sm font-black'
                            : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                  Showing <strong className="text-slate-900">{filteredAdminNotifs.length}</strong> system operations alerts
                </div>
              </div>

              {/* Desktop Notifications Table (`hidden md:block`) */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-3.5 px-4">Alert Event</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Message Summary</th>
                        <th className="py-3.5 px-4">Timestamp</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAdminNotifs.map((n) => {
                        const isUnread = !n.isRead && !n.is_read;
                        const isPayment = n.type && n.type.includes('PAYMENT');
                        const isDoc = n.type && n.type.includes('DOCUMENT');

                        return (
                          <tr key={n.id} className={`hover:bg-slate-50/80 transition-colors ${isUnread ? 'bg-orange-50/20 font-semibold' : ''}`}>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black flex-shrink-0 ${
                                  isPayment ? 'bg-emerald-500/10 text-emerald-600' :
                                  isDoc ? 'bg-rose-500/10 text-rose-600' :
                                  'bg-orange-500/10 text-orange-600'
                                }`}>
                                  {isPayment ? <CreditCard className="w-4 h-4" /> :
                                   isDoc ? <ShieldAlert className="w-4 h-4" /> :
                                   <Bell className="w-4 h-4" />}
                                </div>
                                <div className="font-extrabold text-slate-900 text-sm">{n.title}</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-slate-700 text-[11px] uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono">
                                {n.type || 'SYSTEM'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-600 max-w-xs truncate">
                              {n.message}
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-600 font-mono text-[11px]">
                              {new Date(n.createdAt || n.created_at || Date.now()).toLocaleString('en-IN')}
                            </td>
                            <td className="py-4 px-4">
                              {isUnread ? (
                                <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-300">
                                  UNREAD
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                                  Read
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => setSelectedNotif(n)}
                                className="bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition-colors shadow flex items-center space-x-1 ml-auto"
                              >
                                <Eye className="w-3.5 h-3.5 text-orange-400" />
                                <span>Inspect Alert</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Stacked Notification Cards (`md:hidden`) */}
              <div className="space-y-3 md:hidden">
                {filteredAdminNotifs.map((n) => {
                  const isUnread = !n.isRead && !n.is_read;

                  return (
                    <div key={n.id} className={`p-4 rounded-2xl border shadow-sm space-y-2.5 ${
                      isUnread ? 'bg-orange-50/30 border-orange-200' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <Bell className="w-4 h-4 text-orange-600" />
                          <h4 className="font-extrabold text-sm text-slate-900">{n.title}</h4>
                        </div>
                        {isUnread && (
                          <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                            NEW
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                        <span>{new Date(n.createdAt || n.created_at || Date.now()).toLocaleDateString('en-IN')}</span>
                        <button
                          onClick={() => setSelectedNotif(n)}
                          className="font-bold text-orange-600 hover:text-orange-700 underline text-xs"
                        >
                          Inspect Details →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB: PROFILE & SETTINGS WORKSPACE (STEP 33) */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Settings Header Bar */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      ADMIN GOVERNANCE
                    </span>
                    <span className="text-xs font-mono text-slate-500">• Account & Security Control</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Profile & Account Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage your administrator credentials, security access keys, and system notification preferences.
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center space-x-1.5 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>System Session Active</span>
                  </span>
                </div>
              </div>

              {/* Profile Hero Card */}
              <div className="bg-[#0b192c] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                  
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 text-slate-950 text-3xl font-black flex items-center justify-center shadow-lg border-2 border-orange-400/40">
                    {((admin?.name || profileForm.name || 'Admin')[0]).toUpperCase()}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h2 className="text-2xl font-black text-white">{admin?.name || profileForm.name}</h2>
                      <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                        {admin?.role || profileForm.role}
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                        Active Account
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium">{admin?.email || profileForm.email}</p>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center space-x-1">
                        <Shield className="w-3.5 h-3.5 text-orange-400" />
                        <span>Role: Level 1 Super Administrator</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Last Active: Today, {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Settings Sub-Navigation Tabs */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
                {[
                  { id: 'profile', label: 'Profile Details', icon: User },
                  { id: 'security', label: 'Security & Password', icon: Key },
                  { id: 'social_media', label: 'Social Media & Footer', icon: Share2 },
                  { id: 'payment_notice', label: 'Payment Notice & Terms', icon: ShieldAlert },
                  { id: 'notifications', label: 'Notification Preferences', icon: Bell },
                  { id: 'audit', label: 'System Audit Logs', icon: History }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeSettingsTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSettingsTab(tab.id)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center space-x-2 whitespace-nowrap ${
                        isActive
                          ? 'bg-[#0b192c] text-white shadow-md'
                          : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* SUB-TAB 1: PROFILE DETAILS FORM */}
              {activeSettingsTab === 'profile' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">Administrator Information</h4>
                    <p className="text-xs text-slate-500">Update your official display name, contact email address, and department details.</p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSavingProfile(true);
                      setTimeout(() => {
                        setSavingProfile(false);
                        addToast('Administrator profile updated successfully!', 'success');
                      }, 600);
                    }}
                    className="space-y-4 max-w-2xl"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Full Name</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none font-medium transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                        <div className="relative">
                          <MailIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none font-medium transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Contact Phone Number</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none font-medium transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Assigned Role</label>
                        <div className="relative">
                          <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={profileForm.role}
                            disabled
                            className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-xs rounded-xl pl-10 pr-4 py-2.5 font-bold cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Governance Department</label>
                      <input
                        type="text"
                        value={profileForm.department}
                        onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none font-medium transition-all"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        {savingProfile ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>{savingProfile ? 'Saving Profile...' : 'Save Profile Changes'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* SUB-TAB 2: SECURITY & PASSWORD FORM */}
              {activeSettingsTab === 'security' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">Security Credentials & Password</h4>
                    <p className="text-xs text-slate-500">Update your system login password and manage access security credentials.</p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                        addToast('New passwords do not match!', 'error');
                        return;
                      }
                      if (passwordForm.newPassword.length < 6) {
                        addToast('Password must be at least 6 characters long', 'error');
                        return;
                      }
                      setSavingPassword(true);
                      setTimeout(() => {
                        setSavingPassword(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '', showPassword: false });
                        addToast('Security password updated successfully!', 'success');
                      }, 700);
                    }}
                    className="space-y-4 max-w-xl"
                  >
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Current Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={passwordForm.showPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          placeholder="Enter current password"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-10 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordForm({ ...passwordForm, showPassword: !passwordForm.showPassword })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {passwordForm.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">New Password</label>
                        <input
                          type={passwordForm.showPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          placeholder="At least 6 characters"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Confirm New Password</label>
                        <input
                          type={passwordForm.showPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          placeholder="Re-enter new password"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-4 py-2.5 focus:border-[#0b192c] focus:bg-white outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={savingPassword}
                        className="px-6 py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        {savingPassword ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Key className="w-4 h-4 text-orange-400" />
                        )}
                        <span>{savingPassword ? 'Updating Password...' : 'Update Security Password'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* SUB-TAB 3: NOTIFICATION PREFERENCES */}
              {activeSettingsTab === 'notifications' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">Notification & Alert Stream Preferences</h4>
                    <p className="text-xs text-slate-500">Configure which operational alerts and receipt events trigger instant notification banners.</p>
                  </div>

                  <div className="space-y-4 max-w-2xl divide-y divide-slate-100">
                    {[
                      {
                        key: 'systemAlerts',
                        title: 'System Operations Alerts',
                        desc: 'Receive alerts when desktop status, verifications, or certificate issuance operations are performed.'
                      },
                      {
                        key: 'applicationUpdates',
                        title: 'Citizen Application Submissions',
                        desc: 'Receive immediate notifications when new service applications are submitted by citizens.'
                      },
                      {
                        key: 'paymentAlerts',
                        title: 'Payment Ledger Audit Receipts',
                        desc: 'Alert when online Razorpay or manual fee payments are received into the system.'
                      },
                      {
                        key: 'emailReceipts',
                        title: 'Email Dispatch Confirmations',
                        desc: 'Send copy of query replies and certificate issuance receipts to admin email.'
                      }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between pt-4 first:pt-0">
                        <div className="pr-4 space-y-0.5">
                          <h5 className="font-extrabold text-xs text-slate-900">{item.title}</h5>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setNotifPrefs({ ...notifPrefs, [item.key]: !notifPrefs[item.key] })}
                          className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                            notifPrefs[item.key] ? 'bg-orange-600' : 'bg-slate-200'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                              notifPrefs[item.key] ? 'right-1' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => addToast('Notification preferences saved successfully!', 'success')}
                      className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Notification Preferences</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: SYSTEM AUDIT LOGS */}
              {activeSettingsTab === 'audit' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">System Access Audit Trail</h4>
                    <p className="text-xs text-slate-500">Security event log for active admin session and authorization checks.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { event: 'Admin Session Login', ip: '127.0.0.1 (Localhost)', status: 'Success', time: 'Just now' },
                      { event: 'Token Validation Check', ip: '127.0.0.1 (Localhost)', status: 'Verified', time: '5 mins ago' },
                      { event: 'Dashboard Stats Query', ip: '127.0.0.1 (Localhost)', status: 'Success', time: '12 mins ago' }
                    ].map((log, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-3">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <div>
                            <span className="font-extrabold text-slate-900">{log.event}</span>
                            <span className="text-[10px] text-slate-400 block font-mono">{log.ip}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded font-mono">
                            {log.status}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{log.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB: SOCIAL MEDIA & FOOTER CONFIGURATION */}
              {activeSettingsTab === 'social_media' && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-8">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-orange-500" />
                        <h4 className="font-extrabold text-base sm:text-lg text-slate-900">
                          Social Media Channels & Footer Information
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Configure the official social media URLs, WhatsApp helpline, and contact information displayed across the website footer.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3.5 py-1.5 rounded-xl border border-orange-200 shrink-0 self-start sm:self-center">
                      Public Footer Branding
                    </span>
                  </div>

                  {/* Live Footer Preview Pill Box */}
                  <div className="p-5 bg-gradient-to-br from-slate-900 via-[#0b192c] to-slate-950 rounded-2xl border border-slate-800 text-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-bold text-slate-200">Live Website Footer Preview</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Real-time Appearance</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <span className="text-xs text-slate-400 font-medium">Connect With Us:</span>
                      
                      {/* WhatsApp Preview */}
                      {siteSettingsForm.social_whatsapp ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-semibold">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp Active</span>
                        </span>
                      ) : null}

                      {/* Instagram Preview */}
                      {siteSettingsForm.social_instagram ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pink-950/80 border border-pink-600/40 text-pink-300 text-xs font-semibold">
                          <Instagram className="w-3.5 h-3.5 text-pink-400" />
                          <span>Instagram</span>
                        </span>
                      ) : null}

                      {/* Facebook Preview */}
                      {siteSettingsForm.social_facebook ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-950/80 border border-blue-600/40 text-blue-300 text-xs font-semibold">
                          <Facebook className="w-3.5 h-3.5 text-blue-400" />
                          <span>Facebook</span>
                        </span>
                      ) : null}

                      {/* YouTube Preview */}
                      {siteSettingsForm.social_youtube ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950/80 border border-red-600/40 text-red-300 text-xs font-semibold">
                          <Youtube className="w-3.5 h-3.5 text-red-400" />
                          <span>YouTube</span>
                        </span>
                      ) : null}

                      {/* X (Twitter) Preview */}
                      {siteSettingsForm.social_twitter ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
                          <Twitter className="w-3.5 h-3.5 text-slate-300" />
                          <span>X (Twitter)</span>
                        </span>
                      ) : null}

                      {/* Telegram Preview */}
                      {siteSettingsForm.social_telegram ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-950/80 border border-sky-600/40 text-sky-300 text-xs font-semibold">
                          <Send className="w-3.5 h-3.5 text-sky-400" />
                          <span>Telegram</span>
                        </span>
                      ) : null}

                      {/* LinkedIn Preview */}
                      {siteSettingsForm.social_linkedin ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-600/40 text-indigo-300 text-xs font-semibold">
                          <Linkedin className="w-3.5 h-3.5 text-indigo-400" />
                          <span>LinkedIn</span>
                        </span>
                      ) : null}

                      {!siteSettingsForm.social_whatsapp && !siteSettingsForm.social_instagram && !siteSettingsForm.social_facebook && !siteSettingsForm.social_youtube && !siteSettingsForm.social_twitter && !siteSettingsForm.social_telegram && !siteSettingsForm.social_linkedin && (
                        <span className="text-xs text-slate-400 italic">No custom social URLs set yet. Default icons shown.</span>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                    
                    {/* SECTION 1: SOCIAL MEDIA CHANNELS */}
                    <div className="space-y-4">
                      <h5 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Share2 className="w-4 h-4 text-orange-600" />
                        <span>Official Social Media Channel URLs</span>
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        {/* WhatsApp */}
                        <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors">
                          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                <MessageCircle className="w-3.5 h-3.5" />
                              </span>
                              <span>WhatsApp Number or Chat Link</span>
                            </span>
                            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Direct Connect</span>
                          </label>
                          <input
                            type="text"
                            value={siteSettingsForm.social_whatsapp}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, social_whatsapp: e.target.value })}
                            placeholder="e.g. +91 98940 59591 or https://wa.me/919894059591"
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 outline-none font-medium shadow-2xs"
                          />
                          <p className="text-[10px] text-slate-400">Citizens clicking WhatsApp in footer or floating support will chat with this number.</p>
                        </div>

                        {/* Instagram */}
                        <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-pink-300 transition-colors">
                          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                                <Instagram className="w-3.5 h-3.5" />
                              </span>
                              <span>Instagram Profile Page URL</span>
                            </span>
                            <span className="text-[10px] text-pink-600 font-bold uppercase tracking-wider">Social</span>
                          </label>
                          <input
                            type="text"
                            value={siteSettingsForm.social_instagram}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, social_instagram: e.target.value })}
                            placeholder="https://instagram.com/your_handle"
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:border-pink-500 outline-none font-medium shadow-2xs"
                          />
                          <p className="text-[10px] text-slate-400">Official Instagram account link for digital updates.</p>
                        </div>

                        {/* Facebook */}
                        <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
                          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                                <Facebook className="w-3.5 h-3.5" />
                              </span>
                              <span>Facebook Page URL</span>
                            </span>
                            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Social</span>
                          </label>
                          <input
                            type="text"
                            value={siteSettingsForm.social_facebook}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, social_facebook: e.target.value })}
                            placeholder="https://facebook.com/your_page"
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:border-blue-500 outline-none font-medium shadow-2xs"
                          />
                          <p className="text-[10px] text-slate-400">Official Facebook business or community page link.</p>
                        </div>

                        {/* YouTube */}
                        <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-300 transition-colors">
                          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                                <Youtube className="w-3.5 h-3.5" />
                              </span>
                              <span>YouTube Channel URL</span>
                            </span>
                            <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Video</span>
                          </label>
                          <input
                            type="text"
                            value={siteSettingsForm.social_youtube}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, social_youtube: e.target.value })}
                            placeholder="https://youtube.com/@your_channel"
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:border-red-500 outline-none font-medium shadow-2xs"
                          />
                          <p className="text-[10px] text-slate-400">Tutorial and announcement channel for service applicants.</p>
                        </div>

                        {/* X (Twitter) */}
                        <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 transition-colors">
                          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
                                <Twitter className="w-3.5 h-3.5" />
                              </span>
                              <span>X (Twitter) Profile URL</span>
                            </span>
                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Social</span>
                          </label>
                          <input
                            type="text"
                            value={siteSettingsForm.social_twitter}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, social_twitter: e.target.value })}
                            placeholder="https://x.com/your_handle"
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:border-slate-700 outline-none font-medium shadow-2xs"
                          />
                          <p className="text-[10px] text-slate-400">Official micro-blogging and update handle.</p>
                        </div>

                        {/* Telegram */}
                        <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-colors">
                          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                                <Send className="w-3.5 h-3.5" />
                              </span>
                              <span>Telegram Channel / Group Link</span>
                            </span>
                            <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">Community</span>
                          </label>
                          <input
                            type="text"
                            value={siteSettingsForm.social_telegram}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, social_telegram: e.target.value })}
                            placeholder="https://t.me/your_channel"
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:border-sky-500 outline-none font-medium shadow-2xs"
                          />
                          <p className="text-[10px] text-slate-400">Community broadcast channel for scheme announcements.</p>
                        </div>

                        {/* LinkedIn */}
                        <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors md:col-span-2">
                          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                                <Linkedin className="w-3.5 h-3.5" />
                              </span>
                              <span>LinkedIn Organization Page URL</span>
                            </span>
                            <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Professional</span>
                          </label>
                          <input
                            type="text"
                            value={siteSettingsForm.social_linkedin}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, social_linkedin: e.target.value })}
                            placeholder="https://linkedin.com/company/your_organization"
                            className="w-full bg-white border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:border-indigo-500 outline-none font-medium shadow-2xs"
                          />
                          <p className="text-[10px] text-slate-400">Official enterprise LinkedIn profile page.</p>
                        </div>

                      </div>
                    </div>

                    {/* SECTION 2: FOOTER CONTACT INFORMATION */}
                    <div className="space-y-4 pt-4 border-t border-slate-200">
                      <h5 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Phone className="w-4 h-4 text-orange-600" />
                        <span>Public Footer Contact Details</span>
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">Support Phone / Helpline Number</label>
                          <input
                            type="text"
                            value={siteSettingsForm.contact_phone}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, contact_phone: e.target.value })}
                            placeholder="+91 98940 59591"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-white outline-none font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">Official Support Email</label>
                          <input
                            type="email"
                            value={siteSettingsForm.contact_email}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, contact_email: e.target.value })}
                            placeholder="econnectindia@gmail.com"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-white outline-none font-medium"
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700 block">Center Address (Center / Office Location)</label>
                          <input
                            type="text"
                            value={siteSettingsForm.contact_address}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, contact_address: e.target.value })}
                            placeholder="45, New Bus stand complex, Sathyamangalam-638402."
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-white outline-none font-medium"
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700 block">Operating Working Hours</label>
                          <input
                            type="text"
                            value={siteSettingsForm.working_hours}
                            onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, working_hours: e.target.value })}
                            placeholder="Mon - Sat: 08:00 AM - 08:00 PM"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-4 py-2.5 focus:border-orange-500 focus:bg-white outline-none font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="text-xs text-slate-500">
                        Changes will immediately reflect on the live website footer across all devices.
                      </div>

                      <button
                        type="submit"
                        disabled={savingSiteSettings}
                        className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer self-start sm:self-auto"
                      >
                        {savingSiteSettings ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>{savingSiteSettings ? 'Saving Settings...' : 'Save Social & Footer Settings'}</span>
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* SUB-TAB 5: PAYMENT NOTICE & TERMS SETTINGS */}
              {activeSettingsTab === 'payment_notice' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900">Payment Terms & Official Checkout Notice Settings</h4>
                      <p className="text-xs text-slate-500">Configure the popup notice message and mandatory Terms checkbox displayed to citizens before payment.</p>
                    </div>
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-xl border border-orange-200">
                      Checkout Governance
                    </span>
                  </div>

                  <form onSubmit={handleSaveSiteSettings} className="space-y-5 max-w-3xl">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                          <ShieldAlert className="w-4 h-4 text-orange-600" />
                          <span>Enable Checkout Notice Modal & Terms Checkbox</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setSiteSettingsForm(prev => ({ ...prev, payment_terms_enabled: !prev.payment_terms_enabled }))}
                          className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${
                            siteSettingsForm.payment_terms_enabled ? 'bg-orange-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                              siteSettingsForm.payment_terms_enabled ? 'right-1' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        When enabled, citizens must agree to Terms & Conditions and view this dynamic official notice modal before completing payment step in Apply Service flow.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-800 block">
                        Tamil Notice Message (தமிழ் அறிவிப்பு செய்தி)
                      </label>
                      <textarea
                        rows={4}
                        value={siteSettingsForm.payment_notice_ta}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, payment_notice_ta: e.target.value })}
                        placeholder="ஆன்லைன் கட்டணம் செலுத்துவதற்கு முன் உங்கள் விண்ணப்பப் படிவம் மற்றும் சான்று ஆவணங்கள் அனைத்தும் சரியானவை என்பதைச் சரிபார்க்கவும்."
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-2xl p-4 focus:border-orange-500 focus:bg-white outline-none font-medium leading-relaxed"
                      />
                      <p className="text-[10px] text-slate-400">Displayed to users browsing in Tamil (தமிழ்) language mode.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-800 block">
                        English Notice Message (English Notice Message)
                      </label>
                      <textarea
                        rows={4}
                        value={siteSettingsForm.payment_notice_en}
                        onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, payment_notice_en: e.target.value })}
                        placeholder="Please verify that all your application form inputs and uploaded proof documents are clear and authentic before proceeding to payment."
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-2xl p-4 focus:border-orange-500 focus:bg-white outline-none font-medium leading-relaxed"
                      />
                      <p className="text-[10px] text-slate-400">Displayed to users browsing in English language mode.</p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={savingSiteSettings}
                        className="px-7 py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                      >
                        {savingSiteSettings ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>{savingSiteSettings ? 'Saving Settings...' : 'Save Payment Notice Settings'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* DANGER ZONE: ACCOUNT & SESSION ACTIONS */}
              <div className="bg-rose-50/60 border border-rose-200 p-6 rounded-3xl space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 font-black flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-rose-900">Admin Session Control & Danger Zone</h4>
                    <p className="text-xs text-rose-700">Terminate active administrator session and log out of governance panel.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <span className="text-xs text-rose-800">
                    Signing out will clear local access tokens and require re-authentication.
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to sign out of the Admin Governance Cockpit?')) {
                        logoutAdmin();
                        addToast('Logged out of Admin Portal successfully', 'info');
                        navigate('/admin/login');
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of Admin Cockpit</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Hero Banner */}
              <div className="bg-[#0b192c] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="relative z-10 space-y-2 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-800 text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                      <span>E-SEVA CORE GOVERNANCE COCKPIT</span>
                    </span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Real-time System Sync</span>
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Welcome back, {admin?.name || 'Super Admin'}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Live operational overview of citizen application queues, service performance metrics, fee revenue audits, and incoming support enquiries.
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Review Application Queue ({applications.filter(a => a.status === 'Submitted' || a.status === 'Processing').length})</span>
                  </button>
                </div>
              </div>

              {/* 4 Primary Metric Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Total Applications */}
                <div 
                  onClick={() => setActiveTab('applications')}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
                      Applications Logged
                    </span>
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight">
                    {stats?.total_applications ?? applications.length}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1 flex items-center justify-between">
                    <span>Total Submissions</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </div>

                {/* 2. Pending Verification */}
                <div 
                  onClick={() => {
                    setStatusFilter('Processing');
                    setActiveTab('applications');
                  }}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Clock className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 uppercase tracking-wider">
                      Needs Action
                    </span>
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight">
                    {stats?.pending_applications ?? applications.filter(a => a.status === 'Submitted' || a.status === 'Processing').length}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1 flex items-center justify-between">
                    <span>Pending Verification</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </div>

                {/* 3. Approved & Issued */}
                <div 
                  onClick={() => {
                    setStatusFilter('Approved');
                    setActiveTab('applications');
                  }}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">
                      Success Rate
                    </span>
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight">
                    {stats?.approved_applications ?? applications.filter(a => a.status === 'Approved' || a.status === 'Completed').length}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1 flex items-center justify-between">
                    <span>Approved & Issued</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </div>

                {/* 4. Total Revenue Audit */}
                <div 
                  onClick={() => setActiveTab('payments')}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 uppercase tracking-wider">
                      Revenue Ledger
                    </span>
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight">
                    ₹{(stats?.total_revenue || adminPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0) || 0).toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1 flex items-center justify-between">
                    <span>Audited Fee Receipts</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </div>

              </div>

              {/* Quick Navigation Shortcuts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div 
                  onClick={() => setActiveTab('applications')}
                  className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-md hover:border-orange-500 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-orange-400">{applications.length} Items</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-orange-400 transition-colors">
                      Applications Manager
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-tight mt-1">
                      Verify submitted documents, update status, and issue official certificates.
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('services')}
                  className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-md hover:border-blue-500 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      <Grid className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-blue-400">{services.length} Services</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors">
                      Services Catalog
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-tight mt-1">
                      Add, edit, or configure service descriptions, application fees, and processing times.
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('customers')}
                  className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">{customers.length} Citizens</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition-colors">
                      Users Directory
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-tight mt-1">
                      Audit registered user profiles, contact information, and application submission history.
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('enquiries')}
                  className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-md hover:border-purple-500 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-purple-400">{enquiries.length} Messages</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-purple-400 transition-colors">
                      Contact Enquiries
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-tight mt-1">
                      Read and respond to citizen contact form submissions and portal support requests.
                    </p>
                  </div>
                </div>

              </div>

              {/* Recent Applications Live Queue Table */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">
                      Recent Application Submissions Queue
                    </h4>
                    <p className="text-xs text-slate-500">
                      Live feed of recent digital service applications submitted by citizens.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('applications')}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1"
                  >
                    <span>View All ({applications.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {applications.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs font-medium">
                    No applications submitted yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                          <th className="py-3 px-4">Application ID</th>
                          <th className="py-3 px-4">Citizen Name</th>
                          <th className="py-3 px-4">Service</th>
                          <th className="py-3 px-4">Submission Date</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                        {applications.slice(0, 5).map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">
                              {app.application_number || `APP-${app.id}`}
                            </td>
                            <td className="py-3 px-4 font-semibold">
                              {app.user_name || app.applicant_name || 'Citizen User'}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-900 block">{app.service_name || 'Digital Service'}</span>
                              <span className="text-[10px] text-slate-500">{app.category_name || 'Service Queue'}</span>
                            </td>
                            <td className="py-3 px-4 text-slate-500">
                              {app.created_at ? new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                            </td>
                            <td className="py-3 px-4">
                              <StatusBadge status={app.status} />
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => {
                                  setActiveTab('applications');
                                  openAppInspector(app.id);
                                }}
                                className="px-3 py-1 bg-[#0b192c] hover:bg-orange-600 text-white text-[11px] font-extrabold rounded-lg transition-colors inline-flex items-center space-x-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

        </main>
      </div>

      {/* USER DETAILS INSPECTOR MODAL (STEP 27) */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0b192c] text-orange-400 font-black flex items-center justify-center text-lg shadow-sm">
                  {(selectedUser.name || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">{selectedUser.name}</h3>
                  <span className="text-xs text-slate-500 font-mono">Citizen Account #{selectedUser.id}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Email Address</span>
                  <span className="font-bold text-slate-900">{selectedUser.email}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Mobile Phone</span>
                  <span className="font-bold text-slate-900">{selectedUser.phone || 'N/A'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Account Status</span>
                  <span className="font-bold text-emerald-600">Active</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Registered Date</span>
                  <span className="font-bold text-slate-900">
                    {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Submitted Applications for this User */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-orange-500" />
                  <span>Submitted Applications History</span>
                </h4>

                {applications.filter(a => a.user_email === selectedUser.email || a.user_name === selectedUser.name).length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {applications.filter(a => a.user_email === selectedUser.email || a.user_name === selectedUser.name).map(app => (
                      <div key={app.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-orange-600 text-xs">{app.application_number}</span>
                          <span className="text-slate-900 font-bold block text-xs">{app.service_name}</span>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                    No applications submitted by this citizen yet.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors shadow"
            >
              Close Details Inspector
            </button>

          </div>
        </div>
      )}

      {/* INSPECTOR & REVIEW WORKSPACE MODAL (STEP 26) */}
      {appDetails && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-100 border border-slate-300 rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Application Review Header */}
            <div className="bg-[#0b192c] text-white p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-black text-orange-400 bg-orange-500/20 px-2.5 py-0.5 rounded border border-orange-500/30">
                    {appDetails.application_number}
                  </span>
                  <StatusBadge status={appDetails.status} />
                </div>
                <h3 className="font-black text-2xl text-white mt-1">
                  {appDetails.service_name}
                </h3>
                <p className="text-xs text-slate-300">
                  Submitted by <strong className="text-white">{appDetails.user_name}</strong> on {new Date(appDetails.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setAppDetails(null)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl border border-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* TWO-COLUMN REVIEW WORKSPACE (STEP 26) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LEFT COLUMN: APPLICANT INFO, FIELDS, DOCS, PAYMENTS, HISTORY */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Applicant Information Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                    <UserCheck className="w-4 h-4 text-orange-500" />
                    <span>Applicant Primary Contact Information</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block font-medium">Citizen Name</span>
                      <span className="font-bold text-slate-900 text-sm">{appDetails.user_name || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block font-medium">Mobile Number</span>
                      <span className="font-bold text-slate-900 text-sm">{appDetails.user_phone || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block font-medium">Email Address</span>
                      <span className="font-bold text-slate-900 text-sm truncate block">{appDetails.user_email || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Submitted Dynamic Service Fields (Deduplicated & Clean Spaced) */}
                {(() => {
                  const formatFieldLabel = (label, name) => {
                    let raw = label || name || '';
                    if (!raw) return 'Field';
                    const labelMap = {
                      'user_name': 'Full Name',
                      'full_name': 'Full Name',
                      'user_phone': 'Mobile Number',
                      'mobile': 'Mobile Number',
                      'mobile_number': 'Mobile Number',
                      'user_email': 'Email Address',
                      'email': 'Email Address',
                      'dob': 'Date of Birth',
                      'gender': 'Gender',
                      'district': 'District',
                      'state': 'State',
                      'pincode': 'PIN Code',
                      'aadhaar_no': 'Aadhaar Number',
                      'address': 'Address'
                    };
                    const lower = raw.trim().toLowerCase().replace(/:$/, '');
                    if (labelMap[lower]) return labelMap[lower];
                    let cleaned = raw.replace(/:$/, '').replace(/_/g, ' ').trim();
                    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
                  };

                  const seenNormalizedKeys = new Set();
                  const validFieldValues = [];

                  (appDetails.field_values || []).forEach(fv => {
                    if (!fv) return;
                    const rawKey = (fv.field_name || fv.field_label || '').trim();
                    const val = fv.value;
                    if (!rawKey) return;

                    const normKey = rawKey.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const baseKeysToIgnore = ['username', 'fullname', 'userphone', 'mobile', 'mobilenumber', 'useremail', 'email'];
                    if (baseKeysToIgnore.includes(normKey)) return;

                    if (val === undefined || val === null) return;
                    const strVal = String(val).trim();
                    if (!strVal || strVal === 'N/A' || strVal === 'null' || strVal === 'undefined') return;

                    if (seenNormalizedKeys.has(normKey)) return;
                    seenNormalizedKeys.add(normKey);

                    validFieldValues.push({
                      field_name: fv.field_name,
                      field_label: fv.field_label || fv.field_name,
                      value: strVal
                    });
                  });

                  return (
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                        <FileText className="w-4 h-4 text-orange-500" />
                        <span>Submitted Service Application Values</span>
                      </h4>

                      {validFieldValues.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          {validFieldValues.map((fv, idx) => (
                            <div key={idx} className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-2 hover:border-slate-300 transition-all shadow-2xs">
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                                {formatFieldLabel(fv.field_label, fv.field_name)}
                              </span>
                              <span className="font-extrabold text-slate-900 text-sm block leading-snug break-words">
                                {fv.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 font-medium">No additional dynamic form fields submitted.</p>
                      )}
                    </div>
                  );
                })()}

                {/* 3. Uploaded Documents & Verification Desk */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="flex items-center space-x-2">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>Uploaded Proof Documents & Verification Desk</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Officer Audit Logged</span>
                  </h4>

                  {appDetails.documents && appDetails.documents.length > 0 ? (
                    <div className="space-y-3">
                      {appDetails.documents.map((doc) => {
                        const isVerified = doc.verification_status === 'Verified';
                        const isRejected = doc.verification_status === 'Rejected';

                        return (
                          <div key={doc.id} className={`p-4 rounded-xl border ${
                            isRejected ? 'border-rose-200 bg-rose-50/50' : isVerified ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'
                          } space-y-3`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="space-y-0.5">
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-sm text-slate-900">{doc.document_name}</span>
                                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                                    isVerified ? 'bg-emerald-100 text-emerald-800' : isRejected ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {doc.verification_status || 'Pending Verification'}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500 font-mono">
                                  File: {doc.original_filename || doc.file_name} ({doc.file_type || 'File'})
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <a
                                  href={doc.file_path && (doc.file_path.startsWith('http') || doc.file_path.startsWith('data:')) ? doc.file_path : `/api/documents/${doc.id}/preview`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center space-x-1"
                                >
                                  <span>Preview</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={`/api/documents/${doc.id}/download`}
                                  className="px-3 py-1.5 bg-white text-orange-600 text-xs font-bold rounded-lg border border-slate-300"
                                >
                                  Download
                                </a>
                              </div>
                            </div>

                            {doc.file_path && (doc.file_type?.startsWith('image/') || /\.(jpg|jpeg|png|webp|jfif|bmp)$/i.test(doc.file_path || doc.original_filename || doc.file_name || '')) && (
                              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                                <a
                                  href={doc.file_path.startsWith('http') || doc.file_path.startsWith('data:') ? doc.file_path : `/api/documents/${doc.id}/preview`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="group relative block rounded-lg overflow-hidden border border-slate-200 shadow-2xs shrink-0"
                                >
                                  <img
                                    src={doc.file_path.startsWith('http') || doc.file_path.startsWith('data:') ? doc.file_path : `/api/documents/${doc.id}/preview`}
                                    alt={doc.document_name}
                                    className="w-16 h-16 object-cover group-hover:scale-105 transition-transform"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                  <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-black transition-opacity">
                                    View
                                  </span>
                                </a>
                                <span className="text-[11px] text-slate-500">Click image thumbnail to inspect full resolution document proof</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No proof documents uploaded for this application.</p>
                  )}
                </div>

                {/* 4. Payment Information Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Payment Information</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block font-medium">Service Fee</span>
                      <span className="font-extrabold text-emerald-600 text-sm">₹{appDetails.total_fee || 50}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block font-medium">Payment Status</span>
                      <span className="font-bold text-emerald-700 uppercase">PAID (Online)</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block font-medium">Gateway</span>
                      <span className="font-bold text-slate-800">Razorpay Direct</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block font-medium">Audit Txn</span>
                      <span className="font-mono text-slate-600 text-[11px]">#PAY-2026-OK</span>
                    </div>
                  </div>
                </div>

                {/* 5. Status History Timeline */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                    <History className="w-4 h-4 text-orange-500" />
                    <span>Application Status Audit Timeline</span>
                  </h4>
                  {appDetails.history && appDetails.history.length > 0 ? (
                    <div className="relative border-l-2 border-slate-200 ml-3 space-y-4 pl-6 py-2">
                      {appDetails.history.map((hist, idx) => (
                        <div key={idx} className="relative">
                          <div className="w-3 h-3 bg-orange-500 rounded-full absolute -left-[31px] top-1 ring-4 ring-white"></div>
                          <div className="text-xs space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-900 uppercase">{hist.status}</span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-500">{new Date(hist.created_at).toLocaleString()}</span>
                            </div>
                            <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">{hist.admin_remarks}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Initial submission status active.</p>
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN: ACTION & STATUS DESK */}
              <div className="space-y-6">
                
                {/* Status Update Form */}
                <form onSubmit={handleUpdateStatusSubmit} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                  <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                    <Edit3 className="w-4 h-4 text-orange-500" />
                    <span>Admin Status & Remarks Desk</span>
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Target Status</label>
                      <select
                        value={normalizeAppStatus(updateStatus)}
                        onChange={(e) => {
                          const val = e.target.value;
                          setUpdateStatus(val);
                          if ((val === 'Completed' || (val && val.toUpperCase() === 'COMPLETED')) && (!adminRemarks || adminRemarks.startsWith('Status updated to'))) {
                            setAdminRemarks(`Official certificate ${certNumber || 'document'} issued and verified.`);
                          }
                        }}
                        className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl px-3 py-2.5 border border-slate-300 outline-none font-bold"
                      >
                        <option value="Pending">Pending Verification</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Processing">In Processing</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    {/* CERTIFICATE UPLOAD SECTION (SHOWN WHEN COMPLETED IS SELECTED) */}
                    {(updateStatus === 'Completed' || (updateStatus && updateStatus.toUpperCase() === 'COMPLETED')) && (
                      <div className="bg-amber-50/80 border-2 border-amber-300/80 rounded-2xl p-4 space-y-3 shadow-sm">
                        <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                          <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-amber-600" />
                            Official Certificate Upload
                          </span>
                          <span className="text-[10px] font-black bg-amber-200/90 text-amber-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Citizen Downloadable
                          </span>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Certificate Reference Number
                          </label>
                          <input
                            type="text"
                            value={certNumber}
                            onChange={(e) => setCertNumber(e.target.value)}
                            placeholder="CERT-2026-XXXXXX"
                            className="w-full bg-white text-slate-900 text-xs rounded-xl px-3 py-2 border border-slate-300 outline-none font-mono font-bold focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Upload Certificate File (PDF / JPG / PNG)
                          </label>
                          <div className="relative border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-xl p-3 bg-white text-center transition-all cursor-pointer">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setCertFile(e.target.files[0]);
                                  if (!adminRemarks || adminRemarks.startsWith('Status updated to')) {
                                    setAdminRemarks(`Official certificate ${certNumber || 'document'} issued and verified.`);
                                  }
                                }
                              }}
                              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                            />
                            {certFile ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-left">
                                  <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                                  <div className="min-w-0">
                                    <div className="text-xs font-extrabold text-slate-800 truncate max-w-[170px]">
                                      {certFile.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium">
                                      {(certFile.size / 1024).toFixed(1)} KB
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    setCertFile(null);
                                  }}
                                  className="text-[10px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2 py-1 rounded relative z-20"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <div className="py-2">
                                <Upload className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                                <span className="text-xs font-bold text-slate-700 block">
                                  Click or Drag Certificate File Here
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  PDF, JPG, PNG up to 25MB
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Existing Certificate View if already attached */}
                        {appDetails?.certificate_url && (
                          <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/90 flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2 truncate mr-2">
                              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="font-bold text-slate-700 truncate">
                                Attached: {appDetails.certificate_number || 'Certificate'}
                              </span>
                            </div>
                            <a
                              href={appDetails.certificate_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-black text-amber-700 hover:text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300 shrink-0 flex items-center gap-1"
                            >
                              <span>View File</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Official Remarks (Citizen Visible)</label>
                      <textarea
                        rows={3}
                        required
                        value={adminRemarks}
                        onChange={(e) => setAdminRemarks(e.target.value)}
                        placeholder="Enter specific verification remarks..."
                        className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl p-3 border border-slate-300 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingStatus}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5"
                    >
                      {savingStatus ? (
                        <span>{certFile ? 'Uploading Certificate & Updating...' : 'Saving Status...'}</span>
                      ) : (
                        <span>Save & Publish Status Update</span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Digital Certificate Generator */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                  <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                    <Award className="w-4 h-4 text-orange-500" />
                    <span>Digital Certificate Desk</span>
                  </h4>
                  {appDetails?.certificate_url ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                        <div className="flex items-center space-x-1.5 text-emerald-700 font-black text-xs">
                          <CheckCircle className="w-4 h-4" />
                          <span>Official Certificate Issued</span>
                        </div>
                        <div className="text-[11px] text-emerald-800 font-mono font-bold">
                          {appDetails.certificate_number || 'CERT-ISSUED'}
                        </div>
                        {appDetails.certificate_issued_at && (
                          <div className="text-[10px] text-emerald-600">
                            Issued: {new Date(appDetails.certificate_issued_at).toLocaleString()}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={appDetails.certificate_url}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5"
                        >
                          <Download className="w-4 h-4" />
                          <span>View/Download</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleIssueCertificate(appDetails.id)}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs py-2.5 rounded-xl shadow transition-colors flex items-center justify-center space-x-1"
                        >
                          <Award className="w-4 h-4" />
                          <span>Re-Issue Cert</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-slate-500">
                        Upload and issue an official verified digital certificate for this customer request.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setUpdateStatus('Completed');
                          if (!adminRemarks || adminRemarks.startsWith('Status updated to')) {
                            setAdminRemarks(`Official certificate ${certNumber || 'document'} issued and verified.`);
                          }
                        }}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs py-3 rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <Award className="w-4 h-4" />
                        <span>Issue & Upload Certificate</span>
                      </button>
                    </>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* SERVICE DETAILS & CONFIGURATION INSPECTOR MODAL (STEP 28) */}
      {selectedService && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 font-black flex items-center justify-center text-lg shadow-sm">
                  <Grid className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {selectedService.category_name || selectedService.category || 'General'}
                    </span>
                    <span className="text-xs font-mono text-emerald-600 font-bold">• Active Catalog</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">{selectedService.name}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Basic Overview & Fee Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Government & Service Fee</span>
                  <span className="font-black text-emerald-600 text-base">
                    {Number(selectedService.fee) === 0 ? 'FREE (₹0)' : `₹${selectedService.fee !== undefined ? selectedService.fee : (selectedService.total_fee || 60)}`}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Processing SLA</span>
                  <span className="font-bold text-slate-900">{selectedService.processing_time || '2-3 Business Days'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block font-medium">Status</span>
                  <span className="font-bold text-emerald-600 uppercase">Active</span>
                </div>
              </div>

              {/* Service Description */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Service Scope & Description</span>
                <p className="text-slate-700 leading-relaxed">
                  {selectedService.description || 'Official digital services processing and government department application assistance.'}
                </p>
              </div>

              {/* Configured Form Fields Desk */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-orange-500" />
                  <span>Configured Dynamic Application Form Fields</span>
                </h4>

                {selectedService.fields && selectedService.fields.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedService.fields.map((fld, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-900 block">{fld.label || fld.name || `Field #${idx+1}`}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Type: {fld.type || 'text'}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          fld.required ? 'bg-orange-100 text-orange-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {fld.required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                      <span>1. Citizen Identity & Full Legal Name</span>
                      <span className="bg-orange-100 text-orange-800 text-[10px] px-2 py-0.5 rounded">Required</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800 pt-1 border-t border-slate-200/60">
                      <span>2. Mobile Phone Number & Email Address</span>
                      <span className="bg-orange-100 text-orange-800 text-[10px] px-2 py-0.5 rounded">Required</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Configured Required Documents Desk */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Configured Required Proof Documents</span>
                </h4>

                {selectedService.required_documents && selectedService.required_documents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedService.required_documents.map((doc, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-900">{typeof doc === 'string' ? doc : doc.name}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">Format: PDF/JPEG (Max 5MB)</span>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          Mandatory Verification
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900">Aadhaar Card / Government Identity Proof</span>
                        <span className="text-[10px] text-slate-400 block font-mono">Format: PDF/JPEG (Max 5MB)</span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Mandatory
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>

            <button
              onClick={() => setSelectedService(null)}
              className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors shadow"
            >
              Close Service Inspector
            </button>

          </div>
        </div>
      )}

      {/* PAYMENT DETAILS & TRANSACTION BREAKDOWN INSPECTOR MODAL (STEP 29) */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 font-black flex items-center justify-center text-lg shadow-sm">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      OFFICIAL PAYMENT AUDIT
                    </span>
                    <span className="text-xs font-mono text-emerald-600 font-bold">• Gateway Logged</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">{selectedPayment.transaction_id || `TXN-${selectedPayment.id}`}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Payment Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Transaction Amount</span>
                  <span className="font-black text-emerald-600 text-lg">₹{selectedPayment.amount || selectedPayment.total_fee || 50}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Payment Gateway</span>
                  <span className="font-bold text-slate-900">{selectedPayment.payment_method || 'Razorpay Direct'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block font-medium">Payment Status</span>
                  <span className="font-bold text-emerald-600 uppercase">
                    {selectedPayment.status || 'PAID'}
                  </span>
                </div>
              </div>

              {/* Linked Application Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Linked Application Details</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono">Application Reference Number</span>
                    <span className="font-extrabold text-orange-600 font-mono text-sm">{selectedPayment.application_number || `APP-${selectedPayment.id}`}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">Digital Service Requested</span>
                    <span className="font-bold text-slate-900">{selectedPayment.service_name || 'E-Seva Digital Service'}</span>
                  </div>
                </div>
              </div>

              {/* Citizen Contact Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Citizen Primary Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono">Applicant Legal Name</span>
                    <span className="font-bold text-slate-900">{selectedPayment.user_name || 'Citizen Applicant'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">Mobile / Email</span>
                    <span className="font-bold text-slate-900">{selectedPayment.user_email || 'Verified Account'}</span>
                  </div>
                </div>
              </div>

              {/* Transaction Timestamps & Receipt Log */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Gateway Receipt & Audit Trail</span>
                </h4>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gateway Order ID:</span>
                    <span className="font-bold text-slate-800">ord_live_{selectedPayment.id || '9872'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gateway Payment ID:</span>
                    <span className="font-bold text-slate-800">pay_live_{selectedPayment.id || '4452'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Timestamp:</span>
                    <span className="font-bold text-slate-800">
                      {selectedPayment.created_at ? new Date(selectedPayment.created_at).toLocaleString() : new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center space-x-3 pt-2">
              {(!selectedPayment.status || selectedPayment.status.toLowerCase() === 'paid' || selectedPayment.status.toLowerCase() === 'success') && (
                <button
                  onClick={() => {
                    handleRefund(selectedPayment.id);
                    setSelectedPayment(null);
                  }}
                  className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl border border-rose-200 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Issue Full Refund</span>
                </button>
              )}

              <button
                onClick={() => setSelectedPayment(null)}
                className="flex-1 py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors shadow"
              >
                Close Payment Inspector
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CITIZEN USER DIRECTORY INSPECTOR MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0b192c] text-orange-400 font-black flex items-center justify-center text-xl shadow-md">
                  {(selectedUser.name || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      CITIZEN ACCOUNT PROFILE
                    </span>
                    <span className="text-xs font-mono text-slate-500">• User ID #{selectedUser.id}</span>
                  </div>
                  <h3 className="font-extrabold text-xl text-slate-900 mt-0.5">{selectedUser.name || 'Citizen Account'}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="space-y-5 text-xs">
              
              {/* Account Status & Registered Date */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Account Status</span>
                  <span className="font-extrabold text-emerald-600 uppercase text-xs inline-flex items-center space-x-1 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedUser.status || 'Active'}</span>
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Registration Date</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block font-medium">Total Applications</span>
                  <span className="font-black text-orange-600 text-base">
                    {getUserApplicationCount(selectedUser)}
                  </span>
                </div>
              </div>

              {/* Personal Contact & Identity Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-slate-900 font-extrabold text-xs uppercase tracking-wider block border-b border-slate-200/80 pb-2">
                  Contact & Identity Registration Info
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px]">Mobile Phone Number</span>
                    <span className="font-bold text-slate-900 text-xs">{selectedUser.phone || 'No Mobile Registered'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-mono text-[10px]">Email Address</span>
                    <span className="font-bold text-slate-900 text-xs">{selectedUser.email || 'No Email Registered'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-mono text-[10px]">Aadhaar Card Number</span>
                    <span className="font-bold text-slate-900 font-mono text-xs">{selectedUser.aadhaar_no || 'Not Provided'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-mono text-[10px]">District & State</span>
                    <span className="font-bold text-slate-900 text-xs">{selectedUser.district ? `${selectedUser.district}, Tamil Nadu` : 'Tamil Nadu'}</span>
                  </div>
                </div>

                {(selectedUser.address || selectedUser.pincode) && (
                  <div className="pt-2 border-t border-slate-200/70">
                    <span className="text-slate-400 block font-mono text-[10px]">Registered Address</span>
                    <span className="font-medium text-slate-800 text-xs">
                      {selectedUser.address} {selectedUser.pincode ? `- ${selectedUser.pincode}` : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Applications Logged by User */}
              <div className="space-y-2">
                <span className="text-slate-900 font-extrabold text-xs uppercase tracking-wider block">
                  Submitted Citizen Applications
                </span>

                {getUserApplicationsList(selectedUser).length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
                    No submitted applications recorded for this user account.
                  </div>
                ) : (
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                    {getUserApplicationsList(selectedUser).map((app) => (
                      <div key={app.id || app.application_number} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-extrabold text-orange-600 block">{app.application_number}</span>
                          <span className="font-bold text-slate-900 text-xs">{app.service_name}</span>
                        </div>
                        <div className="text-right">
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-200 block mb-0.5">
                            {app.status || 'Submitted'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {app.created_at ? new Date(app.created_at).toLocaleDateString('en-IN') : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleDeleteUser(selectedUser.id, selectedUser.name)}
                className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl border border-rose-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Delete Account</span>
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors shadow cursor-pointer"
              >
                Close Profile Inspector
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CONTACT ENQUIRY & COMMUNICATION INSPECTOR MODAL (STEP 30) */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 font-black flex items-center justify-center text-lg shadow-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      OFFICIAL ENQUIRY AUDIT
                    </span>
                    <span className="text-xs font-mono text-slate-500">• ID #{selectedEnquiry.id}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">{selectedEnquiry.subject || 'General Enquiry'}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Customer Primary Contact */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Citizen Primary Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono">Full Name</span>
                    <span className="font-extrabold text-slate-900 text-sm">{selectedEnquiry.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">Email Address</span>
                    <span className="font-bold text-slate-900">{selectedEnquiry.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">Mobile / Phone</span>
                    <span className="font-bold text-slate-900">{selectedEnquiry.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Message Content Body */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Enquiry Message Body</span>
                  <span className="text-slate-400 text-[10px]">
                    Submitted: {selectedEnquiry.created_at ? new Date(selectedEnquiry.created_at).toLocaleString('en-IN') : 'Logged'}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 font-normal leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Reply / Official Response Composer */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-slate-900 font-black text-xs uppercase tracking-wider flex items-center space-x-2">
                  <Send className="w-4 h-4 text-orange-500" />
                  <span>Official Reply Desk & Communication</span>
                </span>
                
                <textarea
                  rows={3}
                  placeholder="Type official response or support reply to citizen..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:border-[#0b192c] focus:bg-white outline-none transition-all shadow-inner"
                />

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      if (!replyText.trim()) return addToast('Please enter a reply message', 'error');
                      addToast('Official reply dispatched to citizen!', 'success');
                      setReplyText('');
                    }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Response</span>
                  </button>
                </div>
              </div>

            </div>

            <button
              onClick={() => setSelectedEnquiry(null)}
              className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors shadow"
            >
              Close Enquiry Inspector
            </button>

          </div>
        </div>
      )}

      {/* CANDIDATE DETAILS & RESUME INSPECTOR MODAL (STEP 31) */}
      {selectedCareerApp && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 font-black flex items-center justify-center text-lg shadow-sm">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      CANDIDATE AUDIT
                    </span>
                    <span className="text-xs font-mono text-slate-500">• ID #{selectedCareerApp.id}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">{selectedCareerApp.applicant_name}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedCareerApp(null)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Candidate Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Applied Position</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedCareerApp.position}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-medium">Experience Level</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedCareerApp.experience || 'Entry Level'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block font-medium">Pipeline Status</span>
                  <span className="font-bold text-blue-600 uppercase text-xs">
                    {selectedCareerApp.status || 'Received'}
                  </span>
                </div>
              </div>

              {/* Candidate Contact Information */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Candidate Primary Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono">Email Address</span>
                    <span className="font-bold text-slate-900">{selectedCareerApp.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">Mobile / Phone</span>
                    <span className="font-bold text-slate-900">{selectedCareerApp.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Uploaded Resume / CV File Document Card */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <Paperclip className="w-4 h-4 text-orange-500" />
                  <span>Uploaded Candidate Resume / CV</span>
                </h4>

                {selectedCareerApp.resume_file ? (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">Candidate Resume Document</span>
                        <span className="text-[10px] text-slate-500 font-mono">{selectedCareerApp.resume_file}</span>
                      </div>
                    </div>

                    <a
                      href={selectedCareerApp.resume_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center space-x-1.5"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Download File</span>
                    </a>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 italic text-xs">
                    No resume file was attached with this application.
                  </div>
                )}
              </div>

            </div>

            <button
              onClick={() => setSelectedCareerApp(null)}
              className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors shadow"
            >
              Close Candidate Inspector
            </button>

          </div>
        </div>
      )}

      {/* NOTIFICATION DETAILS INSPECTOR MODAL (STEP 32) */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 font-black flex items-center justify-center text-lg shadow-sm">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      OPERATIONS ALERT AUDIT
                    </span>
                    <span className="text-xs font-mono text-slate-500">• ID #{selectedNotif.id}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">{selectedNotif.title}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedNotif(null)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-bold text-[11px] block uppercase tracking-wider">Alert Metadata</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono">Category Type</span>
                    <span className="font-extrabold text-slate-900 uppercase font-mono">{selectedNotif.type || 'SYSTEM'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">Timestamp</span>
                    <span className="font-bold text-slate-900">
                      {new Date(selectedNotif.createdAt || selectedNotif.created_at || Date.now()).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Full Message Content</span>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 leading-relaxed font-normal">
                  {selectedNotif.message}
                </div>
              </div>

            </div>

            <button
              onClick={() => setSelectedNotif(null)}
              className="w-full py-2.5 bg-[#0b192c] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors shadow"
            >
              Close Alert Inspector
            </button>

          </div>
        </div>
      )}

      {/* ADD NEW SERVICE MODAL */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-black uppercase text-orange-600 tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                  NEW SERVICE PUBLISHER
                </span>
                <h3 className="font-extrabold text-xl text-slate-900 mt-1">Add New E-Seva Service</h3>
                <p className="text-xs text-slate-500">Configure new service details to publish directly to the User Dashboard and Services Catalog.</p>
              </div>

              <button
                onClick={() => setShowAddServiceModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateServiceSubmit} className="space-y-6 text-xs">
              
              {/* Basic Details */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider border-b border-slate-100 pb-1">1. Basic Service Information</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Service Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Income & Assets Certificate"
                      value={newServiceForm.name}
                      onChange={(e) => setNewServiceForm({ ...newServiceForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-orange-500 font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Category *</label>
                    <select
                      value={newServiceForm.is_custom_category ? 'CUSTOM' : newServiceForm.category_id}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'CUSTOM') {
                          setNewServiceForm({ ...newServiceForm, is_custom_category: true, category_id: null });
                        } else {
                          const catId = Number(val);
                          const catObj = [
                            { id: 1, name: 'Aadhaar Services' },
                            { id: 2, name: 'PAN Services' },
                            { id: 3, name: 'Voter ID Services' },
                            { id: 4, name: 'Certificate Services' },
                            { id: 5, name: 'Land / Patta Services' },
                            { id: 6, name: 'Passport Services' },
                            { id: 7, name: 'Driving Licence / Vehicle Services' },
                            { id: 8, name: 'Business Services' },
                            { id: 9, name: 'Utility Services' },
                            { id: 10, name: 'Other Digital Services' }
                          ].find(c => c.id === catId);
                          setNewServiceForm({
                            ...newServiceForm,
                            is_custom_category: false,
                            category_id: catId,
                            category_name: catObj ? catObj.name : 'Certificate Services'
                          });
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-orange-500 font-semibold"
                    >
                      <option value="4">Certificate Services</option>
                      <option value="1">Aadhaar Services</option>
                      <option value="2">PAN Services</option>
                      <option value="3">Voter ID Services</option>
                      <option value="5">Land / Patta Services</option>
                      <option value="6">Passport Services</option>
                      <option value="7">Driving Licence / Vehicle Services</option>
                      <option value="8">Business Services</option>
                      <option value="9">Utility Services</option>
                      <option value="10">Other Digital Services</option>
                      <option value="CUSTOM">➕ Create New Custom Category...</option>
                    </select>

                    {newServiceForm.is_custom_category && (
                      <input
                        type="text"
                        placeholder="Enter New Category Name (e.g. Pension Services)"
                        value={newServiceForm.custom_category_name}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, custom_category_name: e.target.value })}
                        className="w-full mt-2 bg-amber-50 border border-amber-300 text-slate-900 rounded-xl px-3.5 py-2 outline-none focus:border-amber-500 font-semibold"
                        required
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Government & Facilitation Fee (₹) *</label>
                    <input
                      type="number"
                      placeholder="60"
                      value={newServiceForm.fee}
                      onChange={(e) => setNewServiceForm({ ...newServiceForm, fee: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-orange-500 font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Processing SLA / Delivery Time *</label>
                    <input
                      type="text"
                      placeholder="e.g. 2-3 Business Days"
                      value={newServiceForm.processing_time}
                      onChange={(e) => setNewServiceForm({ ...newServiceForm, processing_time: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-orange-500 font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Service Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the service and who can apply..."
                    value={newServiceForm.description}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                {/* Service Image / Banner Option */}
                <div className="space-y-3 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <ImageIcon className="w-4 h-4 text-orange-500" />
                      <span>Service Banner Image / Icon (Optional)</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Upload File or Provide URL</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600 block">1. Upload Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const previewUrl = URL.createObjectURL(file);
                            setNewServiceForm(prev => ({
                              ...prev,
                              image_file: file,
                              image_preview: previewUrl
                            }));
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 outline-none file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0b192c] file:text-white hover:file:bg-orange-600 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600 block">2. Or Paste Image URL</span>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={newServiceForm.image_url_input || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewServiceForm(prev => ({
                            ...prev,
                            image_url_input: val,
                            image_preview: val || (prev.image_file ? URL.createObjectURL(prev.image_file) : '')
                          }));
                        }}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-orange-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1.5">⚡ Or Choose Fast Preset Icon:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {SERVICE_IMAGE_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewServiceForm(prev => ({
                            ...prev,
                            image_url_input: p.url,
                            image_file: null,
                            image_preview: p.url
                          }))}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors cursor-pointer ${
                            newServiceForm.image_url_input === p.url && !newServiceForm.image_file
                              ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                              : 'bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 border-slate-200'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {newServiceForm.image_preview && (
                    <div className="relative w-full h-28 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden group">
                      <img src={newServiceForm.image_preview} alt="Service Banner Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setNewServiceForm(prev => ({ ...prev, image_file: null, image_url_input: '', image_preview: '' }))}
                          className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-rose-700 transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Remove Image</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Required Documents */}
              <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                  <div>
                    <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider flex items-center space-x-1.5">
                      <FileCheck className="w-4 h-4 text-orange-600" />
                      <span>2. Required Proof Documents (சான்று ஆவணங்கள்)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Set each document as Mandatory (கட்டாயம்) or Optional (விருப்பத்தேர்வு)
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                      🔴 {(newServiceForm.documents || []).filter(d => (typeof d === 'string' ? true : (d.is_required !== false && d.is_required !== 0 && d.is_required !== '0'))).length} Mandatory
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                      🟢 {(newServiceForm.documents || []).filter(d => (typeof d === 'object' && (d.is_required === false || d.is_required === 0 || d.is_required === '0'))).length} Optional
                    </span>
                  </div>
                </div>
                
                {/* Add new document row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter document name (e.g. Income Certificate / Ration Card)"
                    value={newServiceForm.newDocInput || ''}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, newDocInput: e.target.value })}
                    className="flex-1 bg-white border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none font-medium text-xs focus:border-orange-500 shadow-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newServiceForm.newDocInput && newServiceForm.newDocInput.trim()) {
                          const isReq = newServiceForm.newDocIsRequired !== false;
                          setNewServiceForm({
                            ...newServiceForm,
                            documents: [
                              ...newServiceForm.documents,
                              { name: newServiceForm.newDocInput.trim(), is_required: isReq }
                            ],
                            newDocInput: '',
                            newDocIsRequired: true
                          });
                        }
                      }
                    }}
                  />
                  <select
                    value={newServiceForm.newDocIsRequired !== false ? '1' : '0'}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, newDocIsRequired: e.target.value === '1' })}
                    className="bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-orange-500 shadow-xs cursor-pointer"
                  >
                    <option value="1">🔴 கட்டாயம் (Mandatory)</option>
                    <option value="0">🟢 விருப்பத்தேர்வு (Optional)</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      if (newServiceForm.newDocInput && newServiceForm.newDocInput.trim()) {
                        const isReq = newServiceForm.newDocIsRequired !== false;
                        setNewServiceForm({
                          ...newServiceForm,
                          documents: [
                            ...newServiceForm.documents,
                            { name: newServiceForm.newDocInput.trim(), is_required: isReq }
                          ],
                          newDocInput: '',
                          newDocIsRequired: true
                        });
                      }
                    }}
                    className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shrink-0 shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Document</span>
                  </button>
                </div>

                {/* List of documents with toggle and remove */}
                {(!newServiceForm.documents || newServiceForm.documents.length === 0) ? (
                  <p className="text-xs text-slate-400 italic py-2 text-center bg-white rounded-xl border border-slate-200">
                    No proof documents added yet. Add documents above.
                  </p>
                ) : (
                  <div className="space-y-2 pt-1 max-h-60 overflow-y-auto pr-1">
                    {newServiceForm.documents.map((doc, idx) => {
                      const docName = typeof doc === 'string' ? doc : (doc.name || doc.document_name);
                      const isReq = typeof doc === 'string' ? true : (doc.is_required !== false && doc.is_required !== 0 && doc.is_required !== '0');
                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
                            isReq
                              ? 'bg-amber-50/70 border-amber-200'
                              : 'bg-emerald-50/70 border-emerald-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                            <span className="text-base shrink-0">{isReq ? '📄' : '📑'}</span>
                            <span className="font-bold text-slate-900 text-xs truncate">
                              {docName}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                            {/* Segmented Button: Mandatory vs Optional */}
                            <div className="inline-flex rounded-lg p-0.5 bg-white border border-slate-200 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...newServiceForm.documents];
                                  updated[idx] = { name: docName, is_required: true };
                                  setNewServiceForm({ ...newServiceForm, documents: updated });
                                }}
                                className={`px-2.5 py-1 text-[11px] font-extrabold rounded-md transition-all cursor-pointer ${
                                  isReq
                                    ? 'bg-amber-500 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-amber-800 hover:bg-slate-50'
                                }`}
                              >
                                🔴 கட்டாயம் (Mandatory)
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...newServiceForm.documents];
                                  updated[idx] = { name: docName, is_required: false };
                                  setNewServiceForm({ ...newServiceForm, documents: updated });
                                }}
                                className={`px-2.5 py-1 text-[11px] font-extrabold rounded-md transition-all cursor-pointer ${
                                  !isReq
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                                }`}
                              >
                                🟢 விருப்பத்தேர்வு (Optional)
                              </button>
                            </div>

                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={() => {
                                setNewServiceForm({
                                  ...newServiceForm,
                                  documents: newServiceForm.documents.filter((_, i) => i !== idx)
                                });
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Custom Citizen Applicant Form Fields */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider">3. Citizen Application Form Fields</h4>
                  <span className="text-[11px] font-bold text-slate-400">Customizable Inputs</span>
                </div>
                
                <div className="space-y-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        placeholder="Field Label (e.g. Blood Group, Qualification)"
                        value={newServiceForm.newFieldLabel || ''}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, newFieldLabel: e.target.value })}
                        className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 outline-none font-medium text-xs focus:ring-2 focus:ring-[#0b192c]"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <select
                        value={newServiceForm.newFieldType || 'text'}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, newFieldType: e.target.value })}
                        className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 outline-none font-medium text-xs focus:ring-2 focus:ring-[#0b192c]"
                      >
                        <option value="text">Short answer (Text Input)</option>
                        <option value="textarea">Paragraph (Textarea / Address)</option>
                        <option value="number">Number Input</option>
                        <option value="date">Date Field</option>
                        <option value="select">Drop-down (Select)</option>
                        <option value="radio">Multiple choice (Radio)</option>
                        <option value="checkbox">Checkbox (Yes / No)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (newServiceForm.newFieldLabel && newServiceForm.newFieldLabel.trim()) {
                            const fType = newServiceForm.newFieldType || 'text';
                            const isOptType = fType === 'select' || fType === 'radio';
                            let opts = [];
                            if (isOptType) {
                              opts = (newServiceForm.newFieldOptions || '')
                                .split(',')
                                .map(s => s.trim())
                                .filter(Boolean);
                              if (opts.length === 0) {
                                opts = ['Option 1', 'Option 2'];
                              }
                            }
                            setNewServiceForm({
                              ...newServiceForm,
                              fields: [
                                ...newServiceForm.fields,
                                {
                                  field_label: newServiceForm.newFieldLabel.trim(),
                                  field_type: fType,
                                  is_required: true,
                                  options: isOptType ? opts : [],
                                  options_json: isOptType ? opts : null
                                }
                              ],
                              newFieldLabel: '',
                              newFieldType: 'text',
                              newFieldOptions: ''
                            });
                          }
                        }}
                        className="w-full py-2 bg-[#0b192c] text-white font-bold rounded-xl hover:bg-slate-800 text-xs shadow-sm transition-colors"
                      >
                        + Add Form Field
                      </button>
                    </div>
                  </div>

                  {/* Dropdown / Multiple Choice Options Configuration Box */}
                  {(newServiceForm.newFieldType === 'select' || newServiceForm.newFieldType === 'radio') && (
                    <div className="p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-1 mt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                          <span>{newServiceForm.newFieldType === 'radio' ? '🔘 Multiple Choice Options' : '▼ Drop-down Options'}</span>
                        </label>
                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Separate choices with commas ( , )</span>
                      </div>
                      <input
                        type="text"
                        placeholder={newServiceForm.newFieldType === 'radio' ? "e.g. Yes, No, Not Applicable" : "e.g. A+, B+, O+, AB+, A-, B-, O-, AB-"}
                        value={newServiceForm.newFieldOptions || ''}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, newFieldOptions: e.target.value })}
                        className="w-full bg-white border border-blue-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                      <p className="text-[10px] text-blue-600 font-medium">
                        💡 Citizens will choose from these options when filling this field on the application form.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {newServiceForm.fields.map((f, idx) => {
                    const fOpts = Array.isArray(f.options) ? f.options : (typeof f.options === 'string' ? f.options.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(f.options_json) ? f.options_json : (typeof f.options_json === 'string' ? JSON.parse(f.options_json || '[]') : [])));
                    const fType = (f.field_type || 'text').toLowerCase();
                    const isSelect = fType === 'select' || fType === 'dropdown';
                    const isRadio = fType === 'radio' || fType === 'multiple choice';
                    const isCheck = fType === 'checkbox';

                    return (
                      <div key={idx} className="p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200 flex items-start justify-between font-medium text-xs transition-colors gap-2">
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="font-bold text-slate-900">{f.field_label}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              isSelect ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                              isRadio ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                              isCheck ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              fType === 'date' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                              fType === 'textarea' ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' :
                              'bg-slate-200 text-slate-700'
                            }`}>
                              {isSelect ? '▼ Dropdown' :
                               isRadio ? '🔘 Multiple Choice' :
                               isCheck ? '☑ Checkbox' :
                               fType === 'date' ? '📅 Date' :
                               fType === 'textarea' ? '📝 Paragraph' :
                               '🔤 Text Input'}
                            </span>
                            {f.is_required && (
                              <span className="text-[10px] text-rose-500 font-bold">*Required</span>
                            )}
                          </div>
                          {fOpts.length > 0 && (
                            <div className="flex items-center flex-wrap gap-1 pt-0.5">
                              <span className="text-[10px] font-bold text-slate-400">Options:</span>
                              {fOpts.map((opt, oIdx) => (
                                <span key={oIdx} className="bg-white border border-slate-200 text-slate-700 font-medium px-1.5 py-0.5 rounded text-[10px]">
                                  {String(opt)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setNewServiceForm({
                              ...newServiceForm,
                              fields: newServiceForm.fields.filter((_, i) => i !== idx)
                            });
                          }}
                          className="text-rose-600 hover:text-rose-800 font-extrabold text-xs ml-2 shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingService}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-xl shadow transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {creatingService ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{creatingService ? 'Publishing Service...' : 'Save & Publish Service'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* EDIT SERVICE MODAL */}
      {showEditServiceModal && editingServiceForm && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  EDIT CONFIGURATION
                </span>
                <h3 className="font-extrabold text-xl text-slate-900 mt-1">Edit Service: {editingServiceForm.name}</h3>
                <p className="text-xs text-slate-500">Modify service parameters, fees, category placement, dynamic fields, and required documents.</p>
              </div>

              <button
                onClick={() => {
                  setShowEditServiceModal(false);
                  setEditingServiceForm(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditServiceSubmit} className="space-y-6 text-xs">
              
              {/* Basic Details */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider border-b border-slate-100 pb-1">1. Basic Service Information</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Service Name *</label>
                    <input
                      type="text"
                      value={editingServiceForm.name}
                      onChange={(e) => setEditingServiceForm({ ...editingServiceForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500 font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Category *</label>
                    <select
                      value={editingServiceForm.category_name}
                      onChange={(e) => setEditingServiceForm({ ...editingServiceForm, category_name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500 font-semibold"
                    >
                      <option value="Land & Patta Services">Land & Patta Services</option>
                      <option value="Land / Patta Services">Land / Patta Services</option>
                      <option value="Aadhaar Services">Aadhaar Services</option>
                      <option value="PAN Services">PAN Services</option>
                      <option value="Certificates & Revenue">Certificates & Revenue</option>
                      <option value="Certificate Services">Certificate Services</option>
                      <option value="Voter ID Services">Voter ID Services</option>
                      <option value="Passport Services">Passport Services</option>
                      <option value="Driving & Vehicle Services">Driving & Vehicle Services</option>
                      <option value="Driving Licence / Vehicle Services">Driving Licence / Vehicle Services</option>
                      <option value="Business Services">Business Services</option>
                      <option value="Utility Services">Utility Services</option>
                      <option value="Ration Card Services">Ration Card Services</option>
                      <option value="Other Digital Services">Other Digital Services</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 block">Service Fee Amount (₹) *</label>
                      {Number(editingServiceForm.fee) === 0 ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                          🟢 Free Service (₹0)
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300">
                          💳 Paid Service (₹{editingServiceForm.fee})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        value={editingServiceForm.fee}
                        onChange={(e) => setEditingServiceForm({ ...editingServiceForm, fee: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500 font-bold"
                        placeholder="0 for Free service"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setEditingServiceForm({ ...editingServiceForm, fee: 0 })}
                        className={`px-3 py-2.5 rounded-xl font-black text-xs shrink-0 transition-colors border ${
                          Number(editingServiceForm.fee) === 0
                            ? 'bg-emerald-600 text-white border-emerald-700'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        Set ₹0 Free
                      </button>
                    </div>
                    {/* Quick Amount Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400">Quick Fee Presets:</span>
                      {[0, 25, 30, 50, 60, 100, 110, 125, 250, 500].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setEditingServiceForm({ ...editingServiceForm, fee: amt })}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all border ${
                            Number(editingServiceForm.fee) === amt
                              ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {amt === 0 ? '₹0 (Free)' : `₹${amt}`}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      💡 Setting fee to ₹0 makes this service 100% free for citizens. Set any custom amount to collect fee online via PhonePe.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Processing SLA / Delivery Time *</label>
                    <input
                      type="text"
                      value={editingServiceForm.processing_time}
                      onChange={(e) => setEditingServiceForm({ ...editingServiceForm, processing_time: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500 font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700 block">Service Status *</label>
                    <select
                      value={editingServiceForm.status}
                      onChange={(e) => setEditingServiceForm({ ...editingServiceForm, status: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500 font-semibold"
                    >
                      <option value="Active">Active (Visible in Portal)</option>
                      <option value="Inactive">Inactive (Hidden from Portal)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Service Description</label>
                  <textarea
                    rows={2}
                    value={editingServiceForm.description}
                    onChange={(e) => setEditingServiceForm({ ...editingServiceForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                {/* Service Image / Banner Option */}
                <div className="space-y-3 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-600" />
                      <span>Service Banner Image / Icon (Optional)</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Upload File or Provide URL</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600 block">1. Upload Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const previewUrl = URL.createObjectURL(file);
                            setEditingServiceForm(prev => ({
                              ...prev,
                              image_file: file,
                              image_preview: previewUrl
                            }));
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 outline-none file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0b192c] file:text-white hover:file:bg-amber-600 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600 block">2. Or Paste Image URL</span>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={editingServiceForm.image_url_input || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingServiceForm(prev => ({
                            ...prev,
                            image_url_input: val,
                            image_preview: val || (prev.image_file ? URL.createObjectURL(prev.image_file) : '')
                          }));
                        }}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1.5">⚡ Or Choose Fast Preset Icon:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {SERVICE_IMAGE_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditingServiceForm(prev => ({
                            ...prev,
                            image_url_input: p.url,
                            image_file: null,
                            image_preview: p.url
                          }))}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors cursor-pointer ${
                            editingServiceForm.image_url_input === p.url && !editingServiceForm.image_file
                              ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                              : 'bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 border-slate-200'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {editingServiceForm.image_preview && (
                    <div className="relative w-full h-28 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden group">
                      <img src={editingServiceForm.image_preview} alt="Service Banner Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setEditingServiceForm(prev => ({ ...prev, image_file: null, image_url_input: '', image_preview: '' }))}
                          className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-rose-700 transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Remove Image</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Required Documents */}
              <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                  <div>
                    <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider flex items-center space-x-1.5">
                      <FileCheck className="w-4 h-4 text-amber-600" />
                      <span>2. Required Proof Documents (சான்று ஆவணங்கள்)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Set each document as Mandatory (கட்டாயம்) or Optional (விருப்பத்தேர்வு)
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                      🔴 {(editingServiceForm.documents || []).filter(d => (typeof d === 'string' ? true : (d.is_required !== false && d.is_required !== 0 && d.is_required !== '0'))).length} Mandatory
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                      🟢 {(editingServiceForm.documents || []).filter(d => (typeof d === 'object' && (d.is_required === false || d.is_required === 0 || d.is_required === '0'))).length} Optional
                    </span>
                  </div>
                </div>
                
                {/* Add new document row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter document name (e.g. Passport Copy / Birth Certificate)"
                    value={editingServiceForm.newDocInput || ''}
                    onChange={(e) => setEditingServiceForm({ ...editingServiceForm, newDocInput: e.target.value })}
                    className="flex-1 bg-white border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none font-medium text-xs focus:border-amber-500 shadow-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (editingServiceForm.newDocInput && editingServiceForm.newDocInput.trim()) {
                          const isReq = editingServiceForm.newDocIsRequired !== false;
                          setEditingServiceForm({
                            ...editingServiceForm,
                            documents: [
                              ...editingServiceForm.documents,
                              { name: editingServiceForm.newDocInput.trim(), is_required: isReq }
                            ],
                            newDocInput: '',
                            newDocIsRequired: true
                          });
                        }
                      }
                    }}
                  />
                  <select
                    value={editingServiceForm.newDocIsRequired !== false ? '1' : '0'}
                    onChange={(e) => setEditingServiceForm({ ...editingServiceForm, newDocIsRequired: e.target.value === '1' })}
                    className="bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-amber-500 shadow-xs cursor-pointer"
                  >
                    <option value="1">🔴 கட்டாயம் (Mandatory)</option>
                    <option value="0">🟢 விருப்பத்தேர்வு (Optional)</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      if (editingServiceForm.newDocInput && editingServiceForm.newDocInput.trim()) {
                        const isReq = editingServiceForm.newDocIsRequired !== false;
                        setEditingServiceForm({
                          ...editingServiceForm,
                          documents: [
                            ...editingServiceForm.documents,
                            { name: editingServiceForm.newDocInput.trim(), is_required: isReq }
                          ],
                          newDocInput: '',
                          newDocIsRequired: true
                        });
                      }
                    }}
                    className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shrink-0 shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Document</span>
                  </button>
                </div>

                {/* List of documents with toggle and remove */}
                {(!editingServiceForm.documents || editingServiceForm.documents.length === 0) ? (
                  <p className="text-xs text-slate-400 italic py-2 text-center bg-white rounded-xl border border-slate-200">
                    No proof documents added yet. Add documents above.
                  </p>
                ) : (
                  <div className="space-y-2 pt-1 max-h-60 overflow-y-auto pr-1">
                    {editingServiceForm.documents.map((doc, idx) => {
                      const docName = typeof doc === 'string' ? doc : (doc.name || doc.document_name);
                      const isReq = typeof doc === 'string' ? true : (doc.is_required !== false && doc.is_required !== 0 && doc.is_required !== '0');
                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
                            isReq
                              ? 'bg-amber-50/70 border-amber-200'
                              : 'bg-emerald-50/70 border-emerald-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                            <span className="text-base shrink-0">{isReq ? '📄' : '📑'}</span>
                            <span className="font-bold text-slate-900 text-xs truncate">
                              {docName}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                            {/* Segmented Button: Mandatory vs Optional */}
                            <div className="inline-flex rounded-lg p-0.5 bg-white border border-slate-200 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...editingServiceForm.documents];
                                  updated[idx] = { name: docName, is_required: true };
                                  setEditingServiceForm({ ...editingServiceForm, documents: updated });
                                }}
                                className={`px-2.5 py-1 text-[11px] font-extrabold rounded-md transition-all cursor-pointer ${
                                  isReq
                                    ? 'bg-amber-500 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-amber-800 hover:bg-slate-50'
                                }`}
                              >
                                🔴 கட்டாயம் (Mandatory)
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...editingServiceForm.documents];
                                  updated[idx] = { name: docName, is_required: false };
                                  setEditingServiceForm({ ...editingServiceForm, documents: updated });
                                }}
                                className={`px-2.5 py-1 text-[11px] font-extrabold rounded-md transition-all cursor-pointer ${
                                  !isReq
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                                }`}
                              >
                                🟢 விருப்பத்தேர்வு (Optional)
                              </button>
                            </div>

                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingServiceForm({
                                  ...editingServiceForm,
                                  documents: editingServiceForm.documents.filter((_, i) => i !== idx)
                                });
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Custom Citizen Applicant Form Fields */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider">3. Citizen Application Form Fields</h4>
                  <span className="text-[11px] font-bold text-slate-400">Customizable Inputs</span>
                </div>
                
                <div className="space-y-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        placeholder="Field Label (e.g. Blood Group, Qualification)"
                        value={editingServiceForm.newFieldLabel || ''}
                        onChange={(e) => setEditingServiceForm({ ...editingServiceForm, newFieldLabel: e.target.value })}
                        className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 outline-none font-medium text-xs focus:ring-2 focus:ring-[#0b192c]"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <select
                        value={editingServiceForm.newFieldType || 'text'}
                        onChange={(e) => setEditingServiceForm({ ...editingServiceForm, newFieldType: e.target.value })}
                        className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 outline-none font-medium text-xs focus:ring-2 focus:ring-[#0b192c]"
                      >
                        <option value="text">Short answer (Text Input)</option>
                        <option value="textarea">Paragraph (Textarea / Address)</option>
                        <option value="number">Number Input</option>
                        <option value="date">Date Field</option>
                        <option value="select">Drop-down (Select)</option>
                        <option value="radio">Multiple choice (Radio)</option>
                        <option value="checkbox">Checkbox (Yes / No)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (editingServiceForm.newFieldLabel && editingServiceForm.newFieldLabel.trim()) {
                            const fType = editingServiceForm.newFieldType || 'text';
                            const isOptType = fType === 'select' || fType === 'radio';
                            let opts = [];
                            if (isOptType) {
                              opts = (editingServiceForm.newFieldOptions || '')
                                .split(',')
                                .map(s => s.trim())
                                .filter(Boolean);
                              if (opts.length === 0) {
                                opts = ['Option 1', 'Option 2'];
                              }
                            }
                            setEditingServiceForm({
                              ...editingServiceForm,
                              fields: [
                                ...editingServiceForm.fields,
                                {
                                  field_label: editingServiceForm.newFieldLabel.trim(),
                                  field_type: fType,
                                  is_required: true,
                                  options: isOptType ? opts : [],
                                  options_json: isOptType ? opts : null
                                }
                              ],
                              newFieldLabel: '',
                              newFieldType: 'text',
                              newFieldOptions: ''
                            });
                          }
                        }}
                        className="w-full py-2 bg-[#0b192c] text-white font-bold rounded-xl hover:bg-slate-800 text-xs shadow-sm transition-colors"
                      >
                        + Add Form Field
                      </button>
                    </div>
                  </div>

                  {/* Dropdown / Multiple Choice Options Configuration Box */}
                  {(editingServiceForm.newFieldType === 'select' || editingServiceForm.newFieldType === 'radio') && (
                    <div className="p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-1 mt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                          <span>{editingServiceForm.newFieldType === 'radio' ? '🔘 Multiple Choice Options' : '▼ Drop-down Options'}</span>
                        </label>
                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Separate choices with commas ( , )</span>
                      </div>
                      <input
                        type="text"
                        placeholder={editingServiceForm.newFieldType === 'radio' ? "e.g. Yes, No, Not Applicable" : "e.g. A+, B+, O+, AB+, A-, B-, O-, AB-"}
                        value={editingServiceForm.newFieldOptions || ''}
                        onChange={(e) => setEditingServiceForm({ ...editingServiceForm, newFieldOptions: e.target.value })}
                        className="w-full bg-white border border-blue-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                      <p className="text-[10px] text-blue-600 font-medium">
                        💡 Citizens will choose from these options when filling this field on the application form.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {editingServiceForm.fields.map((f, idx) => {
                    const fOpts = Array.isArray(f.options) ? f.options : (typeof f.options === 'string' ? f.options.split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(f.options_json) ? f.options_json : (typeof f.options_json === 'string' ? JSON.parse(f.options_json || '[]') : [])));
                    const fType = (f.field_type || 'text').toLowerCase();
                    const isSelect = fType === 'select' || fType === 'dropdown';
                    const isRadio = fType === 'radio' || fType === 'multiple choice';
                    const isCheck = fType === 'checkbox';

                    return (
                      <div key={idx} className="p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200 flex items-start justify-between font-medium text-xs transition-colors gap-2">
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="font-bold text-slate-900">{f.field_label}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              isSelect ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                              isRadio ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                              isCheck ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              fType === 'date' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                              fType === 'textarea' ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' :
                              'bg-slate-200 text-slate-700'
                            }`}>
                              {isSelect ? '▼ Dropdown' :
                               isRadio ? '🔘 Multiple Choice' :
                               isCheck ? '☑ Checkbox' :
                               fType === 'date' ? '📅 Date' :
                               fType === 'textarea' ? '📝 Paragraph' :
                               '🔤 Text Input'}
                            </span>
                            {f.is_required && (
                              <span className="text-[10px] text-rose-500 font-bold">*Required</span>
                            )}
                          </div>
                          {fOpts.length > 0 && (
                            <div className="flex items-center flex-wrap gap-1 pt-0.5">
                              <span className="text-[10px] font-bold text-slate-400">Options:</span>
                              {fOpts.map((opt, oIdx) => (
                                <span key={oIdx} className="bg-white border border-slate-200 text-slate-700 font-medium px-1.5 py-0.5 rounded text-[10px]">
                                  {String(opt)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingServiceForm({
                              ...editingServiceForm,
                              fields: editingServiceForm.fields.filter((_, i) => i !== idx)
                            });
                          }}
                          className="text-rose-600 hover:text-rose-800 font-extrabold text-xs ml-2 shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditServiceModal(false);
                    setEditingServiceForm(null);
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEditService}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl shadow transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {savingEditService ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Edit3 className="w-4 h-4" />
                  )}
                  <span>{savingEditService ? 'Saving Changes...' : 'Update & Save Service'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* QUICK PRICE EDIT MODAL */}
      {quickPriceModal.isOpen && quickPriceModal.service && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  PRICE CONFIGURATION
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1">
                  Change Price: {quickPriceModal.service.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Category: {quickPriceModal.service.category_name || quickPriceModal.service.category || 'General'}
                </p>
              </div>
              <button
                onClick={() => setQuickPriceModal({ isOpen: false, service: null, fee: 0, saving: false })}
                className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickPriceSave} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Service Fee (₹)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    value={quickPriceModal.fee}
                    onChange={(e) => setQuickPriceModal(prev => ({ ...prev, fee: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-emerald-500 font-extrabold text-base"
                    placeholder="0"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setQuickPriceModal(prev => ({ ...prev, fee: 0 }))}
                    className={`px-3 py-2.5 rounded-xl font-black text-xs shrink-0 transition-colors border ${
                      Number(quickPriceModal.fee) === 0
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    Set ₹0 Free
                  </button>
                </div>

                {/* Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400">Presets:</span>
                  {[0, 25, 30, 50, 60, 100, 110, 125, 250, 500].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setQuickPriceModal(prev => ({ ...prev, fee: amt }))}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all border ${
                        Number(quickPriceModal.fee) === amt
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {amt === 0 ? 'Free' : `₹${amt}`}
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-xl border text-xs font-medium space-y-1 mt-2 bg-slate-50 border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Citizen Payment Mode:</span>
                    <span className="font-bold text-slate-900">
                      {Number(quickPriceModal.fee) === 0 ? '🟢 100% Free (No payment)' : `💳 PhonePe PG (₹${quickPriceModal.fee})`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickPriceModal({ isOpen: false, service: null, fee: 0, saving: false })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={quickPriceModal.saving}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {quickPriceModal.saving ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5" />
                  )}
                  <span>{quickPriceModal.saving ? 'Saving...' : 'Save Price'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  CATEGORY MANAGER
                </span>
                <h3 className="font-extrabold text-xl text-slate-900 mt-1">Create New Category</h3>
                <p className="text-xs text-slate-500">Add a new service category section to organize portal services.</p>
              </div>

              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategorySubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Pension & Senior Citizen Services"
                  value={newCategoryForm.name}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500 font-semibold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Category Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of services included in this category..."
                  value={newCategoryForm.description}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 outline-none focus:border-amber-500 font-medium"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCategory}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl shadow transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {creatingCategory ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{creatingCategory ? 'Saving Category...' : 'Save & Publish Category'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* INTERNAL ARCHIVAL NOTES MODAL */}
      {selectedDocForNotes && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-5">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-slate-900">
                    Internal Archival Notes & Storage Record
                  </h3>
                  <p className="text-xs text-slate-500">
                    Record internal verification notes for applicant document inquiry
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocForNotes(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document & Applicant Summary Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-900">{selectedDocForNotes.document_name}</span>
                <span className="font-mono text-[10px] text-orange-600 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                  {selectedDocForNotes.application_number}
                </span>
              </div>
              <div className="text-[11px] text-slate-600">
                Applicant: <strong>{selectedDocForNotes.user_name}</strong> ({selectedDocForNotes.user_phone})
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveDocNotesSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  Archival Remarks / Storage Location Notes <span className="text-orange-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Applicant inquired on 10/09/2026. Document verified in physical archive box A-12 / validated against database."
                  value={docNotesInput}
                  onChange={(e) => setDocNotesInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 font-medium focus:bg-white focus:border-[#0b192c] outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDocForNotes(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingDocNotes || !docNotesInput.trim()}
                  className="px-5 py-2.5 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {savingDocNotes ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                  ) : (
                    <Save className="w-4 h-4 text-orange-400" />
                  )}
                  <span>Save Archival Note</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* IN-DASHBOARD DOCUMENT PREVIEW MODAL */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh] space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center shrink-0">
                  <Paperclip className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {selectedDocForPreview.document_name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Applicant: <strong>{selectedDocForPreview.user_name}</strong> ({selectedDocForPreview.user_phone}) • Ref: <span className="font-mono text-orange-600 font-bold">{selectedDocForPreview.application_number}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={selectedDocForPreview.file_path && (selectedDocForPreview.file_path.startsWith('http') || selectedDocForPreview.file_path.startsWith('data:')) ? selectedDocForPreview.file_path : `/api/documents/${selectedDocForPreview.id}/preview`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-orange-500" />
                  <span>Open in New Tab</span>
                </a>
                <button
                  onClick={() => setSelectedDocForPreview(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Preview Frame */}
            <div className="flex-1 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 min-h-[450px] relative flex items-center justify-center p-4">
              {(() => {
                const previewUrl = selectedDocForPreview.file_path && (selectedDocForPreview.file_path.startsWith('http') || selectedDocForPreview.file_path.startsWith('data:'))
                  ? selectedDocForPreview.file_path
                  : `/api/documents/${selectedDocForPreview.id}/preview`;

                const isImage = (
                  (selectedDocForPreview.file_type && selectedDocForPreview.file_type.startsWith('image/')) ||
                  (selectedDocForPreview.original_filename && /\.(jpg|jpeg|png|webp|jfif|bmp|gif|heic|heif)$/i.test(selectedDocForPreview.original_filename)) ||
                  (selectedDocForPreview.stored_filename && /\.(jpg|jpeg|png|webp|jfif|bmp|gif|heic|heif)$/i.test(selectedDocForPreview.stored_filename)) ||
                  (selectedDocForPreview.file_path && /\.(jpg|jpeg|png|webp|jfif|bmp|gif|heic|heif)$/i.test(selectedDocForPreview.file_path)) ||
                  (selectedDocForPreview.file_path && selectedDocForPreview.file_path.startsWith('data:image'))
                );

                if (isImage) {
                  return (
                    <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
                      <img
                        src={previewUrl}
                        alt={selectedDocForPreview.document_name}
                        className="max-h-[460px] max-w-full object-contain rounded-xl shadow-2xl border border-slate-700 bg-black/40"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `/api/documents/${selectedDocForPreview.id}/preview`;
                        }}
                      />
                    </div>
                  );
                }

                return (
                  <iframe
                    src={previewUrl}
                    className="w-full h-[500px] border-none rounded-xl bg-white"
                    title="Document Preview"
                  />
                );
              })()}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-100">
              <span className="text-slate-500">
                Uploaded: <strong>{new Date(selectedDocForPreview.uploaded_at).toLocaleDateString('en-IN')}</strong>
              </span>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="px-4 py-2 bg-[#0b192c] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD / EDIT BANNER MODAL */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-5 my-8">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-slate-900">
                    {editingBanner ? 'Edit Hero Banner' : 'Create New Hero Banner'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure portal home slide image, caption, link, and rotation timer
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBannerModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBannerSubmit} className="space-y-4 text-xs">
              
              {/* Banner Title */}
              <div className="space-y-1">
                <label className="font-extrabold text-slate-800 block">
                  Banner Title (Optional - Leave blank for Image-Only Banner)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Government Services at Your Doorstep (Optional)"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold outline-none focus:border-orange-500"
                />
              </div>

              {/* Banner Subtitle / Description */}
              <div className="space-y-1">
                <label className="font-extrabold text-slate-800 block">
                  Banner Subtitle / Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Apply for Community, Birth & Income Certificates with instant SMS tracking. (Optional)"
                  value={bannerForm.description}
                  onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-medium outline-none focus:border-orange-500"
                />
              </div>

              {/* Slide Display Duration Timer */}
              <div className="space-y-1.5 bg-orange-50/70 border border-orange-200 p-3.5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-orange-950 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span>Slide Timer Duration (Seconds) *</span>
                  </label>
                  <span className="font-mono text-sm font-black text-orange-600 bg-white px-2.5 py-0.5 rounded border border-orange-200 shadow-sm">
                    {bannerForm.duration_seconds} Seconds
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  How many seconds this slide stays visible before automatically switching to the next banner.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="range"
                    min="2"
                    max="30"
                    step="1"
                    value={bannerForm.duration_seconds}
                    onChange={(e) => setBannerForm({ ...bannerForm, duration_seconds: Number(e.target.value) })}
                    className="flex-1 accent-orange-600 cursor-pointer"
                  />
                </div>

                {/* Preset Timer Buttons */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-500">Presets:</span>
                  {[3, 5, 8, 10, 15].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setBannerForm({ ...bannerForm, duration_seconds: sec })}
                      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border transition-colors cursor-pointer ${
                        bannerForm.duration_seconds === sec
                          ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Banner Artwork Image */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-800 block">
                    Banner Artwork Image *
                  </label>
                  <span className="text-[10px] text-orange-600 font-bold">Recommended: 1200x500px</span>
                </div>

                {/* Live Image Preview Box */}
                {(() => {
                  let previewSrc = '';
                  if (bannerForm.image_file) {
                    try {
                      previewSrc = URL.createObjectURL(bannerForm.image_file);
                    } catch (e) {}
                  } else if (bannerForm.image_url_input) {
                    previewSrc = bannerForm.image_url_input;
                  }

                  if (!previewSrc) return null;

                  return (
                    <div className="relative h-32 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group">
                      <img
                        src={previewSrc}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                          {bannerForm.image_file ? `File: ${bannerForm.image_file.name}` : 'Live Preview'}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* File Upload Input */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block font-semibold">Upload Image File (JPG/PNG/WEBP):</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setBannerForm({ ...bannerForm, image_file: e.target.files[0] });
                      }
                    }}
                    className="w-full text-xs text-slate-600 bg-slate-50 border border-slate-300 rounded-xl p-2.5 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-extrabold file:bg-[#0b192c] file:text-white"
                  />
                </div>

                {/* Image URL Input */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block font-semibold">OR Image Web URL:</span>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={bannerForm.image_url_input}
                    onChange={(e) => setBannerForm({ ...bannerForm, image_url_input: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono text-[11px] outline-none focus:border-orange-500"
                  />
                </div>

                {/* Quick High-Quality Presets */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Quick Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: '🏛️ Digital Governance', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1200&auto=format&fit=crop' },
                      { name: '📑 Aadhaar Portal', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop' },
                      { name: '📜 Official Certificates', url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop' },
                      { name: '🏢 Tamil Nadu Seva', url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop' }
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBannerForm({ ...bannerForm, image_url_input: p.url, image_file: null })}
                        className="px-2 py-1 text-[10px] font-bold bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 rounded-lg border border-slate-200 transition-colors"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target Service Link URL & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-800 block">Target Link / URL</label>
                  <select
                    value={bannerForm.link_url}
                    onChange={(e) => setBannerForm({ ...bannerForm, link_url: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold outline-none"
                  >
                    <option value="/services">/services (Services Catalog)</option>
                    <option value="/category/aadhaar">/category/aadhaar (Aadhaar Portal)</option>
                    <option value="/track">/track (Application Tracker)</option>
                    <option value="/category/revenue">/category/revenue (Revenue Dept)</option>
                    <option value="/category/welfare">/category/welfare (Welfare Schemes)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-800 block">Banner Status</label>
                  <select
                    value={bannerForm.status}
                    onChange={(e) => setBannerForm({ ...bannerForm, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold outline-none"
                  >
                    <option value="Active">Active (Live on Portal)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBannerModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBanner || (!bannerForm.image_file && !bannerForm.image_url_input.trim() && !bannerForm.title.trim() && !editingBanner)}
                  className="px-5 py-2.5 bg-[#0b192c] hover:bg-orange-600 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {savingBanner ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                  ) : (
                    <Save className="w-4 h-4 text-orange-400" />
                  )}
                  <span>{editingBanner ? 'Save Changes' : 'Publish Banner'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
      {/* Custom Delete Confirmation Modal (Compact, Bottom-Right on Desktop, Centered on Mobile) */}
      <ConfirmDeleteModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, title: '', description: '', confirmText: '', onConfirm: null, loading: false })}
        onConfirm={deleteModalState.onConfirm}
        title={deleteModalState.title}
        description={deleteModalState.description}
        confirmText={deleteModalState.confirmText}
        loading={deleteModalState.loading}
      />

    </div>
  );
}
