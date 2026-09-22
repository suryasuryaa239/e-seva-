import dotenv from 'dotenv';
dotenv.config();

import { testFTPConnection, isFtpConfigured, getFtpConfig } from '../utils/ftpStorage.js';

async function runTest() {
  console.log('--- E-Connect FTP Connection Diagnostic ---');
  const config = getFtpConfig();
  console.log('Host:       ', config.host || '(not set)');
  console.log('Port:       ', config.port);
  console.log('User:       ', config.user || '(not set)');
  console.log('Password:   ', config.password ? '****** (configured)' : '(NOT SET)');
  console.log('Folder Base:', config.remoteBase);
  console.log('-------------------------------------------');

  if (!isFtpConfigured()) {
    console.log('⚠️ FTP_PASSWORD is missing in .env! Please add FTP_PASSWORD to .env before testing.');
    process.exit(1);
  }

  console.log('Connecting to FTP server...');
  try {
    const result = await testFTPConnection();
    console.log('🎉 FTP Connection Successful!');
    console.log('Server Directory:', result.currentDir);
    console.log('Files Found:', result.filesCount);
    if (result.files && result.files.length > 0) {
      console.log('Sample Entries:');
      result.files.forEach(f => console.log(`  - [${f.isDirectory ? 'DIR' : 'FILE'}] ${f.name}`));
    }
  } catch (err) {
    console.error('❌ FTP Connection Failed:', err.message);
    process.exit(1);
  }
}

runTest();
