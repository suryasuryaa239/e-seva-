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
  document_audit_history: []
};

class TiDBSupportedDatabase {
  constructor() {
    this.data = { ...initialTables };
    this.init();
  }

  async init() {
    this.data = { ...initialTables };
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
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

  async syncFromTiDB() {
    try {
      const conn = await pool.getConnection();
      try {
        const tables = ['users', 'admins', 'categories', 'services', 'applications', 'payments', 'contact_messages', 'career_applications', 'notifications'];
        for (const tbl of tables) {
          try {
            const [rows] = await conn.query(`SELECT * FROM ${tbl}`);
            if (rows && rows.length > 0) {
              this.data[tbl] = rows.map(r => {
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
            }
          } catch (e) {}
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
    this.data[tableName].push(newRow);
    this.saveLocal();

    // Async save to TiDB Cloud
    this.persistInsertToTiDB(tableName, newRow).catch(err => {
      console.warn(`[TiDB PERSIST INSERT WARNING] ${tableName}:`, err.message);
    });

    return newRow;
  }

  async persistInsertToTiDB(tableName, row) {
    try {
      const allowedTables = ['users', 'admins', 'categories', 'services', 'applications', 'payments', 'contact_messages', 'career_applications', 'notifications'];
      if (!allowedTables.includes(tableName)) return;

      const keys = Object.keys(row).filter(k => k !== 'id');
      const values = keys.map(k => typeof row[k] === 'object' ? JSON.stringify(row[k]) : row[k]);
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
        // Async save to TiDB Cloud
        this.persistUpdateToTiDB(tableName, item.id, updates).catch(err => {
          console.warn(`[TiDB PERSIST UPDATE WARNING] ${tableName}:`, err.message);
        });
        return updatedItem;
      }
      return item;
    });
    if (updatedCount > 0) this.saveLocal();
    return updatedCount;
  }

  async persistUpdateToTiDB(tableName, id, updates) {
    try {
      const allowedTables = ['users', 'admins', 'categories', 'services', 'applications', 'payments', 'contact_messages', 'career_applications', 'notifications'];
      if (!allowedTables.includes(tableName) || !id) return;

      const keys = Object.keys(updates);
      if (keys.length === 0) return;

      const setClause = keys.map(k => `${k} = ?`).join(', ');
      const values = keys.map(k => typeof updates[k] === 'object' ? JSON.stringify(updates[k]) : updates[k]);
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
      this.saveLocal();
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

  transaction(fn) {
    const snapshot = JSON.parse(JSON.stringify(this.data));
    try {
      const result = fn();
      this.saveLocal();
      return result;
    } catch (err) {
      this.data = snapshot;
      this.saveLocal();
      throw err;
    }
  }

  reset() {
    this.data = { ...initialTables };
    this.saveLocal();
  }
}

export const db = new TiDBSupportedDatabase();
