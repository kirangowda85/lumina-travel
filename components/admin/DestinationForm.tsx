"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePackage } from "@/lib/actions/admin";
import ImageKitUploader from "@/components/admin/ImageKitUploader";
import type { Category, ItineraryDay, Package } from "@/types";


export default function DestinationForm({ initialPackage }: { initialPackage?: Package | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialPackage?.title || "");
  const [slug, setSlug] = useState(initialPackage?.slug || "");
  const [location, setLocation] = useState(initialPackage?.location || "");
  const [category, setCategory] = useState<Category>(initialPackage?.category || "Beach");
  const [description, setDescription] = useState(initialPackage?.description || "");
  const [basePrice, setBasePrice] = useState<number>(initialPackage ? initialPackage.basePrice / 100 : 2500);
  const [durationDays, setDurationDays] = useState<number>(initialPackage?.durationDays || 7);
  const [featured, setFeatured] = useState<boolean>(initialPackage?.featured || false);
  const [videoUrl, setVideoUrl] = useState<string>(initialPackage?.videoUrl || "");
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialPackage?.images && initialPackage.images.length > 0
      ? initialPackage.images
      : ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e"]
  );

  // Itinerary
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    initialPackage?.itinerary && initialPackage.itinerary.length > 0
      ? initialPackage.itinerary
      : [
          { day: 1, title: "Arrival & Welcome", description: "Arrive at destination and transfer to your luxury suite." },
          { day: 2, title: "Guided Exploration", description: "Private guided tour of the key highlights." },
        ]
  );

  // Room Options
  const [roomOptions, setRoomOptions] = useState<{ name: string; description: string; priceUpgrade: number }[]>(
    initialPackage?.roomOptions && initialPackage.roomOptions.length > 0
      ? initialPackage.roomOptions.map((r) => ({
          name: r.name,
          description: r.description,
          priceUpgrade: r.priceUpgrade / 100,
        }))
      : [
          { name: "Standard Luxury Suite", description: "Spacious suite with garden views", priceUpgrade: 0 },
          { name: "Oceanfront Deluxe Villa", description: "Private pool and unobstructed ocean views", priceUpgrade: 500 },
        ]
  );

  // Availability Dates (Admin manually adds dates; if empty, destination is 'Upcoming')
  const [availabilityDates, setAvailabilityDates] = useState<string[]>(
    initialPackage?.availability
      ? Array.from(new Set(initialPackage.availability.map((a) => a.date))).sort()
      : []
  );
  const [newDateInput, setNewDateInput] = useState<string>("");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialPackage) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleAddItineraryDay = () => {
    setItinerary((prev) => [
      ...prev,
      { day: prev.length + 1, title: "", description: "" },
    ]);
  };

  const handleRemoveItineraryDay = (index: number) => {
    setItinerary((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((day, i) => ({ ...day, day: i + 1 }))
    );
  };

  const handleAddRoomOption = () => {
    setRoomOptions((prev) => [
      ...prev,
      { name: "Premium Option", description: "Upgraded luxury features", priceUpgrade: 300 },
    ]);
  };

  const handleRemoveRoomOption = (index: number) => {
    setRoomOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddImageInput = () => {
    setImageUrls((prev) => [...prev, ""]);
  };

  const handleAddDate = () => {
    if (!newDateInput) return;
    if (!availabilityDates.includes(newDateInput)) {
      const next = [...availabilityDates, newDateInput].sort();
      setAvailabilityDates(next);
    }
    setNewDateInput("");
  };

  const handleRemoveDate = (dateToRemove: string) => {
    setAvailabilityDates((prev) => prev.filter((d) => d !== dateToRemove));
  };

  const handleClearAllDates = () => {
    setAvailabilityDates([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await savePackage({
        id: initialPackage?.id,
        title,
        slug,
        location,
        category,
        description,
        basePrice,
        durationDays,
        featured,
        images: imageUrls.filter((url) => url.trim().length > 0),
        videoUrl,
        itinerary,
        roomOptions,
        availabilityDates,
      });

      if (res.success) {
        router.push("/admin/destinations");
        router.refresh();
      } else {
        setError(res.error || "Failed to save destination.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && (
        <div className="p-4 rounded-card bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Section 1: Basic Info */}
      <div className="bg-card p-6 rounded-card border border-navy/10 shadow-sm space-y-6">
        <h2 className="font-serif text-xl font-semibold text-navy border-b border-navy/10 pb-3">Basic Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="e.g. Overwater Sanctuary"
              className="w-full px-4 py-2.5 rounded-card border border-navy/20 bg-page text-sm focus:outline-none focus:border-rust"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="e.g. overwater-sanctuary"
              className="w-full px-4 py-2.5 rounded-card border border-navy/20 bg-page text-sm focus:outline-none focus:border-rust"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="e.g. Maldives"
              className="w-full px-4 py-2.5 rounded-card border border-navy/20 bg-page text-sm focus:outline-none focus:border-rust"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-2.5 rounded-card border border-navy/20 bg-page text-sm focus:outline-none focus:border-rust"
            >
              <option value="Beach">Beach</option>
              <option value="Mountain">Mountain</option>
              <option value="Culture">Culture</option>
              <option value="Adventure">Adventure</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">Base Price (₹ INR)</label>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              required
              min={1}
              className="w-full px-4 py-2.5 rounded-card border border-navy/20 bg-page text-sm focus:outline-none focus:border-rust"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">Duration (Days)</label>
            <input
              type="number"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              required
              min={1}
              className="w-full px-4 py-2.5 rounded-card border border-navy/20 bg-page text-sm focus:outline-none focus:border-rust"
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-rust rounded border-navy/20 focus:ring-rust"
              />
              <span className="text-sm font-medium text-navy">Featured Journey</span>
            </label>
          </div>
        </div>


        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy mb-2">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Detailed journey description..."
            className="w-full px-4 py-2.5 rounded-card border border-navy/20 bg-page text-sm focus:outline-none focus:border-rust"
          />
        </div>
      </div>

      {/* Section 2: Departure Dates & Batches */}
      <div className="bg-card p-6 rounded-card border-2 border-rust/40 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-navy/10 pb-3 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <h2 className="font-serif text-xl font-semibold text-navy">Trip Departure Dates & Batches</h2>
            </div>
            <p className="text-xs text-muted mt-1">
              Add the exact departure dates for this trip. Only dates you add here will be open for bookings. If no dates are added, this trek will automatically display as <strong>Upcoming</strong>.
            </p>
          </div>
          {availabilityDates.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllDates}
              className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline w-fit"
            >
              Clear all dates (Set to Upcoming)
            </button>
          )}
        </div>

        {/* Date Picker Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-card bg-page border border-navy/10">
          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
              Select Trip Departure Date
            </label>
            <input
              type="date"
              value={newDateInput}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setNewDateInput(e.target.value)}
              className="w-full px-3 py-2.5 rounded-card border border-navy/20 bg-card text-sm focus:outline-none focus:border-rust text-navy font-medium"
            />
          </div>
          <button
            type="button"
            onClick={handleAddDate}
            disabled={!newDateInput}
            className="sm:self-end px-6 py-2.5 rounded-pill bg-rust text-white text-xs font-semibold hover:bg-rust-light disabled:opacity-40 transition-colors shadow-sm"
          >
            + Add Trip Date
          </button>
        </div>

        {/* Dates List */}
        {availabilityDates.length === 0 ? (
          <div className="p-6 rounded-card border border-dashed border-amber-300 bg-amber-50/60 text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-pill">
              ✨ Status: Upcoming Trip
            </span>
            <p className="text-sm font-semibold text-navy">
              No departure dates added yet.
            </p>
            <p className="text-xs text-muted max-w-md mx-auto">
              This destination will appear on the website marked as <strong>Upcoming</strong>. Travelers can explore the photos and day-by-day itinerary, and bookings will open only when you add trip dates above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted">
              <span className="font-semibold text-navy">{availabilityDates.length} Departure Date{availabilityDates.length !== 1 ? "s" : ""} Scheduled</span>
              <span>Trip Duration: {durationDays} Days / {Math.max(1, durationDays - 1)} Nights</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availabilityDates.map((dateStr) => {
                const startObj = new Date(dateStr + "T00:00:00");
                const returnObj = new Date(startObj);
                returnObj.setDate(returnObj.getDate() + durationDays);

                const startFormatted = startObj.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const returnFormatted = returnObj.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={dateStr}
                    className="p-3.5 rounded-card border border-navy/15 bg-page flex items-start justify-between gap-2 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-navy flex items-center gap-1.5">
                        <span className="text-rust">📅</span>
                        <span>{startFormatted}</span>
                      </div>
                      <div className="text-[11px] text-rust font-medium">➔ Return: {returnFormatted}</div>
                      <div className="text-[10px] text-muted">{durationDays} Days Duration</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDate(dateStr)}
                      className="text-xs text-muted hover:text-rose-600 p-1 font-bold"
                      title="Remove date"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Media & Video */}

      <div className="bg-card p-6 rounded-card border border-navy/10 shadow-sm space-y-6">
        <h2 className="font-serif text-xl font-semibold text-navy border-b border-navy/10 pb-3">Media & Video Uploads</h2>

        {/* Video Upload or URL */}
        <div className="space-y-3">
          <ImageKitUploader
            label="Upload Destination Video (MP4 / WebM)"
            folder="/destinations/videos"
            accept="video/*"
            multiple={false}
            currentUrls={videoUrl ? [videoUrl] : []}
            onChangeUrls={(urls) => setVideoUrl(urls[0] || "")}
          />
          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
              Or paste direct Video URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="e.g. https://ik.imagekit.io/payana/video.mp4"
              className="w-full px-4 py-2 rounded-card border border-navy/20 bg-page text-sm focus:outline-none focus:border-rust"
            />
          </div>
        </div>

        {/* Photo Uploads or URLs */}
        <div className="space-y-4 pt-4 border-t border-navy/10">
          <ImageKitUploader
            label="Upload Destination Photos (ImageKit)"
            folder="/destinations/images"
            accept="image/*"
            multiple={true}
            currentUrls={imageUrls.filter((u) => u.trim().length > 0)}
            onChangeUrls={(urls) => setImageUrls(urls)}
          />

          <div className="pt-2 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
              Or Edit Photo URLs Manually
            </label>
            {imageUrls.map((url, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    const next = [...imageUrls];
                    next[idx] = e.target.value;
                    setImageUrls(next);
                  }}
                  required={idx === 0}
                  placeholder={`Photo URL ${idx + 1}`}
                  className="flex-1 px-4 py-2 rounded-card border border-navy/20 bg-page text-sm focus:outline-none focus:border-rust"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                    className="px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 rounded-card hover:bg-rose-100"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImageInput}
              className="text-xs font-medium text-rust hover:underline"
            >
              + Add another photo URL manually
            </button>
          </div>
        </div>
      </div>


      {/* Section 3: Itinerary Days */}
      <div className="bg-card p-6 rounded-card border border-navy/10 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-navy/10 pb-3">
          <h2 className="font-serif text-xl font-semibold text-navy">Day-by-Day Itinerary</h2>
          <button
            type="button"
            onClick={handleAddItineraryDay}
            className="text-xs font-medium bg-navy/10 hover:bg-navy/20 text-navy px-3 py-1.5 rounded-pill transition-colors"
          >
            + Add Day
          </button>
        </div>

        <div className="space-y-4">
          {itinerary.map((day, idx) => (
            <div key={idx} className="p-4 rounded-card border border-navy/15 bg-page space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-rust">Day {day.day}</span>
                {itinerary.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItineraryDay(idx)}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Remove Day
                  </button>
                )}
              </div>
              <input
                type="text"
                value={day.title}
                onChange={(e) => {
                  const next = [...itinerary];
                  next[idx].title = e.target.value;
                  setItinerary(next);
                }}
                required
                placeholder="Day title (e.g. Arrival & Lagoon Transfer)"
                className="w-full px-3 py-2 rounded-card border border-navy/20 bg-card text-sm focus:outline-none focus:border-rust"
              />
              <textarea
                rows={2}
                value={day.description}
                onChange={(e) => {
                  const next = [...itinerary];
                  next[idx].description = e.target.value;
                  setItinerary(next);
                }}
                required
                placeholder="Activities and plan for this day..."
                className="w-full px-3 py-2 rounded-card border border-navy/20 bg-card text-sm focus:outline-none focus:border-rust"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Room Options */}
      <div className="bg-card p-6 rounded-card border border-navy/10 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-navy/10 pb-3">
          <h2 className="font-serif text-xl font-semibold text-navy">Room & Suite Options</h2>
          <button
            type="button"
            onClick={handleAddRoomOption}
            className="text-xs font-medium bg-navy/10 hover:bg-navy/20 text-navy px-3 py-1.5 rounded-pill transition-colors"
          >
            + Add Room Option
          </button>
        </div>

        <div className="space-y-4">
          {roomOptions.map((room, idx) => (
            <div key={idx} className="p-4 rounded-card border border-navy/15 bg-page space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-navy">Option #{idx + 1}</span>
                {roomOptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRoomOption(idx)}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Remove Option
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={room.name}
                  onChange={(e) => {
                    const next = [...roomOptions];
                    next[idx].name = e.target.value;
                    setRoomOptions(next);
                  }}
                  required
                  placeholder="Room Name (e.g. Deluxe Water Villa)"
                  className="w-full px-3 py-2 rounded-card border border-navy/20 bg-card text-sm focus:outline-none focus:border-rust"
                />
                <input
                  type="number"
                  value={room.priceUpgrade}
                  onChange={(e) => {
                    const next = [...roomOptions];
                    next[idx].priceUpgrade = Number(e.target.value);
                    setRoomOptions(next);
                  }}
                  required
                  placeholder="Upgrade Fee (₹ INR)"
                  className="w-full px-3 py-2 rounded-card border border-navy/20 bg-card text-sm focus:outline-none focus:border-rust"
                />
              </div>
              <input
                type="text"
                value={room.description}
                onChange={(e) => {
                  const next = [...roomOptions];
                  next[idx].description = e.target.value;
                  setRoomOptions(next);
                }}
                required
                placeholder="Room description and amenities..."
                className="w-full px-3 py-2 rounded-card border border-navy/20 bg-card text-sm focus:outline-none focus:border-rust"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-pill bg-rust px-8 py-3.5 text-sm font-medium text-white shadow-md transition-colors hover:bg-rust-light disabled:opacity-50"
        >
          {isPending ? "Saving Destination..." : initialPackage ? "Update Destination" : "Create Destination"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-pill border border-navy/20 px-6 py-3.5 text-sm font-medium text-navy hover:bg-navy/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
