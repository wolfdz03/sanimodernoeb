export default function AnalyticsLoading() {
    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-7 w-32 dash-skeleton" />
                    <div className="h-4 w-56 dash-skeleton" />
                </div>
                <div className="flex gap-2">
                    <div className="h-9 w-56 dash-skeleton rounded-lg" />
                    <div className="h-9 w-32 dash-skeleton rounded-lg" />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="dash-card p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="h-3 w-24 dash-skeleton" />
                            <div className="h-8 w-8 dash-skeleton rounded-lg" />
                        </div>
                        <div className="h-7 w-32 dash-skeleton" />
                        <div className="h-5 w-20 dash-skeleton rounded-full" />
                    </div>
                ))}
            </div>

            {/* Revenue Chart */}
            <div className="dash-card">
                <div className="flex items-center justify-between border-b border-[var(--dash-border)] px-6 py-4">
                    <div className="h-5 w-40 dash-skeleton" />
                    <div className="h-4 w-16 dash-skeleton" />
                </div>
                <div className="p-6">
                    <div className="h-64 dash-skeleton rounded-lg" />
                </div>
            </div>

            {/* Orders Chart */}
            <div className="dash-card">
                <div className="flex items-center justify-between border-b border-[var(--dash-border)] px-6 py-4">
                    <div className="h-5 w-44 dash-skeleton" />
                </div>
                <div className="p-6">
                    <div className="h-56 dash-skeleton rounded-lg" />
                </div>
            </div>

            {/* Middle row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="dash-card p-6 space-y-4">
                    <div className="h-5 w-40 dash-skeleton" />
                    <div className="flex items-center gap-6">
                        <div className="w-28 h-28 dash-skeleton rounded-full" />
                        <div className="space-y-3 flex-1">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-4 dash-skeleton" />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="dash-card p-6 space-y-4">
                    <div className="h-5 w-40 dash-skeleton" />
                    <div className="h-24 dash-skeleton rounded-lg" />
                    <div className="flex justify-between">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-3 w-6 dash-skeleton" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {[1, 2].map((i) => (
                    <div key={i} className="dash-card p-6 space-y-4">
                        <div className="h-5 w-48 dash-skeleton" />
                        {[1, 2, 3, 4, 5].map((j) => (
                            <div key={j} className="flex items-center gap-4">
                                <div className="h-4 w-5 dash-skeleton" />
                                <div className="h-4 w-24 dash-skeleton" />
                                <div className="h-3 flex-1 dash-skeleton rounded-full" />
                                <div className="h-4 w-20 dash-skeleton" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
