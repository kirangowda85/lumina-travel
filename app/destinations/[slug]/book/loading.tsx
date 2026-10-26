export default function Loading() {
  return (
    <div className="mx-auto grid max-w-6xl animate-pulse grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <div className="space-y-6">
        <div className="h-6 w-56 rounded bg-navy/10" />
        <div className="h-72 rounded-card bg-card ring-1 ring-navy/5" />
        <div className="h-24 rounded-card bg-card ring-1 ring-navy/5" />
        <div className="h-40 rounded-card bg-card ring-1 ring-navy/5" />
      </div>
      <div className="h-80 rounded-card bg-navy/10" />
    </div>
  );
}
