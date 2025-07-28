-- Enable Row Level Security
-- ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  specialty TEXT,
  institution TEXT,
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  profile_visibility TEXT DEFAULT 'public',
  credentials JSONB DEFAULT '[]',
  social JSONB DEFAULT '{"linkedin": "", "twitter": "", "website": "", "email": ""}',
  badges JSONB DEFAULT '[]',
  skills TEXT[] DEFAULT '{}',
  publications JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  memberships JSONB DEFAULT '[]',
  research_projects JSONB DEFAULT '[]',
  awards JSONB DEFAULT '[]',
  languages TEXT[] DEFAULT '{}',
  recent_cases JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  patient_info JSONB,
  symptoms TEXT[],
  diagnosis TEXT,
  treatment TEXT,
  outcome TEXT,
  latlng JSONB,
  city TEXT,
  country TEXT,
  status TEXT DEFAULT 'active',
  author_id UUID REFERENCES profiles(id),
  tags TEXT[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  case_id INTEGER REFERENCES cases(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_cases_author_id ON cases(author_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_case_id ON comments(case_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (profile_visibility = 'public');

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Cases policies
CREATE POLICY "Cases are viewable by everyone" ON cases
  FOR SELECT USING (true);

CREATE POLICY "Users can create cases" ON cases
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own cases" ON cases
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own cases" ON cases
  FOR DELETE USING (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = author_id);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO profiles (id, email, first_name, last_name, specialty, institution, bio, profile_visibility, credentials, social, badges, skills, publications, education, memberships, research_projects, awards, languages, recent_cases) VALUES
(
  '550e8400-e29b-41d4-a716-446655440000',
  'testuser@example.com',
  'Dr. Sarah',
  'Johnson',
  'Cardiology',
  'Mayo Clinic',
  'Experienced cardiologist with 15+ years in interventional cardiology. Specializing in complex coronary interventions and structural heart disease.',
  'public',
  '[{"type": "Medical License", "number": "MD123456", "status": "verified"}, {"type": "Board Certification", "number": "BC789012", "status": "verified"}]',
  '{"linkedin": "https://linkedin.com/in/sarahjohnson", "twitter": "@drjohnson", "website": "https://drjohnson.com", "email": "testuser@example.com"}',
  '[{"label": "Verified Physician", "icon": "Shield", "color": "success"}, {"label": "Cardiology", "icon": "Heart", "color": "accent"}, {"label": "15+ Years", "icon": "Award", "color": "primary"}]',
  ARRAY['Interventional Cardiology', 'Structural Heart Disease', 'Heart Failure', 'Echocardiography'],
  '[{"title": "Novel Approaches in TAVR", "journal": "JACC", "year": 2023}, {"title": "Outcomes in Complex PCI", "journal": "Circulation", "year": 2022}]',
  '[{"degree": "MD", "institution": "Harvard Medical School", "year": 2008}, {"degree": "Residency", "institution": "Johns Hopkins", "year": 2012}]',
  '[{"name": "American College of Cardiology", "role": "Fellow"}, {"name": "Society for Cardiovascular Angiography", "role": "Member"}]',
  '[{"title": "TAVR Outcomes Study", "status": "active", "funding": "$500K"}]',
  '[{"name": "Best Cardiologist 2023", "organization": "Medical Association"}, {"name": "Research Excellence Award", "organization": "Cardiology Society"}]',
  ARRAY['English', 'Spanish'],
  '[]'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample cases
INSERT INTO cases (title, description, patient_info, symptoms, diagnosis, treatment, outcome, latlng, city, country, status, author_id, tags) VALUES
(
  'Complex Coronary Intervention',
  'A 65-year-old male with multi-vessel coronary disease presenting with acute coronary syndrome. Successfully treated with complex PCI involving multiple stents.',
  '{"age": 65, "gender": "male", "comorbidities": ["diabetes", "hypertension"]}',
  ARRAY['chest pain', 'shortness of breath', 'fatigue'],
  'Multi-vessel coronary artery disease',
  'Complex PCI with drug-eluting stents',
  'Successful revascularization with improved symptoms',
  '{"lat": 40.7128, "lng": -74.0060}',
  'New York',
  'USA',
  'active',
  '550e8400-e29b-41d4-a716-446655440000',
  ARRAY['cardiology', 'PCI', 'coronary']
),
(
  'TAVR Procedure Case',
  'Elderly patient with severe aortic stenosis treated with transcatheter aortic valve replacement. Excellent outcome with minimal complications.',
  '{"age": 82, "gender": "female", "comorbidities": ["aortic stenosis", "hypertension"]}',
  ARRAY['syncope', 'dyspnea', 'chest pain'],
  'Severe aortic stenosis',
  'TAVR with Edwards Sapien valve',
  'Successful valve replacement with improved functional status',
  '{"lat": 34.0522, "lng": -118.2437}',
  'Los Angeles',
  'USA',
  'active',
  '550e8400-e29b-41d4-a716-446655440000',
  ARRAY['TAVR', 'valvular', 'structural']
),
(
  'Heart Failure Management',
  'Complex case of heart failure with preserved ejection fraction in a patient with multiple comorbidities. Comprehensive management approach.',
  '{"age": 58, "gender": "male", "comorbidities": ["diabetes", "obesity", "sleep apnea"]}',
  ARRAY['dyspnea', 'edema', 'fatigue', 'orthopnea'],
  'Heart failure with preserved ejection fraction',
  'Comprehensive medical therapy and lifestyle modification',
  'Stable condition with improved quality of life',
  '{"lat": 51.5074, "lng": -0.1278}',
  'London',
  'UK',
  'active',
  '550e8400-e29b-41d4-a716-446655440000',
  ARRAY['heart failure', 'HFpEF', 'management']
),
(
  'Pediatric Cardiac Case',
  'Rare congenital heart defect in a 3-year-old patient. Successful surgical correction with excellent long-term prognosis.',
  '{"age": 3, "gender": "female", "comorbidities": ["congenital heart disease"]}',
  ARRAY['cyanosis', 'poor feeding', 'failure to thrive'],
  'Tetralogy of Fallot',
  'Complete surgical repair',
  'Excellent outcome with normal cardiac function',
  '{"lat": 35.6895, "lng": 139.6917}',
  'Tokyo',
  'Japan',
  'active',
  '550e8400-e29b-41d4-a716-446655440000',
  ARRAY['pediatric', 'congenital', 'surgery']
),
(
  'Emergency STEMI Case',
  'Acute ST-elevation myocardial infarction treated with primary PCI. Door-to-balloon time of 45 minutes.',
  '{"age": 47, "gender": "male", "comorbidities": ["smoking", "hyperlipidemia"]}',
  ARRAY['severe chest pain', 'sweating', 'nausea'],
  'Acute STEMI',
  'Primary PCI with stent placement',
  'Successful reperfusion with preserved left ventricular function',
  '{"lat": -33.8688, "lng": 151.2093}',
  'Sydney',
  'Australia',
  'active',
  '550e8400-e29b-41d4-a716-446655440000',
  ARRAY['STEMI', 'emergency', 'PCI']
);

-- Insert sample comments
INSERT INTO comments (case_id, author_id, content, parent_id) VALUES
(1, '550e8400-e29b-41d4-a716-446655440000', 'Excellent case presentation. The decision to proceed with complex PCI was well-justified given the patient''s symptoms and anatomy.', NULL),
(1, '550e8400-e29b-41d4-a716-446655440000', 'What was the final TIMI flow achieved?', 1),
(2, '550e8400-e29b-41d4-a716-446655440000', 'Great TAVR case! The valve positioning looks perfect on the final angiogram.', NULL),
(3, '550e8400-e29b-41d4-a716-446655440000', 'Comprehensive management approach. Did you consider SGLT2 inhibitors in this patient?', NULL),
(4, '550e8400-e29b-41d4-a716-446655440000', 'Beautiful surgical result. The long-term follow-up will be crucial for this patient.', NULL),
(5, '550e8400-e29b-41d4-a716-446655440000', 'Excellent door-to-balloon time! This is a great example of efficient STEMI care.', NULL); 