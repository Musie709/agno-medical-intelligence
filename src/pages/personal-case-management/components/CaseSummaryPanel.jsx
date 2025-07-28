import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CaseSummaryPanel = ({ cases }) => {
  const statusCounts = cases.reduce((acc, caseItem) => {
    acc[caseItem.status] = (acc[caseItem.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = [
    { name: 'Draft', value: statusCounts.draft || 0, color: '#FF9800' },
    { name: 'Submitted', value: statusCounts.submitted || 0, color: '#00BFA5' },
    { name: 'Flagged', value: statusCounts.flagged || 0, color: '#F44336' },
    { name: 'Approved', value: statusCounts.approved || 0, color: '#4CAF50' }
  ];

  const monthlyData = [
    { month: 'Jan', cases: 8 },
    { month: 'Feb', cases: 12 },
    { month: 'Mar', cases: 15 },
    { month: 'Apr', cases: 18 },
    { month: 'May', cases: 22 },
    { month: 'Jun', cases: 25 },
    { month: 'Jul', cases: 28 }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Case submitted',
      caseTitle: 'Respiratory Case #2024-045',
      timestamp: '2 hours ago',
      icon: 'Upload',
      color: 'text-accent'
    },
    {
      id: 2,
      action: 'Case approved',
      caseTitle: 'Cardiac Event #2024-044',
      timestamp: '5 hours ago',
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      id: 3,
      action: 'Case flagged',
      caseTitle: 'Neurological Case #2024-043',
      timestamp: '1 day ago',
      icon: 'Flag',
      color: 'text-error'
    },
    {
      id: 4,
      action: 'Draft saved',
      caseTitle: 'Dermatological Case #2024-042',
      timestamp: '2 days ago',
      icon: 'Edit',
      color: 'text-warning'
    },
    {
      id: 5,
      action: 'Case duplicated',
      caseTitle: 'Infectious Disease #2024-041',
      timestamp: '3 days ago',
      icon: 'Copy',
      color: 'text-secondary'
    }
  ];

  const totalCases = cases.length;
  const submittedCases = statusCounts.submitted || 0;
  const flaggedCases = statusCounts.flagged || 0;
  const draftCases = statusCounts.draft || 0;

  return (
    <div className="w-full lg:w-80 space-y-6">
      {/* Case Statistics Card */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
          Case Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-muted rounded-md">
            <div className="text-2xl font-heading font-semibold text-accent">
              {totalCases}
            </div>
            <div className="text-xs text-muted-foreground">Total Cases</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-md">
            <div className="text-2xl font-heading font-semibold text-success">
              {submittedCases}
            </div>
            <div className="text-xs text-muted-foreground">Submitted</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-md">
            <div className="text-2xl font-heading font-semibold text-error">
              {flaggedCases}
            </div>
            <div className="text-xs text-muted-foreground">Flagged</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-md">
            <div className="text-2xl font-heading font-semibold text-warning">
              {draftCases}
            </div>
            <div className="text-xs text-muted-foreground">Drafts</div>
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="h-48 mb-4">
          <h4 className="text-sm font-medium text-card-foreground mb-2">Status Distribution</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusData.map((item) => (
            <div key={item.name} className="flex items-center space-x-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs text-muted-foreground">
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
          Monthly Trend
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cases" fill="#00BFA5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-card-foreground">
            Recent Activity
          </h3>
          <Button variant="ghost" size="sm">
            <Icon name="MoreHorizontal" size={16} />
          </Button>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${activity.color}`}>
                <Icon name={activity.icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground">
                  {activity.action}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {activity.caseTitle}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" fullWidth>
            View All Activity
          </Button>
        </div>
      </div>

      {/* Quick Export Card */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
          Quick Export
        </h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            iconName="Download"
            iconPosition="left"
          >
            Export All Cases
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            iconName="FileText"
            iconPosition="left"
          >
            Generate Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            iconName="Share"
            iconPosition="left"
          >
            Share Statistics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaseSummaryPanel;