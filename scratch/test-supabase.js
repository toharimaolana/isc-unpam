import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  console.log("Testing supabase query...")
  const { data, error } = await supabase
    .from('members')
    .select('id')
    
  if (error) {
    console.error("Error from Supabase:", error)
  } else {
    console.log("Success! Data:", data)
  }
}

test()
