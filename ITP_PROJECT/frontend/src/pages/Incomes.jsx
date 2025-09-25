import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { validateNumber, validateText, validateDate, preventNonNumericInput, preventNumericInput } from '../utils/validation';

const Incomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: '',
    category: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [categories] = useState([
    'Garment Sales',
    'Fabric Sales',
    'Consulting',
    'Export Orders',
    'Domestic Orders',
    'Custom Orders',
    'Wholesale',
    'Retail',
    'Online Sales',
    'Other'
  ]);

  // Get today's date and date from 7 days ago for validation
  const today = new Date().toISOString().split('T')[0];
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const minDate = sevenDaysAgo.toISOString().split('T')[0];

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/incomes');
      setIncomes(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch incomes');
      console.error('Error fetching incomes:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 50) {
      newErrors.title = 'Title cannot exceed 50 characters';
    } else if (!validateText(formData.title)) {
      newErrors.title = 'Title can only contain letters and spaces';
    }

    // Amount validation
    if (!formData.amount || !validateNumber(formData.amount)) {
      newErrors.amount = 'Amount must be a positive number';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (!validateDate(formData.date)) {
      newErrors.date = 'Date cannot be in the future or older than 7 days';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    try {
      const incomeData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      await axios.post('/api/incomes', incomeData);
      toast.success('Income added successfully');
      setShowForm(false);
      setFormData({
        title: '',
        amount: '',
        date: '',
        category: '',
        description: ''
      });
      setErrors({});
      fetchIncomes();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Backend validation errors
        const backendErrors = {};
        error.response.data.errors.forEach(err => {
          if (err.includes('Title')) backendErrors.title = err;
          else if (err.includes('Amount')) backendErrors.amount = err;
          else if (err.includes('Date')) backendErrors.date = err;
          else if (err.includes('Category')) backendErrors.category = err;
          else if (err.includes('Description')) backendErrors.description = err;
        });
        setErrors(backendErrors);
        toast.error('Please fix the form errors');
      } else {
        toast.error('Failed to add income');
        console.error('Error adding income:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income?')) return;
    
    try {
      await axios.delete(`/api/incomes/${id}`);
      toast.success('Income deleted successfully');
      fetchIncomes();
    } catch (error) {
      toast.error('Failed to delete income');
      console.error('Error deleting income:', error);
    }
  };

  const getCategoryTotal = (category) => {
    return incomes
      .filter(income => income.category === category)
      .reduce((sum, income) => sum + income.amount, 0);
  };

  const getTotalIncomes = () => {
    return incomes.reduce((sum, income) => sum + income.amount, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Incomes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Add Income
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">
            Rs {getTotalIncomes().toLocaleString()}
          </p>
        </div>
        
        {/* Top 3 Categories */}
        {categories.slice(0, 3).map(category => {
          const total = getCategoryTotal(category);
          return total > 0 ? (
            <div key={category} className="card">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{category}</h3>
              <p className="text-xl font-bold text-green-600">
                Rs {total.toLocaleString()}
              </p>
            </div>
          ) : null;
        })}
      </div>

      {/* Incomes Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {incomes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No incomes found. Add your first income to get started.
                  </td>
                </tr>
              ) : (
                incomes.map((income) => (
                  <tr key={income._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {income.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Rs {income.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(income.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {income.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {income.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(income._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Income Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add Income</h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setErrors({});
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onKeyDown={preventNumericInput}
                  className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Enter income title"
                  required
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs) *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  onKeyDown={preventNonNumericInput}
                  min="0"
                  step="0.01"
                  className={`input-field ${errors.amount ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                  required
                />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={minDate}
                  max={today}
                  className={`input-field ${errors.date ? 'border-red-500' : ''}`}
                  required
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                <p className="text-xs text-gray-500 mt-1">Select a date within the past 7 days</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`input-field ${errors.category ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                  rows="3"
                  placeholder="Enter income description"
                  required
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/50 characters</p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setErrors({});
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Add Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incomes;