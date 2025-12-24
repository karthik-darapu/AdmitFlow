import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="flex justify-center mt-6">
      <div className="btn-group">
        <button className="btn" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>Prev</button>
        {pages.map(p => (
          <button key={p} className={`btn ${p === currentPage ? 'btn-active' : ''}`} onClick={() => onPageChange(p)}>{p}</button>
        ))}
        <button className="btn" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default Pagination;
