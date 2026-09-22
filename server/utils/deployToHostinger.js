import 'dotenv/config';
import * as ftp from 'basic-ftp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../../dist');

async function deploy() {
  console.log('==============================================');
  console.log('  E-Connect Frontend Deployment to FTP');
  console.log('==============================================');

  if (!fs.existsSync(distDir)) {
    console.error('❌ dist folder not found! Please run "npm run build" first.');
    process.exit(1);
  }

  const host = (process.env.FTP_HOST || '').trim().replace(/^ftps?:\/\//i, '').replace(/\/+$/, '');
  const port = parseInt(process.env.FTP_PORT || '21', 10);
  const user = (process.env.FTP_USER || '').trim();
  const password = (process.env.FTP_PASSWORD || '').trim();
  const secure = process.env.FTP_SECURE === 'true';

  if (!host || !user || !password) {
    console.error('❌ FTP credentials missing in .env (FTP_HOST, FTP_USER, FTP_PASSWORD required)');
    process.exit(1);
  }

  console.log(`Connecting to FTP Server: ${host}:${port} as ${user}...`);
  const client = new ftp.Client(30000); // 30s timeout
  client.ftp.verbose = false;

  client.trackProgress(info => {
    console.log(`  -> Uploading: ${info.name} (${info.bytesOverall} bytes transferred)`);
  });

  try {
    await client.access({ host, port, user, password, secure });
    const pwd = await client.pwd();
    console.log(`✅ Connected successfully! Remote Directory: ${pwd}`);

    // Ensure we are in public_html
    if (!pwd.includes('public_html')) {
      try {
        await client.cd('public_html');
        console.log(`📂 Changed directory to: ${await client.pwd()}`);
      } catch (cdErr) {
        console.warn(`Directory cd notice: ${cdErr.message}`);
      }
    }

    console.log(`🚀 Uploading contents of ${distDir} to FTP...`);
    await client.uploadFromDir(distDir);

    console.log('🎉 Deployment Complete!');
    console.log('Remote listing:');
    const remoteList = await client.list();
    remoteList.forEach(item => {
      console.log(`  - [${item.isDirectory ? 'DIR' : 'FILE'}] ${item.name} (${item.size} bytes)`);
    });

  } catch (err) {
    console.error('❌ Deployment Failed:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
