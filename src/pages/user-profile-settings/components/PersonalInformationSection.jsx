import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const getDefaultPersonalInfo = () => ({
  firstName: 'Dr. Sarah',
  lastName: 'Chen',
  email: 'sarah.chen@hospital.com',
  phone: '+1 (555) 123-4567',
  institution: 'Metropolitan General Hospital',
  department: 'Internal Medicine',
  specialty: 'cardiology',
  title: 'attending-physician',
  yearsExperience: '12',
  bio: `Experienced cardiologist with over 12 years of clinical practice specializing in interventional cardiology and heart failure management. Board-certified in Internal Medicine and Cardiovascular Disease with extensive research background in cardiac imaging and minimally invasive procedures.`
});

const loadUserInfo = () => {
  try {
    const raw = localStorage.getItem('userInfo');
    if (raw && raw !== 'undefined') {
      const user = JSON.parse(raw);
      // Merge user fields with defaults for missing fields
      return { ...getDefaultPersonalInfo(), ...user };
    }
  } catch {}
  return getDefaultPersonalInfo();
};

const PersonalInformationSection = () => {
  const [personalInfo, setPersonalInfo] = useState(loadUserInfo());

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const specialtyOptions = [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'radiology', label: 'Radiology' },
    { value: 'emergency', label: 'Emergency Medicine' },
    { value: 'family', label: 'Family Medicine' },
    { value: 'internal', label: 'Internal Medicine' }
  ];

  const titleOptions = [
    { value: 'resident', label: 'Resident' },
    { value: 'fellow', label: 'Fellow' },
    { value: 'attending-physician', label: 'Attending Physician' },
    { value: 'chief-resident', label: 'Chief Resident' },
    { value: 'department-head', label: 'Department Head' },
    { value: 'researcher', label: 'Researcher' },
    { value: 'consultant', label: 'Consultant' }
  ];

  const handleInputChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Save to localStorage for now (simulate backend persistence)
    try {
      localStorage.setItem('userInfo', JSON.stringify(personalInfo));
    } catch {}
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values from localStorage or fallback
    setPersonalInfo(loadUserInfo());
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-card-foreground">
            Personal Information
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your basic profile information and professional details
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1 bg-success/10 text-success rounded-full">
            <Icon name="Shield" size={14} />
            <span className="text-xs font-medium">Verified</span>
          </div>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              iconName="Edit"
              iconPosition="left"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                loading={isSaving}
                iconName="Save"
                iconPosition="left"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-medium text-card-foreground">
            Basic Information
          </h3>
          <Input
            label="First Name"
            type="text"
            value={personalInfo.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            disabled={!isEditing}
            required
          />
          <Input
            label="Last Name"
            type="text"
            value={personalInfo.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            disabled={!isEditing}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={personalInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={!isEditing}
            description="Primary contact email for notifications"
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={!isEditing}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-medium text-card-foreground">
            Professional Information
          </h3>
          <Input
            label="Institution/Hospital"
            type="text"
            value={personalInfo.institution}
            onChange={(e) => handleInputChange('institution', e.target.value)}
            disabled={!isEditing}
            required
          />
          <Input
            label="Department"
            type="text"
            value={personalInfo.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            disabled={!isEditing}
            placeholder="e.g., Internal Medicine, Surgery"
          />
          <Select
            label="Medical Specialty"
            options={specialtyOptions}
            value={personalInfo.specialty}
            onChange={(value) => handleInputChange('specialty', value)}
            disabled={!isEditing}
            required
          />
          <Select
            label="Professional Title"
            options={titleOptions}
            value={personalInfo.title}
            onChange={(value) => handleInputChange('title', value)}
            disabled={!isEditing}
            required
          />
          <Input
            label="Years of Experience"
            type="number"
            value={personalInfo.yearsExperience}
            onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
            disabled={!isEditing}
            min="0"
            max="50"
          />
        </div>
      </div>
      {/* Professional Bio */}
      <div className="mt-6">
        <h3 className="text-lg font-heading font-medium text-card-foreground mb-4">
          Professional Bio
        </h3>
        <div className="relative">
          <textarea
            className={`w-full min-h-[120px] p-3 border border-border rounded-md resize-none font-body text-sm ${
              isEditing 
                ? 'bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            value={personalInfo.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            disabled={!isEditing}
            placeholder="Describe your professional background, specializations, and areas of expertise..."
            maxLength={500}
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {personalInfo.bio.length}/500
          </div>
        </div>
      </div>
      {/* Verification Status */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-heading font-medium text-card-foreground mb-3">
          Verification Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
              <Icon name="Check" size={16} color="white" />
            </div>
            <div>
              <p className="text-sm font-medium text-card-foreground">Email Verified</p>
              <p className="text-xs text-muted-foreground">Confirmed on Jan 15, 2024</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
              <Icon name="Check" size={16} color="white" />
            </div>
            <div>
              <p className="text-sm font-medium text-card-foreground">Medical License</p>
              <p className="text-xs text-muted-foreground">Verified on Jan 20, 2024</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
              <Icon name="Check" size={16} color="white" />
            </div>
            <div>
              <p className="text-sm font-medium text-card-foreground">Institution</p>
              <p className="text-xs text-muted-foreground">Confirmed on Jan 22, 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationSection;