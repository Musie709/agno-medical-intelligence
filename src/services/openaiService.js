// All OpenAI-related functions now call the backend proxy at /api/openai

const API_URL = '/api/openai';

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function callOpenAI(payload) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'OpenAI API error');
  }
  return res.json();
}

export async function analyzeSymptoms(symptomDescription) {
  try {
    const response = await callOpenAI({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a medical AI assistant.' },
        { role: 'user', content: symptomDescription },
      ],
      // Add any other required OpenAI params here
    });
    // Adapt response as needed for your UI
    return response;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    return {
      suggestions: [],
      rare_disease_indicators: [],
      clinical_notes: 'Unable to analyze symptoms at this time. Please try again.'
    };
  }
}

export async function generateDiagnosticInsights(caseData) {
  try {
    const response = await callOpenAI({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a medical AI assistant.' },
        { role: 'user', content: JSON.stringify(caseData) },
      ],
    });
    return response;
  } catch (error) {
    console.error('Error generating diagnostic insights:', error);
    return {
      primary_diagnosis: {
        diagnosis: 'Unable to analyze',
        icd10_code: 'N/A',
        confidence: 0,
        rationale: 'Analysis unavailable at this time'
      },
      differential_diagnoses: [],
      recommendations: [],
      rare_disease_alert: { is_rare: false }
    };
  }
}

export async function analyzeMedicalImage(imageDescription, imageType) {
  try {
    const response = await callOpenAI({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `You are a medical AI assistant. Image type: ${imageType}` },
        { role: 'user', content: imageDescription },
      ],
    });
    return response;
  } catch (error) {
    console.error('Error analyzing medical image:', error);
    return {
      findings: [],
      abnormalities: [],
      recommendations: ['Unable to analyze image at this time'],
      rare_findings: { has_rare_findings: false }
    };
  }
}

export async function generateTreatmentRecommendations(diagnosis, patientInfo) {
  try {
    const response = await callOpenAI({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a medical AI assistant.' },
        { role: 'user', content: `Diagnosis: ${diagnosis}. Patient info: ${JSON.stringify(patientInfo)}` },
      ],
    });
    return response;
  } catch (error) {
    console.error('Error generating treatment recommendations:', error);
    return {
      primary_treatment: {
        treatment: 'Unable to generate recommendations',
        dosage: 'N/A',
        duration: 'N/A',
        monitoring: 'Consult healthcare provider'
      },
      alternative_treatments: [],
      emergency_protocols: [],
      follow_up: {
        timeline: 'As directed by healthcare provider',
        assessments: [],
        specialist_referrals: []
      }
    };
  }
}

/**
 * Analyzes global health trends and patterns
 * @param {Array} caseData - Array of case data for pattern analysis
 * @returns {Promise<object>} Global health pattern analysis
 */
export async function analyzeGlobalHealthPatterns(caseData) {
  try {
    const casesSummary = caseData.map(case_item => ({
      region: case_item.region,
      symptoms: case_item.symptoms,
      timeline: case_item.timeline,
      demographics: case_item.demographics
    }));

    const response = await callOpenAI({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a global health epidemiologist AI.' },
        { role: 'user', content: JSON.stringify(casesSummary) },
      ],
    });

    return response;
  } catch (error) {
    console.error('Error analyzing global health patterns:', error);
    return {
      geographic_clusters: [],
      temporal_patterns: [],
      emerging_threats: [],
      alerts: []
    };
  }
}

/**
 * Moderates medical content for safety and appropriateness
 * @param {string} content - Content to moderate
 * @returns {Promise<object>} Moderation results
 */
export async function moderateMedicalContent(content) {
  try {
    const response = await callOpenAI({
      model: 'text-moderation-latest',
      input: content,
    });

    return response;
  } catch (error) {
    console.error('Error moderating content:', error);
    return {
      flagged: false,
      categories: {},
      category_scores: {}
    };
  }
}