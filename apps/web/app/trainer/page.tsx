'use client';

import { useState } from 'react';
import { ScenarioSelector } from '@/components/trainer/scenario-selector';
import { ConversationWidget } from '@/components/trainer/conversation-widget';
import { SCENARIOS } from '@ai-sales-trainer/config';

type Phase = 'select' | 'practice' | 'done';

export default function TrainerPage() {
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  async function handleStartScenario(scenarioId: string) {
    setSelectedScenario(scenarioId);

    const res = await fetch('/api/conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioId }),
    });

    if (!res.ok) return;

    const data = await res.json();
    setConversationId(data.conversationId);
    setPhase('practice');
  }

  function handleConversationEnd() {
    setPhase('done');
  }

  function handleReset() {
    setPhase('select');
    setSelectedScenario(null);
    setConversationId(null);
  }

  const scenario = SCENARIOS.find((s) => s.id === selectedScenario);

  return (
    <div className="container mx-auto px-6 py-8">
      {phase === 'select' && (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Sales Training</h1>
            <p className="text-gray-500 mt-1">Choose a scenario and start practicing.</p>
          </div>
          <ScenarioSelector onSelect={handleStartScenario} />
        </>
      )}

      {phase === 'practice' && conversationId && scenario && (
        <ConversationWidget
          conversationId={conversationId}
          scenario={scenario}
          onEnd={handleConversationEnd}
        />
      )}

      {phase === 'done' && conversationId && (
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Session Complete!</h2>
          <p className="text-gray-500 mb-6">Your conversation has been recorded. View your analysis or start another session.</p>
          <div className="flex items-center justify-center gap-3">
            <a href={`/results/${conversationId}`} className="btn-primary">
              View Analysis
            </a>
            <button onClick={handleReset} className="btn-secondary">
              New Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
