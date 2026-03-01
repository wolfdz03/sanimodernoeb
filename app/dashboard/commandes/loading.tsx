export default function CommandesLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-44 dash-skeleton" />
          <div className="h-4 w-64 dash-skeleton" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 dash-skeleton rounded-lg" />
          <div className="h-9 w-32 dash-skeleton rounded-lg" />
        </div>
      </div>

      {/* Tabs + search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1 bg-gray-100/80 rounded-lg p-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-20 dash-skeleton rounded-md" />
          ))}
        </div>
        <div className="h-9 w-56 dash-skeleton rounded-lg" />
      </div>

      {/* Order cards */}
      <div className="space-y-2.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="dash-card p-5 flex items-center gap-6">
            <div className="h-4 w-4 dash-skeleton rounded" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-4 w-16 dash-skeleton" />
                <div className="h-4 w-20 dash-skeleton" />
                <div className="h-5 w-16 dash-skeleton rounded-full" />
              </div>
              <div className="h-5 w-40 dash-skeleton" />
              <div className="h-3.5 w-56 dash-skeleton" />
            </div>
            <div className="space-y-2 flex flex-col items-end">
              <div className="h-5 w-24 dash-skeleton" />
              <div className="h-8 w-20 dash-skeleton rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
