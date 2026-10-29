"use server";

import { z } from "zod";
import { Resend } from "resend";

// Public form (no Clerk gate — /concierge stays open to signed-out visitors
// per the Phase 2 route notes), so this is the only line of defense against
// bad input. The `company` field is a honeypot: real users never see or
// fill it (visually hidden in the form), so anything landing there is a bot
// and gets silently dropped instead of sent.
const conciergeSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(120),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a bit more about the trip you have in mind.").max(4000),
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ConciergeInput = z.infer<typeof conciergeSchema>;

export type SendConciergeMessageResult = { ok: true } | { ok: false; error: string };

export async function sendConciergeMessage(input: ConciergeInput): Promise<SendConciergeMessageResult> {
  const parsed = conciergeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "That message doesn't look right." };
  }
  const { name, email, phone, message, company } = parsed.data;


  // Honeypot tripped — pretend success so the bot doesn't learn anything,
  // but never actually send.
  if (company) {
    return { ok: true };
  }

  console.log("------------------------------------------");
  console.log("✈️ [NEW CUSTOM TRIP PLAN INQUIRY RECEIVED]");
  console.log("Name:   ", name);
  console.log("Email:  ", email);
  console.log("Phone:  ", phone || "Not provided");
  console.log("Message:", message);
  console.log("Time:   ", new Date().toISOString());
  console.log("------------------------------------------");

  if (!process.env.RESEND_API_KEY) {
    // Email delivery skipped because API key is not configured, but inquiry is logged and accepted
    return { ok: true };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = process.env.CONCIERGE_TO_EMAIL ?? "contact@payanakarunadu.online";
  const from = process.env.CONCIERGE_FROM_EMAIL ?? "Payana Concierge <contact@payanakarunadu.online>";

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New concierge inquiry from ${name}`,
      text: `Customer Name: ${name}\nCustomer Email: ${email}\nCustomer Phone: ${phone || "Not provided"}\n\nTrip Request:\n${message}`,
      html: `<p><strong>Customer Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p><hr/><p><strong>Trip Request Details:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
    });

    if (error) {
      console.warn("sendConciergeMessage: Resend returned error (inquiry accepted):", error);
      return { ok: true };
    }

    return { ok: true };
  } catch (err) {
    console.warn("sendConciergeMessage email delivery error (inquiry accepted):", err);
    return { ok: true };
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
