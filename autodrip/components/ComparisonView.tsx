import React from 'react';
import { Button } from './Button';
import { LevelSlider } from './LevelSlider';
import { GeneratedImage } from '../types';

interface ComparisonViewProps {
  data: GeneratedImage;
  onReset: () => void;
  onRedo: () => void;
  currentLevel: number;
  onLevelChange: (level: number) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ 
  data, 
  onReset, 
  onRedo, 
  currentLevel, 
  onLevelChange 
}) => {
  const handleDownload = async () => {
    try {
      // 1. Convert Base64 to a File object
      const response = await fetch(data.result);
      const blob = await response.blob();
      const file = new File([blob], `autodrip-${Date.now()}.png`, { type: 'image/png' });

      // Check for mobile device (heuristic)
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      // 2. Try Web Share API (Mobile native "Save to Photos" support)
      // We explicitly check isMobile because desktop browsers (like Safari) might support navigator.share
      // but users typically expect a direct file download on desktop.
      if (isMobile && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'AutoDrip Result',
            text: 'Just upgraded my aura with AutoDrip.',
          });
          return; // Success, exit
        } catch (error) {
          // Ignore AbortError (user cancelled share sheet)
          if ((error as Error).name === 'AbortError') return;
          console.error('Share failed, falling back to download:', error);
        }
      }

      // 3. Fallback to anchor download (Desktop / Unsupported browsers)
      const link = document.createElement('a');
      link.href = data.result;
      link.download = `autodrip-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error('Download process failed:', err);
      alert("Could not save image. Please try long-pressing the image to save.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-4">
          DRIP ACQUIRED
        </h2>
        <p className="text-zinc-400">Your social credit score just went up.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Original */}
        <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900">
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-4 py-1 rounded-full text-xs font-bold text-white z-10">
            ORIGINAL
          </div>
          <img 
            src={data.original} 
            alt="Original" 
            className="w-full h-auto block filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
          />
        </div>

        {/* Result */}
        <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.3)] border border-violet-500/50 bg-zinc-900">
           <div className="absolute top-4 left-4 bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 rounded-full text-xs font-bold text-white z-10 shadow-lg">
            UPGRADED
          </div>
          <img 
            src={data.result} 
            alt="Upgraded" 
            className="w-full h-auto block" 
          />
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="max-w-xl mx-auto mb-8">
         <LevelSlider level={currentLevel} setLevel={onLevelChange} />
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Button onClick={handleDownload} className="w-full md:w-auto min-w-[200px]">
          Save Image
        </Button>
        <Button variant="glass" onClick={onRedo} className="w-full md:w-auto min-w-[200px]">
          Redo Magic
        </Button>
        <Button variant="secondary" onClick={onReset} className="w-full md:w-auto">
          Try Another Photo
        </Button>
      </div>
    </div>
  );
};