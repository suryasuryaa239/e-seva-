import assert from 'assert';
import jwt from 'jsonwebtoken';
import { db } from '../database/db.js';

process.env.PORT = '5005';
const JWT_SECRET = process.env.JWT_SECRET || 'eseva_super_secret_jwt_key_2026';
const adminToken = jwt.sign(
  { id: 1, email: 'admin@eseva.gov.in', role: 'admin', isAdmin: true },
  JWT_SECRET,
  { expiresIn: '1h' }
);

const BASE_URL = 'http://localhost:5005';

async function request(reqPath, options = {}) {
  const url = `${BASE_URL}${reqPath}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, headers: res.headers, data };
}

async function runReportTests() {
  console.log('========================================================');
  console.log('   REPORTS & DATABASE CLEAR API TEST SUITE   ');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. User Profiles Report
  await test('GET /api/admin/reports/user-profiles returns list of citizen profiles', async () => {
    const res = await request('/api/admin/reports/user-profiles');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data));
    if (res.data.length > 0) {
      const u = res.data[0];
      assert.ok('name' in u);
      assert.ok('email' in u);
      assert.ok('total_applications' in u);
      assert.ok('total_spent' in u);
    }
    console.log(`       -> Found ${res.data.length} registered citizen profiles`);
  });

  // 2. Pending List Report
  await test('GET /api/admin/reports/pending returns pending applications', async () => {
    const res = await request('/api/admin/reports/pending');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data));
    if (res.data.length > 0) {
      const a = res.data[0];
      assert.ok('application_number' in a);
      assert.ok('applicant_name' in a);
      assert.ok('days_pending' in a);
    }
    console.log(`       -> Found ${res.data.length} pending applications`);
  });

  // 3. Payment Pending List Report
  await test('GET /api/admin/reports/payment-pending returns unpaid applications', async () => {
    const res = await request('/api/admin/reports/payment-pending');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data));
    if (res.data.length > 0) {
      const p = res.data[0];
      assert.ok('application_number' in p);
      assert.ok('fee_amount' in p);
      assert.ok('payment_status' in p);
    }
    console.log(`       -> Found ${res.data.length} payment pending records`);
  });

  // 4. Payment Paid List Report
  await test('GET /api/admin/reports/payment-paid returns settled receipts & payments', async () => {
    const res = await request('/api/admin/reports/payment-paid');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data));
    if (res.data.length > 0) {
      const p = res.data[0];
      assert.ok('receipt_number' in p);
      assert.ok('amount' in p);
      assert.strictEqual(p.status, 'PAID');
    }
    console.log(`       -> Found ${res.data.length} paid/settled transactions`);
  });

  // 5. Abandoned List Report
  await test('GET /api/admin/reports/abandoned returns drafts and checkout drop-offs', async () => {
    const res = await request('/api/admin/reports/abandoned');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data));
    if (res.data.length > 0) {
      const d = res.data[0];
      assert.ok('application_number' in d);
      assert.ok('stage_name' in d);
      assert.ok('drop_reason' in d);
    }
    console.log(`       -> Found ${res.data.length} abandoned sessions`);
  });

  // 6. Database Stats Endpoint
  await test('GET /api/admin/database/stats returns live counts of all tables', async () => {
    const res = await request('/api/admin/database/stats');
    assert.strictEqual(res.status, 200);
    assert.ok('applications' in res.data);
    assert.ok('payments' in res.data);
    assert.ok('users' in res.data);
    assert.ok('services' in res.data);
    console.log(`       -> Stats: Apps=${res.data.applications}, Payments=${res.data.payments}, Users=${res.data.users}, Services=${res.data.services}`);
  });

  // 7. Safety Barrier Test for Database Clear
  await test('POST /api/admin/database/clear rejects invalid confirmation string', async () => {
    const res = await request('/api/admin/database/clear', {
      method: 'POST',
      body: JSON.stringify({
        scope: 'notifications',
        confirmation: 'WRONG CODE'
      })
    });
    assert.strictEqual(res.status, 400);
    assert.ok(res.data.error.includes('Safety confirmation failed'));
  });

  console.log(`\n========================================================`);
  console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================================`);

  process.exit(failed > 0 ? 1 : 0);
}

// Start server in-process if not already running on port 5000
import('../index.js').then(() => {
  setTimeout(runReportTests, 1500);
}).catch(err => {
  console.error('Failed to import app:', err);
  process.exit(1);
});
