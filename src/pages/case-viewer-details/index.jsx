import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import CaseHeader from './components/CaseHeader';
import PatientDemographics from './components/PatientDemographics';
import SymptomTimeline from './components/SymptomTimeline';
import DiagnosticInformation from './components/DiagnosticInformation';
import MedicalImageGallery from './components/MedicalImageGallery';
import CaseMetadata from './components/CaseMetadata';
import PersonalNotes from './components/PersonalNotes';
import CommentSection from './components/CommentSection';

const CaseViewerDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('id') || 'CASE-2024-001';
  const [isLoading, setIsLoading] = useState(true);

  // Mock case data
  const caseData = {
    caseId: 'CASE-2024-001',
    title: 'Rare Neurological Manifestation in Young Adult',
    status: 'Under Review',
    submissionDate: '2024-07-10',
    lastUpdated: '2024-07-14 14:30',
    submittedBy: 'Sarah Chen',
    priority: 'High',
    category: 'Neurology',
    confidentialityLevel: 'High'
  };

  const patientDemographics = {
    ageGroup: '25-30 years',
    gender: 'Female',
    region: 'North America',
    ethnicity: 'Asian',
    medicalHistory: 'No significant past medical history',
    medications: 'None reported'
  };

  const symptomTimeline = [
    {
      type: 'onset',
      title: 'Initial Symptom Onset',
      date: '2024-07-01',
      time: '08:30',
      severity: 'Mild',
      description: 'Patient reported sudden onset of intermittent headaches with visual disturbances.',
      symptoms: ['Headache', 'Visual disturbance', 'Mild nausea'],
      vitals: {
        bloodPressure: '120/80',
        heartRate: '72 bpm',
        temperature: '98.6°F',
        oxygenSat: '98%'
      }
    },
    {
      type: 'progression',
      title: 'Symptom Progression',
      date: '2024-07-03',
      time: '14:15',
      severity: 'Moderate',
      description: 'Headaches became more frequent and severe. Patient developed coordination issues.',
      symptoms: ['Severe headache', 'Coordination problems', 'Balance issues', 'Fatigue'],
      vitals: {
        bloodPressure: '125/85',
        heartRate: '78 bpm',
        temperature: '99.1°F',
        oxygenSat: '97%'
      }
    },
    {
      type: 'treatment',
      title: 'Initial Treatment',
      date: '2024-07-05',
      time: '10:00',
      severity: 'Moderate',
      description: 'Started on anti-inflammatory medication and ordered comprehensive neurological workup.',
      symptoms: ['Persistent headache', 'Improved coordination'],
      vitals: {
        bloodPressure: '118/78',
        heartRate: '70 bpm',
        temperature: '98.8°F',
        oxygenSat: '98%'
      }
    },
    {
      type: 'complication',
      title: 'Unexpected Complication',
      date: '2024-07-08',
      time: '16:45',
      severity: 'Severe',
      description: 'Patient developed acute neurological symptoms requiring immediate intervention.',
      symptoms: ['Severe headache', 'Speech difficulties', 'Motor weakness', 'Confusion'],
      vitals: {
        bloodPressure: '140/90',
        heartRate: '88 bpm',
        temperature: '100.2°F',
        oxygenSat: '96%'
      }
    }
  ];

  const diagnosticInformation = {
    icd10Codes: [
      {
        code: 'G93.1',
        description: 'Anoxic brain damage, not elsewhere classified',
        isPrimary: true
      },
      {
        code: 'R51',
        description: 'Headache',
        isPrimary: false
      },
      {
        code: 'R27.0',
        description: 'Ataxia, unspecified',
        isPrimary: false
      }
    ],
    labResults: [
      {
        testName: 'Complete Blood Count',
        value: '12.5',
        unit: 'g/dL',
        referenceRange: '12.0-15.5 g/dL',
        status: 'Normal',
        date: '2024-07-05'
      },
      {
        testName: 'C-Reactive Protein',
        value: '8.2',
        unit: 'mg/L',
        referenceRange: '<3.0 mg/L',
        status: 'Abnormal',
        date: '2024-07-05'
      },
      {
        testName: 'Cerebrospinal Fluid Protein',
        value: '65',
        unit: 'mg/dL',
        referenceRange: '15-45 mg/dL',
        status: 'Abnormal',
        date: '2024-07-06'
      },
      {
        testName: 'Glucose',
        value: '95',
        unit: 'mg/dL',
        referenceRange: '70-100 mg/dL',
        status: 'Normal',
        date: '2024-07-05'
      }
    ],
    imagingStudies: [
      {
        type: 'MRI Brain',
        date: '2024-07-06',
        findings: 'Multiple small hyperintense lesions in white matter bilaterally. No mass effect or midline shift.',
        impression: 'Findings consistent with inflammatory demyelinating process. Differential includes multiple sclerosis, ADEM, or infectious etiology.'
      },
      {
        type: 'CT Head',
        date: '2024-07-05',
        findings: 'No acute intracranial abnormality. No hemorrhage or mass effect.',
        impression: 'Normal CT head. MRI recommended for further evaluation of neurological symptoms.'
      }
    ]
  };

  const medicalImages = [
    {
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
      type: 'MRI',
      description: 'Axial T2-weighted MRI showing hyperintense lesions in bilateral white matter',
      captureDate: '2024-07-06'
    },
    {
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop',
      type: 'CT',
      description: 'Non-contrast CT head showing normal brain parenchyma',
      captureDate: '2024-07-05'
    },
    {
      url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop',
      type: 'X-Ray',
      description: 'Chest X-ray showing clear lung fields',
      captureDate: '2024-07-05'
    },
    {
      url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop',
      type: 'Ultrasound',
      description: 'Carotid ultrasound showing normal flow patterns',
      captureDate: '2024-07-07'
    }
  ];

  const caseMetadata = {
    caseId: caseData.caseId,
    submissionDate: 'July 10, 2024 at 2:30 PM',
    lastUpdated: 'July 14, 2024 at 2:30 PM',
    status: caseData.status,
    priority: caseData.priority,
    assignedReviewer: 'Dr. Michael Rodriguez',
    category: caseData.category,
    confidentialityLevel: caseData.confidentialityLevel,
    statusHistory: [
      {
        status: 'Under Review',
        timestamp: 'July 14, 2024 at 2:30 PM',
        note: 'Assigned to Dr. Michael Rodriguez for expert review'
      },
      {
        status: 'Submitted',
        timestamp: 'July 10, 2024 at 2:30 PM',
        note: 'Case submitted for review'
      },
      {
        status: 'Draft',
        timestamp: 'July 9, 2024 at 4:15 PM',
        note: 'Initial case draft created'
      }
    ]
  };

  const personalNotes = `This case presents an interesting neurological manifestation in a young adult with no significant medical history. The rapid progression from mild headaches to severe neurological symptoms is concerning and warrants immediate attention.

Key observations:
- Sudden onset in previously healthy individual
- Rapid symptom progression over 7 days
- Inflammatory markers elevated
- MRI findings suggest demyelinating process

Differential considerations:
1. Acute disseminated encephalomyelitis (ADEM)
2. Multiple sclerosis (first episode)
3. Infectious encephalitis
4. Autoimmune encephalitis

Follow-up recommendations:
- Serial MRI to monitor lesion progression
- Autoimmune panel including ANA, anti-NMDA receptor antibodies
- Lumbar puncture for oligoclonal bands
- Consider steroid therapy if autoimmune etiology confirmed`;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEdit = () => {
    navigate(`/case-submission-form?edit=${caseId}`);
  };

  const handleExport = () => {
    // Simulate PDF export
    console.log('Exporting case to PDF...');
    // In real implementation, this would generate and download a PDF
  };

  const handleShare = () => {
    // Simulate sharing functionality
    console.log('Opening share dialog...');
    // In real implementation, this would open a sharing modal
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading case details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-8">
              <CaseHeader
                caseData={caseData}
                onEdit={handleEdit}
                onExport={handleExport}
                onShare={handleShare}
              />
              <PatientDemographics demographics={patientDemographics} />
              <SymptomTimeline timeline={symptomTimeline} />
              <DiagnosticInformation diagnostics={diagnosticInformation} />
              <MedicalImageGallery images={medicalImages} />
              <CaseMetadata metadata={caseMetadata} />
              <PersonalNotes caseId={caseId} initialNotes={personalNotes} />
              <CommentSection caseId={caseId} />
            </div>
            <div className="space-y-8">
              {/* Sidebar or additional info */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseViewerDetails;