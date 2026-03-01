export default function ProduitsLoading() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-7 w-36 dash-skeleton" />
        <div className="h-9 w-36 dash-skeleton rounded-lg" />
      </div>
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1 bg-gray-100/80 rounded-lg p-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-20 dash-skeleton rounded-md" />
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <div className="h-9 w-44 dash-skeleton rounded-lg" />
          <div className="h-9 w-32 dash-skeleton rounded-lg" />
        </div>
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="dash-card overflow-hidden">
            <div className="aspect-square dash-skeleton rounded-none" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-16 dash-skeleton" />
              <div className="h-4 w-full dash-skeleton" />
              <div className="flex justify-between">
                <div className="h-4 w-20 dash-skeleton" />
                <div className="h-3 w-12 dash-skeleton" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
