import React, { useState } from 'react';
import { Project } from '../../types/portfolio';
import { X, ExternalLink, Github, ChevronLeft, ChevronRight, Layers, Sparkles } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = project.screenshots && project.screenshots.length > 0
    ? project.screenshots
    : [project.image];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-dark-900 border border-slate-800/80 rounded-2xl shadow-2xl shadow-cyber-purple/10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-dark-900/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30">
              {project.category}
            </span>
            <h3 className="text-xl font-bold text-white font-display">{project.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gallery / Main view */}
        <div className="relative bg-black/50 aspect-video w-full overflow-hidden flex items-center justify-center border-b border-slate-800/60">
          <img
            src={images[activeImageIndex]}
            alt={`${project.name} screenshot ${activeImageIndex + 1}`}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Graceful placeholder fallback if external image fails
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';
            }}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-cyber-purple text-white transition-colors border border-white/10 backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-cyber-purple text-white transition-colors border border-white/10 backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === activeImageIndex
                        ? 'bg-cyber-cyan w-6'
                        : 'bg-white/40 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail selector */}
        {images.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto border-b border-slate-800/60 bg-dark-950/50">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === activeImageIndex
                    ? 'border-cyber-purple shadow-glow-purple scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Project Details */}
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-slate-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyber-purple" />
              About Project
            </h4>
            <p className="text-slate-300 leading-relaxed text-base">
              {project.description}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-slate-400 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyber-cyan" />
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800/80 text-slate-200 border border-slate-700/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-4">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-blue text-white font-medium hover:opacity-95 transition-all shadow-glow-purple"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/40 text-slate-500 text-sm border border-slate-800 cursor-not-allowed">
                <ExternalLink className="w-4 h-4" />
                Live Demo Unavailable
              </span>
            )}

            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700/80 transition-all hover:text-white"
              >
                <Github className="w-4 h-4" />
                Source Code
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/40 text-slate-500 text-sm border border-slate-800 cursor-not-allowed">
                <Github className="w-4 h-4" />
                Code Repository Private
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

