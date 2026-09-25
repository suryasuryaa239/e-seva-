import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getServiceDefinition } from '../src/data/servicesCatalogData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../server/database/db_data.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const targetIds = [94, 95, 96, 97, 98, 99, 100, 101, 102, 103];
let currentFieldId = Math.max(...db.service_fields.map(f => f.id || 0)) + 1;
let currentDocId = Math.max(...db.service_documents.map(d => d.id || 0)) + 1;

let fieldsAdded = 0;
let docsAdded = 0;

targetIds.forEach(id => {
  const service = db.services.find(s => s.id === id);
  if (!service) return;

  const existingFields = db.service_fields.filter(f => f.service_id === id);
  const existingDocs = db.service_documents.filter(d => d.service_id === id);

  const catalogDef = getServiceDefinition(service.slug);
  if (!catalogDef) {
    console.log(`No catalog definition found for ${service.slug}`);
    return;
  }

  // 1. Add fields if missing
  if (existingFields.length === 0 && Array.isArray(catalogDef.fields)) {
    catalogDef.fields.forEach((f, idx) => {
      const newField = {
        id: currentFieldId++,
        service_id: id,
        field_name: f.name || f.field_name,
        field_label: f.label || f.field_label || f.name,
        field_type: f.type || f.field_type || 'text',
        placeholder: f.placeholder || '',
        helpText: f.helpText || '',
        options_json: f.options ? (Array.isArray(f.options) ? JSON.stringify(f.options) : f.options) : null,
        is_required: f.required !== false && f.is_required !== false ? 1 : 0,
        sort_order: idx + 1
      };
      db.service_fields.push(newField);
      fieldsAdded++;
    });
  }

  // 2. Add documents if missing
  if (existingDocs.length === 0 && Array.isArray(catalogDef.documents)) {
    catalogDef.documents.forEach((d, idx) => {
      const docName = typeof d === 'string' ? d : (d.name || d.document_name);
      const newDoc = {
        id: currentDocId++,
        service_id: id,
        document_name: docName,
        description: (typeof d === 'object' && d.description) ? d.description : `Upload clear copy of ${docName}`,
        is_required: (typeof d === 'object' && d.required === false) ? 0 : 1
      };
      db.service_documents.push(newDoc);
      docsAdded++;
    });
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`Seeded ${fieldsAdded} fields and ${docsAdded} documents successfully into db_data.json.`);
