import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUploadAuthParams } from "@imagekit/next/server";
import { getAdminSession } from "@/lib/admin-auth";

// Signs short-lived upload credentials for client-side uploads.
// Restricted to authenticated travelers (for identity verification uploads)
// or authenticated administrators (for destination / hero media management).
export async function GET() {
  if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY) {
    console.error("imagekit-auth: missing IMAGEKIT_PRIVATE_KEY or NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY");
    return NextResponse.json({ error: "Upload isn't configured yet." }, { status: 500 });
  }

  const { userId } = await auth();
  const adminSession = await getAdminSession();

  if (!userId && !adminSession) {
    return NextResponse.json(
      { error: "Unauthorized. You must be signed in to upload files." },
      { status: 401 }
    );
  }

  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  });

  return NextResponse.json({
    token,
    expire,
    signature,
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  });
}
