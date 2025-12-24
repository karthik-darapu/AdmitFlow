import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { applicationsAPI, programsAPI } from '../api/queries';
import Pagination from './Pagination';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';

const Applications = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [program, setProgram] = useState('');
  const navigate = useNavigate();

  const { data: programsData } = useQuery({ queryKey: ['programs', 1, ''], queryFn: () => programsAPI.fetchPrograms({ page: 1, search: '' }) });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['applications', page, status, program],
    queryFn: () => applicationsAPI.fetchApplications({ page, status, program })
  });

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Applications</h1>
          <div className="flex gap-2">
            <select className="select select-bordered" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under review">Under Review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <select className="select select-bordered" value={program} onChange={(e) => setProgram(e.target.value)}>
              <option value="">All Programs</option>
              {programsData?.data?.programs.map(p => (
                <option key={p._id} value={p.title}>{p.title}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && <div className="text-center py-12"><span className="loading loading-spinner loading-lg"></span></div>}
        {isError && <div className="alert alert-error">Failed to load applications.</div>}

        {!isLoading && !isError && (
          <>
            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Program</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.applications.map(app => (
                    <tr key={app._id} className="hover">
                      <td>
                        <div className="font-medium">{app.fullName}</div>
                        <div className="text-sm text-base-content/60">{app.email}</div>
                      </td>
                      <td>{app.program}</td>
                      <td>{new Date(app.submittedAt).toLocaleString()}</td>
                      <td><StatusBadge status={app.status} /></td>
                      <td><button className="btn btn-sm btn-primary" onClick={() => navigate(`/applications/${app._id}`)}>View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination currentPage={data?.data?.currentPage || 1} totalPages={data?.data?.totalPages || 1} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default Applications;
