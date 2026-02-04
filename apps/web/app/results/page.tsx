'use client';

import { useEffect, useState } from 'react';
import type { ConversationSummary } from '@ai-sales-trainer/shared-types';
import Link from 'next/link';
import { BarChart3, Clock, ArrowRight } from 'lucide-react';

export default function ResultsPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      const res = await fetch('/api/conversation?pageSize=20');
      if (res.ok) {
        const data = await res.json();
        setConversations(data.items);
      }
      setLoading(false);
    }
    loadConversations();
  }, []);

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatDuration(seconds: number | null): string {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }

  function scoreColor(score: number | undefined): string {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Training Results</h1>
        <p className="text-gray-500 mt-1">Review your past practice sessions and analysis.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20">
          <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No sessions yet</h3>
          <p className="text-gray-500 mb-4">Complete a training session to see your results.</p>
          <Link href="/trainer" className="btn-primary">Start Training</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/results/${conv.id}`}
              className="card flex items-center gap-4 hover:shadow-md transition-shadow group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                conv.overallScore
                  ? conv.overallScore >= 80
                    ? 'bg-green-100'
                    : conv.overallScore >= 60
                    ? 'bg-yellow-100'
                    : 'bg-red-100'
                  : 'bg-gray-100'
              }`}>
                <span className={`text-lg font-bold ${scoreColor(conv.overallScore)}`}>
                  {conv.overallScore ?? '--'}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{conv.title || conv.scenario}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                  <span>{formatDate(conv.createdAt)}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(conv.duration)}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    conv.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-700'
                      : conv.status === 'IN_PROGRESS'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {conv.status}
                  </span>
                </div>
              </div>

              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-brand-600 transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
