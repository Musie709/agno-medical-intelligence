import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlatformLogo from './components/PlatformLogo';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import TrustSignals from './components/TrustSignals';

const LoginRegistration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    // Check if user is already authenticated
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      navigate('/dashboard-overview');
    }
  }, [navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Trust Signals & Branding */}
            <div className="hidden lg:block space-y-8">
              <div className="text-left">
                <h2 className="text-4xl font-heading font-bold text-primary mb-4">
                  Secure Medical Intelligence
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join thousands of verified medical professionals in advancing global healthcare through secure case reporting and collaborative intelligence.
                </p>
              </div>
              
              <TrustSignals />
              
              {/* Statistics */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-heading font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Verified Physicians</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-heading font-bold text-accent">50K+</div>
                  <div className="text-sm text-muted-foreground">Cases Reported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-heading font-bold text-secondary">95%</div>
                  <div className="text-sm text-muted-foreground">Detection Rate</div>
                </div>
              </div>
            </div>

            {/* Right Column - Authentication Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div className="bg-card border border-border rounded-2xl shadow-modal p-8">
                
                {/* Mobile Logo */}
                <div className="lg:hidden">
                  <PlatformLogo />
                </div>

                {/* Desktop Header */}
                <div className="hidden lg:block text-center mb-8">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4 mx-auto">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-card-foreground">
                    Welcome to AGNO
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Access your medical intelligence platform
                  </p>
                </div>

                {/* Auth Tabs */}
                <AuthTabs activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Form Content */}
                <div className="space-y-6">
                  {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
                </div>

                {/* Mobile Trust Signals */}
                <div className="lg:hidden mt-8 pt-6 border-t border-border">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>HIPAA Compliant</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Encrypted</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Verified Only</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span>Global Network</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-6">
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} AGNO Medical Intelligence. All rights reserved.
                </p>
                <div className="flex items-center justify-center space-x-4 mt-2">
                  <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </button>
                  <span className="text-xs text-muted-foreground">•</span>
                  <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </button>
                  <span className="text-xs text-muted-foreground">•</span>
                  <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegistration;