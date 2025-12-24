import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FileUpload from './FileUpload';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { applicationsAPI, programsAPI } from '../api/queries';
import { useSelector } from 'react-redux';

const Apply = () => {
  const { programId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  // Fetch program details
  const { data: programData, isLoading: programLoading } = useQuery({
    queryKey: ['program', programId],
    queryFn: () => programsAPI.fetchProgramById(programId),
    enabled: !!programId
  });

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    education: '',
    statementOfPurpose: ''
  });

  const mutation = useMutation({
    mutationFn: (data) => applicationsAPI.submitApplication(data),
    onSuccess: () => {
      qc.invalidateQueries(['applications']);
      navigate('/dashboard');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    if (!programId) {
      setErrors('Program not selected');
      return;
    }
    if (files.length === 0) {
      setErrors('Please upload at least one document');
      return;
    }

    if (!formData.fullName.trim()) return setErrors('Full name is required');
    if (!formData.email.trim()) return setErrors('Email is required');
    if (!formData.phone.trim()) return setErrors('Phone number is required');

    const payload = {
      ...formData,
      program: programData?.data?.program?.title || '',  // Use program title instead of ID
      documents: files.map(f => ({ name: f.name, mimeType: f.mimeType, data: f.data, size: f.size }))
    };

    mutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Apply to Program</h1>
        <div className="card bg-base-100 p-6">
          {programLoading ? (
            <div className="text-center py-4">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label"><span className="label-text">Program</span></label>
                <input 
                  className="input input-bordered w-full" 
                  value={programData?.data?.program?.title || ''} 
                  readOnly 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label"><span className="label-text">Full Name *</span></label>
                  <input
                    type="text"
                    name="fullName"
                    className="input input-bordered w-full"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="label"><span className="label-text">Email *</span></label>
                  <input
                    type="email"
                    name="email"
                    className="input input-bordered w-full"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="label"><span className="label-text">Phone Number *</span></label>
                  <input
                    type="tel"
                    name="phone"
                    className="input input-bordered w-full"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="label"><span className="label-text">Address</span></label>
                  <input
                    type="text"
                    name="address"
                    className="input input-bordered w-full"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="label"><span className="label-text">Education Background</span></label>
                <textarea
                  name="education"
                  className="textarea textarea-bordered w-full"
                  value={formData.education}
                  onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <label className="label"><span className="label-text">Statement of Purpose</span></label>
                <textarea
                  name="statementOfPurpose"
                  className="textarea textarea-bordered w-full"
                  value={formData.statementOfPurpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, statementOfPurpose: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <label className="label"><span className="label-text">Supporting Documents</span></label>
                <FileUpload onChange={setFiles} maxFiles={5} />
              </div>

              {errors && <div className="alert alert-error">{errors}</div>}
              {mutation.error && (
                <div className="alert alert-error">{mutation.error.message || 'Failed to submit application'}</div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate('/programs')}
                  disabled={mutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Apply;
