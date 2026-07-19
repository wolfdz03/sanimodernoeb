"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, Eye } from "lucide-react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/app/actions/orders";
import { useLanguage } from "@/context/LanguageContext";

interface MarkShippedButtonProps {
  orderId: string;
  variant?: "shipped" | "detail";
}

export function MarkShippedButton({
  orderId,
  variant = "shipped",
}: MarkShippedButtonProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleMarkShipped() {
    setLoading(true);
    const result = await updateOrderStatus(orderId, "shipped");
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(t("dashboard_order_status_updated"));
    router.refresh();
  }

  if (variant === "detail") {
    return (
      <a
        href={`/dashboard/commandes/${orderId}`}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[var(--dash-border)] bg-white px-2 py-2 text-[var(--dash-text-muted)] transition-all hover:border-gray-400 hover:text-[var(--dash-text-main)] sm:opacity-0 sm:group-hover:opacity-100"
        title={t("dashboard_detail")}
      >
        <Eye className="h-5 w-5" />
        <span className="ml-2 hidden text-sm font-medium sm:block">
          {t("dashboard_detail")}
        </span>
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={handleMarkShipped}
      disabled={loading}
      title={t("dashboard_orders_mark_shipped")}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[var(--dash-border)] bg-white px-2 py-2 text-[var(--dash-text-muted)] transition-all hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary)]/5 hover:text-[var(--dash-primary)] disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
    >
      <Truck className="h-5 w-5" />
      <span className="ml-2 hidden text-sm font-medium sm:inline">
        {t("dashboard_orders_mark_shipped")}
      </span>
    </button>
  );
}
