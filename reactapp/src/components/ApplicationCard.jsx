import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { motion } from 'framer-motion';

const ApplicationCard = ({ application }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div 
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="card-body">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-4">
          <h2 className="card-title text-lg text-base-content">{application.program}</h2>
          <StatusBadge status={application.status} />
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {/* Submission Date */}
          <div className="flex items-center gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-base-content/70">Submitted:</span>
            <span className="font-medium text-base-content">{formatDate(application.submittedAt)}</span>
          </div>

          {/* Documents Count */}
          <div className="flex items-center gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-base-content/70">Documents:</span>
            <span className="font-medium text-base-content">{application.documents.length}</span>
          </div>

          {/* Review Date if reviewed */}
          {application.reviewedAt && (
            <div className="flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-base-content/70">Reviewed:</span>
              <span className="font-medium text-base-content">{formatDate(application.reviewedAt)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="card-actions justify-end mt-auto">
          <Link
            to={`/applications/${application._id}`}
            className="btn btn-primary btn-sm"
          >
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationCard;