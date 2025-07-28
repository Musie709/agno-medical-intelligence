import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import StepNavigation from './components/StepNavigation';
import PatientInfoStep from './components/PatientInfoStep';
import SymptomsStep from './components/SymptomsStep';
import TimelineStep from './components/TimelineStep';
import MediaUploadStep from './components/MediaUploadStep';
import ReviewStep from './components/ReviewStep';
import FormNavigation from './components/FormNavigation';
import Icon from '../../components/AppIcon';

const CaseSubmissionForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const [formData, setFormData] = useState({
    patientInfo: {
      ageGroup: '',
      sex: '',
      region: '',
      additionalInfo: ''
    },
    symptoms: {
      selectedSymptoms: [],
      primaryComplaint: '',
      severity: '',
      onset: '',
      clinicalNotes: '',
      rareIndicators: {}
    },
    timeline: {
      firstSymptomDate: '',
      firstSymptomTime: '',
      events: [],
      progressionNotes: ''
    },
    media: {
      files: [],
      description: ''
    }
  });

  const totalSteps = 5;

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      localStorage.setItem('caseSubmissionDraft', JSON.stringify({
        formData,
        currentStep,
        completedSteps,
        timestamp: new Date().toISOString()
      }));
      setLastSaved(new Date().toISOString());
    };

    const timer = setTimeout(autoSave, 2000);
    return () => clearTimeout(timer);
  }, [formData, currentStep, completedSteps]);

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('caseSubmissionDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft.formData);
        setCurrentStep(draft.currentStep);
        setCompletedSteps(draft.completedSteps);
        setLastSaved(draft.timestamp);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  const validateCurrentStep = () => {
    setErrors({});
    
    switch (currentStep) {
      case 1: // Patient Info
        const patientErrors = {};
        if (!formData.patientInfo.ageGroup) patientErrors.ageGroup = 'Age group is required';
        if (!formData.patientInfo.sex) patientErrors.sex = 'Sex is required';
        if (!formData.patientInfo.region) patientErrors.region = 'Region is required';
        setErrors(patientErrors);
        return Object.keys(patientErrors).length === 0;
        
      case 2: // Symptoms
        const symptomErrors = {};
        if (!formData.symptoms.selectedSymptoms || formData.symptoms.selectedSymptoms.length === 0) {
          symptomErrors.selectedSymptoms = 'At least one symptom must be selected';
        }
        if (!formData.symptoms.primaryComplaint) symptomErrors.primaryComplaint = 'Primary complaint is required';
        if (!formData.symptoms.severity) symptomErrors.severity = 'Severity assessment is required';
        if (!formData.symptoms.onset) symptomErrors.onset = 'Onset pattern is required';
        setErrors(symptomErrors);
        return Object.keys(symptomErrors).length === 0;
        
      case 3: // Timeline
        const timelineErrors = {};
        if (!formData.timeline.firstSymptomDate) timelineErrors.firstSymptomDate = 'First symptom date is required';
        if (!formData.timeline.events || formData.timeline.events.length === 0) {
          timelineErrors.events = 'At least one timeline event is required';
        }
        setErrors(timelineErrors);
        return Object.keys(timelineErrors).length === 0;
        
      case 4: // Media (optional step)
        return true;
        
      case 5: // Review
        return true;
        
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      
      if (currentStep === totalSteps) {
        handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveDraft = () => {
    const draftData = {
      formData,
      currentStep,
      completedSteps,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('caseSubmissionDraft', JSON.stringify(draftData));
    setLastSaved(new Date().toISOString());
    
    // Show success message (you could add a toast notification here)
    console.log('Draft saved successfully');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate case ID
      const caseId = `AGNO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      
      // Clear draft
      localStorage.removeItem('caseSubmissionDraft');
      
      // Navigate to success page or dashboard with success message
      navigate('/personal-case-management', {
        state: {
          message: `Case ${caseId} submitted successfully! You will receive email notifications about the review process.`,
          type: 'success'
        }
      });
      
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to submit case. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PatientInfoStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 2:
        return (
          <SymptomsStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 3:
        return (
          <TimelineStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 4:
        return (
          <MediaUploadStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 5:
        return (
          <ReviewStep
            formData={formData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.patientInfo.ageGroup && formData.patientInfo.sex && formData.patientInfo.region;
      case 2:
        return formData.symptoms.selectedSymptoms?.length > 0 && 
               formData.symptoms.primaryComplaint && 
               formData.symptoms.severity && 
               formData.symptoms.onset;
      case 3:
        return formData.timeline.firstSymptomDate && formData.timeline.events?.length > 0;
      case 4:
        return true; // Media is optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-semibold text-foreground">
                  Submit Medical Case
                </h1>
                <p className="text-muted-foreground">
                  Report a new medical case for global intelligence and collaboration
                </p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-muted-foreground">
                  {Math.round((currentStep / totalSteps) * 100)}% Complete
                </span>
              </div>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Step Navigation Sidebar */}
            <div className="lg:w-1/4">
              <StepNavigation
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                completedSteps={completedSteps}
              />
            </div>

            {/* Form Content */}
            <div className="lg:w-3/4">
              <div className="bg-card border border-border rounded-lg p-8 shadow-card">
                {renderCurrentStep()}
                
                {/* Error Display */}
                {errors.submit && (
                  <div className="mt-6 bg-error/10 border border-error/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="AlertCircle" size={16} className="text-error" />
                      <p className="text-sm text-error">{errors.submit}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Form Navigation */}
      <FormNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSaveDraft={handleSaveDraft}
        canProceed={canProceed()}
        isSubmitting={isSubmitting}
        lastSaved={lastSaved}
      />
    </div>
  );
};

export default CaseSubmissionForm;