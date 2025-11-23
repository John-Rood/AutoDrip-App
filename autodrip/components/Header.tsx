import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
      <div className="pointer-events-auto">
        <h1 className="text-3xl font-black tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]">
          AUTO<span className="text-white">DRIP</span>
        </h1>
      </div>
      <div className="pointer-events-auto hidden md:block">
        <span className="text-xs font-mono text-zinc-500 bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800">
          POWERED BY GEMINI 3 PRO
        </span>
      </div>
    </header>
  );
};