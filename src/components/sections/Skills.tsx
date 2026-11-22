import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Wrench, Sparkles, Layers, Terminal, Palette, Box } from 'lucide-react';

export const Skills: React.FC = () => {
  const { skills } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Languages & Core',
    'Libraries & Frameworks',
    'Styling & Design',
    'Tools & Environment',
  ];

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter((s) => s.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Languages & Core':
        return <Terminal className="w-4 h-4 text-amber-400" />;
      case 'Libraries & Frameworks':
        return <Box className="w-4 h-4 text-cyber-cyan" />;
      case 'Styling & Design':
        return <Palette className="w-4 h-4 text-cyber-purple" />;
      default:
        return <Wrench className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <section id="skills" className="relative py-24 bg-dark-950 border-t border-slate-900/80 overflow-hidden">
      {/* Background cyber grid */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #8b5cf6 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyber-blue/10 border border-cyber-blue/20 text-cyber-blue text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Skills & Stack
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Technical <span className="bg-gradient-to-r from-cyber-blue via-cyber-cyan to-emerald-400 bg-clip-text text-transparent">Expertise</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Core technologies and tools I work with to architect robust frontend applications.
          </p>

          {/* Category Filter Tabs */}
          <div className="pt-6 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-200 border ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyber-purple to-cyber-blue text-white border-transparent shadow-glow-purple scale-105'
                    : 'bg-dark-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="relative group p-5 rounded-2xl bg-dark-900/50 border border-slate-800/80 hover:border-cyber-purple/50 hover:bg-dark-850/80 transition-all duration-300 hover:-translate-y-1.5 shadow-glass flex flex-col justify-between"
            >
              {/* Subtle top indicator */}
              <div className="flex items-center justify-between mb-3">
                <span className="p-1.5 rounded-lg bg-slate-800/70 border border-slate-700/50">
                  {getCategoryIcon(skill.category)}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  {skill.category.split(' ')[0]}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-display group-hover:text-cyber-cyan transition-colors mb-1">
                  {skill.name}
                </h3>
                {skill.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>
                )}
              </div>

              {/* Bottom hover bar */}
              <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-cyber-purple to-cyber-cyan mt-4 transition-all duration-300 rounded-full" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

