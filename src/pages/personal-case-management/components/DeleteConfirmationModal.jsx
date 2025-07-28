import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, caseTitle, isMultiple = false, count = 1 }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1200] p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card border border-border rounded-lg shadow-modal max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={24} className="text-error" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                {isMultiple ? 'Delete Multiple Cases' : 'Delete Case'}
              </h3>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone
              </p>
            </div>
          </div>

          <div className="mb-6">
            {isMultiple ? (
              <p className="text-sm text-card-foreground">
                Are you sure you want to delete {count} selected case{count !== 1 ? 's' : ''}? 
                This will permanently remove {count !== 1 ? 'them' : 'it'} from your account and cannot be recovered.
              </p>
            ) : (
              <div>
                <p className="text-sm text-card-foreground mb-2">
                  Are you sure you want to delete this case? This action cannot be undone.
                </p>
                {caseTitle && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium text-card-foreground">Case to be deleted:</p>
                    <p className="text-sm text-muted-foreground">{caseTitle}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-md p-3 mb-6">
            <div className="flex items-start space-x-2">
              <Icon name="AlertCircle" size={16} className="text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning">Warning</p>
                <p className="text-xs text-warning/80">
                  Deleted cases cannot be recovered. Consider archiving instead if you might need this data later.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              iconName="Trash2"
              iconPosition="left"
              iconSize={16}
            >
              {isMultiple ? `Delete ${count} Case${count !== 1 ? 's' : ''}` : 'Delete Case'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;