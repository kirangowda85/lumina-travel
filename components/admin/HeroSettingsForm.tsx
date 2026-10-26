"use client";

import { useState, useTransition } from "react";
import { updateHeroSettings } from "@/lib/actions/admin";
import ImageKitUploader from "@/components/admin/ImageKitUploader";
import type { HeroSettings } from "@/types";


export default function HeroSettingsForm({ initial }: { initial: HeroSettings }) {
  const [badge, setBadge] = useState(initial.badge || "");
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [videoUrl, setVideoUrl] = useState(initial.videoUrl || "");
  const [imageUrl, setImageUrl] = useState(initial.imageUrl || "");
  
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const res = await updateHeroSettings({
        badge,
        title,
        description,
        videoUrl,
        imageUrl,
      });

      if (res.success) {
        setMessage({ type: "success", text: "Home page Hero video and content updated successfully!" });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to update hero settings." });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-card p-6 rounded-card border border-navy/10 shadow-sm">
      {message && (
        <div
          className={`p-4 rounded-card text-sm font-medium ${
            message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">
          Badge Subtitle
        </label>
        <input
          type="text"
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-card border border-navy/20 bg-page text-sm focus:outline-none focus:border-rust"
          placeholder="e.g. Four destinations, one standard of care"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">
          Hero Main Heading
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-card border border-navy/20 bg-page text-sm focus:outline-none focus:border-rust"
          placeholder="e.g. Curated Journeys, Perfectly Reserved"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">
          Hero Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-card border border-navy/20 bg-page text-sm focus:outline-none focus:border-rust"
          placeholder="Describe your luxury travel collection..."
        />
      </div>

      <div className="space-y-4 pt-2 border-t border-navy/10">

        <ImageKitUploader
          label="Upload Hero Video File (MP4 / WebM)"
          folder="/hero/videos"
          accept="video/*"
          multiple={false}
          currentUrls={videoUrl ? [videoUrl] : []}
          onChangeUrls={(urls) => setVideoUrl(urls[0] || "")}
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
            Or Paste Direct Video URL
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full px-4 py-2 rounded-card border border-navy/20 bg-page text-sm focus:outline-none focus:border-rust"
            placeholder="e.g. https://ik.imagekit.io/payana/video.mp4"
          />
        </div>
      </div>

      {videoUrl && (
        <div className="mt-4 rounded-card overflow-hidden border border-navy/10 bg-navy aspect-video relative">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src={videoUrl} type="video/mp4" />
          </video>
          <span className="absolute top-2 left-2 bg-navy/80 text-white text-[10px] px-2 py-1 rounded uppercase tracking-wider">Video Preview</span>
        </div>
      )}

      <div className="space-y-4 pt-4 border-t border-navy/10">
        <ImageKitUploader
          label="Upload Fallback Poster Image"
          folder="/hero/images"
          accept="image/*"
          multiple={false}
          currentUrls={imageUrl ? [imageUrl] : []}
          onChangeUrls={(urls) => setImageUrl(urls[0] || "")}
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
            Or Paste Direct Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-2 rounded-card border border-navy/20 bg-page text-sm focus:outline-none focus:border-rust"
            placeholder="e.g. https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          />
        </div>
      </div>


      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-pill bg-rust px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-rust-light disabled:opacity-50"
        >
          {isPending ? "Saving changes..." : "Save Hero Settings"}
        </button>
      </div>
    </form>
  );
}
