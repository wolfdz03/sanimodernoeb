"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/app/actions/orders";
import { useLanguage } from "@/context/LanguageContext";
import type { OrderStatus } from "@/lib/types/database";
import { Ban, BadgeCheck, Clock3, PackageCheck, Truck } from "lucide-react";

const statusKeys: Record<
  OrderStatus,
  "dashboard_status_pending" | "dashboard_status_paid" | "dashboard_status_shipped" | "dashboard_status_delivered" | "dashboard_status_cancelled"
> = {
  pending: "dashboard_status_pending",
  paid: "dashboard_status_paid",
  shipped: "dashboard_status_shipped",
  delivered: "dashboard_status_delivered",
  cancelled: "dashboard_status_cancelled",
};

const hintKeys: Record<OrderStatus, "hint_status_pending" | "hint_status_paid" | "hint_status_shipped" | "hint_status_delivered" | "hint_status_cancelled"> = {
  pending: "hint_status_pending",
  paid: "hint_status_paid",
  shipped: "hint_status_shipped",
  delivered: "hint_status_delivered",
  cancelled: "hint_status_cancelled",
};

const flow: Array<{ status: OrderStatus; icon: typeof Clock3 }> = [
  { status: "pending", icon: Clock3 },
  { status: "paid", icon: BadgeCheck },
  { status: "shipped", icon: Truck },
  { status: "delivered", icon: PackageCheck },
];

interface UpdateOrderStatusProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function UpdateOrderStatus({
  orderId,
  currentStatus,
}: UpdateOrderStatusProps) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus: OrderStatus) {
    setLoading(true);
    const result = await updateOrderStatus(orderId, newStatus);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setStatus(newStatus);
    toast.success(t("dashboard_order_status_updated"));
  }

  const currentIndex = flow.findIndex((step) => step.status === status);
  const cancelled = status === "cancelled";

  return (
    <div aria-busy={loading}>
      <div className="relative space-y-1" role="group" aria-label={t("dashboard_order_status")}>
        {flow.map((step, index) => {
          const Icon = step.icon;
          const complete = !cancelled && currentIndex >= index;
          const current = status === step.status;
          return (
            <button
              key={step.status}
              type="button"
              title={t(hintKeys[step.status])}
              onClick={() => handleChange(step.status)}
              disabled={loading || current}
              aria-pressed={current}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors disabled:cursor-default ${current ? "bg-red-50" : "hover:bg-[#faf7f8]"}`}
            >
              {index < flow.length - 1 && <span className={`absolute left-[1.47rem] top-9 h-5 w-px ${complete && currentIndex > index ? "bg-[var(--dash-primary)]" : "bg-[var(--dash-border)]"}`} />}
              <span className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${complete ? "border-[var(--dash-primary)] bg-[var(--dash-primary)] text-white" : "border-[var(--dash-border)] bg-white text-[var(--dash-text-muted)]"}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="flex-1">
                <span className={`block text-sm font-semibold ${complete ? "text-[var(--dash-text-main)]" : "text-[var(--dash-text-muted)]"}`}>{t(statusKeys[step.status])}</span>
                {current && <span className="block text-[11px] font-medium text-[var(--dash-primary)]">Étape actuelle</span>}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        title={t(hintKeys.cancelled)}
        onClick={() => handleChange("cancelled")}
        disabled={loading || cancelled}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold ${cancelled ? "border-gray-300 bg-gray-100 text-gray-600" : "border-red-200 text-red-600 hover:bg-red-50"}`}
      >
        <Ban className="h-4 w-4" />
        {cancelled ? "Commande annulée" : "Annuler la commande"}
      </button>
    </div>
  );
}
