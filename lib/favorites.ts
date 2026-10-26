import "server-only";
import { prisma } from "@/lib/prisma";

export async function getFavoritedPackageIds(userId: string | null): Promise<Set<string>> {
  if (!userId || !prisma) return new Set();

  try {
    const rows = await prisma.favorite.findMany({
      where: { userId },
      select: { packageId: true },
    });

    return new Set(rows.map((r) => r.packageId));
  } catch {
    return new Set();
  }
}

