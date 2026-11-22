import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types/portfolio';
import { ProfileManager } from './ProfileManager';
import { ProjectManager } from './ProjectManager';
import { SkillManager } from './SkillManager';
import { SupabaseSettingsModal } from './SupabaseSettingsModal';
import { User, FolderGit2, Wrench, Database, LogOut, ArrowLeft, Shield, Sparkles } from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
  onPreviewProject: (project: Project) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onShowToast, onPreviewProject }) => {
  const { profile, setIsAdmin, storageSource, isSyncing } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'cloud'>('profile');

  const handleLogout = () => {
    setIsAdmin(false);
    onShowToast('Logged out of Admin Dashboard');
    onClose();
  };

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
                {profile.displayName} &bull; {storageSource === 'supabase' ? 'Supabase Connected' : 'Local Storage'}
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
            <span>Logout</span>
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

