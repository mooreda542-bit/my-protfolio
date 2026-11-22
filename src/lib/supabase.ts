import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const ADMIN_EMAIL = 'mooreda542@gmail.com';

// Helper to detect if a key is accidentally a Supabase service-role secret key or new secret key
export const isServiceRoleKey = (key: string): boolean => {
  if (!key) return false;
  const normalizedKey = key.trim().toLowerCase();

  // Block new Supabase Secret Keys (case-insensitive)
  if (normalizedKey.startsWith('sb_secret_')) {
    return true;
  }

  // Preserve legacy JWT service_role inspection
  try {
    const parts = key.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      return payload.role === 'service_role';
    }
  } catch {
    // not a standard JWT or cannot parse
  }

  return normalizedKey.includes('service_role');
};

// Get Supabase credentials from environment variables or custom local storage settings
export const getSupabaseCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('custom_supabase_url') : null;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('custom_supabase_key') : null;

  const url = (storedUrl || envUrl).trim();
  const anonKey = (storedKey || envKey).trim();

  // Reject service_role keys immediately to prevent security exposure
  if (isServiceRoleKey(anonKey)) {
    console.error('SECURITY WARNING: Service-role key detected! Service keys must NEVER be exposed in client code.');
    return { url, anonKey: '', isValid: false, isServiceKeyBlocked: true };
  }

  const isValid = Boolean(
    url &&
    anonKey &&
    !url.includes('your-project-id') &&
    url.startsWith('https://')
  );

  return { url, anonKey, isValid, isServiceKeyBlocked: false };
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
          detectSessionInUrl: true,
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
    // Verify that user is authenticated before attempting storage upload
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('Upload rejected: User is not authenticated.');
      return null;
    }

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
