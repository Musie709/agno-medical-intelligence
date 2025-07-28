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

async function updateDemoUserSocial() {
  try {
    console.log('🔍 Finding doctor user...');
    
    // Get all profiles to find the doctor user
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'doctor@agno.org');

    if (profilesError) {
      console.error('❌ Error finding profiles:', profilesError.message);
      return;
    }

    if (!profiles || profiles.length === 0) {
      console.error('❌ No doctor user found');
      return;
    }

    const profile = profiles[0]; // Take the first one
    console.log('✅ Found doctor user:', profile.id);

    // Update with social links
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        social_links: {
          linkedin: 'https://linkedin.com/in/doctor-smith',
          twitter: 'https://twitter.com/dr_smith',
          website: 'https://doctorsmith.com'
        }
      })
      .eq('id', profile.id);

    if (updateError) {
      console.error('❌ Error updating profile:', updateError.message);
    } else {
      console.log('✅ Doctor user social links updated!');
      console.log('LinkedIn: https://linkedin.com/in/doctor-smith');
      console.log('Twitter: https://twitter.com/dr_smith');
      console.log('Website: https://doctorsmith.com');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateDemoUserSocial(); 