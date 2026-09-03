import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_DIR = path.join(__dirname, '..', 'backups', 'database');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * Creates a JSON snapshot backup of the current database state
 * @returns {string} Backup file path
 */
export function createDatabaseBackup() {
  db.read();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `db_backup_${timestamp}.json`;
  const filePath = path.join(BACKUP_DIR, filename);

  const backupPayload = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    data: db.data
  };

  fs.writeFileSync(filePath, JSON.stringify(backupPayload, null, 2), 'utf-8');
  console.log(`[BackupManager] Database backup successfully created: ${filePath}`);
  return filePath;
}

/**
 * Lists all existing database backup files
 * @returns {Array<{ filename: string, created_at: string, size_bytes: number }>}
 */
export function listBackups() {
  if (!fs.existsSync(BACKUP_DIR)) return [];

  const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json'));
  return files.map(file => {
    const fullPath = path.join(BACKUP_DIR, file);
    const stats = fs.statSync(fullPath);
    return {
      filename: file,
      created_at: stats.mtime.toISOString(),
      size_bytes: stats.size
    };
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Restores database from a specified backup file
 * @param {string} filename - Name of backup JSON file
 * @returns {boolean} Success status
 */
export function restoreDatabaseBackup(filename) {
  const filePath = path.join(BACKUP_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Backup file does not exist: ${filename}`);
  }

  // Create safety pre-restore backup first
  console.log('[BackupManager] Creating pre-restore safety snapshot...');
  createDatabaseBackup();

  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);

  if (!parsed || !parsed.data) {
    throw new Error(`Invalid backup file structure in ${filename}`);
  }

  db.data = parsed.data;
  db.write();
  console.log(`[BackupManager] Database successfully restored from ${filename}`);
  return true;
}

/**
 * Removes backups older than specified retention days (default 30 days)
 * @param {number} retentionDays 
 */
export function cleanOldBackups(retentionDays = 30) {
  const backups = listBackups();
  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  let pruned = 0;

  for (const backup of backups) {
    const fileTime = new Date(backup.created_at).getTime();
    if (fileTime < cutoff) {
      const fullPath = path.join(BACKUP_DIR, backup.filename);
      fs.unlinkSync(fullPath);
      pruned++;
    }
  }

  if (pruned > 0) {
    console.log(`[BackupManager] Pruned ${pruned} database backup files older than ${retentionDays} days.`);
  }
}

// CLI Execution support
if (process.argv[2] === '--backup') {
  createDatabaseBackup();
  cleanOldBackups(30);
} else if (process.argv[2] === '--restore' && process.argv[3]) {
  restoreDatabaseBackup(process.argv[3]);
} else if (process.argv[2] === '--list') {
  console.log('[BackupManager] Available Backups:');
  console.table(listBackups());
}
