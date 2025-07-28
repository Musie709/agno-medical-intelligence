import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemAnnouncements = () => {
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState([]);

  const announcements = [
    {
      id: 1,
      type: 'info',
      title: 'System Maintenance Scheduled',
      message: 'Planned maintenance window on July 20th, 2024 from 02:00-04:00 UTC. Limited functionality expected.',
      timestamp: '2024-07-14T08:00:00Z',
      dismissible: true
    },
    {
      id: 2,
      type: 'success',
      title: 'New AI Features Available',
      message: 'Enhanced symptom tagging and ICD-10 code suggestions are now live. Check the case submission form.',
      timestamp: '2024-07-13T14:30:00Z',
      dismissible: true
    },
    {
      id: 3,
      type: 'warning',
      title: 'Security Update Required',
      message: 'Please update your password if you haven\'t changed it in the last 90 days.',
      timestamp: '2024-07-12T09:15:00Z',
      dismissible: false
    }
  ];

  const getAnnouncementConfig = (type) => {
    switch (type) {
      case 'info':
        return {
          icon: 'Info',
          bgColor: 'bg-accent/10',
          borderColor: 'border-accent/20',
          iconColor: 'text-accent',
          titleColor: 'text-accent'
        };
      case 'success':
        return {
          icon: 'CheckCircle',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          iconColor: 'text-success',
          titleColor: 'text-success'
        };
      case 'warning':
        return {
          icon: 'AlertTriangle',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          iconColor: 'text-warning',
          titleColor: 'text-warning'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          iconColor: 'text-error',
          titleColor: 'text-error'
        };
      default:
        return {
          icon: 'Info',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          iconColor: 'text-muted-foreground',
          titleColor: 'text-foreground'
        };
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDismiss = (announcementId) => {
    setDismissedAnnouncements(prev => [...prev, announcementId]);
  };

  const visibleAnnouncements = announcements.filter(
    announcement => !dismissedAnnouncements.includes(announcement.id)
  );

  if (visibleAnnouncements.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Bell" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-heading font-semibold text-card-foreground">
            System Announcements
          </h3>
        </div>
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            All caught up! No new announcements.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="Bell" size={20} className="text-muted-foreground" />
        <h3 className="text-lg font-heading font-semibold text-card-foreground">
          System Announcements
        </h3>
        <span className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full">
          {visibleAnnouncements.length}
        </span>
      </div>

      <div className="space-y-4">
        {visibleAnnouncements.map((announcement) => {
          const config = getAnnouncementConfig(announcement.type);
          
          return (
            <div
              key={announcement.id}
              className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}
            >
              <div className="flex items-start space-x-3">
                <Icon 
                  name={config.icon} 
                  size={20} 
                  className={`${config.iconColor} mt-0.5 flex-shrink-0`} 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-sm font-body font-semibold ${config.titleColor}`}>
                      {announcement.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(announcement.timestamp)}
                      </span>
                      {announcement.dismissible && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDismiss(announcement.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Icon name="X" size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-card-foreground leading-relaxed">
                    {announcement.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>System status: All services operational</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAnnouncements;