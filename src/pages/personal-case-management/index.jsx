import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';

import Button from '../../components/ui/Button';
import CaseFilters from './components/CaseFilters';
import CaseTable from './components/CaseTable';
import BulkActions from './components/BulkActions';
import CaseSummaryPanel from './components/CaseSummaryPanel';
import CasePagination from './components/CasePagination';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';

const PersonalCaseManagement = () => {
  const navigate = useNavigate();
  const [selectedCases, setSelectedCases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    symptomCategory: 'all',
    searchText: ''
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    caseId: null,
    caseTitle: '',
    isMultiple: false,
    count: 0
  });

  // Mock case data
  const mockCases = [
    {
      id: 1,
      title: "Respiratory Case #2024-045",
      symptoms: "Persistent cough, shortness of breath, chest tightness",
      demographics: { age: 45, gender: "Female", region: "North America" },
      submissionDate: "2024-07-14T10:30:00Z",
      status: "submitted",
      category: "respiratory",
      icd10: "J44.1"
    },
    {
      id: 2,
      title: "Cardiac Event #2024-044",
      symptoms: "Chest pain, palpitations, dizziness",
      demographics: { age: 62, gender: "Male", region: "Europe" },
      submissionDate: "2024-07-13T14:15:00Z",
      status: "approved",
      category: "cardiovascular",
      icd10: "I25.9"
    },
    {
      id: 3,
      title: "Neurological Case #2024-043",
      symptoms: "Severe headache, visual disturbances, confusion",
      demographics: { age: 38, gender: "Female", region: "Asia" },
      submissionDate: "2024-07-12T09:45:00Z",
      status: "flagged",
      category: "neurological",
      icd10: "G43.9"
    },
    {
      id: 4,
      title: "Dermatological Case #2024-042",
      symptoms: "Unusual skin lesions, itching, inflammation",
      demographics: { age: 29, gender: "Male", region: "South America" },
      submissionDate: "2024-07-11T16:20:00Z",
      status: "draft",
      category: "dermatological",
      icd10: "L30.9"
    },
    {
      id: 5,
      title: "Gastrointestinal Case #2024-041",
      symptoms: "Abdominal pain, nausea, digestive issues",
      demographics: { age: 51, gender: "Female", region: "Africa" },
      submissionDate: "2024-07-10T11:10:00Z",
      status: "submitted",
      category: "gastrointestinal",
      icd10: "K59.9"
    },
    {
      id: 6,
      title: "Infectious Disease #2024-040",
      symptoms: "Fever, fatigue, lymph node swelling",
      demographics: { age: 34, gender: "Male", region: "Australia" },
      submissionDate: "2024-07-09T13:30:00Z",
      status: "approved",
      category: "infectious",
      icd10: "B99.9"
    },
    {
      id: 7,
      title: "Endocrine Case #2024-039",
      symptoms: "Weight changes, fatigue, hormonal imbalance",
      demographics: { age: 42, gender: "Female", region: "North America" },
      submissionDate: "2024-07-08T08:45:00Z",
      status: "submitted",
      category: "endocrine",
      icd10: "E34.9"
    },
    {
      id: 8,
      title: "Musculoskeletal Case #2024-038",
      symptoms: "Joint pain, stiffness, mobility issues",
      demographics: { age: 58, gender: "Male", region: "Europe" },
      submissionDate: "2024-07-07T15:20:00Z",
      status: "draft",
      category: "musculoskeletal",
      icd10: "M79.9"
    },
    {
      id: 9,
      title: "Oncological Case #2024-037",
      symptoms: "Unexplained weight loss, fatigue, pain",
      demographics: { age: 67, gender: "Female", region: "Asia" },
      submissionDate: "2024-07-06T12:15:00Z",
      status: "flagged",
      category: "oncological",
      icd10: "C80.1"
    },
    {
      id: 10,
      title: "Psychiatric Case #2024-036",
      symptoms: "Mood changes, anxiety, sleep disturbances",
      demographics: { age: 31, gender: "Male", region: "South America" },
      submissionDate: "2024-07-05T10:30:00Z",
      status: "submitted",
      category: "psychiatric",
      icd10: "F99.9"
    }
  ];

  // Filter cases based on current filters
  const filteredCases = mockCases.filter(caseItem => {
    const matchesStatus = filters.status === 'all' || caseItem.status === filters.status;
    const matchesCategory = filters.symptomCategory === 'all' || caseItem.category === filters.symptomCategory;
    const matchesSearch = filters.searchText === '' || 
      caseItem.title.toLowerCase().includes(filters.searchText.toLowerCase()) ||
      caseItem.symptoms.toLowerCase().includes(filters.searchText.toLowerCase()) ||
      caseItem.icd10.toLowerCase().includes(filters.searchText.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCases = filteredCases.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCaseAction = (action, caseId) => {
    switch (action) {
      case 'view': navigate('/case-viewer-details', { state: { caseId } });
        break;
      case 'edit': navigate('/case-submission-form', { state: { caseId, mode: 'edit' } });
        break;
      case 'duplicate': navigate('/case-submission-form', { state: { caseId, mode: 'duplicate' } });
        break;
      case 'delete':
        const caseToDelete = mockCases.find(c => c.id === caseId);
        setDeleteModal({
          isOpen: true,
          caseId,
          caseTitle: caseToDelete?.title || '',
          isMultiple: false,
          count: 1
        });
        break;
      case 'create': navigate('/case-submission-form');
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action, caseIds, additionalData = null) => {
    switch (action) {
      case 'export':
        console.log('Exporting cases:', caseIds);
        // Implement export functionality
        break;
      case 'duplicate': console.log('Duplicating cases:', caseIds);
        // Implement duplicate functionality
        break;
      case 'archive': console.log('Archiving cases:', caseIds);
        // Implement archive functionality
        break;
      case 'delete':
        setDeleteModal({
          isOpen: true,
          caseId: null,
          caseTitle: '',
          isMultiple: true,
          count: caseIds.length
        });
        break;
      case 'updateStatus': console.log('Updating status to:', additionalData, 'for cases:', caseIds);
        // Implement status update functionality
        break;
      default:
        break;
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.isMultiple) {
      console.log('Deleting multiple cases:', selectedCases);
      setSelectedCases([]);
    } else {
      console.log('Deleting single case:', deleteModal.caseId);
    }
    setDeleteModal({ isOpen: false, caseId: null, caseTitle: '', isMultiple: false, count: 0 });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, caseId: null, caseTitle: '', isMultiple: false, count: 0 });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedCases(newSelection);
  };

  const handleClearSelection = () => {
    setSelectedCases([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading font-semibold text-foreground mb-2">
                My Cases
              </h1>
              <p className="text-muted-foreground">
                Manage and track your submitted medical cases
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <Button
                variant="outline"
                onClick={() => navigate('/case-submission-form')}
                iconName="Plus"
                iconPosition="left"
              >
                New Case
              </Button>
              <Button
                variant="ghost"
                iconName="RefreshCw"
                iconSize={16}
              >
                Refresh
              </Button>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <CaseFilters
                onFiltersChange={handleFiltersChange}
                totalCases={mockCases.length}
                filteredCases={filteredCases.length}
              />

              <BulkActions
                selectedCases={selectedCases}
                onBulkAction={handleBulkAction}
                onClearSelection={handleClearSelection}
              />

              <CaseTable
                cases={paginatedCases}
                onCaseAction={handleCaseAction}
                selectedCases={selectedCases}
                onSelectionChange={handleSelectionChange}
              />

              <CasePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredCases.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>

            {/* Summary Panel */}
            <CaseSummaryPanel cases={mockCases} />
          </div>
        </div>
      </main>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        caseTitle={deleteModal.caseTitle}
        isMultiple={deleteModal.isMultiple}
        count={deleteModal.count}
      />
    </div>
  );
};

export default PersonalCaseManagement;