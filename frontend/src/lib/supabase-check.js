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
      console.log('✅ Connection: OK')
    } else {
      console.log('❌ Connection: FAILED', error.message)
    }
  } catch (error) {
    console.log('❌ Connection: FAILED', error.message)
  }

  // 2. Check auth
  try {
    const { data: { session } } = await supabase.auth.getSession()
    results.auth = session !== null
    console.log(results.auth ? '✅ Auth: User logged in' : '⚠️  Auth: No user logged in (expected if not signed in)')
  } catch (error) {
    console.log('❌ Auth: FAILED', error.message)
  }

  // 3. Check tables
  const tables = ['profiles', 'voice_clones', 'audio_recordings', 'voice_settings', 'custom_phrases']
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('count').limit(1)
      if (!error || error.code === 'PGRST116') {
        results.tables[table] = true
        console.log(`✅ Table "${table}": EXISTS`)
      } else if (error.code === '42P01') {
        results.tables[table] = false
        console.log(`❌ Table "${table}": NOT FOUND`)
      } else {
        results.tables[table] = false
        console.log(`❌ Table "${table}": ERROR - ${error.message}`)
      }
    } catch (error) {
      results.tables[table] = false
      console.log(`❌ Table "${table}": ERROR - ${error.message}`)
    }
  }

  // 4. Check storage bucket
  try {
    const { data, error } = await supabase.storage.getBucket('audio-recordings')
    if (!error && data) {
      results.storage = true
      console.log('✅ Storage bucket "audio-recordings": EXISTS')
    } else {
      results.storage = false
      console.log('❌ Storage bucket "audio-recordings": NOT FOUND')
    }
  } catch (error) {
    results.storage = false
    console.log('❌ Storage bucket: ERROR', error.message)
  }

  // Summary
  console.log('\n📊 Summary:')
  const allTablesExist = Object.values(results.tables).every(v => v === true)
  
  if (results.connection && allTablesExist && results.storage) {
    console.log('✅ Supabase is fully configured and ready!')
  } else {
    console.log('⚠️  Supabase needs configuration:')
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
