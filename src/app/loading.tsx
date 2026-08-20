export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-soft"></div>
        <div className="absolute inset-0 rounded-full border-4 border-emerald-teal border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-emerald-deep font-semibold animate-pulse">Loading...</p>
    </div>
  );
}
