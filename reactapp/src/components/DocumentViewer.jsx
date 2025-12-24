import React, { useState } from 'react';

const DocumentViewer = ({ documents = [] }) => {
  const [downloadError, setDownloadError] = useState(null);
  
  const downloadFile = async (doc) => {
    try {
      setDownloadError(null);
      
      // Safety check for the document data
      if (!doc.data) {
        throw new Error('Document data is missing');
      }

      // Handle base64 data
      const byteCharacters = atob(doc.data.split(',').pop() || doc.data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: doc.mimeType || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      
      // Create and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name || 'document';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error('Failed to download file:', err);
      setDownloadError('Failed to download file. Please try again.');
    }
  };

  const formatSize = (size) => {
    if (!size) return '0 B';
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
  };

  return (
    <div className="space-y-4">
      {documents.map((doc, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 bg-base-200/50 rounded-lg hover:bg-base-300/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-base-content">{doc.name}</div>
              <div className="text-sm text-base-content/60">
                {doc.mimeType || 'Unknown type'} • {formatSize(doc.size || 0)}
              </div>
            </div>
          </div>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => downloadFile(doc)}
          >
            Download
          </button>
        </div>
      ))}
      
      {downloadError && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{downloadError}</span>
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;
