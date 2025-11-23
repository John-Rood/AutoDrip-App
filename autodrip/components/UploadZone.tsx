import React, { useRef, useState } from 'react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPass(e.target.files[0]);
    }
  };

  const validateAndPass = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in-up">
      <div 
        className={`
          relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-500 cursor-pointer
          ${isDragging 
            ? 'border-violet-500 bg-violet-500/10 scale-[1.02]' 
            : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/50 bg-black/40'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={inputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleChange}
        />
        
        <div className="p-12 md:p-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 mb-6 rounded-full bg-zinc-900 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Drop your photo here</h3>
          <p className="text-zinc-400">or click to browse</p>
          <div className="mt-8 text-xs text-zinc-600 font-mono border border-zinc-800 rounded-full px-3 py-1">
            SUPPORTS JPG, PNG, WEBP
          </div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-10" 
          style={{
            backgroundImage: 'linear-gradient(#4c1d95 1px, transparent 1px), linear-gradient(90deg, #4c1d95 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>
    </div>
  );
};