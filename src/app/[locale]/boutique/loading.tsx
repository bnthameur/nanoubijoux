// Product card skeleton used inside the grid
function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {/* Product image */}
      <div className="aspect-square w-full bg-gray-200 rounded-xl animate-pulse" />
      {/* Product name */}
      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
      {/* Sub-line (brand / category) */}
      <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
      {/* Price */}
      <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

export default function BoutiqueLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 px-4 py-8">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-3">
          <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-8">
        {/* Toolbar: filter toggle + sort selector skeletons */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 w-44 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* 3×3 product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
