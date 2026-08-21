"use client";

import { useState } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helpText?: string;
}

export default function ImageUpload({ value, onChange, label = "Upload Image", helpText = "Supports JPG, PNG" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration is missing");
      }

      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      
      // Cloudinary returns the secure_url
      // We can apply auto format and auto quality
      const optimizedUrl = data.secure_url.replace("/upload/", "/upload/f_auto,q_auto/");
      
      onChange(optimizedUrl);
    } catch (err) {
      console.error(err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    onChange("");
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-emerald-deep mb-1">{label}</label>
      
      {value ? (
        <div className="relative w-full h-48 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden group">
          <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={clearImage}
              className="bg-white/90 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Remove Image
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-emerald-soft/10 hover:border-emerald-teal/50 transition-colors cursor-pointer relative overflow-hidden">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-emerald-teal animate-spin mb-3" />
                <p className="text-sm text-emerald-deep font-medium">Uploading...</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-emerald-teal/60 mb-3" />
                <p className="text-sm text-emerald-deep font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-text-muted">{helpText}</p>
              </>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      )}
      
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
