import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { analyzeGlobalHealthPatterns } from '../../../services/openaiService';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [globalInsights, setGlobalInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  // Mock case data for global analysis
  const mockCaseData = [
    {
      region: 'Europe',
      symptoms: ['fever', 'respiratory symptoms', 'fatigue'],
      timeline: '2025-01-10 to 2025-01-14',
      demographics: 'Adult, Female'
    },
    {
      region: 'Asia',
      symptoms: ['neurological symptoms', 'headache', 'confusion'],
      timeline: '2025-01-12 to 2025-01-14',
      demographics: 'Elderly, Male'
    },
    {
      region: 'North America',
      symptoms: ['skin rash', 'joint pain', 'fever'],
      timeline: '2025-01-08 to 2025-01-14',
      demographics: 'Young Adult, Female'
    },
    {
      region: 'Europe',
      symptoms: ['respiratory symptoms', 'chest pain', 'cough'],
      timeline: '2025-01-11 to 2025-01-14',
      demographics: 'Adult, Male'
    },
    {
      region: 'Asia',
      symptoms: ['gastrointestinal symptoms', 'nausea', 'abdominal pain'],
      timeline: '2025-01-09 to 2025-01-14',
      demographics: 'Middle-aged, Female'
    }
  ];

  useEffect(() => {
    // Initialize with recent activities
    const initialActivities = [
      {
        id: 1,
        type: 'case_submitted',
        title: 'New Case Submitted',
        description: 'Dr. Martinez submitted a case of unusual neurological symptoms',
        timestamp: '2 hours ago',
        icon: 'FileText',
        color: 'text-accent'
      },
      {
        id: 2,
        type: 'ai_analysis',
        title: 'AI Analysis Completed',
        description: 'Diagnostic insights generated for Case #AGNO-2025-1234',
        timestamp: '4 hours ago',
        icon: 'Brain',
        color: 'text-success'
      },
      {
        id: 3,
        type: 'alert',
        title: 'Rare Disease Alert',
        description: 'Potential cluster of similar cases detected in Northern Italy',
        timestamp: '6 hours ago',
        icon: 'AlertTriangle',
        color: 'text-error'
      },
      {
        id: 4,
        type: 'collaboration',
        title: 'Expert Consultation',
        description: 'Dr. Chen requested consultation on Case #AGNO-2025-1229',
        timestamp: '8 hours ago',
        icon: 'Users',
        color: 'text-warning'
      },
      {
        id: 5,
        type: 'system',
        title: 'System Update',
        description: 'AI diagnostic model updated with latest medical research',
        timestamp: '12 hours ago',
        icon: 'Settings',
        color: 'text-secondary'
      }
    ];

    setActivities(initialActivities);
  }, []);

  const handleGenerateInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const insights = await analyzeGlobalHealthPatterns(mockCaseData);
      setGlobalInsights(insights);
      setShowInsights(true);
      
      // Add AI insights to activity feed
      const aiInsightActivity = {
        id: Date.now(),
        type: 'ai_insight',
        title: 'Global Health Analysis Generated',
        description: 'AI identified new patterns in global case submissions',
        timestamp: 'Just now',
        icon: 'Globe',
        color: 'text-accent'
      };
      
      setActivities(prev => [aiInsightActivity, ...prev]);
    } catch (error) {
      console.error('Error generating global insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'case_submitted':
        return 'FileText';
      case 'ai_analysis':
        return 'Brain';
      case 'alert':
        return 'AlertTriangle';
      case 'collaboration':
        return 'Users';
      case 'system':
        return 'Settings';
      case 'ai_insight':
        return 'Globe';
      default:
        return 'Bell';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'case_submitted':
        return 'text-accent';
      case 'ai_analysis':
        return 'text-success';
      case 'alert':
        return 'text-error';
      case 'collaboration':
        return 'text-warning';
      case 'system':
        return 'text-secondary';
      case 'ai_insight':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Activity" size={24} className="text-accent" />
          <h2 className="text-xl font-heading font-semibold text-card-foreground">
            Activity Feed
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Globe"
            onClick={handleGenerateInsights}
            disabled={isLoadingInsights}
          >
            {isLoadingInsights ? 'Analyzing...' : 'Global AI Analysis'}
          </Button>
        </div>
      </div>

      {/* Global Health Insights */}
      {showInsights && globalInsights && (
        <div className="mb-6 bg-accent/5 border border-accent/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Globe" size={20} className="text-accent" />
            <h3 className="text-lg font-semibold text-card-foreground">
              Global Health Intelligence
            </h3>
          </div>
          
          {/* Geographic Clusters */}
          {globalInsights.geographic_clusters?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-card-foreground mb-2">Geographic Clusters:</h4>
              <div className="space-y-2">
                {globalInsights.geographic_clusters.map((cluster, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex items-center space-x-2">
                      <Icon name="MapPin" size={16} className="text-accent" />
                      <span className="text-sm text-card-foreground">{cluster.region}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{cluster.case_count} cases</span>
                      <span className="px-2 py-1 text-xs bg-accent/20 text-accent rounded-full">
                        {cluster.pattern_type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emerging Threats */}
          {globalInsights.emerging_threats?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-card-foreground mb-2">Emerging Threats:</h4>
              <div className="space-y-2">
                {globalInsights.emerging_threats.map((threat, index) => (
                  <div key={index} className="p-3 bg-error/10 border border-error/20 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-card-foreground">{threat.threat_type}</span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        threat.risk_level === 'high' ? 'bg-error/20 text-error' : 
                        threat.risk_level === 'medium'? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                      }`}>
                        {threat.risk_level} risk
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Affected: {threat.affected_regions?.join(', ')}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <strong>Recommendations:</strong> {threat.recommendations?.join('; ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts */}
          {globalInsights.alerts?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-card-foreground mb-2">AI Alerts:</h4>
              <div className="space-y-2">
                {globalInsights.alerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2 bg-warning/10 border border-warning/20 rounded">
                    <Icon name="AlertTriangle" size={16} className="text-warning mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-card-foreground">{alert.alert_type}</span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          alert.severity === 'high' ? 'bg-error/20 text-error' : 
                          alert.severity === 'medium'? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activity Timeline */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center">
                <Icon 
                  name={getActivityIcon(activity.type)} 
                  size={16} 
                  className={getActivityColor(activity.type)} 
                />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-card-foreground">
                  {activity.title}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mt-1">
                {activity.description}
              </p>
              
              {activity.type === 'alert' && (
                <div className="mt-2 flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm">
                    Mark as Read
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-6 text-center">
        <Button variant="outline" size="sm" iconName="ChevronDown">
          Load More Activities
        </Button>
      </div>
    </div>
  );
};

export default ActivityFeed;