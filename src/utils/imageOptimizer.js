/**
 * Client-Side Image & Document Optimization Utility for E-Seva
 * Automatically compresses large smartphone camera photos (> 5MB up to 25MB)
 * down to crisp, web-optimized ~300KB-800KB standard JPEG images.
 * Also handles modern formats (.webp, .jfif, .png, .jpg) and PDFs seamlessly.
 */

export const SUPPORTED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.webp', '.jfif', '.bmp', '.heic', '.heif', '.pdf'
];

export const ACCEPTED_INPUT_TYPES = "image/*,application/pdf,.pdf,.jpg,.jpeg,.png,.webp,.jfif,.heic,.heif";

/**
 * Optimizes an uploaded image using HTML5 Canvas or validates a PDF file.
 * 
 * @param {File} file The original file selected by user
 * @param {Object} options Configuration options
 * @param {string} options.lang Language code ('ta' or 'en')
 * @param {number} options.maxDimension Max width or height in pixels (default: 1920)
 * @param {number} options.quality JPEG compression quality 0.0 - 1.0 (default: 0.85)
 * @param {number} options.pdfMaxMB Max size limit in MB for PDF files (default: 20)
 * @returns {Promise<{success: boolean, file?: File, previewUrl?: string, isCompressed?: boolean, error?: string}>}
 */
export async function optimizeAndValidateDocument(file, options = {}) {
  const {
    lang = 'en',
    maxDimension = 1920,
    quality = 0.85,
    pdfMaxMB = 20
  } = options;

  if (!file) {
    return {
      success: false,
      error: lang === 'ta' ? 'கோப்பு தேர்ந்தெடுக்கப்படவில்லை.' : 'No file selected.'
    };
  }

  const fileName = file.name || 'document';
  const fileExt = '.' + (fileName.split('.').pop() || '').toLowerCase();
  const mimeType = (file.type || '').toLowerCase();

  const isPdf = mimeType === 'application/pdf' || mimeType.includes('pdf') || fileExt === '.pdf';
  const isImage = mimeType.startsWith('image/') || 
    ['.jpg', '.jpeg', '.png', '.webp', '.jfif', '.bmp', '.heic', '.heif'].includes(fileExt);

  if (!isPdf && !isImage) {
    return {
      success: false,
      error: lang === 'ta'
        ? 'கோப்பு வகை ஆதரிக்கப்படவில்லை. PDF, JPG, PNG, அல்லது WEBP ஆவணங்களை பதிவேற்றவும்.'
        : 'File type not supported. Please upload a PDF, JPG, PNG, or WEBP document.'
    };
  }

  // Handle PDF documents
  if (isPdf) {
    const maxBytes = pdfMaxMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return {
        success: false,
        error: lang === 'ta'
          ? `PDF கோப்பின் அளவு ${pdfMaxMB}MB வரம்பிற்குள் இருக்க வேண்டும்.`
          : `PDF file size must be within ${pdfMaxMB}MB.`
      };
    }
    return {
      success: true,
      file,
      previewUrl: null,
      isCompressed: false,
      isPdf: true
    };
  }

  // Handle Image files - Optimize with Canvas
  try {
    const compressed = await compressImageFile(file, { maxDimension, quality });
    return {
      success: true,
      file: compressed.file,
      previewUrl: compressed.previewUrl,
      isCompressed: compressed.isCompressed,
      isPdf: false
    };
  } catch (err) {
    console.warn('Canvas image compression failed, falling back to original file:', err);

    // Fallback: If canvas fails (e.g. very rare unsupported browser feature or HEIC without worker),
    // allow original if within 25MB
    if (file.size <= 25 * 1024 * 1024) {
      let previewUrl = null;
      try {
        previewUrl = URL.createObjectURL(file);
      } catch (e) {}

      return {
        success: true,
        file,
        previewUrl,
        isCompressed: false,
        isPdf: false
      };
    }

    return {
      success: false,
      error: lang === 'ta'
        ? 'படத்தை செயலாக்குவதில் பிழை ஏற்பட்டது. தயவுசெய்து வேறு படத்தை பதிவேற்றவும்.'
        : 'Failed to process image. Please try another image file.'
    };
  }
}

/**
 * Internal helper to compress image using an off-screen HTML5 Canvas
 */
function compressImageFile(file, { maxDimension = 1920, quality = 0.85 }) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate proportional dimensions
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          return reject(new Error('Canvas 2D context unavailable'));
        }

        // Fill white background for transparent PNG/WEBP conversion to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);

            if (!blob) {
              return reject(new Error('Canvas toBlob conversion failed'));
            }

            // Create normalized filename with .jpg extension
            const originalBase = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const cleanBase = originalBase.replace(/[^a-zA-Z0-9_-]/g, '_');
            const newFileName = `${cleanBase}_optimized.jpg`;

            let optimizedFile;
            try {
              optimizedFile = new File([blob], newFileName, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
            } catch (e) {
              blob.name = newFileName;
              blob.lastModified = Date.now();
              optimizedFile = blob;
            }

            const previewUrl = URL.createObjectURL(blob);

            resolve({
              file: optimizedFile,
              previewUrl,
              isCompressed: optimizedFile.size < file.size
            });
          },
          'image/jpeg',
          quality
        );
      } catch (e) {
        URL.revokeObjectURL(objectUrl);
        reject(e);
      }
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}
