const express = require('express');
const router = express.Router();

// In-memory case data
const cases = [
  {
    id: 'CASE-2024-001',
    title: 'Rare Respiratory Syndrome - Adult Male',
    city: 'New York',
    country: 'USA',
    coordinates: [40.7128, -74.006],
    description: 'Case 1: Cardiology',
  },
  {
    id: 'CASE-2024-002',
    title: 'Acute Neurological Event - Female',
    city: 'London',
    country: 'UK',
    coordinates: [51.5074, -0.1278],
    description: 'Case 2: Neurology',
  },
  {
    id: 'CASE-2024-003',
    title: 'Infectious Disease - Child',
    city: 'Nairobi',
    country: 'Kenya',
    coordinates: [-1.2921, 36.8219],
    description: 'Case 3: Infectious Disease',
  },
  {
    id: 'CASE-2024-004',
    title: 'Oncology Follow-up - Elderly',
    city: 'Tokyo',
    country: 'Japan',
    coordinates: [35.6895, 139.6917],
    description: 'Case 4: Oncology',
  },
];

// GET /api/cases - return all cases
router.get('/', (req, res) => {
  res.json(cases);
});

module.exports = router; 