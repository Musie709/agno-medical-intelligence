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

async function createTestUser() {
  console.log('🔧 Creating fresh test user...');
  
  const testEmail = 'doctor@agno.org';
  const testPassword = 'password123';
  
  try {
    // Create the user account
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: 'Dr. John',
          last_name: 'Smith',
          specialty: 'General Medicine',
          institution: 'City Hospital',
          license_number: 'MD789012',
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
    console.log('Session available:', !!signUpData.session);
    
    // Create the profile
    const profileData = {
      id: signUpData.user.id,
      email: signUpData.user.email,
      first_name: 'Dr. John',
      last_name: 'Smith',
      specialty: 'General Medicine',
      institution: 'City Hospital',
      license_number: 'MD789012',
      role: 'Physician',
      bio: 'Experienced general practitioner with focus on preventive care.',
      location: 'New York, NY',
      experience_years: 8,
      education: ['Columbia University Medical School'],
      certifications: ['Board Certified Family Medicine'],
      languages: ['English'],
      social_links: {
        linkedin: '',
        twitter: '',
        website: ''
      },
      awards: [],
      publications: [],
      memberships: ['American Medical Association'],
      research_projects: [],
      skills: ['General Medicine', 'Preventive Care'],
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

    // Test sign in immediately
    console.log('\n🧪 Testing immediate sign in...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (signInError) {
      console.error('❌ Sign in error:', signInError);
      console.log('\n💡 Try using the signup session instead...');
    } else {
      console.log('✅ Sign in successful!');
      console.log('🎉', testEmail, 'is ready to use!');
    }

    console.log('\n📋 Login Credentials:');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTestUser(); 