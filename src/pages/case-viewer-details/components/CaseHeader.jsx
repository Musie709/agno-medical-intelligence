import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CaseHeader = ({ caseData, onEdit, onExport, onShare }) => {
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

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-heading font-semibold text-card-foreground">
              {caseData.title}
            </h1>
            <span className={`px-3 py-1 text-sm font-body font-medium rounded-full border ${getStatusColor(caseData.status)}`}>
              {caseData.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Icon name="Calendar" size={16} />
              <span>Submitted: {caseData.submissionDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Hash" size={16} />
              <span>Case ID: {caseData.caseId}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="User" size={16} />
              <span>Dr. {caseData.submittedBy}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {caseData.status.toLowerCase() === 'draft' && (
            <Button
              variant="outline"
              iconName="Edit"
              iconPosition="left"
              onClick={onEdit}
            >
              Edit Case
            </Button>
          )}
          <Button
            variant="ghost"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            Export PDF
          </Button>
          <Button
            variant="default"
            iconName="Share"
            iconPosition="left"
            onClick={onShare}
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaseHeader;