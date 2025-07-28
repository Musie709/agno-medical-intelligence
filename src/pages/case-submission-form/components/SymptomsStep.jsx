import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { analyzeSymptoms } from '../../../services/openaiService';

const SymptomsStep = ({ formData, setFormData, errors, setErrors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const severityOptions = [
    { value: 'mild', label: 'Mild - Minimal impact on daily activities' },
    { value: 'moderate', label: 'Moderate - Some limitation of activities' },
    { value: 'severe', label: 'Severe - Significant limitation of activities' },
    { value: 'critical', label: 'Critical - Life-threatening or incapacitating' }
  ];

  const onsetOptions = [
    { value: 'sudden', label: 'Sudden onset (minutes to hours)' },
    { value: 'gradual', label: 'Gradual onset (days to weeks)' },
    { value: 'chronic', label: 'Chronic/Progressive (months to years)' },
    { value: 'intermittent', label: 'Intermittent/Episodic' }
  ];

  // AI-powered symptom analysis
  useEffect(() => {
    const performAnalysis = async () => {
      if (searchTerm.length > 3) {
        setIsLoadingSuggestions(true);
        try {
          const results = await analyzeSymptoms(searchTerm);
          setAnalysisResults(results);
          setAiSuggestions(results.suggestions || []);
        } catch (error) {
          console.error('Error analyzing symptoms:', error);
          setAiSuggestions([]);
        } finally {
          setIsLoadingSuggestions(false);
        }
      } else {
        setAiSuggestions([]);
        setAnalysisResults(null);
      }
    };

    const debounceTimer = setTimeout(performAnalysis, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      symptoms: {
        ...prev.symptoms,
        [field]: value
      }
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSymptomToggle = (symptom) => {
    const currentSymptoms = formData.symptoms.selectedSymptoms || [];
    const isSelected = currentSymptoms.some(s => s.symptom === symptom.symptom);
    
    let updatedSymptoms;
    if (isSelected) {
      updatedSymptoms = currentSymptoms.filter(s => s.symptom !== symptom.symptom);
    } else {
      updatedSymptoms = [...currentSymptoms, {
        symptom: symptom.symptom,
        icd10_code: symptom.icd10_code,
        description: symptom.description,
        confidence: symptom.confidence,
        category: symptom.category
      }];
    }
    
    handleInputChange('selectedSymptoms', updatedSymptoms);
  };

  const addCustomSymptom = () => {
    if (searchTerm.trim()) {
      const customSymptom = {
        symptom: searchTerm.trim(),
        icd10_code: 'Custom',
        description: 'Custom symptom entered by user',
        confidence: 0.5,
        category: 'Custom'
      };
      handleSymptomToggle(customSymptom);
      setSearchTerm('');
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (!formData.symptoms.selectedSymptoms || formData.symptoms.selectedSymptoms.length === 0) {
      newErrors.selectedSymptoms = 'At least one symptom must be selected';
    }
    if (!formData.symptoms.primaryComplaint) {
      newErrors.primaryComplaint = 'Primary complaint is required';
    }
    if (!formData.symptoms.severity) {
      newErrors.severity = 'Severity assessment is required';
    }
    if (!formData.symptoms.onset) {
      newErrors.onset = 'Onset pattern is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
          <Icon name="Stethoscope" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Symptoms & Clinical Presentation
          </h2>
          <p className="text-sm text-muted-foreground">
            Document observed symptoms with AI-powered ICD-10 code suggestions
          </p>
        </div>
      </div>

      {/* AI-Powered Symptom Search */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Brain" size={18} className="text-accent" />
          <h3 className="text-sm font-body font-medium text-foreground">
            AI Symptom Analysis & ICD-10 Suggestions
          </h3>
        </div>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="Describe symptoms (e.g., 'persistent fever with night sweats')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchTerm.trim()) {
                e.preventDefault();
                addCustomSymptom();
              }
            }}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isLoadingSuggestions ? (
              <Icon name="Loader2" size={16} className="animate-spin text-accent" />
            ) : (
              <Icon name="Search" size={16} className="text-muted-foreground" />
            )}
          </div>
        </div>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-muted-foreground">AI-Powered Suggestions:</p>
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSymptomToggle(suggestion)}
                className="w-full flex items-center justify-between p-3 bg-muted hover:bg-accent/10 rounded-md transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-body text-foreground">{suggestion.symptom}</div>
                  <span className="px-2 py-1 text-xs bg-accent/20 text-accent rounded-full">
                    {suggestion.icd10_code}
                  </span>
                  <span className="px-2 py-1 text-xs bg-secondary/20 text-secondary rounded-full">
                    {Math.round(suggestion.confidence * 100)}%
                  </span>
                </div>
                <Icon name="Plus" size={16} className="text-accent" />
              </button>
            ))}
            
            {searchTerm.trim() && !aiSuggestions.some(s => s.symptom.toLowerCase().includes(searchTerm.toLowerCase())) && (
              <button
                onClick={addCustomSymptom}
                className="w-full flex items-center justify-between p-2 bg-secondary/10 hover:bg-secondary/20 rounded-md transition-colors duration-200"
              >
                <div className="text-sm font-body text-foreground">Add "{searchTerm}" as custom symptom</div>
                <Icon name="Plus" size={16} className="text-secondary" />
              </button>
            )}
          </div>
        )}

        {/* AI Analysis Results */}
        {analysisResults?.clinical_notes && (
          <div className="mt-4 p-3 bg-accent/5 border border-accent/20 rounded-md">
            <div className="flex items-start space-x-2">
              <Icon name="Lightbulb" size={16} className="text-accent mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">AI Clinical Insights:</p>
                <p className="text-sm text-muted-foreground">{analysisResults.clinical_notes}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Symptoms */}
      {formData.symptoms.selectedSymptoms && formData.symptoms.selectedSymptoms.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-body font-medium text-foreground mb-3">
            Selected Symptoms ({formData.symptoms.selectedSymptoms.length})
          </h3>
          <div className="space-y-2">
            {formData.symptoms.selectedSymptoms.map((symptom, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-accent/10 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-foreground">{symptom.symptom}</span>
                  <span className="px-2 py-1 text-xs bg-accent/20 text-accent rounded-full">
                    {symptom.icd10_code}
                  </span>
                  <span className="px-2 py-1 text-xs bg-secondary/20 text-secondary rounded-full">
                    {symptom.category}
                  </span>
                  {symptom.confidence && (
                    <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                      {Math.round(symptom.confidence * 100)}%
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleSymptomToggle(symptom)}
                  className="hover:bg-accent/20 rounded-full p-1"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            ))}
          </div>
          {errors.selectedSymptoms && (
            <p className="text-sm text-error mt-2">{errors.selectedSymptoms}</p>
          )}
        </div>
      )}

      {/* Primary Complaint */}
      <Input
        label="Primary Complaint"
        type="text"
        placeholder="Brief description of the main presenting complaint"
        value={formData.symptoms.primaryComplaint || ''}
        onChange={(e) => handleInputChange('primaryComplaint', e.target.value)}
        error={errors.primaryComplaint}
        required
        description="The primary reason for the medical consultation"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Severity Assessment */}
        <Select
          label="Overall Severity"
          options={severityOptions}
          value={formData.symptoms.severity}
          onChange={(value) => handleInputChange('severity', value)}
          error={errors.severity}
          required
          placeholder="Select severity level"
        />

        {/* Onset Pattern */}
        <Select
          label="Symptom Onset"
          options={onsetOptions}
          value={formData.symptoms.onset}
          onChange={(value) => handleInputChange('onset', value)}
          error={errors.onset}
          required
          placeholder="Select onset pattern"
        />
      </div>

      {/* Additional Clinical Notes */}
      <div>
        <label className="block text-sm font-body font-medium text-foreground mb-2">
          Additional Clinical Observations
        </label>
        <textarea
          className="w-full h-32 p-3 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          placeholder="Detailed clinical observations, symptom relationships, unusual presentations, etc."
          value={formData.symptoms.clinicalNotes || ''}
          onChange={(e) => handleInputChange('clinicalNotes', e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Include any relevant clinical context, symptom interactions, or unusual presentations
        </p>
      </div>

      {/* Rare Disease Indicators */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-body font-medium text-foreground mb-2">
              Rare Disease Indicators
            </h3>
            
            {/* AI-Generated Rare Disease Alerts */}
            {analysisResults?.rare_disease_indicators?.length > 0 && (
              <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md">
                <h4 className="text-sm font-medium text-error mb-2">AI-Detected Rare Disease Indicators:</h4>
                <div className="space-y-1">
                  {analysisResults.rare_disease_indicators.map((indicator, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Icon name="AlertCircle" size={14} className="text-error mt-0.5" />
                      <div>
                        <p className="text-sm text-foreground font-medium">{indicator.indicator}</p>
                        <p className="text-xs text-muted-foreground">{indicator.significance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Checkbox
                label="Unusual symptom combination not matching common diagnoses"
                checked={formData.symptoms.rareIndicators?.unusualCombination || false}
                onChange={(e) => handleInputChange('rareIndicators', {
                  ...formData.symptoms.rareIndicators,
                  unusualCombination: e.target.checked
                })}
              />
              <Checkbox
                label="Symptoms not responding to standard treatments"
                checked={formData.symptoms.rareIndicators?.nonResponsive || false}
                onChange={(e) => handleInputChange('rareIndicators', {
                  ...formData.symptoms.rareIndicators,
                  nonResponsive: e.target.checked
                })}
              />
              <Checkbox
                label="Geographic or demographic clustering observed"
                checked={formData.symptoms.rareIndicators?.clustering || false}
                onChange={(e) => handleInputChange('rareIndicators', {
                  ...formData.symptoms.rareIndicators,
                  clustering: e.target.checked
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomsStep;