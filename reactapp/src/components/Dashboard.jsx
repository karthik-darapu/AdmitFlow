import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { applicationsAPI } from '../api/queries';
import ApplicationCard from './ApplicationCard';
import StatusBadge from './StatusBadge';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  // Student Dashboard Query
  const studentQuery = useQuery({
    queryKey: ['applications', 1],
    queryFn: () => applicationsAPI.fetchApplications({ page: 1 }),
    enabled: !isAdmin
  });

  // Admin Dashboard Queries
  const statsQuery = useQuery({
    queryKey: ['applicationStats'],
    queryFn: applicationsAPI.fetchApplicationStats,
    enabled: isAdmin
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-base-200 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Welcome Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              Welcome, Admin 
            </h1>
            <p className="text-base-content/60">
              Manage applications and programs from your dashboard.
            </p>
          </motion.div>

          {/* Stats Cards */}
          {statsQuery.data && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              <motion.div variants={item} className="stats shadow bg-opacity-20 backdrop-blur-lg rounded-xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1">
                <div className="stat">
                  <div className="stat-figure text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="stat-title font-medium text-blue-400">Total Applications</div>
                  <div className="stat-value text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                    {statsQuery.data.data.totalApplications}
                  </div>
                </div>
              </motion.div>

              <motion.div variants={item} className="stats shadow bg-opacity-20 backdrop-blur-lg rounded-xl border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1">
                <div className="stat">
                  <div className="stat-figure text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="stat-title font-medium text-cyan-400">Under Review</div>
                  <div className="stat-value text-cyan-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    {statsQuery.data.data.byStatus['under review'] || 0}
                  </div>
                </div>
              </motion.div>

              <motion.div variants={item} className="stats shadow bg-opacity-20 backdrop-blur-lg rounded-xl border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1">
                <div className="stat">
                  <div className="stat-figure text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="stat-title font-medium text-emerald-400">Accepted</div>
                  <div className="stat-value text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                    {statsQuery.data.data.byStatus.accepted || 0}
                  </div>
                </div>
              </motion.div>

              <motion.div variants={item} className="stats shadow bg-opacity-20 backdrop-blur-lg rounded-xl border border-red-500/30 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1">
                <div className="stat">
                  <div className="stat-figure text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="stat-title font-medium text-red-400">Rejected</div>
                  <div className="stat-value text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    {statsQuery.data.data.byStatus.rejected || 0}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          >
            <motion.div variants={item} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">Recent Applications</h2>
                {statsQuery.data?.data.recentApplications.map((app) => (
                  <div key={app._id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{app.userId.name}</p>
                      <p className="text-sm text-base-content/60">{app.program}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
                <div className="card-actions justify-end mt-4">
                  <Link to="/applications" className="btn btn-primary">
                    View All Applications
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">Program Statistics</h2>
                {statsQuery.data?.data.byProgram.map((prog) => (
                  <div key={prog._id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="font-medium">{prog._id}</span>
                    <span className="badge badge-primary">{prog.count} applications</span>
                  </div>
                ))}
                <div className="card-actions justify-end mt-4">
                  <Link to="/programs/create" className="btn btn-primary">
                    Create New Program
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Student Dashboard
  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Welcome Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-4">
            Welcome, {user.name}
          </h1>
          <p className="text-base-content/60">
            Track your applications and explore new programs.
          </p>
        </motion.div>

        {/* Applications Section */}
        {studentQuery.isLoading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : studentQuery.isError ? (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Failed to load your applications. Please try again later.</span>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            {studentQuery.data?.data.applications.length === 0 ? (
              <motion.div
                variants={item}
                className="card bg-base-100 shadow-xl"
              >
                <div className="card-body text-center py-12">
                  <h2 className="card-title justify-center text-2xl mb-4">
                    No Applications Yet
                  </h2>
                  <p className="text-base-content/60 mb-6">
                    Start your educational journey by applying to one of our programs.
                  </p>
                  <div className="card-actions justify-center">
                    <Link to="/programs" className="btn btn-primary btn-lg">
                      Explore Programs
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentQuery.data.data.applications.map((application) => (
                  <motion.div key={application._id} variants={item}>
                    <ApplicationCard application={application} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;