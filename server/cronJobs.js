import { createDatabaseBackup, cleanOldBackups } from './database/backupManager.js';
import { cleanTempUploads, backupUploadedDocuments } from './fileBackupManager.js';

let cronTimer = null;

/**
 * Executes routine background maintenance tasks
 */
export function runMaintenanceTasks() {
  console.log('[CronJobs] Running scheduled production maintenance jobs...');
  try {
    // 1. Create database snapshot backup
    createDatabaseBackup();

    // 2. Clean old database backups (>30 days)
    cleanOldBackups(30);

    // 3. Clean temporary unsubmitted draft uploads (>24 hours)
    cleanTempUploads(24);

    // 4. Create snapshot of citizen documents
    backupUploadedDocuments();

    console.log('[CronJobs] Maintenance jobs completed successfully.');
  } catch (err) {
    console.error('[CronJobs] Error running maintenance tasks:', err.message);
  }
}

/**
 * Starts background scheduler (runs every 24 hours)
 */
export function initCronJobs() {
  if (cronTimer) return;

  console.log('[CronJobs] Initializing production maintenance scheduler (24h cycle)...');
  
  // Run once on server boot after delay
  setTimeout(() => {
    runMaintenanceTasks();
  }, 10000);

  // Schedule daily run (24 hours)
  cronTimer = setInterval(() => {
    runMaintenanceTasks();
  }, 24 * 60 * 60 * 1000);
}

export function stopCronJobs() {
  if (cronTimer) {
    clearInterval(cronTimer);
    cronTimer = null;
  }
}
