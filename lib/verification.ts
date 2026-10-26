import "server-only";
import { prisma } from "@/lib/prisma";
import { DocumentType, VerificationStatus } from "@/types";

export type UserVerification = {
  documentType: DocumentType;
  documentNumber: string;
  documentImageUrl: string;
  status: VerificationStatus;
  submittedAt: string; // ISO
};

export async function getVerificationForUser(userId: string): Promise<UserVerification | null> {
  if (!prisma) return null;
  const row = await prisma.identityVerification.findUnique({ where: { userId } });
  if (!row) return null;

  return {
    documentType: row.documentType as DocumentType,
    documentNumber: row.documentNumber,
    documentImageUrl: row.documentImageUrl,
    status: row.status as VerificationStatus,
    submittedAt: row.submittedAt.toISOString(),
  };
}
