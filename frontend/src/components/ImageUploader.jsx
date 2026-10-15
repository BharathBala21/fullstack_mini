import React, { useState } from 'react';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, X, Check } from 'lucide-react';

const PRESET_IMAGES = [
  {
    name: 'Gourmet Dish',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Pasta & Herbs',
    url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Grilled Skillet',
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Berry Dessert',
    url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
  },
];

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
        alert('Please select a valid image file (JPEG, PNG, WEBP, GIF).');
        return;
      }
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-stone-800">
          Recipe Cover Photo
        </label>
        {/* Toggle between File Upload & Direct URL */}
        <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('file')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
              mode === 'file'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File (Multer)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
              mode === 'url'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {mode === 'file' ? (
        <div>
          {imageFile ? (
            <div className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded-xl">
              <div className="flex items-center gap-3">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                  />
                )}
                <div>
                  <p className="text-xs font-bold text-stone-800 truncate max-w-[200px]">
                    {imageFile.name}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB • Ready for Multer upload
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-stone-300 hover:border-brand-500 rounded-2xl p-6 cursor-pointer bg-stone-50/50 hover:bg-brand-50/30 transition group">
              <UploadCloud className="w-8 h-8 text-stone-400 group-hover:text-brand-500 mb-2 transition" />
              <p className="text-xs font-bold text-stone-700">
                Click to browse or drag and drop an image
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                PNG, JPG, WEBP or GIF (Up to 5MB, handled via Express Multer)
              </p>
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
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          {/* Quick presets */}
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] pt-1">
            <span className="text-stone-400 font-semibold shrink-0">Presets:</span>
            {PRESET_IMAGES.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleUrlChange(preset.url)}
                className={`px-2.5 py-1 rounded-md border shrink-0 transition ${
                  imageUrl === preset.url
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Visual Preview Banner if image available */}
      {previewUrl && (
        <div className="relative rounded-xl overflow-hidden aspect-[16/7] border border-stone-200 bg-stone-100">
          <img
            src={previewUrl}
            alt="Recipe Cover Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute bottom-2 right-2 bg-stone-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
            Live Preview
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
