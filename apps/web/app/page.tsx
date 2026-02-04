import Link from 'next/link';
import { Mic, BarChart3, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-950 to-gray-900 text-white">
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="h-8 w-8 text-brand-400" />
          <span className="text-xl font-bold">AI Sales Trainer</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth" className="btn-secondary !text-white !border-gray-600 !bg-transparent hover:!bg-white/10">
            Log In
          </Link>
          <Link href="/auth?mode=register" className="btn-primary">
            Get Started
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6">
        <section className="py-24 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Master B2B Sales with{' '}
            <span className="text-brand-400">AI-Powered</span> Voice Training
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Practice real sales conversations with intelligent AI agents. Get instant feedback
            on rapport, discovery, presentation, objection handling, and closing techniques.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth?mode=register" className="btn-primary !px-8 !py-3 !text-base">
              Start Training Free
            </Link>
            <Link href="#features" className="btn-secondary !text-white !border-gray-600 !bg-transparent hover:!bg-white/10 !px-8 !py-3 !text-base">
              Learn More
            </Link>
          </div>
        </section>

        <section id="features" className="py-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="card !bg-white/5 !border-white/10 text-center">
            <div className="w-12 h-12 rounded-xl bg-brand-600/20 flex items-center justify-center mx-auto mb-4">
              <Mic className="h-6 w-6 text-brand-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Voice Conversations</h3>
            <p className="text-gray-400 text-sm">
              Real-time voice practice with AI agents powered by ElevenLabs.
              Sub-500ms latency for natural conversations.
            </p>
          </div>

          <div className="card !bg-white/5 !border-white/10 text-center">
            <div className="w-12 h-12 rounded-xl bg-brand-600/20 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-brand-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Analysis</h3>
            <p className="text-gray-400 text-sm">
              GPT-4 analyzes every conversation across 5 key sales dimensions
              and provides actionable feedback.
            </p>
          </div>

          <div className="card !bg-white/5 !border-white/10 text-center">
            <div className="w-12 h-12 rounded-xl bg-brand-600/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-brand-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Zero-Knowledge Security</h3>
            <p className="text-gray-400 text-sm">
              Your API keys are encrypted client-side with AES-256-GCM.
              We never see your credentials.
            </p>
          </div>
        </section>

        <section className="py-20 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to level up your sales game?</h2>
          <p className="text-gray-400 mb-8">
            Join sales professionals who practice smarter with AI.
          </p>
          <Link href="/auth?mode=register" className="btn-primary !px-8 !py-3 !text-base">
            Start Training Now
          </Link>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} AI Sales Trainer. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
