import pool from './mysql_db.js';

export async function runSchemaMigration() {
  const conn = await pool.getConnection();
  try {
    console.log('[MIGRATION] Checking and altering TiDB tables...');

    const appCols = [
      'ADD COLUMN IF NOT EXISTS user_name VARCHAR(255)',
      'ADD COLUMN IF NOT EXISTS user_email VARCHAR(255)',
      'ADD COLUMN IF NOT EXISTS user_phone VARCHAR(50)',
      'ADD COLUMN IF NOT EXISTS total_fee DECIMAL(10, 2) DEFAULT 0.00',
      'ADD COLUMN IF NOT EXISTS admin_remarks TEXT',
      'ADD COLUMN IF NOT EXISTS current_step INT DEFAULT 1',
      'ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP NULL',
      'ADD COLUMN IF NOT EXISTS certificate_url TEXT',
      'ADD COLUMN IF NOT EXISTS certificate_generated_at TIMESTAMP NULL',
      'ADD COLUMN IF NOT EXISTS field_values JSON',
      'ADD COLUMN IF NOT EXISTS payment_transaction_id VARCHAR(100)'
    ];
    for (const col of appCols) {
      try {
        await conn.query(`ALTER TABLE applications ${col}`);
      } catch (e) {
        console.warn('applications col warning:', col, e.message);
      }
    }

    const userCols = [
      'ADD COLUMN IF NOT EXISTS aadhaar_no VARCHAR(50)',
      'ADD COLUMN IF NOT EXISTS address TEXT',
      'ADD COLUMN IF NOT EXISTS district VARCHAR(100)',
      'ADD COLUMN IF NOT EXISTS pincode VARCHAR(20)',
      "ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'",
      'ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)'
    ];
    for (const col of userCols) {
      try {
        await conn.query(`ALTER TABLE users ${col}`);
      } catch (e) {
        console.warn('users col warning:', col, e.message);
      }
    }

    const paymentCols = [
      'ADD COLUMN IF NOT EXISTS application_id INT',
      "ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR'",
      'ADD COLUMN IF NOT EXISTS payment_gateway VARCHAR(50)',
      'ADD COLUMN IF NOT EXISTS payment_order_id VARCHAR(100)',
      'ADD COLUMN IF NOT EXISTS payment_transaction_id VARCHAR(100)',
      'ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50)',
      'ADD COLUMN IF NOT EXISTS initiated_at TIMESTAMP NULL',
      'ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP NULL',
      'ADD COLUMN IF NOT EXISTS metadata JSON'
    ];
    for (const col of paymentCols) {
      try {
        await conn.query(`ALTER TABLE payments ${col}`);
      } catch (e) {
        console.warn('payments col warning:', col, e.message);
      }
    }

    const notifCols = [
      'ADD COLUMN IF NOT EXISTS application_id INT',
      'ADD COLUMN IF NOT EXISTS admin_id INT',
      'ADD COLUMN IF NOT EXISTS metadata JSON'
    ];
    for (const col of notifCols) {
      try {
        await conn.query(`ALTER TABLE notifications ${col}`);
      } catch (e) {
        console.warn('notifications col warning:', col, e.message);
      }
    }

    console.log('✅ [MIGRATION] All tables successfully upgraded on TiDB Cloud MySQL!');
  } finally {
    conn.release();
  }
}

if (process.argv[1] && process.argv[1].includes('migrate_schema.js')) {
  runSchemaMigration().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
