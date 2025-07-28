import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MedicalCredentialsSection = () => {
  const [credentials, setCredentials] = useState([
    {
      id: 1,
      type: 'Medical License',
      number: 'MD-123456789',
      issuingAuthority: 'State Medical Board of California',
      issueDate: '2012-06-15',
      expiryDate: '2025-06-15',
      status: 'verified',
      documentUrl: '/documents/medical-license.pdf'
    },
    {
      id: 2,
      type: 'Board Certification',
      number: 'BC-987654321',
      issuingAuthority: 'American Board of Internal Medicine',
      issueDate: '2015-08-20',
      expiryDate: '2025-08-20',
      status: 'verified',
      documentUrl: '/documents/board-cert.pdf'
    },
    {
      id: 3,
      type: 'DEA Registration',
      number: 'DEA-AB1234567',
      issuingAuthority: 'Drug Enforcement Administration',
      issueDate: '2020-03-10',
      expiryDate: '2024-03-10',
      status: 'expiring-soon',
      documentUrl: '/documents/dea-cert.pdf'
    }
  ]);

  const [isAddingCredential, setIsAddingCredential] = useState(false);
  const [newCredential, setNewCredential] = useState({
    type: '',
    number: '',
    issuingAuthority: '',
    issueDate: '',
    expiryDate: '',
    document: null
  });

  const credentialTypes = [
    { value: 'medical-license', label: 'Medical License' },
    { value: 'board-certification', label: 'Board Certification' },
    { value: 'dea-registration', label: 'DEA Registration' },
    { value: 'fellowship-certificate', label: 'Fellowship Certificate' },
    { value: 'residency-certificate', label: 'Residency Certificate' },
    { value: 'specialty-certification', label: 'Specialty Certification' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'expiring-soon':
        return 'text-warning bg-warning/10';
      case 'expired':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'expiring-soon':
        return 'AlertTriangle';
      case 'expired':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const handleAddCredential = () => {
    const credential = {
      id: credentials.length + 1,
      ...newCredential,
      status: 'pending',
      documentUrl: null
    };
    setCredentials([...credentials, credential]);
    setNewCredential({
      type: '',
      number: '',
      issuingAuthority: '',
      issueDate: '',
      expiryDate: '',
      document: null
    });
    setIsAddingCredential(false);
  };

  const handleFileUpload = (credentialId, file) => {
    setCredentials(prev => prev.map(cred => 
      cred.id === credentialId 
        ? { ...cred, documentUrl: URL.createObjectURL(file), status: 'pending' }
        : cred
    ));
  };

  const isExpiringWithin30Days = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    return expiry <= thirtyDaysFromNow;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-card-foreground">
            Medical Credentials
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your professional licenses and certifications
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          onClick={() => setIsAddingCredential(true)}
        >
          Add Credential
        </Button>
      </div>

      {/* Expiring Credentials Alert */}
      {credentials.some(cred => isExpiringWithin30Days(cred.expiryDate)) && (
        <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-warning">Credentials Expiring Soon</h3>
              <p className="text-sm text-warning/80 mt-1">
                Some of your credentials are expiring within 30 days. Please renew them to maintain your verification status.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Credentials List */}
      <div className="space-y-4">
        {credentials.map((credential) => (
          <div key={credential.id} className="border border-border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-heading font-medium text-card-foreground">
                    {credential.type}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(credential.status)}`}>
                    <Icon name={getStatusIcon(credential.status)} size={12} />
                    <span className="capitalize">{credential.status.replace('-', ' ')}</span>
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">License/Certificate Number</p>
                    <p className="font-medium text-card-foreground">{credential.number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Issuing Authority</p>
                    <p className="font-medium text-card-foreground">{credential.issuingAuthority}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Issue Date</p>
                    <p className="font-medium text-card-foreground">
                      {new Date(credential.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expiry Date</p>
                    <p className={`font-medium ${isExpiringWithin30Days(credential.expiryDate) ? 'text-warning' : 'text-card-foreground'}`}>
                      {new Date(credential.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {credential.documentUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Eye"
                    onClick={() => window.open(credential.documentUrl, '_blank')}
                  >
                    View
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Upload"
                >
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(credential.id, e.target.files[0])}
                  />
                  Re-upload
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="MoreVertical"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Credential Form */}
      {isAddingCredential && (
        <div className="mt-6 p-4 border border-border rounded-lg bg-muted/50">
          <h3 className="text-lg font-heading font-medium text-card-foreground mb-4">
            Add New Credential
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Credential Type"
              options={credentialTypes}
              value={newCredential.type}
              onChange={(value) => setNewCredential(prev => ({ ...prev, type: value }))}
              required
            />
            
            <Input
              label="License/Certificate Number"
              type="text"
              value={newCredential.number}
              onChange={(e) => setNewCredential(prev => ({ ...prev, number: e.target.value }))}
              placeholder="Enter credential number"
              required
            />
            
            <Input
              label="Issuing Authority"
              type="text"
              value={newCredential.issuingAuthority}
              onChange={(e) => setNewCredential(prev => ({ ...prev, issuingAuthority: e.target.value }))}
              placeholder="e.g., State Medical Board"
              required
              className="md:col-span-2"
            />
            
            <Input
              label="Issue Date"
              type="date"
              value={newCredential.issueDate}
              onChange={(e) => setNewCredential(prev => ({ ...prev, issueDate: e.target.value }))}
              required
            />
            
            <Input
              label="Expiry Date"
              type="date"
              value={newCredential.expiryDate}
              onChange={(e) => setNewCredential(prev => ({ ...prev, expiryDate: e.target.value }))}
              required
            />
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Upload Document
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Icon name="Upload" size={24} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your document here, or click to browse
                </p>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setNewCredential(prev => ({ ...prev, document: e.target.files[0] }))}
                />
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: PDF, JPG, PNG (Max 10MB)
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-3 mt-6">
            <Button
              variant="ghost"
              onClick={() => setIsAddingCredential(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleAddCredential}
              disabled={!newCredential.type || !newCredential.number || !newCredential.issuingAuthority}
            >
              Add Credential
            </Button>
          </div>
        </div>
      )}

      {/* Verification Process Info */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-heading font-medium text-card-foreground mb-3">
          Verification Process
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} />
            <span>New credentials typically take 2-3 business days to verify</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} />
            <span>All documents are encrypted and stored securely</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={16} />
            <span>You'll receive email notifications about verification status</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalCredentialsSection;