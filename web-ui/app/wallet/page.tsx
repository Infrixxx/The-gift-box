"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "../config";

interface Coupon {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: string;
  is_redeemed: number;
  redeemed_at: string | null;
}

export default function CouponWalletPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/coupons`);
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const confirmRedeem = async () => {
    if (!selectedCoupon) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/coupons/${selectedCoupon.id}/redeem`,
        { method: "POST" }
      );
      if (res.ok) {
        const result = await res.json();
        setToastMessage(`🎉 Redeemed: "${result.title}"! Notification sent.`);
        setSelectedCoupon(null);
        fetchCoupons();
        setTimeout(() => setToastMessage(null), 4500);
      }
    } catch (error) {
      console.error("Error redeeming coupon:", error);
    }
  };

  const handleResetAll = async () => {
    await fetch(`${API_BASE_URL}/api/coupons/reset`, { method: "POST" });
    fetchCoupons();
  };

  const availableCount = coupons.filter((c) => !c.is_redeemed).length;

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white px-6 py-12 overflow-hidden">
      {/* Ambient Glows */}
      <div className="pointer-events-none fixed top-[-10%] right-[-10%] h-96 w-96 rounded-full bg-rose-600/15 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-rose-500/40 bg-zinc-900/95 px-6 py-4 text-sm font-medium text-rose-200 shadow-2xl backdrop-blur-md">
          {toastMessage}
        </div>
      )}

      <div className="relative mx-auto max-w-5xl">
        {/* Top Bar */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-400 backdrop-blur-md transition hover:border-rose-500/50 hover:text-white"
          >
            <span>←</span> Back to Gift Box
          </Link>

          {coupons.some((c) => c.is_redeemed) && (
            <button
              onClick={handleResetAll}
              className="text-xs text-zinc-500 underline-offset-4 hover:text-rose-400 hover:underline transition"
            >
              Reset Wallet (Dev Test)
            </button>
          )}
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-medium tracking-wider text-amber-300 uppercase mb-4">
            VIP Access Pass
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-rose-100 to-amber-200 bg-clip-text text-transparent mb-3">
            The Digital Coupon Wallet
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            Redeem any voucher below whenever you want. Once claimed, it stamps as used and notifies me immediately.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-1.5 text-xs text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {availableCount} of {coupons.length} Vouchers Available
          </div>
        </div>

        {/* Tickets Grid */}
        {loading ? (
          <p className="text-center text-zinc-500 py-12">Loading your wallet...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons.map((coupon) => {
              const redeemed = Boolean(coupon.is_redeemed);

              return (
                <div
                  key={coupon.id}
                  className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 ${
                    redeemed
                      ? "border-zinc-800/60 bg-zinc-900/30 opacity-60"
                      : "border-zinc-800 bg-zinc-900/80 hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-500/10"
                  }`}
                >
                  {/* Ticket Notch Cutouts */}
                  <div className="pointer-events-none absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full border border-zinc-800 bg-zinc-950" />
                  <div className="pointer-events-none absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full border border-zinc-800 bg-zinc-950" />

                  {/* Top Portion of Ticket */}
                  <div className="p-6 pb-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <span className="inline-block rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-rose-300">
                        {coupon.category}
                      </span>
                      <span className="text-3xl">{coupon.icon}</span>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2">
                      {coupon.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      {coupon.description}
                    </p>
                  </div>

                  {/* Perforated Divider Line */}
                  <div className="mx-6 border-t-2 border-dashed border-zinc-800" />

                  {/* Bottom Action Stub */}
                  <div className="flex items-center justify-between px-6 py-4 bg-zinc-950/40">
                    <span className="text-xs text-zinc-500 font-mono">
                      NO. 00{coupon.id}-22ND
                    </span>

                    {redeemed ? (
                      <div className="flex items-center gap-2">
                        <span className="rounded border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-xs font-black uppercase tracking-widest text-red-400 -rotate-3">
                          ✓ Redeemed
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedCoupon(coupon)}
                        className="rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-rose-600/20 transition hover:from-rose-500 hover:to-pink-500 active:scale-95"
                      >
                        Redeem Pass
                      </button>
                    )}
                  </div>

                  {redeemed && coupon.redeemed_at && (
                    <div className="bg-zinc-950/80 px-6 py-1.5 text-right text-[11px] text-zinc-500">
                      Claimed on {coupon.redeemed_at}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-3xl">{selectedCoupon.icon}</span>
              <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-400">
                Confirm Redemption
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Redeem &ldquo;{selectedCoupon.title}&rdquo;?
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              Once you redeem this pass, it will be permanently stamped as used and a notification will be sent right away.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedCoupon(null)}
                className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700"
              >
                Save for Later
              </button>
              <button
                onClick={confirmRedeem}
                className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white transition hover:bg-rose-500"
              >
                Yes, Redeem Now!
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}