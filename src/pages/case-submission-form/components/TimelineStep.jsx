import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TimelineStep = ({ formData, setFormData, errors, setErrors }) => {
  const [newEvent, setNewEvent] = useState({
    date: '',
    time: '',
    event: '',
    severity: '',
    notes: ''
  });
  const [isEditingFirstSymptomTime, setIsEditingFirstSymptomTime] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingEventData, setEditingEventData] = useState(null);

  const severityOptions = [
    { value: 'mild', label: 'Mild' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'severe', label: 'Severe' },
    { value: 'critical', label: 'Critical' }
  ];

  const eventTypeOptions = [
    { value: 'symptom-onset', label: 'Symptom Onset' },
    { value: 'symptom-change', label: 'Symptom Change' },
    { value: 'treatment', label: 'Treatment/Intervention' },
    { value: 'test-result', label: 'Test Result' },
    { value: 'hospitalization', label: 'Hospitalization' },
    { value: 'discharge', label: 'Discharge' },
    { value: 'follow-up', label: 'Follow-up Visit' },
    { value: 'other', label: 'Other Event' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline,
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

  const handleNewEventChange = (field, value) => {
    setNewEvent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTimelineEvent = () => {
    if (!newEvent.date || !newEvent.event) {
      return;
    }

    const event = {
      id: Date.now(),
      ...newEvent,
      timestamp: new Date(`${newEvent.date}T${newEvent.time || '12:00'}`).toISOString()
    };

    const currentEvents = formData.timeline.events || [];
    const updatedEvents = [...currentEvents, event].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    handleInputChange('events', updatedEvents);
    
    // Reset form
    setNewEvent({
      date: '',
      time: '',
      event: '',
      severity: '',
      notes: ''
    });
  };

  const removeTimelineEvent = (eventId) => {
    const currentEvents = formData.timeline.events || [];
    const updatedEvents = currentEvents.filter(event => event.id !== eventId);
    handleInputChange('events', updatedEvents);
  };

  const formatEventDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }) + ', ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
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

  const validateStep = () => {
    const newErrors = {};
    
    if (!formData.timeline.firstSymptomDate) {
      newErrors.firstSymptomDate = 'First symptom date is required';
    }
    if (!formData.timeline.events || formData.timeline.events.length === 0) {
      newErrors.events = 'At least one timeline event is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditEvent = (event) => {
    setEditingEventId(event.id);
    // Parse date and time from timestamp
    const dt = new Date(event.timestamp);
    setEditingEventData({
      ...event,
      date: dt.toISOString().slice(0, 10),
      time: dt.toISOString().slice(11, 16),
    });
  };

  const handleEditEventChange = (field, value) => {
    setEditingEventData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEditEvent = () => {
    if (!editingEventData.date || !editingEventData.event) return;
    const updatedEvent = {
      ...editingEventData,
      timestamp: new Date(`${editingEventData.date}T${editingEventData.time || '12:00'}`).toISOString(),
    };
    const updatedEvents = (formData.timeline.events || []).map(ev =>
      ev.id === editingEventId ? updatedEvent : ev
    );
    handleInputChange('events', updatedEvents);
    setEditingEventId(null);
    setEditingEventData(null);
  };

  const handleCancelEditEvent = () => {
    setEditingEventId(null);
    setEditingEventData(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
          <Icon name="Clock" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Timeline & Progression
          </h2>
          <p className="text-sm text-muted-foreground">
            Document the chronological progression of symptoms and events
          </p>
        </div>
      </div>

      {/* Initial Symptom Information */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-body font-medium text-foreground mb-4">
          Initial Presentation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Symptom Date"
            type="date"
            value={formData.timeline.firstSymptomDate || ''}
            onChange={(e) => handleInputChange('firstSymptomDate', e.target.value)}
            error={errors.firstSymptomDate}
            required
            description="When did the first symptoms appear?"
          />
          {/* Editable Approximate Time */}
          {!isEditingFirstSymptomTime ? (
            <div className="flex flex-col justify-end">
              <label className="text-sm font-medium text-foreground mb-1">Approximate Time (Optional)</label>
              <button
                type="button"
                className="text-left px-3 py-2 border border-input rounded-md bg-input text-foreground hover:bg-muted focus:outline-none"
                onClick={() => setIsEditingFirstSymptomTime(true)}
              >
                {formData.timeline.firstSymptomTime
                  ? formData.timeline.firstSymptomTime + ' (24h)'
                  : <span className="text-muted-foreground">Click to set time</span>}
              </button>
              <span className="text-xs text-muted-foreground mt-1">If known, what time did symptoms begin?</span>
            </div>
          ) : (
            <Input
              label="Approximate Time (Optional)"
              type="custom-time"
              value={formData.timeline.firstSymptomTime || ''}
              onChange={(e) => {
                handleInputChange('firstSymptomTime', e.target.value);
                setIsEditingFirstSymptomTime(false);
              }}
              autoFocus
              description="If known, what time did symptoms begin? (24-hour format)"
            />
          )}
        </div>
      </div>

      {/* Add New Timeline Event */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-body font-medium text-foreground mb-4">
          Add Timeline Event
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Date"
            type="date"
            value={newEvent.date}
            onChange={(e) => handleNewEventChange('date', e.target.value)}
            required
          />
          <Input
            label="Time (Optional)"
            type="custom-time"
            value={newEvent.time}
            onChange={(e) => handleNewEventChange('time', e.target.value)}
          />
          <Select
            label="Event Type"
            options={eventTypeOptions}
            value={newEvent.eventType}
            onChange={(value) => handleNewEventChange('eventType', value)}
            placeholder="Select event type"
          />
        </div>
        
        <div className="mt-4">
          <Input
            label="Event Description"
            type="text"
            placeholder="Describe what happened (e.g., 'High fever developed', 'Started antibiotics', 'CT scan performed')"
            value={newEvent.event}
            onChange={(e) => handleNewEventChange('event', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Select
            label="Severity (if applicable)"
            options={severityOptions}
            value={newEvent.severity}
            onChange={(value) => handleNewEventChange('severity', value)}
            placeholder="Select severity"
          />
          <Input
            label="Additional Notes"
            type="text"
            placeholder="Any additional context or observations"
            value={newEvent.notes}
            onChange={(e) => handleNewEventChange('notes', e.target.value)}
          />
        </div>

        <div className="mt-4">
          <Button
            onClick={addTimelineEvent}
            disabled={!newEvent.date || !newEvent.event}
            iconName="Plus"
            iconPosition="left"
          >
            Add Event
          </Button>
        </div>
      </div>

      {/* Timeline Events Display */}
      {formData.timeline.events && formData.timeline.events.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-body font-medium text-foreground">
              Timeline Events ({formData.timeline.events.length})
            </h3>
            {errors.events && (
              <p className="text-sm text-error">{errors.events}</p>
            )}
          </div>
          <div className="space-y-4">
            {formData.timeline.events.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline connector */}
                {index < formData.timeline.events.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-border" />
                )}
                {editingEventId === event.id ? (
                  <div className="flex items-start space-x-4 p-3 bg-muted rounded-lg">
                    <div className="w-4 h-4 bg-accent rounded-full mt-1 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input
                          label="Date"
                          type="date"
                          value={editingEventData.date}
                          onChange={e => handleEditEventChange('date', e.target.value)}
                          required
                        />
                        <Input
                          label="Time (24h)"
                          type="custom-time"
                          value={editingEventData.time}
                          onChange={e => handleEditEventChange('time', e.target.value)}
                        />
                      </div>
                      <Select
                        label="Event Type"
                        options={eventTypeOptions}
                        value={editingEventData.eventType}
                        onChange={value => handleEditEventChange('eventType', value)}
                        placeholder="Select event type"
                      />
                      <Input
                        label="Event Description"
                        type="text"
                        value={editingEventData.event}
                        onChange={e => handleEditEventChange('event', e.target.value)}
                        required
                      />
                      <Select
                        label="Severity (if applicable)"
                        options={severityOptions}
                        value={editingEventData.severity}
                        onChange={value => handleEditEventChange('severity', value)}
                        placeholder="Select severity"
                      />
                      <Input
                        label="Additional Notes"
                        type="text"
                        value={editingEventData.notes}
                        onChange={e => handleEditEventChange('notes', e.target.value)}
                      />
                      <div className="flex space-x-2 mt-2">
                        <Button size="sm" variant="default" onClick={handleSaveEditEvent} iconName="Save" iconPosition="left">Save</Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEditEvent}>Cancel</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-4 p-3 bg-muted rounded-lg cursor-pointer" onClick={() => handleEditEvent(event)}>
                    <div className="w-4 h-4 bg-accent rounded-full mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-body font-medium text-foreground">
                            {formatEventDate(event.timestamp)}
                          </span>
                          {event.eventType && (
                            <span className="px-2 py-1 text-xs bg-secondary/20 text-secondary rounded-full">
                              {eventTypeOptions.find(opt => opt.value === event.eventType)?.label || event.eventType}
                            </span>
                          )}
                          {event.severity && (
                            <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(event.severity)}`}>
                              {event.severity}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => { e.stopPropagation(); removeTimelineEvent(event.id); }}
                          iconName="Trash2"
                          className="text-error hover:text-error"
                        />
                      </div>
                      <p className="text-sm text-foreground mb-1">{event.event}</p>
                      {event.notes && (
                        <p className="text-xs text-muted-foreground">{event.notes}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disease Progression Notes */}
      <div>
        <label className="block text-sm font-body font-medium text-foreground mb-2">
          Overall Disease Progression
        </label>
        <textarea
          className="w-full h-32 p-3 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          placeholder="Describe the overall pattern of disease progression, any notable changes, response to treatments, etc."
          value={formData.timeline.progressionNotes || ''}
          onChange={(e) => handleInputChange('progressionNotes', e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Include observations about disease trajectory, treatment responses, and any unusual patterns
        </p>
      </div>

      {/* Show summary of first symptom date and time */}
      {formData.timeline.firstSymptomDate && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={18} className="text-accent" />
            <h3 className="text-sm font-body font-medium text-foreground">
              Case Duration Summary
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            First symptoms: {new Date(formData.timeline.firstSymptomDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            {formData.timeline.firstSymptomTime && (
              <> at <span className="font-semibold">{formData.timeline.firstSymptomTime}</span> (24h)</>
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            Duration: {Math.ceil((new Date() - new Date(formData.timeline.firstSymptomDate)) / (1000 * 60 * 60 * 24))} days
          </p>
        </div>
      )}
    </div>
  );
};

export default TimelineStep;