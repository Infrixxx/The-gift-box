"use client";

import Link from "next/link";

const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/hNyo35PfCso?si=FJ8KNwTDbWt4f-S2";

export default function TributePage() {
  return (
    <main className="relative min-h-screen bg-zinc-950 text-white px-6 py-12 overflow-hidden flex flex-col items-center">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed top-[-10%] left-[-10%] h-96 w-96 rounded-full bg-rose-600/15 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-amber-500/15 blur-[140px]" />

      <div className="relative w-full max-w-3xl space-y-10">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/hunt"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-400 backdrop-blur-md transition hover:border-rose-500/50 hover:text-white"
          >
            <span>←</span> Back to Story
          </Link>
          <span className="text-xs text-rose-300 uppercase tracking-widest font-semibold border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 rounded-full">
            Surprise Milestone
          </span>
        </div>

        {/* Closing Tribute Message Box */}
        <div className="rounded-3xl border border-rose-500/50 bg-gradient-to-br from-rose-950/80 via-zinc-900 to-amber-950/40 p-8 md:p-12 text-center shadow-2xl">
          <p className="text-2xl md:text-3xl font-serif italic font-bold leading-relaxed bg-gradient-to-r from-white via-rose-200 to-amber-200 bg-clip-text text-transparent">
            &ldquo;Thank you for loving me and for choosing me endlessly, happy birthday my love.&rdquo;
          </p>
        </div>

        {/* Embedded YouTube Player */}
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          <div className="aspect-video w-full">
            <iframe
              src={YOUTUBE_EMBED_URL}
              title="YouTube video player"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        {/* The Original Poem Artwork Card */}
        <div className="mx-auto w-full rounded-3xl border border-amber-200/30 bg-[#f4a97c] p-8 md:p-14 text-zinc-900 shadow-2xl">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-zinc-900 mb-1">
            If my heart could sing, would you listen?
          </h3>
          <p className="font-serif text-sm italic text-zinc-800 mb-8">
            By BC Rachoshi
          </p>

          <div className="space-y-6 font-serif text-base md:text-lg leading-relaxed text-zinc-900">
            <p>
              Losing my voice,<br />
              the moment I heard your voice,<br />
              From a simple hello,<br />
              That was meant for my ears,<br />
              Yet greeted my soul,<br />
              and awakened my heart
            </p>

            <p>
              Seeing the glistening touch,<br />
              Of the sun on the waters,<br />
              that were once cold<br />
              Like liquid gold, my blood flowed<br />
              My mind had company,<br />
              You moved in without notice
            </p>

            <p>
              With every beat, a million scenarios played<br />
              With every thought, I grew fonder<br />
              My heart&apos;s rhythm had changed<br />
              Into a melodic beat,<br />
              That my soul danced to,<br />
              Ever so elegantly, I felt it move<br />
              like an aurora in the sky?
            </p>

            <p>
              The divinity in what I felt,<br />
              made me believe in miracles<br />
              That I too have found favour within fate<br />
              like a child caressed with love
            </p>

            <p>
              How can you not hear this song,<br />
              How can you not feel the rhythm<br />
              When my heart sings so earnestly.<br />
              Surely you would listen.<br />
              If you knew it sang,<br />
              for you.
            </p>
          </div>
        </div>

        {/* Bottom Navigation leading to the Secret Code Page */}
        <div className="pt-6 pb-12 text-center">
          <Link
            href="/reward"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 px-10 py-5 text-base font-extrabold uppercase tracking-wider text-white shadow-2xl shadow-rose-600/30 transition hover:scale-105 active:scale-95"
          >
            <span>🎁</span> Reveal Final Secret Gift Code →
          </Link>
        </div>
      </div>
    </main>
  );
}
