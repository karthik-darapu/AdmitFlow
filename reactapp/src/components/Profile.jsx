import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { applicationsAPI } from '../api/queries';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  const { data, isLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: () => applicationsAPI.fetchApplications({ page: 1, status: '', program: '' }),
    enabled: !!user
  });

  const apps = data?.data?.applications || [];

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        {user ? (
          <div className="space-y-4">
            <div className="card p-6 bg-base-100">
              <p className="font-medium">Name: {user.name}</p>
              <p className="text-sm text-base-content/60">Email: {user.email}</p>
              <p className="text-sm text-base-content/60">Role: {user.role}</p>
            </div>

            <div className="card p-6 bg-base-100">
              <h2 className="font-semibold">Your Applications</h2>
              {isLoading ? (
                <div className="py-4"><span className="loading loading-spinner"></span></div>
              ) : (
                <div className="mt-3 space-y-2">
                  <div className="text-sm text-base-content/60">Total applications found: {apps.length}</div>
                  {apps.slice(0,5).map(a => (
                    <div key={a._id} className="p-3 bg-base-200 rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">{a.program}</div>
                        <div className="text-sm text-base-content/60">{new Date(a.submittedAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-sm"><span className="badge badge-ghost">{a.status}</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-base-content/60">Not logged in.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
