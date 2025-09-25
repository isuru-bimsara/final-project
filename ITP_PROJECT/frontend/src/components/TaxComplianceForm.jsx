import React, { useState, useEffect } from 'react';

const TaxComplianceForm = ({ record, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    taxType: '',
    period: '',
    dueDate: '',
    amount: '',
    description: ''
  });

  useEffect(() => {
    if (record) {
      setFormData({
        taxType: record.taxType || '',
        period: record.period || '',
        dueDate: record.dueDate ? new Date(record.dueDate).toISOString().split('T')[0] : '',
        amount: record.amount || '',
        description: record.description || ''
      });
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold mb-4">
          {record ? 'Edit Tax Record' : 'Add Tax Record'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Type</label>
            <select
              name="taxType"
              value={formData.taxType}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select Tax Type</option>
              <option value="Income Tax">Income Tax</option>
              <option value="VAT">VAT</option>
              <option value="NBT">NBT</option>
              <option value="ESC">ESC</option>
              <option value="Stamp Duty">Stamp Duty</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Period (YYYY-MM)</label>
            <input
              type="text"
              name="period"
              value={formData.period}
              onChange={handleChange}
              placeholder="2023-10"
              className="input-field"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              rows="3"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {record ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaxComplianceForm;