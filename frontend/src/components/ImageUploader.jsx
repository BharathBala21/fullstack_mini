import React, { useState, useRef, useEffect } from 'react';
import { Upload, Link as LinkIcon, X, AlertCircle } from 'lucide-react';
import { MAX_UPLOAD_SIZE_MB, MAX_UPLOAD_SIZE_BYTES } from '../config/constants';

const ImageUploader = ({
  imageUrl,
  setImageUrl,
  imageFile,
  setImageFile,
  previewUrl,
  setPreviewUrl,
}) => {
  const [mode, setMode] = useState(() => {
    if (imageFile) return 'file';
    if (imageUrl && !imageUrl.startsWith('blob:') && !imageUrl.startsWith('/uploads/')) {
      return 'url';
    }
    return 'file';
  });

  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (PNG, JPG, WebP, GIF).');
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setFileError(`File is too large. Max size is ${MAX_UPLOAD_SIZE_MB}MB.`);
      return;
    }

    setFileError('');
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl('');
    setImageUrl('');
    setFileError('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-stone-700">
          Recipe Cover Image
        </label>
        <div className="flex items-center bg-stone-100 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setMode('file')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
              mode === 'file'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Upload image
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
              mode === 'url'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {fileError && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      {mode === 'file' ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {imageFile ? (
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded border border-stone-200"
                  />
                )}
                <div>
                  <p className="text-xs font-semibold text-stone-900 truncate max-w-[240px]">
                    {imageFile.name}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {(imageFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs text-stone-700 bg-white border border-stone-200 rounded hover:bg-stone-50"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1 text-stone-400 hover:text-rose-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-200 hover:border-stone-400 rounded-xl p-6 text-center cursor-pointer bg-stone-50/50 hover:bg-stone-50 transition"
            >
              <Upload className="w-6 h-6 text-stone-400 mx-auto mb-1.5" />
              <p className="text-xs font-medium text-stone-800">
                Click to choose an image from your computer
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                PNG, JPG, or WebP up to {MAX_UPLOAD_SIZE_MB}MB
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setPreviewUrl(e.target.value);
              setImageFile(null);
            }}
            placeholder="Paste public image link (https://...)"
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
          />
          {imageUrl && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Preview box if previewUrl exists */}
      {previewUrl && (
        <div className="rounded-xl overflow-hidden aspect-[16/7] border border-stone-200 bg-stone-100 mt-2">
          <img
            src={previewUrl}
            alt="Recipe Cover Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
