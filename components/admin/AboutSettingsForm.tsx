"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { updateAboutSettings } from "@/lib/actions/admin";
import type { AboutSettingsData } from "@/lib/about";

export default function AboutSettingsForm({ initial }: { initial: AboutSettingsData }) {
  const [badge, setBadge] = useState(initial.badge || "About");
  const [title, setTitle] = useState(initial.title || "About Payana");
  const [paragraph1, setParagraph1] = useState(initial.paragraph1 || "");
  const [paragraph2, setParagraph2] = useState(initial.paragraph2 || "");
  const [ctaTitle, setCtaTitle] = useState(initial.ctaTitle || "Have a trip in mind?");
  const [ctaDescription, setCtaDescription] = useState(initial.ctaDescription || "");
  const [ctaButtonText, setCtaButtonText] = useState(initial.ctaButtonText || "Request a Custom Plan");
  const [ctaButtonLink, setCtaButtonLink] = useState(initial.ctaButtonLink || "/concierge");

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const res = await updateAboutSettings({
        badge,
        title,
        paragraph1,
        paragraph2,
        ctaTitle,
        ctaDescription,
        ctaButtonText,
        ctaButtonLink,
      });

      if (res.success) {
        setMessage({ type: "success", text: "About page content published successfully!" });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to update about settings." });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-navy/10 pb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-2 text-xs font-semibold rounded-pill transition-colors ${
              activeTab === "edit"
                ? "bg-navy text-white"
                : "bg-navy/5 text-navy hover:bg-navy/10"
            }`}
          >
            ✏️ Content Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 text-xs font-semibold rounded-pill transition-colors ${
              activeTab === "preview"
                ? "bg-navy text-white"
                : "bg-navy/5 text-navy hover:bg-navy/10"
            }`}
          >
            👁️ Live Preview
          </button>
        </div>

        <Link
          href="/about"
          target="_blank"
          className="text-xs text-rust hover:underline font-medium flex items-center gap-1"
        >
          <span>View Live /about Page</span>
          <span>↗</span>
        </Link>
      </div>

      {message && (
        <div
          className={`p-4 rounded-card text-xs font-medium flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <span>{message.type === "success" ? "✓" : "⚠"}</span>
          <span>{message.text}</span>
        </div>
      )}

      {activeTab === "preview" ? (
        /* Live Preview Mode */
        <div className="bg-card rounded-card border border-navy/15 p-8 sm:p-12 shadow-sm max-w-3xl mx-auto">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-4 pb-2 border-b border-navy/10 flex justify-between items-center">
            <span>Live Customer Preview</span>
            <span className="text-rust">/about</span>
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.2em] text-rust">{badge || "About"}</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-navy sm:text-4xl">
            {title || "About Payana"}
          </h1>
          {paragraph1 && (
            <p className="mt-6 text-base leading-relaxed text-navy/80 whitespace-pre-line">
              {paragraph1}
            </p>
          )}
          {paragraph2 && (
            <p className="mt-4 text-base leading-relaxed text-navy/80 whitespace-pre-line">
              {paragraph2}
            </p>
          )}

          <div className="mt-10 rounded-card bg-sand/30 p-6 ring-1 ring-navy/5">
            <p className="font-serif text-lg font-semibold text-navy">{ctaTitle || "Have a trip in mind?"}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {ctaDescription || "Our team curates custom plans around what matters to you, not just fixed packages."}
            </p>
            <span className="mt-4 inline-block rounded-pill bg-rust px-5 py-2.5 text-sm font-medium text-white shadow-sm">
              {ctaButtonText || "Request a Custom Plan"}
            </span>
          </div>
        </div>
      ) : (
        /* Edit Form Mode */
        <form onSubmit={handleSubmit} className="bg-card p-6 sm:p-8 rounded-card border border-navy/10 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">
                Badge / Small Label
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. About, Our Story"
                required
                className="w-full px-4 py-2.5 bg-sand/20 border border-navy/15 rounded-card text-sm text-navy focus:outline-none focus:border-rust"
              />
              <p className="text-[10px] text-muted mt-1">Appears above the main headline</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">
                Main Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. About Payana"
                required
                className="w-full px-4 py-2.5 bg-sand/20 border border-navy/15 rounded-card text-sm text-navy focus:outline-none focus:border-rust"
              />
              <p className="text-[10px] text-muted mt-1">Main H1 headline of the About page</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">
              Primary Narrative (Paragraph 1)
            </label>
            <textarea
              rows={4}
              value={paragraph1}
              onChange={(e) => setParagraph1(e.target.value)}
              placeholder="Enter opening story and description..."
              required
              className="w-full px-4 py-3 bg-sand/20 border border-navy/15 rounded-card text-sm text-navy focus:outline-none focus:border-rust leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">
              Secondary Narrative (Paragraph 2)
            </label>
            <textarea
              rows={4}
              value={paragraph2}
              onChange={(e) => setParagraph2(e.target.value)}
              placeholder="Enter continuing details or philosophy..."
              required
              className="w-full px-4 py-3 bg-sand/20 border border-navy/15 rounded-card text-sm text-navy focus:outline-none focus:border-rust leading-relaxed"
            />
          </div>

          <div className="border-t border-navy/10 pt-6">
            <h3 className="font-serif text-lg font-bold text-navy mb-1 flex items-center gap-2">
              <span>🧭</span> Custom Journey Call to Action Box
            </h3>
            <p className="text-xs text-muted mb-4">
              Configure the highlighted box inviting customers to request personalized concierge itineraries.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">
                  Box Headline
                </label>
                <input
                  type="text"
                  value={ctaTitle}
                  onChange={(e) => setCtaTitle(e.target.value)}
                  placeholder="e.g. Have a trip in mind?"
                  required
                  className="w-full px-4 py-2.5 bg-sand/20 border border-navy/15 rounded-card text-sm text-navy focus:outline-none focus:border-rust"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">
                  Box Supporting Description
                </label>
                <textarea
                  rows={2}
                  value={ctaDescription}
                  onChange={(e) => setCtaDescription(e.target.value)}
                  placeholder="e.g. Our team curates custom plans around what matters to you, not just fixed packages."
                  required
                  className="w-full px-4 py-2.5 bg-sand/20 border border-navy/15 rounded-card text-sm text-navy focus:outline-none focus:border-rust"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={ctaButtonText}
                    onChange={(e) => setCtaButtonText(e.target.value)}
                    placeholder="e.g. Request a Custom Plan"
                    required
                    className="w-full px-4 py-2.5 bg-sand/20 border border-navy/15 rounded-card text-sm text-navy focus:outline-none focus:border-rust"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">
                    Button Target URL
                  </label>
                  <input
                    type="text"
                    value={ctaButtonLink}
                    onChange={(e) => setCtaButtonLink(e.target.value)}
                    placeholder="e.g. /concierge"
                    required
                    className="w-full px-4 py-2.5 bg-sand/20 border border-navy/15 rounded-card text-sm text-navy focus:outline-none focus:border-rust"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-navy/10 flex items-center justify-between">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-navy hover:bg-navy-light text-white text-xs font-semibold uppercase tracking-wider rounded-pill transition-all disabled:opacity-50 shadow-sm flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Publishing Changes...</span>
                </>
              ) : (
                <span>Publish to Live /about Page</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
