import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://splnejcmpdmltvlalnvx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbG5lamNtcGRtbHR2bGFsbnZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4MTQ5MTgsImV4cCI6MjA1MDM5MDkxOH0.0dWRxAJbNou0orc6E_x_1v7dQwVzywVnklUgVRRYXhU';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});