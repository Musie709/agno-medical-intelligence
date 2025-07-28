import React from 'react';
import Icon from '../../../components/AppIcon';

const PlatformLogo = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          {/* Main logo container */}
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg">
            <Icon name="Activity" size={32} color="white" />
          </div>
          
          {/* Neural network accent */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
            <Icon name="Brain" size={12} color="white" />
          </div>
        </div>
      </div>

      {/* Platform Name */}
      <div className="mb-2">
        <h1 className="text-3xl font-heading font-bold text-primary">
          AGNO
        </h1>
        <p className="text-sm font-body text-muted-foreground -mt-1">
          Medical Intelligence Platform
        </p>
      </div>

      {/* Tagline */}
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Secure case reporting and intelligence platform for verified healthcare professionals worldwide
      </p>

      {/* Version indicator */}
      <div className="flex items-center justify-center mt-4">
        <div className="px-3 py-1 bg-accent/10 rounded-full">
          <span className="text-xs font-body font-medium text-accent">
            Professional Edition v2.1
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlatformLogo;