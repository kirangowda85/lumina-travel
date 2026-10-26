import ImageKit from "@imagekit/nodejs";

// Server-only ImageKit instance. IMAGEKIT_PRIVATE_KEY must never be exposed
// to the client -- this file should only ever be imported from route handlers
// / server actions (e.g. app/api/imagekit-auth/route.ts).
export const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});
