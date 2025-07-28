import React from 'react';
import Icon from '../../../components/AppIcon';

const CaseMetadata = ({ metadata }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'submitted':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'under review':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'flagged':
        return 'bg-error/10 text-error border-error/20';
      case 'approved':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="Info" size={20} className="text-primary" />
        <h2 className="text-lg font-heading font-semibold text-card-foreground">
          Case Metadata
        </h2>
      </div>
      
      <div className="space-y-4">
        {/* Case ID */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
          <div className="flex items-center gap-2">
            <Icon name="Hash" size={16} className="text-muted-foreground" />
            <span className="text-sm font-body font-medium text-card-foreground">Case ID</span>
          </div>
          <span className="text-sm font-body text-muted-foreground font-mono">
            {metadata.caseId}
          </span>
        </div>
        
        {/* Submission Date */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
          <div className="flex items-center gap-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <span className="text-sm font-body font-medium text-card-foreground">Submitted</span>
          </div>
          <span className="text-sm font-body text-muted-foreground">
            {metadata.submissionDate}
          </span>
        </div>
        
        {/* Last Updated */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-sm font-body font-medium text-card-foreground">Last Updated</span>
          </div>
          <span className="text-sm font-body text-muted-foreground">
            {metadata.lastUpdated}
          </span>
        </div>
        
        {/* Current Status */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
          <div className="flex items-center gap-2">
            <Icon name="Activity" size={16} className="text-muted-foreground" />
            <span className="text-sm font-body font-medium text-card-foreground">Status</span>
          </div>
          <span className={`px-2 py-1 text-xs font-body font-medium rounded-full border ${getStatusColor(metadata.status)}`}>
            {metadata.status}
          </span>
        </div>
        
        {/* Priority Level */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
          <div className="flex items-center gap-2">
            <Icon name="Flag" size={16} className="text-muted-foreground" />
            <span className="text-sm font-body font-medium text-card-foreground">Priority</span>
          </div>
          <span className={`text-sm font-body font-medium ${getPriorityColor(metadata.priority)}`}>
            {metadata.priority}
          </span>
        </div>
        
        {/* Assigned Reviewer */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
          <div className="flex items-center gap-2">
            <Icon name="UserCheck" size={16} className="text-muted-foreground" />
            <span className="text-sm font-body font-medium text-card-foreground">Reviewer</span>
          </div>
          <span className="text-sm font-body text-muted-foreground">
            {metadata.assignedReviewer || 'Not assigned'}
          </span>
        </div>
        
        {/* Category */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
          <div className="flex items-center gap-2">
            <Icon name="Tag" size={16} className="text-muted-foreground" />
            <span className="text-sm font-body font-medium text-card-foreground">Category</span>
          </div>
          <span className="text-sm font-body text-muted-foreground">
            {metadata.category}
          </span>
        </div>
        
        {/* Confidentiality Level */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
          <div className="flex items-center gap-2">
            <Icon name="Shield" size={16} className="text-muted-foreground" />
            <span className="text-sm font-body font-medium text-card-foreground">Confidentiality</span>
          </div>
          <span className="text-sm font-body text-muted-foreground">
            {metadata.confidentialityLevel}
          </span>
        </div>
      </div>
      
      {/* Status History */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-base font-body font-semibold text-card-foreground mb-4">
          Status History
        </h3>
        <div className="space-y-3">
          {metadata.statusHistory.map((entry, index) => (
            <div key={index} className="flex items-center gap-3 p-2">
              <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-body font-medium text-card-foreground">
                    {entry.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {entry.timestamp}
                  </span>
                </div>
                {entry.note && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {entry.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseMetadata;