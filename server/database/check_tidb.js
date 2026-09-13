import pool from './mysql_db.js';

async function check() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("SELECT id, name, slug FROM services");
    console.log('TiDB Services Rows:', JSON.stringify(rows, null, 2));

    // Force update all names containing parentheses
    await conn.query(`
      UPDATE services 
      SET name = REGEXP_REPLACE(name, '\\\\s*\\\\([^)]*\\\\)', '')
      WHERE name LIKE '%(%';
    `);

    const [updatedRows] = await conn.query("SELECT id, name, slug FROM services WHERE name LIKE '%(%'");
    console.log('Services still containing parentheses:', updatedRows.length);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    conn.release();
    process.exit(0);
  }
}

check();
