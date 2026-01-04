import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get these from your Supabase project settings
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://xpisakzvqushpbdqjamm.supabase.co";
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwaXNha3p2cXVzaHBiZHFqYW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjYxMTksImV4cCI6MjA3NzU0MjExOX0.JbH1q80xVI8T5wb2LGuk9rwJWCv1EOtoIi9eROmez6w";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper functions
export const isSupabaseConfigured = () => {
  return SUPABASE_URL !== "https://xpisakzvqushpbdqjamm.supabase.co" && 
         SUPABASE_KEY !== "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwaXNha3p2cXVzaHBiZHFqYW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjYxMTksImV4cCI6MjA3NzU0MjExOX0.JbH1q80xVI8T5wb2LGuk9rwJWCv1EOtoIi9eROmez6w";
};


