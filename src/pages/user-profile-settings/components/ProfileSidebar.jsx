import React from 'react';
import Icon from '../../../components/AppIcon';
import { useNavigate, Link } from 'react-router-dom';

const ProfileSidebar = ({ activeSection, onSectionChange }) => {
  const navigate = useNavigate();

  // Get logged-in user info safely
  let userInfo = {};
  try {
    const raw = localStorage.getItem('userInfo');
    userInfo = raw && raw !== 'undefined' ? JSON.parse(raw) : {};
  } catch {
    userInfo = {};
  }
  const displayName = userInfo.firstName && userInfo.lastName
    ? `${userInfo.firstName} ${userInfo.lastName}`
    : userInfo.email || '';

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    navigate('/login-registration');
  };

  const sidebarSections = [
    {
      label: 'Profile Settings',
      icon: <Icon name="User" size={18} />,
      section: 'profile',
    },
    {
      label: 'Security',
      icon: <Icon name="Shield" size={18} />,
      section: 'security',
    },
    {
      label: 'Help & Support',
      icon: <Icon name="HelpCircle" size={18} />,
      section: 'help',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2 py-6">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl">
          {displayName ? displayName.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
        </div>
        <Link
          to={`/profile/${encodeURIComponent(userInfo.email)}`}
          className="text-lg font-semibold text-accent hover:underline"
        >
          {displayName}
        </Link>
        <p className="text-xs text-muted-foreground">{userInfo.email}</p>
        <span className="text-xs text-green-600 font-medium">Verified Physician</span>
      </div>
      <div className="space-y-2">
        {sidebarSections.map((section) => (
          <button
            key={section.section}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded transition text-left ${activeSection === section.section ? 'bg-blue-50 text-blue-700' : 'hover:bg-muted'}`}
            onClick={() => onSectionChange && onSectionChange(section.section)}
          >
            {section.icon}
            <span>{section.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition mt-8"
      >
        Log Out
      </button>
    </div>
  );
};

export default ProfileSidebar;