import type { TranscriptMessage } from '@ai-sales-trainer/shared-types';
import { User, Bot } from 'lucide-react';

interface Props {
  messages: TranscriptMessage[];
}

export function TranscriptReplay({ messages }: Props) {
  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-4">Conversation Transcript</h3>

      {messages.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No messages recorded.</p>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
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
              <div className="max-w-[80%]">
                <div
                  className={`rounded-xl px-3 py-2 text-sm ${
                    msg.role === 'USER'
                      ? 'bg-brand-600 text-white rounded-tr-sm'
                      : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                </div>
                <div className={`text-[10px] text-gray-400 mt-0.5 ${
                  msg.role === 'USER' ? 'text-right' : ''
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
