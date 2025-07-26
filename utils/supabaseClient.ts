import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseConfig';

// Initialize Supabase client with environment variables
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export as supabaseClient for backward compatibility
export const supabaseClient = supabase;

// Function to check if Supabase is properly configured
export const checkSupabaseConnection = async () => {
  try {
    // Test the connection by trying to get the current session
    const { error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    return true;
  } catch (e) {
    console.error('Supabase connection check failed:', e);
    return false;
  }
};