import React, { useState, useContext, useEffect } from 'react';
import { Web3Context } from '@/contexts/Web3Context';
import Posts from '@/components/Posts';
import MilestoneVoting from '@/components/MilestoneVoting';

interface Milestone {
  id: number;
  amount: number;
  description: string;
  workDone: string;
  proofImages: string[];
  votesFor: number;
  votesAgainst: number;
  posts: any;
}

interface MilestonesProps {
  milestones: Milestone[];
  currentAmount: number;
  projectId: number;
  goalAmount: number;
  onVoteSuccess?: (milestoneId: number) => void;
  conversionRate?: number;
  showUSD?: boolean;
}

const Milestones: React.FC<MilestonesProps> = ({ 
  milestones, 
  currentAmount, 
  projectId, 
  goalAmount,
  onVoteSuccess,
  conversionRate = 1,
  showUSD = false
}) => {
  const { contract, account } = useContext(Web3Context);
  const [hoverTooltip, setHoverTooltip] = useState({ show: false, position: 0 });
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(milestones[0]?.id);
  const [votingStatus, setVotingStatus] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  
  const progress = Math.min((currentAmount / goalAmount) * 100, 100);

  const selectedMilestone = milestones.find(m => m.id === selectedMilestoneId);
  const formatAmount = (amount: number) => {
    if (showUSD) {
      const usdAmount = amount * conversionRate;
      return `$${usdAmount.toLocaleString()}`;
    }
    return `${amount.toLocaleString()} MATIC`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = (x / rect.width) * 100;
    setHoverTooltip({ show: true, position });
  };

  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestoneId(milestone.id);
  };

  const isMilestoneReached = (milestoneAmount: number) => {
    return currentAmount >= milestoneAmount;
  };

  const castVote = async (milestoneId: number, vote: boolean) => {
    if (isVoting) return;
    
    try {
      setIsVoting(true);
      if (!contract) {
        throw new Error('Contract or signer not found.');
      }

      setVotingStatus(`Submitting vote for milestone ${milestoneId}...`);
      const tx = await contract.vote(projectId, milestoneId);
      await tx.wait();
      
      setVotingStatus(`Vote submitted successfully for milestone ${milestoneId}`);
      
      if (onVoteSuccess) {
        onVoteSuccess(milestoneId);
      }

      setTimeout(() => {
        setVotingStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Error casting vote:', error);
      setVotingStatus(`Failed to cast vote for milestone ${milestoneId}`);
    } finally {
      setIsVoting(false);
    }
  };

  useEffect(() => {
    if (selectedMilestoneId && !milestones.find(m => m.id === selectedMilestoneId)) {
      setSelectedMilestoneId(milestones[0]?.id);
    }
  }, [milestones, selectedMilestoneId]);

  return (
    <div className="mt-8 mb-8 w-full space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Milestones</h2>

        {/* Progress Bar */}
        <div className="relative pt-2 pb-12">
          <div 
            className="h-3 bg-gray-300 rounded-full w-full cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverTooltip({ show: false, position: 0 })}
          >
            <div
              className="absolute left-0 h-3 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
            {hoverTooltip.show && (
              <div 
                className="absolute bottom-full mb-2 bg-white shadow-lg border border-gray-200 rounded px-3 py-1 text-sm font-semibold text-blue-500 transform -translate-x-1/2"
                style={{ left: `${hoverTooltip.position}%` }}
              >
                {formatAmount(currentAmount)} raised
              </div>
            )}
          </div>

          {milestones.map((milestone) => {
            const position = (milestone.amount / goalAmount) * 100;
            const isActive = selectedMilestoneId === milestone.id;
            const isReached = isMilestoneReached(milestone.amount);

            return (
            <div 
              key={milestone.id} 
              className="absolute flex flex-col items-center"
              style={{ 
                left: `${position}%`, 
                transform: 'translateX(-50%)',
                top: '3px'
              }}
            >
              <button 
                className={`w-5 h-5 rounded-full cursor-pointer transition-all duration-300 
                  ${isActive ? 'ring-4 ring-blue-200' : ''}
                  ${isReached ? 'bg-blue-500 border-2 border-blue-600' : 'bg-white border-2 border-blue-500'}
                  hover:scale-110`}
                onClick={() => handleMilestoneClick(milestone)}
                aria-label={`Milestone ${milestone.id}`}
              ></button>
              <span className="text-xs font-semibold mt-2 whitespace-nowrap">
                {showUSD 
                  ? `$${(milestone.amount * conversionRate).toLocaleString()} USD`
                  : `${milestone.amount.toLocaleString()} MATIC`
                }
              </span>
              <span className="text-xs text-gray-500 hidden sm:inline whitespace-nowrap">
                Milestone {milestone.id}
              </span>
            </div>
          );
        })}
        </div>
      </div>

      {/* Milestone Details Section */}
      {selectedMilestone && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-800">
                Milestone {selectedMilestone.id}
                <p className="text-gray-600 mt-1">
                  {formatAmount(selectedMilestone.amount)}
                </p>
              </h3>
            </div>

            {/* Content Grid: Description on left, Voting on right */}
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column - Description */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedMilestone.description}</p>
                </div>

                {/* Work Done Section */}
                <div className="space-y-6">
                  <h4 className="font-semibold text-gray-700">Work Done</h4>
                  <textarea
                    className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg resize-none bg-gray-50"
                    value={selectedMilestone.workDone || 'No work reported yet'}
                    readOnly
                  />

                  {selectedMilestone.proofImages && selectedMilestone.proofImages.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">Proof Images</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedMilestone.proofImages.map((image, index) => (
                          <div key={index} className="relative aspect-video">
                            <img
                              src={image}
                              alt={`Proof ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg shadow-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Voting */}
              <div>
                <MilestoneVoting
                  votesFor={selectedMilestone.votesFor}
                  votesAgainst={selectedMilestone.votesAgainst}
                  totalDonors={selectedMilestone.totalDonors || 0}
                  isVoting={isVoting}
                  isMilestoneReached={isMilestoneReached(selectedMilestone.amount)}
                  onVoteFor={() => castVote(selectedMilestone.id, true)}
                  onVoteAgainst={() => castVote(selectedMilestone.id, false)}
                  onRequestRevision={() => {
                    console.log('Request revision for milestone:', selectedMilestone.id);
                  }}
                />
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Discussion Section */}
            <div>
              <Posts 
                key={selectedMilestone.id} 
                milestoneId={selectedMilestone.id} 
                userId={account} 
                initialPosts={selectedMilestone.posts}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Milestones;