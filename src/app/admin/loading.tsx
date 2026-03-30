// Stat card skeleton for the dashboard KPI row
function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
        <div className="h-9 w-9 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

// Row skeleton for the recent orders table
function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100">
      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 flex-1 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin top header bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="h-7 w-40 bg-gray-200 rounded-lg animate-pulse" />
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 min-h-screen px-3 py-6 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2">
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse flex-shrink-0" />
              <div className="h-4 flex-1 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-6 flex flex-col gap-6">
          {/* Page title */}
          <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse" />

          {/* KPI stat cards row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>

          {/* Recent orders panel */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-4" />

            {/* Table header */}
            <div className="flex items-center gap-4 pb-2 border-b border-gray-200">
              {['w-20', 'flex-1', 'w-24', 'w-20', 'w-16'].map((w, i) => (
                <div key={i} className={`h-4 ${w} bg-gray-200 rounded animate-pulse`} />
              ))}
            </div>

            {/* Order rows */}
            {Array.from({ length: 6 }).map((_, i) => (
              <OrderRowSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
