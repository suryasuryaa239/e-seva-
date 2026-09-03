/**
 * E-Seva Enterprise Multi-Channel Notification Service
 * Supports In-App, SMS, Email, and Messaging Channels with dynamic variable interpolation,
 * delivery logging, idempotency checks, and user preference enforcement.
 */

class NotificationService {
  /**
   * Interpolates template variables safely
   * Variables: {{userName}}, {{applicationId}}, {{serviceName}}, {{status}}, {{amount}}, {{transactionId}}, {{documentName}}, {{rejectionReason}}, {{trackUrl}}
   */
  replaceTemplateVariables(text, data = {}) {
    if (!text) return '';
    return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
      if (data[key] !== undefined && data[key] !== null) {
        return data[key];
      }
      return match; // Leave unrecognized variables intact safely
    });
  }

  /**
   * Main dispatch method
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
    // 1. Idempotency Check (Prevent duplicate notifications for identical events)
    if (idempotencyKey) {
      const existingNotif = db.get('notifications', n => n.metadata && n.metadata.idempotencyKey === idempotencyKey);
      if (existingNotif) {
        console.log(`[NOTIFICATION] Skipped duplicate event with idempotencyKey: ${idempotencyKey}`);
        return existingNotif;
      }
    }

    // 2. Check User Preferences (if userId provided)
    let prefs = { inApp: true, email: true, sms: true, messaging: true };
    if (userId) {
      const userPrefRecord = db.get('user_notification_preferences', p => p.userId === Number(userId));
      if (userPrefRecord) {
        prefs = { ...prefs, ...userPrefRecord };
      }
    }

    // Interpolate Variables
    const finalTitle = this.replaceTemplateVariables(title, data);
    const finalMessage = this.replaceTemplateVariables(message, data);

    // 3. Create In-App Notification Record in Database
    let notifRecord = null;
    if (prefs.inApp) {
      notifRecord = db.insert('notifications', {
        userId: userId ? Number(userId) : null,
        adminId: adminId ? Number(adminId) : null,
        applicationId: applicationId ? Number(applicationId) : (data.applicationId || null),
        type,
        title: finalTitle,
        message: finalMessage,
        status: 'DELIVERED',
        isRead: 0,
        createdAt: new Date().toISOString(),
        readAt: null,
        metadata: { ...data, idempotencyKey }
      });
    }

    // 4. Async Dispatch to Channels (Email / SMS / Messaging Log)
    this.dispatchEmail(db, { userId, userEmail, title: finalTitle, message: finalMessage, type, data, prefs });
    this.dispatchSMS(db, { userId, userPhone, message: finalMessage, type, data, prefs });
    this.dispatchMessaging(db, { userId, userPhone, message: finalMessage, type, data, prefs });

    return notifRecord;
  }

  /**
   * Email Delivery Queue Handler
   */
  async dispatchEmail(db, { userId, userEmail, title, message, type, data, prefs }) {
    if (!prefs.email && type !== 'PAYMENT_SUCCESS' && type !== 'APPLICATION_SUBMITTED') return;

    const emailRecipient = userEmail || data.userEmail || 'customer@eseva.gov.in';
    const deliveryRecord = db.insert('notification_delivery_logs', {
      recipient: emailRecipient,
      channel: 'EMAIL',
      template: type,
      status: 'SENT',
      attempts: 1,
      sentAt: new Date().toISOString(),
      failureReason: null
    });

    console.log(`[EMAIL DISPATCH] To: ${emailRecipient} | Subject: "${title}" | Body: "${message.substring(0, 80)}..."`);
    return deliveryRecord;
  }

  /**
   * Provider-Independent SMS Delivery Adapter
   */
  async dispatchSMS(db, { userId, userPhone, message, type, data, prefs }) {
    if (!prefs.sms) return;

    const phone = userPhone || data.userPhone || '+91-9876543210';
    const deliveryRecord = db.insert('notification_delivery_logs', {
      recipient: phone,
      channel: 'SMS',
      template: type,
      status: 'SENT',
      attempts: 1,
      sentAt: new Date().toISOString(),
      failureReason: null
    });

    console.log(`[SMS DISPATCH] To: ${phone} | SMS Text: "E-SEVA: ${message.substring(0, 100)}"`);
    return deliveryRecord;
  }

  /**
   * Messaging / WhatsApp Channel Adapter
   */
  async dispatchMessaging(db, { userId, userPhone, message, type, data, prefs }) {
    if (!prefs.messaging) return;

    const phone = userPhone || data.userPhone || '+91-9876543210';
    db.insert('notification_delivery_logs', {
      recipient: phone,
      channel: 'WHATSAPP',
      template: type,
      status: 'SENT',
      attempts: 1,
      sentAt: new Date().toISOString(),
      failureReason: null
    });

    console.log(`[WHATSAPP DISPATCH] To: ${phone} | WhatsApp: "${message.substring(0, 100)}"`);
  }
}

export default new NotificationService();
