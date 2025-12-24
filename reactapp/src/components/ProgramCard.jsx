import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const ProgramCard = ({ program }) => {
  const user = useSelector((state) => state.auth.user);
  const isStudent = user?.role === 'student';

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <motion.div 
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="card-body">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="card-title text-xl">{program.title}</h2>
          <div className="badge badge-primary">{program.duration}</div>
        </div>

        {/* Description */}
        <p className="text-base-content/70 mb-4 line-clamp-3">
          {program.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {/* Deadline */}
          <div className="flex items-center gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Application Deadline:</span>
            <span className="font-medium">{formatDate(program.deadline)}</span>
          </div>

          {/* Fees */}
          <div className="flex items-center gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Program Fee:</span>
            <span className="font-medium">{formatCurrency(program.fees)}</span>
          </div>

          {/* Available Seats */}
          <div className="flex items-center gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Available Seats:</span>
            <span className="font-medium">{program.availableSeats}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-actions justify-end mt-auto">
          <Link
            to={`/programs/${program._id}`}
            className="btn btn-ghost btn-sm"
          >
            Learn More
          </Link>
          {isStudent && (
            <Link
              to={`/apply/${program._id}`}
              className="btn btn-primary btn-sm"
            >
              Apply Now
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProgramCard;