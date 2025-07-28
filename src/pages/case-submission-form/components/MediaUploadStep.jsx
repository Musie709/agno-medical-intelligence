import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MediaUploadStep = ({ formData, setFormData, errors, setErrors }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/tiff',
    'application/pdf'
  ];

  const maxFileSize = 20 * 1024 * 1024; // 20MB

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        [field]: value
      }
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return 'File type not supported. Please upload JPEG, PNG, GIF, WebP, TIFF, or PDF files.';
    }
    if (file.size > maxFileSize) {
      return 'File size exceeds 20MB limit.';
    }
    return null;
  };

  const processFile = async (file) => {
    const error = validateFile(file);
    if (error) {
      return { error };
    }

    // Simulate file processing and EXIF data stripping
    const fileId = Date.now() + Math.random();
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
    }

    // Create file object with metadata
    const processedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadDate: new Date().toISOString(),
      exifStripped: true,
      anonymized: true
    };

    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });

    return { file: processedFile };
  };

  const handleFileUpload = async (files) => {
    const fileArray = Array.from(files);
    const currentFiles = formData.media.files || [];
    
    for (const file of fileArray) {
      const result = await processFile(file);
      if (result.error) {
        setErrors(prev => ({
          ...prev,
          files: result.error
        }));
      } else {
        const updatedFiles = [...currentFiles, result.file];
        handleInputChange('files', updatedFiles);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    const currentFiles = formData.media.files || [];
    const updatedFiles = currentFiles.filter(file => file.id !== fileId);
    handleInputChange('files', updatedFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          <Icon name="Upload" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Medical Images & Documents
          </h2>
          <p className="text-sm text-muted-foreground">
            Upload relevant medical images, X-rays, lab results, or other documentation
          </p>
        </div>
      </div>

      {/* Privacy & Security Notice */}
      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-success mt-0.5" />
          <div>
            <h3 className="text-sm font-body font-medium text-foreground mb-1">
              Automatic Privacy Protection
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• EXIF data and metadata automatically stripped from all images</li>
              <li>• Patient identifiers and personal information automatically detected and removed</li>
              <li>• Files encrypted during upload and storage</li>
              <li>• Only authorized medical professionals can access uploaded content</li>
            </ul>
          </div>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive
            ? 'border-accent bg-accent/10' :'border-border hover:border-accent/50 hover:bg-accent/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="Upload" size={32} className="text-accent" />
          </div>
          
          <div>
            <h3 className="text-lg font-body font-medium text-foreground mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Supported formats: JPEG, PNG, GIF, WebP, TIFF, PDF (max 20MB each)
            </p>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              iconName="FolderOpen"
              iconPosition="left"
            >
              Select Files
            </Button>
          </div>
        </div>
      </div>

      {errors.files && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-3">
          <p className="text-sm text-error">{errors.files}</p>
        </div>
      )}

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-body text-foreground">Uploading...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {formData.media.files && formData.media.files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-body font-medium text-foreground">
            Uploaded Files ({formData.media.files.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.media.files.map((file) => (
              <div key={file.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon name={getFileIcon(file.type)} size={20} className="text-accent" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    iconName="Trash2"
                    className="text-error hover:text-error"
                  />
                </div>
                
                {/* Image Preview */}
                {file.type.startsWith('image/') && (
                  <div className="mb-3 overflow-hidden rounded-md">
                    <Image
                      src={file.url}
                      alt={file.name}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                
                {/* Security Indicators */}
                <div className="flex items-center space-x-2 text-xs">
                  {file.exifStripped && (
                    <span className="flex items-center space-x-1 text-success">
                      <Icon name="Check" size={12} />
                      <span>EXIF Stripped</span>
                    </span>
                  )}
                  {file.anonymized && (
                    <span className="flex items-center space-x-1 text-success">
                      <Icon name="Shield" size={12} />
                      <span>Anonymized</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Categories */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-body font-medium text-foreground mb-3">
          Recommended File Types
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-body font-medium text-foreground mb-2">Medical Images</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• X-rays, CT scans, MRI images</li>
              <li>• Ultrasound images</li>
              <li>• Dermatological photos</li>
              <li>• Pathology slides</li>
            </ul>
          </div>
          <div>
            <h4 className="font-body font-medium text-foreground mb-2">Documentation</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Lab results and reports</li>
              <li>• Discharge summaries</li>
              <li>• Specialist consultations</li>
              <li>• Treatment protocols</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-body font-medium text-foreground mb-2">
          File Descriptions & Context
        </label>
        <textarea
          className="w-full h-24 p-3 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          placeholder="Provide context for uploaded files (e.g., 'Chest X-ray showing bilateral infiltrates', 'Lab results from day 3 of illness')"
          value={formData.media.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Help other medical professionals understand the significance of uploaded files
        </p>
      </div>
    </div>
  );
};

export default MediaUploadStep;