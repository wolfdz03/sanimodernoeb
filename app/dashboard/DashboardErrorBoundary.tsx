"use client";

import React from "react";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class DashboardErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Dashboard error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <h1 className="text-xl font-bold text-[#1E293B] dark:text-white mb-2">
            Une erreur est survenue
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            Le tableau de bord a rencontré un problème. Rechargez la page ou retournez à l&apos;accueil.
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 rounded-xl bg-[#13ecec] text-[#102222] font-medium hover:bg-[#0ea5a5] transition-colors"
            >
              Réessayer
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              Tableau de bord
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
