"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const PLAYLIST_PIN = "21102004";

export default function PlaylistPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unlocked = localStorage.getItem("giftbox_playlist_unlocked") === "true";
    setIsUnlocked(unlocked);
    setLoading(false);
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (pinInput.trim() === PLAYLIST_PIN) {
      localStorage.setItem("giftbox_playlist_unlocked", "true");
      setIsUnlocked(true);
    } else {
      setErrorMsg("Incorrect code. Enter your 8-digit birthday code (DDMMYYYY) from the hunt!");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">
        Loading soundtrack...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white px-6 py-12 overflow-hidden flex flex-col items-center justify-center">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed top-[-10%] left-[-10%] h-96 w-96 rounded-full bg-emerald-600/15 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-rose-600/15 blur-[140px]" />

      <div className="relative w-full max-w-3xl">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-400 backdrop-blur-md transition hover:border-emerald-500/50 hover:text-white"
          >
            <span>←</span> Back to Gift Box
          </Link>
          <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
            Final Birthday Gift
          </span>
        </div>

        {!isUnlocked ? (
          /* Locked State with PIN Prompt */
          <div className="mx-auto max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-4xl shadow-inner">
              🔒
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              Our Shared Soundtrack
            </h1>
            <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
              This special gift is locked. Enter the 8-digit birthday passcode revealed at the end of your Scavenger Hunt to unlock our playlist.
            </p>

            <form onSubmit={handleUnlock} className="space-y-4">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••••"
                maxLength={8}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-center text-2xl tracking-[0.4em] text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />

              {errorMsg && (
                <p className="text-xs font-semibold text-rose-400">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 font-bold text-white uppercase tracking-wider text-sm shadow-xl shadow-emerald-600/25 transition hover:from-emerald-500 hover:to-teal-500 active:scale-95"
              >
                Unlock Playlist 🎵
              </button>
            </form>

            <div className="mt-6 border-t border-zinc-800/80 pt-4">
              <Link
                href="/hunt"
                className="text-xs text-zinc-500 hover:text-emerald-400 underline underline-offset-4 transition"
              >
                Need the code? Complete the Scavenger Hunt →
              </Link>
            </div>
          </div>
        ) : (
          /* Unlocked State: Full Aesthetic Spotify Player */
          <div className="space-y-8 animate-fadeIn">
            {/* Header Card */}
            <div className="text-center">
              <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-medium tracking-wider text-emerald-300 uppercase mb-3">
                ✨ Special Birthday Gift Unlocked ✨
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent mb-3">
                Our Soundtrack &amp; Playlist
              </h1>
              <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                The songs that soundtracked our gaming nights, late drives, Durban sunsets, and every quiet moment in between.
              </p>
            </div>

            {/* Embedded Spotify Player Card */}
            <div className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-zinc-900/90 p-6 md:p-8 shadow-2xl backdrop-blur-md">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-xl text-emerald-300">
                    🎵
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">Curated Spotify Mix</h3>
                    <p className="text-xs text-zinc-400">Play directly or open in Spotify</p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-300">
                  Always Available
                </span>
              </div>

              {/* Spotify Iframe */}
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <iframe
                  data-testid="embed-iframe"
                  style={{ borderRadius: "16px" }}
                  src="https://open.spotify.com/embed/playlist/4EIQCvIxHBqctHe4pXWyRl?utm_source=generator&si=0a77b5fd562d448d"
                  width="100%"
                  height="380"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Dedication Note */}
              <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 text-center">
                <p className="font-serif italic text-sm text-zinc-300 leading-relaxed">
                  &ldquo;Wherever life takes us, press play and remember how much you mean to me.&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
