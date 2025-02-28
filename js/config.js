import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const SUPABASE_URL = 'https://twxrfjjeztbgyjxftyec.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3eHJmamplenRiZ3lqeGZ0eWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNTgzMzQsImV4cCI6MjA1MTgzNDMzNH0.A5Rh4yrDJpQqsDDKxjHcXWbXcwwhkL3kTEu1QaeCsfg';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

export { supabaseClient };