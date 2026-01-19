import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debugging: Check if keys are loaded
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase Environment Variables are missing!')
    console.log('URL:', supabaseUrl)
    console.log('Key:', supabaseAnonKey ? 'Loaded' : 'Missing')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
