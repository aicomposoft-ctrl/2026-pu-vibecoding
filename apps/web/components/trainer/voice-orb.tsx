'use client';

interface Props {
  isActive: boolean;
  isSpeaking: boolean;
}

export function VoiceOrb({ isActive, isSpeaking }: Props) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
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

      {/* Main orb */}
      <div
        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
          isActive
            ? 'bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg animate-orb-glow'
            : 'bg-gray-200'
        }`}
      >
        {/* Inner highlight */}
        <div
          className={`w-16 h-16 rounded-full ${
            isActive
              ? 'bg-gradient-to-br from-brand-300/50 to-transparent'
              : 'bg-gray-300/50'
          }`}
        />

        {/* Center dot */}
        {isActive && (
          <div className="absolute w-3 h-3 rounded-full bg-white/80 animate-pulse" />
        )}
      </div>

      {/* Status label */}
      <div className="absolute -bottom-8 text-xs font-medium text-gray-500">
        {isActive ? (isSpeaking ? 'AI Speaking...' : 'Listening...') : 'Inactive'}
      </div>
    </div>
  );
}
