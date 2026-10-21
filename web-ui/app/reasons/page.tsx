"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Reason {
  id: number;
  category: "Romantic" | "Inside Joke" | "Appreciation";
  text: string;
}

const REASONS_DATA: Reason[] = [
  {
    id: 1,
    category: "Romantic",
    text: "You have the rarest, most luminous soul I have ever encountered. Simply being in your orbit makes the world feel softer, kinder, and infinitely more worth living in.",
  },
  {
    id: 2,
    category: "Appreciation",
    text: "Through every high, every pivot, and every quiet storm, you have never once let go of my hand. Knowing you are in my corner gives me the courage to face anything.",
  },
  {
    id: 3,
    category: "Inside Joke",
    text: "Our Call of Duty sessions, where your sweet, gentle demeanor completely vanishes the second we drop into a lobby and you turn into an absolute ruthless tactician.",
  },
  {
    id: 4,
    category: "Appreciation",
    text: "Your compassion isn't just something you do; it is who you are. You feel so deeply for others and carry a warmth that heals people without you even realizing it.",
  },
  {
    id: 5,
    category: "Inside Joke",
    text: "How fiercely competitive you are over literally everything. Whether it's a match, a debate, or a random challenge, you play to win and watching that fire in your eyes is my favorite spectacle.",
  },
  {
    id: 6,
    category: "Romantic",
    text: "There is a specific kind of peace we share where my whole nervous system just exhales. With you, I never have to put on armor or perform; I just get to be myself.",
  },
  {
    id: 7,
    category: "Inside Joke",
    text: "How you always have my six, both when we're clutching a final round in Call of Duty and when real life starts throwing grenades our way.",
  },
  {
    id: 8,
    category: "Appreciation",
    text: "You stood by me in seasons when I was still figuring things out, loving me with the same unwavering certainty then as you do now. That kind of loyalty is priceless.",
  },
  {
    id: 9,
    category: "Romantic",
    text: "The way your eyes light up when you talk about the things you love. I could listen to your voice map out your dreams for the rest of my life.",
  },
  {
    id: 10,
    category: "Inside Joke",
    text: "Your unapologetic victory dances and elite-level trash talk the exact millisecond you beat me at anything, even though I secretly love watching you win.",
  },
  {
    id: 11,
    category: "Appreciation",
    text: "How you notice the tiniest shifts in my mood before I even say a word. Your empathy makes me feel understood in a way I didn't know was possible.",
  },
  {
    id: 12,
    category: "Romantic",
    text: "Loving you has taught me that soulmates aren't just found, they are built in the quiet moments of grace, patience, and deep devotion you bring to us every single day.",
  },
  {
    id: 13,
    category: "Inside Joke",
    text: "How 'what do you want to eat?' turns into a high-stakes negotiation, followed by you claiming you aren't hungry and then taxing the best bites off my plate.",
  },
  {
    id: 14,
    category: "Appreciation",
    text: "The way you balance fierce ambition and relentless grit with the softest, most tender heart. You are a masterclass in both strength and grace.",
  },
  {
    id: 15,
    category: "Inside Joke",
    text: "When 'just one more match' on Call of Duty late at night somehow turns into us locked in for hours, laughing until our ribs hurt over a botched play.",
  },
  {
    id: 16,
    category: "Romantic",
    text: "Whenever the world gets loud and heavy, a single embrace from you resets my entire universe. You are, without question, my favorite place to come home to.",
  },
  {
    id: 17,
    category: "Appreciation",
    text: "Watching the gentle, dignified way you treat people when nobody is looking. Your pure heart and integrity make me endlessly proud to walk beside you.",
  },
  {
    id: 18,
    category: "Inside Joke",
    text: "Our unspoken telepathy in public, where one quick glance across a room communicates an entire paragraph that only the two of us could ever decode.",
  },
  {
    id: 19,
    category: "Appreciation",
    text: "On the days when my own confidence wavered, you lent me yours. You have believed in me and stayed solid through every late night, challenge, and grind.",
  },
  {
    id: 20,
    category: "Romantic",
    text: "You turn the most ordinary moments, running errands, sitting in silence, or just existing in the same room into memories I want to hold onto forever.",
  },
  {
    id: 21,
    category: "Appreciation",
    text: "Watching you step into 22 with so much wisdom, resilience, and radiance. The woman you are and the woman you are becoming leaves me in complete awe and appreciation of God through you.",
  },
  {
    id: 22,
    category: "Romantic",
    text: "Because at 22, you are my fiercest teammate, my most compassionate confidante, my safe harbor, and the most extraordinary soul I will ever know. I love you Nana ",
  },
];

export default function ReasonsPage() {
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("unlocked_reasons");
    if (saved) {
      setFlippedIds(JSON.parse(saved));
    }
  }, []);

  const toggleCard = (id: number) => {
    setFlippedIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem("unlocked_reasons", JSON.stringify(updated));
      return updated;
    });
  };

  const resetAll = () => {
    setFlippedIds([]);
    localStorage.removeItem("unlocked_reasons");
  };

  const progressPercentage = Math.round((flippedIds.length / 22) * 100);

  const getCategoryBadge = (category: Reason["category"]) => {
    switch (category) {
      case "Romantic":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      case "Inside Joke":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "Appreciation":
        return "bg-purple-500/15 text-purple-300 border-purple-500/30";
    }
  };

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white px-6 py-12 overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none fixed top-[-10%] left-[-10%] h-96 w-96 rounded-full bg-rose-600/15 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-purple-600/15 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Top Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-400 backdrop-blur-md transition hover:border-rose-500/50 hover:text-white"
          >
            <span>←</span> Back to Gift Box
          </Link>

          {flippedIds.length > 0 && (
            <button
              onClick={resetAll}
              className="text-xs text-zinc-500 underline-offset-4 hover:text-rose-400 hover:underline transition"
            >
              Reset Cards
            </button>
          )}
        </div>

        {/* Header Section */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1 text-xs font-medium tracking-wider text-rose-400 uppercase mb-4">
            Chapter 22
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-rose-100 to-rose-400 bg-clip-text text-transparent mb-3">
            22 Reasons Why I Love You
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            Tap any numbered card below to flip it over and reveal a memory, joke, or note.
          </p>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mx-auto mb-12 max-w-xl rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md shadow-lg">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-300">
              {flippedIds.length} / 22 Reasons Discovered
            </span>
            <span className="font-bold text-rose-400">{progressPercentage}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-600 via-pink-500 to-amber-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {flippedIds.length === 22 && (
            <p className="mt-3 text-center text-xs font-medium text-rose-300 animate-pulse">
              🎉 You unlocked all 22 reasons! Happy 22nd Birthday, my love!
            </p>
          )}
        </div>

        {/* 22 3D Flip Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {REASONS_DATA.map((item) => {
            const isFlipped = flippedIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleCard(item.id)}
                className="group h-72 w-full cursor-pointer"
                style={{ perspective: "1000px" }}
              >
                <div
                  className="relative h-full w-full rounded-2xl transition-all duration-700"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* FRONT OF CARD (Numbered Square) */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-between rounded-2xl border border-zinc-800/90 bg-zinc-900/80 p-6 backdrop-blur-md shadow-xl transition-all duration-300 group-hover:border-rose-500/50 group-hover:shadow-rose-500/10"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="w-full flex justify-between items-center">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${getCategoryBadge(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                      <span className="text-xs text-zinc-600 group-hover:text-rose-400 transition">
                        Tap to flip ↻
                      </span>
                    </div>

                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-zinc-800 bg-gradient-to-br from-zinc-800/80 to-zinc-900 shadow-inner group-hover:scale-110 group-hover:border-rose-500/40 transition-all duration-300">
                      <span className="text-3xl font-black bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent group-hover:from-rose-300 group-hover:to-rose-500">
                        {item.id}
                      </span>
                    </div>

                    <div className="w-full text-center">
                      <span className="text-xs text-zinc-500">Reason #{item.id}</span>
                    </div>
                  </div>

                  {/* BACK OF CARD (Revealed Reason) */}
                  <div
                    className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-950/90 via-zinc-900 to-zinc-950 p-6 shadow-xl shadow-rose-950/30"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-400">
                        #{item.id}
                      </span>
                      <span className="text-sm">❤️</span>
                    </div>

                    <p className="my-auto text-center text-sm font-medium leading-relaxed text-zinc-100">
                      &ldquo;{item.text}&rdquo;
                    </p>

                    <div className="text-center">
                      <span className="text-[11px] text-rose-300/60">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}