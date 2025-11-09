import { createClient } from '@supabase/supabase-js';

type SupabaseRuntimeConfig = {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
};

const readRuntimeConfig = <
  Key extends keyof SupabaseRuntimeConfig,
  EnvKey extends 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY',
>(
  key: Key,
  envKey: EnvKey
): string => {
  if (typeof window !== 'undefined') {
    const runtime = window as Window & SupabaseRuntimeConfig;
    const value = runtime[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }

  const envValue = import.meta.env[envKey];
  return typeof envValue === 'string' ? envValue : '';
};

const supabaseUrl = readRuntimeConfig('SUPABASE_URL', 'VITE_SUPABASE_URL');
const supabaseAnonKey = readRuntimeConfig(
  'SUPABASE_ANON_KEY',
  'VITE_SUPABASE_ANON_KEY'
);

// Fail fast if credentials are missing - prevents silent failures and security issues
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage =
    '❌ Missing Supabase credentials. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local';
  console.error(errorMessage);
  // In development, throw error to make the issue immediately visible
  // In production (Cloud Run), this should never happen as secrets are injected
  if (import.meta.env.DEV) {
    throw new Error(errorMessage);
  }
}

export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
};

export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Get Google OAuth Client ID for Supabase Sign-in
