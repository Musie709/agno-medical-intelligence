import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Mock notifications with caseId
  const notifications = [
    { id: 1, message: 'New case submitted: Rare Respiratory Syndrome', time: '2m ago', read: false, caseId: 'CASE-2024-001' },
    { id: 2, message: 'Case approved: Acute Neurological Event', time: '1h ago', read: false, caseId: 'CASE-2024-002' },
    { id: 3, message: 'Flagged case requires review', time: '3h ago', read: true, caseId: 'CASE-2024-003' },
  ];

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard-overview', icon: 'LayoutDashboard' },
    { label: 'Submit Case', path: '/case-submission-form', icon: 'FileText' },
    { label: 'My Cases', path: '/personal-case-management', icon: 'FolderOpen' },
    { label: 'Case Viewer', path: '/case-viewer-details', icon: 'Eye' },
  ];

  const profileMenuItems = [
    { label: 'Profile Settings', path: '/user-profile-settings', icon: 'Settings' },
    { label: 'Security', path: '/security', icon: 'Shield' },
    { label: 'Help & Support', path: '/support', icon: 'HelpCircle' },
    { label: 'Sign Out', path: '/login-registration', icon: 'LogOut' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleProfileItemClick = (path) => {
    setIsProfileOpen(false);
    if (path === '/login-registration') {
      // Handle logout logic here
      localStorage.removeItem('authToken');
    }
  };

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

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/dashboard-overview" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Icon name="Activity" size={24} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-heading font-semibold text-primary">
                AGNO
              </h1>
              <p className="text-xs font-caption text-muted-foreground -mt-1">
                Medical Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-body font-medium transition-colors duration-200 ${
                isActivePath(item.path)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsNotifOpen((v) => !v)}
            >
              <Icon name="Bell" size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.2em] h-5 px-1 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-card">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </Button>
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-md shadow-modal z-[1100] animate-fade-in">
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <span className="font-heading font-semibold text-sm text-popover-foreground">Notifications</span>
                  <span className="text-xs text-muted-foreground">{notifications.filter(n => !n.read).length} new</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-border">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">No notifications</div>
                  ) : notifications.map((notif) => (
                    <Link
                      key={notif.id}
                      to={`/case-viewer-details?caseId=${notif.caseId}`}
                      className={`p-4 flex flex-col transition duration-150 hover:bg-accent/30 hover:shadow-lg hover:border-accent border border-transparent ${notif.read ? 'bg-muted' : 'bg-accent/10'}`}
                      onClick={() => setIsNotifOpen(false)}
                    >
                      <span className="text-sm text-popover-foreground">{notif.message}</span>
                      <span className="text-xs text-muted-foreground mt-1">{notif.time}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Message Button */}
          <button
            onClick={() => setIsMessageOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-accent/10 hover:bg-accent/20 transition border border-accent/20"
            title="Messages"
          >
            <Icon name="MessageCircle" size={20} className="text-accent" />
          </button>
          {/* Profile Shortcut Button */}
          <Link
            to={`/profile/${encodeURIComponent(userInfo.email)}`}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-accent/10 hover:bg-accent/20 transition border border-accent/20"
            title="View My Profile"
          >
            <Icon name="User" size={20} className="text-accent" />
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleProfileToggle}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-body font-medium text-foreground">Welcome back, {displayName}</p>
                <p className="text-xs text-muted-foreground">Verified Physician</p>
              </div>
              <Icon name="ChevronDown" size={16} />
            </Button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-md shadow-modal z-[1100] animate-fade-in">
                <div className="p-3 border-b border-border">
                  <Link
                    to={`/profile/${encodeURIComponent(userInfo.email)}`}
                    className="font-body font-medium text-sm text-accent hover:underline"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {displayName}
                  </Link>
                  <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                  <div className="flex items-center mt-1">
                    <Icon name="Shield" size={12} className="text-success mr-1" />
                    <span className="text-xs text-success">Verified Physician</span>
                  </div>
                </div>
                <div className="py-1">
                  {profileMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => handleProfileItemClick(item.path)}
                      className="flex items-center space-x-3 px-3 py-2 text-sm font-body text-popover-foreground hover:bg-muted transition-colors duration-200"
                    >
                      <Icon name={item.icon} size={16} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={handleMobileMenuToggle}
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-slide-in">
          <nav className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-body font-medium transition-colors duration-200 ${
                  isActivePath(item.path)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Messaging Modal Placeholder */}
      {isMessageOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-lg shadow-xl p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-muted-foreground hover:text-accent" onClick={() => setIsMessageOpen(false)}>
              <Icon name="X" size={20} />
            </button>
            <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
              <Icon name="MessageCircle" size={20} className="text-accent" /> Inbox (Coming Soon)
            </h2>
            <div className="text-muted-foreground">Threaded messaging UI will appear here.</div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;