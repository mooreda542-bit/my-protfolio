import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Menu, X, Shield, Terminal, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  const { profile, isAdmin } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-950/80 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyber-purple via-cyber-indigo to-cyber-cyan p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-glow-purple">
            <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
              <span className="font-display font-black text-lg bg-gradient-to-r from-cyber-purple to-cyber-cyan bg-clip-text text-transparent">
                MR
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-white text-base tracking-tight group-hover:text-cyber-cyan transition-colors">
              {profile.displayName}
            </span>
            <span className="text-[11px] font-mono text-slate-400 tracking-wider">
              {profile.title}
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-dark-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-md shadow-glass">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Admin Dashboard shortcut */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all border ${
              isAdmin
                ? 'bg-cyber-purple/20 border-cyber-purple/60 text-cyber-purple hover:bg-cyber-purple/30'
                : 'bg-dark-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
            title="Open Admin Dashboard"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
            {isAdmin && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
          </button>

          {/* Quick Contact CTA */}
          <a
            href="#contact"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-cyber-purple to-cyber-blue text-white hover:opacity-90 transition-all shadow-glow-purple"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-xl bg-dark-900 border border-slate-800 text-slate-400"
            aria-label="Admin"
          >
            <Shield className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-dark-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-950/95 border-b border-slate-800/80 backdrop-blur-xl px-6 py-6 space-y-4 animate-fade-in">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-300 hover:text-white py-2 border-b border-slate-800/50"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 text-center rounded-xl font-medium bg-gradient-to-r from-cyber-purple to-cyber-blue text-white shadow-glow-purple"
            >
              Contact Me
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 text-center rounded-xl text-xs font-mono bg-dark-900 border border-slate-800 text-slate-300 flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-cyber-purple" />
              Manage Portfolio (Admin)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

