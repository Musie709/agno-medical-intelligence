import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a singleton Supabase client to avoid multiple instances
let supabaseInstance = null;

export const supabase = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables. Please check your .env file and Vercel settings.')
    // Return a mock client to prevent crashes
    return {
      auth: {
        signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        signOut: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
        getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
        getSession: () => Promise.resolve({ data: { session: null }, error: { message: 'Supabase not configured' } })
      },
      from: () => ({
        select: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
      })
    }
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  }
  return supabaseInstance;
})();

// Helper functions for common operations
export const supabaseService = {
  // Auth functions
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Development helper - create test user without email confirmation
  async createTestUser(email, password, userData = {}) {
    // First, try to sign up normally
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) {
      return { data: null, error }
    }
    
    // For development, we'll manually create a profile
    if (data.user) {
      const profileData = {
        id: data.user.id,
        email: data.user.email,
        first_name: userData.first_name || 'Test',
        last_name: userData.last_name || 'User',
        specialty: userData.specialty || 'General Medicine',
        institution: userData.institution || 'Test Hospital',
        license_number: userData.license_number || 'TEST123',
        role: userData.role || 'Physician',
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
      }
      
      await this.createProfile(profileData)
    }
    
    return { data, error }
  },

  // Profile functions
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  async getProfileByEmail(email) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()
    return { data, error }
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
    return { data, error }
  },

  async createProfile(profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
    return { data, error }
  },

  // Cases functions
  async getCases(limit = 10, status = null) {
    let query = supabase
      .from('cases')
      .select('*, profiles(first_name, last_name, specialty)')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    return { data, error }
  },

  async getCaseById(caseId) {
    const { data, error } = await supabase
      .from('cases')
      .select('*, profiles(first_name, last_name, specialty)')
      .eq('id', caseId)
      .single()
    return { data, error }
  },

  async createCase(caseData) {
    const { data, error } = await supabase
      .from('cases')
      .insert([caseData])
      .select()
    return { data, error }
  },

  async updateCase(caseId, updates) {
    const { data, error } = await supabase
      .from('cases')
      .update(updates)
      .eq('id', caseId)
      .select()
    return { data, error }
  },

  async deleteCase(caseId) {
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', caseId)
    return { error }
  },

  async searchCases(query, specialty = null, location = null) {
    let searchQuery = supabase
      .from('cases')
      .select('*, profiles(first_name, last_name, specialty)')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)

    if (specialty) {
      searchQuery = searchQuery.eq('specialty', specialty)
    }

    if (location) {
      searchQuery = searchQuery.or(`city.ilike.%${location}%,country.ilike.%${location}%`)
    }

    const { data, error } = await searchQuery
    return { data, error }
  },

  // Comments functions
  async getComments(caseId) {
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(first_name, last_name)')
      .eq('case_id', caseId)
      .order('created_at', { ascending: true })
    return { data, error }
  },

  async createComment(commentData) {
    const { data, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select('*, profiles(first_name, last_name)')
    return { data, error }
  },

  async updateComment(commentId, updates) {
    const { data, error } = await supabase
      .from('comments')
      .update(updates)
      .eq('id', commentId)
      .select('*, profiles(first_name, last_name)')
    return { data, error }
  },

  async deleteComment(commentId) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
    return { error }
  },

  // Analytics functions
  async getAnalytics(timeframe = 'month', metric = 'cases') {
    // This is a simplified analytics function
    // In a real implementation, you'd have more sophisticated queries
    const { data, error } = await supabase
      .from(metric === 'cases' ? 'cases' : 'profiles')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - this.getTimeframeMs(timeframe)).toISOString())
    
    if (error) return { data: null, error }

    const analytics = {
      timeframe,
      metric,
      data: {
        total: data.length,
        trend: this.calculateTrend(data),
        percentage: Math.floor(Math.random() * 50), // Mock percentage
      },
    }

    return { data: analytics, error: null }
  },

  getTimeframeMs(timeframe) {
    const now = Date.now()
    switch (timeframe) {
      case 'day': return 24 * 60 * 60 * 1000
      case 'week': return 7 * 24 * 60 * 60 * 1000
      case 'month': return 30 * 24 * 60 * 60 * 1000
      case 'year': return 365 * 24 * 60 * 60 * 1000
      default: return 30 * 24 * 60 * 60 * 1000
    }
  },

  calculateTrend(data) {
    // Simple trend calculation
    return data.length > 10 ? 'up' : 'down'
  },

  // Location functions
  async getCaseLocations() {
    const { data, error } = await supabase
      .from('cases')
      .select('id, title, latlng, city, country, created_at')
      .not('latlng', 'is', null)
    return { data, error }
  },

  // Real-time subscriptions
  subscribeToCases(callback) {
    return supabase
      .channel('cases')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cases' }, callback)
      .subscribe()
  },

  subscribeToComments(caseId, callback) {
    return supabase
      .channel(`comments-${caseId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'comments', filter: `case_id=eq.${caseId}` }, 
        callback
      )
      .subscribe()
  },

  // File upload functions (for future use)
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    return { data, error }
  },

  async getFileUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    return data.publicUrl
  }
}

export default supabase 