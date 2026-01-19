import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debugging: Check if keys are loaded
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase Environment Variables are missing!')
}

// Prevent crash if keys are missing
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null
