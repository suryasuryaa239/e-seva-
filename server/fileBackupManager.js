import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_BASE = path.join(__dirname, 'uploads');
const DOCUMENTS_DIR = path.join(UPLOADS_BASE, 'documents');
const RESUMES_DIR = path.join(UPLOADS_BASE, 'resumes');
const TEMP_DIR = path.join(UPLOADS_BASE, 'temp');

const BACKUP_DOCS_DIR = path.join(__dirname, 'backups', 'documents');

/**
 * Initializes private storage directories
 */
export function initPrivateStorageDirs() {
  const targetBase = process.env.VERCEL ? '/tmp' : __dirname;
  [
    path.join(targetBase, 'uploads'),
    path.join(targetBase, 'uploads', 'documents'),
    path.join(targetBase, 'uploads', 'resumes'),
    path.join(targetBase, 'uploads', 'temp'),
    path.join(targetBase, 'backups', 'documents')
  ].forEach(dir => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (err) {
      console.warn('[STORAGE DIR WARNING] Read-only environment:', err.message);
    }
  });
}

/**
 * Creates a directory copy backup of uploaded documents
 * @returns {string} Backup directory path
 */
export function backupUploadedDocuments() {
  initPrivateStorageDirs();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const targetDir = path.join(BACKUP_DOCS_DIR, `docs_backup_${timestamp}`);
  fs.mkdirSync(targetDir, { recursive: true });

  const copyRecursive = (src, dest) => {
    if (!fs.existsSync(src)) return;
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };

  copyRecursive(DOCUMENTS_DIR, path.join(targetDir, 'documents'));
  copyRecursive(RESUMES_DIR, path.join(targetDir, 'resumes'));

  console.log(`[FileBackupManager] Document snapshot backup created at ${targetDir}`);
  return targetDir;
}

/**
 * Cleans temporary draft uploads older than specified hours (default 24h)
 * @param {number} maxAgeHours 
 */
export function cleanTempUploads(maxAgeHours = 24) {
  initPrivateStorageDirs();
  const cutoff = Date.now() - maxAgeHours * 60 * 60 * 1000;
  let count = 0;

  if (fs.existsSync(TEMP_DIR)) {
    const files = fs.readdirSync(TEMP_DIR);
    for (const file of files) {
      const fullPath = path.join(TEMP_DIR, file);
      const stats = fs.statSync(fullPath);
      if (stats.mtime.getTime() < cutoff) {
        fs.unlinkSync(fullPath);
        count++;
      }
    }
  }

  if (count > 0) {
    console.log(`[FileBackupManager] Cleaned ${count} expired temporary draft upload files.`);
  }
}

// Initial setup
initPrivateStorageDirs();
