import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

const CreateTestPage = () => {
  const { user } = useApp();
  const [formData, setFormData] = useState({
    batchId: '',
    supplier: '',
    date: new Date().toISOString().split('T')[0],
    userId: user?.id || '',
    userName: user?.email || '',
    laboratoryEmail: ''
  });

 
  const [laboratoryUsers, setLaboratoryUsers] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [showLabDropdown, setShowLabDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch laboratory users
  useEffect(() => {
    const fetchLaboratoryUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://back-cap.onrender.com/api/users');
        const data = await response.json();
        
        if (data.status && data.data) {
          // Filter only laboratory type users
          const labUsers = data.data.filter(user => user.type === 'laboratory');
          setLaboratoryUsers(labUsers);
        }
      } catch (error) {
        console.error('Error fetching laboratory users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaboratoryUsers();
  }, []);

  // Update form data when user context changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        userId: user.id || '',
        userName: user.email || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLabSelection = (labUser) => {
    setSelectedLab(labUser);
    setFormData(prev => ({
      ...prev,
      laboratoryEmail: labUser.email
    }));
    setShowLabDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      const response = await fetch('https://back-cap.onrender.com/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('Test created successfully!');
        // Reset form
        setFormData({
          batchId: '',
          supplier: '',
          date: new Date().toISOString().split('T')[0],
          userId: user?.id || '',
          userName: user?.email || '',
          laboratoryEmail: ''
        });
        setSelectedLab(null);
      } else {
        alert(`Error: ${result.message || 'Failed to create test'}`);
      }
    } catch (error) {
      console.error('Error creating test:', error);
      alert('Error creating test. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-800 mb-2">
            Create New Test
          </h1>
          <p className="text-emerald-600 font-light">
            Submit grain testing information with laboratory assignment
          </p>
        </div>

        {/* Main Form Card */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-8 shadow-2xl border border-white/40 ring-1 ring-gray-200/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Batch Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-light text-gray-700 border-b border-emerald-200 pb-2">
                Batch Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    Batch ID
                  </label>
                  <input
                    type="text"
                    name="batchId"
                    value={formData.batchId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all duration-300 shadow-sm"
                    placeholder="Enter batch ID"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    Supplier
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all duration-300 shadow-sm"
                    placeholder="Enter supplier name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

        
            
            {/* Laboratory Assignment Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-light text-gray-700 border-b border-emerald-200 pb-2">
                Laboratory Assignment
              </h2>
              
              <div className="relative">
                <label className="block text-gray-600 text-sm font-light mb-2">
                  Select Laboratory
                </label>
                <button
                  type="button"
                  onClick={() => setShowLabDropdown(!showLabDropdown)}
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl text-left text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all duration-300 flex items-center justify-between shadow-sm hover:bg-white/80"
                >
                  <span>
                    {selectedLab ? (
                      <span className="flex items-center">
                        <span className="font-medium text-gray-800">{selectedLab.username}</span>
                        <span className="text-emerald-600 ml-2">({selectedLab.organisation})</span>
                      </span>
                    ) : (
                      <span className="text-gray-400">Select a laboratory...</span>
                    )}
                  </span>
                  <svg className={`w-5 h-5 transition-transform text-emerald-600 ${showLabDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showLabDropdown && (
                  <div className="absolute z-10 w-full mt-2 bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-gray-500">Loading laboratories...</div>
                    ) : laboratoryUsers.length > 0 ? (
                      laboratoryUsers.map((lab) => (
                        <button
                          key={lab._id}
                          type="button"
                          onClick={() => handleLabSelection(lab)}
                          className="w-full px-4 py-3 text-left hover:bg-emerald-50/80 transition-colors border-b border-gray-100/60 last:border-b-0 focus:outline-none focus:bg-emerald-50/80"
                        >
                          <div className="text-gray-800 font-medium">{lab.username}</div>
                          <div className="text-emerald-600 text-sm">{lab.email}</div>
                          <div className="text-gray-500 text-xs">{lab.organisation}</div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">No laboratories found</div>
                    )}
                  </div>
                )}
              </div>

              {selectedLab && (
                <div className="mt-4 p-4 bg-emerald-50/60 backdrop-blur-sm border border-emerald-200/60 rounded-xl shadow-sm">
                  <h4 className="text-gray-700 font-medium mb-2">Selected Laboratory:</h4>
                  <div className="text-gray-600 text-sm space-y-1">
                    <div><strong>Email:</strong> <span className="text-emerald-700">{selectedLab.email}</span></div>
                    <div><strong>Organization:</strong> <span className="text-emerald-700">{selectedLab.organisation}</span></div>
                    
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitLoading || !selectedLab}
                className={`w-full py-4 px-3 rounded-xl font-semibold text-white text-lg transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/20 ${
                  submitLoading || !selectedLab
                    ? 'bg-gray-400/60 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 shadow-emerald-200/50'
                }`}
              >
                {submitLoading ? 'Submitting...' : 'Create Test'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTestPage;