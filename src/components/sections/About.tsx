import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Code, Cpu, Sparkles, Terminal, Rocket, Layout, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  const { profile } = usePortfolio();

  const coreFocusAreas = [
    {
      icon: <Layout className="w-5 h-5 text-cyber-purple" />,
      title: 'Modern Front-End Interfaces',
      description: 'Building clean, high-performance user interfaces with React, modular component structures, and responsive layouts.',
    },
    {
      icon: <Code className="w-5 h-5 text-cyber-cyan" />,
      title: 'TypeScript & Clean Architecture',
      description: 'Writing strictly-typed, scalable code to eliminate runtime errors and maintain predictable application state.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-cyber-violet" />,
      title: 'Hands-on Practical Engineering',
      description: 'Developing complete practical applications, from e-commerce platforms like Mazag Coffee to IoT hardware systems.',
    },
    {
      icon: <Rocket className="w-5 h-5 text-emerald-400" />,
      title: 'Continuous Growth & Learning',
      description: 'Constantly exploring cutting-edge web technologies, 3D WebGL interactions, and modern developer tooling.',
    },
  ];

  return (
    <section id="about" className="relative py-24 bg-dark-950/70 border-t border-slate-900 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-cyber-purple/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyber-blue/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            About Me
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Crafting Digital Experiences with <span className="bg-gradient-to-r from-cyber-purple to-cyber-cyan bg-clip-text text-transparent">Purpose & Code</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Front-End Developer focused on modern React web applications, intuitive UX, and hands-on projects.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 rounded-2xl bg-dark-900/60 border border-slate-800/80 backdrop-blur-xl shadow-glass relative overflow-hidden group">
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-cyber-purple via-cyber-blue to-cyber-cyan" />
              
              <h3 className="text-xl font-bold text-white font-display mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyber-cyan" />
                Engineering Philosophy
              </h3>

              <div className="space-y-4 text-slate-300 leading-relaxed text-base">
                <p>
                  {profile.about}
                </p>
                <p>
                  I specialize in turning UI/UX concepts into responsive, accessible, and fast web products. I believe that thoughtful architecture, clean component hierarchies, and interactive polish are what distinguish ordinary websites from truly memorable digital experiences.
                </p>
              </div>

              {/* Highlights checkmarks */}
              <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>React & TypeScript Ecosystem</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Responsive Design Systems</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Micro-interactions & 3D Web</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Clean & Maintainable Code</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coreFocusAreas.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-dark-900/40 border border-slate-800/70 hover:border-slate-700 hover:bg-dark-900/80 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h4 className="text-base font-bold text-white mb-2 font-display group-hover:text-cyber-cyan transition-colors">
                  {item.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

