// Skeleton row representing one cart line item
function CartItemSkeleton() {
  return (
    <div className="flex items-center gap-4 py-5 border-b border-gray-100">
      {/* Product thumbnail */}
      <div className="h-20 w-20 flex-shrink-0 bg-gray-200 rounded-xl animate-pulse" />

      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {/* Product name */}
        <div className="h-5 w-3/5 bg-gray-200 rounded animate-pulse" />
        {/* Variant / SKU */}
        <div className="h-4 w-2/5 bg-gray-200 rounded animate-pulse" />
        {/* Price */}
        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mt-1" />
      </div>

      {/* Quantity stepper */}
      <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />

      {/* Remove button */}
      <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
    </div>
  );
}

export default function PanierLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-[1100px] mx-auto">
        {/* Page title */}
        <div className="h-8 w-36 bg-gray-200 rounded-lg animate-pulse mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items column */}
          <div className="lg:col-span-2 bg-white rounded-2xl px-6 shadow-sm">
            {Array.from({ length: 3 }).map((_, i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>

          {/* Order summary sidebar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4 h-fit">
            <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />

            {/* Coupon input */}
            <div className="flex gap-2">
              <div className="h-11 flex-1 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-11 w-20 bg-gray-200 rounded-lg animate-pulse" />
            </div>

            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex justify-between mt-1">
                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse mt-2" />
            {/* Continue shopping link */}
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
