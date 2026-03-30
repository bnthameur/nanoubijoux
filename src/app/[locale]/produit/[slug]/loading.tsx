export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb strip */}
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="max-w-[1280px] mx-auto flex items-center gap-2">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left column — image gallery */}
          <div className="flex flex-col gap-3">
            {/* Main image */}
            <div className="aspect-square w-full bg-gray-200 rounded-2xl animate-pulse" />
            {/* Thumbnail row */}
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 w-16 flex-shrink-0 bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Right column — product info */}
          <div className="flex flex-col gap-5">
            {/* Badge */}
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
            {/* Title */}
            <div className="flex flex-col gap-2">
              <div className="h-8 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-8 w-1/2 bg-gray-200 rounded-lg animate-pulse" />
            </div>
            {/* Star rating */}
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
              ))}
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse ms-2" />
            </div>
            {/* Price */}
            <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse" />
            {/* Description lines */}
            <div className="flex flex-col gap-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
            </div>
            {/* Quantity + CTA */}
            <div className="flex items-center gap-3 mt-2">
              <div className="h-12 w-32 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-12 flex-1 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse" />
            </div>
            {/* Trust badges */}
            <div className="flex gap-4 mt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
