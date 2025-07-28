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

async function testElsaLogin() {
  console.log('🧪 Testing elsa@agno.org login...');
  
  try {
    // Try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'elsa@agno.org',
      password: 'password123'
    });
    
    if (signInError) {
      console.error('❌ Sign in error:', signInError);
      
      // Check if user exists
      console.log('\n🔍 Checking if user exists...');
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'elsa@agno.org');
        
      if (usersError) {
        console.error('❌ Error checking users:', usersError);
      } else {
        console.log('✅ Found user in profiles:', users.length > 0);
        if (users.length > 0) {
          console.log('User details:', users[0]);
        }
      }
      
      // Try to create user again if it doesn't exist
      console.log('\n🔄 Trying to create user again...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'elsa@agno.org',
        password: 'password123'
      });
      
      if (signUpError) {
        console.error('❌ Sign up error:', signUpError);
      } else {
        console.log('✅ User created again:', signUpData.user?.email);
        console.log('Session:', signUpData.session ? 'Available' : 'None');
        
        if (signUpData.session) {
          console.log('🎉 User is logged in via signup session!');
        }
      }
    } else {
      console.log('✅ Sign in successful!');
      console.log('User:', signInData.user.email);
      console.log('Session:', signInData.session ? 'Available' : 'None');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testElsaLogin(); 