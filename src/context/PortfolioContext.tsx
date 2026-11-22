import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PortfolioData, Profile, Project, Skill } from '../types/portfolio';
import { INITIAL_DATA } from '../lib/defaultData';
import { loadPortfolioData, savePortfolioData } from '../lib/storage';

interface PortfolioContextType {
  data: PortfolioData;
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  storageSource: 'supabase' | 'local';
  isSyncing: boolean;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
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
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('portfolio_admin_logged_in') === 'true';
  });

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

  useEffect(() => {
    refreshData();
  }, []);

  const handleSetIsAdmin = (val: boolean) => {
    setIsAdmin(val);
    if (val) {
      sessionStorage.setItem('portfolio_admin_logged_in', 'true');
    } else {
      sessionStorage.removeItem('portfolio_admin_logged_in');
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    const updatedProfile = { ...data.profile, ...updates };
    const newData: PortfolioData = { ...data, profile: updatedProfile };
    setData(newData);
    await savePortfolioData(newData);
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    const newId = 'proj_' + Date.now();
    const newProject: Project = { ...project, id: newId };
    const newData: PortfolioData = {
      ...data,
      projects: [newProject, ...data.projects],
    };
    setData(newData);
    await savePortfolioData(newData);
  };

  const updateProject = async (id: string, projectUpdates: Partial<Project>) => {
    const updatedProjects = data.projects.map((p) =>
      p.id === id ? { ...p, ...projectUpdates } : p
    );
    const newData: PortfolioData = { ...data, projects: updatedProjects };
    setData(newData);
    await savePortfolioData(newData);
  };

  const deleteProject = async (id: string) => {
    const updatedProjects = data.projects.filter((p) => p.id !== id);
    const newData: PortfolioData = { ...data, projects: updatedProjects };
    setData(newData);
    await savePortfolioData(newData);
  };

  const addSkill = async (skill: Omit<Skill, 'id'>) => {
    const newId = 'skill_' + Date.now();
    const newSkill: Skill = { ...skill, id: newId };
    const newData: PortfolioData = {
      ...data,
      skills: [...data.skills, newSkill],
    };
    setData(newData);
    await savePortfolioData(newData);
  };

  const updateSkill = async (id: string, skillUpdates: Partial<Skill>) => {
    const updatedSkills = data.skills.map((s) =>
      s.id === id ? { ...s, ...skillUpdates } : s
    );
    const newData: PortfolioData = { ...data, skills: updatedSkills };
    setData(newData);
    await savePortfolioData(newData);
  };

  const deleteSkill = async (id: string) => {
    const updatedSkills = data.skills.filter((s) => s.id !== id);
    const newData: PortfolioData = { ...data, skills: updatedSkills };
    setData(newData);
    await savePortfolioData(newData);
  };

  const resetToDefaults = async () => {
    setData(INITIAL_DATA);
    await savePortfolioData(INITIAL_DATA);
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
        setIsAdmin: handleSetIsAdmin,
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

