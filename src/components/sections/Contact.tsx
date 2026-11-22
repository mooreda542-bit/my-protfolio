import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Phone, Mail, Github, MapPin, Copy, Check, Send, Sparkles, ArrowUpRight } from 'lucide-react';

interface ContactProps {
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const Contact: React.FC<ContactProps> = ({ onShowToast }) => {
  const { profile } = usePortfolio();
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Quick inquiry message form state
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');

  const copyToClipboard = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
      onShowToast('Phone number copied to clipboard!');
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
      onShowToast('Email address copied to clipboard!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !message) {
      onShowToast('Please fill in all message fields', 'error');
      return;
    }

    // Direct mailto trigger
    const subject = encodeURIComponent(`Portfolio Inquiry from ${senderName}`);
    const body = encodeURIComponent(`Name: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${message}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;

    onShowToast('Preparing email in your default mail app...');
    setSenderName('');
    setSenderEmail('');
    setMessage('');
  };

  return (
    <section id="contact" className="relative py-24 bg-dark-950 border-t border-slate-900 overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-cyber-purple/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Let's Build Something <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple bg-clip-text text-transparent">Remarkable</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Have a project in mind, an opportunity to discuss, or just want to connect? Reach out directly.
          </p>
        </div>

        {/* Contact Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Direct Contact Cards (Left column) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Phone Card */}
            <div className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800/80 hover:border-cyber-purple/50 transition-all duration-300 shadow-glass flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyber-purple/15 border border-cyber-purple/30 flex items-center justify-center text-cyber-purple group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Phone / WhatsApp</p>
                  <a
                    href={`tel:${profile.phone}`}
                    className="text-base sm:text-lg font-bold text-white hover:text-cyber-cyan transition-colors font-mono"
                  >
                    {profile.phone}
                  </a>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(profile.phone, 'phone')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors"
                title="Copy phone number"
                aria-label="Copy phone number"
              >
                {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Email Card */}
            <div className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800/80 hover:border-cyber-cyan/50 transition-all duration-300 shadow-glass flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Email Address</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-sm sm:text-base font-bold text-white hover:text-cyber-cyan transition-colors font-mono truncate block"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(profile.email, 'email')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors shrink-0"
                title="Copy email address"
                aria-label="Copy email address"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* GitHub Profile Card */}
            <div className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 shadow-glass flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-200 group-hover:scale-110 transition-transform">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Code Repository</p>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base sm:text-lg font-bold text-white hover:text-cyber-cyan transition-colors flex items-center gap-1.5"
                  >
                    GitHub Profile
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* Location Pill */}
            <div className="p-5 rounded-2xl bg-dark-900/30 border border-slate-800/60 flex items-center gap-3 text-slate-400 text-sm">
              <MapPin className="w-5 h-5 text-rose-400 shrink-0" />
              <span>Based in <strong className="text-slate-200">{profile.location}</strong></span>
            </div>

          </div>

          {/* Quick Message Form (Right column) */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl bg-dark-900/60 border border-slate-800/80 backdrop-blur-xl shadow-glass relative">
              <h3 className="text-xl font-bold text-white font-display mb-2">Send a Direct Message</h3>
              <p className="text-slate-400 text-sm mb-6">
                Fill in the form below and click send to trigger an email message instantly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Your Name</label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-purple text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Your Email</label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-purple text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hello Mohamed, I would like to discuss..."
                    className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-purple text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-cyber-purple to-cyber-blue text-white shadow-glow-purple hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message via Email
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

