import React, { useState } from 'react';
import { 
  Scan, 
  Upload, 
  FileText, 
  Sparkles, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight,
  ShieldAlert,
  Edit3,
  Layers,
  Image as ImageIcon,
  X,
  FileSearch,
  Check
} from 'lucide-react';
import CameraScanner from '../components/CameraScanner';
import DemoPresetSelector, { DEMO_PRESETS } from '../components/DemoPresetSelector';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { verifyMedicine, verifyImage } from '../services/api';

export default function VerifyPage({ onVerificationComplete, initialPrefill = null }) {
  const [activeMethod, setActiveMethod] = useState('qr'); // 'qr' | 'photo' | 'manual'
  const [selectedPresetId, setSelectedPresetId] = useState(null);

  // Verification form state
  const [formData, setFormData] = useState({
    product_identifier: initialPrefill?.product_identifier || '',
    name: initialPrefill?.name || '',
    manufacturer: initialPrefill?.manufacturer || '',
    batch_number: initialPrefill?.batch_number || '',
    manufacturing_date: initialPrefill?.manufacturing_date || '',
    expiry_date: initialPrefill?.expiry_date || '',
    mfg_license_no: initialPrefill?.mfg_license_no || '',
    verification_method: initialPrefill?.verification_method || 'MANUAL_ENTRY'
  });

  // Photo upload & OCR state
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [ocrNotes, setOcrNotes] = useState([]);
  const [ocrConfidence, setOcrConfidence] = useState(null);

  // Submission state
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handlePresetSelect = (preset) => {
    setSelectedPresetId(preset.id);
    setFormData({
      ...formData,
      product_identifier: preset.data.product_identifier || '',
      name: preset.data.name || '',
      manufacturer: preset.data.manufacturer || '',
      batch_number: preset.data.batch_number || '',
      expiry_date: preset.data.expiry_date || '',
      verification_method: preset.data.verification_method || 'MANUAL_ENTRY'
    });
    setErrorMessage(null);
  };

  const handleScanSuccess = (decodedText) => {
    console.log('[Verify] Scanned raw text:', decodedText);
    
    let productId = decodedText.trim();
    const matchedPreset = DEMO_PRESETS.find(p => p.data.product_identifier === productId);
    if (matchedPreset) {
      handlePresetSelect(matchedPreset);
      return;
    }

    setFormData(prev => ({
      ...prev,
      product_identifier: productId,
      verification_method: 'QR_BARCODE'
    }));

    setActiveMethod('manual');
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files ? e.target.files[0] : e;
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit. Please upload a smaller image.');
      return;
    }

    setErrorMessage(null);
    setSelectedImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setIsProcessingImage(true);

    try {
      const ocrResult = await verifyImage(file);
      console.log('[OCR Result]:', ocrResult);
      
      setOcrConfidence(ocrResult.confidence_score);
      setOcrNotes(ocrResult.preprocessing_notes || []);

      const detected = ocrResult.detected_fields || {};
      setFormData(prev => ({
        ...prev,
        product_identifier: detected.product_identifier || prev.product_identifier,
        name: detected.name || prev.name,
        manufacturer: detected.manufacturer || prev.manufacturer,
        batch_number: detected.batch_number || prev.batch_number,
        manufacturing_date: detected.manufacturing_date || prev.manufacturing_date,
        expiry_date: detected.expiry_date || prev.expiry_date,
        mfg_license_no: detected.mfg_license_no || prev.mfg_license_no,
        verification_method: 'IMAGE_OCR'
      }));
    } catch (err) {
      console.error('[OCR Error]:', err);
      setErrorMessage(err.response?.data?.detail || 'Failed to process packaging photo. You can still adjust details manually.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleLoadSampleInspectionImage = async () => {
    try {
      setIsProcessingImage(true);
      const response = await fetch('/images/packaging-inspection.jpg');
      const blob = await response.blob();
      const file = new File([blob], 'telma40_inspection_sample.jpg', { type: 'image/jpeg' });
      await handleImageFileChange(file);
    } catch (err) {
      console.error('Failed to load sample image:', err);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setOcrNotes([]);
    setOcrConfidence(null);
  };

  const handleSubmitVerification = async (e) => {
    if (e) e.preventDefault();
    if (!formData.product_identifier && !formData.name) {
      setErrorMessage('Please provide either a product barcode identifier or a medicine brand name.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const response = await verifyMedicine(formData);
      if (onVerificationComplete) {
        onVerificationComplete(response);
      }
    } catch (err) {
      console.error('[Verification API Error]:', err);
      setErrorMessage(err.response?.data?.detail || 'Unable to connect to verification engine. Please ensure backend is running.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-bold px-3 py-1 rounded-full border border-brand-500/20 dark:border-brand-500/30 uppercase tracking-wider">
          <Scan className="w-3.5 h-3.5" />
          <span>Multimodal Verification Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-navy-950 dark:text-white tracking-tight font-display">
          Verify Medicine Packaging
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Scan the mandatory GS1 2D DataMatrix barcode, upload packaging photos for AI OCR, or verify batch parameters directly.
        </p>
      </div>

      {/* Evaluator Quick Presets */}
      <DemoPresetSelector 
        onSelectPreset={handlePresetSelect} 
        selectedPresetId={selectedPresetId} 
      />

      {/* Verification Tabs & Container */}
      <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-soft overflow-hidden backdrop-blur-xl">
        <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-2 gap-2">
          
          <button
            type="button"
            onClick={() => setActiveMethod('qr')}
            className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeMethod === 'qr'
                ? 'bg-white dark:bg-slate-800 text-navy-950 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Camera className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Scan QR / Barcode</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMethod('photo')}
            className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeMethod === 'photo'
                ? 'bg-white dark:bg-slate-800 text-navy-950 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Upload className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Packaging Photo (OCR)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMethod('manual')}
            className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeMethod === 'manual'
                ? 'bg-white dark:bg-slate-800 text-navy-950 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Direct Parameter Entry</span>
          </button>

        </div>

        <div className="p-6 sm:p-8 space-y-6">

          {/* METHOD A: Camera Barcode / QR Scanner */}
          {activeMethod === 'qr' && (
            <div className="space-y-6">
              <CameraScanner onScanSuccess={handleScanSuccess} />
              
              <div className="p-4 bg-brand-500/10 dark:bg-brand-500/15 rounded-2xl border border-brand-500/20 text-xs text-brand-900 dark:text-brand-200 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Indian GS1 DataMatrix QR Mandate (CDSCO Rule 96-5B)</p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    Top 300 Indian pharmaceutical brands feature mandatory 2D DataMatrix barcodes encoding GTIN-14, batch lot, manufacturing date, and expiry.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* METHOD B: Upload Medicine Photograph */}
          {activeMethod === 'photo' && (
            <div className="space-y-6">
              {!imagePreviewUrl ? (
                <div className="space-y-4">
                  <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-400 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/50 dark:bg-slate-950/40 hover:bg-brand-50/20 dark:hover:bg-slate-800/40 transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 group-hover:scale-110 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3 transition-transform shadow-xs">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <h4 className="font-extrabold text-navy-950 dark:text-white text-base">
                      Drag & Drop Packaging Photograph Here
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
                      Upload photo of medicine blister pack, foil strip, or outer carton to automatically extract batch number, expiry date, and manufacturer.
                    </p>
                    <span className="inline-block mt-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs group-hover:bg-brand-600 group-hover:text-white group-hover:border-transparent transition-colors">
                      Browse File (JPG, PNG, WebP)
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>

                  {/* One-Click Sample Image Test Button */}
                  <div className="flex items-center justify-center gap-3 p-3 bg-teal-500/10 dark:bg-teal-500/15 rounded-2xl border border-teal-500/20 text-xs">
                    <FileSearch className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">Don't have a medicine photo handy?</span>
                    <button
                      type="button"
                      onClick={handleLoadSampleInspectionImage}
                      className="font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <span>Load Sample Packaging Photo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-950 max-h-[300px] flex items-center justify-center">
                    <img 
                      src={imagePreviewUrl} 
                      alt="Uploaded Medicine Packaging" 
                      className="max-h-[300px] w-auto object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {isProcessingImage && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-3">
                        <RefreshCw className="w-8 h-8 animate-spin text-teal-400" />
                        <p className="text-sm font-bold">Running OpenCV Contrast Preprocessing & OCR Extraction...</p>
                      </div>
                    )}
                  </div>

                  {ocrConfidence && (
                    <div className="p-4 bg-emerald-500/10 dark:bg-emerald-950/40 rounded-2xl border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold">OCR Text Extraction Complete (Confidence: {(ocrConfidence * 100).toFixed(0)}%)</span>
                      </div>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Verify extracted fields below</span>
                    </div>
                  )}

                  {ocrNotes.length > 0 && (
                    <details className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <summary className="font-bold cursor-pointer text-slate-700 dark:text-slate-200">View Computer Vision Preprocessing Steps</summary>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-slate-500 dark:text-slate-400 text-[11px]">
                        {ocrNotes.map((n, i) => <li key={i}>{n}</li>)}
                      </ul>
                    </details>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Form Fields: Editable Confirmation for Verification */}
          <form onSubmit={handleSubmitVerification} className="space-y-5 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-xs font-black text-navy-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Parameters for Catalog Cross-Check
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Review or adjust extracted values</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Product Identifier */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Product Identifier (GTIN-14 / Barcode)</span>
                  <span className="text-[11px] text-brand-600 dark:text-brand-400 font-mono font-medium">e.g., 8901234567890</span>
                </label>
                <input
                  type="text"
                  value={formData.product_identifier}
                  onChange={(e) => setFormData({ ...formData, product_identifier: e.target.value })}
                  placeholder="Scan or enter 13-digit barcode / GTIN"
                  className="w-full text-sm font-mono px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              {/* Medicine Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Medicine Brand Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Dolo-650, Asthalin Inhaler"
                  className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              {/* Manufacturer */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Manufacturer Name</label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="e.g., Micro Labs Ltd, Cipla Ltd"
                  className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              {/* Batch Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Batch / Lot Number</label>
                <input
                  type="text"
                  value={formData.batch_number}
                  onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                  placeholder="e.g., DL24098, AS9912"
                  className="w-full text-sm font-mono uppercase px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              {/* Expiry Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Expiry Date (MM/YYYY)</label>
                <input
                  type="text"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  placeholder="e.g., 02/2027"
                  className="w-full text-sm font-mono px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-700 dark:text-red-400 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Data is validated against configured Indian catalog records.
              </span>
              <button
                type="submit"
                disabled={isVerifying || isProcessingImage}
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-brand-600 via-teal-600 to-brand-600 hover:from-brand-500 hover:to-teal-500 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-elevated hover:shadow-glow-brand transition-all active:scale-95 disabled:opacity-60"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Cross-Checking Registry Records...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Run Verification Query</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Safety Notice */}
      <DisclaimerBanner />

    </div>
  );
}
