import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kjlipbbrbwdzqiwvrnpw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbGlwYmJyYndkenFpd3ZybnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ5MDc1NzAsImV4cCI6MjAyMDQ4MzU3MH0.qgDqGMXUGQfVxN6TqnwmxuYOe_OJ1dVLJnQPg5zQVwY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});