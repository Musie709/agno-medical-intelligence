# AGNO Medical Intelligence - Supabase Integration Guide

This guide will walk you through setting up Supabase as your backend database for AGNO Medical Intelligence.

## 🚀 Quick Start

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `agno-medical-intelligence`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

### Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** (looks like: `https://your-project.supabase.co`)
3. Copy your **anon public** key (starts with `eyJ...`)
4. Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 3: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the SQL

This will create:
- ✅ `profiles` table with all user profile fields
- ✅ `cases` table for medical cases
- ✅ `comments` table for case discussions
- ✅ Row Level Security policies
- ✅ Automatic triggers and functions
- ✅ Sample data for testing

### Step 4: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Set your **Site URL**: `http://localhost:5173`
3. Add **Redirect URLs**:
   - `http://localhost:5173/login-registration`
   - `http://localhost:5173/dashboard-overview`
   - `http://localhost:5173/profile/*`
   - `http://localhost:5173/case-viewer-details/*`

### Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Try registering a new user
3. Check your Supabase dashboard:
   - **Authentication** → **Users** (should see new user)
   - **Table Editor** → **profiles** (should see profile created)

## 📊 Database Schema Overview

### Profiles Table
```sql
profiles (
  id UUID PRIMARY KEY,           -- Links to auth.users
  email TEXT UNIQUE,             -- User email
  first_name TEXT,               -- First name
  last_name TEXT,                -- Last name
  specialty TEXT,                -- Medical specialty
  institution TEXT,              -- Hospital/institution
  bio TEXT,                      -- Biography
  avatar_url TEXT,               -- Profile picture
  banner_url TEXT,               -- Banner image
  profile_visibility TEXT,       -- 'public' or 'private'
  credentials JSONB,             -- Medical licenses/certifications
  social JSONB,                  -- Social media links
  badges JSONB,                  -- Achievement badges
  skills TEXT[],                 -- Medical skills
  publications JSONB,            -- Research publications
  education JSONB,               -- Educational background
  memberships JSONB,             -- Professional memberships
  research_projects JSONB,       -- Research projects
  awards JSONB,                  -- Awards and honors
  languages TEXT[],              -- Languages spoken
  recent_cases JSONB,            -- Recent case IDs
  created_at TIMESTAMP,          -- Creation timestamp
  updated_at TIMESTAMP           -- Last update timestamp
)
```

### Cases Table
```sql
cases (
  id SERIAL PRIMARY KEY,         -- Auto-incrementing ID
  title TEXT NOT NULL,           -- Case title
  description TEXT,              -- Case description
  patient_info JSONB,            -- Patient demographics
  symptoms TEXT[],               -- Patient symptoms
  diagnosis TEXT,                -- Medical diagnosis
  treatment TEXT,                -- Treatment provided
  outcome TEXT,                  -- Treatment outcome
  latlng JSONB,                  -- Location coordinates
  city TEXT,                     -- City name
  country TEXT,                  -- Country name
  status TEXT,                   -- 'active', 'archived', etc.
  author_id UUID,                -- Links to profiles
  tags TEXT[],                   -- Case tags
  attachments JSONB,             -- File attachments
  created_at TIMESTAMP,          -- Creation timestamp
  updated_at TIMESTAMP           -- Last update timestamp
)
```

### Comments Table
```sql
comments (
  id SERIAL PRIMARY KEY,         -- Auto-incrementing ID
  case_id INTEGER,               -- Links to cases
  author_id UUID,                -- Links to profiles
  content TEXT NOT NULL,         -- Comment text
  parent_id INTEGER,             -- For nested replies
  attachments JSONB,             -- File attachments
  created_at TIMESTAMP,          -- Creation timestamp
  updated_at TIMESTAMP           -- Last update timestamp
)
```

## 🔐 Security Features

### Row Level Security (RLS)
- **Profiles**: Users can only update their own profiles
- **Cases**: Users can only modify their own cases
- **Comments**: Users can only modify their own comments
- **Public Access**: Cases and public profiles are viewable by everyone

### Authentication
- Email/password authentication
- Automatic session management
- Secure token handling
- Password reset functionality

## 🛠️ Using Supabase in Your Components

### Authentication Example
```javascript
import { supabaseService } from '../services/supabaseClient'

// Sign up
const { data, error } = await supabaseService.signUp(email, password, {
  first_name: 'John',
  last_name: 'Doe'
})

// Sign in
const { data, error } = await supabaseService.signIn(email, password)

// Get current user
const { user, error } = await supabaseService.getCurrentUser()
```

### Profile Management Example
```javascript
// Get user profile
const { data, error } = await supabaseService.getProfile(userId)

// Update profile
const { data, error } = await supabaseService.updateProfile(userId, {
  bio: 'Updated biography',
  specialty: 'Cardiology'
})
```

### Case Management Example
```javascript
// Get cases
const { data, error } = await supabaseService.getCases(10, 'active')

// Create case
const { data, error } = await supabaseService.createCase({
  title: 'New Case',
  description: 'Case description',
  latlng: { lat: 40.7128, lng: -74.0060 },
  city: 'New York',
  country: 'USA',
  authorId: userId
})

// Search cases
const { data, error } = await supabaseService.searchCases('cardiology', 'Cardiology', 'New York')
```

### Comments Example
```javascript
// Get comments for a case
const { data, error } = await supabaseService.getComments(caseId)

// Create comment
const { data, error } = await supabaseService.createComment({
  caseId: 123,
  authorId: userId,
  content: 'Great case presentation!'
})
```

## 📈 Real-time Features

### Subscribe to Changes
```javascript
// Subscribe to case updates
const subscription = supabaseService.subscribeToCases((payload) => {
  console.log('Case updated:', payload)
})

// Subscribe to comments for a specific case
const subscription = supabaseService.subscribeToComments(caseId, (payload) => {
  console.log('New comment:', payload)
})
```

## 🔧 Migration from localStorage

### Step 1: Update Registration Form
Replace localStorage logic with Supabase:

```javascript
// Before (localStorage)
localStorage.setItem('mockUsers', JSON.stringify(users))

// After (Supabase)
const { data, error } = await supabaseService.signUp(email, password, {
  first_name: formData.firstName,
  last_name: formData.lastName,
  specialty: formData.specialty,
  institution: formData.institution
})
```

### Step 2: Update Profile Fetching
```javascript
// Before (localStorage)
const users = JSON.parse(localStorage.getItem('mockUsers'))

// After (Supabase)
const { data, error } = await supabaseService.getProfileByEmail(email)
```

### Step 3: Update Case Management
```javascript
// Before (localStorage)
const cases = JSON.parse(localStorage.getItem('cases'))

// After (Supabase)
const { data, error } = await supabaseService.getCases()
```

## 🚨 Troubleshooting

### "Missing Supabase environment variables"
- ✅ Check that `.env` file exists in project root
- ✅ Verify variable names are correct
- ✅ Restart development server after creating `.env`

### "Invalid API key"
- ✅ Use the **anon key**, not the service role key
- ✅ Copy the key exactly (no extra spaces)
- ✅ Check that the key starts with `eyJ`

### "Row Level Security policy violation"
- ✅ Ensure user is authenticated
- ✅ Check RLS policies in Supabase dashboard
- ✅ Verify user permissions

### "Table doesn't exist"
- ✅ Run the SQL schema in Supabase SQL Editor
- ✅ Check that all tables were created successfully
- ✅ Verify table names match your queries

### "Authentication error"
- ✅ Check redirect URLs in Supabase settings
- ✅ Verify site URL is correct
- ✅ Ensure email templates are configured

## 📱 Advanced Features

### File Uploads
```javascript
// Upload profile picture
const { data, error } = await supabaseService.uploadFile(
  'avatars',
  `${userId}/profile.jpg`,
  file
)

// Get public URL
const url = supabaseService.getFileUrl('avatars', `${userId}/profile.jpg`)
```

### Analytics
```javascript
// Get platform analytics
const { data, error } = await supabaseService.getAnalytics('month', 'cases')
```

### Search and Filtering
```javascript
// Advanced search
const { data, error } = await supabaseService.searchCases(
  'respiratory',
  'Pulmonology',
  'California'
)
```

## 🔄 Next Steps

1. **Test the integration** with sample data
2. **Update your components** to use Supabase instead of localStorage
3. **Add real-time features** for live updates
4. **Implement file uploads** for images and documents
5. **Add advanced analytics** and reporting
6. **Set up email templates** for notifications

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your Supabase project settings
3. Check the browser console for error messages
4. Review the Supabase dashboard logs
5. Test with the sample data provided

## 🎉 Congratulations!

You've successfully set up Supabase integration for AGNO Medical Intelligence! Your app now has:

- ✅ Secure user authentication
- ✅ Real-time database operations
- ✅ Row-level security
- ✅ Scalable architecture
- ✅ Professional medical data management

Your AGNO platform is now ready for production use with a robust, scalable backend! 