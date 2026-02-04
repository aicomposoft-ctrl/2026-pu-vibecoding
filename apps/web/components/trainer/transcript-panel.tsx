'use client';

import { useEffect, useRef } from 'react';
import type { TranscriptMessage } from '@ai-sales-trainer/shared-types';
import { User, Bot } from 'lucide-react';

interface Props {
  messages: TranscriptMessage[];
}

export function TranscriptPanel({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="card flex flex-col min-h-[400px] max-h-[500px]">
      <h3 className="font-semibold text-gray-900 mb-3 flex-shrink-0">Live Transcript</h3>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            Conversation transcript will appear here...
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === 'USER' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
              msg.role === 'USER' ? 'bg-brand-100' : 'bg-gray-100'
            }`}>
              {msg.role === 'USER' ? (
                <User className="h-3.5 w-3.5 text-brand-600" />
              ) : (
                <Bot className="h-3.5 w-3.5 text-gray-600" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                msg.role === 'USER'
                  ? 'bg-brand-600 text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
