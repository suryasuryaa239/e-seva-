import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'db_data.json');

const initialTables = {
  users: [],
  admins: [],
  categories: [],
  services: [],
  service_fields: [],
  service_documents: [],
  applications: [],
  application_field_values: [],
  application_documents: [],
  payments: [],
  application_status_history: [],
  contact_messages: [],
  career_applications: []
};

class LocalDatabase {
  constructor() {
    this.data = { ...initialTables };
    this.init();
  }

  init() {
    this.data = { ...initialTables };
    const tmpPath = path.join('/tmp', 'db_data.json');

    try {
      if (process.env.VERCEL && fs.existsSync(tmpPath)) {
        const raw = fs.readFileSync(tmpPath, 'utf8');
        this.data = { ...initialTables, ...JSON.parse(raw) };
      } else if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = { ...initialTables, ...JSON.parse(raw) };
      }
    } catch (err) {
      console.warn('[DB INIT WARNING] Using initial seed state:', err.message);
      this.data = { ...initialTables };
    }
  }

  save() {
    try {
      const targetPath = process.env.VERCEL ? path.join('/tmp', 'db_data.json') : DB_FILE;
      fs.writeFileSync(targetPath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.warn('[DB SAVE WARNING] Read-only environment, state maintained in-memory:', err.message);
    }
  }

  all(tableName, filterFn = null) {
    const list = this.data[tableName] || [];
    if (!filterFn) return [...list];
    return list.filter(filterFn);
  }

  get(tableName, filterFn) {
    const list = this.data[tableName] || [];
    return list.find(filterFn) || null;
  }

  insert(tableName, row) {
    if (!this.data[tableName]) {
      this.data[tableName] = [];
    }
    const maxId = this.data[tableName].reduce((max, item) => Math.max(max, item.id || 0), 0);
    const newRow = {
      id: maxId + 1,
      created_at: new Date().toISOString(),
      ...row
    };
    this.data[tableName].push(newRow);
    this.save();
    return newRow;
  }

  update(tableName, filterFn, updates) {
    if (!this.data[tableName]) return null;
    let updatedCount = 0;
    this.data[tableName] = this.data[tableName].map(item => {
      if (filterFn(item)) {
        updatedCount++;
        return {
          ...item,
          ...updates,
          updated_at: new Date().toISOString()
        };
      }
      return item;
    });
    if (updatedCount > 0) this.save();
    return updatedCount;
  }

  delete(tableName, filterFn) {
    if (!this.data[tableName]) return 0;
    const initialLen = this.data[tableName].length;
    this.data[tableName] = this.data[tableName].filter(item => !filterFn(item));
    const removedCount = initialLen - this.data[tableName].length;
    if (removedCount > 0) this.save();
    return removedCount;
  }

  generateNextApplicationNumber(prefix = 'ESV-2026') {
    const list = this.data['applications'] || [];
    let maxSeq = 0;
    const regex = new RegExp(`^${prefix}-(\\d+)$`);
    
    for (const app of list) {
      if (app.application_number) {
        const match = app.application_number.match(regex);
        if (match) {
          const seq = parseInt(match[1], 10);
          if (!isNaN(seq) && seq > maxSeq) {
            maxSeq = seq;
          }
        }
      }
    }

    const nextSeq = maxSeq + 1;
    return `${prefix}-${String(nextSeq).padStart(6, '0')}`;
  }

  transaction(fn) {
    const snapshot = JSON.parse(JSON.stringify(this.data));
    try {
      const result = fn();
      this.save();
      return result;
    } catch (err) {
      this.data = snapshot;
      this.save();
      throw err;
    }
  }

  reset() {
    this.data = {
      users: [],
      admins: [],
      categories: [],
      services: [],
      service_fields: [],
      service_documents: [],
      applications: [],
      application_field_values: [],
      application_documents: [],
      payments: [],
      application_status_history: [],
      contact_messages: [],
      career_applications: []
    };
    this.save();
  }
}

export const db = new LocalDatabase();
