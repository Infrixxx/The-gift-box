"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface HuntStage {
  id: number;
  step_number: number;
  chapter_title: string;
  subtitle: string;
  riddle_prompt: string;
  hint: string;
  memory_title: string;
  memory_story: string;
  is_unlocked: number;
}

// 1. Paste your unlisted YouTube URL here! (Watch link or Embed link)
const YOUTUBE_VIDEO_URL = "https://www.youtube.com/watch?v=YOUR_UNLISTED_VIDEO_ID";
const YOUTUBE_EMBED_URL = ""; // Optional: e.g. "https://www.youtube.com/embed/YOUR_UNLISTED_VIDEO_ID"

// 2. Optional: If you record your own voice or generate an MP3 (e.g. "/story-voiceover.mp3" in web-ui/public),
// put the path here. If left empty (""), it uses the built-in browser voice reader automatically!
const CUSTOM_AUDIO_SRC = "";

const FINAL_STORY_PARAGRAPHS = [
  "If you look back at where we started, it almost feels like fate was quietly setting the stage for us all along. It began in May around that movie night—our very first interaction—and before long, your friend invited you over to chill. We connected so effortlessly, like two souls who already knew each other's frequency. You were completely obsessed with the keyboard and insisted on playing it, and before we even realized what was happening, we fell into one another and made it official on the sixth of the sixth month, 2024.",
  "Getting to know you meant falling in love with every layer of who you are. I saw your fierce competitive fire every time we locked into games on the PC or battled it out on mobile. I learned that calling you 'obsessed' with Mochachos shawarma is still an understatement, and that nothing beats surprising you with a Cadbury TopDeck Mint. And no matter how many times I catch myself staring at you in awe, hearing you say, 'O etsang, o batla go nseduca' never fails to make my heart smile.",
  "Then came the season when my entire world stood still. When I lost the money from trading, lost my space in Aeronautical Engineering at Wits, and felt like every dream I had was over—financially and academically excluded, right down to the final day on my lease. Through the nights I had to sleep in a bathroom or the library, you never once looked at me differently. You opened the door to your res room, cooked warm meals for me, and made sure that whenever I came back to you, I had a hot shower and a safe bed to sleep in—even when things were heavy and difficult between us, and hard on you too. Today, I am standing near the completion of my WeThinkCode journey because you held up my foundation when everything else collapsed.",
  "Before I found you, I had completely given up on love. I had built walls so high around my heart to protect myself, and unlearning those defensive habits wasn't easy at first. Yet every time I heard your voice, saw your smile, and felt your warmth, those walls came down a little more. Every time I spoke to you, my soul flowed with ease—and out of those overwhelming emotions from our very first encounter, I wrote a poem asking if you would listen if my heart could sing.",
];

export default function ScavengerHuntPage() {
  const [stages, setStages] = useState<HuntStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerInput, setAnswerInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [justUnlockedStep, setJustUnlockedStep] = useState<number | null>(null);

  // Story Narration States
  const [isPlayingStory, setIsPlayingStory] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(-1);
  const [storyCompleted, setStoryCompleted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchStages = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/hunt");
      const data = await res.json();
      setStages(data.stages || []);
    } catch (err) {
      console.error("Failed to fetch scavenger hunt stages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const unlockedCount = stages.filter((s) => Boolean(s.is_unlocked)).length;
  const activeStage = stages.find((s) => !Boolean(s.is_unlocked)) || null;
  const allCompleted = stages.length > 0 && unlockedCount === stages.length;
  const progressPercent = stages.length
    ? Math.round((unlockedCount / stages.length) * 100)
    : 0;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStage || !answerInput.trim()) return;
    setErrorMsg(null);

    try {
      const res = await fetch("http://localhost:8000/api/hunt/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step_number: activeStage.step_number,
          answer: answerInput,
        }),
      });

      if (res.ok) {
        setJustUnlockedStep(activeStage.step_number);
        setAnswerInput("");
        setShowHint(false);
        await fetchStages();
        setTimeout(() => setJustUnlockedStep(null), 4000);
      } else {
        const errData = await res.json();
        setErrorMsg(errData.detail || "Not quite right, try again!");
      }
    } catch (err) {
      setErrorMsg("Unable to reach server. Make sure FastAPI is running.");
    }
  };

  const stopNarration = () => {
    if (CUSTOM_AUDIO_SRC && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingStory(false);
  };

  const startNarration = () => {
    stopNarration();
    setIsPlayingStory(true);
    setStoryCompleted(false);
    setCurrentParagraphIndex(0);

    // If a custom MP3 voiceover is provided, play it and reveal paragraphs progressively
    if (CUSTOM_AUDIO_SRC && audioRef.current) {
      audioRef.current.play();
      audioRef.current.onended = () => {
        setIsPlayingStory(false);
        setCurrentParagraphIndex(FINAL_STORY_PARAGRAPHS.length - 1);
        setStoryCompleted(true);
      };
      return;
    }

    // Built-in Web Speech API narrator (reads paragraph by paragraph)
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      const preferredVoice =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Google") ||
              v.name.includes("Microsoft"))
        ) || voices.find((v) => v.lang.startsWith("en"));

      const speakParagraph = (index: number) => {
        if (index >= FINAL_STORY_PARAGRAPHS.length) {
          setIsPlayingStory(false);
          setStoryCompleted(true);
          return;
        }

        setCurrentParagraphIndex(index);
        const utterance = new SpeechSynthesisUtterance(
          FINAL_STORY_PARAGRAPHS[index]
        );
        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 0.92; // Warm, unhurried storytelling pace
        utterance.pitch = 0.98;

        utterance.onend = () => {
          setTimeout(() => speakParagraph(index + 1), 650);
        };

        utterance.onerror = () => {
          setIsPlayingStory(false);
          setStoryCompleted(true);
        };

        synth.speak(utterance);
      };

      speakParagraph(0);
    } else {
      // Fallback if browser speech synthesis isn't supported
      setIsPlayingStory(false);
      setStoryCompleted(true);
    }
  };

  const skipToFinaleLink = () => {
    stopNarration();
    setCurrentParagraphIndex(FINAL_STORY_PARAGRAPHS.length - 1);
    setStoryCompleted(true);
  };

  const handleReset = async () => {
    stopNarration();
    setStoryCompleted(false);
    setCurrentParagraphIndex(-1);
    await fetch("http://localhost:8000/api/hunt/reset", { method: "POST" });
    setAnswerInput("");
    setShowHint(false);
    setErrorMsg(null);
    fetchStages();
  };

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white px-6 py-12 overflow-hidden">
      {/* Ambient Glows */}
      <div className="pointer-events-none fixed top-[-10%] left-[-10%] h-96 w-96 rounded-full bg-rose-600/15 blur-[130px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-amber-500/15 blur-[130px]" />

      {CUSTOM_AUDIO_SRC && <audio ref={audioRef} src={CUSTOM_AUDIO_SRC} />}

      {/* Celebration Banner on Unlock */}
      {justUnlockedStep && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full border border-emerald-400/50 bg-zinc-900/95 px-6 py-3 text-sm font-bold text-emerald-300 shadow-2xl shadow-emerald-500/20 backdrop-blur-md animate-bounce">
          ✨ Chapter {justUnlockedStep} Unlocked! A new piece of our story is revealed...
        </div>
      )}

      <div className="relative mx-auto max-w-4xl">
        {/* Top Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-400 backdrop-blur-md transition hover:border-rose-500/50 hover:text-white"
          >
            <span>←</span> Back to Gift Box
          </Link>

          {unlockedCount > 0 && (
            <button
              onClick={handleReset}
              className="text-xs text-zinc-500 underline-offset-4 hover:text-rose-400 hover:underline transition"
            >
              Restart Hunt (Dev Test)
            </button>
          )}
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1 text-xs font-medium tracking-wider text-rose-300 uppercase mb-4">
            Our Story in 5 Coordinates
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-rose-100 to-amber-200 bg-clip-text text-transparent mb-3">
            The Memory Scavenger Hunt
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            Solve each riddle from our journey together to unlock the next memory and piece together the story waiting at the end.
          </p>
        </div>

        {/* Visual Milestone Stepper & Progress Bar */}
        <div className="mb-12 rounded-2xl border border-zinc-800/90 bg-zinc-900/70 p-6 backdrop-blur-md shadow-xl">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="font-semibold text-zinc-200">
              {unlockedCount} of {stages.length} Chapters Unlocked
            </span>
            <span className="font-bold text-rose-400">{progressPercent}%</span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800 mb-6">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-600 via-pink-500 to-amber-400 transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-5 gap-2">
            {stages.map((stage) => {
              const unlocked = Boolean(stage.is_unlocked);
              const isCurrent = activeStage?.step_number === stage.step_number;

              return (
                <div
                  key={stage.id}
                  className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition-all ${
                    unlocked
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : isCurrent
                      ? "border-rose-500 bg-rose-500/15 text-white shadow-lg shadow-rose-500/10"
                      : "border-zinc-800 bg-zinc-950/50 text-zinc-600"
                  }`}
                >
                  <span className="text-lg mb-1">
                    {unlocked ? "🔓" : isCurrent ? "✨" : "🔒"}
                  </span>
                  <span className="text-[11px] font-bold">
                    Ch. {stage.step_number}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-zinc-500 py-12">Loading coordinates...</p>
        ) : (
          <div className="space-y-8">
            {/* Unlocked Memories Timeline */}
            {stages
              .filter((s) => Boolean(s.is_unlocked))
              .map((stage) => (
                <div
                  key={stage.id}
                  className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-zinc-900 via-zinc-900 to-rose-950/30 p-6 md:p-8 shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-xs font-semibold text-emerald-300">
                      ✓ {stage.chapter_title}
                    </span>
                    <span className="text-xs text-zinc-400">{stage.subtitle}</span>
                  </div>
                  <h3 className="text-xl font-bold text-rose-200 mb-2">
                    {stage.memory_title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed text-zinc-300">
                    {stage.memory_story}
                  </p>
                </div>
              ))}

            {/* Current Active Riddle Gate */}
            {activeStage && (
              <div className="rounded-3xl border border-rose-500/50 bg-zinc-900/90 p-8 shadow-2xl shadow-rose-950/30 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-300">
                    Current Gate • {activeStage.chapter_title}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {activeStage.subtitle}
                  </span>
                </div>

                <p className="text-base md:text-lg leading-relaxed text-zinc-100 mb-6">
                  {activeStage.riddle_prompt}
                </p>

                <form onSubmit={handleVerify} className="space-y-4">
                  <input
                    type="text"
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    placeholder="Type your answer to unlock..."
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-base text-white placeholder-zinc-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />

                  {errorMsg && (
                    <p className="text-sm font-medium text-rose-400">
                      {errorMsg}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowHint(!showHint)}
                      className="text-xs text-zinc-400 underline-offset-4 hover:text-amber-300 hover:underline transition"
                    >
                      {showHint ? "Hide Hint" : "Need a hint? 💡"}
                    </button>

                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-rose-600/25 transition hover:from-rose-500 hover:to-pink-500 active:scale-95"
                    >
                      Unlock Chapter {activeStage.step_number} →
                    </button>
                  </div>

                  {showHint && (
                    <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
                      <strong>Hint:</strong> {activeStage.hint}
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* GRAND FINALE: Voice-Narrated Story -> Closing Tribute -> YouTube Link */}
            {allCompleted && (
              <div className="mt-12 space-y-10 rounded-3xl border border-amber-400/40 bg-gradient-to-b from-rose-950/60 via-zinc-900 to-zinc-950 p-8 md:p-12 shadow-2xl shadow-rose-900/30">
                <div className="text-center">
                  <span className="inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-amber-300 mb-3">
                    ✨ All 5 Coordinates Unlocked ✨
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                    Our Story, Pieced Together
                  </h2>
                  <p className="text-zinc-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                    Every clue you just solved is a chapter of how you changed my life. Press play below to let the voice read our story aloud—and unlock your final gift at the end.
                  </p>
                </div>

                {/* Voice Narration Controls */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {!isPlayingStory ? (
                    <button
                      onClick={startNarration}
                      className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-white shadow-xl shadow-rose-600/30 transition hover:scale-105 active:scale-95"
                    >
                      <span>🔊</span>
                      {storyCompleted ? "Replay Voice Narration" : "Listen to Our Story"}
                    </button>
                  ) : (
                    <button
                      onClick={stopNarration}
                      className="inline-flex items-center gap-3 rounded-2xl border border-rose-500/50 bg-zinc-900 px-6 py-3.5 text-sm font-bold text-rose-300 transition hover:bg-zinc-800"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                      Pause Voice Narration
                    </button>
                  )}

                  {!storyCompleted && (
                    <button
                      onClick={skipToFinaleLink}
                      className="text-xs text-zinc-400 underline-offset-4 hover:text-amber-300 hover:underline transition"
                    >
                      Read at my own pace & reveal link →
                    </button>
                  )}
                </div>

                {/* Synchronized Story Reader Box */}
                <div className="space-y-6 rounded-2xl border border-zinc-800/90 bg-zinc-950/80 p-6 md:p-10 shadow-inner">
                  {FINAL_STORY_PARAGRAPHS.map((paragraph, idx) => {
                    const isBeingRead = isPlayingStory && currentParagraphIndex === idx;
                    const hasBeenRead =
                      storyCompleted || currentParagraphIndex > idx;

                    return (
                      <p
                        key={idx}
                        className={`font-serif text-base md:text-lg leading-relaxed transition-all duration-700 ${
                          isBeingRead
                            ? "scale-[1.01] rounded-xl border border-rose-500/40 bg-rose-950/30 p-4 text-white shadow-lg shadow-rose-950/20"
                            : hasBeenRead
                            ? "text-zinc-200"
                            : "text-zinc-500"
                        }`}
                      >
                        {paragraph}
                      </p>
                    );
                  })}
                </div>

                {/* AFTER THE STORY IS READ: Heartfelt Closing Message + YouTube Link + Poem */}
                {storyCompleted && (
                  <div className="space-y-10 pt-6 animate-fadeIn">
                    {/* The Exact Closing Message Before the Link */}
                    <div className="rounded-3xl border border-rose-500/50 bg-gradient-to-br from-rose-950/80 via-zinc-900 to-amber-950/40 p-8 md:p-10 text-center shadow-2xl">
                      <p className="text-2xl md:text-3xl font-serif italic font-bold leading-relaxed bg-gradient-to-r from-white via-rose-200 to-amber-200 bg-clip-text text-transparent mb-8">
                        &ldquo;Thank you for loving me and for choosing me endlessly, happy birthday my love.&rdquo;
                      </p>

                      {/* Unlisted YouTube Video Button */}
                      <a
                        href={YOUTUBE_VIDEO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 px-10 py-5 text-base font-extrabold uppercase tracking-wider text-white shadow-2xl shadow-rose-600/40 transition hover:scale-105 active:scale-95"
                      >
                        <span>🎬</span> Open Your Unlisted Birthday Video →
                      </a>

                      <p className="mt-4 text-xs text-zinc-400">
                        Features my poem &ldquo;If my heart could sing, would you listen?&rdquo; set to music for you.
                      </p>
                    </div>

                    {/* Optional Embedded Player if YOUTUBE_EMBED_URL is filled in */}
                    {YOUTUBE_EMBED_URL && (
                      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
                        <div className="aspect-video w-full">
                          <iframe
                            src={YOUTUBE_EMBED_URL}
                            title="If My Heart Could Sing - Birthday Video"
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}

                    {/* The Original Poem Artwork Card */}
                    <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200/30 bg-[#f4a97c] p-8 md:p-12 text-zinc-900 shadow-2xl">
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
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}