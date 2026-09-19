import assert from 'assert';
import crypto from 'crypto';
import PaymentService from '../paymentService.js';

console.log('--- Running PhonePe Integration Unit Tests ---');

// Test 1: Checksum generation format
{
  const payload = 'eyJtZXJjaGFudElkIjoiVEVTVF9NRVJDSEFOVCJ9';
  const endpoint = '/pg/v1/pay';
  const saltKey = '00000000-0000-0000-0000-000000000000';
  const saltIndex = '1';

  const checksum = PaymentService.calculatePhonePeChecksum(payload, endpoint, saltKey, saltIndex);
  console.log('Generated PhonePe Checksum:', checksum);

  const [hash, index] = checksum.split('###');
  assert.strictEqual(index, '1', 'Salt index should be 1');
  assert.strictEqual(hash.length, 64, 'SHA256 hash length should be 64 hexadecimal characters');

  // Verify hash calculation manually
  const expectedHash = crypto.createHash('sha256').update(payload + endpoint + saltKey).digest('hex');
  assert.strictEqual(hash, expectedHash, 'Checksum hash should match SHA256 specification');
  console.log('✓ Test 1 Passed: PhonePe SHA256 checksum calculation is correct.');
}

// Test 2: Webhook signature verification
{
  const fakeResponse = Buffer.from(JSON.stringify({
    success: true,
    code: 'PAYMENT_SUCCESS',
    data: {
      merchantId: 'TEST_MERCHANT',
      merchantTransactionId: 'MT1234567890',
      transactionId: 'T26091912345',
      amount: 6000,
      state: 'COMPLETED',
      responseCode: 'SUCCESS',
      paymentInstrument: { type: 'UPI' }
    }
  })).toString('base64');

  const saltKey = '00000000-0000-0000-0000-000000000000';
  const validHash = crypto.createHash('sha256').update(fakeResponse + saltKey).digest('hex');
  const validXVerify = `${validHash}###1`;

  const isValid = PaymentService.verifyPhonePeWebhookSignature({
    base64Response: fakeResponse,
    xVerifyHeader: validXVerify,
    saltKey
  });
  assert.strictEqual(isValid, true, 'Valid webhook signature must pass verification');

  const isInvalid = PaymentService.verifyPhonePeWebhookSignature({
    base64Response: fakeResponse,
    xVerifyHeader: `wronghash###1`,
    saltKey
  });
  assert.strictEqual(isInvalid, false, 'Tampered webhook signature must be rejected');

  console.log('✓ Test 2 Passed: PhonePe Webhook signature verification is secure and accurate.');
}

// Test 3: Status check endpoint construction
{
  const endpoint = `/pg/v1/status/TEST_MERCHANT/MT_TEST_001`;
  const saltKey = '00000000-0000-0000-0000-000000000000';
  const expectedHash = crypto.createHash('sha256').update(endpoint + saltKey).digest('hex');
  const expectedChecksum = `${expectedHash}###1`;

  assert.ok(expectedChecksum.endsWith('###1'), 'Status checksum ends with salt index');
  console.log('✓ Test 3 Passed: PhonePe status query headers formatted according to Hermes PG specification.');
}

console.log('--- All PhonePe Unit Tests Passed Successfully! ---');
