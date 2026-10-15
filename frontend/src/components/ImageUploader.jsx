import React, { useState } from 'react';
import { UploadCloud, Link as LinkIcon, X } from 'lucide-react';
import {
  IMAGE_PRESETS,
  MAX_UPLOAD_SIZE_MB,
  MAX_UPLOAD_SIZE_BYTES,
} from '../config/constants';

const ImageUploader = ({
  imageUrl,
  setImageUrl,
  imageFile,
  setImageFile,
  previewUrl,
  setPreviewUrl,
}) => {
  const [mode, setMode] = useState(imageFile ? 'file' : 'url');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (PNG, JPG, WebP).');
        return;
      }
      if (file.size > MAX_UPLOAD_SIZE_BYTES) {
        alert(`File is too large. Maximum size is ${MAX_IMAGE_FILE_SIZE_MB}MB.`);
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setImageFile(null);
    setPreviewUrl('');
  };

  const handleUrlChange = (url) => {
    setImageUrl(url);
    setPreviewUrl(url);
    setImageFile(null);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-stone-700">
          Cover Image
        </label>
        <div className="flex items-center bg-stone-100 p-0.5 rounded-md text-xs">
          <button
            type="button"
            onClick={() => setMode('file')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition ${
              mode === 'file'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Upload file
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition ${
              mode === 'url'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {mode === 'file' ? (
        <div>
          {imageFile ? (
            <div className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded-lg">
              <div className="flex items-center gap-3">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded border border-stone-200"
                  />
                )}
                <div>
                  <p className="text-xs font-medium text-stone-900 truncate max-w-[200px]">
                    {imageFile.name}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 text-stone-400 hover:text-stone-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border border-dashed border-stone-300 hover:border-stone-400 rounded-xl p-6 cursor-pointer bg-stone-50/50 hover:bg-stone-50 transition">
              <UploadCloud className="w-6 h-6 text-stone-400 mb-1.5" />
              <span className="text-xs font-medium text-stone-700">
                Choose an image or drag and drop
              </span>
              <span className="text-[11px] text-stone-400 mt-0.5">
                PNG, JPG or WebP up to {MAX_IMAGE_FILE_SIZE_MB}MB
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="url"
            placeholder="Paste image link (e.g. https://...)"
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
          />

          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
            <span>Presets:</span>
            {IMAGE_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleUrlChange(preset.url)}
                className={`px-2 py-0.5 rounded border transition ${
                  imageUrl === preset.url
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {previewUrl && (
        <div className="rounded-lg overflow-hidden aspect-[16/7] border border-stone-200 bg-stone-100 mt-2">
          <img
            src={previewUrl}
            alt="Preview"
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
