import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ReviewStep = ({ formData, onSubmit, isSubmitting }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'text-success bg-success/10';
      case 'moderate': return 'text-warning bg-warning/10';
      case 'severe': return 'text-error bg-error/10';
      case 'critical': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'Image';
    if (type === 'application/pdf') return 'FileText';
    return 'File';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
          <Icon name="CheckCircle" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Review & Submit Case
          </h2>
          <p className="text-sm text-muted-foreground">
            Please review all information before submitting your case report
          </p>
        </div>
      </div>

      {/* Patient Information Review */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="User" size={18} className="text-accent" />
          <h3 className="text-lg font-heading font-semibold text-card-foreground">
            Patient Information
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-body font-medium text-muted-foreground">Age Group</label>
            <p className="text-sm text-foreground">{formData.patientInfo?.ageGroup || 'Not specified'}</p>
          </div>
          <div>
            <label className="text-sm font-body font-medium text-muted-foreground">Sex</label>
            <p className="text-sm text-foreground">{formData.patientInfo?.sex || 'Not specified'}</p>
          </div>
          <div>
            <label className="text-sm font-body font-medium text-muted-foreground">Region</label>
            <p className="text-sm text-foreground">{formData.patientInfo?.region || 'Not specified'}</p>
          </div>
        </div>
        
        {formData.patientInfo?.additionalInfo && (
          <div className="mt-4">
            <label className="text-sm font-body font-medium text-muted-foreground">Additional Information</label>
            <p className="text-sm text-foreground">{formData.patientInfo.additionalInfo}</p>
          </div>
        )}
      </div>

      {/* Symptoms Review */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Stethoscope" size={18} className="text-accent" />
          <h3 className="text-lg font-heading font-semibold text-card-foreground">
            Symptoms & Clinical Presentation
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-body font-medium text-muted-foreground">Primary Complaint</label>
            <p className="text-sm text-foreground">{formData.symptoms?.primaryComplaint || 'Not specified'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-body font-medium text-muted-foreground">Severity</label>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${getSeverityColor(formData.symptoms?.severity)}`}>
                {formData.symptoms?.severity || 'Not specified'}
              </span>
            </div>
            <div>
              <label className="text-sm font-body font-medium text-muted-foreground">Onset</label>
              <p className="text-sm text-foreground">{formData.symptoms?.onset || 'Not specified'}</p>
            </div>
          </div>
          
          {formData.symptoms?.selectedSymptoms && formData.symptoms.selectedSymptoms.length > 0 && (
            <div>
              <label className="text-sm font-body font-medium text-muted-foreground">Selected Symptoms</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.symptoms.selectedSymptoms.map((symptom) => (
                  <span
                    key={symptom.id}
                    className="inline-flex items-center space-x-1 bg-accent/10 text-accent px-2 py-1 rounded-full text-xs"
                  >
                    <span>{symptom.label}</span>
                    <span className="opacity-75">({symptom.icd10})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {formData.symptoms?.clinicalNotes && (
            <div>
              <label className="text-sm font-body font-medium text-muted-foreground">Clinical Notes</label>
              <p className="text-sm text-foreground">{formData.symptoms.clinicalNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Review */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Clock" size={18} className="text-accent" />
          <h3 className="text-lg font-heading font-semibold text-card-foreground">
            Timeline & Progression
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-body font-medium text-muted-foreground">First Symptom Date</label>
            <p className="text-sm text-foreground">{formatDate(formData.timeline?.firstSymptomDate)}</p>
          </div>
          
          {formData.timeline?.events && formData.timeline.events.length > 0 && (
            <div>
              <label className="text-sm font-body font-medium text-muted-foreground">Timeline Events</label>
              <div className="mt-2 space-y-2">
                {formData.timeline.events.slice(0, 3).map((event, index) => (
                  <div key={event.id} className="flex items-center space-x-3 p-2 bg-muted rounded-md">
                    <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(event.timestamp)}
                        </span>
                        {event.severity && (
                          <span className={`px-1 py-0.5 text-xs rounded ${getSeverityColor(event.severity)}`}>
                            {event.severity}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground">{event.event}</p>
                    </div>
                  </div>
                ))}
                {formData.timeline.events.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{formData.timeline.events.length - 3} more events
                  </p>
                )}
              </div>
            </div>
          )}
          
          {formData.timeline?.progressionNotes && (
            <div>
              <label className="text-sm font-body font-medium text-muted-foreground">Progression Notes</label>
              <p className="text-sm text-foreground">{formData.timeline.progressionNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Media Review */}
      {formData.media?.files && formData.media.files.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Upload" size={18} className="text-accent" />
            <h3 className="text-lg font-heading font-semibold text-card-foreground">
              Uploaded Files ({formData.media.files.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.media.files.map((file) => (
              <div key={file.id} className="border border-border rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name={getFileIcon(file.type)} size={16} className="text-accent" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                {file.type.startsWith('image/') && (
                  <div className="mb-2 overflow-hidden rounded-md">
                    <Image
                      src={file.url}
                      alt={file.name}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-2 text-xs">
                  <span className="flex items-center space-x-1 text-success">
                    <Icon name="Shield" size={10} />
                    <span>Secured</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {formData.media?.description && (
            <div className="mt-4">
              <label className="text-sm font-body font-medium text-muted-foreground">File Description</label>
              <p className="text-sm text-foreground">{formData.media.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Submission Confirmation */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
          <div>
            <h3 className="text-sm font-body font-medium text-foreground mb-2">
              Submission Confirmation
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• I confirm that all patient information has been properly anonymized</li>
              <li>• I have appropriate consent for sharing this medical information</li>
              <li>• The information provided is accurate to the best of my knowledge</li>
              <li>• I understand this case will be reviewed by medical professionals globally</li>
              <li>• I agree to follow up if additional information is requested</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={onSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          size="lg"
          iconName="Send"
          iconPosition="left"
          className="px-8"
        >
          {isSubmitting ? 'Submitting Case...' : 'Submit Case Report'}
        </Button>
      </div>

      {/* Post-Submission Information */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-accent mt-0.5" />
          <div>
            <h3 className="text-sm font-body font-medium text-foreground mb-2">
              What happens after submission?
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Your case will be assigned a unique tracking ID</li>
              <li>• Medical experts will review the case within 24-48 hours</li>
              <li>• You'll receive email notifications about case status updates</li>
              <li>• The case may be flagged for further investigation if patterns are detected</li>
              <li>• You can track progress in your personal dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;