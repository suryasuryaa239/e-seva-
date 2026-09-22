import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../server/database/db_data.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Service 4 clean fields (Community Certificate)
const s4_fields = [
  { service_id: 4, field_name: 'applicant_name', field_label: 'Applicant Name', field_type: 'text', placeholder: 'Karthik Subramanian', helpText: '', options_json: null, is_required: true, sort_order: 1 },
  { service_id: 4, field_name: 'father_name', field_label: 'Father Full Name', field_type: 'text', placeholder: 'Subramanian S', helpText: '', options_json: null, is_required: true, sort_order: 2 },
  { service_id: 4, field_name: 'caste_category', field_label: 'Caste / Community Category', field_type: 'select', placeholder: '', helpText: '', options_json: JSON.stringify(['BC', 'MBC', 'SC', 'ST', 'OC']), is_required: true, sort_order: 3 },
  { service_id: 4, field_name: 'sub_caste', field_label: 'Sub-Caste Name', field_type: 'text', placeholder: 'Enter Sub-Caste Name', helpText: '', options_json: null, is_required: true, sort_order: 4 },
  { service_id: 4, field_name: 'delivery_address', field_label: 'Complete Residential Address', field_type: 'textarea', placeholder: 'Door No, Street Name, Village/City, Pincode', helpText: '', options_json: null, is_required: true, sort_order: 5 },
  { service_id: 4, field_name: 'district', field_label: 'District', field_type: 'text', placeholder: 'Erode', helpText: '', options_json: null, is_required: true, sort_order: 6 },
  { service_id: 4, field_name: 'pincode', field_label: '6-Digit Pincode', field_type: 'text', placeholder: '638402', helpText: '', options_json: null, is_required: true, sort_order: 7 },
  { service_id: 4, field_name: 'mobile_number', field_label: 'Mobile Number for Tracking', field_type: 'phone', placeholder: '9894059591', helpText: '', options_json: null, is_required: true, sort_order: 8 }
];

// Service 5 clean fields (Patta Chitta Copy / Record Search)
const s5_fields = [
  { service_id: 5, field_name: 'district', field_label: 'District', field_type: 'text', placeholder: 'e.g. Erode / Coimbatore / Chennai', helpText: '', options_json: null, is_required: true, sort_order: 1 },
  { service_id: 5, field_name: 'taluk', field_label: 'Taluk', field_type: 'text', placeholder: 'e.g. Sathyamangalam', helpText: '', options_json: null, is_required: true, sort_order: 2 },
  { service_id: 5, field_name: 'village', field_label: 'Village', field_type: 'text', placeholder: 'e.g. Alathucombai', helpText: '', options_json: null, is_required: true, sort_order: 3 },
  { service_id: 5, field_name: 'survey_number', field_label: 'Survey Number / Patta Number', field_type: 'text', placeholder: 'e.g. 123/4A or Patta No 567', helpText: '', options_json: null, is_required: true, sort_order: 4 },
  { service_id: 5, field_name: 'sub_division_number', field_label: 'Sub-Division Number', field_type: 'text', placeholder: 'e.g. 2B (optional if Patta No provided)', helpText: '', options_json: null, is_required: false, sort_order: 5 },
  { service_id: 5, field_name: 'mobile_number', field_label: 'Mobile Number for Status Alerts', field_type: 'phone', placeholder: '9894059591', helpText: '', options_json: null, is_required: true, sort_order: 6 }
];

// Service 6 clean fields (Encumbrance Certificate EC)
const s6_fields = [
  { service_id: 6, field_name: 'district', field_label: 'District', field_type: 'text', placeholder: 'e.g. Erode / Chennai', helpText: '', options_json: null, is_required: true, sort_order: 1 },
  { service_id: 6, field_name: 'sub_registrar_office', field_label: 'Sub-Registrar Office (SRO)', field_type: 'text', placeholder: 'e.g. Sathyamangalam SRO', helpText: '', options_json: null, is_required: true, sort_order: 2 },
  { service_id: 6, field_name: 'village_taluk', field_label: 'Village & Taluk', field_type: 'text', placeholder: 'e.g. Sathyamangalam Village', helpText: '', options_json: null, is_required: true, sort_order: 3 },
  { service_id: 6, field_name: 'survey_number', field_label: 'Survey / Plot Number', field_type: 'text', placeholder: 'e.g. Plot 42, Survey 123/4', helpText: '', options_json: null, is_required: true, sort_order: 4 },
  { service_id: 6, field_name: 'search_period', field_label: 'Search Period (Years)', field_type: 'select', placeholder: '', helpText: '', options_json: JSON.stringify(['5 Years', '10 Years', '15 Years', '30 Years']), is_required: true, sort_order: 5 },
  { service_id: 6, field_name: 'mobile_number', field_label: 'Mobile Number', field_type: 'phone', placeholder: '9894059591', helpText: '', options_json: null, is_required: true, sort_order: 6 }
];

// Deduplicate any fields in other services too
let other_fields = data.service_fields.filter(f => ![4, 5, 6].includes(f.service_id));
const seenMap = new Map();
other_fields = other_fields.filter(f => {
  const k = `${f.service_id}_${String(f.field_name || f.field_label).trim().toLowerCase()}`;
  if (seenMap.has(k)) return false;
  seenMap.set(k, true);
  return true;
});

// Reassign sequential IDs
let currentId = 1;
other_fields = other_fields.map(f => ({ ...f, id: currentId++ }));
const s4_with_ids = s4_fields.map(f => ({ ...f, id: currentId++ }));
const s5_with_ids = s5_fields.map(f => ({ ...f, id: currentId++ }));
const s6_with_ids = s6_fields.map(f => ({ ...f, id: currentId++ }));

data.service_fields = [...other_fields, ...s4_with_ids, ...s5_with_ids, ...s6_with_ids];

// Ensure service 5 slug is patta-chitta
const s5 = data.services.find(s => s.id === 5);
if (s5) {
  s5.slug = 'patta-chitta';
}

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated db_data.json! Total fields now:', data.service_fields.length);
