import pool from './mysql_db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db_data.json');

async function cleanTitles() {
  console.log('[DB CONFIG] Cleaning service titles in TiDB Cloud MySQL...');
  try {
    const connection = await pool.getConnection();
    try {
      // 1. Update services table
      await connection.query(`UPDATE services SET name = 'Income Certificate' WHERE name LIKE '%Varumaana%' OR slug = 'income-certificate';`);
      await connection.query(`UPDATE services SET name = 'Community Certificate' WHERE name LIKE '%Jaathi%' OR slug = 'community-certificate';`);
      await connection.query(`UPDATE services SET name = 'Patta Chitta Copy' WHERE name LIKE '%AnyTamilLand%' OR slug = 'patta-chitta-extract';`);

      // 2. Update applications table
      await connection.query(`UPDATE applications SET service_name = 'Income Certificate' WHERE service_name LIKE '%Varumaana%';`);
      await connection.query(`UPDATE applications SET service_name = 'Community Certificate' WHERE service_name LIKE '%Jaathi%';`);
      await connection.query(`UPDATE applications SET service_name = 'Patta Chitta Copy' WHERE service_name LIKE '%AnyTamilLand%';`);

      console.log('🎉 [TiDB CLOUD] Successfully updated services and applications tables in TiDB!');
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Failed to update TiDB:', err.message);
  }

  // 3. Clean local db_data.json file
  try {
    if (fs.existsSync(DB_FILE)) {
      let raw = fs.readFileSync(DB_FILE, 'utf8');
      raw = raw.replace(/Income Certificate \(Varumaana Saanrithazh\)/g, 'Income Certificate')
               .replace(/Community Certificate \(Jaathi Saanrithazh\)/g, 'Community Certificate')
               .replace(/Patta Chitta Copy \(AnyTamilLand\)/g, 'Patta Chitta Copy');
      fs.writeFileSync(DB_FILE, raw, 'utf8');
      console.log('✅ Local db_data.json file cleaned successfully!');
    }
  } catch (err) {
    console.error('Failed to clean db_data.json:', err.message);
  }

  process.exit(0);
}

cleanTitles();
