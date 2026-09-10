import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, RefreshCw, Check, RotateCcw, AlertCircle, Sparkles, SwitchCamera } from 'lucide-react';

export default function CameraCaptureModal({ isOpen, onClose, onCapture, documentName, lang = 'en' }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' or 'environment'
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [loadingCamera, setLoadingCamera] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkMultipleCameras();
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setCapturedBlob(null);
      setCameraError(null);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const checkMultipleCameras = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        setHasMultipleCameras(videoDevices.length > 1);
      }
    } catch (e) {
      console.warn('Could not enumerate devices:', e);
    }
  };

  const startCamera = async () => {
    stopCamera();
    setLoadingCamera(true);
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(lang === 'ta' ? 'உங்கள் உலாவியில் கேமரா அம்சம் ஆதரிக்கப்படவில்லை.' : 'Camera API is not supported in this browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error starting camera:', err);
      let msg = lang === 'ta' 
        ? 'கேமரா அணுகல் மறுக்கப்பட்டது அல்லது கிடைக்கவில்லை. தயவுசெய்து கேமரா அனுமதி வழங்கவும்.' 
        : 'Camera access denied or unavailable. Please check your device camera permissions.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = lang === 'ta'
          ? 'கேமரா அனுமதி மறுக்கப்பட்டது. தயவுசெய்து உலாவி அமைப்புகளில் கேமரா அனுமதியை இயக்கவும்.'
          : 'Camera permission was denied. Please allow camera access in your browser settings.';
      }
      setCameraError(msg);
    } finally {
      setLoadingCamera(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleToggleFacingMode = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // If facing user, flip canvas horizontally so photo matches live mirror view
    if (facingMode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);

    canvas.toBlob((blob) => {
      setCapturedBlob(blob);
    }, 'image/jpeg', 0.92);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCapturedBlob(null);
    startCamera();
  };

  const handleConfirmPhoto = () => {
    if (!capturedImage) return;

    const fileName = `${(documentName || 'photo').toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${Date.now()}.jpg`;
    
    let fileObj;
    if (capturedBlob) {
      fileObj = new File([capturedBlob], fileName, { type: 'image/jpeg' });
    } else {
      // Fallback base64 to File conversion
      const arr = capturedImage.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      fileObj = new File([u8arr], fileName, { type: mime });
    }

    onCapture(fileObj);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                {lang === 'ta' ? 'நேரலை கேமரா புகைப்படம் எடுக்க' : 'Capture Live Photo'}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {documentName ? `${documentName}` : (lang === 'ta' ? 'ஆவணத்திற்கான புகைப்படம்' : 'Photo Document')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* CAMERA VIEW / PREVIEW BODY */}
        <div className="relative flex-1 bg-black min-h-[320px] flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center space-y-4 max-w-xs">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-rose-200 font-medium leading-relaxed">{cameraError}</p>
              <button
                type="button"
                onClick={startCamera}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all border border-slate-700 flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{lang === 'ta' ? 'மீண்டும் முயற்சிக்கவும்' : 'Retry Camera'}</span>
              </button>
            </div>
          ) : capturedImage ? (
            /* PHOTO PREVIEW SCREEN */
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={capturedImage}
                alt="Captured"
                className="max-h-[380px] w-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-emerald-500/90 text-white px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 shadow-md backdrop-blur-xs">
                <Check className="w-3 h-3" />
                <span>{lang === 'ta' ? 'புகைப்படம் எடுக்கப்பட்டது' : 'Photo Captured'}</span>
              </div>
            </div>
          ) : (
            /* LIVE CAMERA STREAM SCREEN */
            <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`max-h-[380px] w-full object-contain ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {loadingCamera && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center space-y-2 text-white">
                  <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold">{lang === 'ta' ? 'கேமரா திறக்கப்படுகிறது...' : 'Starting camera...'}</span>
                </div>
              )}

              {/* OVERLAY FOCUS FRAME */}
              {!loadingCamera && (
                <div className="absolute inset-4 sm:inset-8 border-2 border-dashed border-white/40 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                  <div className="flex justify-between text-[10px] font-mono text-white/60">
                    <span>LIVE FEED</span>
                    <span className="uppercase">{facingMode} CAMERA</span>
                  </div>
                  <div className="text-center text-[10px] font-bold text-white/80 bg-black/40 py-1 px-3 rounded-full backdrop-blur-xs self-center">
                    {lang === 'ta' ? 'ஆவணத்தை/முகத்தை சட்டகத்தினுள் வைக்கவும்' : 'Align photo/document within frame'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HIDDEN CANVAS FOR SNAPSHOT */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors border border-slate-700"
              >
                <RotateCcw className="w-4 h-4 text-orange-400" />
                <span>{lang === 'ta' ? 'மீண்டும் எடுக்க' : 'Retake Photo'}</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
              >
                <Check className="w-4.5 h-4.5" />
                <span>{lang === 'ta' ? 'இந்த புகைப்படத்தைப் பயன்படுத்து' : 'Use This Photo'}</span>
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                {hasMultipleCameras && (
                  <button
                    type="button"
                    onClick={handleToggleFacingMode}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
                    title={lang === 'ta' ? 'கேமராவை மாற்றுக' : 'Switch Camera'}
                  >
                    <SwitchCamera className="w-4 h-4 text-orange-400" />
                    <span className="hidden sm:inline">{facingMode === 'user' ? (lang === 'ta' ? 'பின் கேமரா' : 'Back Cam') : (lang === 'ta' ? 'முன் கேமரா' : 'Front Cam')}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-3 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700"
                >
                  {lang === 'ta' ? 'ரத்து செய்ய' : 'Cancel'}
                </button>

                <button
                  type="button"
                  onClick={handleTakeSnapshot}
                  disabled={loadingCamera || !!cameraError}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-orange-500/20"
                >
                  <Camera className="w-4.5 h-4.5" />
                  <span>{lang === 'ta' ? 'புகைப்படம் எடு (Capture)' : 'Take Photo'}</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
