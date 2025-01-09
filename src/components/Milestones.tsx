import React, { useState } from 'react';

interface Milestone {
  id: number;
  amount: number;
  description: string;
  workDone: string;
  proofImages: string[];
  votesFor: number;
  votesAgainst: number;
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

  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);
  const progress = Math.min((currentAmount / goalAmount) * 100, 100);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = (x / rect.width) * 100;
    setHoverTooltip({ show: true, position });
  };

  const handleMilestoneClick = (milestone: Milestone) => {
    setActiveMilestone(milestone);
  };

  return (
    <div className="mt-8 mb-8 w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Milestones</h2>

      {/* Progress Bar */}
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
          let amt = 0;
          for (let i = 0; i <= index; i++) {
            amt += milestones[i].amount;
          }
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
                onClick={() => handleMilestoneClick(milestone)}
              ></div>
              <span className="text-xs font-semibold mt-2 whitespace-nowrap">${milestone.amount}</span>
              <span className="text-xs text-gray-500 hidden sm:inline whitespace-nowrap">Milestone {milestone.id}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Milestones;
