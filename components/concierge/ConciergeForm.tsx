"use client";

import { useState, useTransition } from "react";
import { sendConciergeMessage } from "@/lib/actions/concierge";

export default function ConciergeForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot — left empty by real users
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [clientErrors, setClientErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) {
      errs.name = "Please enter your full name.";
    }
    if (!email.trim() || !email.includes("@")) {
      errs.email = "Please enter a valid email address.";
    }
    if (message.trim().length < 5) {
      errs.message = "Please tell us a bit more about your trip (at least 5 characters).";
    }
    setClientErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    setError(null);
    if (!validate()) return;

    startTransition(async () => {
      const result = await sendConciergeMessage({ name, email, phone, message, company });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSent(true);
    });
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Payana! I just requested a Custom Trip Plan on your website.\n\n👤 Name: ${name}\n📧 Email: ${email}\n📱 Phone: ${phone || "Not provided"}\n\n🗺️ My Dream Trip:\n${message}`
  );
  const whatsappUrl = `https://wa.me/918970644859?text=${whatsappMessage}`;

  if (sent) {
    return (
      <div className="mt-8 rounded-card bg-card p-8 text-center ring-1 ring-navy/10 shadow-sm space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-pill mb-2">
            ✓ Request Received
          </span>
          <h2 className="font-serif text-2xl font-semibold text-navy">Custom Trip Request Received!</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted max-w-md mx-auto">
            Thank you, <span className="font-semibold text-navy">{name}</span>! Your request has been recorded. Our travel planners are already reviewing your details and will prepare your curated itinerary within one business day.
          </p>
        </div>

        {/* Quick summary box */}
        <div className="bg-page p-4 rounded-card border border-navy/10 text-left text-xs space-y-1.5 max-w-md mx-auto">
          <div><span className="font-semibold text-navy">Email:</span> {email}</div>
          {phone && <div><span className="font-semibold text-navy">Phone:</span> {phone}</div>}
          <div className="pt-1 text-muted italic">&ldquo;{message}&rdquo;</div>
        </div>

        {/* Direct WhatsApp Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-pill bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <span>💬</span> Connect Instantly on WhatsApp (+91 89706 44859)
          </a>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setMessage("");
              setPhone("");
            }}
            className="w-full sm:w-auto text-xs font-medium text-muted hover:text-navy px-4 py-2"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {/* Quick WhatsApp direct link card */}
      <div className="rounded-card bg-rust/5 border border-rust/15 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-navy">
          <span className="text-base">⚡</span>
          <span>Prefer instant discussion? Chat directly with our specialist on WhatsApp:</span>
        </div>
        <a
          href="https://wa.me/918970644859?text=Hello%20Payana%2C%20I%20would%20like%20to%20plan%20a%20custom%20trip."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-navy text-white font-medium hover:bg-rust transition-colors shrink-0"
        >
          <span>💬</span> +91 89706 44859
        </a>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-5 rounded-card bg-card p-6 ring-1 ring-navy/10 shadow-sm"
      >
        <div>
          <label htmlFor="name" className="text-sm font-medium text-navy">
            Name <span className="text-rust">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (clientErrors.name) setClientErrors((prev) => ({ ...prev, name: "" }));
            }}
            disabled={isPending}
            className={`mt-2 w-full rounded-lg border bg-page px-3.5 py-2.5 text-sm text-navy placeholder:text-muted/70 focus:outline-none ${
              clientErrors.name ? "border-rose-400 focus:border-rose-500" : "border-navy/15 focus:border-navy"
            }`}
            placeholder="Your full name"
          />
          {clientErrors.name && <p className="mt-1 text-xs text-rose-600">{clientErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-navy">
            Email <span className="text-rust">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (clientErrors.email) setClientErrors((prev) => ({ ...prev, email: "" }));
            }}
            disabled={isPending}
            className={`mt-2 w-full rounded-lg border bg-page px-3.5 py-2.5 text-sm text-navy placeholder:text-muted/70 focus:outline-none ${
              clientErrors.email ? "border-rose-400 focus:border-rose-500" : "border-navy/15 focus:border-navy"
            }`}
            placeholder="you@example.com"
          />
          {clientErrors.email && <p className="mt-1 text-xs text-rose-600">{clientErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-medium text-navy">
            Mobile Number (Optional)
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isPending}
            className="mt-2 w-full rounded-lg border border-navy/15 bg-page px-3.5 py-2.5 text-sm text-navy placeholder:text-muted/70 focus:border-navy focus:outline-none"
            placeholder="+91 89706 44859"
          />
        </div>

        <div>
          <label htmlFor="message" className="text-sm font-medium text-navy">
            Message <span className="text-rust">*</span>
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (clientErrors.message) setClientErrors((prev) => ({ ...prev, message: "" }));
            }}
            disabled={isPending}
            className={`mt-2 w-full rounded-lg border bg-page px-3.5 py-2.5 text-sm text-navy placeholder:text-muted/70 focus:outline-none ${
              clientErrors.message ? "border-rose-400 focus:border-rose-500" : "border-navy/15 focus:border-navy"
            }`}
            placeholder="What kind of journey are you dreaming up? Tell us your preferred dates, places, or budget."
          />
          {clientErrors.message && <p className="mt-1 text-xs text-rose-600">{clientErrors.message}</p>}
        </div>

        {/* Honeypot — visually hidden, off the tab order */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        {error && (
          <div className="p-3 rounded-card bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-pill bg-rust py-3.5 text-sm font-medium text-white transition-colors hover:bg-rust-light disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
        >
          {isPending ? "Submitting Request…" : "Submit Custom Plan Request"}
        </button>
      </form>
    </div>
  );
}
