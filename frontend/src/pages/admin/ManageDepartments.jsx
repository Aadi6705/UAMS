import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const ManageDepartments = () => {
  useDocumentTitle('Departments');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [selectedDept, setSelectedDept] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [validated, setValidated] = useState(false);

  // Global search from context
  const { searchTerm = '' } = useOutletContext() || {};

  // Local Search & Pagination & Sort state
  const [localSearch, setLocalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/admin/departments');
      setDepartments(response.data);
    } catch (err) {
      toast.error('Failed to fetch departments.');
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered, sorted, and paginated data
  const processedDepartments = useMemo(() => {
    // 1. Filter
    const activeSearch = localSearch || searchTerm;
    let filtered = departments.filter(d => 
      d.name.toLowerCase().includes(activeSearch.toLowerCase()) || 
      d.code.toLowerCase().includes(activeSearch.toLowerCase())
    );

    // 2. Sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [departments, localSearch, searchTerm, sortConfig]);

  const totalPages = Math.ceil(processedDepartments.length / ITEMS_PER_PAGE);
  const currentDepartments = processedDepartments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const exportToCSV = () => {
    if (processedDepartments.length === 0) {
      toast.error('No data to export');
      return;
    }
    const headers = ['ID', 'Code', 'Department Name'];
    const csvData = processedDepartments.map(d => `${d.id},${d.code},"${d.name}"`);
    const csvString = [headers.join(','), ...csvData].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'departments.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Export successful');
  };

  const handleAddSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post('/admin/departments', formData);
      toast.success('Department created successfully!');
      setShowAddModal(false);
      setFormData({ name: '', code: '' });
      setIsDirty(false);
      setValidated(false);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setSubmitting(true);
    try {
      await api.put(`/admin/departments/${selectedDept.id}`, formData);
      toast.success('Department updated successfully!');
      setShowEditModal(false);
      setIsDirty(false);
      setValidated(false);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/admin/departments/${selectedDept.id}`);
      toast.success('Department deleted successfully!');
      setShowDeleteModal(false);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete department');
    } finally {
      setSubmitting(false);
    }
  };

  const openAddModal = () => {
    setFormData({ name: '', code: '' });
    setIsDirty(false);
    setValidated(false);
    setShowAddModal(true);
  };

  const openEditModal = (dept) => {
    setSelectedDept(dept);
    setFormData({ name: dept.name, code: dept.code });
    setIsDirty(false);
    setValidated(false);
    setShowEditModal(true);
  };

  const openDeleteModal = (dept) => {
    setSelectedDept(dept);
    setShowDeleteModal(true);
  };

  const handleCloseAddModal = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to close?')) return;
    setShowAddModal(false);
  };

  const handleCloseEditModal = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to close?')) return;
    setShowEditModal(false);
  };

  const handleFormChange = (e, field) => {
    setIsDirty(true);
    setFormData({ ...formData, [field]: field === 'code' ? e.target.value.toUpperCase() : e.target.value });
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <i className="bi bi-arrow-down-up ms-1 text-muted opacity-25"></i>;
    }
    return sortConfig.direction === 'ascending' ? (
      <i className="bi bi-arrow-up ms-1 text-primary"></i>
    ) : (
      <i className="bi bi-arrow-down ms-1 text-primary"></i>
    );
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="mb-1 fw-bold">Manage Departments</h2>
          <p className="text-muted mb-0">View and organize all university departments.</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={exportToCSV} className="d-flex align-items-center shadow-sm bg-white hover-bg-light">
            <i className="bi bi-download me-2"></i> Export
          </Button>
          <Button variant="primary" onClick={openAddModal} className="d-flex align-items-center shadow-sm">
            <i className="bi bi-plus-lg me-2"></i> Add Department
          </Button>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4 transition-all hover-lift">
        <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
          <div className="row">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control bg-light border-start-0 ps-0 focus-none" 
                  placeholder="Local search..."
                  value={localSearch}
                  onChange={(e) => { setLocalSearch(e.target.value); setCurrentPage(1); }}
                  style={{ boxShadow: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-5 fade-in">
              <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-building text-muted fs-1"></i>
              </div>
              <h5 className="fw-bold text-dark mb-1">No Departments Yet</h5>
              <p className="text-muted mb-3">Get started by adding your first department.</p>
              <Button variant="primary" onClick={openAddModal}>
                + Add Department
              </Button>
            </div>
          ) : processedDepartments.length === 0 ? (
            <div className="text-center py-5 fade-in">
              <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-search text-muted fs-2"></i>
              </div>
              <p className="text-muted mb-0">No departments match your search.</p>
            </div>
          ) : (
            <div className="fade-in">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light text-muted small text-uppercase" style={{ letterSpacing: '0.5px' }}>
                    <tr>
                      <th className="fw-semibold px-3 py-3 rounded-start cursor-pointer user-select-none" onClick={() => requestSort('id')}>
                        ID <SortIcon columnKey="id" />
                      </th>
                      <th className="fw-semibold py-3 cursor-pointer user-select-none" onClick={() => requestSort('code')}>
                        Code <SortIcon columnKey="code" />
                      </th>
                      <th className="fw-semibold py-3 cursor-pointer user-select-none" onClick={() => requestSort('name')}>
                        Department Name <SortIcon columnKey="name" />
                      </th>
                      <th className="fw-semibold py-3 text-end rounded-end px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDepartments.map((dept) => (
                      <tr key={dept.id} className="transition-all hover-bg-light">
                        <td className="px-3" data-label="ID"><span className="text-muted fw-medium">#{dept.id}</span></td>
                        <td data-label="Code"><span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1">{dept.code}</span></td>
                        <td className="fw-medium text-dark" data-label="Department Name">{dept.name}</td>
                        <td className="text-end px-3" data-label="Actions">
                          <button onClick={() => openEditModal(dept)} className="btn btn-sm btn-light text-primary me-2 shadow-sm rounded-circle" style={{ width: '32px', height: '32px', padding: 0 }}>
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button onClick={() => openDeleteModal(dept)} className="btn btn-sm btn-light text-danger shadow-sm rounded-circle" style={{ width: '32px', height: '32px', padding: 0 }}>
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mt-4 gap-3">
                  <small className="text-muted text-center text-md-start">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, processedDepartments.length)} of {processedDepartments.length} entries
                  </small>
                  <ul className="pagination pagination-sm m-0 justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}><i className="bi bi-chevron-left"></i></button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                      <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}><i className="bi bi-chevron-right"></i></button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Add New Department</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleAddSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3 position-relative">
              <Form.Label className="small fw-semibold text-muted">Department Code</Form.Label>
              <Form.Control 
                type="text" 
                required 
                placeholder="e.g. CS"
                value={formData.code} 
                onChange={(e) => handleFormChange(e, 'code')}
                className="bg-light"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a department code.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 position-relative">
              <Form.Label className="small fw-semibold text-muted">Department Name</Form.Label>
              <Form.Control 
                type="text" 
                required 
                placeholder="e.g. Computer Science"
                value={formData.name} 
                onChange={(e) => handleFormChange(e, 'name')}
                className="bg-light"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a department name.
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="light" onClick={handleCloseAddModal}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating...</>
              ) : 'Create Department'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Edit Department</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3 position-relative">
              <Form.Label className="small fw-semibold text-muted">Department Code</Form.Label>
              <Form.Control 
                type="text" 
                required 
                value={formData.code} 
                onChange={(e) => handleFormChange(e, 'code')}
                className="bg-light"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a department code.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 position-relative">
              <Form.Label className="small fw-semibold text-muted">Department Name</Form.Label>
              <Form.Control 
                type="text" 
                required 
                value={formData.name} 
                onChange={(e) => handleFormChange(e, 'name')}
                className="bg-light"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a department name.
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="light" onClick={handleCloseEditModal}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>
              ) : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
        <Modal.Body className="text-center p-4">
          <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
            <i className="bi bi-exclamation-triangle fs-3"></i>
          </div>
          <h5 className="fw-bold mb-2">Delete Department?</h5>
          <p className="text-muted small mb-4">Are you sure you want to delete <strong>{selectedDept?.name}</strong>? This action cannot be undone.</p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="light" className="w-50" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" className="w-50" onClick={handleDelete} disabled={submitting}>
              {submitting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default ManageDepartments;
