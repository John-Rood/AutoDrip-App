import React, { useEffect, useState } from 'react';

const MESSAGES = [
  "Analyzing aura...",
  "Applying digital rizz...",
  "Maximizing aesthetic...",
  "Injecting confidence...",
  "Finalizing the drip...",
  "Almost legendary..."
];

export const ProcessingState: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      {/* Scanner effect container */}
      <div className="relative w-32 h-32 mb-12">
        <div className="absolute inset-0 rounded-full border-t-4 border-violet-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-r-4 border-fuchsia-500 animate-spin animation-delay-200"></div>
        <div className="absolute inset-4 rounded-full border-b-4 border-indigo-500 animate-spin animation-delay-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-violet-500 rounded-full animate-pulse filter blur-xl opacity-50"></div>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-2 animate-pulse">
        PROCESSING
      </h2>
      <p className="text-lg text-violet-300 h-8 transition-opacity duration-300">
        {MESSAGES[msgIndex]}
      </p>

      <div className="mt-8 w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 animate-progress"></div>
      </div>
      
      <style>{`
        .animation-delay-200 { animation-delay: -0.2s; }
        .animation-delay-500 { animation-delay: -0.5s; }
        @keyframes progress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 50%; }
          100% { width: 100%; transform: translateX(0%); }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};