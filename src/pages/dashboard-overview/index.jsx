import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import DashboardQuickActions from '../../components/ui/DashboardQuickActions';
import MetricsCard from './components/MetricsCard';
import RecentCasesTable from './components/RecentCasesTable';
import SystemAnnouncements from './components/SystemAnnouncements';
import ActivityFeed from './components/ActivityFeed';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CaseMap from '../../components/CaseMap';

const DashboardOverview = () => {
  const metricsData = [
    {
      title: 'Total Cases Submitted',
      value: '24',
      trend: 'up',
      trendValue: '+12%',
      icon: 'FileText',
      color: 'bg-accent',
      description: 'Cases submitted this month'
    },
    {
      title: 'Flagged Cases',
      value: '3',
      trend: 'down',
      trendValue: '-25%',
      icon: 'Flag',
      color: 'bg-error',
      description: 'Cases requiring attention'
    },
    {
      title: 'Approved Cases',
      value: '21',
      trend: 'up',
      trendValue: '+18%',
      icon: 'CheckCircle',
      color: 'bg-success',
      description: 'Successfully processed cases'
    },
    {
      title: 'Draft Cases',
      value: '2',
      trend: 'neutral',
      trendValue: '0%',
      icon: 'Edit',
      color: 'bg-warning',
      description: 'Cases in progress'
    }
  ];

  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Minimal Global Map at Top */}
          <div className="mb-4">
            <CaseMap />
          </div>
          <Breadcrumb />
          
          {/* Welcome Section */}
          <div className="mb-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-heading font-semibold text-foreground mb-2">
                  Welcome back, {displayName}
                </h1>
                <p className="text-muted-foreground font-body">
                  {currentDate} • Here's your medical case overview
                </p>
              </div>
              <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                <Link to="/case-submission-form">
                  <Button variant="default" iconName="Plus" iconPosition="left" size="lg">
                    Submit New Case
                  </Button>
                </Link>
                <Button variant="outline" iconName="Download" iconPosition="left">
                  Export Data
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            {metricsData.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric.title}
                value={metric.value}
                trend={metric.trend}
                trendValue={metric.trendValue}
                icon={metric.icon}
                color={metric.color}
                description={metric.description}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Left Column - Recent Cases Table and Activity Feed */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <RecentCasesTable />
              <ActivityFeed />
            </div>
            {/* Right Column - Quick Actions & Announcements, System Health */}
            <div className="lg:col-span-4 space-y-6">
              <DashboardQuickActions />
              <SystemAnnouncements />
              <div className="bg-card border border-border rounded-lg p-6 shadow-card">
                <div className="flex items-center space-x-3 mb-6">
                  <Icon name="Activity" size={20} className="text-success" />
                  <h3 className="text-lg font-heading font-semibold text-card-foreground">
                    System Health
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <span className="text-sm font-body text-card-foreground">API Services</span>
                    </div>
                    <span className="text-xs text-success font-medium">Operational</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <span className="text-sm font-body text-card-foreground">Database</span>
                    </div>
                    <span className="text-xs text-success font-medium">Healthy</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <span className="text-sm font-body text-card-foreground">File Storage</span>
                    </div>
                    <span className="text-xs text-success font-medium">Available</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-warning rounded-full"></div>
                      <span className="text-sm font-body text-card-foreground">Maintenance</span>
                    </div>
                    <span className="text-xs text-warning font-medium">Scheduled</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">
                      Last updated: {new Date().toLocaleTimeString('en-GB', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    <Button variant="ghost" size="sm" iconName="RefreshCw">
                      Refresh Status
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardOverview;