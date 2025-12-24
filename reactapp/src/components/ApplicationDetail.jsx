import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { applicationsAPI } from '../api/queries';
import DocumentViewer from './DocumentViewer';
import StatusBadge from './StatusBadge';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const user = useSelector(state => state.auth.user);
  const isAdmin = user?.role === 'admin';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationsAPI.fetchApplicationById(id),
    onSuccess: (data) => {
      console.log('Application Data:', data?.data?.application);
    }
  });

  const mutation = useMutation({
    mutationFn: ({ status }) => applicationsAPI.updateApplicationStatus({ id, data: { status } }),
    onSuccess: () => {
      // Invalidate all related queries to update UI everywhere
      qc.invalidateQueries(['applications']);
      qc.invalidateQueries(['application']);
      qc.invalidateQueries(['applicationStats']);
    }
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center">Failed to load application.</div>;

  const app = data?.data?.application || {};

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-base-content">{app.fullName}</h2>
                <div className="text-sm text-base-content/60">{app.email}</div>
                <div className="mt-2 text-base-content">Program: <span className="font-medium">{app.program}</span></div>
                <div className="mt-1 text-base-content/70">Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleString() : ''}</div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 mb-2">
                  <StatusBadge status={app.status} />
                  {app.reviewedAt && (
                    <span className="text-sm text-base-content/60">
                      Updated: {new Date(app.reviewedAt).toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="mt-2 space-x-2">
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </button>
                  {isAdmin && ['submitted', 'under review'].includes(app.status) && (
                    <>
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => mutation.mutate({ status: 'accepted' })}
                        disabled={mutation.isLoading}
                      >
                        {mutation.isLoading ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          'Accept'
                        )}
                      </button>
                      <button 
                        className="btn btn-sm btn-error"
                        onClick={() => mutation.mutate({ status: 'rejected' })}
                        disabled={mutation.isLoading}
                      >
                        {mutation.isLoading ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          'Reject'
                        )}
                      </button>
                    </>
                  )}
                </div>
                {mutation.error && (
                  <div className="mt-2 p-2 bg-error/10 text-error rounded-lg text-sm">
                    {mutation.error.message || 'Failed to update status'}
                  </div>
                )}
                {!isAdmin && ['accepted', 'rejected'].includes(app.status) && (
                  <div className="mt-4 p-3 rounded-lg bg-base-200">
                    <p className="font-medium">
                      {app.status === 'accepted' ? 'Congratulations!' : 'Application Status Update'}
                    </p>
                    <p className="text-sm text-base-content/70 mt-1">
                      {app.status === 'accepted'
                        ? 'Your application has been accepted. We will contact you with further details.'
                        : 'Unfortunately, your application was not successful at this time. Thank you for your interest.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="divider" />

            <h3 className="font-semibold mb-4 text-base-content">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-sm text-base-content/60">Full Name</div>
                <div className="text-base-content font-medium">{app.fullName}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-base-content/60">Email</div>
                <div className="text-base-content font-medium">{app.email}</div>
              </div>
              {app.phone && (
                <div className="space-y-1">
                  <div className="text-sm text-base-content/60">Phone</div>
                  <div className="text-base-content font-medium">{app.phone}</div>
                </div>
              )}
              {app.address && (
                <div className="space-y-1">
                  <div className="text-sm text-base-content/60">Address</div>
                  <div className="text-base-content font-medium">{app.address}</div>
                </div>
              )}
              {app.education && (
                <div className="space-y-1 col-span-2">
                  <div className="text-sm text-base-content/60">Education</div>
                  <div className="text-base-content font-medium">{app.education}</div>
                </div>
              )}
            </div>

            <div className="divider" />
            <h3 className="font-semibold mb-4 text-base-content">Documents</h3>
            <div className="space-y-4">
              {app.documents?.length > 0 ? (
                <DocumentViewer documents={app.documents} />
              ) : (
                <div className="text-sm text-base-content/60 p-4 bg-base-200 rounded-lg text-center">
                  No documents uploaded with this application.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
