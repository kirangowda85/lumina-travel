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

  if (!process.env.RESEND_API_KEY) {
    console.error("sendConciergeMessage: RESEND_API_KEY is not set");
    return { ok: false, error: "Concierge messaging isn't configured yet — please try again later." };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = process.env.CONCIERGE_TO_EMAIL ?? "payana.stories@gmail.com";
  const from = process.env.CONCIERGE_FROM_EMAIL ?? "Payana Concierge <contact@payana-stories.vercel.app>";

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New concierge inquiry from ${name}`,
      text: `${message}\n\n—\n${name} <${email}>`,
      html: `<p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p><p>—<br/>${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>`,
    });

    if (error) {
      console.error("sendConciergeMessage: Resend returned an error", error);
      return { ok: false, error: "Something went wrong sending your message. Please try again." };
    }

    return { ok: true };
  } catch (err) {
    console.error("sendConciergeMessage failed", err);
    return { ok: false, error: "Something went wrong sending your message. Please try again." };
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
