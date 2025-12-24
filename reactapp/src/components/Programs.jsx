import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { programsAPI } from '../api/queries';
import ProgramCard from './ProgramCard';
import { motion } from 'framer-motion';

const Programs = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['programs', page, debouncedSearch],
    queryFn: () => programsAPI.fetchPrograms({ page, search: debouncedSearch }),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    cacheTime: 0, // Disable caching
    staleTime: 0  // Consider data stale immediately
  });

  // Debounce search input
  const handleSearch = (e) => {
    setSearch(e.target.value);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      setDebouncedSearch(e.target.value);
      setPage(1);
    }, 500);
  };

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

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Available Programs
          </motion.h1>
          <motion.p 
            className="text-base-content/60 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore our wide range of educational programs and find the perfect fit for your future.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="form-control w-full max-w-md">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search programs..."
                className="input input-bordered w-full"
                value={search}
                onChange={handleSearch}
              />
              <button className="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="alert alert-error max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Failed to load programs. Please try again later.</span>
          </div>
        )}

        {/* Programs Grid */}
        {!isLoading && !isError && data?.data?.programs && (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {data.data.programs.map((program) => (
                <motion.div key={program._id} variants={item}>
                  <ProgramCard program={program} />
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {data.data.programs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-base-content/40 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Programs Found</h3>
                <p className="text-base-content/60">
                  {search ? 'Try different search terms or' : 'Please check back later or'}{' '}
                  <button 
                    onClick={() => {
                      setSearch('');
                      setDebouncedSearch('');
                      setPage(1);
                    }}
                    className="link link-primary"
                  >
                    view all programs
                  </button>
                </p>
              </div>
            )}

            {/* Pagination */}
            {data.data.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="join">
                  <button
                    className="join-item btn"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    «
                  </button>
                  {[...Array(data.data.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      className={`join-item btn ${page === i + 1 ? 'btn-active' : ''}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="join-item btn"
                    onClick={() => setPage((p) => Math.min(data.data.totalPages, p + 1))}
                    disabled={page === data.data.totalPages}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Programs;