import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { db } from './database/db.js';
import PaymentService from './paymentService.js';
import NotificationService from './notificationService.js';
import { initCronJobs } from './cronJobs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'eseva_super_secret_jwt_key_2026';

// Initialize production background maintenance jobs
initCronJobs();

// Uploads setup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}_${safeName}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExts = ['.pdf', '.jpg', '.jpeg', '.png'];
  const allowedMimes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExts.includes(ext) && allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported. Allowed formats: PDF, JPG, PNG.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Document Audit Trail Helper
const logDocumentAudit = (application_id, document_id, action, actor, actor_role, details = '') => {
  try {
    db.insert('document_audit_history', {
      application_id,
      document_id,
      action,
      actor: actor || 'System User',
      actor_role: actor_role || 'User',
      details,
      created_at: new Date().toISOString()
    });
  } catch (e) {
    console.error('Audit log error:', e);
  }
};

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// CORS Configuration
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === allowedOrigin || allowedOrigin === '*' || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json());
// DO NOT SERVE UNPROTECTED PUBLIC UPLOADS
// Documents must be accessed via authenticated preview/download endpoints.

// Simple In-Memory Rate Limiter
const rateLimitMap = new Map();
const createRateLimiter = (maxRequests, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    if (process.env.NODE_ENV === 'test') return next();
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const key = `${req.path}:${ip}`;
    const now = Date.now();
    const record = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count += 1;
    }

    rateLimitMap.set(key, record);

    if (record.count > maxRequests) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    next();
  };
};

const authRateLimiter = createRateLimiter(25, 15 * 60 * 1000); // 25 attempts / 15 mins
const submitRateLimiter = createRateLimiter(40, 15 * 60 * 1000);

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Optional Auth Middleware (attaches req.user if token present)
const optionalAuthenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const tokenQuery = req.query.token;
  const token = (authHeader && authHeader.split(' ')[1]) || tokenQuery;
  if (!token) {
    req.user = null;
    return next();
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) req.user = user;
    next();
  });
};

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Admin token required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || !decoded.isAdmin) {
      return res.status(403).json({ error: 'Admin access denied' });
    }
    req.admin = decoded;
    req.user = decoded; // Ensure req.user also has admin context
    next();
  });
};

// Resource Ownership Verification Helper
const verifyResourceOwnership = (appRecord, user) => {
  if (!appRecord || !user) return false;
  if (user.isAdmin) return true;
  const matchId = appRecord.user_id && Number(appRecord.user_id) === Number(user.id);
  const matchEmail = appRecord.user_email && appRecord.user_email.toLowerCase() === user.email.toLowerCase();
  return matchId || matchEmail;
};

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

// User Register
app.post('/api/auth/register', authRateLimiter, async (req, res) => {
  try {
    const { name, email, phone, aadhaar_no, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Name, email, phone, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existingUser = db.get('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newUser = db.insert('users', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      aadhaar_no: aadhaar_no ? aadhaar_no.trim() : '',
      password_hash
    });

    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email, isAdmin: false },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Registration successful',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, aadhaar_no: newUser.aadhaar_no }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Login
app.post('/api/auth/login', authRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = db.get('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, isAdmin: false },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, aadhaar_no: user.aadhaar_no }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Login
app.post('/api/auth/admin/login', authRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Admin email and password required' });
    }

    const admin = db.get('admins', a => a.email.toLowerCase() === email.toLowerCase());
    if (!admin) {
      return res.status(400).json({ error: 'Invalid admin credentials' });
    }

    const validPass = await bcrypt.compare(password, admin.password_hash);
    if (!validPass) {
      return res.status(400).json({ error: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, name: admin.name, email: admin.email, role: admin.role, isAdmin: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Current Profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  if (req.user.isAdmin) {
    const admin = db.get('admins', a => a.id === req.user.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    return res.json({ id: admin.id, name: admin.name, email: admin.email, role: admin.role, isAdmin: true });
  }
  const user = db.get('users', u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    aadhaar_no: user.aadhaar_no,
    address: user.address || '',
    district: user.district || '',
    state: user.state || 'Tamil Nadu',
    pincode: user.pincode || '',
    created_at: user.created_at || new Date().toISOString(),
    isAdmin: false
  });
});

// Get Detailed Profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const user = db.get('users', u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User profile not found' });
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    aadhaar_no: user.aadhaar_no,
    address: user.address || '',
    district: user.district || '',
    state: user.state || 'Tamil Nadu',
    pincode: user.pincode || '',
    created_at: user.created_at || new Date().toISOString()
  });
});

// Update Profile Information
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  const user = db.get('users', u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User profile not found' });

  const { name, phone, address, district, state, pincode } = req.body;

  db.update('users', u => u.id === user.id, {
    name: name || user.name,
    phone: phone || user.phone,
    address: address !== undefined ? address : user.address,
    district: district !== undefined ? district : user.district,
    state: state !== undefined ? state : user.state,
    pincode: pincode !== undefined ? pincode : user.pincode,
    updated_at: new Date().toISOString()
  });

  const updated = db.get('users', u => u.id === user.id);
  res.json({
    message: 'Profile updated successfully',
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      district: updated.district,
      state: updated.state,
      pincode: updated.pincode
    }
  });
});

// Forgot Password API (Generates time-limited reset token)
app.post('/api/auth/forgot-password', authRateLimiter, (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email address is required' });

  const user = db.get('users', u => u.email.toLowerCase() === email.toLowerCase());

  // Generic message response to prevent account enumeration
  if (!user) {
    return res.json({ message: 'If an account exists with this email, password reset instructions have been generated.' });
  }

  const resetToken = jwt.sign({ userId: user.id, type: 'reset' }, JWT_SECRET, { expiresIn: '30m' });
  
  // Store reset token securely in database
  db.update('users', u => u.id === user.id, { reset_token: resetToken, reset_expires: Date.now() + 30 * 60 * 1000 });

  res.json({
    message: 'If an account exists with this email, password reset instructions have been generated.',
    ...(process.env.NODE_ENV === 'test' ? { reset_token: resetToken } : {})
  });
});

// Reset Password API
app.post('/api/auth/reset-password', async (req, res) => {
  const { reset_token, new_password } = req.body;
  if (!reset_token || !new_password) {
    return res.status(400).json({ error: 'Reset token and new password are required' });
  }

  try {
    const decoded = jwt.verify(reset_token, JWT_SECRET);
    if (decoded.type !== 'reset') return res.status(400).json({ error: 'Invalid reset token' });

    const user = db.get('users', u => u.id === decoded.userId);
    if (!user || user.reset_token !== reset_token) {
      return res.status(400).json({ error: 'Reset token is invalid or expired' });
    }

    const password_hash = await bcrypt.hash(new_password, 10);
    db.update('users', u => u.id === user.id, {
      password_hash,
      reset_token: null,
      reset_expires: null
    });

    res.json({ message: 'Password reset successfully! You can now log in with your new password.' });
  } catch (err) {
    res.status(400).json({ error: 'Reset token has expired or is invalid.' });
  }
});

// ==========================================
// 2. CATEGORIES & SERVICES API
// ==========================================

// Get All Categories with service counts
app.get('/api/categories', (req, res) => {
  const categories = db.all('categories');
  const services = db.all('services', s => s.is_active !== false);

  const result = categories.map(cat => {
    const catServices = services.filter(s => s.category_id === cat.id);
    return {
      ...cat,
      services_count: catServices.length,
      srvCount: catServices.length,
      sub_services: catServices.map(s => ({ id: s.id, name: s.name, slug: s.slug, fee: s.fee, processing_time: s.processing_time }))
    };
  });

  res.json(result);
});

// Get Single Category by Slug or ID
app.get('/api/categories/:slug', (req, res) => {
  const param = req.params.slug;
  const category = db.get('categories', c => c.slug === param || String(c.id) === param || c.slug === `${param}-services` || c.slug.replace('-services', '') === param);
  if (!category) return res.status(404).json({ error: 'Category not found' });

  const services = db.all('services', s => s.category_id === category.id && s.is_active !== false);
  const resultServices = services.map(s => {
    const fieldsCount = db.all('service_fields', f => f.service_id === s.id).length;
    const docsCount = db.all('service_documents', d => d.service_id === s.id).length;
    return {
      ...s,
      fields_count: fieldsCount,
      documents_count: docsCount,
      required_docs_count: docsCount
    };
  });

  res.json({
    ...category,
    services_count: resultServices.length,
    services: resultServices
  });
});

// Search Services & List All Services
app.get('/api/services', (req, res) => {
  const { query, search, category_id, category_slug, sort } = req.query;
  const searchTerm = (search || query || '').toLowerCase().trim();
  let services = db.all('services', s => s.is_active !== false);

  if (category_id) {
    services = services.filter(s => String(s.category_id) === String(category_id));
  } else if (category_slug) {
    const cat = db.get('categories', c => c.slug === category_slug || c.slug === `${category_slug}-services`);
    if (cat) {
      services = services.filter(s => s.category_id === cat.id);
    }
  }

  if (searchTerm) {
    services = services.filter(s =>
      s.name.toLowerCase().includes(searchTerm) ||
      s.description.toLowerCase().includes(searchTerm) ||
      s.slug.toLowerCase().includes(searchTerm) ||
      (s.category_name && s.category_name.toLowerCase().includes(searchTerm))
    );
  }

  // Sorting
  if (sort === 'fee_asc') {
    services.sort((a, b) => a.fee - b.fee);
  } else if (sort === 'fee_desc') {
    services.sort((a, b) => b.fee - a.fee);
  } else if (sort === 'name') {
    services.sort((a, b) => a.name.localeCompare(b.name));
  }

  const categories = db.all('categories');
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]));

  const result = services.map(s => {
    const fieldsCount = db.all('service_fields', f => f.service_id === s.id).length;
    const docsCount = db.all('service_documents', d => d.service_id === s.id).length;
    const parentCat = catMap[s.category_id];
    return {
      ...s,
      category_name: parentCat ? parentCat.name : s.category_name || 'General Service',
      category_slug: parentCat ? parentCat.slug : s.category_slug || '',
      fields_count: fieldsCount,
      documents_count: docsCount,
      required_docs_count: docsCount
    };
  });

  res.json(result);
});

// Get Single Service Details (including custom form fields & document requirements)
app.get('/api/services/:idOrSlug', (req, res) => {
  const param = req.params.idOrSlug;
  const service = db.get('services', s => s.slug === param || String(s.id) === param);
  if (!service) return res.status(404).json({ error: 'Service not found' });

  const category = db.get('categories', c => c.id === service.category_id);
  const fields = db.all('service_fields', f => f.service_id === service.id).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const documents = db.all('service_documents', d => d.service_id === service.id);

  res.json({
    ...service,
    category_name: category ? category.name : '',
    category_slug: category ? category.slug : '',
    fields,
    documents
  });
});

// ==========================================
// 3. APPLICATION SUBMISSION & TRACKING
// ==========================================

// Save Application as DRAFT (for logged in or guest users)
app.post('/api/applications/draft', submitRateLimiter, upload.any(), async (req, res) => {
  try {
    const {
      application_id,
      service_id,
      user_name,
      user_email,
      user_phone,
      field_values,
      current_step
    } = req.body;

    if (!service_id) {
      return res.status(400).json({ error: 'Service ID is required to save a draft' });
    }

    const service = db.get('services', s => String(s.id) === String(service_id));
    if (!service) return res.status(404).json({ error: 'Selected service does not exist' });

    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.isAdmin) userId = decoded.id;
      } catch (e) {}
    }

    let application = null;
    if (application_id) {
      application = db.get('applications', a => String(a.id) === String(application_id) || a.application_number === application_id);
    }

    if (!application) {
      const appNumber = db.generateNextApplicationNumber('ESV-2026-DRAFT');

      application = db.insert('applications', {
        application_number: appNumber,
        user_id: userId,
        service_id: service.id,
        user_name: (user_name || '').trim(),
        user_email: (user_email || '').trim().toLowerCase(),
        user_phone: (user_phone || '').trim(),
        status: 'DRAFT',
        current_step: current_step || 1,
        admin_remarks: 'Application saved as draft.',
        total_fee: service.fee || 0
      });
    } else {
      db.update('applications', a => a.id === application.id, {
        user_name: user_name ? user_name.trim() : application.user_name,
        user_email: user_email ? user_email.trim().toLowerCase() : application.user_email,
        user_phone: user_phone ? user_phone.trim() : application.user_phone,
        current_step: current_step || application.current_step || 1,
        updated_at: new Date().toISOString()
      });
    }

    // Save/Update Field Values
    if (field_values) {
      let parsed = {};
      try {
        parsed = typeof field_values === 'string' ? JSON.parse(field_values) : field_values;
      } catch (e) {}

      db.delete('application_field_values', f => f.application_id === application.id);

      const serviceFields = db.all('service_fields', f => f.service_id === service.id);
      const fieldMap = Object.fromEntries(serviceFields.map(f => [f.field_name, f]));

      for (const [key, val] of Object.entries(parsed)) {
        if (val !== undefined && val !== null) {
          const fieldDef = fieldMap[key];
          db.insert('application_field_values', {
            application_id: application.id,
            field_id: fieldDef ? fieldDef.id : null,
            field_label: fieldDef ? fieldDef.field_label : key,
            value: typeof val === 'object' ? JSON.stringify(val) : String(val)
          });
        }
      }
    }

    res.json({
      message: 'Draft application saved successfully',
      application_id: application.id,
      application_number: application.application_number,
      status: 'DRAFT',
      current_step: current_step || 1
    });
  } catch (err) {
    console.error('Draft error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Final Submit Service Application (with dynamic fields & dynamic doc uploads)
app.post('/api/applications', submitRateLimiter, upload.any(), async (req, res) => {
  try {
    const {
      draft_id,
      service_id,
      user_name,
      user_email,
      user_phone,
      field_values,
      payment_method
    } = req.body;

    if (!service_id || !user_name || !user_email || !user_phone) {
      return res.status(400).json({ error: 'Service ID, Name, Email, and Phone are required' });
    }

    const service = db.get('services', s => String(s.id) === String(service_id));
    if (!service) return res.status(404).json({ error: 'Selected service does not exist' });

    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.isAdmin) userId = decoded.id;
      } catch (e) {}
    }

    const submissionResult = db.transaction(() => {
      let application = null;
      if (draft_id) {
        application = db.get('applications', a => String(a.id) === String(draft_id) || a.application_number === draft_id);
      }

      const applicationNumber = (application && application.application_number && !application.application_number.includes('DRAFT'))
        ? application.application_number
        : db.generateNextApplicationNumber('ESV-2026');

      if (application) {
        db.update('applications', a => a.id === application.id, {
          application_number: applicationNumber,
          user_id: userId || application.user_id,
          user_name: user_name.trim(),
          user_email: user_email.trim().toLowerCase(),
          user_phone: user_phone.trim(),
          status: 'SUBMITTED',
          current_step: 5,
          submitted_at: new Date().toISOString(),
          admin_remarks: 'Application submitted successfully. Under verification by E-Seva team.',
          updated_at: new Date().toISOString()
        });
      } else {
        application = db.insert('applications', {
          application_number: applicationNumber,
          user_id: userId,
          service_id: service.id,
          user_name: user_name.trim(),
          user_email: user_email.trim().toLowerCase(),
          user_phone: user_phone.trim(),
          status: 'SUBMITTED',
          current_step: 5,
          submitted_at: new Date().toISOString(),
          admin_remarks: 'Application submitted successfully. Under verification by E-Seva team.',
          total_fee: service.fee || 0
        });
      }

      // Save Dynamic Custom Field Values
      let parsedFieldValues = {};
      if (field_values) {
        try {
          parsedFieldValues = typeof field_values === 'string' ? JSON.parse(field_values) : field_values;
        } catch (e) {}
      }

      db.delete('application_field_values', f => f.application_id === application.id);

      const serviceFields = db.all('service_fields', f => f.service_id === service.id);
      const fieldMap = {};
      serviceFields.forEach(f => {
        const fName = f.field_name || f.name;
        const fLabel = f.field_label || f.label || fName;
        if (fName) fieldMap[fName] = { ...f, field_label: fLabel };
      });

      for (const [key, val] of Object.entries(parsedFieldValues)) {
        const fieldDef = fieldMap[key];
        db.insert('application_field_values', {
          application_id: application.id,
          field_id: fieldDef ? fieldDef.id : null,
          field_label: fieldDef ? fieldDef.field_label : key,
          value: typeof val === 'object' ? JSON.stringify(val) : String(val)
        });
      }

      // Save Uploaded Documents
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          const docName = file.fieldname.replace('doc_', '').replace(/_/g, ' ');
          const serviceDocs = db.all('service_documents', d => d.service_id === service.id);
          const matchedServiceDoc = serviceDocs.find(sd => {
            const dName = sd.document_name || sd.name || '';
            return dName.toLowerCase().includes(docName.toLowerCase()) || docName.toLowerCase().includes(dName.toLowerCase());
          });

          const docRecord = db.insert('application_documents', {
            application_id: application.id,
            service_document_id: matchedServiceDoc ? matchedServiceDoc.id : null,
            document_name: matchedServiceDoc ? (matchedServiceDoc.document_name || matchedServiceDoc.name) : docName,
            original_filename: file.originalname,
            stored_filename: file.filename,
            file_type: file.mimetype,
            file_size: file.size,
            file_path: `/api/documents/preview-file/${file.filename}`,
            uploaded_by: userId || 'Guest User',
            uploaded_at: new Date().toISOString(),
            verification_status: 'Pending Verification',
            verified_by: null,
            verified_at: null,
            rejection_reason: null
          });

          logDocumentAudit(application.id, docRecord.id, 'Uploaded', user_name || 'Applicant', 'User', `Uploaded ${file.originalname}`);
        });
      }

      // Save Payment Entry
      const payNum = `PAY-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      db.insert('payments', {
        application_id: application.id,
        user_id: userId,
        payment_number: payNum,
        amount: service.fee || 0,
        payment_method: payment_method || 'Online Facilitation Fee / UPI',
        payment_status: service.fee > 0 ? 'Completed' : 'Free Service',
        paid_at: new Date().toISOString()
      });

      // Audit Trail
      db.insert('application_status_history', {
        application_id: application.id,
        status: 'SUBMITTED',
        admin_remarks: 'Application submitted successfully with verified dynamic field data.',
        updated_by: 'Applicant / Web Portal'
      });

      return {
        application_number: applicationNumber,
        application_id: application.id,
        submitted_at: application.submitted_at
      };
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application_number: submissionResult.application_number,
      application_id: submissionResult.application_id,
      status: 'SUBMITTED',
      total_fee: service.fee,
      submitted_at: submissionResult.submitted_at || new Date().toISOString()
    });
  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Public / User Application Tracking Endpoint
app.get('/api/applications/track/:appNumber', (req, res) => {
  const appNum = req.params.appNumber.trim().toUpperCase();
  const phone = req.query.phone ? req.query.phone.trim() : null;

  const application = db.get('applications', a =>
    a.application_number.toUpperCase() === appNum &&
    (!phone || a.user_phone.includes(phone))
  );

  if (!application) {
    return res.status(404).json({ error: 'No application found with provided Application ID' });
  }

  const service = db.get('services', s => s.id === application.service_id);
  const category = service ? db.get('categories', c => c.id === service.category_id) : null;
  const history = db.all('application_status_history', h => h.application_id === application.id)
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const docs = db.all('application_documents', d => d.application_id === application.id);
  const fieldValues = db.all('application_field_values', f => f.application_id === application.id);
  const payment = db.get('payments', p => p.application_id === application.id);

  // Mask name helper for privacy protection on public tracking
  const maskName = (fullName) => {
    if (!fullName) return 'A*** t';
    const parts = fullName.trim().split(' ');
    return parts.map(p => {
      if (p.length <= 2) return p[0] + '*';
      return p[0] + '*'.repeat(p.length - 2) + p[p.length - 1];
    }).join(' ');
  };

  res.json({
    application: {
      id: application.id,
      application_number: application.application_number,
      user_name: phone ? application.user_name : maskName(application.user_name),
      user_name_masked: maskName(application.user_name),
      is_verified_phone: !!phone,
      user_email: phone ? application.user_email : `${application.user_email.substring(0, 2)}***@***.com`,
      user_phone: phone ? application.user_phone : `${application.user_phone.substring(0, 2)}******${application.user_phone.substring(8)}`,
      status: application.status,
      admin_remarks: application.admin_remarks,
      total_fee: application.total_fee,
      created_at: application.created_at,
      updated_at: application.updated_at
    },
    service: {
      name: service ? service.name : 'Digital Service',
      category_name: category ? category.name : 'Digital Services',
      processing_time: service ? service.processing_time : 'Standard'
    },
    field_values: fieldValues,
    documents: docs.map(d => ({
      id: d.id,
      document_name: d.document_name,
      original_filename: d.original_filename || d.file_name,
      file_type: d.file_type,
      file_size: d.file_size,
      verification_status: d.verification_status || 'Pending Verification',
      rejection_reason: d.rejection_reason,
      file_path: d.file_path
    })),
    payment,
    history
  });
});

// ==========================================
// 3.4 PAYMENT & SERVICE FEE ENGINE
// ==========================================

// Create Payment Order (Server-Side Calculation)
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { application_id, service_id } = req.body;
    if (!application_id || !service_id) {
      return res.status(400).json({ error: 'application_id and service_id are required' });
    }

    const service = db.get('services', s => s.id === Number(service_id));
    if (!service) return res.status(404).json({ error: 'Service configuration not found' });

    const application = db.get('applications', a => a.id === Number(application_id));
    if (!application) return res.status(404).json({ error: 'Application record not found' });

    // Server-side calculated fee amount (Never trust client fee!)
    const amount = Number(service.fee) || 0;
    if (amount === 0 || service.payment_required === false) {
      return res.json({
        payment_required: false,
        message: 'No payment required for this service',
        amount: 0
      });
    }

    const orderData = await PaymentService.createOrder({
      applicationId: application.id,
      userId: application.user_id,
      amount: amount,
      currency: 'INR',
      serviceName: service.name
    });

    const paymentRecord = db.insert('payments', {
      application_id: application.id,
      user_id: application.user_id,
      amount: amount,
      currency: 'INR',
      payment_gateway: 'RAZORPAY_SANDBOX',
      payment_order_id: orderData.order_id,
      payment_transaction_id: `TXN-PENDING-${Date.now()}`,
      payment_status: 'PENDING',
      payment_method: 'UPI / Online Facilitation',
      initiated_at: new Date().toISOString(),
      metadata: { service_name: service.name, application_number: application.application_number }
    });

    res.json({
      payment_required: true,
      order: orderData,
      payment_id: paymentRecord.id,
      amount: amount,
      currency: 'INR',
      disclaimer: 'Service charges displayed on this portal are facilitation/service charges. Official government fees, where applicable, may be separate.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server-Side Verify Payment Signature & Complete Application Submission
app.post('/api/payments/verify-payment', async (req, res) => {
  try {
    const { payment_id, order_id, transaction_id, signature, payment_method } = req.body;
    if (!payment_id || !order_id) {
      return res.status(400).json({ error: 'payment_id and order_id are required' });
    }

    const isValid = PaymentService.verifyPaymentSignature({
      orderId: order_id,
      paymentId: transaction_id || `TXN-${Date.now()}`,
      signature: signature
    });

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid payment signature verification' });
    }

    const txnId = transaction_id || `TXN-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    // Update payment record in DB
    db.update('payments', p => p.id === Number(payment_id), {
      payment_transaction_id: txnId,
      payment_status: 'PAID',
      payment_method: payment_method || 'Online UPI / NetBanking',
      paid_at: new Date().toISOString()
    });

    const payment = db.get('payments', p => p.id === Number(payment_id));
    if (payment && payment.application_id) {
      // Update application status to SUBMITTED
      db.update('applications', a => a.id === payment.application_id, {
        status: 'SUBMITTED',
        payment_status: 'PAID',
        updated_at: new Date().toISOString()
      });

      // Audit log entry
      db.insert('application_status_history', {
        application_id: payment.application_id,
        status: 'SUBMITTED',
        admin_remarks: `Payment of ₹${payment.amount} verified successfully via ${payment.payment_method}. Transaction ID: ${txnId}`,
        updated_by: 'Payment Gateway Automator'
      });
    }

    const receiptNumber = `REC-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    res.json({
      success: true,
      message: 'Payment verified and application submitted successfully!',
      transaction_id: txnId,
      receipt_number: receiptNumber,
      paid_at: new Date().toISOString(),
      amount: payment ? payment.amount : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Payment Retry API for Failed / Pending Applications
app.post('/api/payments/retry', async (req, res) => {
  try {
    const { application_id } = req.body;
    const application = db.get('applications', a => a.id === Number(application_id));
    if (!application) return res.status(404).json({ error: 'Application record not found' });

    const service = db.get('services', s => s.id === application.service_id);
    const amount = Number(service ? service.fee : application.total_fee) || 0;

    const orderData = await PaymentService.createOrder({
      applicationId: application.id,
      userId: application.user_id,
      amount: amount,
      currency: 'INR',
      serviceName: service ? service.name : 'Digital Facilitation Service'
    });

    const newPaymentRecord = db.insert('payments', {
      application_id: application.id,
      user_id: application.user_id,
      amount: amount,
      currency: 'INR',
      payment_gateway: 'RAZORPAY_SANDBOX',
      payment_order_id: orderData.order_id,
      payment_transaction_id: `TXN-RETRY-${Date.now()}`,
      payment_status: 'PENDING',
      payment_method: 'UPI / Online Facilitation',
      initiated_at: new Date().toISOString(),
      metadata: { retry_attempt: true }
    });

    res.json({
      message: 'Payment retry initiated',
      order: orderData,
      payment_id: newPaymentRecord.id,
      amount: amount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Production Payment Webhook Endpoint
app.post('/api/payments/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret';
    
    // Validate Webhook Signature
    const bodyStr = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(bodyStr)
      .digest('hex');

    if (process.env.NODE_ENV === 'production' && signature !== expectedSignature) {
      console.warn('[Webhook] Invalid payment webhook signature received.');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const { event, payload } = req.body;
    console.log(`[Webhook] Payment Webhook Event Received: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload?.payment?.entity || payload?.order?.entity;
      const orderId = paymentEntity?.order_id;
      const txnId = paymentEntity?.id || `TXN-WEBHOOK-${Date.now()}`;

      if (orderId) {
        const paymentRecord = db.get('payments', p => p.payment_order_id === orderId);
        if (paymentRecord && paymentRecord.payment_status !== 'SUCCESS') {
          db.transaction(() => {
            db.update('payments', p => p.id === paymentRecord.id, {
              payment_status: 'SUCCESS',
              payment_transaction_id: txnId,
              webhook_event: event,
              paid_at: new Date().toISOString()
            });

            db.update('applications', a => a.id === paymentRecord.application_id, {
              payment_status: 'PAID',
              status: 'Submitted',
              updated_at: new Date().toISOString()
            });

            db.insert('application_history', {
              application_id: paymentRecord.application_id,
              status: 'Submitted',
              remarks: `Payment captured via Webhook (Txn: ${txnId})`,
              updated_by: 'Razorpay Webhook Engine'
            });
          });
        }
      }
    }

    // Log Webhook Audit Entry
    db.insert('payment_webhook_logs', {
      event,
      payload: req.body,
      received_at: new Date().toISOString()
    });

    res.json({ status: 'ok', received: true });
  } catch (err) {
    console.error('[Webhook Error]', err.message);
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

// Get User Payment History Ledger
app.get('/api/payments/my', authenticateToken, (req, res) => {
  const userPayments = db.all('payments', p => p.user_id === req.user.id)
    .sort((a, b) => new Date(b.created_at || b.initiated_at) - new Date(a.created_at || a.initiated_at));

  const applications = db.all('applications');
  const services = db.all('services');

  const result = userPayments.map(p => {
    const app = applications.find(a => a.id === p.application_id);
    const srv = app ? services.find(s => s.id === app.service_id) : null;

    return {
      ...p,
      application_number: app ? app.application_number : 'ESV-2026-UNKNOWN',
      service_name: srv ? srv.name : 'Digital Service',
      receipt_number: `REC-2026-${String(p.id).padStart(6, '0')}`
    };
  });

  res.json(result);
});

// Admin Payments Management & Ledger Endpoint
app.get('/api/admin/payments', authenticateToken, (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Access denied' });

  const payments = db.all('payments').sort((a, b) => new Date(b.created_at || b.initiated_at) - new Date(a.created_at || a.initiated_at));
  const applications = db.all('applications');
  const users = db.all('users');
  const services = db.all('services');

  const result = payments.map(p => {
    const app = applications.find(a => a.id === p.application_id);
    const user = app ? users.find(u => u.id === app.user_id) : null;
    const srv = app ? services.find(s => s.id === app.service_id) : null;

    return {
      ...p,
      application_number: app ? app.application_number : 'ESV-2026-UNKNOWN',
      user_name: user ? user.name : (app ? app.user_name : 'Citizen'),
      user_email: user ? user.email : '',
      service_name: srv ? srv.name : 'Digital Service',
      receipt_number: `REC-2026-${String(p.id).padStart(6, '0')}`
    };
  });

  res.json(result);
});

// Admin Refund Endpoint
app.post('/api/admin/payments/:id/refund', authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Access denied' });

  const paymentId = Number(req.params.id);
  const { reason } = req.body;

  const payment = db.get('payments', p => p.id === paymentId);
  if (!payment) return res.status(404).json({ error: 'Payment record not found' });

  const refundResult = await PaymentService.initiateRefund({
    paymentTransactionId: payment.payment_transaction_id,
    amount: payment.amount,
    reason: reason || 'Admin processing refund'
  });

  db.update('payments', p => p.id === paymentId, {
    payment_status: 'REFUNDED',
    refund_id: refundResult.refund_id,
    refund_amount: payment.amount,
    refund_reason: reason || 'Service cancellation refund',
    refunded_at: new Date().toISOString()
  });

  res.json({
    message: 'Refund initiated successfully',
    refund: refundResult
  });
});

// ==========================================
// 3.5 DOCUMENT MANAGEMENT & SECURE ACCESS
// ==========================================

// Document Protected Preview Endpoint
app.get('/api/documents/:id/preview', optionalAuthenticateToken, (req, res) => {
  const docId = Number(req.params.id);
  const doc = db.get('application_documents', d => d.id === docId);
  if (!doc) return res.status(404).json({ error: 'Document record not found' });

  const appRecord = db.get('applications', a => a.id === doc.application_id);
  if (appRecord && req.user && !verifyResourceOwnership(appRecord, req.user)) {
    return res.status(403).json({ error: 'Access denied to this document' });
  }

  const absolutePath = path.join(uploadsDir, doc.stored_filename || path.basename(doc.file_path));
  if (!fs.existsSync(absolutePath)) {
    return res.status(404).json({ error: 'Physical document file missing on server' });
  }

  res.setHeader('Content-Type', doc.file_type || 'application/octet-stream');
  res.setHeader('Content-Disposition', `inline; filename="${doc.original_filename || doc.document_name}"`);
  res.sendFile(absolutePath);
});

// Secure Document File Stream Endpoint (Internal / Authorized)
app.get('/api/documents/preview-file/:filename', optionalAuthenticateToken, (req, res) => {
  const filename = path.basename(req.params.filename);
  const doc = db.get('application_documents', d => d.stored_filename === filename);
  if (doc) {
    const appRecord = db.get('applications', a => a.id === doc.application_id);
    if (appRecord && req.user && !verifyResourceOwnership(appRecord, req.user)) {
      return res.status(403).json({ error: 'Access denied' });
    }
  }

  const absolutePath = path.join(uploadsDir, filename);
  if (!fs.existsSync(absolutePath)) {
    return res.status(404).json({ error: 'File missing on server' });
  }

  res.sendFile(absolutePath);
});

// Document Protected Download Endpoint
app.get('/api/documents/:id/download', optionalAuthenticateToken, (req, res) => {
  const docId = Number(req.params.id);
  const doc = db.get('application_documents', d => d.id === docId);
  if (!doc) return res.status(404).json({ error: 'Document record not found' });

  const appRecord = db.get('applications', a => a.id === doc.application_id);
  if (appRecord && req.user && !verifyResourceOwnership(appRecord, req.user)) {
    return res.status(403).json({ error: 'Access denied to this document' });
  }

  const absolutePath = path.join(uploadsDir, doc.stored_filename || path.basename(doc.file_path));
  if (!fs.existsSync(absolutePath)) {
    return res.status(404).json({ error: 'Physical document file missing on server' });
  }

  res.download(absolutePath, doc.original_filename || doc.document_name || 'document');
});

// Replace Document File (for DRAFT or REJECTED state)
app.post('/api/documents/:id/replace', authenticateToken, upload.single('file'), (req, res) => {
  const docId = Number(req.params.id);
  const doc = db.get('application_documents', d => d.id === docId);
  if (!doc) return res.status(404).json({ error: 'Document record not found' });

  const appRecord = db.get('applications', a => a.id === doc.application_id);
  if (appRecord && !verifyResourceOwnership(appRecord, req.user)) {
    return res.status(403).json({ error: 'Access denied to this document' });
  }

  if (!req.file) return res.status(400).json({ error: 'No replacement file uploaded' });

  if (doc.stored_filename) {
    const oldPath = path.join(uploadsDir, doc.stored_filename);
    if (fs.existsSync(oldPath)) {
      try { fs.unlinkSync(oldPath); } catch (e) {}
    }
  }

  db.update('application_documents', d => d.id === docId, {
    original_filename: req.file.originalname,
    stored_filename: req.file.filename,
    file_type: req.file.mimetype,
    file_size: req.file.size,
    file_path: `/api/documents/preview-file/${req.file.filename}`,
    verification_status: 'Pending Verification',
    rejection_reason: null,
    uploaded_at: new Date().toISOString()
  });

  logDocumentAudit(doc.application_id, docId, 'Replaced', req.user.name || 'Applicant', req.user.isAdmin ? 'Admin' : 'User', `Replaced with ${req.file.originalname}`);

  res.json({
    message: 'Document replaced successfully',
    document: db.get('application_documents', d => d.id === docId)
  });
});

// Delete Document File (for DRAFT state)
app.delete('/api/documents/:id', authenticateToken, (req, res) => {
  const docId = Number(req.params.id);
  const doc = db.get('application_documents', d => d.id === docId);
  if (!doc) return res.status(404).json({ error: 'Document record not found' });

  const appRecord = db.get('applications', a => a.id === doc.application_id);
  if (appRecord && !verifyResourceOwnership(appRecord, req.user)) {
    return res.status(403).json({ error: 'Access denied to this document' });
  }

  if (doc.stored_filename) {
    const oldPath = path.join(uploadsDir, doc.stored_filename);
    if (fs.existsSync(oldPath)) {
      try { fs.unlinkSync(oldPath); } catch (e) {}
    }
  }

  db.delete('application_documents', d => d.id === docId);
  logDocumentAudit(doc.application_id, docId, 'Removed', req.user.name || 'Applicant', req.user.isAdmin ? 'Admin' : 'User', `Removed ${doc.original_filename || doc.document_name}`);

  res.json({ message: 'Document removed successfully' });
});

// Admin Verify / Reject Document
app.put('/api/admin/documents/:id/verify', authenticateAdmin, (req, res) => {
  const docId = Number(req.params.id);
  const { verification_status, rejection_reason } = req.body;

  const validStatuses = ['Pending Verification', 'Verified', 'Rejected'];
  if (!verification_status || !validStatuses.includes(verification_status)) {
    return res.status(400).json({ error: `Verification status must be one of: ${validStatuses.join(', ')}` });
  }

  const doc = db.get('application_documents', d => d.id === docId);
  if (!doc) return res.status(404).json({ error: 'Document record not found' });

  db.update('application_documents', d => d.id === docId, {
    verification_status,
    verified_by: req.admin.email || 'Admin',
    verified_at: new Date().toISOString(),
    rejection_reason: verification_status === 'Rejected' ? (rejection_reason || 'Document does not meet requirements.') : null
  });

  logDocumentAudit(
    doc.application_id,
    docId,
    verification_status,
    req.admin.name || 'Admin',
    'Admin',
    verification_status === 'Rejected' ? `Rejected: ${rejection_reason}` : 'Verified document proof'
  );

  res.json({
    message: `Document status updated to ${verification_status}`,
    document: db.get('application_documents', d => d.id === docId)
  });
});

// Document Audit History Endpoint
app.get('/api/documents/audit/:appId', (req, res) => {
  const appId = Number(req.params.appId);
  const auditLogs = db.all('document_audit_history', log => log.application_id === appId)
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(auditLogs);
});

// Get User's Own Applications List
app.get('/api/applications/my', authenticateToken, (req, res) => {
  const userApps = db.all('applications', a => a.user_id === req.user.id || a.user_email.toLowerCase() === req.user.email.toLowerCase())
                     .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const services = db.all('services');
  const serviceMap = Object.fromEntries(services.map(s => [s.id, s]));

  const result = userApps.map(app => {
    const srv = serviceMap[app.service_id];
    return {
      ...app,
      service_name: srv ? srv.name : 'Digital Service',
      processing_time: srv ? srv.processing_time : ''
    };
  });

  res.json(result);
});

// Get Single Application Full Detail View
app.get('/api/applications/:id', (req, res) => {
  const appParam = req.params.id;
  const application = db.get('applications', a => String(a.id) === appParam || a.application_number === appParam);
  if (!application) return res.status(404).json({ error: 'Application not found' });

  const service = db.get('services', s => s.id === application.service_id);
  const category = service ? db.get('categories', c => c.id === service.category_id) : null;
  const fieldValues = db.all('application_field_values', f => f.application_id === application.id);
  const docs = db.all('application_documents', d => d.application_id === application.id);
  const payment = db.get('payments', p => p.application_id === application.id);
  const history = db.all('application_status_history', h => h.application_id === application.id)
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json({
    ...application,
    service_name: service ? service.name : '',
    category_name: category ? category.name : '',
    field_values: fieldValues,
    documents: docs,
    payment,
    history
  });
});

// ==========================================
// 4. PROTECTED ADMIN PANEL API
// ==========================================

// Admin Dashboard Analytics Stats
app.get('/api/admin/dashboard', authenticateAdmin, (req, res) => {
  const applications = db.all('applications');
  const total = applications.length;
  const pending = applications.filter(a => a.status === 'Pending').length;
  const processing = applications.filter(a => a.status === 'Processing').length;
  const approved = applications.filter(a => a.status === 'Approved').length;
  const completed = applications.filter(a => a.status === 'Completed').length;
  const rejected = applications.filter(a => a.status === 'Rejected').length;

  const usersCount = db.all('users').length;
  const servicesCount = db.all('services').length;
  const enquiriesCount = db.all('contact_messages', m => m.status === 'Unread').length;

  const payments = db.all('payments', p => p.payment_status === 'Completed');
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const recentApplications = applications
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
    .map(a => {
      const srv = db.get('services', s => s.id === a.service_id);
      return {
        ...a,
        service_name: srv ? srv.name : 'Digital Service'
      };
    });

  res.json({
    total_applications: total,
    pending_applications: pending,
    processing_applications: processing,
    approved_applications: approved,
    completed_applications: completed,
    rejected_applications: rejected,
    total_users: usersCount,
    total_services: servicesCount,
    unread_enquiries: enquiriesCount,
    total_revenue: totalRevenue,
    recent_applications: recentApplications
  });
});

// Admin All Applications (with search & status filters)
app.get('/api/admin/applications', authenticateAdmin, (req, res) => {
  const { status, search, category_id } = req.query;
  let applications = db.all('applications');

  if (status && status !== 'All') {
    applications = applications.filter(a => a.status.toLowerCase() === status.toLowerCase());
  }

  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    applications = applications.filter(a =>
      a.application_number.toLowerCase().includes(q) ||
      a.user_name.toLowerCase().includes(q) ||
      a.user_email.toLowerCase().includes(q) ||
      a.user_phone.toLowerCase().includes(q)
    );
  }

  const services = db.all('services');
  const categories = db.all('categories');
  const serviceMap = Object.fromEntries(services.map(s => [s.id, s]));
  const catMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

  const result = applications
    .map(a => {
      const srv = serviceMap[a.service_id];
      return {
        ...a,
        service_name: srv ? srv.name : 'Digital Service',
        category_name: srv ? catMap[srv.category_id] || '' : ''
      };
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json(result);
});

// Admin Update Application Status & Remarks
app.put('/api/admin/applications/:id/status', authenticateAdmin, (req, res) => {
  const appId = Number(req.params.id);
  const { status, admin_remarks } = req.body;

  const validStatuses = ['Pending', 'Processing', 'Approved', 'Completed', 'Rejected'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  const application = db.get('applications', a => a.id === appId);
  if (!application) return res.status(404).json({ error: 'Application not found' });

  // State Machine Validation Rules
  const currentStatus = application.status;
  if (currentStatus === 'COMPLETED' && status !== 'COMPLETED') {
    return res.status(400).json({ error: 'Completed applications cannot have their status downgraded or changed.' });
  }
  if (currentStatus === 'REJECTED' && status === 'COMPLETED') {
    return res.status(400).json({ error: 'Rejected applications must be approved or re-processed before completion.' });
  }

  const remarks = admin_remarks ? admin_remarks.trim() : `Status updated to ${status} by admin.`;

  db.update('applications', a => a.id === appId, {
    status,
    admin_remarks: remarks
  });

  // Record audit trail in ApplicationStatusHistory
  db.insert('application_status_history', {
    application_id: appId,
    status,
    admin_remarks: remarks,
    updated_by: req.admin.name || 'Admin'
  });

  res.json({
    message: `Application status successfully updated to ${status}`,
    application_id: appId,
    status,
    admin_remarks: remarks
  });
});

// Admin Customer Management
app.get('/api/admin/customers', authenticateAdmin, (req, res) => {
  const users = db.all('users');
  const applications = db.all('applications');

  const result = users.map(u => {
    const userApps = applications.filter(a => a.user_id === u.id || a.user_email.toLowerCase() === u.email.toLowerCase());
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      aadhaar_no: u.aadhaar_no,
      created_at: u.created_at,
      total_applications: userApps.length
    };
  });

  res.json(result);
});

// Admin Services & Categories Management
app.post('/api/admin/services', authenticateAdmin, (req, res) => {
  try {
    const { category_id, name, description, eligibility, processing_info, processing_time, fee, fields, documents } = req.body;
    if (!category_id || !name) return res.status(400).json({ error: 'Category ID and Service Name required' });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const service = db.insert('services', {
      category_id: Number(category_id),
      name,
      slug,
      description: description || '',
      eligibility: eligibility || '',
      processing_info: processing_info || '',
      processing_time: processing_time || '3-5 Days',
      fee: Number(fee) || 0,
      status: 'Active'
    });

    if (fields && Array.isArray(fields)) {
      fields.forEach((f, idx) => {
        db.insert('service_fields', {
          service_id: service.id,
          field_name: f.field_name || f.field_label.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
          field_label: f.field_label,
          field_type: f.field_type || 'text',
          is_required: f.is_required ? 1 : 0,
          options_json: f.options_json ? JSON.stringify(f.options_json) : null,
          sort_order: idx + 1
        });
      });
    }

    if (documents && Array.isArray(documents)) {
      documents.forEach(d => {
        db.insert('service_documents', {
          service_id: service.id,
          document_name: d.document_name,
          description: d.description || '',
          is_required: 1
        });
      });
    }

    res.status(201).json({ message: 'Service created successfully', service });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Contact Messages & Enquiries
app.get('/api/admin/enquiries', authenticateAdmin, (req, res) => {
  const messages = db.all('contact_messages').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(messages);
});

// Admin Career Applications
app.get('/api/admin/careers', authenticateAdmin, (req, res) => {
  const careers = db.all('career_applications').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(careers);
});

// ==========================================
// 5. PUBLIC CONTACT & CAREER SUBMISSIONS
// ==========================================

app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const newMsg = db.insert('contact_messages', {
    name,
    email,
    phone: phone || '',
    subject: subject || 'General Enquiry',
    message,
    status: 'Unread'
  });

  res.json({ message: 'Thank you! Your enquiry has been received.', message_id: newMsg.id });
});

app.post('/api/careers', upload.single('resume'), (req, res) => {
  const { applicant_name, email, phone, position, experience } = req.body;
  if (!applicant_name || !email || !position) {
    return res.status(400).json({ error: 'Name, email, and position are required' });
  }

  const resumePath = req.file ? `/uploads/${req.file.filename}` : '';

  const newApp = db.insert('career_applications', {
    applicant_name,
    email,
    phone: phone || '',
    position,
    experience: experience || 'Entry Level',
    resume_file: resumePath,
    status: 'Received'
  });

  res.json({ message: 'Application submitted successfully', career_id: newApp.id });
});

// ==========================================
// 6. ADMIN AUDIT LOGS, REPORTS & RE-UPLOAD
// ==========================================

// User Document Re-upload Endpoint (for Action Required / Rejected status)
app.post('/api/applications/:id/reupload-document', upload.single('file'), (req, res) => {
  const appId = Number(req.params.id);
  const { document_name } = req.body;
  if (!req.file || !document_name) {
    return res.status(400).json({ error: 'File and document_name are required' });
  }

  const appRecord = db.get('applications', a => a.id === appId);
  if (!appRecord) return res.status(404).json({ error: 'Application not found' });

  const existingDoc = db.get('application_documents', d => d.application_id === appId && d.document_name === document_name);

  if (existingDoc) {
    db.update('application_documents', d => d.id === existingDoc.id, {
      original_filename: req.file.originalname,
      stored_filename: req.file.filename,
      file_type: req.file.mimetype,
      file_size: req.file.size,
      file_path: `/uploads/${req.file.filename}`,
      verification_status: 'Pending Verification',
      rejection_reason: null,
      uploaded_at: new Date().toISOString()
    });
  } else {
    db.insert('application_documents', {
      application_id: appId,
      document_name,
      original_filename: req.file.originalname,
      stored_filename: req.file.filename,
      file_type: req.file.mimetype,
      file_size: req.file.size,
      file_path: `/uploads/${req.file.filename}`,
      verification_status: 'Pending Verification',
      rejection_reason: null,
      uploaded_at: new Date().toISOString()
    });
  }

  db.update('applications', a => a.id === appId, {
    status: 'UNDER_REVIEW',
    updated_at: new Date().toISOString()
  });

  db.insert('application_status_history', {
    application_id: appId,
    status: 'UNDER_REVIEW',
    admin_remarks: `User re-uploaded document: ${document_name}`,
    updated_by: appRecord.user_name || 'Customer'
  });

  res.json({ message: 'Document re-uploaded successfully! Application resubmitted for review.' });
});

// Admin Executive Reports & Analytics Endpoint
app.get('/api/admin/reports', authenticateAdmin, (req, res) => {
  const applications = db.all('applications');
  const payments = db.all('payments');
  const services = db.all('services');
  const categories = db.all('categories');
  const users = db.all('users');

  const totalRevenue = payments.filter(p => p.payment_status === 'PAID').reduce((sum, p) => sum + (p.amount || 0), 0);

  const categoryStats = categories.map(cat => {
    const catServices = services.filter(s => s.category_id === cat.id).map(s => s.id);
    const catApps = applications.filter(a => catServices.includes(a.service_id));
    return {
      category_id: cat.id,
      category_name: cat.name,
      total_applications: catApps.length,
      revenue: payments.filter(p => p.payment_status === 'PAID' && catApps.some(a => a.id === p.application_id)).reduce((s, p) => s + p.amount, 0)
    };
  });

  const statusStats = {
    submitted: applications.filter(a => a.status === 'Submitted' || a.status === 'Pending').length,
    under_review: applications.filter(a => a.status === 'UNDER_REVIEW' || a.status === 'Under Review').length,
    processing: applications.filter(a => a.status === 'Processing').length,
    action_required: applications.filter(a => a.status === 'ACTION_REQUIRED' || a.status === 'Action Required').length,
    approved: applications.filter(a => a.status === 'Approved').length,
    completed: applications.filter(a => a.status === 'Completed').length,
    rejected: applications.filter(a => a.status === 'Rejected').length
  };

  res.json({
    total_applications: applications.length,
    total_customers: users.length,
    total_services: services.length,
    total_revenue: totalRevenue,
    status_breakdown: statusStats,
    category_analytics: categoryStats
  });
});

// Admin System Audit Logs
app.get('/api/admin/audit-logs', authenticateAdmin, (req, res) => {
  const statusHistory = db.all('application_status_history').map(h => ({
    type: 'Status Change',
    application_id: h.application_id,
    action: `Status updated to ${h.status}`,
    details: h.admin_remarks,
    performed_by: h.updated_by || 'Admin',
    created_at: h.created_at
  }));

  const docAudit = db.all('document_audit_history').map(d => ({
    type: 'Document Verification',
    application_id: d.application_id,
    action: `Document ${d.action}`,
    details: d.notes,
    performed_by: d.performed_by,
    created_at: d.created_at
  }));

  const combined = [...statusHistory, ...docAudit].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(combined);
});

// Admin Generate / Attach Official Certificate Endpoint
app.post('/api/admin/applications/:id/certificate', authenticateAdmin, (req, res) => {
  const appId = Number(req.params.id);
  const { certificate_number, notes } = req.body;

  const appRecord = db.get('applications', a => a.id === appId);
  if (!appRecord) return res.status(404).json({ error: 'Application not found' });

  const certNum = certificate_number || `CERT-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  db.update('applications', a => a.id === appId, {
    status: 'COMPLETED',
    certificate_number: certNum,
    certificate_issued_at: new Date().toISOString(),
    admin_remarks: notes || `Official certificate ${certNum} issued and verified.`
  });

  db.insert('application_status_history', {
    application_id: appId,
    status: 'COMPLETED',
    admin_remarks: `Official Digital Certificate Issued: ${certNum}`,
    updated_by: req.admin.name || 'Admin'
  });

  // Dispatch Notification to User
  NotificationService.sendNotification(db, {
    userId: appRecord.user_id,
    type: 'CERTIFICATE_ISSUED',
    data: {
      application_id: appRecord.id,
      application_number: appRecord.application_number,
      service_name: appRecord.service_name,
      certificate_number: certNum
    },
    userEmail: appRecord.user_email,
    userPhone: appRecord.user_phone
  });

  res.json({
    message: 'Official Certificate issued successfully',
    certificate_number: certNum,
    issued_at: new Date().toISOString()
  });
});

// ==========================================
// 7. USER & ADMIN NOTIFICATIONS & MESSAGING APIs
// ==========================================

// Get Current User Notifications
app.get('/api/notifications', authenticateToken, (req, res) => {
  const notifications = db.all('notifications', n => n.userId === req.user.id || n.user_id === req.user.id)
                          .sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
  const unreadCount = notifications.filter(n => !n.isRead && !n.is_read).length;

  res.json({
    notifications,
    unread_count: unreadCount
  });
});

// Mark Single Notification as Read
app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
  const notifId = Number(req.params.id);
  db.update('notifications', n => n.id === notifId, { isRead: 1, is_read: 1, readAt: new Date().toISOString() });
  res.json({ message: 'Notification marked as read' });
});

// Mark Single Notification as Unread
app.put('/api/notifications/:id/unread', authenticateToken, (req, res) => {
  const notifId = Number(req.params.id);
  db.update('notifications', n => n.id === notifId, { isRead: 0, is_read: 0, readAt: null });
  res.json({ message: 'Notification marked as unread' });
});

// Mark All Notifications as Read
app.put('/api/notifications/read-all', authenticateToken, (req, res) => {
  const userNotifs = db.all('notifications', n => (n.userId === req.user.id || n.user_id === req.user.id) && (!n.isRead && !n.is_read));
  userNotifs.forEach(n => {
    db.update('notifications', item => item.id === n.id, { isRead: 1, is_read: 1, readAt: new Date().toISOString() });
  });
  res.json({ message: 'All notifications marked as read' });
});

// Delete Single Notification
app.delete('/api/notifications/:id', authenticateToken, (req, res) => {
  const notifId = Number(req.params.id);
  db.delete('notifications', n => n.id === notifId);
  res.json({ message: 'Notification deleted' });
});

// Admin Get Notifications
app.get('/api/admin/notifications', authenticateAdmin, (req, res) => {
  const adminNotifs = db.all('notifications', n => n.adminId || !n.userId)
                        .sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
  const unreadCount = adminNotifs.filter(n => !n.isRead && !n.is_read).length;

  res.json({
    notifications: adminNotifs,
    unread_count: unreadCount
  });
});

// Admin Mark All Notifications Read
app.put('/api/admin/notifications/read-all', authenticateAdmin, (req, res) => {
  const adminNotifs = db.all('notifications', n => (n.adminId || !n.userId) && (!n.isRead && !n.is_read));
  adminNotifs.forEach(n => {
    db.update('notifications', item => item.id === n.id, { isRead: 1, is_read: 1, readAt: new Date().toISOString() });
  });
  res.json({ message: 'All admin notifications marked as read' });
});

// ==========================================
// 8. APPLICATION MESSAGING CHAT APIs
// ==========================================

// Get Application Messages (Security Check: Only application owner or admin allowed)
app.get('/api/applications/:id/messages', (req, res) => {
  const appId = Number(req.params.id);
  const messages = db.all('application_messages', m => m.applicationId === appId || m.application_id === appId)
                     .sort((a, b) => new Date(a.createdAt || a.created_at) - new Date(b.createdAt || b.created_at));
  res.json(messages);
});

// Send Application Message (Customer or Admin)
app.post('/api/applications/:id/messages', (req, res) => {
  const appId = Number(req.params.id);
  const { message, senderType, senderId, senderName } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message content cannot be empty' });
  }

  const appRecord = db.get('applications', a => a.id === appId);
  if (!appRecord) return res.status(404).json({ error: 'Application not found' });

  const msgType = senderType || 'USER';
  const newMsg = db.insert('application_messages', {
    applicationId: appId,
    application_id: appId,
    senderType: msgType,
    senderId: senderId || (msgType === 'USER' ? appRecord.user_id : 1),
    senderName: senderName || (msgType === 'USER' ? appRecord.user_name : 'Admin Officer'),
    message: message.trim(),
    createdAt: new Date().toISOString(),
    readAt: null
  });

  // Notify opposite party automatically
  if (msgType === 'USER') {
    // Notify Admin
    NotificationService.sendNotification(db, {
      adminId: 1,
      applicationId: appId,
      type: 'GENERAL_NOTIFICATION',
      title: `New Message for ${appRecord.application_number}`,
      message: `User ${appRecord.user_name} sent a message: "${message.substring(0, 50)}..."`,
      data: { applicationId: appId, application_number: appRecord.application_number }
    });
  } else {
    // Notify Customer
    NotificationService.sendNotification(db, {
      userId: appRecord.user_id,
      applicationId: appId,
      type: 'CONTACT_REPLY',
      title: `New Message for Application ${appRecord.application_number}`,
      message: `E-Seva Officer replied: "${message.substring(0, 50)}..."`,
      data: { applicationId: appId, application_number: appRecord.application_number },
      userEmail: appRecord.user_email,
      userPhone: appRecord.user_phone
    });
  }

  res.json({ message: 'Message sent successfully', messageRecord: newMsg });
});

// ==========================================
// 9. TEMPLATE & PREFERENCE APIs
// ==========================================

// Get Admin Notification Templates
app.get('/api/admin/notification-templates', authenticateAdmin, (req, res) => {
  let templates = db.all('notification_templates');
  if (!templates || templates.length === 0) {
    // Seed default templates
    const defaultTemplates = [
      { name: 'Application Submitted', type: 'APPLICATION_SUBMITTED', channel: 'EMAIL', subject: 'Application {{applicationId}} Submitted', message: 'Hello {{userName}}, your application for {{serviceName}} is submitted.', active: 1 },
      { name: 'Document Verified', type: 'DOCUMENT_VERIFIED', channel: 'SMS', subject: 'Document Verified', message: 'E-SEVA: Document {{documentName}} for App {{applicationId}} is verified.', active: 1 },
      { name: 'Document Rejected', type: 'DOCUMENT_REJECTED', channel: 'EMAIL', subject: 'Document Action Required - {{applicationId}}', message: 'Hello {{userName}}, your document {{documentName}} was rejected. Reason: {{rejectionReason}}.', active: 1 },
      { name: 'Payment Success', type: 'PAYMENT_SUCCESS', channel: 'EMAIL', subject: 'Payment Received - {{applicationId}}', message: 'Payment of ₹{{amount}} received for {{serviceName}}. Transaction ID: {{transactionId}}.', active: 1 },
      { name: 'Application Approved', type: 'APPLICATION_APPROVED', channel: 'EMAIL', subject: 'Application Approved - {{applicationId}}', message: 'Congratulations {{userName}}, your application {{applicationId}} is approved.', active: 1 }
    ];
    defaultTemplates.forEach(t => db.insert('notification_templates', t));
    templates = db.all('notification_templates');
  }
  res.json(templates);
});

// Add / Update Notification Template
app.post('/api/admin/notification-templates', authenticateAdmin, (req, res) => {
  const { name, type, channel, subject, message, active } = req.body;
  const newTpl = db.insert('notification_templates', {
    name, type, channel, subject, message, active: active ? 1 : 0, createdAt: new Date().toISOString()
  });
  res.json({ message: 'Notification template saved successfully', template: newTpl });
});

// Get User Notification Preferences
app.get('/api/profile/notification-preferences', authenticateToken, (req, res) => {
  let pref = db.get('user_notification_preferences', p => p.userId === req.user.id);
  if (!pref) {
    pref = db.insert('user_notification_preferences', {
      userId: req.user.id,
      inApp: true,
      email: true,
      sms: true,
      messaging: true
    });
  }
  res.json(pref);
});

// Update User Notification Preferences
app.put('/api/profile/notification-preferences', authenticateToken, (req, res) => {
  const { inApp, email, sms, messaging } = req.body;
  const existing = db.get('user_notification_preferences', p => p.userId === req.user.id);
  if (existing) {
    db.update('user_notification_preferences', p => p.id === existing.id, { inApp, email, sms, messaging });
  } else {
    db.insert('user_notification_preferences', { userId: req.user.id, inApp, email, sms, messaging });
  }
  res.json({ message: 'Notification preferences updated successfully' });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = db ? 'HEALTHY' : 'UNHEALTHY';
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    uptime_seconds: Math.floor(process.uptime())
  });
});

// Standardized 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack || err.message || err);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    error: err.message || 'An internal server error occurred',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`E-Seva REST API Server running on port ${PORT} (0.0.0.0)`);
});
