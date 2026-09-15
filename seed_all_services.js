import fs from 'fs';
import path from 'path';
import { DEFAULT_SERVICES_MAP } from './src/data/servicesCatalogData.js';

const DB_FILE = './server/database/db_data.json';

if (!fs.existsSync(DB_FILE)) {
  console.error('db_data.json not found!');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

// Initialize categories if needed
const categoryMap = {
  'aadhaar-services': { id: 1, name: 'Aadhaar Services', slug: 'aadhaar-services', icon: 'Shield', description: 'UIDAI Aadhaar services' },
  'pan-services': { id: 2, name: 'PAN Services', slug: 'pan-services', icon: 'CreditCard', description: 'PAN card applications and updates' },
  'certificate-services': { id: 3, name: 'Certificates & Revenue', slug: 'certificate-services', icon: 'Award', description: 'Revenue certificates' },
  'land-patta-services': { id: 4, name: 'Land & Patta Services', slug: 'land-patta-services', icon: 'Building', description: 'Patta, Chitta, EC land records' },
  'business-services': { id: 5, name: 'Business Services', slug: 'business-services', icon: 'Briefcase', description: 'GST, MSME, FSSAI licenses' },
  'driving-vehicle-services': { id: 6, name: 'Driving & Vehicle Services', slug: 'driving-vehicle-services', icon: 'Car', description: 'RTO, LLR, DL, RC services' },
  'ration-card-services': { id: 7, name: 'Ration Card Services', slug: 'ration-card-services', icon: 'FileText', description: 'Smart Ration Card services' },
  'voter-services': { id: 8, name: 'Voter ID Services', slug: 'voter-services', icon: 'UserCheck', description: 'Electoral roll and EPIC voter ID' },
  'utility-services': { id: 9, name: 'Utility Services', slug: 'utility-services', icon: 'Zap', description: 'TNEB electricity, water, tax' },
  'passport-services': { id: 10, name: 'Passport Services', slug: 'passport-services', icon: 'Globe', description: 'Passport and PCC applications' }
};

db.categories = Object.values(categoryMap);

const servicesList = [];
const serviceFieldsList = [];
const serviceDocumentsList = [];

let nextServiceId = 1;
let nextFieldId = 1;
let nextDocId = 1;

for (const [slugKey, srv] of Object.entries(DEFAULT_SERVICES_MAP)) {
  const catSlug = srv.category_slug || 'certificate-services';
  const category = categoryMap[catSlug] || categoryMap['certificate-services'];
  const srvId = srv.id || nextServiceId++;

  const serviceObj = {
    id: srvId,
    category_id: category.id,
    category_name: category.name,
    category_slug: category.slug,
    name: srv.name,
    slug: srv.slug || slugKey,
    description: srv.description || '',
    eligibility: srv.eligibility || 'All resident citizens.',
    processing_time: srv.processing_time || '3-7 Working Days',
    fee: typeof srv.fee === 'number' ? srv.fee : 60,
    is_active: true
  };

  servicesList.push(serviceObj);

  // Seed Fields
  if (srv.fields && Array.isArray(srv.fields)) {
    srv.fields.forEach((f, idx) => {
      serviceFieldsList.push({
        id: nextFieldId++,
        service_id: srvId,
        field_name: f.name || f.field_name,
        field_label: f.label || f.field_label || f.name,
        field_type: f.type || f.field_type || 'text',
        placeholder: f.placeholder || '',
        helpText: f.helpText || '',
        options_json: f.options ? JSON.stringify(f.options) : null,
        is_required: f.required !== false && f.is_required !== false,
        sort_order: idx + 1
      });
    });
  }

  // Seed Documents
  if (srv.documents && Array.isArray(srv.documents)) {
    srv.documents.forEach((d, idx) => {
      serviceDocumentsList.push({
        id: nextDocId++,
        service_id: srvId,
        document_name: d.name || d.document_name,
        description: d.description || '',
        max_file_size: d.max_file_size || 5,
        is_required: d.required !== false && d.is_required !== false,
        sort_order: idx + 1
      });
    });
  }
}

db.services = servicesList;
db.service_fields = serviceFieldsList;
db.service_documents = serviceDocumentsList;

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
console.log('✅ Seeded', servicesList.length, 'services,', serviceFieldsList.length, 'fields, and', serviceDocumentsList.length, 'documents into db_data.json!');
