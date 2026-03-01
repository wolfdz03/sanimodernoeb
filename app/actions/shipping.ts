"use server";

import fs from "fs/promises";
import path from "path";
import { WILAYAS } from "@/lib/wilayas";

interface ShippingRates {
    [wilaya: string]: number;
}

const RATES_FILE = path.join(process.cwd(), "shipping-rates.json");

export async function getShippingRates(): Promise<ShippingRates> {
    try {
        const data = await fs.readFile(RATES_FILE, "utf-8");
        return JSON.parse(data);
    } catch (e) {
        // If file doesn't exist, return default 0 for all
        const defaults: ShippingRates = {};
        for (const w of WILAYAS) {
            defaults[w] = 0;
        }
        return defaults;
    }
}

export async function updateShippingRates(rates: ShippingRates) {
    try {
        await fs.writeFile(RATES_FILE, JSON.stringify(rates, null, 2));
        return { success: true };
    } catch (e: any) {
        return { error: e.message || "Impossible de sauvegarder les frais de livraison." };
    }
}
