import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FormNavigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  onSaveDraft, 
  canProceed, 
  isSubmitting,
  lastSaved 
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const formatLastSaved = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const saved = new Date(timestamp);
    const diffMinutes = Math.floor((now - saved) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Saved just now';
    if (diffMinutes < 60) return `Saved ${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Saved ${diffHours}h ago`;
    
    return saved.toLocaleDateString();
  };

  return (
    <div className="sticky bottom-0 bg-card border-t border-border p-6 mt-8">
      <div className="flex items-center justify-between">
        {/* Left Side - Previous Button */}
        <div className="flex items-center space-x-4">
          {!isFirstStep && (
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isSubmitting}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Previous
            </Button>
          )}
          
          {/* Auto-save Status */}
          {lastSaved && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Save" size={14} className="text-success" />
              <span>{formatLastSaved(lastSaved)}</span>
            </div>
          )}
        </div>

        {/* Center - Step Indicator */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-body text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index + 1 <= currentStep ? 'bg-accent' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Save Draft & Next/Submit */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            iconName="Save"
            iconPosition="left"
            size="sm"
          >
            Save Draft
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            loading={isSubmitting && isLastStep}
            iconName={isLastStep ? "Send" : "ChevronRight"}
            iconPosition="right"
          >
            {isLastStep ? 'Submit Case' : 'Next'}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-muted rounded-full h-1">
          <div 
            className="bg-accent h-1 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FormNavigation;