import fs from 'fs';
import path from 'path';
import pool from '../server/database/mysql_db.js';
import { DEFAULT_SERVICES_MAP } from '../src/data/servicesCatalogData.js';

const DB_FILE = './server/database/db_data.json';

// Category mapping matching TiDB categories table
const CATEGORY_MAPPING = {
  'aadhaar-services': { id: 1, name: 'Aadhaar Services', slug: 'aadhaar-services' },
  'aadhaar': { id: 1, name: 'Aadhaar Services', slug: 'aadhaar-services' },
  'pan-services': { id: 2, name: 'PAN Services', slug: 'pan-services' },
  'voter-id-services': { id: 3, name: 'Voter ID Services', slug: 'voter-id-services' },
  'voter-services': { id: 3, name: 'Voter ID Services', slug: 'voter-id-services' },
  'voter': { id: 3, name: 'Voter ID Services', slug: 'voter-id-services' },
  'certificate-services': { id: 4, name: 'Certificates & Revenue', slug: 'certificate-services' },
  'certificates': { id: 4, name: 'Certificates & Revenue', slug: 'certificate-services' },
  'land-patta-services': { id: 5, name: 'Land & Patta Services', slug: 'land-patta-services' },
  'land-services': { id: 5, name: 'Land & Patta Services', slug: 'land-patta-services' },
  'land': { id: 5, name: 'Land & Patta Services', slug: 'land-patta-services' },
  'passport-services': { id: 6, name: 'Passport Services', slug: 'passport-services' },
  'passport': { id: 6, name: 'Passport Services', slug: 'passport-services' },
  'driving-vehicle-services': { id: 7, name: 'Driving & Vehicle Services', slug: 'driving-vehicle-services' },
  'driving-licence': { id: 7, name: 'Driving & Vehicle Services', slug: 'driving-vehicle-services' },
  'driving-services': { id: 7, name: 'Driving & Vehicle Services', slug: 'driving-vehicle-services' },
  'business-services': { id: 8, name: 'Business Services', slug: 'business-services' },
  'business': { id: 8, name: 'Business Services', slug: 'business-services' },
  'utility-services': { id: 9, name: 'Utility Services', slug: 'utility-services' },
  'utility': { id: 9, name: 'Utility Services', slug: 'utility-services' },
  'ration-card-services': { id: 10, name: 'Ration Card Services', slug: 'ration-card-services' },
  'other-digital-services': { id: 10, name: 'Ration Card Services', slug: 'ration-card-services' }
};

// Explicit Land & Patta services from user screenshot
const LAND_PATTA_SERVICES = [
  {
    slug: 'patta-chitta',
    name: 'Patta / Chitta Online Application & Copy',
    category_slug: 'land-patta-services',
    fee: 30,
    processing_time: 'Instant / 1 Working Day',
    description: 'Official online application for Patta Chitta extract, name transfer & ownership verification.',
    documents_required: ['District, Taluk, Village Details', 'Survey Number / Sub-division / Patta Number'],
    eligibility: ['Property owner or legal representative', 'Any citizen searching public land records'],
    fields: [
      { name: 'district', label: 'District Name', type: 'text', required: true },
      { name: 'taluk', label: 'Taluk Name', type: 'text', required: true },
      { name: 'village', label: 'Village Name', type: 'text', required: true },
      { name: 'survey_number', label: 'Survey Number & Sub-division', type: 'text', required: true },
      { name: 'patta_number', label: 'Patta Number (if available)', type: 'text', required: false }
    ],
    documents: [
      { name: 'District, Taluk, Village Details', description: 'Location details of the land' },
      { name: 'Survey Number / Sub-division / Patta Number', description: 'Land survey identifiers' }
    ]
  },
  {
    slug: 'patta-transfer-application',
    name: 'Patta / Chitta Name Transfer Application',
    category_slug: 'land-patta-services',
    fee: 100,
    processing_time: '15–30 Working Days',
    description: 'Apply for official Patta transfer in revenue land records post property purchase or inheritance.',
    documents_required: ['Registered Sale Deed', 'Parent Patta Copy', 'Property Tax Receipt', 'Aadhaar Card'],
    eligibility: ['New property buyer or legal heir seeking revenue record transfer'],
    fields: [
      { name: 'applicant_name', label: 'Applicant Full Name', type: 'text', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'text', required: true },
      { name: 'district_taluk', label: 'District, Taluk & Village', type: 'text', required: true },
      { name: 'survey_no', label: 'Survey Number & Sub-division', type: 'text', required: true },
      { name: 'sale_deed_no', label: 'Registered Sale Deed / Doc Number', type: 'text', required: true },
      { name: 'transfer_reason', label: 'Reason for Transfer (Purchase / Inheritance / Gift)', type: 'text', required: true }
    ],
    documents: [
      { name: 'Registered Sale Deed', description: 'Clear copy of registered sale deed document' },
      { name: 'Parent Patta Copy', description: 'Copy of existing parent patta' },
      { name: 'Property Tax Receipt', description: 'Latest paid property tax receipt' },
      { name: 'Aadhaar Card', description: 'Applicant identity proof' }
    ]
  },
  {
    slug: 'chitta-extract-download',
    name: 'A-Register & Chitta Extract Copy',
    category_slug: 'land-patta-services',
    fee: 50,
    processing_time: '1–2 Working Days',
    description: 'Get officially verified digital extract of A-Register & land ownership Chitta statement.',
    documents_required: ['District, Taluk, Village Name', 'Survey Number / Sub-division'],
    eligibility: ['Public record available to any citizen or property buyer'],
    fields: [
      { name: 'district', label: 'District Name', type: 'text', required: true },
      { name: 'taluk', label: 'Taluk Name', type: 'text', required: true },
      { name: 'village', label: 'Village Name', type: 'text', required: true },
      { name: 'survey_no', label: 'Survey Number & Sub-division', type: 'text', required: true }
    ],
    documents: [
      { name: 'District, Taluk, Village Name', description: 'Revenue boundary details' },
      { name: 'Survey Number / Sub-division', description: 'Plot identification number' }
    ]
  },
  {
    slug: 'fmb-sketch-map',
    name: 'Field Measurement Book (FMB) Sketch Copy',
    category_slug: 'land-patta-services',
    fee: 60,
    processing_time: '2–3 Working Days',
    description: 'Download field sketch map showing exact boundary measurements for your survey land number.',
    documents_required: ['Taluk & Village Details', 'Survey Number & Sub-division'],
    eligibility: ['Land owner, boundary verification seeker, surveyor'],
    fields: [
      { name: 'district', label: 'District Name', type: 'text', required: true },
      { name: 'taluk', label: 'Taluk Name', type: 'text', required: true },
      { name: 'village', label: 'Village Name', type: 'text', required: true },
      { name: 'survey_no', label: 'Survey Number & Sub-division', type: 'text', required: true }
    ],
    documents: [
      { name: 'Taluk & Village Details', description: 'Revenue location identifier' },
      { name: 'Survey Number & Sub-division', description: 'Exact land plot number' }
    ]
  },
  {
    slug: 'encumbrance-certificate-ec',
    name: 'Encumbrance Certificate (EC) Application',
    category_slug: 'land-patta-services',
    fee: 120,
    processing_time: '3–5 Working Days',
    description: 'Obtain certified Encumbrance Certificate verifying historical ownership sales & mortgage encumbrances.',
    documents_required: ['Property Location Details', 'Survey Number', 'Search Period (Years)'],
    eligibility: ['Any individual verifying legal encumbrance title before property transaction'],
    fields: [
      { name: 'sro_zone', label: 'Sub-Registrar Office (SRO) Zone', type: 'text', required: true },
      { name: 'village', label: 'Village / Town Name', type: 'text', required: true },
      { name: 'survey_no', label: 'Survey Number / Flat / Plot Number', type: 'text', required: true },
      { name: 'period_from', label: 'Search Start Year (e.g. 1987)', type: 'number', required: true },
      { name: 'period_to', label: 'Search End Year (e.g. 2026)', type: 'number', required: true }
    ],
    documents: [
      { name: 'Property Location Details', description: 'SRO and boundary description' },
      { name: 'Survey Number', description: 'Revenue survey and sub-division' },
      { name: 'Search Period (Years)', description: 'Search duration specification' }
    ]
  },
  {
    slug: 'land-subdivision-patta',
    name: 'Sub-division Patta Issuance',
    category_slug: 'land-patta-services',
    fee: 200,
    processing_time: '30–45 Working Days',
    description: 'Apply for separate individual sub-division Patta when purchasing part of a larger survey plot.',
    documents_required: ['Sale Deed with Layout Plan', 'Original Joint Patta Copy', 'Field Survey Report'],
    eligibility: ['Buyer of sub-divided plot, plot developer, partitioned family member'],
    fields: [
      { name: 'applicant_name', label: 'Applicant Name', type: 'text', required: true },
      { name: 'mobile_number', label: 'Mobile Number', type: 'text', required: true },
      { name: 'district_taluk', label: 'District, Taluk & Village', type: 'text', required: true },
      { name: 'parent_survey', label: 'Parent Survey Number', type: 'text', required: true },
      { name: 'extent', label: 'Plot Extent / Area in Sq.Ft or Cents', type: 'text', required: true }
    ],
    documents: [
      { name: 'Sale Deed with Layout Plan', description: 'Registered title deed showing boundary diagram' },
      { name: 'Original Joint Patta Copy', description: 'Existing combined patta document' },
      { name: 'Field Survey Report', description: 'Surveyor sketch or approved layout plan' }
    ]
  }
];

async function seedAllServices() {
  console.log('🚀 Starting Comprehensive Services Seeding...');

  // 1. Fetch existing services from TiDB to preserve IDs
  const [existingTiDBRows] = await pool.query('SELECT * FROM services');
  console.log(`Found ${existingTiDBRows.length} existing services in TiDB.`);

  const existingSlugMap = new Map();
  for (const row of existingTiDBRows) {
    existingSlugMap.set(row.slug.toLowerCase().trim(), row);
  }

  // 2. Prepare aggregated service catalog map
  const allServicesMap = new Map();

  // First, add all from DEFAULT_SERVICES_MAP
  for (const [slugKey, srv] of Object.entries(DEFAULT_SERVICES_MAP)) {
    const slug = (srv.slug || slugKey).toLowerCase().trim();
    if (!allServicesMap.has(slug)) {
      allServicesMap.set(slug, { ...srv, slug });
    }
  }

  // Next, add/override the explicit 6 Land & Patta services
  for (const srv of LAND_PATTA_SERVICES) {
    allServicesMap.set(srv.slug.toLowerCase().trim(), srv);
  }

  console.log(`Aggregated ${allServicesMap.size} unique services to process.`);

  // 3. Connect to TiDB and insert/update
  let insertedCount = 0;
  let updatedCount = 0;

  const dbDataServices = [];
  const dbDataFields = [];
  const dbDataDocs = [];

  let nextFieldId = 1;
  let nextDocId = 1;
  let maxServiceId = existingTiDBRows.reduce((max, r) => Math.max(max, r.id || 0), 0);

  for (const [slug, srv] of allServicesMap.entries()) {
    const catSlug = (srv.category_slug || srv.category || 'certificate-services').toLowerCase().trim();
    const catInfo = CATEGORY_MAPPING[catSlug] || CATEGORY_MAPPING['certificate-services'];

    const serviceFee = typeof srv.fee === 'number' ? srv.fee : (Number(srv.fee) || 60);
    const serviceName = (srv.name || srv.title || slug).trim();
    const description = srv.description || `Official e-Seva service for ${serviceName}`;
    const processingTime = srv.processing_time || srv.sla || '2-5 Working Days';
    const eligibility = Array.isArray(srv.eligibility) ? srv.eligibility : [srv.eligibility || 'All eligible citizens'];
    
    // Documents
    let docsRequired = [];
    if (Array.isArray(srv.documents_required)) {
      docsRequired = srv.documents_required;
    } else if (Array.isArray(srv.docs)) {
      docsRequired = srv.docs;
    } else if (Array.isArray(srv.documents)) {
      docsRequired = srv.documents.map(d => typeof d === 'string' ? d : (d.document_name || d.name));
    } else {
      docsRequired = ['Aadhaar Card Copy', 'Passport Size Photograph', 'Address Proof'];
    }

    // Dynamic Fields
    let formFields = [];
    if (Array.isArray(srv.fields) && srv.fields.length > 0) {
      formFields = srv.fields.map((f, idx) => ({
        field_name: f.name || f.field_name || `field_${idx + 1}`,
        field_label: f.label || f.field_label || f.name || `Field ${idx + 1}`,
        field_type: f.type || f.field_type || 'text',
        is_required: f.required !== false && f.is_required !== false,
        placeholder: f.placeholder || '',
        helpText: f.helpText || '',
        sort_order: idx + 1
      }));
    } else {
      formFields = [
        { field_name: 'applicant_name', field_label: 'Applicant Full Name', field_type: 'text', is_required: true, sort_order: 1 },
        { field_name: 'mobile_number', field_label: 'Mobile Number', field_type: 'text', is_required: true, sort_order: 2 },
        { field_name: 'aadhaar_number', field_label: 'Aadhaar / ID Number', field_type: 'text', is_required: true, sort_order: 3 },
        { field_name: 'address', field_label: 'Residential Address', field_type: 'textarea', is_required: true, sort_order: 4 }
      ];
    }

    const existingRow = existingSlugMap.get(slug);
    let serviceId;

    if (existingRow) {
      serviceId = existingRow.id;
      // Update in TiDB
      await pool.query(
        `UPDATE services SET 
          category_id = ?, 
          category_slug = ?, 
          name = ?, 
          description = ?, 
          fee = ?, 
          total_fee = ?, 
          govt_fee = ?, 
          processing_time = ?, 
          documents_required = ?, 
          eligibility = ?, 
          status = 'active', 
          is_active = 1,
          fields_json = ?,
          documents_json = ?
        WHERE id = ?`,
        [
          catInfo.id,
          catInfo.slug,
          serviceName,
          description,
          serviceFee,
          serviceFee,
          serviceFee,
          processingTime,
          JSON.stringify(docsRequired),
          JSON.stringify(eligibility),
          JSON.stringify(formFields),
          JSON.stringify(docsRequired),
          serviceId
        ]
      );
      updatedCount++;
    } else {
      maxServiceId++;
      serviceId = maxServiceId;
      // Insert into TiDB
      await pool.query(
        `INSERT INTO services (
          id, category_id, category_slug, name, slug, description, fee, total_fee, govt_fee, 
          processing_time, documents_required, eligibility, status, is_active, fields_json, documents_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 1, ?, ?)`,
        [
          serviceId,
          catInfo.id,
          catInfo.slug,
          serviceName,
          slug,
          description,
          serviceFee,
          serviceFee,
          serviceFee,
          processingTime,
          JSON.stringify(docsRequired),
          JSON.stringify(eligibility),
          JSON.stringify(formFields),
          JSON.stringify(docsRequired)
        ]
      );
      insertedCount++;
    }

    // Build local DB object
    const serviceObj = {
      id: serviceId,
      category_id: catInfo.id,
      category_name: catInfo.name,
      category_slug: catInfo.slug,
      name: serviceName,
      slug,
      description,
      eligibility: eligibility.join('; '),
      processing_time: processingTime,
      fee: serviceFee,
      total_fee: serviceFee,
      govt_fee: serviceFee,
      image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop',
      is_active: true,
      status: 'Active',
      documents_required: docsRequired,
      fields: formFields,
      documents: docsRequired
    };
    dbDataServices.push(serviceObj);

    // Build service_fields and service_documents for local DB
    formFields.forEach((f, idx) => {
      dbDataFields.push({
        id: nextFieldId++,
        service_id: serviceId,
        field_name: f.field_name,
        field_label: f.field_label,
        field_type: f.field_type,
        is_required: f.is_required ? 1 : 0,
        sort_order: idx + 1
      });
    });

    docsRequired.forEach(docName => {
      dbDataDocs.push({
        id: nextDocId++,
        service_id: serviceId,
        document_name: docName,
        description: `Upload clear copy of ${docName}`,
        is_required: 1
      });
    });
  }

  console.log(`✅ TiDB Cloud: ${insertedCount} new services inserted, ${updatedCount} existing services updated! Total: ${allServicesMap.size}`);

  // 4. Update local db_data.json
  if (fs.existsSync(DB_FILE)) {
    const dbJson = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    dbJson.services = dbDataServices;
    dbJson.service_fields = dbDataFields;
    dbJson.service_documents = dbDataDocs;
    fs.writeFileSync(DB_FILE, JSON.stringify(dbJson, null, 2), 'utf8');
    console.log(`✅ db_data.json updated with ${dbDataServices.length} services, ${dbDataFields.length} fields, and ${dbDataDocs.length} documents!`);
  }

  process.exit(0);
}

seedAllServices().catch(err => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
