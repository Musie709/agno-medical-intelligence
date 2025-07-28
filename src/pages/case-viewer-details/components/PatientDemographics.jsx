import React from 'react';
import Icon from '../../../components/AppIcon';

const PatientDemographics = ({ demographics }) => {
  const demographicItems = [
    { label: 'Age Group', value: demographics.ageGroup, icon: 'Calendar' },
    { label: 'Gender', value: demographics.gender, icon: 'User' },
    { label: 'Region', value: demographics.region, icon: 'MapPin' },
    { label: 'Ethnicity', value: demographics.ethnicity, icon: 'Globe' },
    { label: 'Medical History', value: demographics.medicalHistory, icon: 'FileText' },
    { label: 'Current Medications', value: demographics.medications, icon: 'Pill' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="User" size={20} className="text-primary" />
        <h2 className="text-lg font-heading font-semibold text-card-foreground">
          Patient Demographics (Anonymized)
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demographicItems.map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-md">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center mt-0.5">
              <Icon name={item.icon} size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <dt className="text-sm font-body font-medium text-muted-foreground mb-1">
                {item.label}
              </dt>
              <dd className="text-sm font-body text-card-foreground break-words">
                {item.value}
              </dd>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-accent/5 border border-accent/20 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="Shield" size={16} className="text-accent" />
          <span className="text-sm font-body font-medium text-accent">Privacy Protection</span>
        </div>
        <p className="text-xs text-muted-foreground">
          All patient identifiable information has been automatically anonymized and encrypted. 
          This data complies with HIPAA and international privacy standards.
        </p>
      </div>
    </div>
  );
};

export default PatientDemographics;