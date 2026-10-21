import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-950 text-white">
      <h1 className="text-4xl font-bold text-center mb-2">Happy 22nd Birthday!</h1>
      <p className="text-zinc-400 mb-12 text-center">Select a gift from your box.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Link 
          href="/reasons" 
          className="flex flex-col items-center p-8 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/20 transition-all group"
        >
          <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">💌</span>
          <h2 className="text-xl font-bold mb-2">22 Reasons</h2>
          <p className="text-zinc-500 text-center text-sm">Why I love you, one for every year.</p>
        </Link>

        <Link 
          href="/hunt" 
          className="flex flex-col items-center p-8 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/20 transition-all group"
        >
          <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">🗺️</span>
          <h2 className="text-xl font-bold mb-2">Scavenger Hunt</h2>
          <p className="text-zinc-500 text-center text-sm">Follow the digital clues to the physical prizes.</p>
        </Link>

        <Link 
          href="/wallet" 
          className="flex flex-col items-center p-8 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/20 transition-all group"
        >
          <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎟️</span>
          <h2 className="text-xl font-bold mb-2">Coupon Wallet</h2>
          <p className="text-zinc-500 text-center text-sm">Redeem favors anytime. No questions asked.</p>
        </Link>
      </div>
    </main>
  );
}