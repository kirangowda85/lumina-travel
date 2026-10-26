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

  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && message.trim().length >= 10;

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const result = await sendConciergeMessage({ name, email, phone, message, company });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSent(true);
    });
  };


  if (sent) {
    return (
      <div className="mt-8 rounded-card bg-card p-6 text-center ring-1 ring-navy/5">
        <p className="font-serif text-lg font-semibold text-navy">Custom Plan Request Received</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Your custom plan request has been submitted! A Payana travel specialist will follow up at {email} within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="mt-8 space-y-5 rounded-card bg-card p-6 ring-1 ring-navy/5"
    >
      <div>
        <label htmlFor="name" className="text-sm font-medium text-navy">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          className="mt-2 w-full rounded-lg border border-navy/15 bg-page px-3.5 py-2.5 text-sm text-navy placeholder:text-muted/70 focus:border-navy focus:outline-none"
          placeholder="Your full name"
        />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-navy">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          className="mt-2 w-full rounded-lg border border-navy/15 bg-page px-3.5 py-2.5 text-sm text-navy placeholder:text-muted/70 focus:border-navy focus:outline-none"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="phone" className="text-sm font-medium text-navy">Mobile Number (Optional)</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isPending}
          className="mt-2 w-full rounded-lg border border-navy/15 bg-page px-3.5 py-2.5 text-sm text-navy placeholder:text-muted/70 focus:border-navy focus:outline-none"
          placeholder="+91 98765 43210"
        />
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-navy">Message</label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isPending}
          className="mt-2 w-full rounded-lg border border-navy/15 bg-page px-3.5 py-2.5 text-sm text-navy placeholder:text-muted/70 focus:border-navy focus:outline-none"
          placeholder="What kind of journey are you dreaming up? Tell us your preferred dates, places, or budget."
        />
      </div>

      {/* Honeypot — visually hidden, off the tab order, and named plainly
          enough that most bots fill it in anyway. */}
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

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit || isPending}
        className="w-full rounded-pill bg-rust py-3 text-sm font-medium text-white transition-colors hover:bg-rust-light disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? "Submitting Request…" : "Submit Custom Plan Request"}
      </button>

    </form>
  );
}
