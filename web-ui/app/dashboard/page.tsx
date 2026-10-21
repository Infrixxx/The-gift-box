"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../config";

export default function Dashboard() {
  const router = useRouter();
  const [isPlaylistUnlocked, setIsPlaylistUnlocked] = useState(false);
  const [isHuntCompleted, setIsHuntCompleted] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    setIsPlaylistUnlocked(localStorage.getItem("giftbox_playlist_unlocked") === "true");
    setIsHuntCompleted(localStorage.getItem("giftbox_hunt_completed") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("giftbox_logged_in");
    router.push("/");
  };

  const handleResetForHer = async () => {
    const confirmed = window.confirm(
      "Reset all progress for her?\n\nThis will re-lock all Scavenger Hunt chapters, un-redeem all coupons, reset reasons cards, and lock the box so she starts completely fresh."
    );
    if (!confirmed) return;

    setIsResetting(true);
    try {
      await fetch(`${API_BASE_URL}/api/hunt/reset`, { method: "POST" });
      await fetch(`${API_BASE_URL}/api/coupons/reset`, { method: "POST" });
    } catch (e) {
      console.error("Reset error:", e);
    }

    localStorage.removeItem("unlocked_reasons");
    localStorage.removeItem("giftbox_playlist_unlocked");
    localStorage.removeItem("giftbox_hunt_completed");
    localStorage.removeItem("giftbox_logged_in");
    setIsResetting(false);
    router.push("/");
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6 md:p-12 bg-zinc-950 text-white overflow-hidden">
      {/* Ambient Glows */}
      <div className="pointer-events-none fixed top-[-10%] left-[-10%] h-96 w-96 rounded-full bg-rose-600/15 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-amber-500/15 blur-[140px]" />

      {/* Top Header Controls */}
      <div className="relative z-10 w-full max-w-6xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-zinc-400 font-medium">Session Active</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetForHer}
            disabled={isResetting}
            title="Reset all clues, cards, and coupons so she gets a clean experience"
            className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-xs text-zinc-400 hover:text-amber-300 hover:border-amber-500/40 transition backdrop-blur-sm disabled:opacity-50"
          >
            <span>{isResetting ? "⏳" : "✨"}</span>
            <span>{isResetting ? "Resetting..." : "Reset for Her"}</span>
          </button>
          <button
            onClick={handleLogout}
            title="Lock the app and return to the PIN screen"
            className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-xs text-zinc-400 hover:text-rose-400 hover:border-rose-500/40 transition backdrop-blur-sm"
          >
            <span>🔒</span>
            <span>Lock Box</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl text-center mb-10">
        <span className="inline-block rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1 text-xs font-semibold tracking-wider text-rose-300 uppercase mb-4">
          Happy 22nd Birthday, My Love
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-rose-100 to-amber-200 bg-clip-text text-transparent mb-3">
          The Gift Box
        </h1>
        <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
          Every chapter, card, and note here was crafted just for you. Select a gift below to begin.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {/* Card 1: 22 Reasons */}
        <Link 
          href="/reasons" 
          className="flex flex-col items-center p-8 bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-rose-500 hover:shadow-xl hover:shadow-rose-500/20 transition-all group backdrop-blur-sm"
        >
          <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">💌</span>
          <h2 className="text-xl font-bold mb-2">22 Reasons</h2>
          <p className="text-zinc-400 text-center text-xs leading-relaxed">Why I love you, one for every year.</p>
        </Link>

        {/* Card 2: Scavenger Hunt */}
        <Link 
          href="/hunt" 
          className="relative flex flex-col items-center p-8 bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-rose-500 hover:shadow-xl hover:shadow-rose-500/20 transition-all group backdrop-blur-sm"
        >
          {isHuntCompleted && (
            <span className="absolute top-3 right-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              Completed ✓
            </span>
          )}
          <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">🗺️</span>
          <h2 className="text-xl font-bold mb-2">Scavenger Hunt</h2>
          <p className="text-zinc-400 text-center text-xs leading-relaxed">
            Follow our 6 coordinates to unlock the story &amp; prizes.
          </p>
        </Link>

        {/* Card 3: Coupon Wallet */}
        <Link 
          href="/wallet" 
          className="flex flex-col items-center p-8 bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-rose-500 hover:shadow-xl hover:shadow-rose-500/20 transition-all group backdrop-blur-sm"
        >
          <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎟️</span>
          <h2 className="text-xl font-bold mb-2">Coupon Wallet</h2>
          <p className="text-zinc-400 text-center text-xs leading-relaxed">Redeem favors anytime. No questions asked.</p>
        </Link>

        {/* Card 4: Our Soundtrack / Playlist (Requires PIN from Hunt) */}
        <Link 
          href="/playlist" 
          className={`relative flex flex-col items-center p-8 bg-zinc-900/90 rounded-2xl border transition-all group backdrop-blur-sm ${
            isPlaylistUnlocked 
              ? "border-emerald-500/40 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/20" 
              : "border-zinc-800 hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-500/15"
          }`}
        >
          <span className={`absolute top-3 right-3 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            isPlaylistUnlocked
              ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
              : "bg-zinc-800 text-zinc-400 border border-zinc-700"
          }`}>
            {isPlaylistUnlocked ? "Unlocked ✨" : "Secret Gift 🔑"}
          </span>
          <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">
            {isPlaylistUnlocked ? "🎵" : "🔒"}
          </span>
          <h2 className="text-xl font-bold mb-2">Our Soundtrack</h2>
          <p className="text-zinc-400 text-center text-xs leading-relaxed">
            {isPlaylistUnlocked 
              ? "Our shared playlist on Spotify. Tap to listen anytime." 
              : "Unlock with your secret birthday passcode from the hunt."}
          </p>
        </Link>
      </div>
    </main>
  );
}