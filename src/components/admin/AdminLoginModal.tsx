import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { getSupabase, getSupabaseCredentials, ADMIN_EMAIL } from '../../lib/supabase';
import { Shield, Lock, Key, AlertCircle, CheckCircle, Database, ExternalLink, Settings, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onOpenSettings?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  onOpenSettings 
}) => {
  const { setIsAdmin } = usePortfolio();
  const { isValid, isServiceKeyBlocked } = getSupabaseCredentials();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Body scroll lock & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = getSupabase();

      if (!isValid || !supabase) {
        setError('Supabase is not configured. For security, default passwords are not allowed. Please configure your Supabase credentials.');
        setIsLoading(false);
        return;
      }

      // 1. Authenticate with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
        return;
      }

      // 2. Enforce authorization: only the designated portfolio admin email is permitted
      const userEmail = data.user?.email?.toLowerCase();
      if (userEmail !== ADMIN_EMAIL.toLowerCase()) {
        await supabase.auth.signOut();
        setError(`Access Denied: Account (${userEmail}) is not authorized as portfolio administrator.`);
        setIsLoading(false);
        return;
      }

      // 3. Authorization succeeded
      setIsAdmin(true);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
    >
      <div 
        className="w-full max-w-md bg-dark-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-cyber-purple/20 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-cyber-purple/20 border border-cyber-purple/40 flex items-center justify-center text-cyber-purple">
            <Shield className="w-6 h-6" />
          </div>
          <h2 id="admin-login-title" className="text-2xl font-bold font-display text-white">Admin Authentication</h2>
          <p className="text-xs text-slate-400">
            Sign in with your verified Supabase Admin credentials.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border ${
              isValid
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-400'
            }`}>
              <Database className="w-3 h-3" />
              {isValid ? 'Supabase Auth Protected' : 'Supabase Not Configured'}
            </span>
          </div>
        </div>

        {isServiceKeyBlocked && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center gap-2.5 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Security Warning: A service-role key was detected and blocked. Use only the public anon key.</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center gap-2.5 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {isValid ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ADMIN_EMAIL}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-purple text-sm"
              />
              <p className="text-[10px] font-mono text-slate-500">
                Authorized account: <span className="text-cyber-cyan">{ADMIN_EMAIL}</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Admin Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your Supabase admin password"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-purple text-sm pr-10"
                />
                <Key className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
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
                {isLoading ? 'Verifying...' : 'Sign In as Admin'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 text-left space-y-2">
              <p className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Security Notice: Hardcoded Passwords Disabled
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                To guarantee production security, default hardcoded passwords have been removed. Admin access requires a verified Supabase account.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-400 space-y-1">
                <p>1. Set <code className="text-cyber-cyan">VITE_SUPABASE_URL</code> in <code className="text-cyber-purple">.env</code></p>
                <p>2. Set <code className="text-cyber-cyan">VITE_SUPABASE_ANON_KEY</code> in <code className="text-cyber-purple">.env</code></p>
                <p>3. Create user <code className="text-emerald-400">{ADMIN_EMAIL}</code> in Supabase Auth</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>

              {onOpenSettings && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSettings();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5 text-cyber-cyan" />
                  Configure Supabase Credentials
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
