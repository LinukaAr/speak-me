// Diagnostic script to check Supabase setup
// Run this to verify your Supabase configuration

import { supabase, db, storage } from './supabase.js'

export async function checkSupabaseSetup() {
  console.log('🔍 Checking Supabase Setup...\n')

  const results = {
    connection: false,
    auth: false,
    tables: {},
    storage: false,
  }

  // 1. Check connection
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    if (!error || error.code === 'PGRST116') {
      results.connection = true
    } else {
    }
  } catch (error) {
  }

  // 2. Check auth
  try {
    const { data: { session } } = await supabase.auth.getSession()
    results.auth = session !== null
  } catch (error) {
  }

  // 3. Check tables
  const tables = ['profiles', 'voice_clones', 'audio_recordings', 'voice_settings', 'custom_phrases']
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('count').limit(1)
      if (!error || error.code === 'PGRST116') {
        results.tables[table] = true
      } else if (error.code === '42P01') {
        results.tables[table] = false
      } else {
        results.tables[table] = false
      }
    } catch (error) {
      results.tables[table] = false
    }
  }

  // 4. Check storage bucket
  try {
    const { data, error } = await supabase.storage.getBucket('audio-recordings')
    if (!error && data) {
      results.storage = true
    } else {
      results.storage = false
    }
  } catch (error) {
    results.storage = false
  }

  // Summary
  const allTablesExist = Object.values(results.tables).every(v => v === true)
  
  if (results.connection && allTablesExist && results.storage) {
  } else {
    if (!results.connection) console.log('   - Fix connection (check API key)')
    if (!allTablesExist) console.log('   - Run database migrations')
    if (!results.storage) console.log('   - Create storage bucket')
  }

  return results
}

// Auto-run in development
if (import.meta.env.DEV) {
  checkSupabaseSetup()
}
