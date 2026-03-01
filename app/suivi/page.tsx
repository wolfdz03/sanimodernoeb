"use client";

import { useState } from "react";
import { NavWithSettings } from "../components/NavWithSettings";
import { useLanguage } from "@/context/LanguageContext";
import { Search, Package, CheckCircle2, Clock, Truck, XCircle } from "lucide-react";
import { trackOrder } from "@/app/actions/orders";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

const STATUS_STEPS = [
    { id: "pending", label: "En attente", icon: Clock },
    { id: "paid", label: "Confirmée", icon: CheckCircle2 },
    { id: "shipped", label: "En expédition", icon: Truck },
    { id: "delivered", label: "Livrée", icon: Package },
];

export default function SuiviPage() {
    const { t } = useLanguage();
    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [order, setOrder] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) return;
        setLoading(true);
        setError(null);
        setOrder(null);
        const result = await trackOrder(orderId.trim());
        setLoading(false);
        if (result.error) {
            setError(result.error);
        } else if (result.order) {
            setOrder(result.order);
        }
    };

    const currentStatusIndex = STATUS_STEPS.findIndex(s => s.id === order?.status);
    const isCancelled = order?.status === "cancelled";

    return (
        <>
            <NavWithSettings />
            <main className="min-h-screen bg-slate-50 pt-32 pb-16 px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="font-bold text-3xl sm:text-4xl text-slate-900 mb-4">
                            Suivi de Commande
                        </h1>
                        <p className="text-slate-500">
                            Entrez votre numéro de commande pour suivre l'état de votre livraison.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-blue-600" />
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="EX: a1b2c3d4-..."
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all font-medium"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-4 rounded-2xl bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary-hover)] hover:shadow-lg hover:shadow-[var(--primary)]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {loading ? "Recherche..." : "Suivre"}
                            </button>
                        </form>
                        {error && (
                            <p className="mt-4 text-sm font-medium text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2">
                                <XCircle className="w-5 h-5 flex-shrink-0" /> {error}
                            </p>
                        )}
                    </div>

                    {order && (
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 overflow-hidden transform transition-all animate-in fade-in slide-in-from-bottom-8 duration-500">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                                <div>
                                    <h2 className="font-bold text-xl text-slate-900 mb-1">Détails de la commande</h2>
                                    <p className="text-sm font-medium text-slate-500">
                                        N° {order.id.split("-")[0].toUpperCase()} • {new Date(order.created_at).toLocaleDateString("fr-DZ")}
                                    </p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="text-sm text-slate-500 mb-1">Montant total</p>
                                    <p className="font-bold text-2xl text-[var(--primary)]">
                                        {order.total_dzd?.toLocaleString("fr-DZ")} DA
                                    </p>
                                </div>
                            </div>

                            <div className="py-8">
                                {isCancelled ? (
                                    <div className="flex flex-col items-center justify-center text-center p-6 bg-red-50 rounded-2xl border border-red-100">
                                        <XCircle className="w-12 h-12 text-red-500 mb-3" />
                                        <h3 className="font-bold text-lg text-red-900 mb-1">Commande Annulée</h3>
                                        <p className="text-red-700 text-sm">Cette commande a été annulée. Veuillez nous contacter pour plus d'informations.</p>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="absolute sm:top-5 left-8 sm:left-10 right-10 h-0.5 bg-slate-100 hidden sm:block" />
                                        <div className="absolute top-8 bottom-8 left-[31px] w-0.5 bg-slate-100 sm:hidden" />

                                        <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-2 relative z-10">
                                            {STATUS_STEPS.map((step, idx) => {
                                                const isCompleted = currentStatusIndex >= idx;
                                                const isCurrent = currentStatusIndex === idx;
                                                const Icon = step.icon;

                                                return (
                                                    <div key={step.id} className="flex sm:flex-col items-center gap-4 sm:gap-3 flex-1">
                                                        <div
                                                            className={`w-12 h-12 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 border-4 sm:border-[6px] border-white transition-all duration-500 ${isCompleted
                                                                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30"
                                                                    : "bg-slate-100 text-slate-400"
                                                                } ${isCurrent ? "ring-4 ring-[var(--primary)]/20 scale-110" : ""}`}
                                                        >
                                                            <Icon className="w-5 h-5 sm:w-4 sm:h-4" />
                                                        </div>
                                                        <div className="sm:text-center">
                                                            <p className={`font-bold sm:text-sm transition-colors ${isCompleted ? "text-slate-900" : "text-slate-400"
                                                                }`}>
                                                                {step.label}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4">Informations de livraison</h3>
                                <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-700 space-y-2">
                                    <p><span className="font-medium text-slate-500 mr-2">Nom :</span> {order.shipping_name}</p>
                                    <p><span className="font-medium text-slate-500 mr-2">Tél :</span> {order.shipping_phone}</p>
                                    <p><span className="font-medium text-slate-500 mr-2">Adresse :</span> {order.shipping_address}, {order.shipping_city} ({order.shipping_wilaya})</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
