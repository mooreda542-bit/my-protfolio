import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables or custom local storage settings
export const getSupabaseCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('custom_supabase_url') : null;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('custom_supabase_key') : null;

  const url = storedUrl || envUrl;
  const anonKey = storedKey || envKey;

  const isValid = Boolean(
    url &&
    anonKey &&
    !url.includes('your-project-id') &&
    url.startsWith('https://')
  );

  return { url, anonKey, isValid };
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const { url, anonKey, isValid } = getSupabaseCredentials();

  if (!isValid) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseInstance;
};

export const resetSupabaseInstance = () => {
  supabaseInstance = null;
};

export const uploadAssetToSupabase = async (file: File): Promise<string | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Exception during asset upload:', error);
    return null;
  }
};

