import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const CaseTable = ({ cases, onCaseAction, selectedCases, onSelectionChange }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'submissionDate', direction: 'desc' });

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-warning/10 text-warning', icon: 'Edit' },
      submitted: { color: 'bg-accent/10 text-accent', icon: 'Clock' },
      flagged: { color: 'bg-error/10 text-error', icon: 'Flag' },
      approved: { color: 'bg-success/10 text-success', icon: 'CheckCircle' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon name={config.icon} size={12} className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-accent" />
      : <Icon name="ArrowDown" size={14} className="text-accent" />;
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(cases.map(c => c.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectCase = (caseId, checked) => {
    if (checked) {
      onSelectionChange([...selectedCases, caseId]);
    } else {
      onSelectionChange(selectedCases.filter(id => id !== caseId));
    }
  };

  const isAllSelected = cases.length > 0 && selectedCases.length === cases.length;
  const isIndeterminate = selectedCases.length > 0 && selectedCases.length < cases.length;

  return (
    <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent"
                >
                  <span>Case Title</span>
                  {getSortIcon('title')}
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('demographics')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent"
                >
                  <span>Demographics</span>
                  {getSortIcon('demographics')}
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('submissionDate')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent"
                >
                  <span>Submission Date</span>
                  {getSortIcon('submissionDate')}
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent"
                >
                  <span>Status</span>
                  {getSortIcon('status')}
                </button>
              </th>
              <th className="text-center px-4 py-3">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {cases.map((caseItem) => (
              <tr key={caseItem.id} className="hover:bg-muted/50 transition-colors duration-200">
                <td className="px-4 py-4">
                  <Checkbox
                    checked={selectedCases.includes(caseItem.id)}
                    onChange={(e) => handleSelectCase(caseItem.id, e.target.checked)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div>
                    <h3 className="text-sm font-medium text-card-foreground">{caseItem.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{caseItem.symptoms}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-card-foreground">
                    <div>{caseItem.demographics.age}Y, {caseItem.demographics.gender}</div>
                    <div className="text-xs text-muted-foreground">{caseItem.demographics.region}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-card-foreground">
                    {new Date(caseItem.submissionDate).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(caseItem.submissionDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                  </div>
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(caseItem.status)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCaseAction('view', caseItem.id)}
                      iconName="Eye"
                      iconSize={14}
                      className="w-24"
                    >
                      View
                    </Button>
                    {caseItem.status === 'draft' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCaseAction('edit', caseItem.id)}
                        iconName="Edit"
                        iconSize={14}
                        className="w-24"
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCaseAction('duplicate', caseItem.id)}
                      iconName="Copy"
                      iconSize={14}
                      className="w-24"
                    >
                      Duplicate
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCaseAction('delete', caseItem.id)}
                      iconName="Trash2"
                      iconSize={14}
                      className="text-error hover:text-error w-24"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {cases.map((caseItem) => (
          <div key={caseItem.id} className="border-b border-border p-4 last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedCases.includes(caseItem.id)}
                  onChange={(e) => handleSelectCase(caseItem.id, e.target.checked)}
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-card-foreground">{caseItem.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{caseItem.symptoms}</p>
                </div>
              </div>
              {getStatusBadge(caseItem.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
              <div>
                <span className="text-muted-foreground">Demographics:</span>
                <div className="text-card-foreground">
                  {caseItem.demographics.age}Y, {caseItem.demographics.gender}
                </div>
                <div className="text-muted-foreground">{caseItem.demographics.region}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Submitted:</span>
                <div className="text-card-foreground">
                  {new Date(caseItem.submissionDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCaseAction('view', caseItem.id)}
                  iconName="Eye"
                  iconSize={14}
                >
                  View
                </Button>
                {caseItem.status === 'draft' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCaseAction('edit', caseItem.id)}
                    iconName="Edit"
                    iconSize={14}
                  >
                    Edit
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCaseAction('duplicate', caseItem.id)}
                  iconName="Copy"
                  iconSize={14}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCaseAction('delete', caseItem.id)}
                  iconName="Trash2"
                  iconSize={14}
                  className="text-error hover:text-error"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {cases.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">No cases found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or create a new case to get started.
          </p>
          <Button
            variant="default"
            onClick={() => onCaseAction('create')}
            iconName="Plus"
            iconPosition="left"
          >
            Create New Case
          </Button>
        </div>
      )}
    </div>
  );
};

export default CaseTable;