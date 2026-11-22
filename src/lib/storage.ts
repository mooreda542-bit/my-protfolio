import { PortfolioData, Profile, Project, Skill } from '../types/portfolio';
import { INITIAL_DATA } from './defaultData';
import { getSupabase, getSupabaseCredentials } from './supabase';

const STORAGE_KEY = 'mohamed_reda_portfolio_data_v1';

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

export const savePortfolioData = async (data: PortfolioData): Promise<boolean> => {
  // Always save to localStorage immediately for instant UI response and offline safety
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed saving to localStorage', e);
  }

  const supabase = getSupabase();
  if (!supabase) {
    return true; // saved locally
  }

  try {
    // 1. Sync Profile
    await supabase.from('profile').upsert({
      id: 'main',
      name: data.profile.name,
      display_name: data.profile.displayName,
      title: data.profile.title,
      location: data.profile.location,
      phone: data.profile.phone,
      email: data.profile.email,
      github: data.profile.github,
      about: data.profile.about,
      photo_url: data.profile.photoUrl,
      updated_at: new Date().toISOString(),
    });

    // 2. Sync Projects (upsert)
    for (let i = 0; i < data.projects.length; i++) {
      const proj = data.projects[i];
      await supabase.from('projects').upsert({
        id: proj.id.length > 30 ? proj.id : undefined, // uuid format
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
      });
    }

    return true;
  } catch (err) {
    console.error('Error syncing data with Supabase:', err);
    return false;
  }
};

