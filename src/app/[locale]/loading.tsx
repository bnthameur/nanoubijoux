export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-4">
      {/* Brand wordmark skeleton */}
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-1 w-16 bg-gray-200 rounded-full animate-pulse" />
      </div>

      {/* Spinner using brand gold tone */}
      <div
        className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-[#C5912C] animate-spin"
        role="status"
        aria-label="جارٍ التحميل"
      />

      {/* Tagline skeleton */}
      <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}
