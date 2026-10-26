"use client";

import { useState } from "react";
import { upload, ImageKitAbortError, ImageKitInvalidRequestError, ImageKitServerError, ImageKitUploadNetworkError } from "@imagekit/next";
import UploadBox from "@/components/verification/UploadBox";
import { submitVerification } from "@/lib/actions/verification";
import { DocumentType, VerificationStatus } from "@/types";

const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: "passport", label: "Passport" },
  { value: "national_id", label: "National ID" },
  { value: "driver_license", label: "Driver's license" },
];

const STATUS_STYLES: Record<VerificationStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

export type InitialVerification = {
  documentType: DocumentType;
  documentNumber: string;
  documentImageUrl: string;
  status: VerificationStatus;
} | null;

export default function VerificationForm({ initial }: { initial: InitialVerification }) {
  const [documentType, setDocumentType] = useState<DocumentType>(initial?.documentType ?? "passport");
  const [documentNumber, setDocumentNumber] = useState(initial?.documentNumber ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<VerificationStatus | null>(initial?.status ?? null);
  const [progress, setProgress] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = documentNumber.trim().length > 0 && file !== null && !submitting;
  const canResubmit = status === "rejected" || status === null;

  const handleSubmit = async () => {
    if (!file) return;
    setSubmitting(true);
    setError(null);
    setProgress(0);

    try {
      const authRes = await fetch("/api/imagekit-auth");
      if (!authRes.ok) {
        throw new Error("Couldn't start the upload — please try again.");
      }
      const authParams = await authRes.json();

      const uploaded = await upload({
        file,
        fileName: `verification-${Date.now()}-${file.name}`,
        publicKey: authParams.publicKey,
        signature: authParams.signature,
        expire: authParams.expire,
        token: authParams.token,
        folder: "/identity-verification",
        useUniqueFileName: true,
        onProgress: (event) => {
          setProgress(Math.round((event.loaded / event.total) * 100));
        },
      });

      if (!uploaded.url || !uploaded.fileId) {
        throw new Error("Upload didn't return a usable file — please try again.");
      }

      const result = await submitVerification({
        documentType,
        documentNumber: documentNumber.trim(),
        documentImageUrl: uploaded.url,
        documentFileId: uploaded.fileId,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setStatus("pending");
      setFile(null);
    } catch (err) {
      if (err instanceof ImageKitAbortError) {
        setError("Upload was cancelled — please try again.");
      } else if (err instanceof ImageKitInvalidRequestError) {
        setError("That file couldn't be uploaded — try a different photo or PDF.");
      } else if (err instanceof ImageKitServerError) {
        setError("Upload service is having trouble right now — please try again shortly.");
      } else if (err instanceof ImageKitUploadNetworkError) {
        setError("Network error during upload — please check your connection and try again.");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong — please try again.");
      }
    } finally {
      setSubmitting(false);
      setProgress(null);
    }
  };

  return (
    <>
      {status && (
        <span
          className={`mt-5 inline-block rounded-pill px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[status]}`}
        >
          {status}
        </span>
      )}

      {status && !canResubmit && (
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {status === "pending"
            ? "Your document is under review — we'll email you once it's approved."
            : "You're verified. No further action needed."}
        </p>
      )}

      {canResubmit && (
        <div className="mt-8 space-y-6 rounded-card bg-card p-6 ring-1 ring-navy/5">
          <div>
            <label className="text-sm font-medium text-navy">Document type</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {DOCUMENT_TYPES.map((doc) => (
                <button
                  key={doc.value}
                  onClick={() => setDocumentType(doc.value)}
                  disabled={submitting}
                  className={`rounded-lg border py-2 text-xs font-medium transition-colors ${
                    documentType === doc.value
                      ? "border-navy bg-navy text-white"
                      : "border-navy/15 text-navy hover:bg-page"
                  }`}
                >
                  {doc.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="doc-number" className="text-sm font-medium text-navy">
              Document number
            </label>
            <input
              id="doc-number"
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              disabled={submitting}
              placeholder="e.g. X1234567"
              className="mt-2 w-full rounded-lg border border-navy/15 bg-page px-3.5 py-2.5 text-sm text-navy placeholder:text-muted/70 focus:border-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-navy">Upload document</label>
            <div className="mt-2">
              <UploadBox onFileSelected={setFile} />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full rounded-pill bg-rust py-3 text-sm font-medium text-white transition-colors hover:bg-rust-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? (progress !== null ? `Uploading… ${progress}%` : "Submitting…") : "Submit for review"}
          </button>
        </div>
      )}
    </>
  );
}
