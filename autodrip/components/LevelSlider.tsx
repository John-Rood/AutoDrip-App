import React from 'react';

interface LevelSliderProps {
  level: number;
  setLevel: (level: number) => void;
}

export const LevelSlider: React.FC<LevelSliderProps> = ({ level, setLevel }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLevel(Number(e.target.value));
  };

  return (
    <div className="w-full max-w-xs mx-auto my-6 select-none animate-fade-in">
      <div className="flex justify-between w-full text-[10px] md:text-xs font-bold tracking-widest mb-3 px-1">
        <span className={`transition-colors duration-300 ${level === 1 ? 'text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.6)]' : 'text-zinc-600'}`}>
          LOW KEY
        </span>
        <span className={`transition-colors duration-300 ${level === 2 ? 'text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.6)]' : 'text-zinc-600'}`}>
          HIGH KEY
        </span>
        <span className={`transition-colors duration-300 ${level === 3 ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]' : 'text-zinc-600'}`}>
          MAX RIZZ
        </span>
      </div>
      
      <div className="relative w-full h-3 bg-zinc-900 rounded-full shadow-inner border border-zinc-800">
        {/* Track fill */}
        <div 
            className="absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-500 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            style={{ width: `${((level - 1) / 2) * 100}%` }}
        ></div>
        
        {/* Interactive Input */}
        <input 
          type="range" 
          min="1" 
          max="3" 
          step="1" 
          value={level} 
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
        
        {/* Ticks/Knobs Visuals */}
        <div className="absolute inset-0 flex justify-between items-center px-0 pointer-events-none z-10">
          {[1, 2, 3].map((tick) => (
            <div 
              key={tick}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-300 transform
                ${level >= tick 
                  ? 'bg-white border-transparent shadow-[0_0_10px_rgba(255,255,255,0.8)] scale-110' 
                  : 'bg-zinc-800 border-zinc-700 scale-90'
                }
                ${level === tick ? 'ring-2 ring-white/20' : ''}
              `}
              style={{
                marginLeft: tick === 1 ? '-2px' : '0',
                marginRight: tick === 3 ? '-2px' : '0'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};