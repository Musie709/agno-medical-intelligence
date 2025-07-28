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

async function fixElsaPassword() {
  console.log('🔧 Fixing password for elsa@agno.org...');
  
  try {
    // First, let's try to sign in with the current password to see if it works
    console.log('🔍 Testing current password...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'elsa@agno.org',
      password: 'Elsa1234@'
    });
    
    if (signInError) {
      console.error('❌ Current password not working:', signInError);
      
      // The password needs to be updated. Since we can't directly update passwords via API,
      // we need to use the password reset flow or recreate the user
      console.log('\n🔄 Setting up password reset...');
      
      const { data, error } = await supabase.auth.resetPasswordForEmail('elsa@agno.org', {
        redirectTo: 'http://localhost:5173/reset-password'
      });
      
      if (error) {
        console.error('❌ Password reset error:', error);
        console.log('\n💡 Alternative: We can recreate the user with the correct password');
        
        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', 'elsa@agno.org')
          .single();
          
        if (profileError) {
          console.log('❌ No profile found, need to recreate user');
        } else {
          console.log('✅ Profile exists, just need to fix password');
        }
        
        console.log('\n📋 To fix this, you can:');
        console.log('1. Check your email for a password reset link');
        console.log('2. Or I can help you recreate the user with the correct password');
        console.log('3. Or you can manually update the password in Supabase dashboard');
        
      } else {
        console.log('✅ Password reset email sent to elsa@agno.org');
        console.log('Check your email for the reset link');
      }
    } else {
      console.log('✅ Current password works!');
      console.log('User:', signInData.user.email);
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'elsa@agno.org')
        .single();
        
      if (profileError) {
        console.log('❌ Profile missing, recreating...');
        
        // Create the profile
        const profileData = {
          id: signInData.user.id,
          email: 'elsa@agno.org',
          first_name: 'Elsa',
          last_name: 'Anderson',
          specialty: 'Cardiology',
          institution: 'Mayo Clinic',
          license_number: 'MD123456',
          role: 'Physician',
          bio: 'Experienced cardiologist specializing in interventional procedures.',
          location: 'Rochester, MN',
          experience_years: 15,
          education: ['Harvard Medical School', 'Stanford University'],
          certifications: ['Board Certified Cardiologist', 'Fellow of American College of Cardiology'],
          languages: ['English', 'Spanish'],
          social_links: {
            linkedin: 'https://linkedin.com/in/elsa-anderson',
            twitter: '@dr_elsa',
            website: 'https://dr-elsa.com'
          },
          awards: ['Best Cardiologist Award 2023', 'Excellence in Patient Care 2022'],
          publications: ['"Advanced Cardiac Imaging Techniques" - Journal of Cardiology 2023'],
          memberships: ['American College of Cardiology', 'American Heart Association'],
          research_projects: ['Cardiac Imaging Research Project', 'Heart Failure Treatment Study'],
          skills: ['Interventional Cardiology', 'Echocardiography', 'Cardiac Catheterization'],
          featured_cases: [],
          profile_visibility: 'public',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { data: profileDataResult, error: profileCreateError } = await supabase
          .from('profiles')
          .insert([profileData])
          .select();
          
        if (profileCreateError) {
          console.error('❌ Profile creation error:', profileCreateError);
        } else {
          console.log('✅ Profile created successfully');
        }
      } else {
        console.log('✅ Profile exists and is complete');
      }
      
      console.log('\n🎉 elsa@agno.org is ready to use!');
      console.log('📋 Login credentials:');
      console.log('Email: elsa@agno.org');
      console.log('Password: Elsa1234@');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixElsaPassword(); 