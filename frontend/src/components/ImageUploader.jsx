import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Link as LinkIcon, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
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
  // Default to 'file' (local upload) unless editing an existing recipe with only an external URL
  const [mode, setMode] = useState(() => {
    if (imageFile) return 'file';
    if (imageUrl && !imageUrl.startsWith('blob:') && !imageUrl.startsWith('/uploads/')) {
      return 'url';
    }
    return 'file';
  });

  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  // Clean up object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const processFile = (file) => {
    if (!file) return;

    if (!file.type || !file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (PNG, JPG, WebP, GIF).');
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setFileError(`File is too large (${sizeMB}MB). Maximum allowed is ${MAX_UPLOAD_SIZE_MB}MB.`);
      return;
    }

    setFileError('');

    // Revoke previous blob url if any
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setImageFile(file);
    setPreviewUrl(objectUrl);
    setImageUrl(''); // Clear manual URL when file is picked
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset file input so user can re-pick the same file name if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveFile = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl('');
    setFileError('');
  };

  const handleUrlChange = (url) => {
    // Revoke blob if switching to URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageUrl(url);
    setPreviewUrl(url);
    setImageFile(null);
    setFileError('');
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      {/* Header and Mode Selector */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-stone-700">
            Recipe Image
          </label>
          <p className="text-[11px] text-stone-500">
            Upload a photo from your device or paste an image link
          </p>
        </div>

        <div className="flex items-center bg-stone-100 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('file');
              setFileError('');
            }}
            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
              mode === 'file'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Upload from device
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('url');
              setFileError('');
            }}
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

      {/* Error notification if validation fails */}
      {fileError && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      {/* Mode: Local File Upload */}
      {mode === 'file' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          {imageFile ? (
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Uploaded thumbnail"
                    className="w-12 h-12 object-cover rounded-lg border border-stone-200 shrink-0 bg-stone-100"
                  />
                ) : (
                  <div className="w-12 h-12 bg-stone-200 rounded-lg flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5 text-stone-500" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-stone-900 truncate">
                    {imageFile.name}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {formatFileSize(imageFile.size)} • Ready to upload
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-200 hover:bg-stone-50 rounded-md transition"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-md hover:bg-white transition"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition ${
                isDragging
                  ? 'border-stone-900 bg-stone-100/70'
                  : 'border-stone-200 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 mb-2">
                <UploadCloud className="w-5 h-5 text-stone-600" />
              </div>
              <p className="text-xs font-medium text-stone-800">
                Click to browse or drag and drop image here
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                PNG, JPG, WebP or GIF up to {MAX_UPLOAD_SIZE_MB}MB
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="mt-3 px-3 py-1.5 text-xs font-medium text-stone-800 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg shadow-2xs transition"
              >
                Choose from computer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode: Image URL */}
      {mode === 'url' && (
        <div className="space-y-2.5">
          <div className="relative">
            <input
              type="url"
              placeholder="Paste public image link (https://...)"
              value={imageUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-3 pr-8 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
            />
            {imageUrl && (
              <button
                type="button"
                onClick={() => handleUrlChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500">
            <span className="font-medium">Sample presets:</span>
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

      {/* Large Image Preview Card if any image or URL is selected */}
      {previewUrl && (
        <div className="rounded-xl overflow-hidden aspect-[16/7] border border-stone-200 bg-stone-100 relative group">
          <img
            src={previewUrl}
            alt="Recipe Cover Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute top-2 left-2 bg-stone-900/75 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
            {imageFile ? 'Local image selected' : 'Cover Preview'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
