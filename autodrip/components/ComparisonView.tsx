import React from 'react';
import { Button } from './Button';
import { GeneratedImage } from '../types';

interface ComparisonViewProps {
  data: GeneratedImage;
  onReset: () => void;
  onRedo: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ data, onReset, onRedo }) => {
  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = data.result;
    link.download = `autodrip-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-4">
          DRIP ACQUIRED
        </h2>
        <p className="text-zinc-400">Your social credit score just went up.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Original */}
        <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-4 py-1 rounded-full text-xs font-bold text-white z-10">
            ORIGINAL
          </div>
          <img 
            src={data.original} 
            alt="Original" 
            className="w-full h-full object-cover filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
          />
        </div>

        {/* Result */}
        <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.3)] border border-violet-500/50">
           <div className="absolute top-4 left-4 bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 rounded-full text-xs font-bold text-white z-10 shadow-lg">
            UPGRADED
          </div>
          <img 
            src={data.result} 
            alt="Upgraded" 
            className="w-full h-full object-cover" 
          />
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Button onClick={downloadImage} className="w-full md:w-auto min-w-[200px]">
          Download Image
        </Button>
        <Button variant="glass" onClick={onRedo} className="w-full md:w-auto min-w-[200px]">
          Redo
        </Button>
        <Button variant="secondary" onClick={onReset} className="w-full md:w-auto">
          Try Another Photo
        </Button>
      </div>
    </div>
  );
};