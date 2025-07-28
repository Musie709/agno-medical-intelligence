import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CaseFilters = ({ onFiltersChange, totalCases, filteredCases }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    symptomCategory: 'all',
    searchText: ''
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'flagged', label: 'Flagged' },
    { value: 'approved', label: 'Approved' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const symptomCategoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'respiratory', label: 'Respiratory' },
    { value: 'cardiovascular', label: 'Cardiovascular' },
    { value: 'neurological', label: 'Neurological' },
    { value: 'dermatological', label: 'Dermatological' },
    { value: 'gastrointestinal', label: 'Gastrointestinal' },
    { value: 'musculoskeletal', label: 'Musculoskeletal' },
    { value: 'endocrine', label: 'Endocrine' },
    { value: 'infectious', label: 'Infectious Disease' },
    { value: 'oncological', label: 'Oncological' },
    { value: 'psychiatric', label: 'Psychiatric' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: 'all',
      dateRange: 'all',
      symptomCategory: 'all',
      searchText: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.status !== 'all' || 
                          filters.dateRange !== 'all' || 
                          filters.symptomCategory !== 'all' || 
                          filters.searchText.trim() !== '';

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6 shadow-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-card-foreground mb-2 lg:mb-0">
          Filter Cases
        </h2>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Showing {filteredCases} of {totalCases} cases</span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={14}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
          className="w-full"
        />

        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={filters.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
          className="w-full"
        />

        <Select
          label="Symptom Category"
          options={symptomCategoryOptions}
          value={filters.symptomCategory}
          onChange={(value) => handleFilterChange('symptomCategory', value)}
          className="w-full"
          searchable
        />

        <div className="flex flex-col">
          <label className="text-sm font-body font-medium text-foreground mb-2">
            Search Cases
          </label>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search by title, symptoms, or ICD-10..."
              value={filters.searchText}
              onChange={(e) => handleFilterChange('searchText', e.target.value)}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.status !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
              Status: {statusOptions.find(opt => opt.value === filters.status)?.label}
              <button
                onClick={() => handleFilterChange('status', 'all')}
                className="ml-1 hover:text-accent-foreground"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          {filters.dateRange !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
              Date: {dateRangeOptions.find(opt => opt.value === filters.dateRange)?.label}
              <button
                onClick={() => handleFilterChange('dateRange', 'all')}
                className="ml-1 hover:text-secondary-foreground"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          {filters.symptomCategory !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              Category: {symptomCategoryOptions.find(opt => opt.value === filters.symptomCategory)?.label}
              <button
                onClick={() => handleFilterChange('symptomCategory', 'all')}
                className="ml-1 hover:text-primary-foreground"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          {filters.searchText.trim() !== '' && (
            <span className="inline-flex items-center px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">
              Search: "{filters.searchText}"
              <button
                onClick={() => handleFilterChange('searchText', '')}
                className="ml-1 hover:text-warning-foreground"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CaseFilters;