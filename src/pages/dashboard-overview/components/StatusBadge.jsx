import React from 'react';

const StatusBadge = ({ status, size = 'default' }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return {
          bg: 'bg-warning/10',
          text: 'text-warning',
          border: 'border-warning/20',
          label: 'Draft'
        };
      case 'submitted':
        return {
          bg: 'bg-accent/10',
          text: 'text-accent',
          border: 'border-accent/20',
          label: 'Submitted'
        };
      case 'flagged':
        return {
          bg: 'bg-error/10',
          text: 'text-error',
          border: 'border-error/20',
          label: 'Flagged'
        };
      case 'approved':
        return {
          bg: 'bg-success/10',
          text: 'text-success',
          border: 'border-success/20',
          label: 'Approved'
        };
      case 'under review':
        return {
          bg: 'bg-secondary/10',
          text: 'text-secondary',
          border: 'border-secondary/20',
          label: 'Under Review'
        };
      default:
        return {
          bg: 'bg-muted',
          text: 'text-muted-foreground',
          border: 'border-border',
          label: status
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center ${sizeClasses} font-body font-medium rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;