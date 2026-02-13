export default function CommandesLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        ))}
      </div>
      <div className="bg-white dark:bg-[#0d1b1b] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="h-14 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700" />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-16 border-b border-slate-100 dark:border-slate-800 flex gap-4 px-6 items-center">
            <div className="h-4 flex-1 max-w-[120px] bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 flex-1 max-w-[180px] bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
