import pool, { initializeDatabaseSchema } from './mysql_db.js';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  console.log('🌱 Starting TiDB Cloud Database Seeding...');
  await initializeDatabaseSchema();

  let connection;
  try {
    connection = await pool.getConnection();

    // 1. Seed Demo Admin Account
    const adminPasswordHash = await bcrypt.hash('AdminSecret123', 10);
    await connection.query(`
      INSERT INTO admins (name, email, password, role, department)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password);
    `, ['System Administrator', 'admin@eseva.gov.in', adminPasswordHash, 'admin', 'Core Operations']);

    // 2. Seed Demo Citizen User Account
    const userPasswordHash = await bcrypt.hash('UserPass123', 10);
    await connection.query(`
      INSERT INTO users (name, email, phone, password, role)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password);
    `, ['Karthik Raja', 'user@eseva.gov.in', '9876543210', userPasswordHash, 'citizen']);

    // Get user id
    const [userRows] = await connection.query(`SELECT id FROM users WHERE email = ?`, ['user@eseva.gov.in']);
    const userId = userRows[0]?.id || 1;

    // 3. Seed Service Categories
    const categoriesData = [
      { name: 'Aadhaar Services', slug: 'aadhaar', description: 'Aadhaar Enrollment, Address Update, Mobile Link, Duplicate Card', icon: 'Fingerprint', badge: 'Fast Track', service_count: 5 },
      { name: 'PAN Card Services', slug: 'pan-services', description: 'New PAN Card Application, PAN Correction, Aadhaar-PAN Link', icon: 'CreditCard', badge: 'Instant PDF', service_count: 4 },
      { name: 'Voter ID Services', slug: 'voter', description: 'New Voter Registration, EPIC Download, Address Shift, Deletion', icon: 'Vote', badge: 'NVSP Direct', service_count: 4 },
      { name: 'Revenue Certificates', slug: 'certificates', description: 'Income Certificate, Community Certificate, Native/Residence Certificate', icon: 'Award', badge: 'Digital Sign', service_count: 6 },
      { name: 'Land & Patta Services', slug: 'land-patta-services', description: 'Patta Chitta Copy, Encumbrance Certificate (EC), Land Transfer', icon: 'Map', badge: 'Land Records', service_count: 4 },
      { name: 'Passport Services', slug: 'passport', description: 'Fresh Passport Application, Re-issue, Police Clearance Certificate', icon: 'FileText', badge: 'Sewa Kendra', service_count: 3 },
      { name: 'RTO & Driving License', slug: 'driving-licence', description: 'Learner License (LLR), Driving License Renewal, RC Transfer', icon: 'Car', badge: 'Parivahan', service_count: 5 },
      { name: 'Business & GST', slug: 'business', description: 'MSME Udyam Registration, GST Registration, FSSAI Food License', icon: 'Briefcase', badge: 'MSME Govt', service_count: 4 },
      { name: 'Utility Bill Payments', slug: 'utility', description: 'TNEB Electricity Bill Payment, Metro Water, Property Tax Clearance', icon: 'Zap', badge: 'Auto Sync', service_count: 4 },
      { name: 'Ration Card & Social Welfare', slug: 'other-digital-services', description: 'Smart Ration Card Correction, Family Member Add/Delete', icon: 'ShoppingBag', badge: 'TNPDS', service_count: 5 }
    ];

    for (const cat of categoriesData) {
      await connection.query(`
        INSERT INTO categories (name, slug, description, icon, badge, service_count)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), icon = VALUES(icon), badge = VALUES(badge);
      `, [cat.name, cat.slug, cat.description, cat.icon, cat.badge, cat.service_count]);
    }

    // 4. Seed Essential Services
    const servicesData = [
      {
        name: 'Aadhaar Address Update',
        slug: 'aadhaar-address-update',
        category_slug: 'aadhaar',
        description: 'Update your resident address in official UIDAI Aadhaar Database with proof of address.',
        fee: 50.00,
        processing_time: '2-3 Working Days',
        documents_required: JSON.stringify(['Address Proof (Voter ID / EB Bill / Bank Passbook)', 'Aadhaar Card Copy']),
        eligibility: JSON.stringify(['Applicant must hold a valid 12-digit Aadhaar number', 'Active mobile number registered for OTP'])
      },
      {
        name: 'New PAN Card Application (Form 49A)',
        slug: 'new-pan-card',
        category_slug: 'pan-services',
        description: 'Apply for fresh 10-digit Permanent Account Number (PAN) Card with physical & digital e-PAN delivery.',
        fee: 110.00,
        processing_time: '5-7 Working Days',
        documents_required: JSON.stringify(['Identity Proof', 'Address Proof', 'Date of Birth Proof', 'Passport Photograph']),
        eligibility: JSON.stringify(['Indian Citizens / Non-Individual Entities without existing PAN'])
      },
      {
        name: 'Income Certificate (Varumaana Saanrithazh)',
        slug: 'income-certificate',
        category_slug: 'certificates',
        description: 'Official e-District revenue department certificate declaring annual family income.',
        fee: 60.00,
        processing_time: '3-5 Working Days',
        documents_required: JSON.stringify(['Aadhaar Card', 'Ration Card Copy', 'Salary Slip / Income Declaration', 'Self Photo']),
        eligibility: JSON.stringify(['Permanent resident of Tamil Nadu'])
      },
      {
        name: 'Community Certificate (Jaathi Saanrithazh)',
        slug: 'community-certificate',
        category_slug: 'certificates',
        description: 'Government authorized caste/community verification certificate (BC/MBC/SC/ST).',
        fee: 60.00,
        processing_time: '5-7 Working Days',
        documents_required: JSON.stringify(['Applicant Aadhaar', 'Parent Community Certificate Copy', 'School Transfer Certificate', 'Ration Card']),
        eligibility: JSON.stringify(['Resident belonging to recognized community categories'])
      },
      {
        name: 'Patta Chitta Copy (AnyTamilLand)',
        slug: 'patta-chitta-extract',
        category_slug: 'land-patta-services',
        description: 'Extract official e-Patta and Chitta revenue record extracts online.',
        fee: 30.00,
        processing_time: 'Instant / 24 Hours',
        documents_required: JSON.stringify(['District, Taluk & Village Details', 'Survey Number / Sub-division Number / Patta Number']),
        eligibility: JSON.stringify(['Land owner or authorized property search applicant'])
      },
      {
        name: 'Encumbrance Certificate (EC Online)',
        slug: 'encumbrance-certificate',
        category_slug: 'land-patta-services',
        description: 'Verify property ownership history and encumbrances registered at Sub-Registrar Office (SRO).',
        fee: 100.00,
        processing_time: '1-2 Working Days',
        documents_required: JSON.stringify(['Document Number or Survey Details', 'Registration Year Range']),
        eligibility: JSON.stringify(['Public service search available for all properties'])
      }
    ];

    for (const srv of servicesData) {
      await connection.query(`
        INSERT INTO services (category_slug, name, slug, description, fee, processing_time, documents_required, eligibility)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name), fee = VALUES(fee), description = VALUES(description);
      `, [srv.category_slug, srv.name, srv.slug, srv.description, srv.fee, srv.processing_time, srv.documents_required, srv.eligibility]);
    }

    // 5. Seed Demo Applications
    const demoApps = [
      {
        app_no: 'ESV-2026-000101',
        user_id: userId,
        name: 'Karthik Raja',
        email: 'user@eseva.gov.in',
        phone: '9876543210',
        service_name: 'Income Certificate (Varumaana Saanrithazh)',
        service_slug: 'income-certificate',
        status: 'Approved',
        fee: 60.00,
        payment_status: 'Paid',
        payment_id: 'PAY-89230198',
        form_data: JSON.stringify({ annual_income: '120000', district: 'Chennai', taluk: 'Egmore' }),
        documents: JSON.stringify([{ name: 'Aadhaar_Card.pdf', url: '/uploads/documents/sample.pdf' }])
      },
      {
        app_no: 'ESV-2026-000102',
        user_id: userId,
        name: 'Karthik Raja',
        email: 'user@eseva.gov.in',
        phone: '9876543210',
        service_name: 'Aadhaar Address Update',
        service_slug: 'aadhaar-address-update',
        status: 'Under Review',
        fee: 50.00,
        payment_status: 'Paid',
        payment_id: 'PAY-89230245',
        form_data: JSON.stringify({ new_address: 'Door 45, Gandhi Road, Adyar, Chennai - 600020' }),
        documents: JSON.stringify([{ name: 'Voter_ID_Proof.jpg', url: '/uploads/documents/sample.jpg' }])
      },
      {
        app_no: 'ESV-2026-000103',
        user_id: userId,
        name: 'Suresh Kumar',
        email: 'suresh.k@gmail.com',
        phone: '9444123456',
        service_name: 'Patta Chitta Copy (AnyTamilLand)',
        service_slug: 'patta-chitta-extract',
        status: 'Processing',
        fee: 30.00,
        payment_status: 'Paid',
        payment_id: 'PAY-89230399',
        form_data: JSON.stringify({ survey_no: '142/3A', village: 'Velachery' }),
        documents: JSON.stringify([])
      }
    ];

    for (const app of demoApps) {
      await connection.query(`
        INSERT INTO applications (application_number, user_id, applicant_name, applicant_email, applicant_phone, service_name, service_slug, status, fee_amount, payment_status, payment_id, form_data, documents)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE status = VALUES(status);
      `, [app.app_no, app.user_id, app.name, app.email, app.phone, app.service_name, app.service_slug, app.status, app.fee, app.payment_status, app.payment_id, app.form_data, app.documents]);

      // Add corresponding Payment record
      await connection.query(`
        INSERT INTO payments (payment_id, application_number, user_id, amount, payment_method, status)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE status = VALUES(status);
      `, [app.payment_id, app.app_no, app.user_id, app.fee, 'UPI / Razorpay', 'Success']);
    }

    console.log('🎉 [TiDB CLOUD] Database Seed completed successfully!');
  } catch (err) {
    console.error('❌ [TiDB SEED ERROR]', err);
  } finally {
    if (connection) connection.release();
  }
}

if (process.argv[1]?.endsWith('seed_tidb.js')) {
  seedDatabase().then(() => process.exit(0));
}
