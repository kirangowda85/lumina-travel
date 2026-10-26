"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateVerificationStatus } from "@/lib/actions/admin";
import type { VerificationStatus } from "@/types";

type VerificationRow = {
  id: string;
  userId: string;
  documentType: string;
  documentNumber: string;
  documentImageUrl: string;
  status: string;
  submittedAt: Date;
  user: {
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
};

export default function VerificationTable({ initialVerifications }: { initialVerifications: VerificationRow[] }) {
  const [verifications, setVerifications] = useState(initialVerifications);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, nextStatus: VerificationStatus) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: nextStatus } : v))
    );

    startTransition(async () => {
      const res = await updateVerificationStatus(id, nextStatus);
      if (!res.success) {
        setVerifications(initialVerifications);
        alert(res.error || "Failed to update status");
      }
    });
  };

  return (
    <div className="space-y-4">
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-navy/80 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="max-w-3xl max-h-[90vh] bg-card p-4 rounded-card border border-white/20 relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3 border-b border-navy/10 pb-2">
              <span className="font-medium text-navy text-sm">Document Image Preview (ImageKit CDN)</span>
              <button onClick={() => setSelectedImage(null)} className="text-xs font-semibold text-muted hover:text-navy px-2 py-1">✕ Close</button>
            </div>
            <div className="relative w-full h-[500px] bg-navy/5 rounded-card overflow-hidden">
              <Image src={selectedImage} alt="Document preview" fill className="object-contain" />
            </div>
          </div>
        </div>
      )}

      <div className="bg-card rounded-card border border-navy/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-navy">
          <thead className="bg-navy/5 text-xs uppercase tracking-wider text-muted border-b border-navy/10">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Document Type</th>
              <th className="p-4">Document Number</th>
              <th className="p-4">ImageKit Upload</th>
              <th className="p-4">Submitted At</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/10">
            {verifications.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted">
                  No identity verification requests found.
                </td>
              </tr>
            ) : (
              verifications.map((v) => (
                <tr key={v.id} className="hover:bg-navy/[0.02]">
                  <td className="p-4">
                    <div className="font-medium text-navy">{v.user.name}</div>
                    <div className="text-xs text-muted">{v.user.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="capitalize font-medium text-xs px-2.5 py-1 bg-navy/10 rounded-pill">
                      {v.documentType.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs">{v.documentNumber}</td>
                  <td className="p-4">
                    {v.documentImageUrl ? (
                      <button
                        onClick={() => setSelectedImage(v.documentImageUrl)}
                        className="text-xs font-medium text-rust hover:underline flex items-center gap-1.5"
                      >
                        <span>🖼️</span> View Document
                      </button>
                    ) : (
                      <span className="text-xs text-muted">No image</span>
                    )}
                  </td>
                  <td className="p-4 text-xs text-muted">
                    {new Date(v.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 text-xs rounded-pill font-medium capitalize ${
                        v.status === "approved"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : v.status === "rejected"
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {v.status !== "approved" && (
                      <button
                        onClick={() => handleStatusChange(v.id, "approved")}
                        disabled={isPending}
                        className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-pill transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {v.status !== "rejected" && (
                      <button
                        onClick={() => handleStatusChange(v.id, "rejected")}
                        disabled={isPending}
                        className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-pill transition-colors"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
