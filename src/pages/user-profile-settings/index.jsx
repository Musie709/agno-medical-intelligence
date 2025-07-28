import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProfileSidebar from './components/ProfileSidebar';
import PersonalInformationSection from './components/PersonalInformationSection';
import MedicalCredentialsSection from './components/MedicalCredentialsSection';
import SecuritySettingsSection from './components/SecuritySettingsSection';
import NotificationPreferencesSection from './components/NotificationPreferencesSection';
import PrivacyControlsSection from './components/PrivacyControlsSection';

const UserProfileSettings = () => {
  const [activeSection, setActiveSection] = useState('personal');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInformationSection />;
      case 'credentials':
        return <MedicalCredentialsSection />;
      case 'security':
        return <SecuritySettingsSection />;
      case 'notifications':
        return <NotificationPreferencesSection />;
      case 'privacy':
        return <PrivacyControlsSection />;
      default:
        return <PersonalInformationSection />;
    }
  };

  const getSectionTitle = () => {
    const titles = {
      personal: 'Personal Information',
      credentials: 'Medical Credentials',
      security: 'Security Settings',
      notifications: 'Notification Preferences',
      privacy: 'Privacy Controls'
    };
    return titles[activeSection] || 'Personal Information';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-semibold text-foreground mb-2">
              Profile & Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account information, credentials, and platform preferences
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProfileSidebar 
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              <div className="lg:hidden mb-6">
                <h2 className="text-xl font-heading font-semibold text-foreground">
                  {getSectionTitle()}
                </h2>
              </div>
              
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfileSettings;