import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { supabaseService } from '../../services/supabaseClient';

// Function to fetch user profile from Supabase
const fetchUserProfile = async (userId) => {
  try {
    // First try to get profile by email (for backward compatibility)
    const { data, error } = await supabaseService.getProfileByEmail(userId);
    
    if (error) {
      // If not found by email, try by ID
      const { data: dataById, error: errorById } = await supabaseService.getProfile(userId);
      if (errorById) {
        console.error('Profile not found:', errorById);
        return null;
      }
      return dataById;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export default function PublicProfilePage() {
  const { userId } = useParams();
  const decodedUserId = decodeURIComponent(userId).trim().toLowerCase();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Get logged-in user info
  let loggedInEmail = '';
  try {
    const raw = localStorage.getItem('userInfo');
    const info = raw && raw !== 'undefined' ? JSON.parse(raw) : {};
    loggedInEmail = info.email || '';
  } catch {}

  useEffect(() => {
    setLoading(true);
    fetchUserProfile(decodedUserId).then((data) => {
      // Ensure all users have the same profile structure as the test user
      if (data) {
        const defaultProfile = {
          userId: decodedUserId,
          firstName: '',
          lastName: '',
          specialty: '',
          institution: '',
          bio: '',
          credentials: [],
          profileVisibility: 'public',
          avatarUrl: '',
          bannerUrl: '',
          social: {
            linkedin: '',
            twitter: '',
            website: '',
            email: decodedUserId
          },
          badges: [
            { label: 'Verified Physician', icon: 'Shield', color: 'success' },
            { label: '', icon: 'Stethoscope', color: 'accent' },
            { label: '5+ Years', icon: 'Award', color: 'primary' }
          ],
          recentCases: [],
          skills: [],
          publications: [],
          education: [],
          memberships: [],
          researchProjects: [],
          awards: [],
          languages: []
        };
        // Merge user data with defaults for missing fields
        setUser({ ...defaultProfile, ...data, social: { ...defaultProfile.social, ...data.social } });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, [decodedUserId]);

  // Save profile changes to localStorage (for demo)
  const handleSaveEdit = () => {
    // Save to mock localStorage (simulate backend)
    const usersRaw = localStorage.getItem('mockUsers');
    let users = usersRaw ? JSON.parse(usersRaw) : {};
    users[decodedUserId] = { ...editData, profileVisibility: user.profileVisibility };
    localStorage.setItem('mockUsers', JSON.stringify(users));
    setUser(editData);
    setIsEditOpen(false);
  };

  // Use localStorage mock if available
  useEffect(() => {
    const usersRaw = localStorage.getItem('mockUsers');
    if (usersRaw) {
      const users = JSON.parse(usersRaw);
      if (users[decodedUserId]) setUser(users[decodedUserId]);
    }
  }, [decodedUserId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96 text-lg text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  // Remove privacy check: always show profile if user exists
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96 text-lg text-muted-foreground">
          <Icon name="Lock" size={32} className="mr-3 text-warning" />
          This profile does not exist.
        </div>
      </div>
    );
  }

  // Only allow editing if viewing own profile
  const isOwner = true; // Always show edit button for demo/testing

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-0">
        {/* Banner/Header */}
        <div className="relative w-full h-40 md:h-56 bg-accent/10 flex items-center justify-center">
          <img
            src={user.bannerUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80'}
            alt="Profile banner"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-background/90" />
          {isOwner && (
            <Button
              className="absolute top-4 right-4 z-20"
              variant="default"
              size="sm"
              iconName="Edit"
              onClick={() => { setEditData({ ...user }); setIsEditOpen(true); }}
            >
              Edit Profile
            </Button>
          )}
        </div>
        {/* Edit Profile Modal */}
        {isEditOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40">
            <div className="bg-card rounded-lg shadow-xl p-8 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
              <button className="absolute top-2 right-2 text-muted-foreground hover:text-accent" onClick={() => setIsEditOpen(false)}>
                <Icon name="X" size={20} />
              </button>
              <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
                <Icon name="Edit" size={20} className="text-accent" /> Edit Profile
              </h2>
              <form onSubmit={e => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
                {/* Editable fields except verification badge */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">First Name</label>
                    <input className="w-full p-2 border rounded" value={editData.firstName} onChange={e => setEditData(d => ({ ...d, firstName: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Last Name</label>
                    <input className="w-full p-2 border rounded" value={editData.lastName} onChange={e => setEditData(d => ({ ...d, lastName: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Specialty</label>
                    <input className="w-full p-2 border rounded" value={editData.specialty} onChange={e => setEditData(d => ({ ...d, specialty: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Institution</label>
                    <input className="w-full p-2 border rounded" value={editData.institution} onChange={e => setEditData(d => ({ ...d, institution: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Bio</label>
                  <textarea className="w-full p-2 border rounded min-h-[60px]" value={editData.bio} onChange={e => setEditData(d => ({ ...d, bio: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Skills/Interests (comma separated)</label>
                  <input className="w-full p-2 border rounded" value={editData.skills?.join(', ') || ''} onChange={e => setEditData(d => ({ ...d, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Languages (comma separated)</label>
                  <input className="w-full p-2 border rounded" value={editData.languages?.join(', ') || ''} onChange={e => setEditData(d => ({ ...d, languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">LinkedIn</label>
                  <input className="w-full p-2 border rounded" value={editData.social?.linkedin || ''} onChange={e => setEditData(d => ({ ...d, social: { ...d.social, linkedin: e.target.value } }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Twitter</label>
                  <input className="w-full p-2 border rounded" value={editData.social?.twitter || ''} onChange={e => setEditData(d => ({ ...d, social: { ...d.social, twitter: e.target.value } }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Website</label>
                  <input className="w-full p-2 border rounded" value={editData.social?.website || ''} onChange={e => setEditData(d => ({ ...d, social: { ...d.social, website: e.target.value } }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Recent Cases (title, date; one per line)</label>
                  <textarea className="w-full p-2 border rounded min-h-[40px]" value={editData.recentCases?.map(c => `${c.title}, ${c.date}`).join('\n') || ''} onChange={e => setEditData(d => ({ ...d, recentCases: e.target.value.split('\n').map(line => { const [title, date] = line.split(','); return title && date ? { title: title.trim(), date: date.trim() } : null; }).filter(Boolean) }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Awards (name, year, org; one per line)</label>
                  <textarea className="w-full p-2 border rounded min-h-[40px]" value={editData.awards?.map(a => `${a.name}, ${a.year}, ${a.org}`).join('\n') || ''} onChange={e => setEditData(d => ({ ...d, awards: e.target.value.split('\n').map(line => { const [name, year, org] = line.split(','); return name && year && org ? { name: name.trim(), year: year.trim(), org: org.trim() } : null; }).filter(Boolean) }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Publications (title, journal, year, doi, link; one per line)</label>
                  <textarea className="w-full p-2 border rounded min-h-[40px]" value={editData.publications?.map(p => `${p.title}, ${p.journal}, ${p.year}, ${p.doi}, ${p.link}`).join('\n') || ''} onChange={e => setEditData(d => ({ ...d, publications: e.target.value.split('\n').map(line => { const [title, journal, year, doi, link] = line.split(','); return title && journal && year && doi && link ? { title: title.trim(), journal: journal.trim(), year: year.trim(), doi: doi.trim(), link: link.trim() } : null; }).filter(Boolean) }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Education (degree, institution, year; one per line)</label>
                  <textarea className="w-full p-2 border rounded min-h-[40px]" value={editData.education?.map(e => `${e.degree}, ${e.institution}, ${e.year}`).join('\n') || ''} onChange={e => setEditData(d => ({ ...d, education: e.target.value.split('\n').map(line => { const [degree, institution, year] = line.split(','); return degree && institution && year ? { degree: degree.trim(), institution: institution.trim(), year: year.trim() } : null; }).filter(Boolean) }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Memberships (name, role; one per line)</label>
                  <textarea className="w-full p-2 border rounded min-h-[40px]" value={editData.memberships?.map(m => `${m.name}, ${m.role}`).join('\n') || ''} onChange={e => setEditData(d => ({ ...d, memberships: e.target.value.split('\n').map(line => { const [name, role] = line.split(','); return name && role ? { name: name.trim(), role: role.trim() } : null; }).filter(Boolean) }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Research Projects (title, role, status, year; one per line)</label>
                  <textarea className="w-full p-2 border rounded min-h-[40px]" value={editData.researchProjects?.map(r => `${r.title}, ${r.role}, ${r.status}, ${r.year}`).join('\n') || ''} onChange={e => setEditData(d => ({ ...d, researchProjects: e.target.value.split('\n').map(line => { const [title, role, status, year] = line.split(','); return title && role && status && year ? { title: title.trim(), role: role.trim(), status: status.trim(), year: year.trim() } : null; }).filter(Boolean) }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Credentials (type, number, status; one per line)</label>
                  <textarea className="w-full p-2 border rounded min-h-[40px]" value={editData.credentials?.map(c => `${c.type}, ${c.number}, ${c.status}`).join('\n') || ''} onChange={e => setEditData(d => ({ ...d, credentials: e.target.value.split('\n').map(line => { const [type, number, status] = line.split(','); return type && number && status ? { type: type.trim(), number: number.trim(), status: status.trim() } : null; }).filter(Boolean) }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Badges (label, icon, color; one per line, except verification badge)</label>
                  <textarea className="w-full p-2 border rounded min-h-[40px]" value={editData.badges?.filter(b => b.label !== 'Verified Physician').map(b => `${b.label}, ${b.icon}, ${b.color}`).join('\n') || ''} onChange={e => setEditData(d => ({ ...d, badges: [{ label: 'Verified Physician', icon: 'Shield', color: 'success' }, ...e.target.value.split('\n').map(line => { const [label, icon, color] = line.split(','); return label && icon && color ? { label: label.trim(), icon: icon.trim(), color: color.trim() } : null; }).filter(Boolean)] }))} />
                </div>
                {/* Add more fields as needed */}
                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="default">Save Changes</Button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Profile Card Overlapping Banner */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar (Left) */}
            <aside className="w-full md:w-1/3 flex flex-col items-center md:items-start">
              {/* Avatar overlaps banner */}
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile avatar" className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg -mt-16 mb-2 bg-background" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-accent/10 flex items-center justify-center text-5xl font-bold text-accent border-4 border-background shadow-lg -mt-16 mb-2 bg-background">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
              )}
              {/* Name, badges, specialty, institution */}
              <h1 className="text-2xl font-heading font-semibold text-foreground mt-2 mb-1 text-center md:text-left flex flex-wrap gap-2 items-center justify-center md:justify-start">
                Dr. {user.firstName} {user.lastName}
                {user.badges && user.badges.map((badge, i) => (
                  <span key={i} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-${badge.color}/10 text-${badge.color} border border-${badge.color}/20 ml-1`}>
                    <Icon name={badge.icon} size={14} /> {badge.label}
                  </span>
                ))}
              </h1>
              <div className="text-muted-foreground text-center md:text-left mb-2">{user.specialty} &bull; {user.institution}</div>
              {/* Social/contact links */}
              <div className="flex gap-3 mb-3 justify-center md:justify-start">
                {user.social?.linkedin && <a href={user.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline"><Icon name="Linkedin" size={20} /></a>}
                {user.social?.twitter && <a href={user.social.twitter} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline"><Icon name="Twitter" size={20} /></a>}
                {user.social?.website && <a href={user.social.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline"><Icon name="Globe" size={20} /></a>}
                {user.social?.email && <a href={`mailto:${user.social.email}`} className="text-accent hover:underline"><Icon name="Mail" size={20} /></a>}
              </div>
              {/* Languages */}
              {user.languages && user.languages.length > 0 && (
                <div className="mb-4 w-full">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-1">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.languages.map((lang, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-accent border border-accent/20">{lang}</span>
                    ))}
                  </div>
                </div>
              )}
              {/* Education & Training */}
              {user.education && user.education.length > 0 && (
                <div className="mb-4 w-full">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-1">Education & Training</h3>
                  <ul className="space-y-1">
                    {user.education.map((ed, idx) => (
                      <li key={idx} className="text-xs text-foreground flex flex-col">
                        <span className="font-medium">{ed.degree}</span>
                        <span className="text-muted-foreground">{ed.institution} ({ed.year})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Memberships */}
              {user.memberships && user.memberships.length > 0 && (
                <div className="mb-4 w-full">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-1">Memberships</h3>
                  <ul className="space-y-1">
                    {user.memberships.map((m, idx) => (
                      <li key={idx} className="text-xs text-foreground flex flex-col">
                        <span className="font-medium">{m.name}</span>
                        <span className="text-muted-foreground">{m.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
            {/* Main Content (Right) */}
            <section className="flex-1 w-full md:w-2/3">
              {/* About/Bio */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-card mb-6">
                <h2 className="text-lg font-heading font-medium text-card-foreground mb-2 flex items-center">
                  <Icon name="User" size={20} className="mr-2 text-accent" /> About
                </h2>
                <div className="text-sm text-muted-foreground text-left max-w-2xl mb-2">{user.bio}</div>
                {/* Skills/interests */}
                {user.skills && user.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-accent border border-accent/20">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
              {/* Publications & Research */}
              {user.publications && user.publications.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-6 shadow-card mb-6">
                  <h2 className="text-lg font-heading font-medium text-card-foreground mb-4 flex items-center">
                    <Icon name="BookOpen" size={20} className="mr-2 text-accent" /> Publications & Research
                  </h2>
                  <ul className="space-y-2">
                    {user.publications.map((pub, idx) => (
                      <li key={idx} className="flex flex-col md:flex-row md:items-center gap-2">
                        <span className="font-medium">{pub.title}</span>
                        <span className="text-xs text-muted-foreground">{pub.journal} ({pub.year})</span>
                        {pub.doi && <span className="text-xs text-muted-foreground">DOI: {pub.doi}</span>}
                        {pub.link && <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-xs">View</a>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Clinical Trials & Research Projects */}
              {user.researchProjects && user.researchProjects.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-6 shadow-card mb-6">
                  <h2 className="text-lg font-heading font-medium text-card-foreground mb-4 flex items-center">
                    <Icon name="FlaskConical" size={20} className="mr-2 text-accent" /> Clinical Trials & Research Projects
                  </h2>
                  <ul className="space-y-2">
                    {user.researchProjects.map((proj, idx) => (
                      <li key={idx} className="flex flex-col md:flex-row md:items-center gap-2">
                        <span className="font-medium">{proj.title}</span>
                        <span className="text-xs text-muted-foreground">{proj.role}</span>
                        <span className="text-xs text-muted-foreground">{proj.status} ({proj.year})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Awards & Honors */}
              {user.awards && user.awards.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-6 shadow-card mb-6">
                  <h2 className="text-lg font-heading font-medium text-card-foreground mb-4 flex items-center">
                    <Icon name="Star" size={20} className="mr-2 text-accent" /> Awards & Honors
                  </h2>
                  <ul className="space-y-2">
                    {user.awards.map((a, idx) => (
                      <li key={idx} className="flex flex-col md:flex-row md:items-center gap-2">
                        <span className="font-medium">{a.name}</span>
                        <span className="text-xs text-muted-foreground">{a.org} ({a.year})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Recent Cases */}
              {user.recentCases && user.recentCases.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-6 shadow-card mb-6">
                  <h2 className="text-lg font-heading font-medium text-card-foreground mb-4 flex items-center">
                    <Icon name="FileText" size={20} className="mr-2 text-accent" /> Recent Cases
                  </h2>
                  <ul className="space-y-2">
                    {user.recentCases.map((c, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <Icon name="ChevronRight" size={14} className="text-accent" />
                        <a href={`/case-viewer-details?id=${c.id}`} className="text-accent hover:underline font-medium">{c.title}</a>
                        <span className="text-xs text-muted-foreground">{c.date}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
} 