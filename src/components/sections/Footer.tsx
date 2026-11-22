import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ArrowUp, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { profile } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-dark-950 border-t border-slate-900 py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-display font-extrabold text-xl text-white tracking-tight">
              {profile.displayName}
            </span>
            <p className="text-xs text-slate-400 font-mono mt-1">
              {profile.title} &bull; {profile.location}
            </p>
          </div>

          {/* Technology Badges */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>Built with React</span>
            <span>&bull;</span>
            <span>TypeScript</span>
            <span>&bull;</span>
            <span>Three.js</span>
            <span>&bull;</span>
            <span>Tailwind</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="text-xs font-mono text-slate-500 hover:text-cyber-purple flex items-center gap-1.5 transition-colors p-2 rounded-lg hover:bg-slate-900"
              title="Admin CMS"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-dark-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-slate-900 text-center text-xs text-slate-600 font-mono">
          &copy; {new Date().getFullYear()} {profile.displayName}. All rights reserved. Only telephone, email, and GitHub are maintained as official contact methods.
        </div>
      </div>
    </footer>
  );
};

