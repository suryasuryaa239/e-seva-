import pool from './mysql_db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db_data.json');

async function purgeEnquiries() {
  console.log('Purging contact_messages...');
  try {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM contact_messages;');
    conn.release();
    console.log('✅ TiDB Cloud contact_messages table cleared successfully!');
  } catch (e) {
    console.warn('⚠️ TiDB Warning:', e.message);
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      data.contact_messages = [];
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
      console.log('✅ Local db_data.json contact_messages cleared successfully!');
    }
  } catch (e) {
    console.error('Failed to update db_data.json:', e.message);
  }
}

purgeEnquiries().then(() => process.exit(0));
