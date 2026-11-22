import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types/portfolio';
import { ProfileManager } from './ProfileManager';
import { ProjectManager } from './ProjectManager';
import { SkillManager } from './SkillManager';
import { SupabaseSettingsModal } from './SupabaseSettingsModal';
import { User, FolderGit2, Wrench, Database, LogOut, ArrowLeft, Shield, Sparkles, AlertOctagon, Lock } from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
  onPreviewProject: (project: Project) => void;
  onRequireLogin?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onClose, 
  onShowToast, 
  onPreviewProject,
  onRequireLogin 
}) => {
  const { profile, isAdmin, adminUserEmail, logout, storageSource, isSyncing } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'cloud'>('profile');

  const handleLogout = async () => {
    await logout();
    onShowToast('Logged out of Admin Dashboard successfully.');
    onClose();
  };

  // Strict route/view guard: If user is not authenticated as admin, deny access immediately
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-dark-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-dark-900 border border-rose-500/30 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-display text-white">Access Denied</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              You must be authenticated with verified administrator credentials to view and manage this portfolio.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              Return to Portfolio
            </button>
            {onRequireLogin && (
              <button
                onClick={() => {
                  onClose();
                  onRequireLogin();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyber-purple text-white shadow-glow-purple hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                Authenticate
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: <User className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects Management', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills & Stack', icon: <Wrench className="w-4 h-4" /> },
    { id: 'cloud', label: 'Cloud Sync & Supabase', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-dark-950 overflow-y-auto flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-20 bg-dark-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
            title="Return to Public Portfolio"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Portfolio</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyber-purple/20 border border-cyber-purple/40 flex items-center justify-center text-cyber-purple">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white font-display">
                Admin Control Panel
              </h1>
              <span className="text-[11px] font-mono text-slate-400">
                {profile.displayName} &bull; {adminUserEmail ? `Authenticated: ${adminUserEmail}` : (storageSource === 'supabase' ? 'Supabase Online' : 'Local Storage')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          {isSyncing && (
            <span className="text-xs font-mono text-cyber-cyan flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              Syncing...
            </span>
          )}

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-dark-900/60 border border-slate-800 backdrop-blur-md">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyber-purple to-cyber-blue text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Views */}
        <main className="pb-16">
          {activeTab === 'profile' && <ProfileManager onShowToast={onShowToast} />}
          {activeTab === 'projects' && (
            <ProjectManager onShowToast={onShowToast} onPreviewProject={onPreviewProject} />
          )}
          {activeTab === 'skills' && <SkillManager onShowToast={onShowToast} />}
          {activeTab === 'cloud' && <SupabaseSettingsModal onShowToast={onShowToast} />}
        </main>
      </div>
    </div>
  );
};
