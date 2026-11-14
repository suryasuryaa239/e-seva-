import 'dotenv/config';
import nodemailer from 'nodemailer';

const DEFAULT_SMTP_USER = 'econnectshopping@gmail.com';
const DEFAULT_GOOGLE_APP_PASSWORD = 'kvqpwazifoeucizf';
const DEFAULT_ADMIN_EMAIL = 'econnectshopping@gmail.com';

/**
 * E-Seva Enterprise Multi-Channel Notification Service
 * Supports In-App, SMS, Email (Nodemailer with Google App Password support), and Messaging Channels.
 */
class NotificationService {
  constructor() {
    this.transporter = null;
    this._transporterCacheKey = null;
  }

  /**
   * Escape HTML special characters before embedding user input into HTML templates
   */
  escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Validate real deliverable email addresses (reject placeholders & dummy fallback addresses)
   */
  isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const clean = email.trim().toLowerCase();
    if (!clean) return false;
    if (clean === 'your-email@gmail.com' || clean === 'your-admin-email@gmail.com' || clean === 'customer@eseva.gov.in') {
      return false;
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
  }

  /**
   * Format snake_case / machine keys cleanly for human-readable email display
   */
  formatFieldLabel(rawLabel) {
    if (!rawLabel) return 'Field';
    const text = String(rawLabel).trim();
    if (!text) return 'Field';
    if (text.includes(' ')) return text;
    return text
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, ch => ch.toUpperCase());
  }

  /**
   * Format stored dynamic field values nicely for emails
   */
  formatFieldValue(rawVal) {
    if (rawVal === null || rawVal === undefined) return '';
    if (Array.isArray(rawVal)) {
      return rawVal.map(v => this.formatFieldValue(v)).filter(Boolean).join(', ');
    }
    if (typeof rawVal === 'object') {
      return Object.entries(rawVal)
        .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== '')
        .map(([k, v]) => `${this.formatFieldLabel(k)}: ${v}`)
        .join(', ');
    }
    const str = String(rawVal).trim();
    if (!str || str === 'null' || str === 'undefined') return '';
    if ((str.startsWith('[') && str.endsWith(']')) || (str.startsWith('{') && str.endsWith('}'))) {
      try {
        const parsed = JSON.parse(str);
        return this.formatFieldValue(parsed);
      } catch (e) {}
    }
    return str;
  }

  /**
   * Normalize submitted form fields from DB rows or plain key/value object,
   * removing redundant contact/aadhaar alias duplicates injected by frontend submission wrappers.
   */
  normalizeSubmittedFields(fields = [], applicantContext = {}) {
    if (!fields) return [];
    const entries = [];
    if (Array.isArray(fields)) {
      for (const item of fields) {
        if (!item) continue;
        const rawKey = String(item.field_name || item.key || item.field_label || item.label || '').trim().toLowerCase();
        const label = this.formatFieldLabel(item.field_label || item.label || item.field_name || item.key || 'Field');
        const value = this.formatFieldValue(item.value !== undefined ? item.value : item.field_value);
        if (value) {
          entries.push({ rawKey, label, value, hasExplicitDef: Boolean(item.field_id) });
        }
      }
    } else if (typeof fields === 'object') {
      for (const [k, v] of Object.entries(fields)) {
        const value = this.formatFieldValue(v);
        if (value) {
          entries.push({ rawKey: String(k).trim().toLowerCase(), label: this.formatFieldLabel(k), value, hasExplicitDef: false });
        }
      }
    }

    const contactName = String(applicantContext.userName || '').trim().toLowerCase();
    const contactPhone = String(applicantContext.userPhone || '').replace(/\D/g, '');
    const contactEmail = String(applicantContext.userEmail || '').trim().toLowerCase();

    const nameAliases = new Set(['user_name', 'full_name', 'applicant_name', 'user name', 'full name', 'applicant name']);
    const phoneAliases = new Set(['user_phone', 'mobile_number', 'phone_number', 'user phone', 'mobile number', 'phone number']);
    const emailAliases = new Set(['user_email', 'email', 'user email']);
    const aadhaarAliases = new Set(['aadhaar_no', 'aadhaar_number', 'aadhaar no', 'aadhaar number']);

    const seenKeys = new Set();
    let seenAadhaar = false;
    const normalized = [];

    for (const entry of entries) {
      const keyNorm = entry.rawKey.replace(/\s+/g, ' ');
      const labelNorm = entry.label.trim().toLowerCase().replace(/\s+/g, ' ');
      const valNorm = entry.value.trim().toLowerCase();

      // Skip raw injected aliases that merely repeat the primary Applicant Contact block
      if (!entry.hasExplicitDef) {
        if ((nameAliases.has(keyNorm) || nameAliases.has(labelNorm)) && contactName && valNorm === contactName) continue;
        if ((emailAliases.has(keyNorm) || emailAliases.has(labelNorm)) && contactEmail && valNorm === contactEmail) continue;
        if ((phoneAliases.has(keyNorm) || phoneAliases.has(labelNorm)) && contactPhone && entry.value.replace(/\D/g, '') === contactPhone) continue;
      }

      // Deduplicate aadhaar_no / aadhaar_number alias pair
      if (aadhaarAliases.has(keyNorm) || aadhaarAliases.has(labelNorm)) {
        if (seenAadhaar) continue;
        seenAadhaar = true;
      }

      const dedupeSig = `${labelNorm}::${valNorm}`;
      if (seenKeys.has(dedupeSig)) continue;
      seenKeys.add(dedupeSig);

      normalized.push({ label: entry.label, value: entry.value });
    }

    return normalized;
  }

  /**
   * Format timestamp in IST (Asia/Kolkata)
   */
  formatDateIN(dateInput = null) {
    try {
      const dt = dateInput ? new Date(dateInput) : new Date();
      if (Number.isNaN(dt.getTime())) return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      return dt.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) + ' IST';
    } catch (e) {
      return new Date().toISOString();
    }
  }

  /**
   * Resolve validated SMTP credentials dynamically from env vars
   */
  getSmtpConfig() {
    const smtpUser = String(
      process.env.SMTP_USER ||
      process.env.GOOGLE_EMAIL ||
      process.env.GMAIL_USER ||
      DEFAULT_SMTP_USER
    ).trim();

    const rawPass = String(
      process.env.GOOGLE_APP_PASSWORD ||
      process.env.SMTP_PASS ||
      process.env.GMAIL_APP_PASSWORD ||
      DEFAULT_GOOGLE_APP_PASSWORD
    ).trim();
    const smtpPass = rawPass.replace(/\s+/g, '');

    const hasValidUser = this.isValidEmail(smtpUser);
    const isPlaceholderPass = !smtpPass || /^x+$/i.test(smtpPass) || smtpPass === 'your_app_password_here';

    return {
      configured: hasValidUser && !isPlaceholderPass,
      smtpUser,
      smtpPass
    };
  }

  /**
   * Resolve Admin recipient email(s) for service alerts
   */
  getAdminRecipients() {
    const rawAdminEmails = String(
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      process.env.ADMIN_EMAIL ||
      DEFAULT_ADMIN_EMAIL
    ).trim();

    const parsed = rawAdminEmails
      .split(/[;,]/)
      .map(e => e.trim())
      .filter(e => this.isValidEmail(e));

    if (parsed.length > 0) {
      return [...new Set(parsed)];
    }

    const { smtpUser } = this.getSmtpConfig();
    if (this.isValidEmail(smtpUser)) {
      return [smtpUser];
    }

    return [DEFAULT_ADMIN_EMAIL];
  }

  /**
   * Get or initialize Nodemailer transporter dynamically based on env config
   */
  getTransporter() {
    const { configured, smtpUser, smtpPass } = this.getSmtpConfig();
    if (!configured) {
      return null;
    }

    const smtpHost = (process.env.SMTP_HOST || '').trim();
    const smtpPort = Number(process.env.SMTP_PORT || 0);
    const cacheKey = `${smtpUser}|${smtpPass.length}|${smtpPass.slice(0, 3)}${smtpPass.slice(-3)}|${smtpHost}:${smtpPort}`;

    if (this.transporter && this._transporterCacheKey === cacheKey) {
      return this.transporter;
    }

    try {
      const transportOptions = smtpHost
        ? {
            host: smtpHost,
            port: smtpPort || 465,
            secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : (smtpPort || 465) === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass
            }
          }
        : {
            service: 'gmail',
            auth: {
              user: smtpUser,
              pass: smtpPass
            }
          };

      this.transporter = nodemailer.createTransport(transportOptions);
      this._transporterCacheKey = cacheKey;
      return this.transporter;
    } catch (err) {
      console.warn('[NODEMAILER INIT WARNING]', err.message);
      this.transporter = null;
      this._transporterCacheKey = null;
      return null;
    }
  }

  /**
   * Interpolates template variables safely
   */
  replaceTemplateVariables(text, data = {}) {
    if (!text) return '';
    return String(text).replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
      if (data[key] !== undefined && data[key] !== null) {
        return String(data[key]);
      }
      return match;
    });
  }

  /**
   * Main citizen/system dispatch method
   */
  async sendNotification(db, {
    userId = null,
    adminId = null,
    applicationId = null,
    type,
    title,
    message,
    data = {},
    idempotencyKey = null,
    userEmail = null,
    userPhone = null
  }) {
    if (idempotencyKey) {
      const existingNotif = db.get('notifications', n => n.metadata && n.metadata.idempotencyKey === idempotencyKey);
      if (existingNotif) {
        console.log(`[NOTIFICATION] Skipped duplicate event with idempotencyKey: ${idempotencyKey}`);
        return existingNotif;
      }
    }

    let prefs = { inApp: true, email: true, sms: true, messaging: true };
    if (userId) {
      const userPrefRecord = db.get('user_notification_preferences', p => p.userId === Number(userId));
      if (userPrefRecord) {
        prefs = { ...prefs, ...userPrefRecord };
      }
    }

    const finalTitle = this.replaceTemplateVariables(title, data);
    const finalMessage = this.replaceTemplateVariables(message, data);
    const normalizedAppId = applicationId ? Number(applicationId) : (data.applicationId || data.application_id || null);

    let notifRecord = null;
    if (prefs.inApp) {
      notifRecord = db.insert('notifications', {
        userId: userId ? Number(userId) : null,
        user_id: userId ? Number(userId) : null,
        adminId: adminId ? Number(adminId) : null,
        admin_id: adminId ? Number(adminId) : null,
        applicationId: normalizedAppId ? Number(normalizedAppId) : null,
        application_id: normalizedAppId ? Number(normalizedAppId) : null,
        type,
        title: finalTitle,
        message: finalMessage,
        status: 'DELIVERED',
        isRead: 0,
        is_read: 0,
        createdAt: new Date().toISOString(),
        readAt: null,
        metadata: { ...data, idempotencyKey }
      });
    }

    // Async Dispatch to Channels with safety catches
    this.dispatchEmail(db, { userId, userEmail, title: finalTitle, message: finalMessage, type, data, prefs })
      .catch(err => console.error('[EMAIL DISPATCH ERROR]', err.message));
    this.dispatchSMS(db, { userId, userPhone, message: finalMessage, type, data, prefs })
      .catch(err => console.error('[SMS DISPATCH ERROR]', err.message));
    this.dispatchMessaging(db, { userId, userPhone, message: finalMessage, type, data, prefs })
      .catch(err => console.error('[MESSAGING DISPATCH ERROR]', err.message));

    return notifRecord;
  }

  /**
   * Dispatch In-App + Email Alert to Admin when a service form is submitted or payment completes
   */
  async sendAdminApplicationAlert(db, payload = {}, options = {}) {
    const {
      eventType = 'NEW_APPLICATION', // 'NEW_APPLICATION' | 'PAYMENT_CONFIRMED'
      applicationId = null,
      applicationNumber = 'ESV-2026-UNKNOWN',
      serviceName = 'Government Digital Service',
      serviceCategory = '',
      fee = 0,
      status = 'SUBMITTED',
      paymentStatus = 'PENDING',
      paymentMethod = '',
      transactionId = '',
      userId = null,
      userName = 'Citizen',
      userEmail = '',
      userPhone = '',
      submittedAt = new Date().toISOString(),
      submittedFields = [],
      uploadedDocuments = [],
      idempotencyKey = null
    } = payload;

    const isPaymentConfirmed = eventType === 'PAYMENT_CONFIRMED';
    const notifType = isPaymentConfirmed ? 'PAYMENT_SUCCESS' : 'APPLICATION_SUBMITTED';
    const resolvedIdempotencyKey = idempotencyKey || (
      isPaymentConfirmed
        ? `admin-payment-success-${applicationId || applicationNumber}-${transactionId || 'paid'}`
        : `admin-app-submit-${applicationId || applicationNumber}-${submittedAt || status}`
    );

    if (resolvedIdempotencyKey && db) {
      const existingNotif = db.get('notifications', n => n.metadata && n.metadata.idempotencyKey === resolvedIdempotencyKey);
      if (existingNotif) {
        console.log(`[ADMIN ALERT] Skipped duplicate event with idempotencyKey: ${resolvedIdempotencyKey}`);
        return { notifRecord: existingNotif, skipped: true };
      }
    }

    const numericFee = Number(fee) || 0;
    const feeLabel = numericFee > 0 ? `₹${numericFee.toFixed(2).replace(/\.00$/, '')}` : 'FREE';
    const normalizedFields = this.normalizeSubmittedFields(submittedFields, { userName, userPhone, userEmail });
    const docsList = Array.isArray(uploadedDocuments) ? uploadedDocuments : [];

    const notifTitle = isPaymentConfirmed
      ? `Payment Confirmed (${feeLabel}): ${serviceName} (${applicationNumber})`
      : `New Application: ${serviceName} (${applicationNumber})`;

    const notifMessage = isPaymentConfirmed
      ? `${userName} (${userPhone || 'N/A'}) completed ${feeLabel} payment for ${serviceName}. Status: ${status}${transactionId ? ` • Txn: ${transactionId}` : ''}.`
      : `${userName} (${userPhone || 'N/A'}) filled form for ${serviceName}. Fee: ${feeLabel} (${paymentStatus}) • Docs: ${docsList.length} • Status: ${status}.`;

    let notifRecord = null;
    if (db) {
      notifRecord = db.insert('notifications', {
        userId: null,
        user_id: null,
        adminId: 1,
        admin_id: 1,
        applicationId: applicationId ? Number(applicationId) : null,
        application_id: applicationId ? Number(applicationId) : null,
        type: notifType,
        title: notifTitle,
        message: notifMessage,
        status: 'DELIVERED',
        isRead: 0,
        is_read: 0,
        createdAt: new Date().toISOString(),
        readAt: null,
        metadata: {
          applicationId,
          applicationNumber,
          serviceName,
          serviceCategory,
          fee: numericFee,
          paymentStatus,
          userId,
          userName,
          userEmail,
          userPhone,
          transactionId: transactionId || null,
          idempotencyKey: resolvedIdempotencyKey
        }
      });
    }

    const emailSubject = isPaymentConfirmed
      ? `[E-Connect Payment Confirmed] ${serviceName} - ${applicationNumber} (${feeLabel} PAID)`
      : `[E-Connect New Application] ${serviceName} - ${applicationNumber} (${userName})`;

    const emailData = {
      eventType,
      applicationId,
      applicationNumber,
      serviceName,
      serviceCategory,
      fee: numericFee,
      feeLabel,
      status,
      paymentStatus,
      paymentMethod,
      transactionId,
      userId,
      userName,
      userEmail,
      userPhone,
      submittedAt,
      submittedFields: normalizedFields,
      uploadedDocuments: docsList
    };

    const htmlBody = this.generateAdminEmailHtml(emailData);
    const textBody = this.generateAdminEmailText(emailData);
    const adminRecipients = this.getAdminRecipients();

    const deliveryPromise = this.dispatchRawEmail(db, {
      to: adminRecipients,
      replyTo: this.isValidEmail(userEmail) ? userEmail.trim() : undefined,
      subject: emailSubject,
      text: textBody,
      html: htmlBody,
      template: isPaymentConfirmed ? 'ADMIN_PAYMENT_CONFIRMED' : 'ADMIN_NEW_APPLICATION'
    }).catch(err => {
      console.error('[ADMIN EMAIL DISPATCH ERROR]', err.message);
      return null;
    });

    if (options.waitForDelivery || process.env.VERCEL) {
      const deliveryRecord = await deliveryPromise;
      return { notifRecord, deliveryRecord };
    }

    return { notifRecord, deliveryPromise };
  }

  /**
   * Generate Admin HTML Email Body for Service Form Submissions & Payment Confirmations
   */
  generateAdminEmailHtml(data = {}) {
    const isPaymentConfirmed = data.eventType === 'PAYMENT_CONFIRMED';
    const appNumber = this.escapeHtml(data.applicationNumber || 'ESV-2026-UNKNOWN');
    const serviceName = this.escapeHtml(data.serviceName || 'Government Digital Service');
    const serviceCategory = this.escapeHtml(data.serviceCategory || 'Digital Service');
    const status = this.escapeHtml(data.status || 'SUBMITTED');
    const feeLabel = this.escapeHtml(data.feeLabel || 'FREE');
    const paymentStatus = this.escapeHtml(data.paymentStatus || 'PENDING');
    const paymentMethod = this.escapeHtml(data.paymentMethod || '');
    const transactionId = this.escapeHtml(data.transactionId || '');
    const userName = this.escapeHtml(data.userName || 'Citizen');
    const userEmail = this.escapeHtml(data.userEmail || 'Not provided');
    const userPhone = this.escapeHtml(data.userPhone || 'Not provided');
    const applicantType = data.userId ? `Registered Citizen (ID #${this.escapeHtml(data.userId)})` : 'Guest Applicant (No Login)';
    const dateStr = this.escapeHtml(this.formatDateIN(data.submittedAt));

    const fields = Array.isArray(data.submittedFields) ? data.submittedFields : [];
    const docs = Array.isArray(data.uploadedDocuments) ? data.uploadedDocuments : [];

    const bannerStyle = isPaymentConfirmed
      ? 'background-color: #ecfdf5; color: #065f46; border-bottom: 2px solid #a7f3d0;'
      : 'background-color: #fff7ed; color: #9a3412; border-bottom: 2px solid #fed7aa;';
    const bannerText = isPaymentConfirmed
      ? `✅ ONLINE PAYMENT CONFIRMED (${feeLabel} PAID) — READY FOR PROCESSING`
      : `🔔 NEW SERVICE FORM SUBMISSION RECEIVED (${paymentStatus === 'PENDING' ? `${feeLabel} • PAYMENT INITIATED` : feeLabel})`;

    const fieldRowsHtml = fields.length > 0
      ? fields.map((f, idx) => `
          <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
            <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 700; color: #475569; width: 42%; vertical-align: top;">
              ${this.escapeHtml(f.label)}
            </td>
            <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #0f172a; word-break: break-word;">
              ${this.escapeHtml(f.value)}
            </td>
          </tr>
        `).join('')
      : `
          <tr>
            <td colspan="2" style="padding: 12px; font-size: 12px; color: #64748b; text-align: center;">
              No additional dynamic form fields submitted (applicant contact details captured above).
            </td>
          </tr>
        `;

    const docRowsHtml = docs.length > 0
      ? docs.map((d, idx) => {
          const dName = this.escapeHtml(d.document_name || d.name || `Document ${idx + 1}`);
          const origName = this.escapeHtml(d.original_filename || d.stored_filename || 'Attached File');
          const fileUrl = d.file_path && String(d.file_path).startsWith('http')
            ? `<a href="${this.escapeHtml(d.file_path)}" target="_blank" style="color: #ea580c; font-weight: 700; text-decoration: none;">Open File</a>`
            : `<span style="color: #64748b; font-size: 11px;">Available in Admin Workspace</span>`;
          return `
            <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
              <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 700; color: #334155;">${dName}</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #475569;">${origName}</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: right;">${fileUrl}</td>
            </tr>
          `;
        }).join('')
      : `
          <tr>
            <td colspan="3" style="padding: 12px; font-size: 12px; color: #64748b; text-align: center;">
              No supporting documents attached in this submission.
            </td>
          </tr>
        `;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(serviceName)} - ${appNumber}</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b;">
  <div style="max-width: 660px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);">
    <div style="background: #0b192c; padding: 24px; text-align: center; color: #ffffff;">
      <h1 style="font-size: 22px; font-weight: 900; margin: 0; color: #ffffff;">EConnect <span style="color: #f97316;">Admin Alert</span></h1>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-top: 6px; font-weight: 700;">
        Digital E-Seva Service Form Notification
      </div>
    </div>

    <div style="padding: 12px 20px; text-align: center; font-size: 12px; font-weight: 800; ${bannerStyle}">
      ${bannerText}
    </div>

    <div style="padding: 24px;">
      <!-- Service & Reference Overview -->
      <table style="width: 100%; border-collapse: collapse; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; margin-bottom: 20px;">
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px dashed #cbd5e1; font-size: 12px; color: #64748b; font-weight: 700; width: 38%;">Application Ref No</td>
          <td style="padding: 10px 14px; border-bottom: 1px dashed #cbd5e1; font-size: 14px; color: #ea580c; font-weight: 900; font-family: monospace;">${appNumber}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px dashed #cbd5e1; font-size: 12px; color: #64748b; font-weight: 700;">Selected Service</td>
          <td style="padding: 10px 14px; border-bottom: 1px dashed #cbd5e1; font-size: 13px; color: #0f172a; font-weight: 800;">
            ${serviceName} ${serviceCategory ? `<span style="font-weight: 600; color: #64748b;">(${serviceCategory})</span>` : ''}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px dashed #cbd5e1; font-size: 12px; color: #64748b; font-weight: 700;">Application Status</td>
          <td style="padding: 10px 14px; border-bottom: 1px dashed #cbd5e1; font-size: 13px; font-weight: 800; color: ${isPaymentConfirmed || status === 'SUBMITTED' ? '#15803d' : '#b45309'};">${status}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px dashed #cbd5e1; font-size: 12px; color: #64748b; font-weight: 700;">Service Fee & Payment</td>
          <td style="padding: 10px 14px; border-bottom: 1px dashed #cbd5e1; font-size: 13px; font-weight: 700; color: #0f172a;">
            ${feeLabel} • Payment Status: <span style="color: ${paymentStatus === 'PAID' || paymentStatus === 'FREE' ? '#15803d' : '#c2410c'};">${paymentStatus}</span>
            ${paymentMethod ? `<span style="color: #64748b; font-weight: 500;"> (${paymentMethod})</span>` : ''}
          </td>
        </tr>
        ${transactionId ? `
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px dashed #cbd5e1; font-size: 12px; color: #64748b; font-weight: 700;">Transaction ID</td>
          <td style="padding: 10px 14px; border-bottom: 1px dashed #cbd5e1; font-size: 12px; font-family: monospace; color: #0f172a;">${transactionId}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 10px 14px; font-size: 12px; color: #64748b; font-weight: 700;">Submitted Time</td>
          <td style="padding: 10px 14px; font-size: 12px; font-weight: 600; color: #334155;">${dateStr}</td>
        </tr>
      </table>

      <!-- Applicant Details -->
      <h3 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.8px; color: #0b192c;">Applicant Contact Details</h3>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; margin-bottom: 20px;">
        <tr style="background-color: #ffffff;">
          <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 700; color: #475569; width: 42%;">Applicant Name</td>
          <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 800; color: #0f172a;">${userName}</td>
        </tr>
        <tr style="background-color: #f8fafc;">
          <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 700; color: #475569;">Mobile Number</td>
          <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700;">
            ${data.userPhone ? `<a href="tel:${userPhone}" style="color: #0284c7; text-decoration: none;">${userPhone}</a>` : userPhone}
          </td>
        </tr>
        <tr style="background-color: #ffffff;">
          <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 700; color: #475569;">Email Address</td>
          <td style="padding: 9px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600;">
            ${this.isValidEmail(data.userEmail) ? `<a href="mailto:${userEmail}" style="color: #0284c7; text-decoration: none;">${userEmail}</a>` : userEmail}
          </td>
        </tr>
        <tr style="background-color: #f8fafc;">
          <td style="padding: 9px 12px; font-size: 12px; font-weight: 700; color: #475569;">Account Mode</td>
          <td style="padding: 9px 12px; font-size: 12px; font-weight: 600; color: #334155;">${applicantType}</td>
        </tr>
      </table>

      <!-- Submitted Service Form Fields -->
      <h3 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.8px; color: #0b192c;">Submitted Form Details</h3>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; margin-bottom: 20px;">
        ${fieldRowsHtml}
      </table>

      <!-- Uploaded Documents -->
      <h3 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.8px; color: #0b192c;">Uploaded Documents (${docs.length})</h3>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; margin-bottom: 24px;">
        ${docRowsHtml}
      </table>

      <div style="text-align: center; margin: 22px 0 8px 0;">
        <a href="https://econnecthub.com/admin" target="_blank" style="display: inline-block; background-color: #f97316; color: #ffffff !important; text-decoration: none; padding: 12px 26px; border-radius: 10px; font-weight: 800; font-size: 14px;">
          Open Admin Dashboard
        </a>
      </div>
    </div>

    <div style="background: #f8fafc; padding: 16px 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
      Automated Admin Notification • <strong>EConnect Digital Services Portal</strong>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Generate Admin Plain-Text Email Fallback
   */
  generateAdminEmailText(data = {}) {
    const isPaymentConfirmed = data.eventType === 'PAYMENT_CONFIRMED';
    const fields = Array.isArray(data.submittedFields) ? data.submittedFields : [];
    const docs = Array.isArray(data.uploadedDocuments) ? data.uploadedDocuments : [];

    const lines = [
      isPaymentConfirmed ? '=== ECONNECT PAYMENT CONFIRMED ===' : '=== ECONNECT NEW SERVICE APPLICATION ===',
      `Application Ref : ${data.applicationNumber || 'N/A'}`,
      `Service Name    : ${data.serviceName || 'N/A'}${data.serviceCategory ? ` (${data.serviceCategory})` : ''}`,
      `Status          : ${data.status || 'SUBMITTED'}`,
      `Fee / Payment   : ${data.feeLabel || 'FREE'} (${data.paymentStatus || 'PENDING'})`,
      ...(data.transactionId ? [`Transaction ID  : ${data.transactionId}`] : []),
      `Submitted At    : ${this.formatDateIN(data.submittedAt)}`,
      '',
      '--- Applicant Details ---',
      `Name  : ${data.userName || 'Citizen'}`,
      `Phone : ${data.userPhone || 'N/A'}`,
      `Email : ${data.userEmail || 'N/A'}`,
      `Type  : ${data.userId ? `Registered User #${data.userId}` : 'Guest Applicant'}`,
      '',
      '--- Submitted Form Fields ---',
      ...(fields.length > 0 ? fields.map(f => `${f.label}: ${f.value}`) : ['No additional custom fields entered.']),
      '',
      `--- Uploaded Documents (${docs.length}) ---`,
      ...(docs.length > 0
        ? docs.map((d, i) => `${i + 1}. ${d.document_name || 'Document'} (${d.original_filename || d.stored_filename || 'File'})`)
        : ['No documents attached.']),
      '',
      'Admin Dashboard: https://econnecthub.com/admin'
    ];

    return lines.join('\n');
  }

  /**
   * Generate HTML Email Body for Citizen Status Updates & Rejection Alerts
   */
  generateEmailHtml({ type, title, message, data = {} }) {
    const appNumber = this.escapeHtml(data.applicationNumber || data.application_number || 'ESV-2026-UNKNOWN');
    const serviceName = this.escapeHtml(data.serviceName || data.service_name || 'Government Digital Service');
    const userName = this.escapeHtml(data.userName || data.user_name || 'Respected Citizen');
    const safeTitle = this.escapeHtml(title || 'EConnect Portal Notification');
    const safeMessage = this.escapeHtml(message || 'Your application status has been updated.');
    const remarks = this.escapeHtml(data.remarks || data.rejectionReason || message || 'Document or application details require correction.');
    const dateStr = this.escapeHtml(this.formatDateIN());

    const isRejection = type === 'APPLICATION_REJECTED' || type === 'DOCUMENT_REJECTED';
    const isSuccess = type === 'PAYMENT_SUCCESS' || type === 'APPLICATION_SUBMITTED' || type === 'APPLICATION_APPROVED' || type === 'CERTIFICATE_ISSUED';
    const bannerLabel = isRejection
      ? '⚠️ APPLICATION REJECTED / விண்ணப்பம் நிராகரிக்கப்பட்டது'
      : type === 'PAYMENT_SUCCESS'
      ? '✅ PAYMENT CONFIRMED / கட்டணம் உறுதி செய்யப்பட்டது'
      : type === 'APPLICATION_SUBMITTED'
      ? '📩 APPLICATION SUBMITTED / விண்ணப்பம் சமர்ப்பிக்கப்பட்டது'
      : isSuccess
      ? '✅ APPLICATION APPROVED / விண்ணப்பம் அங்கீகரிக்கப்பட்டது'
      : 'ℹ️ APPLICATION STATUS UPDATE';

    const statusText = this.escapeHtml(isRejection ? 'REJECTED' : data.status || 'Updated');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
    .header { background: #0b192c; padding: 28px 24px; text-align: center; color: #ffffff; }
    .header-logo { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; margin: 0; color: #ffffff; }
    .header-logo span { color: #f97316; }
    .header-subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-top: 6px; font-weight: 700; }
    .banner { padding: 12px 24px; text-align: center; font-size: 13px; font-weight: 800; ${isRejection ? 'background-color: #fef2f2; color: #991b1b; border-bottom: 1px solid #fecaca;' : 'background-color: #f0fdf4; color: #166534; border-bottom: 1px solid #bbf7d0;'} }
    .content { padding: 28px 24px; }
    .salutation { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
    .message-text { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 20px; }
    .details-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; margin-bottom: 24px; }
    .details-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 13px; }
    .details-row:last-child { border-bottom: none; }
    .label { font-weight: 600; color: #64748b; }
    .value { font-weight: 700; color: #0f172a; }
    .rejection-card { background: #fff5f5; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
    .rejection-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #991b1b; margin-bottom: 6px; }
    .rejection-reason { font-size: 13px; color: #7f1d1d; font-weight: 600; line-height: 1.5; }
    .btn-container { text-align: center; margin: 28px 0 16px 0; }
    .btn { display: inline-block; background-color: #f97316; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 800; font-size: 14px; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3); }
    .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .footer strong { color: #334155; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="header-logo">e-Seva <span>TN Portal</span></h1>
      <div class="header-subtitle">EConnect Digital Services • Citizen Services Platform</div>
    </div>

    <div class="banner">
      ${bannerLabel}
    </div>

    <div class="content">
      <div class="salutation">Dear ${userName},</div>
      
      <p class="message-text">
        ${isRejection
          ? `We regret to inform you that your application <strong>${appNumber}</strong> for <strong>${serviceName}</strong> has been <strong>REJECTED</strong> after administrative verification.`
          : safeMessage}
      </p>

      <div class="details-box">
        <div class="details-row">
          <span class="label">Application Ref Number:</span>
          <span class="value" style="color: #f97316; font-family: monospace;">${appNumber}</span>
        </div>
        <div class="details-row">
          <span class="label">Service Name:</span>
          <span class="value">${serviceName}</span>
        </div>
        <div class="details-row">
          <span class="label">Current Status:</span>
          <span class="value" style="${isRejection ? 'color: #dc2626;' : 'color: #16a34a;'} font-weight: 900;">${statusText}</span>
        </div>
        <div class="details-row">
          <span class="label">Date & Time:</span>
          <span class="value">${dateStr}</span>
        </div>
      </div>

      ${isRejection ? `
      <div class="rejection-card">
        <div class="rejection-title">Reason for Rejection / நிராகரிப்புக்கான காரணம்:</div>
        <div class="rejection-reason">${remarks}</div>
      </div>

      <p class="message-text" style="font-size: 12px; color: #64748b;">
        <strong>What should you do next?</strong><br>
        Please log in to your EConnect Portal dashboard, check your document uploads, correct the required fields or supporting documents as specified by the admin officer, and submit a new application.
      </p>
      ` : ''}

      <div class="btn-container">
        <a href="https://econnecthub.com/track" class="btn" target="_blank">Track Application on EConnect</a>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;">This is an automated transactional email sent by <strong>EConnect Digital Services</strong>.</p>
      <p style="margin: 0;">For assistance, call <strong>+91 98940 59591</strong> or email support at <strong>econnectshopping@gmail.com</strong>.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Low-level Nodemailer delivery & logging helper
   */
  async dispatchRawEmail(db, { to, replyTo = undefined, subject, text, html, template }) {
    const recipientsList = Array.isArray(to) ? to : [to];
    const validRecipients = recipientsList
      .map(r => (typeof r === 'string' ? r.trim() : ''))
      .filter(r => this.isValidEmail(r));

    if (validRecipients.length === 0) {
      console.log(`[EMAIL SKIPPED] No valid recipient configured for template=${template}`);
      return null;
    }

    const toHeader = validRecipients.join(', ');
    const { smtpUser } = this.getSmtpConfig();
    const senderEmail = this.isValidEmail(smtpUser) ? smtpUser : 'noreply@econnecthub.com';

    let status = 'SIMULATED';
    let failureReason = null;
    let messageId = null;

    const transporter = this.getTransporter();
    if (transporter) {
      try {
        const mailOptions = {
          from: `"EConnect Digital Services" <${senderEmail}>`,
          to: toHeader,
          subject: subject || 'EConnect Digital Services Notification',
          text: text || subject || '',
          html
        };
        if (replyTo && this.isValidEmail(replyTo)) {
          mailOptions.replyTo = replyTo;
        }
        const info = await transporter.sendMail(mailOptions);
        status = 'SENT';
        messageId = info.messageId || null;
        console.log(`✅ [NODEMAILER EMAIL SENT] Template: ${template} | To: ${toHeader} | MessageID: ${info.messageId}`);
      } catch (sendErr) {
        status = 'FAILED';
        failureReason = sendErr.message;
        console.error(`❌ [NODEMAILER EMAIL ERROR] Template: ${template} | To: ${toHeader} | Error:`, sendErr.message);
      }
    } else {
      console.log(`[EMAIL DISPATCH (LOG ONLY - Set SMTP_USER & GOOGLE_APP_PASSWORD to send real emails)] To: ${toHeader} | Subject: "${subject}"`);
    }

    if (db) {
      try {
        return db.insert('notification_delivery_logs', {
          recipient: toHeader,
          channel: 'EMAIL',
          template,
          status,
          messageId,
          attempts: 1,
          sentAt: new Date().toISOString(),
          failureReason
        });
      } catch (dbErr) {
        console.warn('[NOTIFICATION LOG WARNING]', dbErr.message);
      }
    }
    return { recipient: toHeader, channel: 'EMAIL', template, status, messageId, failureReason };
  }

  /**
   * Citizen Email Delivery Queue Handler with Nodemailer Integration
   */
  async dispatchEmail(db, { userId, userEmail, title, message, type, data = {}, prefs = {} }) {
    if (!prefs.email && type !== 'PAYMENT_SUCCESS' && type !== 'APPLICATION_SUBMITTED' && type !== 'APPLICATION_REJECTED') {
      return null;
    }

    const candidateRecipient = userEmail || data.userEmail || '';
    if (!this.isValidEmail(candidateRecipient)) {
      return null;
    }

    const htmlBody = this.generateEmailHtml({ type, title, message, data });
    const appNum = data.applicationNumber || data.application_number || '';
    const subject = title || `EConnect Portal Notification${appNum ? `: ${appNum}` : ''}`;

    return this.dispatchRawEmail(db, {
      to: candidateRecipient,
      subject,
      text: message || subject,
      html: htmlBody,
      template: type || 'GENERAL_NOTIFICATION'
    });
  }

  /**
   * Provider-Independent SMS Delivery Adapter
   */
  async dispatchSMS(db, { userId, userPhone, message, type, data = {}, prefs = {} }) {
    if (!prefs.sms) return;
    const phone = userPhone || data.userPhone || '';
    if (!phone) return;

    const safeMsg = String(message || '').substring(0, 100);
    const deliveryRecord = db.insert('notification_delivery_logs', {
      recipient: phone,
      channel: 'SMS',
      template: type,
      status: 'SENT',
      attempts: 1,
      sentAt: new Date().toISOString(),
      failureReason: null
    });

    console.log(`[SMS DISPATCH] To: ${phone} | SMS Text: "E-SEVA: ${safeMsg}"`);
    return deliveryRecord;
  }

  /**
   * Messaging / WhatsApp Channel Adapter
   */
  async dispatchMessaging(db, { userId, userPhone, message, type, data = {}, prefs = {} }) {
    if (!prefs.messaging) return;
    const phone = userPhone || data.userPhone || '';
    if (!phone) return;

    const safeMsg = String(message || '').substring(0, 100);
    db.insert('notification_delivery_logs', {
      recipient: phone,
      channel: 'WHATSAPP',
      template: type,
      status: 'SENT',
      attempts: 1,
      sentAt: new Date().toISOString(),
      failureReason: null
    });

    console.log(`[WHATSAPP DISPATCH] To: ${phone} | WhatsApp: "${safeMsg}"`);
  }
}

export default new NotificationService();
