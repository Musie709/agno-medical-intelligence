import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedCases, onBulkAction, onClearSelection }) => {
  const [bulkActionType, setBulkActionType] = useState('');

  const bulkActionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'export', label: 'Export Selected Cases' },
    { value: 'duplicate', label: 'Duplicate Selected Cases' },
    { value: 'archive', label: 'Archive Selected Cases' },
    { value: 'delete', label: 'Delete Selected Cases' }
  ];

  const statusUpdateOptions = [
    { value: '', label: 'Update status to...' },
    { value: 'draft', label: 'Mark as Draft' },
    { value: 'submitted', label: 'Mark as Submitted' },
    { value: 'flagged', label: 'Mark as Flagged' }
  ];

  const handleBulkAction = () => {
    if (bulkActionType && selectedCases.length > 0) {
      onBulkAction(bulkActionType, selectedCases);
      setBulkActionType('');
    }
  };

  const handleStatusUpdate = (status) => {
    if (status && selectedCases.length > 0) {
      onBulkAction('updateStatus', selectedCases, status);
    }
  };

  if (selectedCases.length === 0) {
    return null;
  }

  return (
    <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-accent" />
            <span className="text-sm font-medium text-foreground">
              {selectedCases.length} case{selectedCases.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
            iconSize={14}
          >
            Clear Selection
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Select
              options={statusUpdateOptions}
              value=""
              onChange={handleStatusUpdate}
              placeholder="Update status..."
              className="w-48"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Select
              options={bulkActionOptions}
              value={bulkActionType}
              onChange={setBulkActionType}
              placeholder="Select action..."
              className="w-48"
            />
            <Button
              variant="default"
              size="sm"
              onClick={handleBulkAction}
              disabled={!bulkActionType}
              iconName="Play"
              iconPosition="left"
              iconSize={14}
            >
              Execute
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-accent/20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAction('export', selectedCases)}
          iconName="Download"
          iconPosition="left"
          iconSize={14}
        >
          Export ({selectedCases.length})
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAction('duplicate', selectedCases)}
          iconName="Copy"
          iconPosition="left"
          iconSize={14}
        >
          Duplicate ({selectedCases.length})
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAction('archive', selectedCases)}
          iconName="Archive"
          iconPosition="left"
          iconSize={14}
        >
          Archive ({selectedCases.length})
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onBulkAction('delete', selectedCases)}
          iconName="Trash2"
          iconPosition="left"
          iconSize={14}
        >
          Delete ({selectedCases.length})
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;