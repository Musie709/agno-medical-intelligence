import React, { useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const PatientInfoStep = ({ formData, setFormData, errors, setErrors }) => {
  const ageGroups = [
    { value: '0-1', label: 'Infant (0-1 years)' },
    { value: '2-12', label: 'Child (2-12 years)' },
    { value: '13-17', label: 'Adolescent (13-17 years)' },
    { value: '18-30', label: 'Young Adult (18-30 years)' },
    { value: '31-50', label: 'Adult (31-50 years)' },
    { value: '51-70', label: 'Middle-aged (51-70 years)' },
    { value: '70+', label: 'Elderly (70+ years)' }
  ];

  const sexOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'unknown', label: 'Unknown/Not disclosed' }
  ];

  const regionOptions = [
    { value: 'north-america', label: 'North America' },
    { value: 'south-america', label: 'South America' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia', label: 'Asia' },
    { value: 'africa', label: 'Africa' },
    { value: 'oceania', label: 'Oceania' },
    { value: 'middle-east', label: 'Middle East' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      patientInfo: {
        ...prev.patientInfo,
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (!formData.patientInfo.ageGroup) {
      newErrors.ageGroup = 'Age group is required';
    }
    if (!formData.patientInfo.sex) {
      newErrors.sex = 'Sex is required';
    }
    if (!formData.patientInfo.region) {
      newErrors.region = 'Region is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  React.useEffect(() => {
    // Auto-validate when component mounts or data changes
    const timer = setTimeout(() => {
      if (formData.patientInfo.ageGroup || formData.patientInfo.sex || formData.patientInfo.region) {
        validateStep();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [formData.patientInfo]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
          <Icon name="User" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Patient Information
          </h2>
          <p className="text-sm text-muted-foreground">
            Basic demographic information (automatically anonymized)
          </p>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-accent mt-0.5" />
          <div>
            <h3 className="text-sm font-body font-medium text-foreground mb-1">
              Privacy Protection Active
            </h3>
            <p className="text-xs text-muted-foreground">
              All patient data is automatically anonymized. No personally identifiable information (PII) is stored or transmitted.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age Group */}
        <Select
          label="Age Group"
          description="Select the patient's age range"
          options={ageGroups}
          value={formData.patientInfo.ageGroup}
          onChange={(value) => handleInputChange('ageGroup', value)}
          error={errors.ageGroup}
          required
          placeholder="Select age group"
        />

        {/* Sex */}
        <Select
          label="Biological Sex"
          description="Patient's biological sex"
          options={sexOptions}
          value={formData.patientInfo.sex}
          onChange={(value) => handleInputChange('sex', value)}
          error={errors.sex}
          required
          placeholder="Select sex"
        />

        {/* Region */}
        <div className="md:col-span-2">
          <Select
            label="Geographic Region"
            description="General geographic region where case occurred"
            options={regionOptions}
            value={formData.patientInfo.region}
            onChange={(value) => handleInputChange('region', value)}
            error={errors.region}
            required
            placeholder="Select region"
          />
        </div>

        {/* Additional Notes */}
        <div className="md:col-span-2">
          <Input
            label="Additional Demographics (Optional)"
            type="text"
            placeholder="Any relevant demographic information (occupation, lifestyle factors, etc.)"
            value={formData.patientInfo.additionalInfo || ''}
            onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
            description="Optional context that may be medically relevant"
          />
        </div>
      </div>

      {/* Data Handling Information */}
      <div className="bg-muted rounded-lg p-4">
        <h3 className="text-sm font-body font-medium text-foreground mb-2">
          Data Handling & Anonymization
        </h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• All data is encrypted end-to-end during transmission</li>
          <li>• Patient identifiers are automatically stripped and replaced with case IDs</li>
          <li>• Geographic data is generalized to regional level only</li>
          <li>• Age is grouped into ranges to prevent identification</li>
          <li>• All submissions comply with HIPAA and international privacy standards</li>
        </ul>
      </div>
    </div>
  );
};

export default PatientInfoStep;