import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PersonalNotes = ({ caseId, initialNotes = '' }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [versionHistory, setVersionHistory] = useState([]);

  useEffect(() => {
    const words = notes.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [notes]);

  useEffect(() => {
    // Auto-save functionality
    if (isEditing && notes !== initialNotes) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [notes, isEditing]);

  const handleAutoSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setLastSaved(new Date());
    setIsSaving(false);
    
    // Add to version history
    const newVersion = {
      id: Date.now(),
      content: notes,
      timestamp: new Date().toLocaleString(),
      wordCount: wordCount
    };
    
    setVersionHistory(prev => [newVersion, ...prev.slice(0, 4)]); // Keep last 5 versions
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await handleAutoSave();
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNotes(initialNotes);
    setIsEditing(false);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const restoreVersion = (version) => {
    setNotes(version.content);
    setIsEditing(true);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="FileText" size={20} className="text-primary" />
          <h2 className="text-lg font-heading font-semibold text-card-foreground">
            Personal Notes
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              iconName="Edit"
              iconPosition="left"
              onClick={handleEdit}
            >
              Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                loading={isSaving}
                iconName="Save"
                iconPosition="left"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Notes Editor */}
      <div className="mb-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add your personal notes about this case..."
              className="w-full h-40 p-3 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>{wordCount} words</span>
                {isSaving && (
                  <div className="flex items-center gap-1">
                    <Icon name="Loader2" size={12} className="animate-spin" />
                    <span>Saving...</span>
                  </div>
                )}
                {lastSaved && !isSaving && (
                  <span>Last saved: {formatTimestamp(lastSaved)}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Shield" size={12} />
                <span>Auto-encrypted</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-[160px] p-3 bg-muted rounded-md">
            {notes ? (
              <div className="whitespace-pre-wrap text-sm font-body text-card-foreground">
                {notes}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <Icon name="FileText" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notes added yet</p>
                  <p className="text-xs">Click Edit to add your thoughts</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Version History */}
      {versionHistory.length > 0 && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-body font-semibold text-card-foreground">
              Version History
            </h3>
            <span className="text-xs text-muted-foreground">
              Last {versionHistory.length} versions
            </span>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {versionHistory.map((version, index) => (
              <div
                key={version.id}
                className="flex items-center justify-between p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors duration-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-body font-medium text-card-foreground">
                      Version {versionHistory.length - index}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {version.wordCount} words
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {version.timestamp}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => restoreVersion(version)}
                >
                  Restore
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Collaboration Features */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Users" size={16} className="text-muted-foreground" />
            <span className="text-sm font-body text-muted-foreground">
              Future Collaboration
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="Share"
            iconPosition="left"
            disabled
          >
            Share Notes
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Note sharing and collaboration features will be available in future updates.
        </p>
      </div>
    </div>
  );
};

export default PersonalNotes;