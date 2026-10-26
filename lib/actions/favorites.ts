"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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

export type ToggleFavoriteResult = { ok: true; favorited: boolean } | { ok: false; error: string };

export async function toggleFavorite(packageId: string): Promise<ToggleFavoriteResult> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, error: "Sign in to save favorites." };
  }

  await ensureUserExists(userId);


  try {
    const existing = await prisma.favorite.findUnique({
      where: { userId_packageId: { userId, packageId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return { ok: true, favorited: false };
    }

    await prisma.favorite.create({ data: { userId, packageId } });
    return { ok: true, favorited: true };
  } catch (err) {
    console.error("toggleFavorite failed", err);
    return { ok: false, error: "Something went wrong — please try again." };
  }
}
