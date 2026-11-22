import { PortfolioData, Profile, Project, Skill } from '../types/portfolio';
import { INITIAL_DATA } from './defaultData';
import { getSupabase, getSupabaseCredentials } from './supabase';

export const STORAGE_KEY = 'mohamed_reda_portfolio_data_v1';

// Validate standard RFC 4122 UUID
export const isUUID = (id: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

// Generate an RFC 4122 v4 UUID reliably in all environments
export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Explicit Cloud Deletion: Project
export const deleteProjectFromCloud = async (id: string): Promise<boolean> => {
  if (!id || typeof id !== 'string' || !isUUID(id)) {
    throw new Error(`Invalid project ID for cloud deletion: "${id}". A valid RFC 4122 UUID is required.`);
  }

  const supabase = getSupabase();
  if (!supabase) {
    // Offline / local mode
    return true;
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete project from cloud: ${error.message}`);
  }

  return true;
};

// Explicit Cloud Deletion: Skill
export const deleteSkillFromCloud = async (id: string): Promise<boolean> => {
  if (!id || typeof id !== 'string' || !isUUID(id)) {
    throw new Error(`Invalid skill ID for cloud deletion: "${id}". A valid RFC 4122 UUID is required.`);
  }

  const supabase = getSupabase();
  if (!supabase) {
    // Offline / local mode
    return true;
  }

  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete skill from cloud: ${error.message}`);
  }

  return true;
};

export const loadPortfolioData = async (): Promise<{ data: PortfolioData; source: 'supabase' | 'local' }> => {
  const { isValid } = getSupabaseCredentials();
  const supabase = getSupabase();

  if (isValid && supabase) {
    try {
      // 1. Fetch Profile
      const { data: profileRows, error: profileErr } = await supabase
        .from('profile')
        .select('*')
        .limit(1);

      // 2. Fetch Projects
      const { data: projectRows, error: projectErr } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });

      // 3. Fetch Skills
      const { data: skillRows, error: skillErr } = await supabase
        .from('skills')
        .select('*')
        .order('order_index', { ascending: true });

      if (!profileErr && !projectErr && !skillErr && profileRows && profileRows.length > 0) {
        const p = profileRows[0];
        const loadedProfile: Profile = {
          name: p.name || INITIAL_DATA.profile.name,
          displayName: p.display_name || INITIAL_DATA.profile.displayName,
          title: p.title || INITIAL_DATA.profile.title,
          location: p.location || INITIAL_DATA.profile.location,
          phone: p.phone || INITIAL_DATA.profile.phone,
          email: p.email || INITIAL_DATA.profile.email,
          github: p.github || INITIAL_DATA.profile.github,
          about: p.about || INITIAL_DATA.profile.about,
          photoUrl: p.photo_url || INITIAL_DATA.profile.photoUrl,
          heroGreeting: p.hero_greeting || INITIAL_DATA.profile.heroGreeting,
          heroDescription: p.hero_description || INITIAL_DATA.profile.heroDescription,
        };

        const loadedProjects: Project[] = (projectRows || []).map((row: any) => ({
          id: row.id,
          name: row.name,
          category: row.category,
          description: row.description,
          technologies: row.technologies || [],
          image: row.image,
          screenshots: row.screenshots || [row.image],
          liveUrl: row.live_url || '',
          githubUrl: row.github_url || '',
          featured: row.featured || false,
        }));

        const loadedSkills: Skill[] = (skillRows || []).map((row: any) => ({
          id: row.id,
          name: row.name,
          category: row.category,
          description: row.description,
        }));

        const cloudData: PortfolioData = {
          profile: loadedProfile,
          projects: loadedProjects.length > 0 ? loadedProjects : INITIAL_DATA.projects,
          skills: loadedSkills.length > 0 ? loadedSkills : INITIAL_DATA.skills,
        };

        // Cache in localStorage for offline availability
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
        return { data: cloudData, source: 'supabase' };
      }
    } catch (err) {
      console.warn('Failed to load from Supabase, falling back to local storage:', err);
    }
  }

  // Fallback to localStorage
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      return { data: parsed, source: 'local' };
    }
  } catch (e) {
    console.error('Error reading localStorage', e);
  }

  // Initial state save
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
  return { data: INITIAL_DATA, source: 'local' };
};

export const savePortfolioData = async (data: PortfolioData): Promise<PortfolioData> => {
  const supabase = getSupabase();
  if (!supabase) {
    // Offline / local mode: update localStorage immediately and return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed saving to localStorage in offline mode', e);
    }
    return data;
  }

  // Clone data object to prevent unexpected mutations during sync
  const syncedData: PortfolioData = {
    profile: { ...data.profile },
    projects: data.projects.map((p) => ({ ...p, technologies: [...p.technologies], screenshots: [...(p.screenshots || [])] })),
    skills: data.skills.map((s) => ({ ...s })),
  };

  try {
    // 1. Sync Profile (upsert only)
    const { error: profileError } = await supabase.from('profile').upsert({
      id: 'main',
      name: syncedData.profile.name,
      display_name: syncedData.profile.displayName,
      title: syncedData.profile.title,
      location: syncedData.profile.location,
      phone: syncedData.profile.phone,
      email: syncedData.profile.email,
      github: syncedData.profile.github,
      about: syncedData.profile.about,
      photo_url: syncedData.profile.photoUrl,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      throw new Error(`Profile sync error: ${profileError.message}`);
    }

    // 2. Synchronize Project Inserts / Updates (Explicit upsert only; never delete cloud projects during save)
    for (let i = 0; i < syncedData.projects.length; i++) {
      const proj = syncedData.projects[i];
      const validUUID = isUUID(proj.id);

      const projectPayload: any = {
        name: proj.name,
        category: proj.category,
        description: proj.description,
        technologies: proj.technologies,
        image: proj.image,
        screenshots: proj.screenshots,
        live_url: proj.liveUrl || null,
        github_url: proj.githubUrl || null,
        featured: proj.featured || false,
        order_index: i,
        updated_at: new Date().toISOString(),
      };

      if (validUUID) {
        projectPayload.id = proj.id;
      }

      const { data: savedProj, error: projErr } = await supabase
        .from('projects')
        .upsert(projectPayload)
        .select('id')
        .single();

      if (projErr) {
        throw new Error(`Project sync error on "${proj.name}": ${projErr.message}`);
      }

      // If Supabase generated or confirmed the UUID, keep client state in sync
      if (savedProj?.id && savedProj.id !== proj.id) {
        proj.id = savedProj.id;
      }
    }

    // 3. Synchronize Skills Inserts / Updates (Explicit upsert only; never delete cloud skills during save)
    for (let i = 0; i < syncedData.skills.length; i++) {
      const skill = syncedData.skills[i];
      const validUUID = isUUID(skill.id);

      const skillPayload: any = {
        name: skill.name,
        category: skill.category,
        order_index: i,
      };

      if (validUUID) {
        skillPayload.id = skill.id;
      }

      const { data: savedSkill, error: skillErr } = await supabase
        .from('skills')
        .upsert(skillPayload)
        .select('id')
        .single();

      if (skillErr) {
        throw new Error(`Skill sync error on "${skill.name}": ${skillErr.message}`);
      }

      // If Supabase assigned or confirmed the UUID, update local ID
      if (savedSkill?.id && savedSkill.id !== skill.id) {
        skill.id = savedSkill.id;
      }
    }

    // 4. Update localStorage ONLY after cloud persistence succeeds
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(syncedData));
    } catch (e) {
      console.error('Failed saving to localStorage after successful cloud sync', e);
    }

    return syncedData;
  } catch (err: any) {
    console.error('Critical sync error with Supabase:', err);
    throw err; // Propagate error so caller displays true state and cache is not corrupted
  }
};
