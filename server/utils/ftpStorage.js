import * as ftp from 'basic-ftp';
import { Readable } from 'stream';
import path from 'path';
import fs from 'fs';

/**
 * Normalizes FTP host and credentials from process.env
 */
export function getFtpConfig() {
  let host = (process.env.FTP_HOST || '').trim();
  // Strip protocol prefix if present (e.g., "ftp://195.35.44.99" -> "195.35.44.99")
  host = host.replace(/^ftps?:\/\//i, '').replace(/\/+$/, '');

  const port = parseInt(process.env.FTP_PORT || '21', 10);
  const user = (process.env.FTP_USER || '').trim();
  const password = (process.env.FTP_PASSWORD || '').trim();
  const secure = process.env.FTP_SECURE === 'true';
  const remoteBase = (process.env.FTP_REMOTE_BASE || 'public_html/eseva_uploads').trim().replace(/^\/+|\/+$/g, '');
  const publicUrlBase = (process.env.FTP_PUBLIC_URL_BASE || '').trim().replace(/\/+$/, '');

  return {
    host,
    port,
    user,
    password,
    secure,
    remoteBase,
    publicUrlBase
  };
}

/**
 * Checks whether FTP credentials are configured
 */
export function isFtpConfigured() {
  const config = getFtpConfig();
  return Boolean(config.host && config.user && config.password);
}

/**
 * Helper to get an authenticated FTP Client instance
 */
async function getConnectedClient() {
  const config = getFtpConfig();
  if (!config.host || !config.user || !config.password) {
    throw new Error('FTP credentials not fully configured in .env (FTP_HOST, FTP_USER, FTP_PASSWORD required)');
  }

  const client = new ftp.Client(12000); // 12-second timeout
  client.ftp.verbose = false;

  await client.access({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    secure: config.secure
  });

  return { client, config };
}

/**
 * Test FTP Connection and return directory information
 */
export async function testFTPConnection() {
  const { client, config } = await getConnectedClient();
  try {
    const currentDir = await client.pwd();
    const list = await client.list();
    return {
      success: true,
      host: config.host,
      port: config.port,
      user: config.user,
      currentDir,
      filesCount: list.length,
      files: list.slice(0, 10).map(f => ({ name: f.name, isDirectory: f.isDirectory }))
    };
  } finally {
    client.close();
  }
}

/**
 * Upload buffer or file to FTP server
 * @param {Object} params - { buffer, originalname, mimetype, filename, subDir }
 * @returns {Promise<{ url: string, filename: string, source: string, remotePath: string }>}
 */
export async function uploadToFTP({ buffer, originalname, mimetype, filename, subDir = 'documents' }) {
  const config = getFtpConfig();
  const cleanExt = path.extname(originalname || filename || '').toLowerCase() || '.jpg';
  const safeBase = (originalname || 'document').replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniqueName = filename || `${Date.now()}_${Math.round(Math.random() * 1e9)}_${safeBase}`;
  const targetFileName = uniqueName.endsWith(cleanExt) ? uniqueName : `${uniqueName}${cleanExt}`;

  // If FTP is fully configured, attempt upload
  if (isFtpConfigured() && buffer) {
    let client;
    try {
      const conn = await getConnectedClient();
      client = conn.client;

      // Enter or ensure the upload folder (public_html)
      const baseFolder = config.remoteBase || 'public_html';
      const currentPwd = await client.pwd();
      
      // If already in public_html (Hostinger jailed user), do not nest public_html/public_html
      let targetFolder = '';
      if (!currentPwd.endsWith(baseFolder) && !currentPwd.includes(baseFolder)) {
        try {
          const list = await client.list();
          const hasFolder = list.some(item => item.name === baseFolder && item.isDirectory);
          if (hasFolder) {
            await client.cd(baseFolder);
            targetFolder = baseFolder;
          } else {
            await client.ensureDir(baseFolder);
            targetFolder = baseFolder;
          }
        } catch (dirErr) {
          console.log('[FTP Dir Notice]:', dirErr.message);
        }
      }

      // If subDir is specified and allowed
      if (subDir && process.env.FTP_CREATE_SUBDIRS === 'true') {
        await client.ensureDir(subDir);
      }

      const stream = Readable.from(buffer);
      await client.uploadFrom(stream, targetFileName);

      const remoteFullPath = targetFolder ? `${targetFolder}/${targetFileName}` : targetFileName;
      const publicUrl = config.publicUrlBase
        ? `${config.publicUrlBase}/${encodeURIComponent(targetFileName)}`
        : `/api/documents/preview-file/${targetFileName}`;

      console.log(`✅ [FTP Storage] Successfully uploaded to FTP: ${remoteFullPath}`);

      return {
        url: publicUrl,
        filename: targetFileName,
        remotePath: remoteFullPath,
        source: 'ftp'
      };
    } catch (ftpErr) {
      console.warn(`⚠️ [FTP Storage Warning]: FTP upload failed (${ftpErr.message}). Saving to local backup.`);
    } finally {
      if (client) {
        client.close();
      }
    }
  } else if (!isFtpConfigured()) {
    console.log('[FTP Storage] FTP credentials not complete; saving locally.');
  }

  // Graceful Local Fallback
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const localFilePath = path.join(uploadsDir, targetFileName);
    if (!fs.existsSync(localFilePath) && buffer) {
      fs.writeFileSync(localFilePath, buffer);
    }
  } catch (fsErr) {
    console.warn('[Storage Fallback File Warning]:', fsErr.message);
  }

  return {
    url: `/api/documents/preview-file/${targetFileName}`,
    filename: targetFileName,
    remotePath: `uploads/${targetFileName}`,
    source: 'local'
  };
}

/**
 * Upload Application Data JSON snapshot to FTP server
 * Archives applicant form details alongside their documents
 */
export async function uploadApplicationDataToFTP(applicationData) {
  if (!isFtpConfigured()) return null;

  let client;
  try {
    const conn = await getConnectedClient();
    client = conn.client;
    const config = conn.config;

    const targetDir = config.remoteBase ? `${config.remoteBase}/applications` : 'applications';
    await client.ensureDir(targetDir);

    const appId = applicationData.application_number || applicationData.id || Date.now();
    const jsonFileName = `application_${appId}_data.json`;
    const jsonBuffer = Buffer.from(JSON.stringify(applicationData, null, 2), 'utf-8');

    const stream = Readable.from(jsonBuffer);
    await client.uploadFrom(stream, jsonFileName);

    const remoteFullPath = `${targetDir}/${jsonFileName}`;
    console.log(`✅ [FTP Storage] Application metadata archived to FTP: ${remoteFullPath}`);
    return remoteFullPath;
  } catch (err) {
    console.warn('[FTP Storage Warning] Failed to archive application JSON to FTP:', err.message);
    return null;
  } finally {
    if (client) {
      client.close();
    }
  }
}

/**
 * Downloads a file buffer from FTP if available
 */
export async function downloadFromFTP(filename, subDir = 'documents') {
  if (!isFtpConfigured()) return null;

  let client;
  try {
    const conn = await getConnectedClient();
    client = conn.client;
    const config = conn.config;

    const targetDir = config.remoteBase ? `${config.remoteBase}/${subDir}` : subDir;
    await client.cd(`/${targetDir}`);

    const chunks = [];
    const writableStream = new (await import('stream')).Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      }
    });

    await client.downloadTo(writableStream, filename);
    return Buffer.concat(chunks);
  } catch (err) {
    console.warn(`[FTP Download Warning]: Could not download ${filename} from FTP: ${err.message}`);
    return null;
  } finally {
    if (client) {
      client.close();
    }
  }
}

export default {
  getFtpConfig,
  isFtpConfigured,
  testFTPConnection,
  uploadToFTP,
  uploadApplicationDataToFTP,
  downloadFromFTP
};
