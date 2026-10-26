"use client";

import { useState, useRef } from "react";
import { upload } from "@imagekit/next";
import Image from "next/image";

interface ImageKitUploaderProps {
  label: string;
  folder?: string;
  accept?: string;
  currentUrls: string[];
  onChangeUrls: (urls: string[]) => void;
  multiple?: boolean;
}

export default function ImageKitUploader({
  label,
  folder = "/destinations",
  accept = "image/*,video/*",
  currentUrls,
  onChangeUrls,
  multiple = true,
}: ImageKitUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    const uploadedUrls: string[] = [];

    try {
      // Get auth parameters
      const authRes = await fetch("/api/imagekit-auth");
      if (!authRes.ok) {
        throw new Error("Could not authenticate with ImageKit server.");
      }
      const authParams = await authRes.json();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await upload({
          file,
          fileName: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
          publicKey: authParams.publicKey,
          signature: authParams.signature,
          expire: authParams.expire,
          token: authParams.token,
          folder,
          useUniqueFileName: true,
          onProgress: (event) => {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          },
        });

        if (res && res.url) {
          uploadedUrls.push(res.url);
        }
      }

      if (multiple) {
        onChangeUrls([...currentUrls, ...uploadedUrls]);
      } else {
        onChangeUrls(uploadedUrls);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload file to ImageKit");
    } finally {
      setUploading(false);
      setProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    onChangeUrls(currentUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-navy">
          {label}
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-pill bg-rust px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rust-light disabled:opacity-50 flex items-center gap-1.5"
        >
          <span>📤</span> {uploading ? (progress !== null ? `Uploading… ${progress}%` : "Uploading…") : multiple ? "Upload File(s)" : "Upload File"}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

      {/* Media Previews */}
      {currentUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {currentUrls.map((url, idx) => {
            const isVideo = url.match(/\.(mp4|webm|mov)$/i) || url.includes("video");

            return (
              <div
                key={idx}
                className="group relative rounded-card overflow-hidden border border-navy/20 bg-navy/5 aspect-video flex items-center justify-center"
              >
                {isVideo ? (
                  <video src={url} className="w-full h-full object-cover" muted />
                ) : (
                  <Image src={url} alt={`Upload ${idx + 1}`} fill className="object-cover" />
                )}

                <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="px-2.5 py-1 text-xs font-medium text-white bg-rose-600 rounded-pill hover:bg-rose-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
