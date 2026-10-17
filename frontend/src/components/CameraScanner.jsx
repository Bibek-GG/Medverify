import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, AlertCircle, RefreshCw, Upload, CheckCircle2, ScanLine } from 'lucide-react';

export default function CameraScanner({ onScanSuccess, onError }) {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const scannerRef = useRef(null);
  const readerElementId = 'medverify-reader';

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((cameras) => {
        if (cameras && cameras.length > 0) {
          setAvailableCameras(cameras);
          const backCam = cameras.find(c => c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('environment'));
          setSelectedCameraId(backCam ? backCam.id : cameras[0].id);
        }
      })
      .catch((err) => {
        console.warn('Camera enumeration note:', err);
      });

    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    setCameraError(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(readerElementId);
      }

      const cameraId = selectedCameraId || { facingMode: 'environment' };
      const config = {
        fps: 15,
        qrbox: { width: 260, height: 260 },
        aspectRatio: 1.0,
      };

      await scannerRef.current.start(
        cameraId,
        config,
        (decodedText, decodedResult) => {
          console.log('[Scanner] Decoded code:', decodedText);
          stopScanning();
          if (onScanSuccess) {
            onScanSuccess(decodedText);
          }
        },
        (errorMessage) => {
          // Normal frame parse misses
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error('[Scanner] Failed to start:', err);
      setCameraError(err.message || 'Unable to access camera. Please allow camera permissions or enter the code manually.');
      setIsScanning(false);
      if (onError) onError(err);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.warn('[Scanner] Stop error:', err);
      }
    }
    setIsScanning(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode('temp-file-scanner');
      const decodedText = await html5QrCode.scanFile(file, true);
      html5QrCode.clear();
      if (onScanSuccess) {
        onScanSuccess(decodedText);
      }
    } catch (err) {
      setCameraError('No QR code or barcode detected in the uploaded image. Please ensure code is clear or try manual entry.');
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-soft space-y-5 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="font-extrabold text-navy-950 dark:text-white text-base flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            Live Camera Barcode & 2D DataMatrix Scanner
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Center the camera on the GS1 DataMatrix code on your medicine blister strip or carton.
          </p>
        </div>

        {availableCameras.length > 1 && (
          <select
            value={selectedCameraId}
            onChange={(e) => setSelectedCameraId(e.target.value)}
            disabled={isScanning}
            className="text-xs border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-brand-500"
          >
            {availableCameras.map(cam => (
              <option key={cam.id} value={cam.id}>{cam.label || `Camera ${cam.id}`}</option>
            ))}
          </select>
        )}
      </div>

      {/* Video Container with Futuristic Reticle */}
      <div className="relative bg-slate-950 rounded-2xl overflow-hidden aspect-video max-h-[360px] flex items-center justify-center border border-slate-800 shadow-inner">
        <div id={readerElementId} className="w-full h-full flex items-center justify-center"></div>
        <div id="temp-file-scanner" className="hidden"></div>

        {!isScanning && !cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 shadow-glow-brand animate-float">
              <ScanLine className="w-8 h-8" />
            </div>
            <div className="max-w-xs">
              <p className="text-sm font-bold text-white">Camera is on standby</p>
              <p className="text-xs text-slate-400 mt-1">
                Click below to initialize your device's camera for instant real-time scanning.
              </p>
            </div>
            <button
              type="button"
              onClick={startScanning}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-elevated transition-all active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Activate Camera Scanner</span>
            </button>
          </div>
        )}

        {isScanning && (
          <>
            {/* Live indicator */}
            <div className="absolute top-4 left-4 bg-red-600/90 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span>LIVE RETICLE ACTIVE</span>
            </div>

            {/* Futuristic Corner Targeting Reticles */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 relative border border-cyan-500/30 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                {/* Corner markers */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />
                
                {/* Scanning laser beam */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-laser" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Error message */}
      {cameraError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-xs text-red-700 dark:text-red-400 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">{cameraError}</p>
            <p className="text-slate-600 dark:text-slate-400">
              Tip: Allow camera permissions on this page, or upload an image file of the barcode below.
            </p>
          </div>
        </div>
      )}

      {/* Action controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {isScanning ? (
          <button
            type="button"
            onClick={stopScanning}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <CameraOff className="w-4 h-4" />
            <span>Stop Camera</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={startScanning}
            className="inline-flex items-center gap-2 bg-navy-950 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restart Camera</span>
          </button>
        )}

        {/* Alternative: scan from barcode file */}
        <label className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-colors border border-slate-200 dark:border-slate-700">
          <Upload className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Decode from Image File</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
