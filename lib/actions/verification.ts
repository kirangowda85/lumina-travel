"use server";

import { z } from "zod";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

import { imagekit } from "@/lib/imagekit";

// The client already uploaded the file straight to ImageKit (via the signed
// params from app/api/imagekit-auth/route.ts) before calling this action —
// this just persists the resulting CDN url/fileId against the signed-in
// user. Document type/number are still re-validated here since those come
// from a plain form, not a signed upload.
const submitVerificationSchema = z.object({
  documentType: z.enum(["passport", "national_id", "driver_license"]),
  documentNumber: z.string().trim().min(1, "Enter your document number.").max(64),
  documentImageUrl: z.string().url(),
  documentFileId: z.string().min(1),
});

export type SubmitVerificationInput = z.infer<typeof submitVerificationSchema>;

export type SubmitVerificationResult = { ok: true } | { ok: false; error: string };



async function ensureUserExists(userId: string) {
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress
      || clerkUser?.emailAddresses[0]?.emailAddress
      || `${userId}@user.clerk`;
    const name = `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || clerkUser?.username || "Traveler";
    const avatarUrl = clerkUser?.imageUrl || null;

    user = await prisma.user.upsert({
      where: { id: userId },
      update: { name, email, avatarUrl },
      create: { id: userId, name, email, avatarUrl },
    });
  }
  return user;
}

export async function submitVerification(
  input: SubmitVerificationInput,
): Promise<SubmitVerificationResult> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: "You need to sign in to submit verification." };
  }

  const parsed = submitVerificationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "That submission doesn't look right." };
  }
  const { documentType, documentNumber, documentImageUrl, documentFileId } = parsed.data;

  await ensureUserExists(userId);


  const previous = await prisma.identityVerification.findUnique({ where: { userId } });

  await prisma.identityVerification.upsert({
    where: { userId },
    create: {
      userId,
      documentType,
      documentNumber,
      documentImageUrl,
      documentFileId,
      status: "pending",
    },
    update: {
      documentType,
      documentNumber,
      documentImageUrl,
      documentFileId,
      status: "pending", // resubmitting (e.g. after a rejection) always resets review state
      submittedAt: new Date(),
    },
  });

  // Best-effort cleanup of the file this replaces — a resubmission
  // shouldn't leave the old ID document sitting in ImageKit indefinitely.
  // Never let this block or fail the submission itself.
  if (previous?.documentFileId && previous.documentFileId !== documentFileId) {
    try {
      await imagekit.files.delete(previous.documentFileId);
    } catch (err) {
      console.error("Failed to delete superseded verification file", previous.documentFileId, err);
    }
  }

  return { ok: true };
}
