import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db_data.json');

try {
  const rawData = fs.readFileSync(dbPath, 'utf-8');
  const data = JSON.parse(rawData);

  console.log('--- BEFORE CLEANUP ---');
  console.log(`Users: ${data.users?.length || 0}`);
  console.log(`Applications: ${data.applications?.length || 0}`);
  console.log(`Application Field Values: ${data.application_field_values?.length || 0}`);
  console.log(`Application Documents: ${data.application_documents?.length || 0}`);
  console.log(`Payments: ${data.payments?.length || 0}`);
  console.log(`Document Audit History: ${data.document_audit_history?.length || 0}`);

  // 1. Wipe all dummy applications and related records
  data.applications = [];
  data.application_field_values = [];
  data.application_documents = [];
  data.payments = [];
  data.document_audit_history = [];

  // 2. Wipe dummy users, keep System Admin ONLY
  data.users = (data.users || []).filter(u => 
    u.is_admin === 1 || 
    u.is_admin === true || 
    u.email === 'admin@eseva.gov.in' ||
    u.email === 'admin@tn.gov.in'
  );

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');

  console.log('\n--- AFTER CLEANUP ---');
  console.log(`Users (Preserved Admin): ${data.users.length}`);
  console.log(`Applications: ${data.applications.length}`);
  console.log(`Application Field Values: ${data.application_field_values.length}`);
  console.log(`Application Documents: ${data.application_documents.length}`);
  console.log(`Payments: ${data.payments.length}`);
  console.log(`Document Audit History: ${data.document_audit_history.length}`);
  console.log('✅ Cleaned all dummy applications, document audits, and test users successfully!');

} catch (err) {
  console.error('Cleanup error:', err);
}
