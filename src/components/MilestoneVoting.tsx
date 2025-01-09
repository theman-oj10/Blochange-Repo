import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, AlertCircle, X, CheckCircle2 } from 'lucide-react';

const MilestoneVoting = ({ 
  votesFor, 
  votesAgainst,
  totalDonors,
  isVoting,
  isMilestoneReached,
  onVoteFor,
  onVoteAgainst,
  onRequestRevision 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [revisionRequest, setRevisionRequest] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let timeout;
    if (showSuccess) {
      timeout = setTimeout(() => {
        setShowSuccess(false);
        setIsModalOpen(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [showSuccess]);

  const handleRevisionSubmit = () => {
    if (revisionRequest.trim()) {
      console.log('Revision request:', revisionRequest);
      setShowSuccess(true);
      setRevisionRequest('');
      onRequestRevision();
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
      {/* Total Donors Display */}
      <div className="text-center mb-4">
        <span className="text-sm text-gray-600">Total Donors:</span>
        <span className="ml-2 font-semibold text-lg">{totalDonors}</span>
      </div>

      {/* Voting Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onVoteFor}
          disabled={!isMilestoneReached || isVoting}
          className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all
            ${isVoting ? 'bg-gray-100 cursor-wait' :
              isMilestoneReached ? 'hover:bg-green-50 border-green-500 bg-green-50' : 
              'bg-gray-50 border-gray-200 cursor-not-allowed'}`}
        >
          <ThumbsUp 
            className={`w-8 h-8 mb-2 ${isMilestoneReached ? 'text-green-600' : 'text-gray-400'}`}
          />
          <span className={`font-semibold ${isMilestoneReached ? 'text-green-600' : 'text-gray-400'}`}>
            Vote For
          </span>
          <span className={`text-sm mt-2 ${isMilestoneReached ? 'text-green-600' : 'text-gray-400'}`}>
            {votesFor} votes
          </span>
        </button>

        <button
          onClick={onVoteAgainst}
          disabled={!isMilestoneReached || isVoting}
          className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all
            ${isVoting ? 'bg-gray-100 cursor-wait' :
              isMilestoneReached ? 'hover:bg-red-50 border-red-500 bg-red-50' : 
              'bg-gray-50 border-gray-200 cursor-not-allowed'}`}
        >
          <ThumbsDown 
            className={`w-8 h-8 mb-2 ${isMilestoneReached ? 'text-red-600' : 'text-gray-400'}`}
          />
          <span className={`font-semibold ${isMilestoneReached ? 'text-red-600' : 'text-gray-400'}`}>
            Vote Against
          </span>
          <span className={`text-sm mt-2 ${isMilestoneReached ? 'text-red-600' : 'text-gray-400'}`}>
            {votesAgainst} votes
          </span>
        </button>
      </div>

      {/* Revision Request Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={!isMilestoneReached || isVoting}
        className={`w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border
          ${isVoting ? 'bg-gray-100 cursor-wait' :
            isMilestoneReached ? 
            'bg-yellow-50 border-yellow-500 hover:bg-yellow-100 text-yellow-700' : 
            'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'}`}
      >
        <AlertCircle className="w-5 h-5" />
        <span>Request Milestone Revision</span>
      </button>

      {/* Voting Status */}
      {isVoting && (
        <div className="text-center text-sm text-gray-600 animate-pulse">
          Processing vote...
        </div>
      )}

      {/* Milestone Not Reached Message */}
      {!isMilestoneReached && (
        <div className="text-center text-sm text-gray-500 mt-4">
          Voting will be enabled once the milestone amount is reached
        </div>
      )}

      {/* Revision Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative z-50 w-full max-w-md bg-white p-6 rounded-lg shadow-xl border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Request Milestone Revision
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Alert */}
            {showSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <span>Request submitted successfully</span>
              </div>
            )}
            
            {/* Textarea */}
            <textarea
              value={revisionRequest}
              onChange={(e) => setRevisionRequest(e.target.value)}
              placeholder="Please describe your revision request..."
              className="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-700 placeholder-gray-400"
            />
            
            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRevisionSubmit}
                className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-500 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneVoting;