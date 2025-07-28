import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const SecuritySettingsSection = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [activeSessions] = useState([
    {
      id: 1,
      device: 'MacBook Pro',
      browser: 'Chrome 120.0',
      location: 'San Francisco, CA',
      ipAddress: '192.168.1.100',
      lastActive: '2024-07-14T18:30:00Z',
      isCurrent: true
    },
    {
      id: 2,
      device: 'iPhone 15',
      browser: 'Safari Mobile',
      location: 'San Francisco, CA',
      ipAddress: '192.168.1.101',
      lastActive: '2024-07-14T16:45:00Z',
      isCurrent: false
    },
    {
      id: 3,
      device: 'iPad Pro',
      browser: 'Safari',
      location: 'San Francisco, CA',
      ipAddress: '192.168.1.102',
      lastActive: '2024-07-13T22:15:00Z',
      isCurrent: false
    }
  ]);

  const [loginAlerts, setLoginAlerts] = useState({
    emailOnNewDevice: true,
    emailOnUnusualLocation: true,
    emailOnFailedAttempts: true
  });

  const handlePasswordChange = async () => {
    setIsChangingPassword(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsChangingPassword(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const generateBackupCodes = () => {
    const codes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    setBackupCodes(codes);
  };

  const handleSessionTerminate = (sessionId) => {
    // Simulate session termination
    console.log('Terminating session:', sessionId);
  };

  const getDeviceIcon = (device) => {
    if (device.includes('iPhone') || device.includes('Android')) return 'Smartphone';
    if (device.includes('iPad') || device.includes('Tablet')) return 'Tablet';
    return 'Monitor';
  };

  const formatLastActive = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Password Change Section */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-card-foreground">
              Password & Authentication
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your password and authentication settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Change Password */}
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-medium text-card-foreground">
              Change Password
            </h3>
            
            <Input
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              placeholder="Enter current password"
              required
            />
            
            <Input
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Enter new password"
              description="Must be at least 8 characters with uppercase, lowercase, and numbers"
              required
            />
            
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm new password"
              required
            />
            
            <Button
              variant="default"
              loading={isChangingPassword}
              onClick={handlePasswordChange}
              disabled={!passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
              className="w-full"
            >
              Update Password
            </Button>
          </div>

          {/* Two-Factor Authentication */}
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-medium text-card-foreground">
              Two-Factor Authentication
            </h3>
            
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${twoFactorEnabled ? 'bg-success' : 'bg-muted'}`}>
                    <Icon name={twoFactorEnabled ? "Shield" : "ShieldOff"} size={16} color={twoFactorEnabled ? "white" : "currentColor"} />
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">
                      {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {twoFactorEnabled ? 'Your account is protected' : 'Enable for better security'}
                    </p>
                  </div>
                </div>
                <Button
                  variant={twoFactorEnabled ? "outline" : "default"}
                  size="sm"
                  onClick={() => {
                    if (!twoFactorEnabled) {
                      setShowQRCode(true);
                      generateBackupCodes();
                    }
                    setTwoFactorEnabled(!twoFactorEnabled);
                  }}
                >
                  {twoFactorEnabled ? 'Disable' : 'Enable'}
                </Button>
              </div>
              
              {twoFactorEnabled && (
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="QrCode"
                    iconPosition="left"
                    onClick={() => setShowQRCode(!showQRCode)}
                    className="w-full"
                  >
                    {showQRCode ? 'Hide' : 'Show'} QR Code
                  </Button>
                  
                  {showQRCode && (
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <div className="w-32 h-32 bg-white border-2 border-border rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <Icon name="QrCode" size={48} className="text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Scan with your authenticator app
                      </p>
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Key"
                    iconPosition="left"
                    onClick={generateBackupCodes}
                    className="w-full"
                  >
                    Generate Backup Codes
                  </Button>
                  
                  {backupCodes.length > 0 && (
                    <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <p className="text-xs text-warning font-medium mb-2">
                        Save these backup codes in a secure location:
                      </p>
                      <div className="grid grid-cols-2 gap-1 text-xs font-mono">
                        {backupCodes.map((code, index) => (
                          <div key={index} className="p-1 bg-white rounded text-center">
                            {code}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-card-foreground">
              Active Sessions
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your active login sessions across devices
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="LogOut"
            iconPosition="left"
          >
            Sign Out All
          </Button>
        </div>

        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name={getDeviceIcon(session.device)} size={20} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-card-foreground">{session.device}</p>
                    {session.isCurrent && (
                      <span className="px-2 py-1 text-xs bg-success/10 text-success rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{session.browser}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.location} • {session.ipAddress}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {formatLastActive(session.lastActive)}
                </p>
                {!session.isCurrent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSessionTerminate(session.id)}
                    className="mt-1"
                  >
                    Terminate
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Login Alerts */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <div className="mb-6">
          <h2 className="text-xl font-heading font-semibold text-card-foreground">
            Login Alerts
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure when you want to be notified about account activity
          </p>
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Email me when I sign in from a new device"
            description="Get notified when your account is accessed from an unrecognized device"
            checked={loginAlerts.emailOnNewDevice}
            onChange={(e) => setLoginAlerts(prev => ({ ...prev, emailOnNewDevice: e.target.checked }))}
          />
          
          <Checkbox
            label="Email me when I sign in from an unusual location"
            description="Get notified when your account is accessed from a new geographic location"
            checked={loginAlerts.emailOnUnusualLocation}
            onChange={(e) => setLoginAlerts(prev => ({ ...prev, emailOnUnusualLocation: e.target.checked }))}
          />
          
          <Checkbox
            label="Email me about failed login attempts"
            description="Get notified when someone tries to access your account with wrong credentials"
            checked={loginAlerts.emailOnFailedAttempts}
            onChange={(e) => setLoginAlerts(prev => ({ ...prev, emailOnFailedAttempts: e.target.checked }))}
          />
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsSection;