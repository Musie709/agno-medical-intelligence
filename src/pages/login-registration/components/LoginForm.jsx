import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { supabaseService } from '../../../services/supabaseClient';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    try {
      // Use Supabase authentication
      const { data, error } = await supabaseService.signIn(
        formData.email,
        formData.password
      );

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('Email not confirmed')) {
          setErrors({ submit: 'Please check your email and click the confirmation link, or contact support to verify your account.' });
        } else if (error.message.includes('Invalid login credentials')) {
          setErrors({ submit: 'Invalid email or password. Please try again.' });
        } else {
          setErrors({ submit: error.message || 'Login failed' });
        }
      } else {
        console.log('✅ Login successful!', data);
        // Store user info in localStorage for easy access
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        console.log('🚀 Navigating to dashboard...');
        navigate('/dashboard-overview');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your professional email"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        required
      />
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
        required
      />
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleInputChange}
        />
        <button
          type="button"
          className="text-sm text-accent hover:text-accent/80 font-body transition-colors duration-200"
        >
          Forgot password?
        </button>
      </div>
      {errors.submit && (
        <div className="text-red-600 text-sm flex items-center gap-2 mt-2">
          <Icon name="AlertCircle" size={16} className="text-red-600" />
          {errors.submit}
        </div>
      )}
      <Button type="submit" loading={isLoading} className="w-full">
        Log In
      </Button>
    </form>
  );
};

export default LoginForm;