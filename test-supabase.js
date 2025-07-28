#!/usr/bin/env node

// Simple test script to verify Supabase integration
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
  console.log('Please check your .env file has:');
  console.log('VITE_SUPABASE_URL=your_supabase_url');
  console.log('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log('🔍 Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseAnonKey.substring(0, 20) + '...');
  
  try {
    // Test 1: Check if we can connect
    console.log('\n1️⃣ Testing connection...');
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('*')
      .limit(5);
      
    if (casesError) {
      console.error('❌ Cases error:', casesError);
    } else {
      console.log('✅ Cases loaded:', cases?.length || 0);
    }

    // Test 2: Try to create a test user
    console.log('\n2️⃣ Creating test user...');
    const testEmail = 'test@agno.org';
    const testPassword = 'password123';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User',
          specialty: 'General Medicine',
          institution: 'Test Hospital',
          license_number: 'TEST123',
          role: 'Physician'
        }
      }
    });

    if (signUpError) {
      console.error('❌ Sign up error:', signUpError);
      
      // If user already exists, try to sign in
      if (signUpError.message.includes('already registered')) {
        console.log('🔄 User exists, trying to sign in...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });
        
        if (signInError) {
          console.error('❌ Sign in error:', signInError);
        } else {
          console.log('✅ Sign in successful:', signInData.user.email);
        }
      }
    } else {
      console.log('✅ User created successfully:', signUpData.user.email);
      
      // Create profile for the new user
      const profileData = {
        id: signUpData.user.id,
        email: signUpData.user.email,
        first_name: 'Test',
        last_name: 'User',
        specialty: 'General Medicine',
        institution: 'Test Hospital',
        license_number: 'TEST123',
        role: 'Physician',
        bio: 'Test user for development',
        location: 'Test Location',
        experience_years: 5,
        education: ['Test Medical School'],
        certifications: ['Test Certification'],
        languages: ['English'],
        social_links: {
          linkedin: '',
          twitter: '',
          website: ''
        },
        awards: [],
        publications: [],
        memberships: [],
        research_projects: [],
        skills: ['General Medicine'],
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
    }

    // Test 3: Try to sign in with elsa@agno.org
    console.log('\n3️⃣ Testing elsa@agno.org...');
    const { data: elsaData, error: elsaError } = await supabase.auth.signInWithPassword({
      email: 'elsa@agno.org',
      password: 'password123'
    });
    
    if (elsaError) {
      console.error('❌ Elsa sign in error:', elsaError);
    } else {
      console.log('✅ Elsa sign in successful:', elsaData.user.email);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSupabase(); 