'use client';

import type { ConnectionStatus } from '@ai-sales-trainer/shared-types';
import { Loader2 } from 'lucide-react';

interface Props {
  status: ConnectionStatus;
  isSpeaking: boolean;
}

export function VoiceOrb({ status, isSpeaking }: Props) {
  const isActive = status === 'connected';
  const isConnecting = status === 'connecting';
  const isError = status === 'error';

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings — active */}
      {isActive && (
        <>
          <div
            className={`absolute w-48 h-48 rounded-full transition-all duration-1000 ${
              isSpeaking
                ? 'bg-brand-400/20 animate-ping'
                : 'bg-brand-400/10 animate-pulse-slow'
            }`}
          />
          <div
            className={`absolute w-36 h-36 rounded-full transition-all duration-700 ${
              isSpeaking
                ? 'bg-brand-400/30 animate-pulse'
                : 'bg-brand-400/15 animate-pulse-slow'
            }`}
          />
        </>
      )}

      {/* Connecting animation rings */}
      {isConnecting && (
        <>
          <div className="absolute w-40 h-40 rounded-full border-2 border-brand-300/40 animate-ping" />
          <div className="absolute w-32 h-32 rounded-full border-2 border-brand-400/30 animate-pulse" />
        </>
      )}

      {/* Error glow */}
      {isError && (
        <div className="absolute w-36 h-36 rounded-full bg-red-400/15 animate-pulse" />
      )}

      {/* Main orb */}
      <div
        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
          isActive
            ? 'bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg animate-orb-glow'
            : isConnecting
              ? 'bg-gradient-to-br from-brand-400 to-brand-600 shadow-md'
              : isError
                ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-md'
                : 'bg-gray-200'
        }`}
      >
        {/* Inner content */}
        {isConnecting ? (
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        ) : (
          <>
            <div
              className={`w-16 h-16 rounded-full ${
                isActive
                  ? 'bg-gradient-to-br from-brand-300/50 to-transparent'
                  : isError
                    ? 'bg-gradient-to-br from-red-300/50 to-transparent'
                    : 'bg-gray-300/50'
              }`}
            />
            {isActive && (
              <div className="absolute w-3 h-3 rounded-full bg-white/80 animate-pulse" />
            )}
          </>
        )}
      </div>

      {/* Status label */}
      <div className={`absolute -bottom-8 text-xs font-medium ${
        isError ? 'text-red-500' : 'text-gray-500'
      }`}>
        {isActive
          ? (isSpeaking ? 'AI Speaking...' : 'Listening...')
          : isConnecting
            ? 'Connecting...'
            : isError
              ? 'Connection Error'
              : 'Inactive'}
      </div>
    </div>
  );
}
