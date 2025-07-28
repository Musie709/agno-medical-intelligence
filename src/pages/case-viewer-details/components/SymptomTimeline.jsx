import React from 'react';
import Icon from '../../../components/AppIcon';

const SymptomTimeline = ({ timeline }) => {
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'mild':
        return 'bg-success text-success-foreground';
      case 'moderate':
        return 'bg-warning text-warning-foreground';
      case 'severe':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTimelineIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'onset':
        return 'Play';
      case 'progression':
        return 'TrendingUp';
      case 'treatment':
        return 'Pill';
      case 'improvement':
        return 'TrendingDown';
      case 'complication':
        return 'AlertTriangle';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="Clock" size={20} className="text-primary" />
        <h2 className="text-lg font-heading font-semibold text-card-foreground">
          Symptom Timeline
        </h2>
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
        
        <div className="space-y-6">
          {timeline.map((event, index) => (
            <div key={index} className="relative flex items-start gap-4">
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-card border-2 border-primary rounded-full flex items-center justify-center">
                <Icon name={getTimelineIcon(event.type)} size={16} className="text-primary" />
              </div>
              
              {/* Event content */}
              <div className="flex-1 min-w-0 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-body font-semibold text-card-foreground">
                      {event.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-body font-medium rounded-full ${getSeverityColor(event.severity)}`}>
                      {event.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Icon name="Calendar" size={14} />
                    <span>{event.date}</span>
                    <span className="mx-1">•</span>
                    <Icon name="Clock" size={14} />
                    <span>{event.time}</span>
                  </div>
                </div>
                
                <p className="text-sm font-body text-muted-foreground mb-3">
                  {event.description}
                </p>
                
                {event.symptoms && event.symptoms.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-body font-medium text-card-foreground mb-2">
                      Symptoms Observed:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {event.symptoms.map((symptom, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-secondary/10 text-secondary border border-secondary/20 rounded-md"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {event.vitals && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-muted rounded-md">
                    {Object.entries(event.vitals).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-sm font-body font-semibold text-card-foreground">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SymptomTimeline;