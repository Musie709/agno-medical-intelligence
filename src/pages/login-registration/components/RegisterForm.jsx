import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { supabaseService } from '../../../services/supabaseClient';


const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    specialty: '',
    institution: '',
    role: '',
    agreeToTerms: false,
    hipaaCompliance: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const specialtyOptions = [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'emergency', label: 'Emergency Medicine' },
    { value: 'endocrinology', label: 'Endocrinology' },
    { value: 'gastroenterology', label: 'Gastroenterology' },
    { value: 'hematology', label: 'Hematology' },
    { value: 'infectious-disease', label: 'Infectious Disease' },
    { value: 'internal-medicine', label: 'Internal Medicine' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'pulmonology', label: 'Pulmonology' },
    { value: 'radiology', label: 'Radiology' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'other', label: 'Other' }
  ];

  const roleOptions = [
    { value: 'physician', label: 'Physician', description: 'Licensed medical doctor' },
    { value: 'researcher', label: 'Medical Researcher', description: 'Academic or institutional researcher' },
    { value: 'public-health', label: 'Public Health Official', description: 'Government or NGO health official' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'Medical license number is required';
    }
    
    if (!formData.specialty) {
      newErrors.specialty = 'Please select your specialty';
    }
    
    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution/Organization is required';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    if (!formData.hipaaCompliance) {
      newErrors.hipaaCompliance = 'HIPAA compliance acknowledgment is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    setSuccess(false);
    
    try {
      // Use Supabase authentication
      const { data, error } = await supabaseService.signUp(
        formData.email,
        formData.password,
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          specialty: formData.specialty,
          institution: formData.institution,
          license_number: formData.licenseNumber,
          role: formData.role
        }
      );

      if (error) {
        setErrors({ submit: error.message || 'Registration failed' });
      } else {
        setSuccess(true);
        
        // Create a complete profile in the profiles table
        const profileData = {
          id: data.user.id,
          email: formData.email.trim().toLowerCase(),
          first_name: formData.firstName,
          last_name: formData.lastName,
          specialty: formData.specialty,
          institution: formData.institution,
          bio: '',
          profile_visibility: 'public',
          credentials: [
            { type: 'Medical License', number: formData.licenseNumber, status: 'verified' }
          ],
          social: {
            linkedin: '',
            twitter: '',
            website: '',
            email: formData.email.trim().toLowerCase()
          },
          badges: [
            { label: 'Verified Physician', icon: 'Shield', color: 'success' },
            { label: formData.specialty, icon: 'Stethoscope', color: 'accent' },
            { label: '5+ Years', icon: 'Award', color: 'primary' }
          ],
          skills: [],
          publications: [],
          education: [],
          memberships: [],
          research_projects: [],
          awards: [],
          languages: [],
          recent_cases: []
        };

        // Update the profile with complete data
        await supabaseService.updateProfile(data.user.id, profileData);
        
        navigate('/login-registration'); // Instantly redirect
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          name="firstName"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChange={handleInputChange}
          error={errors.firstName}
          required
        />

        <Input
          label="Last Name"
          type="text"
          name="lastName"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChange={handleInputChange}
          error={errors.lastName}
          required
        />
      </div>

      <Input
        label="Professional Email"
        type="email"
        name="email"
        placeholder="Enter your professional email"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          required
        />
      </div>

      <Input
        label="Medical License Number"
        type="text"
        name="licenseNumber"
        placeholder="Enter your medical license number"
        value={formData.licenseNumber}
        onChange={handleInputChange}
        error={errors.licenseNumber}
        description="This will be verified during the approval process"
        required
      />

      <Select
        label="Medical Specialty"
        placeholder="Select your specialty"
        options={specialtyOptions}
        value={formData.specialty}
        onChange={(value) => handleSelectChange('specialty', value)}
        error={errors.specialty}
        searchable
        required
      />

      <Input
        label="Institution/Organization"
        type="text"
        name="institution"
        placeholder="Enter your hospital, clinic, or organization"
        value={formData.institution}
        onChange={handleInputChange}
        error={errors.institution}
        required
      />

      <Select
        label="Professional Role"
        placeholder="Select your role"
        options={roleOptions}
        value={formData.role}
        onChange={(value) => handleSelectChange('role', value)}
        error={errors.role}
        required
      />

      <div className="space-y-3">
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleInputChange}
          error={errors.agreeToTerms}
          required
        />

        <Checkbox
          label="I acknowledge HIPAA compliance requirements and patient privacy obligations"
          name="hipaaCompliance"
          checked={formData.hipaaCompliance}
          onChange={handleInputChange}
          error={errors.hipaaCompliance}
          description="All patient data must be properly anonymized before submission"
          required
        />
      </div>

      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        className="bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>

      {errors.submit && (
        <div className="text-red-600 text-sm flex items-center gap-2 mt-2">
          <Icon name="AlertCircle" size={16} className="text-red-600" />
          {errors.submit}
        </div>
      )}
      {success && (
        <div className="text-green-600 text-sm flex items-center gap-2 mt-2">
          <Icon name="CheckCircle" size={16} className="text-green-600" />
          Registration successful! Redirecting to login...
        </div>
      )}

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Account verification may take 24-48 hours for medical license validation
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;