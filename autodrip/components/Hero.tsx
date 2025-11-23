import React from 'react';
import { Button } from './Button';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="relative mb-8 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative px-7 py-4 bg-black rounded-full leading-none flex items-center">
          <span className="flex items-center space-x-5">
            <span className="text-indigo-400 text-sm font-bold tracking-widest uppercase">New Release</span>
          </span>
        </div>
      </div>
      
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-white drop-shadow-2xl">
        INSTANT <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500">
          AURA UPGRADE
        </span>
      </h1>
      
      <p className="max-w-xl text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed">
        Upload your photo. Our AI remakes it into the ultimate 10/10 version for your socials. Maximum aesthetic, zero effort.
      </p>

      <Button onClick={onStart} className="text-lg px-10 py-4">
        Connect & Start
      </Button>

      <p className="mt-8 text-xs text-zinc-600 max-w-sm">
        *Requires a Google Cloud Project with billing enabled to access the specialized imaging model.
      </p>
    </div>
  );
};