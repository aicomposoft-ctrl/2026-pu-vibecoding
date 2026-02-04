'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { VoiceOrb } from './voice-orb';
import { TranscriptPanel } from './transcript-panel';
import type { TranscriptMessage, ConnectionStatus } from '@ai-sales-trainer/shared-types';
import type { Scenario } from '@ai-sales-trainer/shared-types';
import { Phone, PhoneOff, Loader2 } from 'lucide-react';

interface Props {
  conversationId: string;
  scenario: Scenario;
  onEnd: () => void;
}

export function ConversationWidget({ conversationId, scenario, onEnd }: Props) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [duration, setDuration] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);
  }, []);

  async function handleConnect() {
    setStatus('connecting');

    try {
      const res = await fetch('/api/conversation/signed-url');
      if (!res.ok) throw new Error('Failed to get signed URL');

      const { signedUrl } = await res.json();

      // ElevenLabs Conversational AI connection
      // In production, use @elevenlabs/react useConversation hook
      // For now, simulate the connection flow
      setStatus('connected');
      startTimer();

      // Simulate initial AI greeting
      setTimeout(() => {
        const greeting: TranscriptMessage = {
          id: crypto.randomUUID(),
          role: 'ASSISTANT',
          content: `Hello! ${scenario.buyerPersona.split(',')[0]} here. What can I help you with today?`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, greeting]);
        saveMessage(greeting);
      }, 1500);
    } catch {
      setStatus('error');
    }
  }

  async function handleDisconnect() {
    if (timerRef.current) clearInterval(timerRef.current);

    setStatus('disconnected');

    await fetch(`/api/conversation/${conversationId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration }),
    });

    // Trigger analysis
    const transcript = messages.map((m) => `${m.role}: ${m.content}`).join('\n');
    if (transcript.length >= 50) {
      await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          transcript,
          scenario: scenario.name,
        }),
      });
    }

    onEnd();
  }

  async function saveMessage(msg: TranscriptMessage) {
    await fetch(`/api/conversation/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: msg.role,
        content: msg.content,
      }),
    });
  }

  function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{scenario.name}</h2>
          <p className="text-sm text-gray-500">{scenario.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-gray-900">{formatDuration(duration)}</div>
          <div className="text-xs text-gray-500">
            {status === 'connected' ? 'Recording' : status === 'connecting' ? 'Connecting...' : 'Ready'}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card flex flex-col items-center justify-center min-h-[400px]">
          <VoiceOrb
            isActive={status === 'connected'}
            isSpeaking={isSpeaking}
          />

          <div className="mt-8">
            {status === 'disconnected' && (
              <button onClick={handleConnect} className="btn-primary gap-2 !px-8 !py-3">
                <Phone className="h-5 w-5" />
                Start Call
              </button>
            )}
            {status === 'connecting' && (
              <button disabled className="btn-primary gap-2 !px-8 !py-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                Connecting...
              </button>
            )}
            {status === 'connected' && (
              <button onClick={handleDisconnect} className="btn-primary !bg-red-600 hover:!bg-red-700 gap-2 !px-8 !py-3">
                <PhoneOff className="h-5 w-5" />
                End Call
              </button>
            )}
            {status === 'error' && (
              <div className="text-center">
                <p className="text-sm text-red-600 mb-3">Connection failed. Please try again.</p>
                <button onClick={handleConnect} className="btn-primary gap-2">
                  <Phone className="h-5 w-5" />
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>

        <TranscriptPanel messages={messages} />
      </div>
    </div>
  );
}
