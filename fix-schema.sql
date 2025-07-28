-- Fix missing columns in profiles table
-- Add missing columns that are referenced in the code

-- Add certifications column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}';

-- Add license_number column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS license_number TEXT;

-- Add role column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT;

-- Add location column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;

-- Add experience_years column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_years INTEGER;

-- Add featured_cases column (rename from recent_cases to match code)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS featured_cases JSONB DEFAULT '[]';

-- Add social_links column (rename from social to match code)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{"linkedin": "", "twitter": "", "website": ""}';

-- Update existing social column data to social_links if needed
UPDATE profiles 
SET social_links = social 
WHERE social_links IS NULL AND social IS NOT NULL;

-- Update existing recent_cases column data to featured_cases if needed
UPDATE profiles 
SET featured_cases = recent_cases 
WHERE featured_cases IS NULL AND recent_cases IS NOT NULL;

-- Create a test user for elsa@agno.org
-- First, we need to create the user in auth.users (this will be done by the app)
-- Then we can create the profile manually

-- Insert sample profile for elsa@agno.org (assuming user ID will be created)
-- Note: This is just a placeholder - the actual user creation will be done by the app
INSERT INTO profiles (
  id,
  email,
  first_name,
  last_name,
  specialty,
  institution,
  license_number,
  role,
  bio,
  location,
  experience_years,
  education,
  certifications,
  languages,
  social_links,
  awards,
  publications,
  memberships,
  research_projects,
  skills,
  featured_cases,
  profile_visibility,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(), -- This will be replaced with actual user ID
  'elsa@agno.org',
  'Elsa',
  'Anderson',
  'Cardiology',
  'Mayo Clinic',
  'MD123456',
  'Physician',
  'Experienced cardiologist specializing in interventional procedures.',
  'Rochester, MN',
  15,
  ARRAY['Harvard Medical School', 'Stanford University'],
  ARRAY['Board Certified Cardiologist', 'Fellow of American College of Cardiology'],
  ARRAY['English', 'Spanish'],
  '{"linkedin": "https://linkedin.com/in/elsa-anderson", "twitter": "@dr_elsa", "website": "https://dr-elsa.com"}',
  ARRAY['Best Cardiologist Award 2023', 'Excellence in Patient Care 2022'],
  ARRAY['"Advanced Cardiac Imaging Techniques" - Journal of Cardiology 2023'],
  ARRAY['American College of Cardiology', 'American Heart Association'],
  ARRAY['Cardiac Imaging Research Project', 'Heart Failure Treatment Study'],
  ARRAY['Interventional Cardiology', 'Echocardiography', 'Cardiac Catheterization'],
  '[]',
  'public',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING; 