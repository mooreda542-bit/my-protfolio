import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PortfolioData, Profile, Project, Skill } from '../types/portfolio';
import { INITIAL_DATA } from '../lib/defaultData';
import { 
  loadPortfolioData, 
  savePortfolioData, 
  generateUUID, 
  deleteProjectFromCloud, 
  deleteSkillFromCloud, 
  isUUID, 
  STORAGE_KEY 
} from '../lib/storage';
import { getSupabase, getSupabaseCredentials, ADMIN_EMAIL } from '../lib/supabase';

interface PortfolioContextType {
  data: PortfolioData;
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  storageSource: 'supabase' | 'local';
  isSyncing: boolean;
  isAdmin: boolean;
  adminUserEmail: string | null;
  setIsAdmin: (val: boolean) => void;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addSkill: (skill: Omit<Skill, 'id'>) => Promise<void>;
  updateSkill: (id: string, skill: Partial<Skill>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(INITIAL_DATA);
  const [storageSource, setStorageSource] = useState<'supabase' | 'local'>('local');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminUserEmail, setAdminUserEmail] = useState<string | null>(null);

  const refreshData = async () => {
    setIsSyncing(true);
    try {
      const res = await loadPortfolioData();
      setData(res.data);
      setStorageSource(res.source);
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Securely verify admin session on mount and subscribe to auth state changes
  useEffect(() => {
    refreshData();

    const supabase = getSupabase();
    if (!supabase) {
      setIsAdmin(false);
      setAdminUserEmail(null);
      return;
    }

    // 1. Check existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        // Enforce that only the designated admin email receives admin privileges
        const email = session.user.email.toLowerCase();
        if (email === ADMIN_EMAIL.toLowerCase()) {
          setIsAdmin(true);
          setAdminUserEmail(session.user.email);
        } else {
          console.warn(`User ${email} is authenticated but not authorized as admin.`);
          setIsAdmin(false);
          setAdminUserEmail(null);
        }
      } else {
        setIsAdmin(false);
        setAdminUserEmail(null);
      }
    });

    // 2. Listen to real-time auth events (token refresh, sign out, sign in)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        const email = session.user.email.toLowerCase();
        if (email === ADMIN_EMAIL.toLowerCase()) {
          setIsAdmin(true);
          setAdminUserEmail(session.user.email);
        } else {
          setIsAdmin(false);
          setAdminUserEmail(null);
        }
      } else {
        setIsAdmin(false);
        setAdminUserEmail(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Error during Supabase signOut:', e);
      }
    }
    setIsAdmin(false);
    setAdminUserEmail(null);
  };

  // Guard all state mutations against unauthenticated calls
  const assertAdminAuthorized = () => {
    if (!isAdmin) {
      throw new Error('Access Denied: Admin authentication required to perform this action.');
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    assertAdminAuthorized();
    const updatedProfile = { ...data.profile, ...updates };
    const newData: PortfolioData = { ...data, profile: updatedProfile };
    const synced = await savePortfolioData(newData);
    setData(synced);
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    assertAdminAuthorized();
    const newId = generateUUID();
    const newProject: Project = { ...project, id: newId };
    const newData: PortfolioData = {
      ...data,
      projects: [newProject, ...data.projects],
    };
    const synced = await savePortfolioData(newData);
    setData(synced);
  };

  const updateProject = async (id: string, projectUpdates: Partial<Project>) => {
    assertAdminAuthorized();
    const updatedProjects = data.projects.map((p) =>
      p.id === id ? { ...p, ...projectUpdates } : p
    );
    const newData: PortfolioData = { ...data, projects: updatedProjects };
    const synced = await savePortfolioData(newData);
    setData(synced);
  };

  const deleteProject = async (id: string) => {
    assertAdminAuthorized();
    const supabase = getSupabase();
    // Explicit cloud deletion: only for records with remote UUID when Supabase is active
    if (supabase && isUUID(id)) {
      await deleteProjectFromCloud(id);
    }
    const updatedProjects = data.projects.filter((p) => p.id !== id);
    const newData: PortfolioData = { ...data, projects: updatedProjects };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Failed updating localStorage after project deletion:', e);
    }
    setData(newData);
  };

  const addSkill = async (skill: Omit<Skill, 'id'>) => {
    assertAdminAuthorized();
    const newId = generateUUID();
    const newSkill: Skill = { ...skill, id: newId };
    const newData: PortfolioData = {
      ...data,
      skills: [...data.skills, newSkill],
    };
    const synced = await savePortfolioData(newData);
    setData(synced);
  };

  const updateSkill = async (id: string, skillUpdates: Partial<Skill>) => {
    assertAdminAuthorized();
    const updatedSkills = data.skills.map((s) =>
      s.id === id ? { ...s, ...skillUpdates } : s
    );
    const newData: PortfolioData = { ...data, skills: updatedSkills };
    const synced = await savePortfolioData(newData);
    setData(synced);
  };

  const deleteSkill = async (id: string) => {
    assertAdminAuthorized();
    const supabase = getSupabase();
    // Explicit cloud deletion: only for records with remote UUID when Supabase is active
    if (supabase && isUUID(id)) {
      await deleteSkillFromCloud(id);
    }
    const updatedSkills = data.skills.filter((s) => s.id !== id);
    const newData: PortfolioData = { ...data, skills: updatedSkills };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Failed updating localStorage after skill deletion:', e);
    }
    setData(newData);
  };

  const resetToDefaults = async () => {
    assertAdminAuthorized();
    // Safe reset: reset ONLY local state and localStorage cache.
    // Never trigger destructive cloud synchronization or bulk deletions in Supabase.
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    } catch (e) {
      console.error('Failed resetting localStorage to defaults:', e);
    }
    setData(INITIAL_DATA);
    setStorageSource('local');
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        profile: data.profile,
        projects: data.projects,
        skills: data.skills,
        storageSource,
        isSyncing,
        isAdmin,
        adminUserEmail,
        setIsAdmin,
        logout,
        updateProfile,
        addProject,
        updateProject,
        deleteProject,
        addSkill,
        updateSkill,
        deleteSkill,
        resetToDefaults,
        refreshData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
