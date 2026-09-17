import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

// Cached authorization token and endpoints for Backblaze B2 Native API
let b2Cache = {
  apiUrl: null,
  authorizationToken: null,
  downloadUrl: null,
  bucketId: null,
  bucketName: null,
  expiresAt: 0
};

/**
 * Authorize Backblaze B2 account and cache tokens
 */
async function authorizeB2(keyId, applicationKey, bucketNameFromEnv) {
  const now = Date.now();
  if (b2Cache.authorizationToken && b2Cache.expiresAt > now + 300000) {
    return b2Cache;
  }

  const credentials = Buffer.from(`${keyId}:${applicationKey}`).toString('base64');
  const res = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
    method: 'GET',
    headers: {
      Authorization: `Basic ${credentials}`
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Backblaze authorize failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  let bucketId = process.env.B2_BUCKET_ID || (data.allowed && data.allowed.bucketId) || null;
  let bucketName = bucketNameFromEnv || (data.allowed && data.allowed.bucketName) || null;

  // If bucketId is not known yet, list buckets to locate bucketId
  if (!bucketId && bucketName) {
    try {
      const listRes = await fetch(`${data.apiUrl}/b2api/v2/b2_list_buckets`, {
        method: 'POST',
        headers: {
          Authorization: data.authorizationToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accountId: data.accountId })
      });
      if (listRes.ok) {
        const listData = await listRes.json();
        const found = (listData.buckets || []).find(b => b.bucketName === bucketName);
        if (found) {
          bucketId = found.bucketId;
        }
      }
    } catch (e) {
      console.warn('[B2 LIST BUCKETS ERROR]', e.message);
    }
  }

  b2Cache = {
    apiUrl: data.apiUrl,
    authorizationToken: data.authorizationToken,
    downloadUrl: data.downloadUrl,
    bucketId: bucketId,
    bucketName: bucketName || (data.allowed && data.allowed.bucketName),
    // Token valid for 24 hours; refresh after 20 hours
    expiresAt: now + (20 * 60 * 60 * 1000)
  };

  return b2Cache;
}

/**
 * Upload buffer to Backblaze B2
 * @param {Object} params - { buffer, originalname, mimetype, filename }
 * @returns {Promise<{ url: string, filename: string, source: string }>}
 */
export async function uploadToBackblaze({ buffer, originalname, mimetype, filename }) {
  const keyId = process.env.B2_KEY_ID || process.env.B2_APPLICATION_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const appKey = process.env.B2_APPLICATION_KEY || process.env.B2_APP_KEY || process.env.AWS_SECRET_ACCESS_KEY;
  const bucketName = process.env.B2_BUCKET_NAME || process.env.AWS_BUCKET_NAME;
  const s3Endpoint = process.env.B2_ENDPOINT || 's3.us-east-005.backblazeb2.com';

  const cleanExt = path.extname(originalname || filename || '').toLowerCase() || '.jpg';
  const safeBase = (originalname || 'document').replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniqueName = filename || `${Date.now()}_${Math.round(Math.random() * 1e9)}_${safeBase}`;
  const targetFileName = uniqueName.endsWith(cleanExt) ? uniqueName : `${uniqueName}${cleanExt}`;

  // If Backblaze B2 credentials are fully configured, upload directly to B2 Cloud
  if (keyId && appKey && bucketName) {
    try {
      const auth = await authorizeB2(keyId, appKey, bucketName);
      if (!auth.bucketId) {
        throw new Error(`Bucket ID for bucket "${bucketName}" could not be resolved. Provide B2_BUCKET_ID in .env`);
      }

      // Step 2: Get Upload URL
      const getUploadUrlRes = await fetch(`${auth.apiUrl}/b2api/v2/b2_get_upload_url`, {
        method: 'POST',
        headers: {
          Authorization: auth.authorizationToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bucketId: auth.bucketId })
      });

      if (!getUploadUrlRes.ok) {
        const errText = await getUploadUrlRes.text();
        throw new Error(`Failed to get B2 upload URL: ${errText}`);
      }

      const { uploadUrl, authorizationToken: uploadAuthToken } = await getUploadUrlRes.json();

      // Step 3: Compute SHA1 and Upload File
      const sha1 = crypto.createHash('sha1').update(buffer).digest('hex');
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: uploadAuthToken,
          'X-Bz-File-Name': encodeURIComponent(targetFileName),
          'Content-Type': mimetype || 'application/octet-stream',
          'Content-Length': String(buffer.length),
          'X-Bz-Content-Sha1': sha1
        },
        body: buffer
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        throw new Error(`B2 File upload failed (${uploadRes.status}): ${errText}`);
      }

      const uploadedData = await uploadRes.json();

      // Determine public download URL
      // Format 1: https://<downloadUrl>/file/<bucketName>/<fileName>
      // Format 2: https://<bucketName>.<s3Endpoint>/<fileName>
      const publicUrl = `${auth.downloadUrl}/file/${bucketName}/${encodeURIComponent(targetFileName)}`;
      console.log(`✅ [Backblaze B2] File successfully uploaded to cloud: ${publicUrl}`);

      return {
        url: publicUrl,
        filename: targetFileName,
        fileId: uploadedData.fileId,
        source: 'backblaze_b2'
      };
    } catch (b2Err) {
      console.error('❌ [Backblaze B2 Upload Error]:', b2Err.message);
      console.warn('⚠️ Falling back to local / data URI fallback storage.');
    }
  } else {
    console.log('ℹ️ [Backblaze B2] B2_KEY_ID, B2_APPLICATION_KEY, or B2_BUCKET_NAME not set in .env. Using resilient fallback.');
  }

  // Graceful Fallback:
  // If running locally, write to uploads folder; if image is < 4MB, also provide data URI so it works seamlessly on Vercel
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const localFilePath = path.join(uploadsDir, targetFileName);
    fs.writeFileSync(localFilePath, buffer);
  } catch (fsErr) {
    console.warn('[Storage Fallback File System Warning]:', fsErr.message);
  }

  // If running in serverless environment (Vercel) without B2, use Data URL so image is 100% visible
  if (process.env.VERCEL && buffer.length < 5 * 1024 * 1024 && (mimetype?.startsWith('image/') || cleanExt !== '.pdf')) {
    const base64 = buffer.toString('base64');
    const dataUri = `data:${mimetype || 'image/jpeg'};base64,${base64}`;
    return {
      url: dataUri,
      filename: targetFileName,
      source: 'data_uri'
    };
  }

  return {
    url: `/api/documents/preview-file/${targetFileName}`,
    filename: targetFileName,
    source: 'local'
  };
}

export default {
  uploadToBackblaze
};
