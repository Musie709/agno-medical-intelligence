import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnv() {
  try {
    const envPath = join(__dirname, '.env');
    const envContent = readFileSync(envPath, 'utf8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    return env;
  } catch (error) {
    console.error('❌ Error loading .env file:', error.message);
    return {};
  }
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugLogin() {
  console.log('🔍 Debugging login for elsa@agno.org...');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseAnonKey.substring(0, 20) + '...');
  
  try {
    // Test 1: Check if user exists in profiles table
    console.log('\n1️⃣ Checking profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'elsa@agno.org');
      
    if (profilesError) {
      console.error('❌ Profiles error:', profilesError);
    } else {
      console.log('✅ Found profiles:', profiles.length);
      if (profiles.length > 0) {
        console.log('Profile:', profiles[0]);
      }
    }
    
    // Test 2: Try to sign in with the correct password
    console.log('\n2️⃣ Testing sign in...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'elsa@agno.org',
      password: 'Elsa1234@'
    });
    
    if (signInError) {
      console.error('❌ Sign in error:', signInError);
      console.log('Error code:', signInError.code);
      console.log('Error message:', signInError.message);
      
      // Test 3: Try with different password
      console.log('\n3️⃣ Testing with different password...');
      const { data: signInData2, error: signInError2 } = await supabase.auth.signInWithPassword({
        email: 'elsa@agno.org',
        password: 'password123'
      });
      
      if (signInError2) {
        console.error('❌ Second sign in error:', signInError2);
      } else {
        console.log('✅ Second password worked!');
        console.log('User:', signInData2.user.email);
      }
    } else {
      console.log('✅ Sign in successful!');
      console.log('User:', signInData.user.email);
      console.log('Session:', signInData.session ? 'Available' : 'None');
    }
    
    // Test 4: Check if user exists in auth.users (if we can)
    console.log('\n4️⃣ Checking auth system...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('No current user session');
    } else {
      console.log('Current user:', user.email);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugLogin(); 