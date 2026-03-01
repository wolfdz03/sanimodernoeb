import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/service";
import { AnalyticsContent } from "./AnalyticsContent";

export const dynamic = "force-dynamic";

function toDateStr(d: Date) {
    return d.toISOString().slice(0, 10);
}

export default async function AnalyticsPage() {
    await requireAdmin();
    const supabase = createServiceClient();

    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
        { data: allOrders },
        { data: orderItems },
        { data: products },
    ] = await Promise.all([
        supabase
            .from("orders")
            .select("id, total_dzd, status, shipping_wilaya, shipping_name, created_at")
            .gte("created_at", `${toDateStr(thirtyDaysAgo)}T00:00:00Z`)
            .order("created_at", { ascending: true }),
        supabase
            .from("order_items")
            .select("order_id, product_name, quantity, unit_price_dzd, variant_label, created_at")
            .gte("created_at", `${toDateStr(thirtyDaysAgo)}T00:00:00Z`),
        supabase
            .from("products")
            .select("id, name, stock, price_dzd, image_url, image_urls"),
    ]);

    // Build daily data for the last 30 days
    const dailyData: {
        date: string;
        revenue: number;
        orders: number;
        label: string;
    }[] = [];

    const dayLabels = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = toDateStr(d);
        const dayOrders = (allOrders ?? []).filter(
            (o) => o.created_at.startsWith(dateStr) && o.status !== "cancelled"
        );
        dailyData.push({
            date: dateStr,
            revenue: dayOrders.reduce((s, o) => s + (o.total_dzd ?? 0), 0),
            orders: dayOrders.length,
            label: dayLabels[d.getDay()],
        });
    }

    // Status breakdown
    const statusCounts: Record<string, number> = {};
    (allOrders ?? []).forEach((o) => {
        statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
    });

    // Wilaya stats
    const wilayaSales: Record<string, { count: number; revenue: number }> = {};
    (allOrders ?? [])
        .filter((o) => o.status !== "cancelled")
        .forEach((o) => {
            const w = o.shipping_wilaya || "Inconnue";
            if (!wilayaSales[w]) wilayaSales[w] = { count: 0, revenue: 0 };
            wilayaSales[w].count++;
            wilayaSales[w].revenue += o.total_dzd ?? 0;
        });
    const topWilayasList = Object.entries(wilayaSales)
        .map(([wilaya, data]) => ({ wilaya, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

    // Top products by quantity sold
    const productSales: Record<string, { name: string; qty: number; revenue: number }> = {};
    (orderItems ?? []).forEach((item) => {
        const key = item.product_name;
        if (!productSales[key])
            productSales[key] = { name: key, qty: 0, revenue: 0 };
        productSales[key].qty += item.quantity;
        productSales[key].revenue += (item.unit_price_dzd ?? 0) * item.quantity;
    });
    const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

    // Hourly distribution
    const hourlyOrderCounts = new Array(24).fill(0);
    (allOrders ?? [])
        .filter((o) => o.status !== "cancelled")
        .forEach((o) => {
            const h = new Date(o.created_at).getHours();
            hourlyOrderCounts[h]++;
        });

    // Summary KPIs
    const validOrders = (allOrders ?? []).filter((o) => o.status !== "cancelled");
    const totalRevenue = validOrders.reduce((s, o) => s + (o.total_dzd ?? 0), 0);
    const totalOrders = validOrders.length;
    const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const cancelledCount = (allOrders ?? []).filter((o) => o.status === "cancelled").length;
    const cancelRate = (allOrders ?? []).length > 0
        ? Math.round((cancelledCount / (allOrders ?? []).length) * 100)
        : 0;

    // Low stock products
    const lowStockProducts = (products ?? [])
        .filter((p) => p.stock <= 5)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 8)
        .map((p) => ({
            id: p.id,
            name: p.name,
            stock: p.stock,
            price: p.price_dzd,
            image: p.image_urls?.[0] ?? p.image_url ?? null,
        }));

    return (
        <AnalyticsContent
            dailyData={dailyData}
            statusCounts={statusCounts}
            topWilayas={topWilayasList}
            topProducts={topProducts}
            hourlyDistribution={hourlyOrderCounts}
            totalRevenue={totalRevenue}
            totalOrders={totalOrders}
            aov={aov}
            cancelRate={cancelRate}
            lowStockProducts={lowStockProducts}
        />
    );
}
