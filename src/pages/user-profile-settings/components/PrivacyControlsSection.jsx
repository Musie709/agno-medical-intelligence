import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const PrivacyControlsSection = () => {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'verified-professionals',
    caseDataSharing: 'anonymized-research',
    locationTracking: false,
    analyticsOptIn: true,
    thirdPartyIntegrations: false,
    publicDirectory: true,
    collaborationDiscovery: true
  });

  const [dataRetention, setDataRetention] = useState({
    caseDataRetention: '7-years',
    personalDataRetention: '5-years',
    auditLogRetention: '2-years'
  });

  const [auditLogs] = useState([
    {
      id: 1,
      action: 'Profile Updated',
      timestamp: '2024-07-14T16:30:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 120.0 on macOS',
      details: 'Updated professional bio and contact information'
    },
    {
      id: 2,
      action: 'Case Submitted',
      timestamp: '2024-07-14T14:15:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 120.0 on macOS',
      details: 'Submitted case #2024-001 - Respiratory symptoms'
    },
    {
      id: 3,
      action: 'Password Changed',
      timestamp: '2024-07-13T09:45:00Z',
      ipAddress: '192.168.1.101',
      userAgent: 'Safari 17.0 on iOS',
      details: 'Password successfully updated'
    },
    {
      id: 4,
      action: 'Login',
      timestamp: '2024-07-13T08:30:00Z',
      ipAddress: '192.168.1.101',
      userAgent: 'Safari 17.0 on iOS',
      details: 'Successful login from mobile device'
    },
    {
      id: 5,
      action: 'Data Export',
      timestamp: '2024-07-12T11:20:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome 120.0 on macOS',
      details: 'Exported personal case data (PDF format)'
    }
  ]);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const visibilityOptions = [
    { value: 'public', label: 'Public - Anyone can view' },
    { value: 'verified-professionals', label: 'Verified Professionals Only' },
    { value: 'institution-only', label: 'My Institution Only' },
    { value: 'private', label: 'Private - Hidden from directory' }
  ];

  const dataSharingOptions = [
    { value: 'no-sharing', label: 'No Data Sharing' },
    { value: 'anonymized-research', label: 'Anonymized Research Only' },
    { value: 'institutional-research', label: 'Institutional Research' },
    { value: 'public-health', label: 'Public Health Initiatives' }
  ];

  const retentionOptions = [
    { value: '1-year', label: '1 Year' },
    { value: '2-years', label: '2 Years' },
    { value: '5-years', label: '5 Years' },
    { value: '7-years', label: '7 Years' },
    { value: '10-years', label: '10 Years' },
    { value: 'indefinite', label: 'Indefinite' }
  ];

  const handleExportData = () => {
    // Simulate data export
    const exportData = {
      profile: privacySettings,
      cases: 'All submitted cases and related data',
      auditLogs: auditLogs,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agno-personal-data-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmationText === 'DELETE MY ACCOUNT') {
      // Simulate account deletion
      alert('Account deletion request submitted. You will receive a confirmation email within 24 hours.');
      setShowDeleteConfirmation(false);
      setDeleteConfirmationText('');
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionIcon = (action) => {
    switch (action.toLowerCase()) {
      case 'login':
        return 'LogIn';
      case 'logout':
        return 'LogOut';
      case 'profile updated':
        return 'User';
      case 'case submitted':
        return 'FileText';
      case 'password changed':
        return 'Key';
      case 'data export':
        return 'Download';
      default:
        return 'Activity';
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <div className="mb-6">
          <h2 className="text-xl font-heading font-semibold text-card-foreground">
            Privacy Controls
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your privacy settings and data sharing preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select
              label="Profile Visibility"
              description="Who can view your professional profile"
              options={visibilityOptions}
              value={privacySettings.profileVisibility}
              onChange={(value) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))}
            />

            <Select
              label="Case Data Sharing"
              description="How your anonymized case data can be used"
              options={dataSharingOptions}
              value={privacySettings.caseDataSharing}
              onChange={(value) => setPrivacySettings(prev => ({ ...prev, caseDataSharing: value }))}
            />

            <div className="space-y-3">
              <Checkbox
                label="Location Tracking"
                description="Allow location data to be collected for case mapping"
                checked={privacySettings.locationTracking}
                onChange={(e) => setPrivacySettings(prev => ({ 
                  ...prev, 
                  locationTracking: e.target.checked 
                }))}
              />

              <Checkbox
                label="Analytics Participation"
                description="Help improve the platform by sharing usage analytics"
                checked={privacySettings.analyticsOptIn}
                onChange={(e) => setPrivacySettings(prev => ({ 
                  ...prev, 
                  analyticsOptIn: e.target.checked 
                }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Checkbox
                label="Third-Party Integrations"
                description="Allow approved third-party tools to access your data"
                checked={privacySettings.thirdPartyIntegrations}
                onChange={(e) => setPrivacySettings(prev => ({ 
                  ...prev, 
                  thirdPartyIntegrations: e.target.checked 
                }))}
              />

              <Checkbox
                label="Public Directory Listing"
                description="Include your profile in the public professional directory"
                checked={privacySettings.publicDirectory}
                onChange={(e) => setPrivacySettings(prev => ({ 
                  ...prev, 
                  publicDirectory: e.target.checked 
                }))}
              />

              <Checkbox
                label="Collaboration Discovery"
                description="Allow other professionals to find and contact you for collaboration"
                checked={privacySettings.collaborationDiscovery}
                onChange={(e) => setPrivacySettings(prev => ({ 
                  ...prev, 
                  collaborationDiscovery: e.target.checked 
                }))}
              />
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Shield" size={16} className="text-success" />
                <span className="text-sm font-medium text-success">HIPAA Compliant</span>
              </div>
              <p className="text-xs text-muted-foreground">
                All data handling practices comply with HIPAA regulations and medical privacy standards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Retention */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <div className="mb-6">
          <h2 className="text-xl font-heading font-semibold text-card-foreground">
            Data Retention
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure how long different types of data are stored
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Case Data"
            description="Medical case submissions and related data"
            options={retentionOptions}
            value={dataRetention.caseDataRetention}
            onChange={(value) => setDataRetention(prev => ({ ...prev, caseDataRetention: value }))}
          />

          <Select
            label="Personal Data"
            description="Profile information and preferences"
            options={retentionOptions}
            value={dataRetention.personalDataRetention}
            onChange={(value) => setDataRetention(prev => ({ ...prev, personalDataRetention: value }))}
          />

          <Select
            label="Audit Logs"
            description="Activity logs and access records"
            options={retentionOptions}
            value={dataRetention.auditLogRetention}
            onChange={(value) => setDataRetention(prev => ({ ...prev, auditLogRetention: value }))}
          />
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-card-foreground">
              Activity Audit Log
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Review your recent account activity and access history
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={handleExportData}
          >
            Export Data
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mt-1">
                <Icon name={getActionIcon(log.action)} size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-card-foreground">{log.action}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <span>IP: {log.ipAddress}</span>
                  <span>{log.userAgent}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <div className="mb-6">
          <h2 className="text-xl font-heading font-semibold text-card-foreground">
            Data Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Export your data or permanently delete your account
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name="Download" size={20} className="text-accent" />
                <h3 className="font-medium text-card-foreground">Export Your Data</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Download a copy of all your personal data, including profile information, case submissions, and activity logs.
              </p>
              <Button
                variant="outline"
                onClick={handleExportData}
                iconName="Download"
                iconPosition="left"
                className="w-full"
              >
                Export All Data
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-error/20 rounded-lg bg-error/5">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name="Trash2" size={20} className="text-error" />
                <h3 className="font-medium text-error">Delete Account</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirmation(true)}
                iconName="Trash2"
                iconPosition="left"
                className="w-full"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="AlertTriangle" size={24} className="text-error" />
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                Delete Account
              </h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              This action will permanently delete your account and all associated data, including:
            </p>
            
            <ul className="text-sm text-muted-foreground mb-4 space-y-1">
              <li>• All submitted medical cases</li>
              <li>• Profile and credential information</li>
              <li>• Collaboration history</li>
              <li>• Activity logs and preferences</li>
            </ul>
            
            <p className="text-sm text-error mb-4">
              This action cannot be undone. Please type "DELETE MY ACCOUNT" to confirm:
            </p>
            
            <input
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="Type DELETE MY ACCOUNT"
              className="w-full p-3 border border-border rounded-md mb-4 font-mono text-sm"
            />
            
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setDeleteConfirmationText('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmationText !== 'DELETE MY ACCOUNT'}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyControlsSection;