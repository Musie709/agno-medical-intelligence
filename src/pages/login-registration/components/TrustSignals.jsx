import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'HIPAA Compliant',
      description: 'Full healthcare data protection'
    },
    {
      icon: 'Lock',
      title: 'End-to-End Encrypted',
      description: 'Military-grade security'
    },
    {
      icon: 'Award',
      title: 'Medical License Verified',
      description: 'Professional credentials required'
    },
    {
      icon: 'Globe',
      title: 'Global Network',
      description: 'Trusted by 10,000+ physicians'
    }
  ];

  const partnerLogos = [
    { name: 'WHO', logo: 'Building2' },
    { name: 'CDC', logo: 'Activity' },
    { name: 'NIH', logo: 'Heart' },
    { name: 'Medical Board', logo: 'Certificate' }
  ];

  return (
    <div className="space-y-8">
      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {trustBadges.map((badge, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name={badge.icon} size={16} className="text-accent" />
            </div>
            <div>
              <h4 className="text-sm font-body font-semibold text-foreground">
                {badge.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {badge.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Security Notice */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-accent mt-0.5" />
          <div>
            <h4 className="text-sm font-body font-semibold text-foreground">
              Secure Medical Platform
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              This platform is designed exclusively for verified medical professionals. 
              All data is encrypted and complies with international healthcare privacy standards.
            </p>
          </div>
        </div>
      </div>

      {/* Partner Logos */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-4">Trusted by leading medical institutions</p>
        <div className="flex items-center justify-center space-x-6 opacity-60">
          {partnerLogos.map((partner, index) => (
            <div key={index} className="flex flex-col items-center space-y-1">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Icon name={partner.logo} size={16} className="text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span>System Operational</span>
        </div>
        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span>All Services Online</span>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;