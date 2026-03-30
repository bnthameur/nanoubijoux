// Skeleton for a single form field label + input pair
function FieldSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      <div className={`h-11 ${wide ? 'w-full' : 'w-full'} bg-gray-200 rounded-lg animate-pulse`} />
    </div>
  );
}

export default function CommandeLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-[1100px] mx-auto">
        {/* Page title */}
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto mb-8" />

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse" />
              {i < 2 && <div className="h-1 w-12 bg-gray-200 rounded-full animate-pulse" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            {/* Section heading */}
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
              <div className="sm:col-span-2">
                <FieldSkeleton wide />
              </div>
            </div>

            {/* Shipping type selector skeleton */}
            <div className="flex gap-3 mt-2">
              <div className="h-16 flex-1 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-16 flex-1 bg-gray-200 rounded-xl animate-pulse" />
            </div>

            {/* Submit button */}
            <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse mt-2" />
          </div>

          {/* Order summary sidebar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4 h-fit">
            <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />

            {/* Cart item rows */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-14 w-14 flex-shrink-0 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex flex-col gap-1 flex-1">
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-5 w-14 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}

            <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex justify-between mt-1">
                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
