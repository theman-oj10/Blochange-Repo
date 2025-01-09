import React, { useState, useContext } from 'react';
import { ethers } from 'ethers';
import { Web3Context } from '@/contexts/Web3Context';
import Modal from '@/components/Modal';

interface Milestone {
  id: number;
  amount: number;
  description: string;
}

interface MilestonesProps {
  milestones: Milestone[];
  currentAmount: number;
  projectId: number;
  goalAmount: number;
}

const Milestones: React.FC<MilestonesProps> = ({ milestones, currentAmount, projectId, goalAmount }) => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [hoverTooltip, setHoverTooltip] = useState({ show: false, position: 0 });
  const [votingStatus, setVotingStatus] = useState<string | null>(null);
  const [fundsStatus, setFundsStatus] = useState<string | null>(null);
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);
  const { contract, signer } = useContext(Web3Context);
  const progress = Math.min((currentAmount / goalAmount) * 100, 100);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = (x / rect.width) * 100;
    setHoverTooltip({ show: true, position });
  };

  // Voting function
  const castVote = async (milestoneId: number, vote: boolean) => {
    try {
      if (!contract) {
        setVotingStatus('Error: Contract or signer not found.');
        return;
      }

      setVotingStatus(`Submitting vote for milestone ${milestoneId}...`);
      const tx = await contract.vote(projectId, milestoneId);
      await tx.wait();
      setVotingStatus(`Vote submitted successfully for milestone ${milestoneId}`);
    } catch (error) {
      console.error('Error casting vote:', error);
      setVotingStatus(`Failed to cast vote for milestone ${milestoneId}`);
    }
  };

  // Function to release funds
  const releaseFunds = async (milestoneId: number) => {
    try {
      if (!contract) {
        setFundsStatus('Error: Contract or signer not found.');
        return;
      }

      setFundsStatus(`Releasing funds for milestone ${milestoneId}...`);
      const tx = await contract.releaseFunds(projectId, milestoneId);
      await tx.wait();
      setFundsStatus(`Funds released successfully for milestone ${milestoneId}`);
    } catch (error) {
      console.error('Error releasing funds:', error);
      setFundsStatus(`Failed to release funds for milestone ${milestoneId}`);
    }
  };

  // Open modal on milestone click
  const handleMilestoneClick = (milestone: Milestone) => {
    setActiveMilestone(milestone);
  };

  return (
    <div className="mt-8 mb-8 w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Milestones</h2>
      <div className="relative pt-2 pb-12">
        <div 
          className="h-3 bg-gray-300 rounded-full w-full cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverTooltip({ show: false, position: 0 })}
        >
          <div
            className="absolute left-0 h-3 bg-blue-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
          {hoverTooltip.show && (
            <div 
              className="absolute bottom-full mb-2 bg-white shadow-lg border border-gray-200 rounded px-3 py-1 text-sm font-semibold text-blue-500 transform -translate-x-1/2"
              style={{ left: `${hoverTooltip.position}%` }}
            >
              ${currentAmount} raised
            </div>
          )}
        </div>
        {milestones && milestones.map((milestone, index) => {
          const position = (milestone.amount / goalAmount) * 100;
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
              <div 
                className="w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-pointer"
                onClick={() => handleMilestoneClick(milestone)} // Click to open modal
              ></div>
              <span className="text-xs font-semibold mt-2 whitespace-nowrap">${milestone.amount}</span>
              <span className="text-xs text-gray-500 hidden sm:inline whitespace-nowrap">Milestone {milestone.id}</span>
              {activeTooltip === milestone.id && (
                <div className="absolute top-full mt-2 bg-white shadow-lg border border-gray-200 rounded px-3 py-2 text-xs text-gray-700 w-36 text-center z-10">
                  {milestone.description}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for vote/release options */}
      {activeMilestone && (
        <Modal onClose={() => setActiveMilestone(null)}>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Milestone {activeMilestone.id}</h3>
            <p>{activeMilestone.description}</p>
            <div className="mt-4 flex flex-col items-center">
              <button
                onClick={() => castVote(activeMilestone.id, true)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded mb-2"
              >
                Vote Yes
              </button>
              <button
                onClick={() => castVote(activeMilestone.id, false)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded mb-2"
              >
                Vote No
              </button>
              <button
                onClick={() => releaseFunds(activeMilestone.id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-4 rounded"
              >
                Release Funds
              </button>
            </div>
          </div>
        </Modal>
      )}

      {votingStatus && <p className="mt-4 text-sm text-blue-600">{votingStatus}</p>}
      {fundsStatus && <p className="mt-4 text-sm text-yellow-600">{fundsStatus}</p>}
    </div>
  );
};

export default Milestones;
