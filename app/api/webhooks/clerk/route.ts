import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Clerk owns credentials/sessions; this route is the only place a Clerk
// user gets mirrored into our own `User` table so Booking/Favorite/
// IdentityVerification can use normal foreign keys (Section 4 of the
// build plan). Never trust this body until the signature checks out.
export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();

  let event: WebhookEvent;
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Clerk webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const primaryEmail = email_addresses.find(
        (e) => e.id === event.data.primary_email_address_id
      )?.email_address ?? email_addresses[0]?.email_address;

      if (!primaryEmail) {
        console.error(`Clerk user ${id} has no email address, skipping sync`);
        break;
      }

      const name = [first_name, last_name].filter(Boolean).join(" ") || "Traveler";

      await prisma.user.upsert({
        where: { id },
        create: { id, name, email: primaryEmail, avatarUrl: image_url ?? null },
        update: { name, email: primaryEmail, avatarUrl: image_url ?? null },
      });
      break;
    }

    case "user.deleted": {
      const id = event.data.id;
      if (id) {
        // Bookings/favorites/verification rows are kept for record-keeping;
        // only the User row itself is removed. Revisit if a hard-delete /
        // cascade policy is needed later.
        await prisma.user.delete({ where: { id } }).catch(() => {
          // Already gone or never synced — not an error worth failing the webhook over.
        });
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
