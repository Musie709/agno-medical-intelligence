const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    return envVars;
  }
  return {};
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUsers() {
  try {
    console.log('🔍 Checking all profiles...');
    
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error('❌ Error fetching profiles:', error.message);
      return;
    }

    console.log(`✅ Found ${profiles.length} profiles:`);
    profiles.forEach((profile, index) => {
      console.log(`${index + 1}. Email: ${profile.email}, ID: ${profile.id}`);
      if (profile.social_links) {
        console.log(`   Social links:`, profile.social_links);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUsers(); 