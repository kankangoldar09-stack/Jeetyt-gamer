import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.length > 10 && 
  supabaseUrl.includes('.supabase.co') &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl! : 'https://dummy-project.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey! : 'dummy-key',
  {
    auth: {
      persistSession: isSupabaseConfigured,
      autoRefreshToken: isSupabaseConfigured,
    }
  }
);
