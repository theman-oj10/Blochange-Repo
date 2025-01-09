import React, { useState } from 'react';

interface Milestone {
  id: number;
  amount: number;
  description: string;
}

interface MilestonesProps {
  milestones: Milestone[];
  currentAmount: number;
}

const Milestones: React.FC<MilestonesProps> = ({ milestones, currentAmount }) => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [hoverTooltip, setHoverTooltip] = useState({ show: false, position: 0 });

  const totalAmount = milestones[milestones.length - 1].amount;
  const progress = Math.min((currentAmount / totalAmount) * 100, 100);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = (x / rect.width) * 100;
    setHoverTooltip({ show: true, position });
  };

  return (
    <div className="mt-8 mb-8 w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Milestones</h2>
      <div className="relative pt-2 pb-12"> {/* Adjusted padding */}
        <div 
          className="h-2 bg-gray-200 rounded-full w-full cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverTooltip({ show: false, position: 0 })}
        >
          <div
            className="absolute left-0 h-2 bg-green-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
          {hoverTooltip.show && (
            <div 
              className="absolute bottom-full mb-2 bg-white border border-gray-200 rounded px-2 py-1 text-sm font-semibold text-green-500 transform -translate-x-1/2"
              style={{ left: `${hoverTooltip.position}%` }}
            >
              ${currentAmount} raised
            </div>
          )}
        </div>
        {milestones.map((milestone, index) => {
          const position = (milestone.amount / totalAmount) * 100;
          return (
            <div 
              key={milestone.id} 
              className="absolute flex flex-col items-center"
              style={{ 
                left: `${position}%`, 
                transform: 'translateX(-50%)',
                top: '3px' // I don't think this should be hardcoded
              }}
            >
              <div 
                className="w-4 h-4 bg-white border-2 border-green-500 rounded-full cursor-pointer"
                onMouseEnter={() => setActiveTooltip(milestone.id)}
                onMouseLeave={() => setActiveTooltip(null)}
              ></div>
              <span className="text-xs font-semibold mt-2 whitespace-nowrap">${milestone.amount}</span>
              <span className="text-xs text-gray-500 hidden sm:inline whitespace-nowrap">Milestone {index}</span>
              {activeTooltip === milestone.id && (
                <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 w-32 text-center z-10">
                  {milestone.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Milestones;