import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { generateDiagnosticInsights, generateTreatmentRecommendations } from '../../../services/openaiService';

const DiagnosticInformation = ({ caseData }) => {
  const [diagnosticInsights, setDiagnosticInsights] = useState(null);
  const [treatmentRecommendations, setTreatmentRecommendations] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isLoadingTreatment, setIsLoadingTreatment] = useState(false);
  const [activeTab, setActiveTab] = useState('diagnosis');

  // Generate diagnostic insights on component mount
  useEffect(() => {
    const generateInsights = async () => {
      setIsLoadingInsights(true);
      try {
        const insights = await generateDiagnosticInsights({
          demographics: `${caseData.demographics?.ageGroup || ''} ${caseData.demographics?.sex || ''} from ${caseData.demographics?.region || ''}`,
          symptoms: caseData.symptoms?.selectedSymptoms?.map(s => s.symptom).join(', ') || '',
          timeline: caseData.timeline?.events?.map(e => `${e.date}: ${e.description}`).join('; ') || '',
          clinicalNotes: caseData.symptoms?.clinicalNotes || ''
        });
        setDiagnosticInsights(insights);
      } catch (error) {
        console.error('Error generating diagnostic insights:', error);
      } finally {
        setIsLoadingInsights(false);
      }
    };

    if (caseData) {
      generateInsights();
    }
  }, [caseData]);

  const handleGenerateTreatment = async () => {
    if (!diagnosticInsights?.primary_diagnosis) return;
    
    setIsLoadingTreatment(true);
    try {
      const treatment = await generateTreatmentRecommendations(
        diagnosticInsights.primary_diagnosis.diagnosis,
        caseData.demographics || {}
      );
      setTreatmentRecommendations(treatment);
      setActiveTab('treatment');
    } catch (error) {
      console.error('Error generating treatment recommendations:', error);
    } finally {
      setIsLoadingTreatment(false);
    }
  };

  const getSeverityColor = (confidence) => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-error';
  };

  const tabs = [
    { id: 'diagnosis', label: 'AI Diagnosis', icon: 'Brain' },
    { id: 'differential', label: 'Differential', icon: 'List' },
    { id: 'treatment', label: 'Treatment', icon: 'Pill' },
    { id: 'recommendations', label: 'Recommendations', icon: 'Lightbulb' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Brain" size={24} className="text-accent" />
          <h2 className="text-xl font-heading font-semibold text-card-foreground">
            AI Diagnostic Analysis
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={() => window.location.reload()}
            disabled={isLoadingInsights}
          >
            Refresh Analysis
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="Pill"
            onClick={handleGenerateTreatment}
            disabled={isLoadingTreatment || !diagnosticInsights?.primary_diagnosis}
          >
            {isLoadingTreatment ? 'Generating...' : 'Generate Treatment'}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-card text-card-foreground shadow-sm'
                : 'text-muted-foreground hover:text-card-foreground'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoadingInsights && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <Icon name="Loader2" size={24} className="animate-spin text-accent" />
            <span className="text-muted-foreground">Analyzing case with AI...</span>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoadingInsights && diagnosticInsights && (
        <div className="space-y-6">
          {/* Primary Diagnosis Tab */}
          {activeTab === 'diagnosis' && (
            <div className="space-y-4">
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Target" size={20} className="text-accent mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">
                      Primary Diagnosis
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-card-foreground font-medium">
                          {diagnosticInsights.primary_diagnosis.diagnosis}
                        </span>
                        <span className="px-2 py-1 text-xs bg-accent/20 text-accent rounded-full">
                          {diagnosticInsights.primary_diagnosis.icd10_code}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getSeverityColor(diagnosticInsights.primary_diagnosis.confidence)} bg-current/10`}>
                          {Math.round(diagnosticInsights.primary_diagnosis.confidence * 100)}% Confidence
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {diagnosticInsights.primary_diagnosis.rationale}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rare Disease Alert */}
              {diagnosticInsights.rare_disease_alert?.is_rare && (
                <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="AlertTriangle" size={20} className="text-error mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-error mb-2">
                        Rare Disease Alert
                      </h3>
                      <div className="space-y-2">
                        <p className="text-sm text-card-foreground font-medium">
                          {diagnosticInsights.rare_disease_alert.disease_name}
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Key Indicators:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {diagnosticInsights.rare_disease_alert.key_indicators?.map((indicator, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <Icon name="ChevronRight" size={12} className="mt-1" />
                                <span>{indicator}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {diagnosticInsights.rare_disease_alert.specialist_referral && (
                          <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-md">
                            <p className="text-sm font-medium text-warning">
                              Specialist Referral Recommended:
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {diagnosticInsights.rare_disease_alert.specialist_referral}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Differential Diagnosis Tab */}
          {activeTab === 'differential' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Differential Diagnoses
              </h3>
              <div className="space-y-3">
                {diagnosticInsights.differential_diagnoses?.map((diff, index) => (
                  <div key={index} className="bg-muted/50 border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-card-foreground font-medium">
                          {diff.diagnosis}
                        </span>
                        <span className="px-2 py-1 text-xs bg-secondary/20 text-secondary rounded-full">
                          {diff.icd10_code}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getSeverityColor(diff.probability)} bg-current/10`}>
                        {Math.round(diff.probability * 100)}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {diff.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Treatment Tab */}
          {activeTab === 'treatment' && (
            <div className="space-y-4">
              {!treatmentRecommendations ? (
                <div className="text-center py-8">
                  <Icon name="Pill" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Generate treatment recommendations to view this section
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Primary Treatment */}
                  <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-card-foreground mb-3">
                      Primary Treatment
                    </h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-card-foreground">Treatment:</span>
                          <p className="text-sm text-muted-foreground">
                            {treatmentRecommendations.primary_treatment.treatment}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-card-foreground">Dosage:</span>
                          <p className="text-sm text-muted-foreground">
                            {treatmentRecommendations.primary_treatment.dosage}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-card-foreground">Duration:</span>
                          <p className="text-sm text-muted-foreground">
                            {treatmentRecommendations.primary_treatment.duration}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-card-foreground">Monitoring:</span>
                          <p className="text-sm text-muted-foreground">
                            {treatmentRecommendations.primary_treatment.monitoring}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alternative Treatments */}
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-3">
                      Alternative Treatments
                    </h3>
                    <div className="space-y-3">
                      {treatmentRecommendations.alternative_treatments?.map((alt, index) => (
                        <div key={index} className="bg-muted/50 border border-border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-card-foreground font-medium">
                              {alt.treatment}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {alt.indication}
                          </p>
                          {alt.contraindications?.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-error">Contraindications:</span>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {alt.contraindications.map((contra, idx) => (
                                  <li key={idx} className="flex items-start space-x-2">
                                    <Icon name="X" size={12} className="text-error mt-1" />
                                    <span>{contra}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Emergency Protocols */}
                  <div className="bg-error/5 border border-error/20 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-card-foreground mb-3">
                      Emergency Protocols
                    </h3>
                    <div className="space-y-2">
                      {treatmentRecommendations.emergency_protocols?.map((protocol, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Icon name="AlertTriangle" size={16} className="text-error mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-card-foreground">
                                {protocol.trigger}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                protocol.urgency === 'high' ? 'bg-error/20 text-error' : 
                                protocol.urgency === 'medium'? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                              }`}>
                                {protocol.urgency} urgency
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {protocol.action}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Clinical Recommendations
              </h3>
              <div className="space-y-3">
                {diagnosticInsights.recommendations?.map((rec, index) => (
                  <div key={index} className="bg-muted/50 border border-border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Icon name="CheckCircle" size={16} className="text-success mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-card-foreground">
                            {rec.type}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            rec.urgency === 'high' ? 'bg-error/20 text-error' : 
                            rec.urgency === 'medium'? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                          }`}>
                            {rec.urgency} priority
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {rec.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Follow-up Information */}
              {treatmentRecommendations?.follow_up && (
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-card-foreground mb-3">
                    Follow-up Plan
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-card-foreground">Timeline:</span>
                      <p className="text-sm text-muted-foreground">
                        {treatmentRecommendations.follow_up.timeline}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-card-foreground">Required Assessments:</span>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {treatmentRecommendations.follow_up.assessments?.map((assessment, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Icon name="ChevronRight" size={12} className="mt-1" />
                            <span>{assessment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-card-foreground">Specialist Referrals:</span>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {treatmentRecommendations.follow_up.specialist_referrals?.map((referral, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Icon name="ChevronRight" size={12} className="mt-1" />
                            <span>{referral}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosticInformation;