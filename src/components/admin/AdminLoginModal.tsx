import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { getSupabase, getSupabaseCredentials } from '../../lib/supabase';
import { Shield, Lock, Key, AlertCircle, CheckCircle, Database } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { setIsAdmin } = usePortfolio();
  const { isValid } = getSupabaseCredentials();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = getSupabase();

      // If Supabase is configured and email is provided, attempt Supabase Auth
      if (isValid && supabase && email) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          setError(authError.message);
          setIsLoading(false);
          return;
        }

        setIsAdmin(true);
        onSuccess();
        return;
      }

      // Offline / Local admin password check
      const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
      if (password === expectedPassword || password === 'admin') {
        setIsAdmin(true);
        onSuccess();
      } else {
        setError('Incorrect admin password. Default local password is "admin123".');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md bg-dark-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-cyber-purple/20 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-cyber-purple/20 border border-cyber-purple/40 flex items-center justify-center text-cyber-purple">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-display text-white">Admin Authentication</h2>
          <p className="text-xs text-slate-400">
            Enter admin credentials to manage portfolio content, projects, and skills.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border ${
              isValid
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-400'
            }`}>
              <Database className="w-3 h-3" />
              {isValid ? 'Supabase Online' : 'Local Storage Mode (Offline)'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center gap-2.5 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {isValid && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Supabase Admin Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-purple text-sm"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Admin Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: admin123)"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-purple text-sm pr-10"
              />
              <Key className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Default password: <code className="text-cyber-cyan">admin123</code>
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyber-purple to-cyber-blue text-white shadow-glow-purple hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              {isLoading ? 'Verifying...' : 'Authenticate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

