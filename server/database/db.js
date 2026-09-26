import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool, { initializeDatabaseSchema } from './mysql_db.js';

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
  career_applications: [],
  banners: [],
  notifications: [],
  document_audit_history: [],
  site_settings: []
};

class TiDBSupportedDatabase {
  constructor() {
    this.data = { ...initialTables };
    this._inTransaction = false;
    this.init();
  }

  async init() {
    this.data = { ...initialTables };
    try {
      const tmpFile = path.join('/tmp', 'db_data.json');
      const targetFile = (process.env.VERCEL && fs.existsSync(tmpFile)) ? tmpFile : DB_FILE;
      if (fs.existsSync(targetFile)) {
        const raw = fs.readFileSync(targetFile, 'utf8');
        this.data = { ...initialTables, ...JSON.parse(raw) };
      }
    } catch (err) {
      console.warn('[DB INIT WARNING] Using initial memory state:', err.message);
    }

    // Connect & load sync from TiDB Cloud MySQL
    try {
      await initializeDatabaseSchema();
      await this.syncFromTiDB();
    } catch (e) {
      console.error('[TiDB SYNC INIT ERROR]', e.message);
    }
  }

  async getTableColumns(tableName) {
    if (!this._tableColumns) this._tableColumns = {};
    if (this._tableColumns[tableName]) return this._tableColumns[tableName];
    try {
      const [cols] = await pool.query(`DESCRIBE ${tableName}`);
      this._tableColumns[tableName] = new Set(cols.map(c => c.Field));
      return this._tableColumns[tableName];
    } catch (e) {
      return null;
    }
  }

  async syncFromTiDB() {
    try {
      const conn = await pool.getConnection();
      try {
        const tables = ['users', 'admins', 'categories', 'services', 'applications', 'payments', 'contact_messages', 'career_applications', 'banners', 'notifications', 'application_documents', 'application_field_values', 'site_settings'];
        for (const tbl of tables) {
          try {
            const [rows] = await conn.query(`SELECT * FROM ${tbl}`);
            const parsedRows = (rows || []).map(r => {
              const obj = { ...r };
              for (const key of Object.keys(obj)) {
                if (typeof obj[key] === 'string' && (obj[key].startsWith('{') || obj[key].startsWith('['))) {
                  try {
                    obj[key] = JSON.parse(obj[key]);
                  } catch (e) {}
                }
              }
              return obj;
            });

            if (tbl === 'applications') {
              // Intelligent non-destructive merge: preserve local records and incorporate TiDB records
              const localApps = this.data['applications'] || [];
              const appMap = new Map();

              // 1. Load local applications first
              for (const a of localApps) {
                const key = a.application_number ? String(a.application_number).trim() : `id_${a.id}`;
                appMap.set(key, { ...a });
              }

              // 2. Merge TiDB applications
              const tidbAppNumbers = new Set();
              for (const r of parsedRows) {
                const key = r.application_number ? String(r.application_number).trim() : `id_${r.id}`;
                if (r.application_number) tidbAppNumbers.add(String(r.application_number).trim());

                const existing = appMap.get(key) || {};
                const merged = {
                  ...existing,
                  ...r,
                  user_name: r.user_name || r.applicant_name || existing.user_name || 'Citizen',
                  applicant_name: r.user_name || r.applicant_name || existing.applicant_name || 'Citizen',
                  user_email: r.user_email || r.applicant_email || existing.user_email || '',
                  applicant_email: r.user_email || r.applicant_email || existing.applicant_email || '',
                  user_phone: r.user_phone || r.applicant_phone || existing.user_phone || '',
                  applicant_phone: r.user_phone || r.applicant_phone || existing.applicant_phone || '',
                  total_fee: r.total_fee !== undefined && r.total_fee !== null ? r.total_fee : (r.fee_amount !== undefined ? r.fee_amount : (existing.total_fee || 0)),
                  fee_amount: r.total_fee !== undefined && r.total_fee !== null ? r.total_fee : (r.fee_amount !== undefined ? r.fee_amount : (existing.total_fee || 0)),
                  admin_remarks: r.admin_remarks || r.remarks || existing.admin_remarks || '',
                  remarks: r.admin_remarks || r.remarks || existing.admin_remarks || '',
                  status: r.status || existing.status || 'SUBMITTED',
                  current_step: r.current_step || existing.current_step || 5
                };
                appMap.set(key, merged);
              }

              this.data['applications'] = Array.from(appMap.values()).sort((a, b) => (b.id || 0) - (a.id || 0));

              // 3. Push any local applications that are missing from TiDB into TiDB
              for (const app of localApps) {
                if (app.application_number && !tidbAppNumbers.has(String(app.application_number).trim())) {
                  this.persistInsertToTiDB('applications', app).catch(() => {});
                }
              }
            } else if (parsedRows.length > 0) {
              this.data[tbl] = parsedRows;
            } else if (tbl === 'banners' && parsedRows.length === 0) {
              const defaultBanners = (this.data['banners'] && this.data['banners'].length > 0) ? [...this.data['banners']] : [
                {
                  title: 'Government Services at Your Doorstep',
                  description: 'Apply for Community, Birth, Income & Residence Certificates online with instant tracking.',
                  image_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1200&auto=format&fit=crop',
                  link_url: '/services',
                  duration_seconds: 5,
                  status: 'Active',
                  display_order: 1
                },
                {
                  title: 'Fast-Track Aadhaar & Ration Card Portals',
                  description: 'Update your biometric details, mobile number, and address seamlessly.',
                  image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop',
                  link_url: '/category/aadhaar',
                  duration_seconds: 6,
                  status: 'Active',
                  display_order: 2
                },
                {
                  title: 'TNeGA Verified Digital Documentation',
                  description: 'Upload, inspect, and download official certificate records with automated SMS notifications.',
                  image_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop',
                  link_url: '/track',
                  duration_seconds: 5,
                  status: 'Active',
                  display_order: 3
                }
              ];
              this.data['banners'] = [];
              for (const b of defaultBanners) {
                this.insert('banners', b);
              }
            }
          } catch (e) {
            console.warn(`[SYNC WARNING] Table ${tbl}:`, e.message);
          }
        }
        this.saveLocal();
        console.log('✅ [TiDB CLOUD] Successfully loaded & synchronized tables from TiDB Cloud MySQL!');
      } finally {
        conn.release();
      }
    } catch (err) {
      console.error('Failed to sync from TiDB:', err.message);
    }
  }

  saveLocal() {
    try {
      const targetPath = process.env.VERCEL ? path.join('/tmp', 'db_data.json') : DB_FILE;
      fs.writeFileSync(targetPath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {}
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

    if (tableName === 'applications') {
      newRow.user_name = newRow.user_name || newRow.applicant_name || 'Citizen';
      newRow.applicant_name = newRow.user_name;
      newRow.user_email = newRow.user_email || newRow.applicant_email || '';
      newRow.applicant_email = newRow.user_email;
      newRow.user_phone = newRow.user_phone || newRow.applicant_phone || '';
      newRow.applicant_phone = newRow.user_phone;
      newRow.total_fee = newRow.total_fee !== undefined ? newRow.total_fee : (newRow.fee_amount || 0);
      newRow.fee_amount = newRow.total_fee;
      newRow.admin_remarks = newRow.admin_remarks || newRow.remarks || '';
      newRow.remarks = newRow.admin_remarks;
    }

    this.data[tableName].push(newRow);
    if (!this._inTransaction) {
      this.saveLocal();
    }

    // Async save to TiDB Cloud with safe error boundary
    this.persistInsertToTiDB(tableName, newRow).catch(err => {
      console.warn(`[TiDB PERSIST INSERT WARNING] ${tableName}:`, err.message);
    });

    return newRow;
  }

  async persistInsertToTiDB(tableName, row) {
    try {
      const allowedTables = ['users', 'admins', 'categories', 'services', 'applications', 'payments', 'contact_messages', 'career_applications', 'banners', 'notifications', 'application_documents', 'application_field_values', 'site_settings'];
      if (!allowedTables.includes(tableName)) return;

      const validCols = await this.getTableColumns(tableName);
      const cleanRow = { ...row };

      if (tableName === 'applications') {
        cleanRow.user_name = cleanRow.user_name || cleanRow.applicant_name;
        cleanRow.applicant_name = cleanRow.user_name || cleanRow.applicant_name;
        cleanRow.user_email = cleanRow.user_email || cleanRow.applicant_email;
        cleanRow.applicant_email = cleanRow.user_email || cleanRow.applicant_email;
        cleanRow.user_phone = cleanRow.user_phone || cleanRow.applicant_phone;
        cleanRow.applicant_phone = cleanRow.user_phone || cleanRow.applicant_phone;
        cleanRow.total_fee = cleanRow.total_fee !== undefined ? cleanRow.total_fee : (cleanRow.fee_amount || 0);
        cleanRow.fee_amount = cleanRow.total_fee;
        cleanRow.admin_remarks = cleanRow.admin_remarks || cleanRow.remarks || '';
        cleanRow.remarks = cleanRow.admin_remarks;
      }

      // Filter only columns that physically exist in the TiDB table
      const keys = Object.keys(cleanRow).filter(k => k !== 'id' && (!validCols || validCols.has(k)));
      if (keys.length === 0) return;

      const values = keys.map(k => typeof cleanRow[k] === 'object' && cleanRow[k] !== null ? JSON.stringify(cleanRow[k]) : cleanRow[k]);
      const placeholders = keys.map(() => '?').join(', ');

      const sql = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
      await pool.query(sql, values);
    } catch (e) {
      console.warn(`[TiDB SQL INSERT ERROR] ${tableName}:`, e.message);
    }
  }

  update(tableName, filterFn, updates) {
    if (!this.data[tableName]) return null;
    let updatedCount = 0;
    this.data[tableName] = this.data[tableName].map(item => {
      if (filterFn(item)) {
        updatedCount++;
        const updatedItem = {
          ...item,
          ...updates,
          updated_at: new Date().toISOString()
        };

        if (tableName === 'applications') {
          if (updatedItem.user_name) updatedItem.applicant_name = updatedItem.user_name;
          if (updatedItem.user_email) updatedItem.applicant_email = updatedItem.user_email;
          if (updatedItem.user_phone) updatedItem.applicant_phone = updatedItem.user_phone;
          if (updatedItem.total_fee !== undefined) updatedItem.fee_amount = updatedItem.total_fee;
          if (updatedItem.admin_remarks) updatedItem.remarks = updatedItem.admin_remarks;
        }

        // Async save to TiDB Cloud
        this.persistUpdateToTiDB(tableName, item.id, updates).catch(err => {
          console.warn(`[TiDB PERSIST UPDATE WARNING] ${tableName}:`, err.message);
        });
        return updatedItem;
      }
      return item;
    });
    if (updatedCount > 0 && !this._inTransaction) this.saveLocal();
    return updatedCount;
  }

  async persistUpdateToTiDB(tableName, id, updates) {
    try {
      const allowedTables = ['users', 'admins', 'categories', 'services', 'applications', 'payments', 'contact_messages', 'career_applications', 'banners', 'notifications', 'application_documents', 'application_field_values', 'site_settings'];
      if (!allowedTables.includes(tableName) || !id) return;

      const validCols = await this.getTableColumns(tableName);
      const cleanUpdates = { ...updates };

      if (tableName === 'applications') {
        if (cleanUpdates.user_name) cleanUpdates.applicant_name = cleanUpdates.user_name;
        if (cleanUpdates.user_email) cleanUpdates.applicant_email = cleanUpdates.user_email;
        if (cleanUpdates.user_phone) cleanUpdates.applicant_phone = cleanUpdates.user_phone;
        if (cleanUpdates.total_fee !== undefined) cleanUpdates.fee_amount = cleanUpdates.total_fee;
        if (cleanUpdates.admin_remarks) cleanUpdates.remarks = cleanUpdates.admin_remarks;
      }

      // Filter only columns that exist in TiDB table
      const keys = Object.keys(cleanUpdates).filter(k => !validCols || validCols.has(k));
      if (keys.length === 0) return;

      const setClause = keys.map(k => `${k} = ?`).join(', ');
      const values = keys.map(k => typeof cleanUpdates[k] === 'object' && cleanUpdates[k] !== null ? JSON.stringify(cleanUpdates[k]) : cleanUpdates[k]);
      values.push(id);

      const sql = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
      await pool.query(sql, values);
    } catch (e) {
      console.warn(`[TiDB SQL UPDATE ERROR] ${tableName}:`, e.message);
    }
  }

  delete(tableName, filterFn) {
    if (!this.data[tableName]) return 0;
    const initialLen = this.data[tableName].length;
    const itemsToDelete = this.data[tableName].filter(item => filterFn(item));
    this.data[tableName] = this.data[tableName].filter(item => !filterFn(item));
    const removedCount = initialLen - this.data[tableName].length;
    if (removedCount > 0) {
      if (!this._inTransaction) {
        this.saveLocal();
      }
      itemsToDelete.forEach(item => {
        if (item.id) {
          pool.query(`DELETE FROM ${tableName} WHERE id = ?`, [item.id]).catch(() => {});
        }
      });
    }
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

  async transaction(fn) {
    const snapshot = JSON.parse(JSON.stringify(this.data));
    this._inTransaction = true;
    try {
      const result = await fn();
      this._inTransaction = false;
      this.saveLocal();
      return result;
    } catch (err) {
      this.data = snapshot;
      this._inTransaction = false;
      this.saveLocal();
      throw err;
    }
  }

  read() {
    return this.data;
  }

  reset() {
    this.data = { ...initialTables };
    this.saveLocal();
  }
}

export const db = new TiDBSupportedDatabase();
