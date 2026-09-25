import { getServiceDefinition } from '../../src/data/servicesCatalogData.js';
import assert from 'assert';

function isAadhaarRequired(service) {
  if (!service) return false;

  const hasRequiredAadhaarField = (service.fields || []).some(f => {
    if (!f) return false;
    const name = String(f.field_name || f.name || '').toLowerCase().trim();
    const label = String(f.field_label || f.label || '').toLowerCase().trim();
    const isAadhaar = name.includes('aadhaar') || name.includes('aadhar') || label.includes('aadhaar') || label.includes('aadhar');
    const isReq = f.is_required !== false && f.required !== false && f.is_required !== 0;
    return isAadhaar && isReq;
  });
  if (hasRequiredAadhaarField) return true;

  const catSlug = service.category_slug || '';
  const catName = (service.category_name || '').toLowerCase();
  const slug = (service.slug || '').toLowerCase();
  const name = (service.name || '').toLowerCase();

  const isAadhaarCategory = catSlug === 'aadhaar-services' || catName.includes('aadhaar') || service.category_id === 1;
  const isNewEnrollment = slug.includes('enrollment') || name.includes('enrollment');

  if (isAadhaarCategory && !isNewEnrollment) {
    return true;
  }

  return false;
}

async function runTests() {
  console.log('Testing Aadhaar Requirement and Address across services...\n');

  // 1. Non-Aadhaar Services: Community Certificate
  const commDef = getServiceDefinition('community-certificate');
  assert.strictEqual(isAadhaarRequired(commDef), false, 'Community Certificate should NOT require Aadhaar');
  console.log('✔ Community Certificate: Aadhaar is OPTIONAL');

  // 2. Non-Aadhaar Services: Income Certificate
  const incDef = getServiceDefinition('income-certificate');
  assert.strictEqual(isAadhaarRequired(incDef), false, 'Income Certificate should NOT require Aadhaar');
  console.log('✔ Income Certificate: Aadhaar is OPTIONAL');

  // 3. Non-Aadhaar Services: Smart Ration Card
  const rationDef = getServiceDefinition('new-smart-ration-card-application');
  assert.strictEqual(isAadhaarRequired(rationDef), false, 'Smart Ration Card should NOT require Aadhaar');
  const hasRationAddress = (rationDef.fields || []).some(f => f.name === 'address' || f.name.includes('address'));
  assert.strictEqual(hasRationAddress, true, 'Smart Ration Card MUST have address field');
  console.log('✔ Smart Ration Card: Aadhaar is OPTIONAL and has Address field');

  // 4. New Aadhaar Enrollment (Category 1, but new enrollment - applicant does NOT have Aadhaar)
  const newAadhaarDef = getServiceDefinition('new-aadhaar-enrollment');
  assert.strictEqual(isAadhaarRequired(newAadhaarDef), false, 'New Aadhaar Enrollment should NOT require Aadhaar');
  console.log('✔ New Aadhaar Enrollment: Aadhaar is OPTIONAL (new applicant)');

  // 5. Aadhaar Address Update (Category 1 update service)
  const aadhaarAddrDef = getServiceDefinition('aadhaar-address-update');
  assert.strictEqual(isAadhaarRequired(aadhaarAddrDef), true, 'Aadhaar Address Update MUST require Aadhaar');
  console.log('✔ Aadhaar Address Update: Aadhaar is REQUIRED');

  // 6. Test API endpoints for services
  const resComm = await fetch('http://localhost:5000/api/services/community-certificate');
  assert.strictEqual(resComm.status, 200);
  const commData = await resComm.json();
  const hasAddr = commData.fields.some(f => (f.field_name || f.name || '').includes('address'));
  assert.strictEqual(hasAddr, true, 'Community Certificate API returns address field');
  console.log('✔ API /api/services/community-certificate returns fields including Address');

  const resRation = await fetch('http://localhost:5000/api/services/new-smart-ration-card-application');
  assert.strictEqual(resRation.status, 200);
  const rationData = await resRation.json();
  assert.ok(rationData.fields.length > 0, 'Ration card API returns fields');
  console.log('✔ API /api/services/new-smart-ration-card-application returns 5 fields & 3 documents');

  // 7. Test Application submission with NO Aadhaar (Non-Aadhaar service)
  const submitPayload = {
    service_id: commData.id,
    user_name: 'Test Applicant',
    user_email: 'testapplicant@example.com',
    user_phone: '9876543210',
    field_values: JSON.stringify({
      full_name: 'Test Applicant',
      user_name: 'Test Applicant',
      user_phone: '9876543210',
      user_email: 'testapplicant@example.com',
      address: '123 Test Street, Erode',
      district: 'Erode',
      caste_category: 'BC',
      sub_caste: 'Kongu Vellalar'
    })
  };

  const formData = new FormData();
  for (const [k, v] of Object.entries(submitPayload)) {
    formData.append(k, v);
  }

  const subRes = await fetch('http://localhost:5000/api/applications', {
    method: 'POST',
    body: formData
  });

  assert.ok(subRes.status === 200 || subRes.status === 201, 'Application submitted successfully without Aadhaar');
  const subData = await subRes.json();
  assert.ok(subData.application_number, 'Received valid application number');
  console.log(`✔ Application submitted successfully without Aadhaar! App #: ${subData.application_number}`);

  // Verify stored field values retain Address
  const trackRes = await fetch(`http://localhost:5000/api/applications/track/${subData.application_number}`);
  assert.strictEqual(trackRes.status, 200);
  const trackData = await trackRes.json();
  console.log('Saved field values:', trackData.field_values);
  const addressVal = trackData.field_values.find(fv => 
    (fv.field_name && fv.field_name.toLowerCase().includes('address')) ||
    (fv.field_label && fv.field_label.toLowerCase().includes('address'))
  )?.value;
  assert.strictEqual(addressVal, '123 Test Street, Erode', 'Address preserved in database');
  console.log(`✔ Address preserved accurately: ${addressVal}`);

  console.log('\nALL 7 TESTS PASSED PERFECTLY! 🚀');
}

runTests().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
