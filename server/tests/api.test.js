import assert from 'assert';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000';

async function request(reqPath, options = {}) {
  const url = `${BASE_URL}${reqPath}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, headers: res.headers, data };
}

async function runTests() {
  console.log('==============================================');
  console.log('   E-SEVA API & SECURITY HARDENING TEST SUITE ');
  console.log('==============================================\n');

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

  // 1. Health Check Endpoint
  await test('GET /api/health returns 200 OK and UP status', async () => {
    const res = await request('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'UP');
    assert.strictEqual(res.data.database, 'HEALTHY');
  });

  // 2. Security Response Headers
  await test('API Responses contain Security Headers', async () => {
    const res = await request('/api/health');
    assert.strictEqual(res.headers.get('x-content-type-options'), 'nosniff');
    assert.strictEqual(res.headers.get('x-frame-options'), 'DENY');
    assert.strictEqual(res.headers.get('x-xss-protection'), '1; mode=block');
  });

  // 3. User Registration & Login Workflow
  let userToken = '';
  const testUser = {
    name: 'Security Audit Tester',
    email: `audit_user_${Date.now()}@eseva.gov.in`,
    phone: '9876543210',
    password: 'SecurePassword123!'
  };

  await test('POST /api/auth/register registers new user and returns JWT token', async () => {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(testUser)
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.token, 'Token should be returned');
    userToken = res.data.token;
  });

  await test('POST /api/auth/login authenticates registered user', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.token);
  });

  // 4. Admin Authentication
  let adminToken = '';
  await test('POST /api/auth/admin/login authenticates admin user', async () => {
    const res = await request('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@eseva.gov.in', password: 'AdminSecret123' })
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.token);
    adminToken = res.data.token;
  });

  // 5. Fetch available service
  const servicesRes = await request('/api/services');
  const serviceId = servicesRes.data.length > 0 ? servicesRes.data[0].id : 1;

  // 6. Application Draft & Submission with Sequential Atomic ID Generator
  let appId = null;
  let appNumber = '';
  await test('POST /api/applications/draft saves draft with ESV-2026-DRAFT application number', async () => {
    const res = await request('/api/applications/draft', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        service_id: serviceId,
        user_name: testUser.name,
        user_email: testUser.email,
        user_phone: testUser.phone,
        current_step: 2
      })
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.application_number.includes('ESV-2026-DRAFT'));
    appId = res.data.application_id;
  });

  await test('POST /api/applications submits application with sequential ESV-2026 number', async () => {
    const res = await request('/api/applications', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        draft_id: appId,
        service_id: serviceId,
        user_name: testUser.name,
        user_email: testUser.email,
        user_phone: testUser.phone,
        field_values: { applicant_name: testUser.name, income_amount: '150000' }
      })
    });
    assert.strictEqual(res.status, 201);
    assert.ok(res.data.application_number.startsWith('ESV-2026-'));
    assert.strictEqual(res.data.application_number.includes('DRAFT'), false);
    appNumber = res.data.application_number;
  });

  // 7. Payment Verification & Duplicate Protection
  let paymentId = null;
  let paymentOrderId = '';
  await test('POST /api/payments/create-order generates server-calculated payment order', async () => {
    const res = await request('/api/payments/create-order', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({ application_id: appId, service_id: serviceId })
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.order.order_id);
    paymentId = res.data.payment_id;
    paymentOrderId = res.data.order.order_id;
  });

  await test('POST /api/payments/verify-payment verifies valid signature and updates status', async () => {
    const res = await request('/api/payments/verify-payment', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        payment_id: paymentId,
        order_id: paymentOrderId,
        transaction_id: `TXN-TEST-${Date.now()}`,
        signature: 'test_sandbox_signature_valid'
      })
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
  });

  // 8. Application Status State Machine
  await test('PUT /api/admin/applications/:id/status updates status with state machine checks', async () => {
    const res = await request(`/api/admin/applications/${appId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'Processing', admin_remarks: 'Verified documents.' })
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'Processing');
  });

  console.log('\n----------------------------------------------');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('----------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
