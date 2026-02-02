"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/app/actions/orders";
import type { OrderStatus } from "@/lib/types/database";

interface UpdateOrderStatusProps {
  orderId: string;
  currentStatus: OrderStatus;
  statusLabels: Record<OrderStatus, string>;
}

export function UpdateOrderStatus({
  orderId,
  currentStatus,
  statusLabels,
}: UpdateOrderStatusProps) {
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
      {(Object.keys(statusLabels) as OrderStatus[]).map((s) => (
        <button
          key={s}
          onClick={() => handleChange(s)}
          disabled={loading || s === status}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
            s === status
              ? "bg-[#DC2626] text-white"
              : "bg-slate-100 text-[#64748B] hover:bg-slate-200"
          }`}
        >
          {statusLabels[s]}
        </button>
      ))}
    </div>
  );
}
