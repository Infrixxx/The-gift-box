"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        setError("Incorrect PIN. Please try again.");
      }
    } catch (err) {
      setError("Unable to connect to the server.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">The Gift Box</h1>
        <p className="mb-8 text-center text-zinc-400">Enter your access PIN to unlock your gifts.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-4 text-center text-2xl tracking-[0.5em] text-white focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            maxLength={6}
          />
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-rose-600 py-4 font-bold text-white transition-colors hover:bg-rose-700"
          >
            Unlock
          </button>
        </form>
      </div>
    </main>
  );
}