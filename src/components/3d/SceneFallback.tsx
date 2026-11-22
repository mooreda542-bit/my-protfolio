import React from 'react';

export const SceneFallback: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Radial ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-cyber-blue/20 rounded-full blur-[140px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyber-cyan/15 rounded-full blur-[100px]" />

      {/* Cyber Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.15]" 
        style={{
          backgroundImage: `linear-gradient(to right, rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)',
        }}
      />
    </div>
  );
};

