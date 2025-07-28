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
import { supabaseService } from '../../services/supabaseClient';

const CaseViewerDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('id');
  const [isLoading, setIsLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaseData = async () => {
      if (!caseId) {
        setError('No case ID provided');
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching case data for ID:', caseId);
        const { data, error } = await supabaseService.getCaseById(caseId);
        
        if (error) {
          console.error('❌ Error fetching case:', error);
          setError('Failed to load case data');
          setIsLoading(false);
          return;
        }

        if (!data) {
          setError('Case not found');
          setIsLoading(false);
          return;
        }

        console.log('✅ Case data loaded:', data);
        setCaseData(data);
      } catch (err) {
        console.error('💥 Unexpected error:', err);
        setError('Failed to load case data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaseData();
  }, [caseId]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-accent font-semibold text-lg">Loading case details...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-error font-semibold text-lg">
                {error || 'Case not found'}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Transform Supabase data to match component expectations
  const transformedCaseData = {
    caseId: caseData.id,
    title: caseData.title,
    status: caseData.status || 'Under Review',
    submissionDate: new Date(caseData.created_at).toLocaleDateString(),
    lastUpdated: new Date(caseData.updated_at || caseData.created_at).toLocaleString(),
    submittedBy: caseData.profiles ? `${caseData.profiles.first_name} ${caseData.profiles.last_name}` : 'Unknown',
    priority: caseData.priority || 'Medium',
    category: caseData.specialty || 'General',
    confidentialityLevel: caseData.confidentiality_level || 'Standard'
  };

  const patientDemographics = {
    ageGroup: caseData.age_group || 'Not specified',
    gender: caseData.gender || 'Not specified',
    region: caseData.country || 'Not specified',
    ethnicity: caseData.ethnicity || 'Not specified',
    medicalHistory: caseData.medical_history || 'No significant past medical history',
    medications: caseData.medications || 'None reported'
  };

  const symptomTimeline = caseData.symptom_timeline || [
    {
      type: 'onset',
      title: 'Initial Symptom Onset',
      date: new Date(caseData.created_at).toLocaleDateString(),
      time: new Date(caseData.created_at).toLocaleTimeString(),
      severity: caseData.severity || 'Mild',
      description: caseData.description || 'Initial case submission',
      symptoms: caseData.symptoms || ['Not specified'],
      vitals: {
        bloodPressure: '120/80',
        heartRate: '72 bpm',
        temperature: '98.6°F',
        oxygenSat: '98%'
      }
    }
  ];

  const diagnosticInformation = {
    icd10Codes: caseData.icd10_codes || [
      {
        code: 'Z00.00',
        description: 'Encounter for general adult medical examination without abnormal findings',
        isPrimary: true
      }
    ],
    labResults: caseData.lab_results || [
      {
        testName: 'Basic Metabolic Panel',
        value: 'Normal',
        unit: '',
        referenceRange: 'Within normal limits',
        status: 'Normal',
        date: new Date(caseData.created_at).toLocaleDateString()
      }
    ],
    imagingStudies: caseData.imaging_studies || [
      {
        type: 'Initial Assessment',
        date: new Date(caseData.created_at).toLocaleDateString(),
        findings: caseData.description || 'Case submitted for review',
        impression: 'Requires further evaluation'
      }
    ]
  };

  const medicalImages = caseData.images || [
    {
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
      alt: 'Medical imaging placeholder',
      caption: 'Case documentation'
    }
  ];

  const caseMetadata = {
    caseId: caseData.id,
    submissionDate: new Date(caseData.created_at).toLocaleDateString(),
    lastUpdated: new Date(caseData.updated_at || caseData.created_at).toLocaleString(),
    status: caseData.status || 'Under Review',
    priority: caseData.priority || 'Medium',
    assignedReviewer: caseData.assigned_reviewer || 'Not assigned',
    category: caseData.specialty || 'General',
    confidentialityLevel: caseData.confidentiality_level || 'Standard',
    statusHistory: caseData.status_history || [
      {
        status: 'Under Review',
        timestamp: new Date(caseData.updated_at || caseData.created_at).toLocaleString(),
        note: 'Case loaded'
      }
    ]
  };

  const personalNotes = caseData.personal_notes || `This case presents an interesting neurological manifestation in a young adult with no significant medical history. The rapid progression from mild headaches to severe neurological symptoms is concerning and warrants immediate attention.

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

  const handleEdit = () => {
    navigate(`/case-submission-form?edit=${caseData.id}`);
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-8">
              <CaseHeader
                caseData={transformedCaseData}
                onEdit={handleEdit}
                onExport={handleExport}
                onShare={handleShare}
              />
              <PatientDemographics demographics={patientDemographics} />
              <SymptomTimeline timeline={symptomTimeline} />
              <DiagnosticInformation diagnostics={diagnosticInformation} />
              <MedicalImageGallery images={medicalImages} />
              <CaseMetadata metadata={caseMetadata} />
              <PersonalNotes caseId={caseData.id} initialNotes={personalNotes} />
              <CommentSection caseId={caseData.id} />
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