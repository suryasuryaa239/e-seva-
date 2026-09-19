import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Check, RotateCcw, AlertCircle, RefreshCw, Upload } from 'lucide-react';

export default function CameraCaptureModal({ isOpen, onClose, onCapture, documentName, lang = 'en' }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileFallbackRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // Default to rear camera for documents
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // Check for available video inputs to enable camera flipping
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const videoInputs = devices.filter(d => d.kind === 'videoinput');
          setHasMultipleCameras(videoInputs.length > 1);
        })
        .catch(() => {});
    }
  }, []);

  // Initialize camera stream when modal opens or when facingMode changes
  useEffect(() => {
    let currentStream = null;

    if (isOpen) {
      setCapturedImage(null);
      setCapturedBlob(null);
      setCameraError(null);
      setLoading(true);

      const initCamera = async () => {
        try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error(
              lang === 'ta'
                ? 'உங்கள் உலாவியில் நேரலை கேமரா வசதி ஆதரிக்கப்படவில்லை அல்லது பாதுகாப்பற்ற இணைப்பில் உள்ளது. நேரடியாக கோப்பை பதிவேற்றவும்.'
                : 'Live camera is not supported or blocked by browser security. Please upload a photo directly.'
            );
          }

          // Stop existing stream before starting a new one
          if (stream) {
            stream.getTracks().forEach(t => t.stop());
          }

          let mediaStream;
          try {
            // First attempt with desired facingMode
            mediaStream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: { ideal: facingMode },
                width: { ideal: 1920 },
                height: { ideal: 1080 }
              },
              audio: false
            });
          } catch (e) {
            // Fallback attempt with basic video constraints
            mediaStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false
            });
          }

          currentStream = mediaStream;
          setStream(mediaStream);

          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            await videoRef.current.play().catch(() => {});
          }
        } catch (err) {
          console.error('Camera Init Error:', err);
          setCameraError(
            lang === 'ta'
              ? 'கேமராவைத் திறக்க முடியவில்லை. கேமரா அனுமதியைச் சரிபார்க்கவும் அல்லது கீழே உள்ள பொத்தானைப் பயன்படுத்தி கோப்பைப் பதிவேற்றவும்.'
              : 'Could not access camera. Please check camera permissions or use the button below to upload directly.'
          );
        } finally {
          setLoading(false);
        }
      };

      initCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  // Ensure video element stays bound to current stream
  useEffect(() => {
    if (isOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [isOpen, stream]);

  // Flip camera between front and back
  const handleToggleFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Snapshot capture from video element to canvas
  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');

    // Only mirror horizontally if user is using the front selfie camera
    if (facingMode === 'user') {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, w, h);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
    setCapturedImage(dataUrl);

    canvas.toBlob((blob) => {
      setCapturedBlob(blob);
    }, 'image/jpeg', 0.90);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCapturedBlob(null);
  };

  const handleConfirm = () => {
    if (!capturedImage) return;

    const cleanName = (documentName || 'photo').toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const fileName = `${cleanName}_${Date.now()}.jpg`;

    let fileObj;
    if (capturedBlob) {
      try {
        fileObj = new File([capturedBlob], fileName, { type: 'image/jpeg' });
      } catch (e) {
        capturedBlob.name = fileName;
        capturedBlob.lastModified = Date.now();
        fileObj = capturedBlob;
      }
    } else {
      // Fallback base64 conversion
      try {
        const arr = capturedImage.split(',');
        const mime = arr[0].match(/:(.*?);/)[1] || 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        try {
          fileObj = new File([u8arr], fileName, { type: mime });
        } catch (e) {
          const b = new Blob([u8arr], { type: mime });
          b.name = fileName;
          fileObj = b;
        }
      } catch (err) {
        console.error('Base64 conversion error:', err);
        return;
      }
    }

    onCapture(fileObj);
    onClose();
  };

  // Fallback direct file selection if camera is unavailable
  const handleFallbackFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      onCapture(e.target.files[0]);
      onClose();
    }
  };

  if (!isOpen) return null;

  const isMirror = facingMode === 'user';

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
        
        {/* HEADER */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                {lang === 'ta' ? 'கேமரா புகைப்படம் எடுக்க' : 'Take Document Photo'}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {documentName || (lang === 'ta' ? 'சான்று ஆவணம்' : 'Proof Document')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Flip camera toggle button */}
            {!capturedImage && !cameraError && (
              <button
                type="button"
                onClick={handleToggleFacingMode}
                title={facingMode === 'environment' ? 'Switch to Selfie Camera' : 'Switch to Back Camera'}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-[11px] font-bold flex items-center gap-1 border border-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{facingMode === 'environment' ? (lang === 'ta' ? 'பின் கேமரா' : 'Rear') : (lang === 'ta' ? 'முன் கேமரா' : 'Front')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="relative bg-black min-h-[300px] flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center space-y-4 max-w-sm">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
              <p className="text-xs text-rose-200 font-medium leading-relaxed">{cameraError}</p>
              
              <div className="pt-2 flex flex-col gap-2">
                <input
                  type="file"
                  ref={fileFallbackRef}
                  accept="image/*,application/pdf"
                  onChange={handleFallbackFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileFallbackRef.current && fileFallbackRef.current.click()}
                  className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>{lang === 'ta' ? 'கோப்பிலிருந்து தேர்ந்தெடுக்கவும்' : 'Upload from Device Instead'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700"
                >
                  {lang === 'ta' ? 'மூடுக' : 'Close'}
                </button>
              </div>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured preview" className="max-h-[340px] w-full object-contain" />
          ) : (
            <div className="relative w-full h-full min-h-[300px] flex items-center justify-center bg-slate-950">
              <video
                ref={(el) => {
                  videoRef.current = el;
                  if (el && stream && el.srcObject !== stream) {
                    el.srcObject = stream;
                    el.play().catch(() => {});
                  }
                }}
                autoPlay
                playsInline
                muted
                className={`max-h-[340px] w-full object-contain ${isMirror ? 'scale-x-[-1]' : ''}`}
              />

              {loading && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center space-y-2 text-white">
                  <div className="w-7 h-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold">{lang === 'ta' ? 'கேமரா திறக்கப்படுகிறது...' : 'Opening camera...'}</span>
                </div>
              )}
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ta' ? 'மீண்டும் எடுக்க' : 'Retake'}</span>
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>{lang === 'ta' ? 'பயன்படுத்து' : 'Use Photo'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
              >
                {lang === 'ta' ? 'ரத்து' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleTakeSnapshot}
                disabled={loading || !!cameraError}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>{lang === 'ta' ? 'புகைப்படம் எடு' : 'Capture Photo'}</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
