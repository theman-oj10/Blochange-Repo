import React from 'react';
import { ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';

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
        onClick={onRequestRevision}
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
    </div>
  );
};

export default MilestoneVoting;