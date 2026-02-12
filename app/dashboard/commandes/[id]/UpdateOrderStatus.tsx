"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/app/actions/orders";
import { useLanguage } from "@/context/LanguageContext";
import type { OrderStatus } from "@/lib/types/database";

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
    if (!result.error) setStatus(newStatus);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(statusKeys) as OrderStatus[]).map((s) => (
        <button
          key={s}
          onClick={() => handleChange(s)}
          disabled={loading || s === status}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
            s === status
              ? "bg-[#13ecec] text-[#102222]"
              : "bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          {t(statusKeys[s])}
        </button>
      ))}
    </div>
  );
}
