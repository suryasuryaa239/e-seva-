import pool from './mysql_db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db_data.json');

async function cleanAllDummyData() {
  console.log('🧹 [CLEANUP] Purging all dummy applications, document audit logs, and test users from TiDB Cloud MySQL & Local DB...');

  try {
    const conn = await pool.getConnection();
    try {
      // 1. Wipe applications & related tables from TiDB Cloud
      await conn.query(`TRUNCATE TABLE applications;`).catch(() => conn.query(`DELETE FROM applications;`));
      await conn.query(`TRUNCATE TABLE application_field_values;`).catch(() => conn.query(`DELETE FROM application_field_values;`));
      await conn.query(`TRUNCATE TABLE application_documents;`).catch(() => conn.query(`DELETE FROM application_documents;`));
      await conn.query(`TRUNCATE TABLE payments;`).catch(() => conn.query(`DELETE FROM payments;`));
      await conn.query(`TRUNCATE TABLE document_audit_history;`).catch(() => conn.query(`DELETE FROM document_audit_history;`));
      await conn.query(`TRUNCATE TABLE notifications;`).catch(() => conn.query(`DELETE FROM notifications;`));
      await conn.query(`TRUNCATE TABLE contact_messages;`).catch(() => conn.query(`DELETE FROM contact_messages;`));

      // 2. Wipe non-admin test users from TiDB Cloud
      await conn.query(`DELETE FROM users WHERE email NOT LIKE '%admin%';`);

      console.log('🎉 [TiDB CLOUD] Successfully purged dummy applications, document audits, contact messages, and test users from TiDB Cloud MySQL!');
    } finally {
      conn.release();
    }
  } catch (err) {
    console.warn('⚠️ [TiDB CLOUD CLEANUP WARNING]:', err.message);
  }

  // 3. Clean local db_data.json file
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const data = JSON.parse(raw);

      data.applications = [];
      data.application_field_values = [];
      data.application_documents = [];
      data.payments = [];
      data.document_audit_history = [];
      data.notifications = [];
      data.contact_messages = [];

      data.users = (data.users || []).filter(u => 
        u.is_admin === 1 || 
        u.is_admin === true || 
        (u.email && u.email.toLowerCase().includes('admin'))
      );

      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
      console.log('✅ Local db_data.json file cleaned and saved successfully!');
    }
  } catch (err) {
    console.error('Failed to clean local db_data.json:', err.message);
  }

  process.exit(0);
}

cleanAllDummyData();
