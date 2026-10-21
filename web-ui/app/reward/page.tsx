"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const PLAYLIST_CODE = "21102004";

export default function RewardPage() {
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    // Mark hunt as completed in local storage
    if (typeof window !== "undefined") {
      localStorage.setItem("giftbox_hunt_completed", "true");
    }
  }, []);

  const handleCopyCode = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(PLAYLIST_CODE);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white px-6 py-12 overflow-hidden flex flex-col items-center justify-center">
      {/* Ambient Glows */}
      <div className="pointer-events-none fixed top-[-10%] left-[-10%] h-96 w-96 rounded-full bg-amber-500/15 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-emerald-600/15 blur-[140px]" />

      <div className="relative w-full max-w-2xl space-y-8 text-center animate-fadeIn">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/tribute"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-400 backdrop-blur-md transition hover:border-amber-500/50 hover:text-white"
          >
            <span>←</span> Back to Poem &amp; Video
          </Link>
          <span className="text-xs text-amber-300 uppercase tracking-widest font-semibold border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 rounded-full">
            Final Coordinate Unlocked
          </span>
        </div>

        {/* Celebratory Icon Animation */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400/20 via-rose-500/20 to-emerald-400/20 border-2 border-amber-400/50 text-5xl shadow-2xl shadow-amber-500/20 animate-bounce">
          🔓
        </div>

        <div>
          <span className="inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-amber-300 mb-3">
            ✨ Scavenger Hunt Completed ✨
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-amber-100 to-emerald-200 bg-clip-text text-transparent">
            Here&apos;s the Code to Your Final Gift!
          </h1>
          <p className="text-sm md:text-base text-zinc-300 max-w-xl mx-auto mt-3 leading-relaxed">
            You solved every clue from our journey. Use this secret passcode to unlock the brand-new <strong className="text-emerald-300">Our Soundtrack</strong> tab on your Gift Box dashboard.
          </p>
        </div>

        {/* Passcode Showcase Card */}
        <div className="mx-auto max-w-md rounded-3xl border border-amber-400/50 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-amber-500/10">
          <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2 font-semibold">
            Secret Passcode
          </p>
          <div className="font-mono text-4xl md:text-5xl font-black tracking-[0.25em] bg-gradient-to-r from-amber-200 via-rose-200 to-emerald-200 bg-clip-text text-transparent my-3">
            {PLAYLIST_CODE}
          </div>
          <p className="text-xs text-zinc-500 mb-6">
            Your special day • 21 October 2004
          </p>

          <button
            onClick={handleCopyCode}
            className="w-full rounded-xl border border-amber-400/40 bg-amber-400/10 py-3.5 text-sm font-bold text-amber-200 transition hover:bg-amber-400/20 active:scale-95"
          >
            {copiedCode ? "✓ Copied to Clipboard!" : "📋 Copy Code"}
          </button>
        </div>

        {/* Redirection Options */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/playlist"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-white shadow-xl shadow-emerald-600/30 transition hover:scale-105 active:scale-95"
          >
            <span>🎵</span> Enter Code &amp; Open Playlist →
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-4 text-sm font-bold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            <span>🏠</span> Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
