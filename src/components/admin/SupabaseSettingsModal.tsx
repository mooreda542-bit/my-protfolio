import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { getSupabaseCredentials, resetSupabaseInstance, isServiceRoleKey, ADMIN_EMAIL } from '../../lib/supabase';
import { Database, CheckCircle, AlertTriangle, Key, ExternalLink, Download, Upload, Copy, Check, ShieldAlert } from 'lucide-react';

interface SupabaseSettingsModalProps {
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({ onShowToast }) => {
  const { data, isAdmin, refreshData, resetToDefaults } = usePortfolio();
  const credentials = getSupabaseCredentials();

  const [supabaseUrl, setSupabaseUrl] = useState(() => {
    return localStorage.getItem('custom_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '';
  });

  const [supabaseKey, setSupabaseKey] = useState(() => {
    return localStorage.getItem('custom_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  });

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();

    // Block service_role secret keys to protect security
    if (isServiceRoleKey(supabaseKey)) {
      onShowToast('SECURITY ALERT: Never enter your service-role key! Please use only your public anon key.', 'error');
      return;
    }

    if (supabaseUrl) {
      localStorage.setItem('custom_supabase_url', supabaseUrl.trim());
    } else {
      localStorage.removeItem('custom_supabase_url');
    }

    if (supabaseKey) {
      localStorage.setItem('custom_supabase_key', supabaseKey.trim());
    } else {
      localStorage.removeItem('custom_supabase_key');
    }

    resetSupabaseInstance();
    refreshData();
    onShowToast('Supabase settings updated securely! Refreshing connection...');
  };

  const handleExportBackup = () => {
    if (!isAdmin) {
      onShowToast('Unauthorized: Admin access required to export data', 'error');
      return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `mohamed_reda_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Portfolio data backup downloaded!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) {
      onShowToast('Unauthorized: Admin access required to restore data', 'error');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile && parsed.projects && parsed.skills) {
          localStorage.setItem('mohamed_reda_portfolio_data_v1', JSON.stringify(parsed));
          refreshData();
          onShowToast('Portfolio backup restored successfully!');
        } else {
          onShowToast('Invalid backup file format', 'error');
        }
      } catch (err) {
        onShowToast('Failed to parse backup JSON file', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Current Connection Status Box */}
      <div className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              credentials.isValid ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                {credentials.isValid ? 'Supabase Online Cloud Connected' : 'Running in Local Storage Mode'}
              </h3>
              <p className="text-xs text-slate-400">
                {credentials.isValid
                  ? 'All profile updates, projects, and skills are synced with Supabase Database and Storage with strict RLS enforcement.'
                  : 'Portfolio operates using browser local storage. Connect Supabase below to enable authenticated cloud persistence.'}
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
            credentials.isValid
              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
              : 'bg-amber-950/60 text-amber-400 border-amber-500/40'
          }`}>
            {credentials.isValid ? 'Active & Protected' : 'Offline / Unconfigured'}
          </span>
        </div>
      </div>

      {/* Supabase Credentials Configuration Form */}
      <form onSubmit={handleSaveCredentials} className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800 space-y-5">
        <div>
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Key className="w-4 h-4 text-cyber-purple" />
            Supabase Project Credentials
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Provide your Supabase URL and public <span className="text-cyber-cyan font-mono">anon</span> key (Settings &gt; API).
          </p>
        </div>

        {/* Security Warning Notice */}
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Security Rule:</strong> Only use your public <code className="font-mono text-white">anon</code> key. Never paste your <code className="font-mono text-rose-300">service_role</code> secret key in any client application.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Project URL (e.g. https://xyz.supabase.co)</label>
            <input
              type="url"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Anon Public Key</label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyber-cyan hover:underline flex items-center gap-1"
          >
            Create free Supabase project <ExternalLink className="w-3 h-3" />
          </a>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-cyber-purple text-white hover:bg-cyber-purple/90 transition-all shadow-glow-purple"
          >
            Save & Connect Supabase
          </button>
        </div>
      </form>

      {/* SQL Setup Guide & Bucket Info */}
      <div className="p-6 rounded-2xl bg-dark-900/40 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          Database Schema & RLS Security Policies
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          The project includes an updated hardened SQL migration file named <code className="text-cyber-cyan font-mono">supabase_schema.sql</code> in the project root. It configures:
        </p>

        <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside font-mono">
          <li>Public read-only policies for visitors</li>
          <li>Owner-restricted write/update/delete policies bound to <span className="text-cyber-cyan">{ADMIN_EMAIL}</span></li>
          <li>Protected storage bucket <code className="text-cyber-purple">portfolio-assets</code> requiring owner authentication for uploads & deletions</li>
        </ul>
      </div>

      {/* Backup & Restore Controls */}
      <div className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white font-display">Data Backup & Recovery</h4>
        <p className="text-xs text-slate-400">
          Export your entire portfolio as a JSON file or restore a previous snapshot at any time.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-cyber-cyan" />
            Export Portfolio JSON Backup
          </button>

          <label className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center gap-2 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-cyber-purple" />
            Restore JSON Backup
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (window.confirm('Reset all profile, projects, and skills to initial defaults?')) {
                resetToDefaults();
                onShowToast('Reset to original portfolio defaults');
              }
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/40 transition-all"
          >
            Reset to Defaults
          </button>
        </div>
      </div>

    </div>
  );
};
