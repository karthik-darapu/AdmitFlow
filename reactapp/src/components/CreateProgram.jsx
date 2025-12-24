import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { programsAPI } from '../api/queries';
import { useNavigate } from 'react-router-dom';

const CreateProgram = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eligibility: '',
    duration: '',
    totalSeats: '',
    fees: '',
    deadline: ''
  });
  const [errors, setErrors] = useState(null);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => programsAPI.createProgram(data),
    onSuccess: async () => {
      // Invalidate and wait for refetch
      await qc.invalidateQueries(['programs']);
      // Then navigate
      navigate('/programs');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(null);
    
    // Validate required fields
    if (!formData.title.trim()) return setErrors('Title is required');
    if (!formData.description.trim()) return setErrors('Description is required');
    if (!formData.eligibility.trim()) return setErrors('Eligibility criteria is required');
    if (!formData.deadline) return setErrors('Application deadline is required');

    // Convert string inputs to numbers where needed
    const payload = {
      ...formData,
      totalSeats: formData.totalSeats ? parseInt(formData.totalSeats, 10) : undefined,
      fees: formData.fees ? parseInt(formData.fees, 10) : undefined,
      // Ensure deadline is sent as an ISO string
      deadline: new Date(formData.deadline).toISOString()
    };

    mutation.mutate(payload);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Create Program</h1>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <p className="text-sm text-base-content/60 mb-4">Create a new program by filling out the details below. Fields marked with * are required.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Title *</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="input input-bordered w-full"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter program title"
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Description *</span>
                </label>
                <textarea
                  name="description"
                  className="textarea textarea-bordered w-full h-24"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter program description"
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Eligibility Criteria *</span>
                </label>
                <textarea
                  name="eligibility"
                  className="textarea textarea-bordered w-full"
                  value={formData.eligibility}
                  onChange={handleChange}
                  placeholder="Enter eligibility requirements"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Duration</span>
                  </label>
                  <input
                    type="text"
                    name="duration"
                    className="input input-bordered w-full"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g., 2 years"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Total Seats</span>
                  </label>
                  <input
                    type="number"
                    name="totalSeats"
                    className="input input-bordered w-full"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    placeholder="Enter total available seats"
                    min="1"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Fees</span>
                  </label>
                  <input
                    type="number"
                    name="fees"
                    className="input input-bordered w-full"
                    value={formData.fees}
                    onChange={handleChange}
                    placeholder="Enter program fees"
                    min="0"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Application Deadline *</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="deadline"
                    className="input input-bordered w-full"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {(errors || mutation.error) && (
                <div className="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>{errors || mutation.error?.message || 'An error occurred'}</span>
                </div>
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
                  {mutation.isLoading ? 'Creating...' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProgram;