"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { t } = useLanguage();
    const { items, updateQuantity, removeItem, totalDzd, totalItems } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 z-[100] w-full sm:w-[450px] bg-white dark:bg-[#0d1b1b] shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-[#0d1b1b]/50 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <ShoppingBag className="w-5 h-5 text-slate-800 dark:text-white" />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[10px] font-bold text-white">
                                            {totalItems}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Mon Panier
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                                aria-label="Fermer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-slate-50/50 dark:bg-[#0d1b1b]">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <ShoppingBag className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Votre panier est vide</h3>
                                        <p className="text-slate-500 max-w-[250px] mx-auto">
                                            Découvrez nos collections exceptionnelles et ajoutez des articles à votre panier.
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
                                    >
                                        Continuer mes achats
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 flex flex-col">
                                    {items.map((item) => (
                                        <div
                                            key={`${item.productId}-${item.variantId ?? ""}`}
                                            className="group flex gap-4 p-4 rounded-xl bg-white dark:bg-[#102222] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-[var(--primary)]/30"
                                        >
                                            {/* Image */}
                                            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-[#0d1b1b]">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex flex-col flex-1 justify-between min-w-0 py-0.5">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="min-w-0">
                                                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                                                            {item.name}
                                                        </h4>
                                                        {item.variantLabel && (
                                                            <p className="text-xs text-slate-500 truncate mt-0.5">
                                                                {item.variantLabel}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.productId, item.variantId)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors p-1 -mr-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-1.5 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                                                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-6 text-center text-sm font-semibold text-slate-900 dark:text-white">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                                                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <span className="font-bold text-[var(--primary)] text-sm whitespace-nowrap">
                                                        {(item.price * item.quantity).toLocaleString("fr-DZ")} DA
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 bg-white dark:bg-[#0d1b1b] border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-500">Sous-total</span>
                                    <span className="font-bold text-lg text-slate-900 dark:text-white">
                                        {totalDzd.toLocaleString("fr-DZ")} DA
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mb-6 font-medium">
                                    Les frais de livraison sont calculés à l'étape du paiement.
                                </p>
                                <div className="grid gap-3">
                                    <Link
                                        href="/checkout"
                                        onClick={onClose}
                                        className="w-full py-4 px-6 rounded-xl bg-[var(--primary)] text-white font-bold text-center hover:bg-[var(--primary-hover)] hover:shadow-lg hover:shadow-[var(--primary)]/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        Commander <span className="opacity-75 font-normal">({totalDzd.toLocaleString("fr-DZ")} DA)</span>
                                    </Link>
                                    <Link
                                        href="/panier"
                                        onClick={onClose}
                                        className="w-full py-3 px-6 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-center hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                                    >
                                        Voir le panier détaillé
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
