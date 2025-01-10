import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kjlipbbrbwdzqiwvrnpw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbGlwYmJyYndkenFpd3ZybnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI5NTkyMzMsImV4cCI6MjAzODUzNTIzM30.EkxpPDyk_GwMR7ep-kGv3Yd5-fYYROD3gkGxSDrIc6g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});