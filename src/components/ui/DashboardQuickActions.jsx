import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const DashboardQuickActions = () => {
  const quickActions = [
    {
      title: 'Submit New Case',
      description: 'Report a new medical case',
      icon: 'Plus',
      path: '/case-submission-form',
      variant: 'default',
      color: 'bg-accent'
    },
    {
      title: 'View My Cases',
      description: 'Manage submitted cases',
      icon: 'FolderOpen',
      path: '/personal-case-management',
      variant: 'outline',
      color: 'bg-secondary'
    },
    {
      title: 'Case Analytics',
      description: 'Review case statistics',
      icon: 'BarChart3',
      path: '/case-analytics',
      variant: 'ghost',
      color: 'bg-primary'
    }
  ];

  const recentDrafts = [
    {
      id: 1,
      title: 'Respiratory Case #2024-001',
      lastModified: '2 hours ago',
      status: 'draft'
    },
    {
      id: 2,
      title: 'Cardiac Event #2024-002',
      lastModified: '1 day ago',
      status: 'draft'
    }
  ];

  const caseStats = {
    submitted: 24,
    pending: 3,
    approved: 21,
    drafts: 2
  };

  return (
    <div className="w-full lg:w-80 space-y-6">
      {/* Quick Actions Card */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
          Quick Actions
        </h3>
        <div className="space-y-3">
          {quickActions.map((action) => (
            <Link key={action.path} to={action.path} className="block">
              <div className="flex items-center p-3 rounded-md border border-border hover:bg-muted transition-colors duration-200 group">
                <div className={`w-10 h-10 ${action.color} rounded-md flex items-center justify-center mr-3`}>
                  <Icon name={action.icon} size={20} color="white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-body font-medium text-card-foreground group-hover:text-accent">
                    {action.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-accent" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Case Statistics Card */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
          Case Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-md">
            <div className="text-2xl font-heading font-semibold text-accent">
              {caseStats.submitted}
            </div>
            <div className="text-xs text-muted-foreground">Total Cases</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-md">
            <div className="text-2xl font-heading font-semibold text-warning">
              {caseStats.pending}
            </div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-md">
            <div className="text-2xl font-heading font-semibold text-success">
              {caseStats.approved}
            </div>
            <div className="text-xs text-muted-foreground">Approved</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-md">
            <div className="text-2xl font-heading font-semibold text-secondary">
              {caseStats.drafts}
            </div>
            <div className="text-xs text-muted-foreground">Drafts</div>
          </div>
        </div>
      </div>

      {/* Recent Drafts Card */}
      {recentDrafts.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-card-foreground">
              Recent Drafts
            </h3>
            <Link to="/personal-case-management">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentDrafts.map((draft) => (
              <div key={draft.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex-1">
                  <h4 className="text-sm font-body font-medium text-card-foreground">
                    {draft.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Modified {draft.lastModified}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs bg-warning/10 text-warning rounded-full">
                    Draft
                  </span>
                  <Button variant="ghost" size="sm">
                    <Icon name="Edit" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Status Card */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
          System Status
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm font-body text-card-foreground">API Status</span>
            </div>
            <span className="text-xs text-success">Operational</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm font-body text-card-foreground">Database</span>
            </div>
            <span className="text-xs text-success">Healthy</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-sm font-body text-card-foreground">Maintenance</span>
            </div>
            <span className="text-xs text-warning">Scheduled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardQuickActions;