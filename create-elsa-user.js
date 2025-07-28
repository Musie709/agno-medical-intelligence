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

async function createElsaUser() {
  console.log('🔧 Creating elsa@agno.org user...');
  
  try {
    // Create the user account
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'elsa@agno.org',
      password: 'password123',
      options: {
        data: {
          first_name: 'Elsa',
          last_name: 'Anderson',
          specialty: 'Cardiology',
          institution: 'Mayo Clinic',
          license_number: 'MD123456',
          role: 'Physician'
        }
      }
    });

    if (signUpError) {
      console.error('❌ Sign up error:', signUpError);
      return;
    }

    console.log('✅ User created successfully:', signUpData.user.email);
    console.log('User ID:', signUpData.user.id);
    
    // Create the profile
    const profileData = {
      id: signUpData.user.id,
      email: signUpData.user.email,
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
    
    const { data: profileDataResult, error: profileError } = await supabase
      .from('profiles')
      .insert([profileData])
      .select();
      
    if (profileError) {
      console.error('❌ Profile creation error:', profileError);
    } else {
      console.log('✅ Profile created successfully');
    }

    // Test sign in
    console.log('\n🧪 Testing sign in...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'elsa@agno.org',
      password: 'password123'
    });
    
    if (signInError) {
      console.error('❌ Sign in error:', signInError);
    } else {
      console.log('✅ Sign in successful!');
      console.log('🎉 elsa@agno.org is ready to use!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createElsaUser(); 