import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types/portfolio';
import { ExternalLink, Github, Sparkles, Eye, Layers } from 'lucide-react';

interface ProjectsProps {
  onSelectProject: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onSelectProject }) => {
  const { projects } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="relative py-24 bg-dark-950/80 border-t border-slate-900 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyber-purple/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Selected Work
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Featured <span className="bg-gradient-to-r from-cyber-purple via-cyber-violet to-cyber-cyan bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            A showcase of web applications and interactive systems built with React and modern frontend tools.
          </p>

          {/* Category Tabs */}
          {categories.length > 1 && (
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
          )}
        </div>

        {/* Projects Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-2xl bg-dark-900/60 border border-slate-800/80 hover:border-cyber-purple/50 transition-all duration-500 overflow-hidden flex flex-col shadow-glass hover:shadow-2xl hover:shadow-cyber-purple/10"
            >
              {/* Media Preview Box */}
              <div 
                onClick={() => onSelectProject(project)}
                className="relative aspect-video w-full overflow-hidden bg-black/60 cursor-pointer"
              >
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';
                  }}
                />

                {/* Gradient shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                {/* Category Badge overlay */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wide bg-dark-900/90 text-cyber-purple border border-cyber-purple/40 backdrop-blur-md">
                    {project.category}
                  </span>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-xs">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-purple text-white text-xs font-semibold shadow-glow-purple scale-95 group-hover:scale-100 transition-transform">
                    <Eye className="w-4 h-4" />
                    View Details & Gallery
                  </span>
                </div>
              </div>

              {/* Project Information */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 
                      onClick={() => onSelectProject(project)}
                      className="text-2xl font-bold text-white font-display hover:text-cyber-cyan cursor-pointer transition-colors"
                    >
                      {project.name}
                    </h3>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack Pills */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-dark-850 border border-slate-800 text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions / Links */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-cyber-purple/20 text-cyber-purple hover:bg-cyber-purple hover:text-white border border-cyber-purple/40 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live Demo
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono text-slate-500 bg-slate-900 border border-slate-800/80">
                          Demo Unavailable
                        </span>
                      )}

                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/80 transition-all"
                        >
                          <Github className="w-3.5 h-3.5" />
                          Source
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono text-slate-500 bg-slate-900 border border-slate-800/80">
                          Code Private
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onSelectProject(project)}
                      className="text-xs font-semibold text-cyber-cyan hover:text-white transition-colors flex items-center gap-1"
                    >
                      Gallery ({project.screenshots?.length || 1})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

