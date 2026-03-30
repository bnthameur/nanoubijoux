export default function SuiviLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-[720px] mx-auto flex flex-col gap-6">
        {/* Page heading */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-52 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Search input panel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-3">
            <div className="h-12 flex-1 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-12 w-28 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Status timeline card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          {/* Order meta header */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-7 w-24 bg-gray-200 rounded-full animate-pulse" />
          </div>

          {/* Timeline steps */}
          <div className="flex flex-col gap-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                {/* Circle + vertical line */}
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
                  {i < 3 && (
                    <div className="w-0.5 h-8 bg-gray-200 animate-pulse" />
                  )}
                </div>
                {/* Step label */}
                <div className="flex flex-col gap-1 pt-1 pb-6">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Order items list */}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-14 w-14 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
                <div className="flex flex-col gap-1 flex-1">
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
