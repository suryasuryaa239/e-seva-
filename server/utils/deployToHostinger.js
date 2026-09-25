import 'dotenv/config';
import * as ftp from 'basic-ftp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../../dist');

async function deployWithRetry(maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`\nAttempt ${attempt} of ${maxAttempts}...`);
    const client = new ftp.Client(120000);
    client.ftp.verbose = false;

    try {
      console.log(`Connecting to FTP Server: ${host}:${port} as ${user}...`);
      await client.access({ host, port, user, password, secure });
      const pwd = await client.pwd();
      console.log(`✅ Connected successfully! Remote Directory: ${pwd}`);

      if (!pwd.includes('public_html')) {
        try {
          await client.cd('public_html');
          console.log(`📂 Changed directory to: ${await client.pwd()}`);
        } catch (cdErr) {
          console.warn(`Directory cd notice: ${cdErr.message}`);
        }
      }

      // Clean up any stale temporary files from interrupted uploads
      try {
        const existingFiles = await client.list();
        for (const item of existingFiles) {
          if (!item.isDirectory && item.name.startsWith('.in.')) {
            console.log(`🧹 Removing stale temp file: ${item.name}`);
            await client.remove(item.name).catch(() => {});
          }
        }
      } catch (cleanErr) {
        console.warn(`Temp file cleanup notice: ${cleanErr.message}`);
      }

      console.log(`🚀 Uploading contents of ${distDir} to FTP...`);
      await client.uploadFromDir(distDir);

      console.log('🎉 Deployment Complete!');
      console.log('Remote listing:');
      const remoteList = await client.list();
      remoteList.slice(0, 10).forEach(item => {
        console.log(`  - [${item.isDirectory ? 'DIR' : 'FILE'}] ${item.name} (${item.size} bytes)`);
      });
      client.close();
      return;
    } catch (err) {
      console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}`);
      client.close();
      if (attempt === maxAttempts) {
        throw err;
      }
      console.log('Retrying in 3 seconds...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

async function deploy() {
  console.log('==============================================');
  console.log('  E-Connect Frontend Deployment to FTP');
  console.log('==============================================');

  if (!fs.existsSync(distDir)) {
    console.error('❌ dist folder not found! Please run "npm run build" first.');
    process.exit(1);
  }

  if (!host || !user || !password) {
    console.error('❌ FTP credentials missing in .env (FTP_HOST, FTP_USER, FTP_PASSWORD required)');
    process.exit(1);
  }

  try {
    await deployWithRetry(3);
  } catch (err) {
    console.error('❌ Deployment Failed after retries:', err.message);
    process.exit(1);
  }
}

const host = (process.env.FTP_HOST || '').trim().replace(/^ftps?:\/\//i, '').replace(/\/+$/, '');
const port = parseInt(process.env.FTP_PORT || '21', 10);
const user = (process.env.FTP_USER || '').trim();
const password = (process.env.FTP_PASSWORD || '').trim();
const secure = process.env.FTP_SECURE === 'true';

deploy();
