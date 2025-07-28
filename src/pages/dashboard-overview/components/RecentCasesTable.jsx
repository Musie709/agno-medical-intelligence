import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import StatusBadge from './StatusBadge';

const RecentCasesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const mockCases = [
    {
      id: 'CASE-2024-001',
      title: 'Rare Respiratory Syndrome - Adult Male',
      submissionDate: '2024-07-14',
      status: 'submitted',
      priority: 'high',
      region: 'North America',
      lastModified: '2024-07-14T10:30:00Z'
    },
    {
      id: 'CASE-2024-002',
      title: 'Unusual Cardiac Arrhythmia Pattern',
      submissionDate: '2024-07-13',
      status: 'flagged',
      priority: 'critical',
      region: 'Europe',
      lastModified: '2024-07-13T15:45:00Z'
    },
    {
      id: 'CASE-2024-003',
      title: 'Neurological Symptoms - Pediatric',
      submissionDate: '2024-07-12',
      status: 'under review',
      priority: 'medium',
      region: 'Asia',
      lastModified: '2024-07-12T09:15:00Z'
    },
    {
      id: 'CASE-2024-004',
      title: 'Dermatological Manifestation Study',
      submissionDate: '2024-07-11',
      status: 'approved',
      priority: 'low',
      region: 'South America',
      lastModified: '2024-07-11T14:20:00Z'
    },
    {
      id: 'CASE-2024-005',
      title: 'Infectious Disease Outbreak Pattern',
      submissionDate: '2024-07-10',
      status: 'draft',
      priority: 'high',
      region: 'Africa',
      lastModified: '2024-07-10T11:00:00Z'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return { icon: 'AlertTriangle', color: 'text-error' };
      case 'high': return { icon: 'AlertCircle', color: 'text-warning' };
      case 'medium': return { icon: 'Info', color: 'text-accent' };
      case 'low': return { icon: 'Minus', color: 'text-muted-foreground' };
      default: return { icon: 'Minus', color: 'text-muted-foreground' };
    }
  };

  const filteredCases = mockCases.filter(caseItem =>
    caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCases = [...filteredCases].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.submissionDate);
        bValue = new Date(b.submissionDate);
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      default:
        aValue = a.submissionDate;
        bValue = b.submissionDate;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'ArrowUpDown';
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-heading font-semibold text-card-foreground">
              Recent Cases
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your recently submitted medical cases
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Icon 
                name="Search" 
                size={16} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
              />
            </div>
            <Link to="/case-submission-form">
              <Button variant="default" iconName="Plus" iconPosition="left">
                New Case
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center space-x-2 text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Case Title</span>
                  <Icon name={getSortIcon('title')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-2 text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Date</span>
                  <Icon name={getSortIcon('date')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-2 text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-body font-medium text-muted-foreground">Priority</span>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-body font-medium text-muted-foreground">Region</span>
              </th>
              <th className="text-right p-4">
                <span className="text-sm font-body font-medium text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCases.map((caseItem) => {
              const priorityConfig = getPriorityIcon(caseItem.priority);
              return (
                <tr key={caseItem.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div>
                      <Link 
                        to="/case-viewer-details" 
                        className="text-sm font-body font-medium text-card-foreground hover:text-accent transition-colors"
                      >
                        {caseItem.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        {caseItem.id}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-body text-card-foreground">
                      {formatDate(caseItem.submissionDate)}
                    </span>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={caseItem.status} size="sm" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name={priorityConfig.icon} size={16} className={priorityConfig.color} />
                      <span className="text-sm font-body text-card-foreground capitalize">
                        {caseItem.priority}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-body text-card-foreground">
                      {caseItem.region}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Link to="/case-viewer-details">
                        <Button variant="ghost" size="sm" iconName="Eye">
                          View
                        </Button>
                      </Link>
                      {caseItem.status === 'draft' && (
                        <Link to="/case-submission-form">
                          <Button variant="ghost" size="sm" iconName="Edit">
                            Edit
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {sortedCases.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-heading font-medium text-card-foreground mb-2">
            No cases found
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Start by submitting your first medical case'}
          </p>
          <Link to="/case-submission-form">
            <Button variant="default" iconName="Plus" iconPosition="left">
              Submit New Case
            </Button>
          </Link>
        </div>
      )}

      {/* Footer */}
      {sortedCases.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {sortedCases.length} of {mockCases.length} cases</span>
            <Link to="/personal-case-management" className="text-accent hover:text-accent/80 transition-colors">
              View all cases →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentCasesTable;