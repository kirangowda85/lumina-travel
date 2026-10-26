"use client";

import { useRef, useState } from "react";

export default function UploadBox({
  onFileSelected,
}: {
  onFileSelected?: (file: File | null) => void;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    setFileName(file ? file.name : null);
    onFileSelected?.(file ?? null);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex flex-col items-center justify-center rounded-card border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragOver ? "border-rust bg-rust/5" : "border-navy/20 bg-page"
        }`}
      >
        {fileName ? (
          <>
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-navy" fill="none" strokeWidth={1.5}>
              <path d="M9 12.5 11 14.5l4-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" />
            </svg>
            <p className="mt-3 max-w-[220px] truncate text-sm font-medium text-navy">{fileName}</p>
            <button
              onClick={() => handleFile(undefined)}
              className="mt-2 text-xs font-medium text-rust hover:underline"
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-muted" fill="none" strokeWidth={1.5}>
              <path
                d="M12 16V4m0 0-4 4m4-4 4 4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeLinecap="round" />
            </svg>
            <p className="mt-3 text-sm font-medium text-navy">
              Drag a photo here, or choose an option below
            </p>
            <p className="mt-1 text-xs text-muted">JPG, PNG, or PDF · up to 8MB</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className="mt-3 flex gap-3">
        <button
          onClick={() => inputRef.current?.click()}
          className="flex flex-1 items-center justify-center gap-2 rounded-pill border border-navy/20 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-page"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" strokeWidth={1.6}>
            <path
              d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z"
              stroke="currentColor"
            />
            <circle cx="12" cy="13" r="3.2" stroke="currentColor" />
          </svg>
          Camera
        </button>
        <button
          onClick={() => inputRef.current?.click()}
          className="flex flex-1 items-center justify-center gap-2 rounded-pill border border-navy/20 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-page"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" strokeWidth={1.6}>
            <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" />
            <path d="m6 16 4-4.5 3 3 2.5-3L20 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="8.5" cy="9" r="1.25" stroke="currentColor" />
          </svg>
          Gallery
        </button>
      </div>
    </div>
  );
}
