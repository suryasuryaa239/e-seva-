import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: parseInt(process.env.DB_PORT || '4000', 10),
  user: process.env.DB_USER || '2jfg5VSYFYcSWGr.root',
  password: process.env.DB_PASSWORD || 'fbKhrByYkqOlhF6S',
  database: process.env.DB_NAME || 'esevai',
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log(`[DB CONFIG] Connecting to TiDB Cloud Host: ${dbConfig.host}:${dbConfig.port}, User: ${dbConfig.user}, Database: ${dbConfig.database}`);

export const pool = mysql.createPool(dbConfig);

// Helper function to test connectivity and create tables
export async function initializeDatabaseSchema() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✅ [TiDB CLOUD] Successfully connected to TiDB MySQL Database!');

    // Create Tables if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(50),
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'citizen',
        aadhaar_no VARCHAR(50),
        address TEXT,
        district VARCHAR(100),
        pincode VARCHAR(20),
        status VARCHAR(50) DEFAULT 'active',
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        department VARCHAR(255) DEFAULT 'General Administration',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        icon VARCHAR(100),
        badge VARCHAR(100),
        service_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT,
        category_slug VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        fee DECIMAL(10, 2) DEFAULT 0.00,
        processing_time VARCHAR(100),
        documents_required JSON,
        eligibility JSON,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        application_number VARCHAR(100) NOT NULL UNIQUE,
        user_id INT,
        applicant_name VARCHAR(255),
        applicant_email VARCHAR(255),
        applicant_phone VARCHAR(50),
        user_name VARCHAR(255),
        user_email VARCHAR(255),
        user_phone VARCHAR(50),
        service_id INT,
        service_name VARCHAR(255),
        service_slug VARCHAR(255),
        status VARCHAR(50) DEFAULT 'SUBMITTED',
        fee_amount DECIMAL(10, 2) DEFAULT 0.00,
        total_fee DECIMAL(10, 2) DEFAULT 0.00,
        payment_status VARCHAR(50) DEFAULT 'Paid',
        payment_id VARCHAR(100),
        payment_transaction_id VARCHAR(100),
        current_step INT DEFAULT 1,
        form_data JSON,
        field_values JSON,
        documents JSON,
        rejection_reason TEXT,
        remarks TEXT,
        admin_remarks TEXT,
        certificate_url TEXT,
        certificate_generated_at TIMESTAMP NULL,
        submitted_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        payment_id VARCHAR(100),
        application_id INT,
        application_number VARCHAR(100),
        user_id INT,
        amount DECIMAL(10, 2),
        currency VARCHAR(10) DEFAULT 'INR',
        payment_method VARCHAR(50),
        payment_gateway VARCHAR(50),
        payment_order_id VARCHAR(100),
        payment_transaction_id VARCHAR(100),
        payment_status VARCHAR(50),
        status VARCHAR(50),
        initiated_at TIMESTAMP NULL,
        completed_at TIMESTAMP NULL,
        metadata JSON,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT,
        status VARCHAR(50) DEFAULT 'Unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS career_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255),
        applicant_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        position VARCHAR(255),
        experience VARCHAR(100),
        resume_url TEXT,
        resume_file TEXT,
        status VARCHAR(50) DEFAULT 'Received',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        application_id INT,
        admin_id INT,
        title VARCHAR(255),
        message TEXT,
        type VARCHAR(50) DEFAULT 'info',
        status VARCHAR(50),
        is_read TINYINT(1) DEFAULT 0,
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS application_documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        application_id INT,
        service_document_id INT,
        document_name VARCHAR(255),
        original_filename VARCHAR(255),
        stored_filename VARCHAR(255),
        file_type VARCHAR(100),
        file_size INT,
        file_path TEXT,
        uploaded_by VARCHAR(255),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verification_status VARCHAR(50) DEFAULT 'Pending Verification',
        verified_by VARCHAR(255),
        verified_at TIMESTAMP NULL,
        rejection_reason TEXT,
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY,
        payment_notice_ta TEXT,
        payment_notice_en TEXT,
        payment_terms_enabled TINYINT(1) DEFAULT 1,
        social_facebook TEXT,
        social_instagram TEXT,
        social_youtube TEXT,
        social_whatsapp TEXT,
        social_twitter TEXT,
        social_telegram TEXT,
        social_linkedin TEXT,
        contact_phone VARCHAR(100),
        contact_email VARCHAR(255),
        contact_address TEXT,
        working_hours VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS application_field_values (
        id INT AUTO_INCREMENT PRIMARY KEY,
        application_id INT,
        field_id INT,
        field_label VARCHAR(255),
        value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        image_url TEXT NOT NULL,
        link_url VARCHAR(255) DEFAULT '/services',
        duration_seconds INT DEFAULT 5,
        status VARCHAR(50) DEFAULT 'Active',
        display_order INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Automated Column Migrations for any pre-existing tables
    const migrations = [
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS user_name VARCHAR(255)",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS user_email VARCHAR(255)",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS user_phone VARCHAR(50)",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS total_fee DECIMAL(10, 2) DEFAULT 0.00",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS admin_remarks TEXT",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS current_step INT DEFAULT 1",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP NULL",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS certificate_url TEXT",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS certificate_generated_at TIMESTAMP NULL",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS certificate_number VARCHAR(100)",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS certificate_issued_at TIMESTAMP NULL",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS field_values JSON",
      "ALTER TABLE applications ADD COLUMN IF NOT EXISTS payment_transaction_id VARCHAR(100)",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS aadhaar_no VARCHAR(50)",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS district VARCHAR(100)",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS pincode VARCHAR(20)",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)",
      "ALTER TABLE payments ADD COLUMN IF NOT EXISTS application_id INT",
      "ALTER TABLE payments ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR'",
      "ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_gateway VARCHAR(50)",
      "ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_order_id VARCHAR(100)",
      "ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_transaction_id VARCHAR(100)",
      "ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50)",
      "ALTER TABLE payments ADD COLUMN IF NOT EXISTS initiated_at TIMESTAMP NULL",
      "ALTER TABLE payments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP NULL",
      "ALTER TABLE payments ADD COLUMN IF NOT EXISTS metadata JSON",
      "ALTER TABLE notifications ADD COLUMN IF NOT EXISTS application_id INT",
      "ALTER TABLE notifications ADD COLUMN IF NOT EXISTS admin_id INT",
      "ALTER TABLE notifications ADD COLUMN IF NOT EXISTS metadata JSON",
      "ALTER TABLE services ADD COLUMN IF NOT EXISTS total_fee DECIMAL(10, 2) DEFAULT 0.00",
      "ALTER TABLE services ADD COLUMN IF NOT EXISTS govt_fee DECIMAL(10, 2) DEFAULT 0.00",
      "ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url TEXT",
      "ALTER TABLE services ADD COLUMN IF NOT EXISTS is_active TINYINT(1) DEFAULT 1",
      "ALTER TABLE services ADD COLUMN IF NOT EXISTS fields_json JSON",
      "ALTER TABLE services ADD COLUMN IF NOT EXISTS documents_json JSON",
      "ALTER TABLE banners ADD COLUMN IF NOT EXISTS duration_seconds INT DEFAULT 5",
      "ALTER TABLE banners ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1",
      "ALTER TABLE banners ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active'"
    ];

    for (const sql of migrations) {
      try {
        await connection.query(sql);
      } catch (e) {}
    }

    console.log('✅ [TiDB CLOUD] Database Schema Tables & Columns initialized successfully!');
  } catch (error) {
    console.error('❌ [TiDB CLOUD DB ERROR]', error);
  } finally {
    if (connection) connection.release();
  }
}

export default pool;
