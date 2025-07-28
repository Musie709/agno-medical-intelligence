import React from 'react';
import Icon from '../../../components/AppIcon';

const StepNavigation = ({ currentStep, setCurrentStep, completedSteps }) => {
  const steps = [
    { id: 1, title: 'Patient Info', icon: 'User' },
    { id: 2, title: 'Symptoms', icon: 'Stethoscope' },
    { id: 3, title: 'Timeline', icon: 'Clock' },
    { id: 4, title: 'Media', icon: 'Upload' },
    { id: 5, title: 'Review', icon: 'CheckCircle' }
  ];

  const getStepStatus = (stepId) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground border-success';
      case 'current':
        return 'bg-accent text-accent-foreground border-accent';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="w-full lg:w-64 bg-card border border-border rounded-lg p-6 shadow-card">
      <h3 className="text-lg font-heading font-semibold text-card-foreground mb-6">
        Case Submission Steps
      </h3>
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isClickable = step.id <= currentStep || completedSteps.includes(step.id);
          
          return (
            <div key={step.id} className="relative">
              {index < steps.length - 1 && (
                <div className={`absolute left-6 top-12 w-0.5 h-8 ${
                  completedSteps.includes(step.id) ? 'bg-success' : 'bg-border'
                }`} />
              )}
              <button
                onClick={() => isClickable && setCurrentStep(step.id)}
                disabled={!isClickable}
                className={`w-full flex items-center space-x-3 p-3 rounded-md border transition-all duration-200 ${
                  getStepClasses(status)
                } ${isClickable ? 'hover:shadow-sm cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  status === 'completed' ? 'bg-success-foreground' : 
                  status === 'current' ? 'bg-accent-foreground' : 'bg-muted-foreground'
                }`}>
                  {status === 'completed' ? (
                    <Icon name="Check" size={16} color="white" />
                  ) : (
                    <Icon name={step.icon} size={16} color="white" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className={`text-sm font-body font-medium ${
                    status === 'current' ? 'text-accent-foreground' : 
                    status === 'completed' ? 'text-success-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs opacity-75">
                    Step {step.id} of {steps.length}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Progress Indicator */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{Math.round((completedSteps.length / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StepNavigation;