"use server";

import { WILAYAS } from "@/lib/wilayas";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface ShippingRates {
    [wilaya: string]: number;
}

export async function getShippingRates(): Promise<ShippingRates> {
    const defaults: ShippingRates = Object.fromEntries(WILAYAS.map((wilaya) => [wilaya, 0]));
    try {
        const supabase = createServiceClient();
        const { data, error } = await supabase
            .from("site_settings")
            .select("shipping_rates")
            .eq("id", 1)
            .maybeSingle();
        if (error || !data?.shipping_rates || typeof data.shipping_rates !== "object") return defaults;
        for (const [wilaya, price] of Object.entries(data.shipping_rates as Record<string, unknown>)) {
            const amount = Number(price);
            if ((WILAYAS as readonly string[]).includes(wilaya) && Number.isFinite(amount) && amount >= 0) {
                defaults[wilaya] = Math.round(amount);
            }
        }
        return defaults;
    } catch {
        return defaults;
    }
}

export async function updateShippingRates(rates: ShippingRates) {
    await requireAdmin();
    const sanitized = Object.fromEntries(
        WILAYAS.map((wilaya) => [wilaya, Math.max(0, Math.round(Number(rates[wilaya]) || 0))])
    );
    const supabase = createServiceClient();
    const { error } = await supabase
        .from("site_settings")
        .upsert({ id: 1, shipping_rates: sanitized, updated_at: new Date().toISOString() });
    if (error) {
        return { error: error.message || "Impossible de sauvegarder les frais de livraison." };
    }
    revalidatePath("/checkout");
    revalidatePath("/dashboard/parametres");
    return { success: true };
}
