import { createClient, SupabaseClient } from '@supabase/supabase-js'

const isProduction = import.meta.env.PROD

// 生产环境从 sessionStorage 读，非生产环境用环境变量
const supabaseUrl = isProduction
  ? sessionStorage.getItem('SUPABASE_URL') || ''
  : import.meta.env.VITE_SUPABASE_URL

const supabaseKey = isProduction
  ? sessionStorage.getItem('SUPABASE_ANON_KEY') || ''
  : import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)
