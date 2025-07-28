import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const NotificationPreferencesSection = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    caseStatusUpdates: true,
    systemAnnouncements: true,
    collaborationRequests: true,
    weeklyDigest: false,
    securityAlerts: true,
    maintenanceNotices: true,
    newFeatures: false,
    communityUpdates: false
  });

  const [pushNotifications, setPushNotifications] = useState({
    caseStatusUpdates: true,
    urgentAlerts: true,
    collaborationRequests: false,
    systemAlerts: true
  });

  const [notificationTiming, setNotificationTiming] = useState({
    frequency: 'immediate',
    quietHours: true,
    quietStart: '22:00',
    quietEnd: '08:00',
    timezone: 'America/Los_Angeles',
    weekendNotifications: false
  });

  const frequencyOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'hourly', label: 'Hourly Digest' },
    { value: 'daily', label: 'Daily Digest' },
    { value: 'weekly', label: 'Weekly Digest' }
  ];

  const timezoneOptions = [
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
  ];

  const [isSaving, setIsSaving] = useState(false);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const handleTestNotification = () => {
    // Simulate test notification
    alert('Test notification sent! Check your email and push notifications.');
  };

  const notificationCategories = [
    {
      title: 'Case Management',
      description: 'Notifications about your submitted cases and their status',
      items: [
        {
          key: 'caseStatusUpdates',
          label: 'Case Status Updates',
          description: 'When your case status changes (submitted, reviewed, flagged)',
          email: emailNotifications.caseStatusUpdates,
          push: pushNotifications.caseStatusUpdates
        }
      ]
    },
    {
      title: 'Collaboration',
      description: 'Notifications about collaboration requests and team activities',
      items: [
        {
          key: 'collaborationRequests',
          label: 'Collaboration Requests',
          description: 'When other professionals want to collaborate on cases',
          email: emailNotifications.collaborationRequests,
          push: pushNotifications.collaborationRequests
        }
      ]
    },
    {
      title: 'System & Security',
      description: 'Important system updates and security notifications',
      items: [
        {
          key: 'systemAnnouncements',
          label: 'System Announcements',
          description: 'Important platform updates and announcements',
          email: emailNotifications.systemAnnouncements,
          push: pushNotifications.systemAlerts
        },
        {
          key: 'securityAlerts',
          label: 'Security Alerts',
          description: 'Login attempts, password changes, and security events',
          email: emailNotifications.securityAlerts,
          push: pushNotifications.urgentAlerts
        },
        {
          key: 'maintenanceNotices',
          label: 'Maintenance Notices',
          description: 'Scheduled maintenance and downtime notifications',
          email: emailNotifications.maintenanceNotices,
          push: false
        }
      ]
    },
    {
      title: 'Community & Updates',
      description: 'Optional notifications about platform community and features',
      items: [
        {
          key: 'weeklyDigest',
          label: 'Weekly Digest',
          description: 'Summary of platform activity and your case statistics',
          email: emailNotifications.weeklyDigest,
          push: false
        },
        {
          key: 'newFeatures',
          label: 'New Features',
          description: 'Announcements about new platform features and tools',
          email: emailNotifications.newFeatures,
          push: false
        },
        {
          key: 'communityUpdates',
          label: 'Community Updates',
          description: 'News from the medical professional community',
          email: emailNotifications.communityUpdates,
          push: false
        }
      ]
    }
  ];

  // Get logged-in user info safely
  let userInfo = {};
  try {
    const raw = localStorage.getItem('userInfo');
    userInfo = raw && raw !== 'undefined' ? JSON.parse(raw) : {};
  } catch {
    userInfo = {};
  }

  return (
    <div className="space-y-6">
      {/* Notification Categories */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-card-foreground">
              Notification Preferences
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Choose how and when you want to receive notifications
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              iconName="Bell"
              iconPosition="left"
              onClick={handleTestNotification}
            >
              Test Notification
            </Button>
            <Button
              variant="default"
              size="sm"
              loading={isSaving}
              iconName="Save"
              iconPosition="left"
              onClick={handleSavePreferences}
            >
              Save Preferences
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {notificationCategories.map((category) => (
            <div key={category.title} className="border border-border rounded-lg p-4">
              <div className="mb-4">
                <h3 className="text-lg font-heading font-medium text-card-foreground">
                  {category.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>

              <div className="space-y-4">
                {category.items.map((item) => (
                  <div key={item.key} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-card-foreground">{item.label}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                    <div className="flex items-center space-x-6 ml-4">
                      <div className="flex items-center space-x-2">
                        <Icon name="Mail" size={16} className="text-muted-foreground" />
                        <Checkbox
                          checked={item.email}
                          onChange={(e) => setEmailNotifications(prev => ({ 
                            ...prev, 
                            [item.key]: e.target.checked 
                          }))}
                        />
                      </div>
                      {item.push !== false && (
                        <div className="flex items-center space-x-2">
                          <Icon name="Smartphone" size={16} className="text-muted-foreground" />
                          <Checkbox
                            checked={item.push}
                            onChange={(e) => setPushNotifications(prev => ({ 
                              ...prev, 
                              [item.key]: e.target.checked 
                            }))}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Timing */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <div className="mb-6">
          <h2 className="text-xl font-heading font-semibold text-card-foreground">
            Notification Timing
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure when and how often you receive notifications
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select
              label="Notification Frequency"
              description="How often you want to receive non-urgent notifications"
              options={frequencyOptions}
              value={notificationTiming.frequency}
              onChange={(value) => setNotificationTiming(prev => ({ ...prev, frequency: value }))}
            />

            <Select
              label="Timezone"
              description="Your local timezone for notification scheduling"
              options={timezoneOptions}
              value={notificationTiming.timezone}
              onChange={(value) => setNotificationTiming(prev => ({ ...prev, timezone: value }))}
            />
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <Checkbox
                label="Enable Quiet Hours"
                description="Pause non-urgent notifications during specified hours"
                checked={notificationTiming.quietHours}
                onChange={(e) => setNotificationTiming(prev => ({ 
                  ...prev, 
                  quietHours: e.target.checked 
                }))}
              />
              
              {notificationTiming.quietHours && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={notificationTiming.quietStart}
                      onChange={(e) => setNotificationTiming(prev => ({ 
                        ...prev, 
                        quietStart: e.target.value 
                      }))}
                      className="w-full p-2 border border-border rounded-md bg-input text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={notificationTiming.quietEnd}
                      onChange={(e) => setNotificationTiming(prev => ({ 
                        ...prev, 
                        quietEnd: e.target.value 
                      }))}
                      className="w-full p-2 border border-border rounded-md bg-input text-foreground"
                    />
                  </div>
                </div>
              )}
            </div>

            <Checkbox
              label="Weekend Notifications"
              description="Receive non-urgent notifications on weekends"
              checked={notificationTiming.weekendNotifications}
              onChange={(e) => setNotificationTiming(prev => ({ 
                ...prev, 
                weekendNotifications: e.target.checked 
              }))}
            />
          </div>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <div className="mb-6">
          <h2 className="text-xl font-heading font-semibold text-card-foreground">
            Notification Channels
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage how you receive different types of notifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Icon name="Mail" size={20} color="white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-card-foreground">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">{userInfo.email}</p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full"></div>
            </div>

            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Icon name="Smartphone" size={20} color="white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-card-foreground">Push Notifications</h3>
                <p className="text-sm text-muted-foreground">Enabled on this device</p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full"></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-card-foreground mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Volume"
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  Enable All Notifications
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="VolumeX"
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  Disable All Notifications
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="RotateCcw"
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferencesSection;