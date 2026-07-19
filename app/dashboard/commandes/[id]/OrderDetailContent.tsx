"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  Copy,
  CreditCard,
  ExternalLink,
  Hash,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Printer,
  ReceiptText,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { UpdateOrderStatus } from "./UpdateOrderStatus";
import type { OrderStatus } from "@/lib/types/database";

interface OrderDetailContentProps {
  order: {
    id: string;
    status: string;
    total_dzd: number;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_email?: string | null;
    shipping_wilaya?: string | null;
    shipping_city?: string | null;
    shipping_cost_dzd: number;
    created_at: string;
    user_id?: string | null;
  };
  items: Array<{
    id: string;
    product_name: string;
    quantity: number;
    unit_price_dzd: number;
    variant_label?: string | null;
    product_id?: string | null;
    variant_id?: string | null;
    product_slug?: string | null;
    image_url?: string | null;
  }>;
  customerStats?: {
    totalOrders: number;
    ltv: number;
    otherOrderIds: string[];
  };
}

const statusLabels: Record<OrderStatus, string> = {
  pending: "En attente",
  paid: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const statusClasses: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  paid: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-violet-50 text-violet-700 border-violet-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
};

function formatPhoneForWhatsApp(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? `213${digits.slice(1)}` : digits;
}

export function OrderDetailContent({ order, items, customerStats }: OrderDetailContentProps) {
  const { t } = useLanguage();
  const status = order.status as OrderStatus;
  const reference = order.id.slice(-8).toUpperCase();
  const subtotal = items.reduce(
    (sum, item) => sum + item.unit_price_dzd * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const fullAddress = [
    order.shipping_address,
    order.shipping_city,
    order.shipping_wilaya,
  ]
    .filter(Boolean)
    .join(", ");
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const whatsappHref = `https://wa.me/${formatPhoneForWhatsApp(order.shipping_phone)}`;

  const copyReference = async () => {
    await navigator.clipboard.writeText(order.id);
    toast.success("Référence copiée");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <Link
            href="/dashboard/commandes"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--dash-text-muted)] hover:text-[var(--dash-primary)]"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("dashboard_order_back")}
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--dash-text-main)]">
              Commande #{reference}
            </h1>
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${statusClasses[status]}`}>
              {statusLabels[status]}
            </span>
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--dash-text-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {new Date(order.created_at).toLocaleString("fr-DZ", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </span>
            <span className="text-[#d3c7ca]">•</span>
            <button type="button" onClick={copyReference} className="inline-flex items-center gap-1.5 hover:text-[var(--dash-primary)]">
              <Hash className="h-4 w-4" />
              {order.id}
              <Copy className="h-3.5 w-3.5" />
            </button>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => window.print()} className="dash-btn dash-btn-secondary">
            <Printer className="h-4 w-4" /> Imprimer
          </button>
          <a href={`tel:${order.shipping_phone.replace(/\s/g, "")}`} className="dash-btn dash-btn-primary">
            <Phone className="h-4 w-4" /> Appeler le client
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={ReceiptText} label="Total commande" value={`${order.total_dzd.toLocaleString("fr-DZ")} DA`} accent />
        <SummaryCard icon={ShoppingBag} label="Articles" value={`${itemCount}`} detail={`${items.length} ligne${items.length > 1 ? "s" : ""}`} />
        <SummaryCard icon={Truck} label="Frais de livraison" value={`${order.shipping_cost_dzd.toLocaleString("fr-DZ")} DA`} />
        <SummaryCard icon={UserRound} label="Historique client" value={`${customerStats?.totalOrders ?? 1} commande${(customerStats?.totalOrders ?? 1) > 1 ? "s" : ""}`} detail={`${(customerStats?.ltv ?? order.total_dzd).toLocaleString("fr-DZ")} DA de valeur`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,.75fr)]">
        <div className="space-y-6">
          <section className="dash-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--dash-border)] px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-display text-base font-semibold text-[var(--dash-text-main)]">Articles commandés</h2>
                <p className="mt-0.5 text-xs text-[var(--dash-text-muted)]">Produits, variantes, quantités et prix enregistrés</p>
              </div>
              <Package className="h-5 w-5 text-[var(--dash-primary)]" />
            </div>
            <div className="divide-y divide-[var(--dash-border)]">
              {items.map((item) => {
                const content = (
                  <>
                    <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[var(--dash-border)] bg-[#faf7f8]">
                      <Image
                        src={item.image_url || "/placeholder-product.png"}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-200 group-hover/item:scale-105"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold leading-5 text-[var(--dash-text-main)]">{item.product_name}</span>
                      {item.variant_label && (
                        <span className="mt-1 block text-sm text-[var(--dash-text-muted)]">Variante: {item.variant_label}</span>
                      )}
                      <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--dash-text-muted)]">
                        <span>Qté: <strong className="text-[var(--dash-text-main)]">{item.quantity}</strong></span>
                        <span>Prix unitaire: <strong className="text-[var(--dash-text-main)]">{item.unit_price_dzd.toLocaleString("fr-DZ")} DA</strong></span>
                        {item.variant_id && <span>ID variante: {item.variant_id.slice(-6).toUpperCase()}</span>}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block font-display text-base font-semibold text-[var(--dash-text-main)]">
                        {(item.unit_price_dzd * item.quantity).toLocaleString("fr-DZ")} DA
                      </span>
                      {item.product_slug && <ExternalLink className="mt-2 ml-auto h-4 w-4 text-[var(--dash-text-muted)] transition-colors group-hover/item:text-[var(--dash-primary)]" />}
                    </span>
                  </>
                );

                return item.product_slug ? (
                  <Link key={item.id} href={`/produit/${item.product_slug}`} target="_blank" className="group/item flex items-center gap-4 p-5 hover:bg-[#fcf9fa] sm:p-6">
                    {content}
                  </Link>
                ) : (
                  <div key={item.id} className="flex items-center gap-4 p-5 sm:p-6">{content}</div>
                );
              })}
            </div>
          </section>

          <section className="dash-card p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[var(--dash-primary)]"><CreditCard className="h-5 w-5" /></span>
              <div>
                <h2 className="font-display font-semibold text-[var(--dash-text-main)]">Récapitulatif financier</h2>
                <p className="text-xs text-[var(--dash-text-muted)]">Paiement à la livraison</p>
              </div>
            </div>
            <dl className="ml-auto max-w-md space-y-3 text-sm">
              <div className="flex justify-between gap-6 text-[var(--dash-text-muted)]"><dt>Sous-total produits</dt><dd className="font-medium text-[var(--dash-text-main)]">{subtotal.toLocaleString("fr-DZ")} DA</dd></div>
              <div className="flex justify-between gap-6 text-[var(--dash-text-muted)]"><dt>Livraison</dt><dd className="font-medium text-[var(--dash-text-main)]">{order.shipping_cost_dzd.toLocaleString("fr-DZ")} DA</dd></div>
              <div className="flex justify-between gap-6 border-t border-[var(--dash-border)] pt-4"><dt className="font-semibold">Total à encaisser</dt><dd className="font-display text-xl font-semibold text-[var(--dash-primary)]">{order.total_dzd.toLocaleString("fr-DZ")} DA</dd></div>
            </dl>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="dash-card p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[var(--dash-primary)]"><Truck className="h-5 w-5" /></span>
              <div><h2 className="font-display font-semibold">Traitement de la commande</h2><p className="text-xs text-[var(--dash-text-muted)]">Mettez à jour l’avancement réel</p></div>
            </div>
            <UpdateOrderStatus orderId={order.id} currentStatus={status} />
          </section>

          <section className="dash-card overflow-hidden">
            <div className="border-b border-[var(--dash-border)] px-5 py-4">
              <h2 className="font-display font-semibold">Client et livraison</h2>
            </div>
            <div className="space-y-5 p-5">
              <div className="flex items-start gap-3">
                <UserRound className="mt-0.5 h-4 w-4 text-[var(--dash-primary)]" />
                <div><p className="font-semibold text-[var(--dash-text-main)]">{order.shipping_name}</p><p className="text-xs text-[var(--dash-text-muted)]">{order.user_id ? "Client avec compte" : "Commande invité"}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--dash-primary)]" />
                <div><p className="text-sm leading-6 text-[var(--dash-text-main)]">{fullAddress}</p><a href={mapHref} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[var(--dash-primary)] hover:underline">Ouvrir dans Maps <ExternalLink className="h-3 w-3" /></a></div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                <a href={`tel:${order.shipping_phone.replace(/\s/g, "")}`} className="dash-btn dash-btn-secondary justify-start"><Phone className="h-4 w-4 text-[var(--dash-primary)]" />{order.shipping_phone}</a>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="dash-btn dash-btn-secondary justify-start"><MessageCircle className="h-4 w-4 text-[var(--dash-primary)]" />WhatsApp</a>
                {order.shipping_email && <a href={`mailto:${order.shipping_email}`} className="dash-btn dash-btn-secondary justify-start sm:col-span-2 xl:col-span-1"><Mail className="h-4 w-4 text-[var(--dash-primary)]" /><span className="truncate">{order.shipping_email}</span></a>}
              </div>
            </div>
          </section>

          {customerStats && (
            <section className="dash-card p-5">
              <h2 className="font-display font-semibold">Profil client</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[var(--dash-border)] bg-[#faf8f9] p-3"><span className="block text-xs text-[var(--dash-text-muted)]">Commandes</span><strong className="mt-1 block font-display text-xl">{customerStats.totalOrders}</strong></div>
                <div className="rounded-xl border border-[var(--dash-border)] bg-[#faf8f9] p-3"><span className="block text-xs text-[var(--dash-text-muted)]">Valeur totale</span><strong className="mt-1 block font-display text-base text-[var(--dash-primary)]">{customerStats.ltv.toLocaleString("fr-DZ")} DA</strong></div>
              </div>
              {customerStats.otherOrderIds.length > 0 && (
                <div className="mt-4 border-t border-[var(--dash-border)] pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--dash-text-muted)]">Autres commandes</p>
                  <div className="flex flex-wrap gap-2">{customerStats.otherOrderIds.map((id) => <Link key={id} href={`/dashboard/commandes/${id}`} className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-[var(--dash-primary)] hover:bg-red-100">#{id.slice(-8).toUpperCase()}</Link>)}</div>
                </div>
              )}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, detail, accent = false }: { icon: typeof ReceiptText; label: string; value: string; detail?: string; accent?: boolean }) {
  return (
    <div className={`dash-card flex items-center gap-4 p-4 sm:p-5 ${accent ? "border-l-4 !border-l-[var(--dash-primary)]" : ""}`}>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent ? "bg-[var(--dash-primary)] text-white" : "bg-[#faf4f5] text-[var(--dash-primary)]"}`}><Icon className="h-5 w-5" /></span>
      <span className="min-w-0"><span className="block text-xs font-medium text-[var(--dash-text-muted)]">{label}</span><strong className="mt-1 block truncate font-display text-lg font-semibold text-[var(--dash-text-main)]">{value}</strong>{detail && <span className="block text-[11px] text-[var(--dash-text-muted)]">{detail}</span>}</span>
    </div>
  );
}
