import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Hero3DCanvas } from '../3d/Hero3DCanvas';
import { ArrowDown, Code2, MapPin, Sparkles, FolderGit2, Mail } from 'lucide-react';

export const Hero: React.FC = () => {
  const { profile } = usePortfolio();

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* 3D Background Canvas */}
      <Hero3DCanvas />

      {/* Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/90 backdrop-blur-md shadow-glass">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-medium text-slate-300">
                Available for Front-End Projects
              </span>
            </div>

            {/* Main Headings */}
            <div className="space-y-3">
              <p className="text-cyber-cyan font-mono text-sm sm:text-base tracking-wider uppercase font-semibold flex items-center justify-center lg:justify-start gap-2">
                <Code2 className="w-4 h-4" />
                {profile.heroGreeting}
              </p>
              
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.1]">
                Crafting <span className="bg-gradient-to-r from-cyber-purple via-cyber-violet to-cyber-cyan bg-clip-text text-transparent">Interactive</span> 3D Digital Experiences
              </h1>

              <div className="pt-1 flex items-center justify-center lg:justify-start gap-3">
                <span className="px-3 py-1 rounded-lg bg-cyber-purple/15 text-cyber-purple text-sm font-semibold border border-cyber-purple/30">
                  {profile.title}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {profile.location}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              {profile.heroDescription}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-cyber-purple to-cyber-blue text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <FolderGit2 className="w-4 h-4" />
                View My Projects
              </a>

              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold bg-dark-900/90 text-slate-200 border border-slate-700/80 hover:bg-slate-800/80 hover:border-slate-600 hover:text-white transition-all backdrop-blur-md"
              >
                <Mail className="w-4 h-4 text-cyber-cyan" />
                Contact Me
              </a>
            </div>

            {/* Tech highlight pills */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-mono text-slate-400">
              <span className="text-slate-500 font-semibold uppercase tracking-wider mr-1">Stack:</span>
              <span className="px-2.5 py-1 rounded-md bg-dark-900/60 border border-slate-800 text-slate-300">React</span>
              <span className="px-2.5 py-1 rounded-md bg-dark-900/60 border border-slate-800 text-slate-300">TypeScript</span>
              <span className="px-2.5 py-1 rounded-md bg-dark-900/60 border border-slate-800 text-slate-300">Three.js</span>
              <span className="px-2.5 py-1 rounded-md bg-dark-900/60 border border-slate-800 text-slate-300">Tailwind CSS</span>
            </div>
          </div>

          {/* Right Column: Real Profile Photograph in 3D Cyber Frame */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative group">
              
              {/* Outer decorative neon glow rings */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-cyber-purple via-cyber-indigo to-cyber-cyan rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-glow" />
              
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyber-purple/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-cyber-cyan/20 rounded-full blur-2xl pointer-events-none" />

              {/* Card Container */}
              <div className="relative w-72 sm:w-80 md:w-88 aspect-[3/4] rounded-2xl p-2 bg-gradient-to-b from-slate-800/90 to-dark-950/90 border border-slate-700/60 shadow-2xl backdrop-blur-xl overflow-hidden">
                
                {/* Photo container */}
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-dark-900">
                  <img
                    src={profile.photoUrl}
                    alt={profile.displayName}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/mohamed-reda.jpg';
                    }}
                  />

                  {/* Subtle gradient vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent opacity-80" />

                  {/* Floating badge inside photo */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-dark-900/80 border border-slate-700/70 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold text-sm font-display tracking-wide">{profile.displayName}</p>
                        <p className="text-cyber-cyan text-xs font-mono">{profile.title}</p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-cyber-purple/20 border border-cyber-purple/40 flex items-center justify-center text-cyber-purple">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="pt-16 pb-4 flex justify-center">
          <a
            href="#about"
            className="flex flex-col items-center gap-2 text-slate-500 hover:text-cyber-cyan transition-colors group"
            aria-label="Scroll to About section"
          >
            <span className="text-xs font-mono uppercase tracking-widest">Scroll Down</span>
            <div className="w-6 h-10 rounded-full border-2 border-slate-700 group-hover:border-cyber-cyan flex items-start justify-center p-1.5 transition-colors">
              <div className="w-1.5 h-2.5 bg-cyber-purple rounded-full animate-bounce" />
            </div>
          </a>
        </div>

      </div>
    </section>
  );
};

